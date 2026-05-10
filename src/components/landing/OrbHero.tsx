"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import { GridBackground } from "./GridBackground";

export function OrbHero() {
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
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="400"
          fontSize="clamp(1.75rem, 3.6vw, 2.5rem)"
          lineHeight="1.05"
          letterSpacing="tight"
          color="fg"
        >
          Submit a tip
        </Heading>
      </Stack>
    </Box>
  );
}
