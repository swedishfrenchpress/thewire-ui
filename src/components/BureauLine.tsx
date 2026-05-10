"use client";

import { Box, HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

// A persistent bottom-of-viewport status strip in the wire-service register.
// Renders mono uppercase metadata across two slots (left for counts, right
// for status + timestamp). Hidden on narrow viewports.
export function BureauLine({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="bg"
      borderTopWidth="1px"
      borderColor="border.muted"
      px="6"
      h="32px"
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      zIndex="docked"
      animation="surfaceIn var(--chakra-durations-swift) var(--chakra-easings-standard) both"
    >
      <HStack
        justify="space-between"
        align="center"
        w="full"
        gap="6"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        fontWeight="500"
        color="fg.muted"
      >
        <HStack gap="3" align="center" minW="0">
          {left}
        </HStack>
        <HStack gap="3" align="center" minW="0">
          {right}
        </HStack>
      </HStack>
    </Box>
  );
}

export function BureauSep() {
  return (
    <Box as="span" color="fg.disabled" aria-hidden>
      ·
    </Box>
  );
}

// Small mono span used inside BureauLine for highlighted numerals.
export function BureauNum({ children }: { children: ReactNode }) {
  return (
    <Box as="span" color="fg" fontVariantNumeric="tabular-nums">
      {children}
    </Box>
  );
}
