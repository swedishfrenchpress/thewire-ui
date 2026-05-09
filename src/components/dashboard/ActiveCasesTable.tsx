"use client";

import {
  Box,
  HStack,
  Link as ChakraLink,
  Table,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { casesStore } from "@/lib/cases-store";
import { topTriage, TRIAGE_RANK, type Row } from "@/lib/triage";
import type { Rating } from "@/lib/types";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatFiled(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < minute) return "NOW";
  if (diffMs < hour) return `${Math.round(diffMs / minute)}M`;
  if (diffMs < day) return `${Math.round(diffMs / hour)}H`;
  if (diffMs < 7 * day) return `${Math.round(diffMs / day)}D`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function topTopic(row: Row): { title: string; triage: Rating } | null {
  const topics = row.summary?.topics ?? [];
  if (topics.length === 0) return null;
  return [...topics].sort(
    (a, b) => TRIAGE_RANK[a.triage] - TRIAGE_RANK[b.triage],
  )[0];
}

export function ActiveCasesTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <Box>
      <SectionHeading count={rows.length} />
      <Table.Root size="md" interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="112px">Triage</Table.ColumnHeader>
            <Table.ColumnHeader>Case</Table.ColumnHeader>
            <Table.ColumnHeader>Top topic</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end" w="96px">
              Docs
            </Table.ColumnHeader>
            <Table.ColumnHeader w="80px">Filed</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <CaseRow key={row.entry.caseId} row={row} />
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

function SectionHeading({ count }: { count: number }) {
  return (
    <HStack gap="3" align="baseline" pb="3">
      <Text
        as="h2"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        fontWeight="500"
        color="fg"
      >
        Active cases
      </Text>
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        fontWeight="500"
        color="fg.muted"
        fontVariantNumeric="tabular-nums"
      >
        {count}
      </Text>
    </HStack>
  );
}

function CaseRow({ row }: { row: Row }) {
  const router = useRouter();
  const { entry, summary, isLoading, isError } = row;

  const isProcessing = isLoading || summary?.status === "processing";
  const isFailed = isError || summary?.status === "failed";
  const isComplete = summary?.status === "complete";

  const navigate = () => {
    casesStore.touchViewed(entry.caseId);
    router.push(`/cases/${entry.caseId}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  const topic = topTopic(row);

  return (
    <Table.Row
      role="link"
      tabIndex={0}
      onClick={navigate}
      onKeyDown={onKeyDown}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
      aria-label={`Open case ${entry.displayName}`}
    >
      <Table.Cell>
        {isFailed ? (
          <StatusBadge status="failed" />
        ) : isProcessing ? (
          <StatusBadge status="processing" />
        ) : isComplete && summary ? (
          <TriageBadge level={topTriage(summary.topics)} />
        ) : (
          <TriageBadge level={null} />
        )}
      </Table.Cell>

      <Table.Cell>
        <HStack gap="2" align="center" minW="0">
          {entry.pinned && <PinGlyph />}
          <ChakraLink
            asChild
            fontFamily="mono"
            fontSize="13px"
            lineHeight="15px"
            letterSpacing="wide"
            textTransform="uppercase"
            fontWeight="500"
            color="fg"
            textDecoration="none"
            _hover={{ color: "fg.muted" }}
            onClick={(e) => e.stopPropagation()}
          >
            <NextLink href={`/cases/${entry.caseId}`}>
              {entry.displayName}
            </NextLink>
          </ChakraLink>
        </HStack>
      </Table.Cell>

      <Table.Cell>
        <Text
          fontFamily="body"
          fontSize="14px"
          lineHeight="18px"
          color="fg.muted"
          truncate
        >
          {topic?.title ?? ""}
        </Text>
      </Table.Cell>

      <Table.Cell textAlign="end">
        <Text
          fontFamily="mono"
          fontSize="12px"
          lineHeight="14px"
          letterSpacing="wide"
          color="fg"
          fontVariantNumeric="tabular-nums"
        >
          {summary?.document_count ?? "—"}
        </Text>
      </Table.Cell>

      <Table.Cell>
        <Text
          fontFamily="mono"
          fontSize="11px"
          lineHeight="13px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          suppressHydrationWarning
        >
          {formatFiled(entry.createdAt)}
        </Text>
      </Table.Cell>
    </Table.Row>
  );
}

function PinGlyph() {
  return (
    <Box as="span" color="fg.muted" aria-hidden display="inline-flex">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11 3h2v6h4l-2 4h-2v8h-2v-8H9l-2-4h4z" />
      </svg>
    </Box>
  );
}
