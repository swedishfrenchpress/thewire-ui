"use client";

import { Box } from "@chakra-ui/react";
import { VERDICT_LABELS, type Verdict } from "@/lib/triage";

const STYLES: Record<Verdict, { bg: string; color: string }> = {
  concerning: { bg: "bg.attentionSubtle", color: "fg.attention" },
  mixed: { bg: "bg.warningSubtle", color: "fg.warning" },
  healthy: { bg: "bg.successSubtle", color: "fg.success" },
};

export function VerdictTag({ verdict }: { verdict: Verdict }) {
  const s = STYLES[verdict];
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
      {VERDICT_LABELS[verdict]}
    </Box>
  );
}
