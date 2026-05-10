"use client";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { casesStore } from "@/lib/cases-store";
import { corroborationScore, topTriage, TRIAGE_RANK, type Row } from "@/lib/triage";
import type { Rating, TopicSummary } from "@/lib/types";

const MONTHS_FULL = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function formatDateline(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function topTopic(topics: TopicSummary[]): TopicSummary | null {
  if (topics.length === 0) return null;
  return [...topics].sort(
    (a, b) => TRIAGE_RANK[a.triage] - TRIAGE_RANK[b.triage],
  )[0];
}

function descriptionFor(row: Row): string {
  const { summary, isError } = row;
  if (isError || summary?.status === "failed") return "Analysis failed.";
  if (!summary || summary.status === "processing") return "Awaiting analysis.";
  if (summary.status === "complete") {
    const top = topTopic(summary.topics);
    if (top?.description) return top.description;
    return "No topics inferred for this case.";
  }
  return "Awaiting analysis.";
}

function titleFor(row: Row): string {
  const { summary } = row;
  const top = summary ? topTopic(summary.topics) : null;
  return top?.title ?? row.entry.displayName;
}

export function ActiveCases({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <Stack gap="0" w="full">
      <Eyebrow pl="0" pb="3">
        Active cases · {rows.length}
      </Eyebrow>
      <Stack gap="0" borderTopWidth="1px" borderColor="border.muted">
        {rows.map((row) => (
          <CaseRow key={row.entry.caseId} row={row} />
        ))}
      </Stack>
    </Stack>
  );
}

function CaseRow({ row }: { row: Row }) {
  const router = useRouter();
  const { entry, summary } = row;

  const navigate = () => {
    casesStore.touchViewed(entry.caseId);
    router.push(`/cases/${entry.caseId}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  const isComplete = summary?.status === "complete";
  const triage =
    summary && isComplete ? topTriage(summary.topics) : null;
  const score = isComplete ? corroborationScore(entry.caseId) : null;

  return (
    <Box
      role="link"
      tabIndex={0}
      onClick={navigate}
      onKeyDown={onKeyDown}
      aria-label={`Open ${entry.displayName}`}
      cursor="pointer"
      borderBottomWidth="1px"
      borderColor="border.muted"
      transition="background-color 120ms"
      _hover={{ bg: "bg.subtle" }}
      _focusVisible={{
        outline: "none",
        boxShadow: "focusRing",
        position: "relative",
        zIndex: 1,
      }}
    >
      <HStack
        align="flex-start"
        gap={{ base: "6", md: "10" }}
        py={{ base: "6", md: "8" }}
      >
        <Stack flex="1" minW="0" gap="3">
          <Eyebrow>
            <Text
              as="span"
              suppressHydrationWarning
            >
              {formatDateline(entry.createdAt)}
            </Text>
          </Eyebrow>

          <NextLink
            href={`/cases/${entry.caseId}`}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text
              as="h3"
              fontFamily="heading"
              fontWeight="500"
              fontSize={{ base: "26px", md: "34px" }}
              lineHeight="1.08"
              letterSpacing="tight"
              color="fg"
            >
              {titleFor(row)}
            </Text>
          </NextLink>

          <Text
            as="p"
            fontFamily="body"
            fontSize="16px"
            lineHeight="26px"
            color="fg.muted"
            maxW="65ch"
          >
            {descriptionFor(row)}
          </Text>
        </Stack>

        <ScoreColumn
          score={score}
          triage={triage}
          isProcessing={!summary || summary.status === "processing"}
          isFailed={!!summary && summary.status === "failed"}
        />
      </HStack>
    </Box>
  );
}

function ScoreColumn({
  score,
  triage,
  isProcessing,
  isFailed,
}: {
  score: number | null;
  triage: Rating | null;
  isProcessing: boolean;
  isFailed: boolean;
}) {
  const tone =
    triage === "high"
      ? "fg.attention"
      : triage === "medium"
      ? "fg.warning"
      : triage === "low"
      ? "fg.success"
      : "fg";

  return (
    <Stack
      align={{ base: "flex-start", md: "flex-end" }}
      textAlign={{ base: "left", md: "right" }}
      minW={{ base: "auto", md: "120px" }}
      flexShrink={0}
      gap="1"
      display={{ base: "none", sm: "flex" }}
    >
      {score !== null && (
        <Text
          fontFamily="heading"
          fontWeight="500"
          fontSize={{ base: "32px", md: "44px" }}
          lineHeight="1"
          letterSpacing="tight"
          color={tone}
          fontVariantNumeric="tabular-nums"
        >
          {score}
        </Text>
      )}
      <Text
        fontFamily="mono"
        fontSize="10px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        fontWeight="500"
        color="fg.muted"
      >
        {isFailed
          ? "Analysis failed"
          : isProcessing
          ? "Score pending"
          : "Corroboration score"}
      </Text>
    </Stack>
  );
}

function Eyebrow({
  children,
  pl,
  pb,
}: {
  children: React.ReactNode;
  pl?: string;
  pb?: string;
}) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="500"
      color="fg.muted"
      pl={pl}
      pb={pb}
    >
      {children}
    </Text>
  );
}
