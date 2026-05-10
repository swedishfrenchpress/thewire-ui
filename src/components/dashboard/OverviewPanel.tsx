"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import { formatRelative } from "@/lib/format";
import { NULL_DASH } from "@/lib/null-state";
import type { Row } from "@/lib/triage";
import { MetricColumn } from "./MetricColumn";
import { SectionHeader } from "./SectionHeader";

export function OverviewPanel({ rows }: { rows: Row[] }) {
  const total = rows.length;

  let documentsAnalyzed = 0;
  let highTriageTopics = 0;
  for (const r of rows) {
    if (!r.summary) continue;
    documentsAnalyzed += r.summary.document_count;
    for (const t of r.summary.topics) {
      if (t.triage === "high") highTriageTopics++;
    }
  }

  const lastCreatedIso = rows
    .map((r) => r.entry.createdAt)
    .reduce<string | null>((acc, iso) => {
      if (!acc) return iso;
      return iso > acc ? iso : acc;
    }, null);

  return (
    <Box
      mt="14"
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="6"
    >
      <SectionHeader icon={<ChartIcon />} label="Overview" tone="muted" />

      <Grid
        templateColumns="repeat(4, minmax(0, 1fr))"
        gap="6"
        mt="2"
      >
        <MetricColumn label="Total cases">
          <BigValue>{pad(total)}</BigValue>
        </MetricColumn>

        <MetricColumn label="Documents analyzed">
          <BigValue>{String(documentsAnalyzed)}</BigValue>
        </MetricColumn>

        <MetricColumn label="High priority topics">
          <BigValue tone={highTriageTopics > 0 ? "attention" : "default"}>
            {pad(highTriageTopics)}
          </BigValue>
        </MetricColumn>

        <MetricColumn label="Last case created">
          <Text
            as="span"
            fontFamily="mono"
            fontSize="22px"
            lineHeight="26px"
            fontWeight="500"
            color="fg"
            fontVariantNumeric="tabular-nums"
          >
            {lastCreatedIso ? formatRelative(lastCreatedIso) : NULL_DASH}
          </Text>
        </MetricColumn>
      </Grid>
    </Box>
  );
}

function pad(n: number) {
  if (n < 100) return String(n).padStart(2, "0");
  return String(n);
}

function BigValue({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "attention";
}) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="28px"
      lineHeight="32px"
      fontWeight="500"
      letterSpacing="tight"
      color={tone === "attention" ? "fg.attention" : "fg"}
      fontVariantNumeric="tabular-nums"
    >
      {children}
    </Text>
  );
}

function ChartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M4 20V8" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H4" />
    </svg>
  );
}
