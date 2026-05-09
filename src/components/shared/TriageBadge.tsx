"use client";

import { Box } from "@chakra-ui/react";
import type { Rating } from "@/lib/types";

const STYLES: Record<Rating, { bg: string; color: string; label: string }> = {
  high: { bg: "bg.attentionSubtle", color: "fg.attention", label: "High" },
  medium: { bg: "bg.warningSubtle", color: "fg.warning", label: "Medium" },
  low: { bg: "bg.successSubtle", color: "fg.success", label: "Low" },
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
        minW="64px"
      >
        —
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
      minW="64px"
    >
      {s.label}
    </Box>
  );
}
