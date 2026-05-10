"use client";

import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  hint?: string;
};

export function FileUploadArea({
  files,
  onChange,
  accept = "text/plain,.txt,.md",
  multiple = true,
  disabled = false,
  maxFiles = 10,
  hint = "Plain text or Markdown",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const select = (incoming: FileList | File[] | null) => {
    if (!incoming || disabled) return;
    const next = Array.from(incoming);
    onChange(multiple ? next : next.slice(0, 1));
  };

  // Visual states from Figma:
  //   idle      → bg.subtle, no border
  //   dragging  → bg.muted, dashed border.medium
  //   disabled  → idle styling at 40% opacity
  const isDragging = dragging && !disabled;

  return (
    <Box
      // Tile dimensions match the Figma component (~320 × 226).
      maxW="sm"
      minH="56"
      px="6"
      py="8"
      bg={isDragging ? "bg.muted" : "bg.subtle"}
      color="fg"
      borderWidth="1px"
      borderStyle={isDragging ? "dashed" : "solid"}
      borderColor={isDragging ? "border.medium" : "transparent"}
      borderRadius="lg"
      transition="background-color 120ms, border-color 120ms"
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? 0.4 : 1}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragging(false);
        select(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => select(e.target.files)}
      />

      <Stack gap="3" align="center" textAlign="center">
        <UploadIcon />

        <Text
          fontFamily="body"
          fontSize="14px"
          lineHeight="18px"
          color="fg"
          fontWeight="400"
        >
          {files.length === 0
            ? "Drag and drop your files here"
            : `${files.length} file${files.length === 1 ? "" : "s"} selected`}
        </Text>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Or select file
        </Button>

        <Stack gap="0" align="center">
          <Text
            fontFamily="body"
            fontSize="13px"
            lineHeight="16px"
            color="fg.muted"
          >
            Up to {maxFiles} files
          </Text>
          <Text
            fontFamily="body"
            fontSize="13px"
            lineHeight="16px"
            color="fg.muted"
          >
            {hint}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}

function UploadIcon() {
  return (
    <svg
      width="24"
      height="24"
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
