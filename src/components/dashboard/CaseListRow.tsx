"use client";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { casesStore } from "@/lib/cases-store";
import { formatShortDate } from "@/lib/format";
import {
  corroborationScore,
  topTopic,
  topTriage,
  type Row,
} from "@/lib/triage";

function headlineFor(row: Row): string {
  const top = row.summary ? topTopic(row.summary.topics) : null;
  return top?.title ?? row.entry.displayName;
}

function metaLineFor(row: Row): string {
  const { summary, isError, entry } = row;
  if (isError || summary?.status === "failed") {
    return "Analysis failed";
  }
  if (!summary || summary.status === "processing") {
    return "Awaiting analysis";
  }
  const topics = summary.topics.length;
  const docs = summary.document_count;
  const score = corroborationScore(entry.caseId);
  return `${topics} ${topics === 1 ? "topic" : "topics"} · ${docs} ${docs === 1 ? "document" : "documents"} · ${score}% corroboration`;
}

export function CaseListRow({
  row,
  isFirst,
}: {
  row: Row;
  isFirst: boolean;
}) {
  const { entry, summary, isError } = row;
  const isProcessing = !summary || summary.status === "processing";
  const isFailed = isError || summary?.status === "failed";
  const isComplete = !!summary && summary.status === "complete";
  const top = isComplete ? topTriage(summary.topics) : null;

  const reducedMotion = useReducedMotion();

  return (
    <NextLink
      href={`/cases/${entry.caseId}`}
      data-case-card
      onClick={() => casesStore.touchViewed(entry.caseId)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <Box
        py="5"
        px="2"
        mx="-2"
        borderTopWidth={isFirst ? "2px" : "1px"}
        borderTopColor={isFirst ? "fg" : "border.muted"}
        transition="background-color 120ms"
        role="article"
        css={{
          "&:hover": { backgroundColor: "var(--chakra-colors-bg-subtle)" },
          "&:hover .row-chevron": { opacity: 1, transform: "translateX(0)" },
        }}
        _focusVisible={{
          outline: "none",
          boxShadow: "focusRing",
          position: "relative",
          zIndex: 1,
        }}
      >
        <HStack gap="6" align="flex-start">
          <Box flex="0 0 64px" pt="0.5">
            {isFailed ? (
              <StatusChip tone="attention" label="Failed" />
            ) : isProcessing ? (
              <StatusChip
                tone="muted"
                label="Pending"
                pulse={!reducedMotion}
              />
            ) : (
              <TriageBadge level={top} />
            )}
          </Box>

          <Stack flex="0 0 88px" gap="0.5">
            <Text
              as="span"
              fontFamily="mono"
              fontSize="11px"
              lineHeight="13px"
              letterSpacing="wide"
              textTransform="uppercase"
              fontWeight="500"
              color="fg"
              fontVariantNumeric="tabular-nums"
            >
              #{String(entry.caseId).padStart(5, "0")}
            </Text>
            <Text
              as="span"
              fontFamily="mono"
              fontSize="11px"
              lineHeight="13px"
              letterSpacing="wide"
              textTransform="uppercase"
              color="fg.muted"
            >
              {formatShortDate(entry.createdAt)}
            </Text>
            {entry.pinned && (
              <Text
                as="span"
                fontFamily="mono"
                fontSize="9px"
                lineHeight="11px"
                letterSpacing="0.12em"
                textTransform="uppercase"
                color="fg"
                pt="1"
              >
                ★ Pinned
              </Text>
            )}
          </Stack>

          <Stack flex="1" minW="0" gap="1.5">
            <Text
              as="h3"
              fontFamily="heading"
              fontWeight="400"
              fontSize={{ base: "20px", md: "22px" }}
              lineHeight="1.2"
              letterSpacing="-0.01em"
              color="fg"
              lineClamp={2}
            >
              {headlineFor(row)}
            </Text>
            <Text textStyle="eyebrow" color="fg.muted">
              {metaLineFor(row)}
            </Text>
          </Stack>

          <Box flex="0 0 24px" pt="1" textAlign="right" minH="1">
            <Box
              className="row-chevron"
              as="span"
              fontFamily="mono"
              fontSize="18px"
              lineHeight="1"
              color="fg.muted"
              opacity={0}
              transform="translateX(-4px)"
              transition="opacity 120ms, transform 120ms"
              aria-hidden
            >
              ›
            </Box>
          </Box>
        </HStack>
      </Box>
    </NextLink>
  );
}

function StatusChip({
  tone,
  label,
  pulse = false,
}: {
  tone: "muted" | "attention";
  label: string;
  pulse?: boolean;
}) {
  const styles =
    tone === "attention"
      ? { bg: "bg.attentionSubtle", color: "fg.attention" }
      : { bg: "bg.muted", color: "fg.muted" };
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      bg={styles.bg}
      color={styles.color}
      fontFamily="body"
      fontSize="13px"
      lineHeight="15px"
      fontWeight="400"
      px="2"
      py="0.5"
      borderRadius="md"
      minH="19px"
      minW="64px"
      animation={pulse ? "wirePulse 2s ease-in-out infinite" : undefined}
    >
      {label}
    </Box>
  );
}
