"use client";

import { Box } from "@chakra-ui/react";
import type { CaseStatus } from "@/lib/types";

const STYLES: Record<
  CaseStatus,
  { bg: string; color: string; label: string }
> = {
  processing: { bg: "bg.subtle", color: "fg.muted", label: "PROCESSING" },
  complete: { bg: "transparent", color: "fg", label: "COMPLETE" },
  failed: { bg: "bg.attentionSubtle", color: "fg.attention", label: "FAILED" },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STYLES[status];
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
      minW="92px"
      animation={
        status === "processing"
          ? "wirePulse 2s ease-in-out infinite"
          : undefined
      }
    >
      {s.label}
    </Box>
  );
}
