"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { uploadDialogStore } from "@/lib/upload-dialog-store";
import { GridBackground } from "./GridBackground";

const InteractiveOrb = dynamic(
  () => import("./InteractiveOrb").then((m) => m.InteractiveOrb),
  {
    ssr: false,
    loading: () => <Box width="100%" height="300px" />,
  },
);

export function OrbHero() {
  return (
    <Box
      as="section"
      position="relative"
      width="100%"
      overflow="hidden"
      pt="6"
      pb="10"
    >
      <GridBackground />

      <Stack
        position="relative"
        zIndex="1"
        maxW="640px"
        mx="auto"
        px="6"
        gap="6"
        align="center"
        textAlign="center"
      >
        <Box width="100%" maxW="440px">
          <InteractiveOrb height="300px" />
        </Box>

        <Stack gap="2" align="center">
          <Heading
            as="h1"
            fontFamily="heading"
            fontWeight="400"
            fontSize="clamp(2rem, 4.5vw, 3rem)"
            lineHeight="1.05"
            letterSpacing="tight"
            color="fg"
          >
            Start a new case
          </Heading>
          <Text
            fontFamily="body"
            fontSize="15px"
            lineHeight="22px"
            color="fg.muted"
            maxW="44ch"
          >
            Drop a document and we&apos;ll triage it for you.
          </Text>
        </Stack>

        <Button
          size="lg"
          variant="solid"
          onClick={() => uploadDialogStore.openDialog()}
          borderRadius="full"
          h="48px"
          px="7"
          minW="220px"
          fontSize="13px"
          letterSpacing="wide"
        >
          + Upload a document
        </Button>
      </Stack>
    </Box>
  );
}
