"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  align?: "start" | "end";
};

export function MetricColumn({ label, children, align = "start" }: Props) {
  return (
    <Stack gap="2" align={align === "end" ? "flex-end" : "flex-start"} minW="0">
      <Text
        as="span"
        fontFamily="mono"
        fontSize="10px"
        lineHeight="12px"
        letterSpacing="wide"
        textTransform="uppercase"
        color="fg.muted"
      >
        {label}
      </Text>
      <Box
        textAlign={align === "end" ? "right" : "left"}
        fontVariantNumeric="tabular-nums"
      >
        {children}
      </Box>
    </Stack>
  );
}
