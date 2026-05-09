"use client";

import { Box } from "@chakra-ui/react";

const GRID_SIZE = "40px 40px";
const LINE_COLOR = "rgba(0, 0, 0, 0.06)";

export function GridBackground() {
  return (
    <Box
      position="absolute"
      inset="0"
      overflow="hidden"
      pointerEvents="none"
      aria-hidden
    >
      <Box
        position="absolute"
        inset="0"
        backgroundImage={`linear-gradient(to right, ${LINE_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${LINE_COLOR} 1px, transparent 1px)`}
        backgroundSize={GRID_SIZE}
      />
      <Box
        position="absolute"
        inset="0"
        background="radial-gradient(ellipse at center, transparent 0%, var(--chakra-colors-bg) 80%)"
      />
    </Box>
  );
}
