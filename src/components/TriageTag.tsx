"use client";

import { Box } from "@chakra-ui/react";
import type { Rating } from "@/lib/types";

const STYLES: Record<Rating, { bg: string; color: string }> = {
  high: { bg: "bg.attentionSubtle", color: "fg.attention" },
  medium: { bg: "bg.warningSubtle", color: "fg.warning" },
  low: { bg: "bg.successSubtle", color: "fg.success" },
};

export function TriageTag({ rating }: { rating: Rating }) {
  const s = STYLES[rating];
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="2"
      py="1"
      bg={s.bg}
      color={s.color}
      textStyle="eyebrow.sm"
      fontWeight="600"
      borderRadius="sm"
    >
      {rating}
    </Box>
  );
}
