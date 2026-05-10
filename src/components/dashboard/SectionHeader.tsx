"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SectionTone = "attention" | "warning" | "muted";

const DASH_COLOR: Record<SectionTone, string> = {
  attention: "fg.attention",
  warning: "fg.warning",
  muted: "border.medium",
};

type Props = {
  icon: ReactNode;
  label: string;
  tone: SectionTone;
  count?: number;
};

export function SectionHeader({ icon, label, tone, count }: Props) {
  return (
    <HStack gap="3" align="center" mt="10" mb="4">
      <Box
        w="20px"
        h="2px"
        bg={DASH_COLOR[tone]}
        flexShrink={0}
        aria-hidden
      />
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w="14px"
        h="14px"
        color="fg.muted"
        flexShrink={0}
        aria-hidden
      >
        {icon}
      </Box>
      <Text as="span" textStyle="eyebrow" color="fg.muted">
        {label}
        {typeof count === "number" && (
          <Box as="span" ml="2" color="fg.disabled">
            {String(count).padStart(2, "0")}
          </Box>
        )}
      </Text>
    </HStack>
  );
}
