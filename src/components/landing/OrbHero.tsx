"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import type { DeskSignal } from "@/lib/use-desk-signal";
import { GridBackground } from "./GridBackground";

const InteractiveOrb = dynamic(
  () => import("./InteractiveOrb").then((m) => m.InteractiveOrb),
  {
    ssr: false,
    loading: () => <Box width="100%" height="220px" />,
  },
);

export function OrbHero({ signal }: { signal?: DeskSignal }) {
  return (
    <Box
      as="section"
      position="relative"
      width="100%"
      overflow="hidden"
      pt="6"
      pb="6"
    >
      <GridBackground />

      <Stack
        position="relative"
        zIndex="1"
        maxW="640px"
        mx="auto"
        px="6"
        gap="3"
        align="center"
        textAlign="center"
      >
        <Box width="100%" maxW="320px">
          <InteractiveOrb height="220px" signal={signal} />
        </Box>

        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="400"
          fontSize="clamp(1.75rem, 3.6vw, 2.5rem)"
          lineHeight="1.05"
          letterSpacing="tight"
          color="fg"
        >
          File a report
        </Heading>
      </Stack>
    </Box>
  );
}
