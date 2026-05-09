"use client";

import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "error" | "warning";

const STYLES: Record<Tone, { bg: string; color: string; icon: string }> = {
  neutral: { bg: "bg.subtle", color: "fg.muted", icon: "•" },
  success: { bg: "bg.successSubtle", color: "fg.success", icon: "✓" },
  error: { bg: "bg.attentionSubtle", color: "fg.attention", icon: "✕" },
  warning: { bg: "bg.warningSubtle", color: "fg.warning", icon: "!" },
};

export function HelperText({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const s = STYLES[tone];
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="2"
      px="3"
      py="2"
      bg={s.bg}
      color={s.color}
      fontFamily="body"
      fontSize="13px"
      lineHeight="16px"
      fontWeight="400"
      borderRadius="sm"
      role={tone === "error" ? "alert" : undefined}
    >
      <Box as="span" aria-hidden fontWeight="600">
        {s.icon}
      </Box>
      <Box as="span">{children}</Box>
    </Box>
  );
}
