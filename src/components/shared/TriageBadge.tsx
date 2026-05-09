"use client";

import { Box } from "@chakra-ui/react";
import type { Rating } from "@/lib/types";

const STYLES: Record<Rating, { bg: string; color: string; label: string }> = {
  high: { bg: "bg.attentionSubtle", color: "fg.attention", label: "HIGH" },
  medium: { bg: "bg.warningSubtle", color: "fg.warning", label: "MEDIUM" },
  low: { bg: "bg.successSubtle", color: "fg.success", label: "LOW" },
};

export function TriageBadge({ level }: { level: Rating | null }) {
  if (!level) {
    return (
      <Box
        as="span"
        display="inline-block"
        fontFamily="mono"
        color="fg.disabled"
        fontSize="11px"
        lineHeight="13px"
        textAlign="center"
        minW="68px"
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
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      fontWeight="500"
      letterSpacing="wide"
      textTransform="uppercase"
      px="2"
      py="1"
      borderRadius="sm"
      minW="68px"
    >
      {s.label}
    </Box>
  );
}
