"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { uploadDialogStore } from "@/lib/upload-dialog-store";

export function EmptyDashboard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const openWith = (incoming?: FileList | File[] | null) => {
    const list = incoming ? Array.from(incoming) : [];
    uploadDialogStore.openDialog(list);
  };

  return (
    <Box
      mt="20"
      mb="20"
      px="10"
      py="20"
      bg={dragging ? "bg.muted" : "bg.subtle"}
      borderWidth="1px"
      borderStyle="dashed"
      borderColor={dragging ? "border.medium" : "border.muted"}
      borderRadius="lg"
      cursor="pointer"
      transition="background-color 120ms, border-color 120ms"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        openWith(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="text/plain,.txt,.md"
        style={{ display: "none" }}
        onChange={(e) => openWith(e.target.files)}
      />
      <Stack gap="5" align="center" textAlign="center">
        <UploadIcon />
        <Stack gap="1">
          <Heading
            as="h2"
            fontFamily="heading"
            fontWeight="400"
            fontSize="22px"
            lineHeight="28px"
            letterSpacing="tight"
            color="fg"
          >
            No cases yet
          </Heading>
          <Text fontFamily="body" fontSize="14px" color="fg.muted">
            Drop documents here or click to upload. Plain text or Markdown, up
            to 10 files.
          </Text>
        </Stack>
        <Button
          type="button"
          variant="solid"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            uploadDialogStore.openDialog();
          }}
        >
          + Upload documents
        </Button>
      </Stack>
    </Box>
  );
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M12 4v12" />
      <path d="M6 10l6-6 6 6" />
      <path d="M4 20h16" />
    </svg>
  );
}
