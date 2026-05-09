"use client";

import { Box, HStack, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { UploadModal } from "@/components/UploadModal";
import {
  uploadDialogStore,
  useUploadDialog,
} from "@/lib/upload-dialog-store";
import { Logomark } from "./Logomark";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatDateline(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function TopBar() {
  const dialog = useUploadDialog();
  const [dateline, setDateline] = useState<string | null>(null);

  useEffect(() => {
    setDateline(formatDateline(new Date()));
  }, []);

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
      position="sticky"
      top="0"
      zIndex="docked"
    >
      <HStack
        h="56px"
        maxW="1080px"
        mx="auto"
        px="6"
        align="center"
        gap="4"
      >
        <NextLink
          href="/"
          aria-label="Palantir for the People — home"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <HStack gap="3" align="center">
            <Box
              color="fg"
              transition="color 150ms"
              _groupHover={{ color: "fg.muted" }}
            >
              <Logomark size={22} />
            </Box>
            <HStack gap="2.5" align="center">
              <Text
                as="span"
                fontFamily="mono"
                fontSize="12px"
                lineHeight="14px"
                letterSpacing="wide"
                textTransform="uppercase"
                fontWeight="600"
                color="fg"
              >
                Palantir
              </Text>
              <Box
                as="span"
                w="1px"
                h="14px"
                bg="border"
                aria-hidden
              />
              <Text
                as="span"
                fontFamily="mono"
                fontSize="11px"
                lineHeight="14px"
                letterSpacing="wider"
                textTransform="uppercase"
                fontWeight="500"
                color="fg.muted"
              >
                For the People
              </Text>
            </HStack>
          </HStack>
        </NextLink>

        <Spacer />

        <Text
          as="span"
          fontFamily="mono"
          fontSize="11px"
          lineHeight="14px"
          letterSpacing="wider"
          textTransform="uppercase"
          fontWeight="500"
          color="fg.muted"
          suppressHydrationWarning
        >
          {dateline ?? " "}
        </Text>
      </HStack>
      <UploadModal
        open={dialog.open}
        initialFiles={dialog.initialFiles}
        onClose={() => uploadDialogStore.closeDialog()}
      />
    </Box>
  );
}
