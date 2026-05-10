"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export type WireToastTone = "filed" | "cleared" | "warning" | "error";

const EYEBROW_COLOR: Record<WireToastTone, string> = {
  filed: "fg.muted",
  cleared: "fg.success",
  warning: "fg.warning",
  error: "fg.attention",
};

const SURFACE_BG: Record<WireToastTone, string> = {
  filed: "bg",
  cleared: "bg.successSubtle",
  warning: "bg.warningSubtle",
  error: "bg.attentionSubtle",
};

const SURFACE_BORDER: Record<WireToastTone, string> = {
  filed: "border",
  cleared: "border",
  warning: "border",
  error: "border",
};

export function WireToast({
  id,
  tone,
  eyebrow,
  title,
  meta,
}: {
  id: string | number;
  tone: WireToastTone;
  eyebrow: string;
  title: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <Box
      role={tone === "error" ? "alert" : undefined}
      bg={SURFACE_BG[tone]}
      borderWidth="1px"
      borderColor={SURFACE_BORDER[tone]}
      borderRadius="sm"
      px="3.5"
      py="2.5"
      minW="320px"
      maxW="420px"
      boxShadow="none"
      animation="surfaceIn var(--chakra-durations-swift) var(--chakra-easings-standard) both"
    >
      <HStack justify="space-between" align="flex-start" gap="3" mb="1">
        <Text
          fontFamily="mono"
          fontSize="11px"
          lineHeight="13px"
          letterSpacing="wider"
          textTransform="uppercase"
          color={EYEBROW_COLOR[tone]}
          fontWeight="500"
        >
          {eyebrow}
        </Text>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => toast.dismiss(id)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            lineHeight: "14px",
            color: "var(--chakra-colors-fg-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginTop: "-1px",
            transition:
              "color var(--chakra-durations-instant) var(--chakra-easings-standard)",
          }}
        >
          ×
        </button>
      </HStack>
      <Text
        fontFamily="body"
        fontSize="14px"
        lineHeight="18px"
        color="fg"
      >
        {title}
      </Text>
      {meta ? (
        <Text
          mt="1.5"
          fontFamily="mono"
          fontSize="11px"
          lineHeight="13px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontVariantNumeric="tabular-nums"
        >
          {meta}
        </Text>
      ) : null}
    </Box>
  );
}
