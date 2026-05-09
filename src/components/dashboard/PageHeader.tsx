"use client";

import { Button, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { uploadDialogStore } from "@/lib/upload-dialog-store";

export function PageHeader() {
  return (
    <HStack
      justify="space-between"
      align="flex-start"
      pt="10"
      pb="6"
      gap="6"
    >
      <Stack gap="2" maxW="56ch">
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="400"
          fontSize="34px"
          lineHeight="38px"
          letterSpacing="tight"
          color="fg"
        >
          Dashboard
        </Heading>
        <Text
          fontFamily="body"
          fontSize="14px"
          lineHeight="20px"
          color="fg.muted"
        >
          Local case archive. Drop new documents to start a case.
        </Text>
      </Stack>

      <Button
        variant="solid"
        size="md"
        onClick={() => uploadDialogStore.openDialog()}
      >
        + New case
      </Button>
    </HStack>
  );
}
