"use client";

import { Box } from "@chakra-ui/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { CaseStatus } from "@/lib/types";

const STYLES: Record<
  CaseStatus,
  { bg: string; color: string; label: string }
> = {
  processing: { bg: "bg.muted", color: "fg.muted", label: "Processing" },
  complete: { bg: "transparent", color: "fg", label: "Complete" },
  failed: { bg: "bg.attentionSubtle", color: "fg.attention", label: "Failed" },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STYLES[status];
  const reducedMotion = useReducedMotion();
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
      minW="84px"
      animation={
        status === "processing" && !reducedMotion
          ? "wirePulse 2s ease-in-out infinite"
          : undefined
      }
    >
      {s.label}
    </Box>
  );
}
