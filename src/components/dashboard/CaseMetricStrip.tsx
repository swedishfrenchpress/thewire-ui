"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { TriageMix } from "@/components/shared/TriageMix";
import { formatRelative } from "@/lib/format";
import { topTriage, triageMix, type Row } from "@/lib/triage";
import { MetricColumn } from "./MetricColumn";

export function CaseMetricStrip({ row }: { row: Row }) {
  const { entry, summary } = row;
  const isProcessing = summary?.status === "processing";
  const isFailed = summary?.status === "failed";
  const noSummaryYet = !summary;

  const top = summary ? topTriage(summary.topics) : null;
  const mix = summary
    ? triageMix(summary.topics)
    : { high: 0, medium: 0, low: 0 };

  return (
    <HStack
      gap={{ base: "8", md: "12" }}
      align="flex-start"
      wrap="wrap"
      mt="5"
    >
      <MetricColumn label="Highest triage">
        {isFailed || noSummaryYet ? <Dash /> : <TriageBadge level={top} />}
      </MetricColumn>

      <MetricColumn label="Triage mix">
        {isFailed ? (
          <Dash />
        ) : isProcessing && summary && summary.topics.length === 0 ? (
          <Analyzing />
        ) : noSummaryYet ? (
          <Dash />
        ) : (
          <TriageMix mix={mix} />
        )}
      </MetricColumn>

      <MetricColumn label="Documents" align="end">
        {isFailed || noSummaryYet ? (
          <Dash />
        ) : (
          <BigMono pulse={isProcessing}>
            {summary.document_count}
          </BigMono>
        )}
      </MetricColumn>

      <MetricColumn label="Topics" align="end">
        {isFailed || noSummaryYet ? (
          <Dash />
        ) : (
          <BigMono
            pulse={isProcessing && summary.topics.length === 0}
          >
            {summary.topics.length}
          </BigMono>
        )}
      </MetricColumn>

      <MetricColumn label="Created" align="end">
        <Text
          as="span"
          fontFamily="mono"
          fontSize="13px"
          lineHeight="16px"
          color="fg.muted"
          fontVariantNumeric="tabular-nums"
        >
          {formatRelative(entry.createdAt)}
        </Text>
      </MetricColumn>
    </HStack>
  );
}

function BigMono({
  children,
  pulse,
}: {
  children: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <Box
      as="span"
      fontFamily="mono"
      fontSize="18px"
      lineHeight="22px"
      fontWeight="500"
      color="fg"
      fontVariantNumeric="tabular-nums"
      animation={pulse ? "wirePulse 2s ease-in-out infinite" : undefined}
    >
      {children}
    </Box>
  );
}

function Dash() {
  return (
    <Box
      as="span"
      fontFamily="mono"
      fontSize="18px"
      lineHeight="22px"
      color="fg.disabled"
    >
      —
    </Box>
  );
}

function Analyzing() {
  return (
    <Box
      as="span"
      fontFamily="mono"
      fontSize="13px"
      lineHeight="16px"
      color="fg.muted"
      fontStyle="italic"
      animation="wirePulse 2s ease-in-out infinite"
    >
      Analyzing…
    </Box>
  );
}
