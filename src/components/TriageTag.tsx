"use client";

import { Box } from "@chakra-ui/react";
import type { Rating } from "@/lib/types";

const STYLES: Record<Rating, { bg: string; color: string; label: string }> = {
  high: {
    bg: "bg.priorityHighSubtle",
    color: "fg.priorityHigh",
    label: "HIGH PRIORITY",
  },
  medium: {
    bg: "bg.priorityMediumSubtle",
    color: "fg.priorityMedium",
    label: "MEDIUM PRIORITY",
  },
  low: {
    bg: "bg.priorityLowSubtle",
    color: "fg.priorityLow",
    label: "LOW PRIORITY",
  },
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
      {s.label}
    </Box>
  );
}
