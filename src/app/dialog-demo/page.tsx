"use client";

import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { Dialog } from "@/components/Dialog";
import { FileUploadArea } from "@/components/FileUploadArea";
import { useState } from "react";

export default function DialogDemoPage() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack p="10" gap="6" align="flex-start">
      <Text
        fontFamily="heading"
        fontSize="30px"
        lineHeight="1.1"
        letterSpacing="tight"
      >
        Dialog recipe
      </Text>

      <Stack direction="row" gap="3">
        <Dialog>
          <Dialog.Trigger asChild>
            <Button variant="outline">Open simple dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Modal title</Dialog.Title>
              <Dialog.Description>Subtitle label</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              A short, declarative explanation of the action the user is about
              to confirm. Sentence case, no exclamation, no apology.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" flex="1">
                  Configure agent
                </Button>
              </Dialog.ActionTrigger>
              <Button variant="solid" flex="1">
                Start chat
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>

        <Dialog>
          <Dialog.Trigger asChild>
            <Button variant="solid">Open dialog with upload</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Attach evidence</Dialog.Title>
              <Dialog.Description>
                Plain text or Markdown, up to 10 files.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="4">
                <Text
                  fontFamily="mono"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontSize="12px"
                  lineHeight="18px"
                  color="fg.muted"
                >
                  Agent can access:
                </Text>
                <Box w="full">
                  <FileUploadArea
                    files={files}
                    onChange={setFiles}
                    hint="Plain text or Markdown"
                  />
                </Box>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" flex="1">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button variant="solid" flex="1">
                File evidence
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </Stack>
    </Stack>
  );
}
