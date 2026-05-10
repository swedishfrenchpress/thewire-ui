"use client";

import { Box } from "@chakra-ui/react";
import { NULL_DASH } from "@/lib/null-state";
import type { Rating } from "@/lib/types";

const STYLES: Record<Rating, { bg: string; color: string; label: string }> = {
  high: {
    bg: "bg.priorityHighSubtle",
    color: "fg.priorityHigh",
    label: "High Priority",
  },
  medium: {
    bg: "bg.priorityMediumSubtle",
    color: "fg.priorityMedium",
    label: "Medium Priority",
  },
  low: {
    bg: "bg.priorityLowSubtle",
    color: "fg.priorityLow",
    label: "Low Priority",
  },
};

export function TriageBadge({ level }: { level: Rating | null }) {
  if (!level) {
    return (
      <Box
        as="span"
        display="inline-block"
        fontFamily="body"
        color="fg.disabled"
        fontSize="13px"
        lineHeight="18px"
        textAlign="center"
        minW="112px"
      >
        {NULL_DASH}
      </Box>
    );
  }
  const s = STYLES[level];
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      bg={s.bg}
      color={s.color}
      fontFamily="body"
      fontSize="13px"
      lineHeight="15px"
      fontWeight="400"
      px="2"
      py="0.5"
      borderRadius="md"
      minH="19px"
      minW="112px"
    >
      {s.label}
    </Box>
  );
}
