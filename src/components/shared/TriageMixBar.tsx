"use client";

import { Box } from "@chakra-ui/react";
import { TRIAGE_LABELS, type TriageMixCounts } from "@/lib/triage";
import type { Rating } from "@/lib/types";

const TONE: Record<Rating, string> = {
  high: "bg.attentionSubtle",
  medium: "bg.warningSubtle",
  low: "bg.successSubtle",
};

const ORDER: Rating[] = ["high", "medium", "low"];

/**
 * Compact stacked bar for inline use on case cards. Takes a TriageMixCounts
 * (high/medium/low integer counts) and renders proportional colored segments.
 *
 * No inline labels. Use this when the surrounding context already names the
 * thing being mixed; the colors carry the proportion. For surfaces that need
 * percentages spelled out, use the topic-page DocumentMixBar instead.
 */
export function TriageMixBar({ mix }: { mix: TriageMixCounts }) {
  const total = mix.high + mix.medium + mix.low;
  if (total === 0) return null;

  const ariaLabel = ORDER.filter((r) => mix[r] > 0)
    .map((r) => `${TRIAGE_LABELS[r]} ${mix[r]}`)
    .join(", ");

  return (
    <Box
      display="flex"
      w="120px"
      h="4"
      borderRadius="sm"
      overflow="hidden"
      bg="bg.subtle"
      role="img"
      aria-label={ariaLabel}
    >
      {ORDER.map((r) => {
        if (mix[r] === 0) return null;
        return (
          <Box
            key={r}
            flexBasis={`${(mix[r] / total) * 100}%`}
            flexGrow={0}
            flexShrink={0}
            bg={TONE[r]}
            title={`${TRIAGE_LABELS[r]} ${mix[r]}`}
          />
        );
      })}
    </Box>
  );
}
