"use client";

import { Box, Button, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { Row } from "@/lib/triage";

type Stats = {
  total: number;
  active: number;
  documents: number;
  highTriage: number;
};

function computeStats(rows: Row[]): Stats {
  const stats: Stats = {
    total: rows.length,
    active: 0,
    documents: 0,
    highTriage: 0,
  };
  for (const r of rows) {
    const s = r.summary;
    if (!s) continue;
    stats.documents += s.document_count;
    let hasHigh = false;
    for (const c of s.categories) {
      if (c.triage === "high") {
        stats.highTriage++;
        hasHigh = true;
      }
    }
    if (s.status === "complete" && hasHigh) stats.active++;
  }
  return stats;
}

function pad(n: number): string {
  if (n < 100) return String(n).padStart(2, "0");
  return String(n);
}

export function DashboardHeader({ rows }: { rows: Row[] }) {
  const stats = computeStats(rows);
  return (
    <Box pb="6" borderBottomWidth="1px" borderColor="border" mb="2">
      <HStack justify="space-between" align="center" mb="8">
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="400"
          fontSize="22px"
          lineHeight="26px"
          letterSpacing="tight"
          color="fg"
        >
          Case index
        </Heading>
        <HStack gap="2">
          <Button asChild variant="ghost" size="md" aria-label="Settings">
            <NextLink href="/settings">
              <GearIcon />
            </NextLink>
          </Button>
          <Button asChild variant="solid" size="md">
            <NextLink href="/upload">+ New case</NextLink>
          </Button>
        </HStack>
      </HStack>

      <HStack gap="12" align="flex-end" wrap="wrap">
        <Stat label="Cases" value={pad(stats.total)} />
        <Stat
          label="Active"
          value={pad(stats.active)}
          tone={stats.active > 0 ? "fg.attention" : undefined}
        />
        <Stat label="Documents" value={String(stats.documents)} />
        <Stat label="High-triage" value={String(stats.highTriage)} />
      </HStack>
    </Box>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <Stack gap="1" align="flex-start">
      <Text
        fontFamily="mono"
        fontSize="10px"
        lineHeight="12px"
        letterSpacing="wide"
        textTransform="uppercase"
        color="fg.muted"
      >
        {label}
      </Text>
      <Text
        fontFamily="mono"
        fontSize="32px"
        lineHeight="36px"
        fontWeight="500"
        letterSpacing="tight"
        color={tone ?? "fg"}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Text>
    </Stack>
  );
}

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  );
}
