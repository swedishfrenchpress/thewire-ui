"use client";

import { Box } from "@chakra-ui/react";
import type { TriageMixCounts } from "@/lib/triage";

export function TriageMix({ mix }: { mix: TriageMixCounts }) {
  if (mix.high === 0 && mix.medium === 0 && mix.low === 0) {
    return (
      <Box
        as="span"
        fontFamily="mono"
        color="fg.disabled"
        fontSize="13px"
        lineHeight="16px"
      >
        —
      </Box>
    );
  }
  return (
    <Box
      as="span"
      fontFamily="mono"
      fontSize="13px"
      lineHeight="16px"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <Count n={mix.high} letter="H" tone="fg.attention" />
      <Sep />
      <Count n={mix.medium} letter="M" tone="fg.warning" />
      <Sep />
      <Count n={mix.low} letter="L" tone="fg.success" />
    </Box>
  );
}

function Count({
  n,
  letter,
  tone,
}: {
  n: number;
  letter: string;
  tone: string;
}) {
  return (
    <Box as="span" color={n === 0 ? "fg.disabled" : tone}>
      {n}
      {letter}
    </Box>
  );
}

function Sep() {
  return (
    <Box as="span" color="fg.disabled" px="1">
      /
    </Box>
  );
}
