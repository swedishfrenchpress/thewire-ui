"use client";

import { Box, Button, HStack, Stack, Text, Textarea } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { BorderBeam } from "border-beam";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { HelperText } from "@/components/HelperText";
import { createCase } from "@/lib/api";
import { notify } from "@/lib/notify";
import { casesStore } from "@/lib/cases-store";
import {
  deriveTextFilename,
  formatBytes,
  makeTextFile,
  readFileAsText,
} from "@/lib/upload-helpers";

type SubmitVars = { selected: File[] };

const ACCEPT = "text/plain,.txt,.md";

export function TipComposer() {
  const router = useRouter();
  const [reportText, setReportText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resetInput = () => setInputKey((k) => k + 1);

  const mutation = useMutation({
    mutationFn: async ({ selected }: SubmitVars) => {
      const documents = await Promise.all(
        selected.map(async (f) => ({
          filename: f.name,
          content: await readFileAsText(f),
        })),
      );
      const result = await createCase({ documents });
      return {
        result,
        count: documents.length,
      };
    },
    onSuccess: ({ result, count }) => {
      const displayName = `Case #${result.case_id}`;
      casesStore.addCase(result.case_id, displayName);
      setReportText("");
      setFiles([]);
      resetInput();
      router.push(`/cases/${result.case_id}`);
      notify.filed(`Analyzing ${displayName}`, {
        meta: `Case #${String(result.case_id).padStart(5, "0")} · ${count} document${count === 1 ? "" : "s"} · processing`,
      });
    },
  });

  const trimmedText = reportText.trim();
  const hasText = trimmedText.length > 0;
  const disabled = mutation.isPending;

  const onPickFiles = (incoming: FileList | null) => {
    if (!incoming || disabled) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
    resetInput();
  };

  const onAddTextAsFile = () => {
    if (!hasText || disabled) return;
    setFiles((prev) => {
      const noteIndex =
        prev.filter((f) => /^note-\d+\.txt$/.test(f.name)).length + 1;
      const filename = deriveTextFilename(trimmedText, noteIndex);
      return [...prev, makeTextFile(trimmedText, filename)];
    });
    setReportText("");
  };

  const clearFiles = () => {
    setFiles([]);
    resetInput();
  };

  const onSubmit = () => {
    if (files.length === 0 || disabled) return;
    mutation.mutate({ selected: files });
  };

  return (
    <Stack
      gap="4"
      w="full"
      maxW="640px"
      mx="auto"
      css={{
        transition:
          "opacity var(--chakra-durations-swift) var(--chakra-easings-standard)",
        opacity: mutation.isPending ? 0.6 : 1,
      }}
    >
      <input
        key={inputKey}
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => onPickFiles(e.target.files)}
      />

      <Stack gap="2">
        <FieldLabel htmlFor="tip-report">What is the report?</FieldLabel>
        <BorderBeam
          size="md"
          colorVariant="mono"
          theme="light"
          duration={1.96}
          strength={1}
        >
          <Textarea
            id="tip-report"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe what happened. When, where, who was involved."
            minH="180px"
            resize="vertical"
            disabled={disabled}
            fontFamily="body"
            fontSize="15px"
            lineHeight="22px"
            px="3.5"
            py="3"
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            bg="bg"
            color="fg"
            _placeholder={{ color: "fg.muted" }}
            _hover={{ bg: "bg.subtle" }}
            _focusVisible={{
              outline: "none",
              bg: "bg",
              borderColor: "border.medium",
            }}
            _disabled={{
              bg: "bg",
              color: "fg.disabled",
              cursor: "not-allowed",
            }}
          />
        </BorderBeam>
      </Stack>

      <HStack justify="space-between" align="center" gap="3" wrap="wrap">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <PaperclipIcon />
          {files.length === 0 ? "Attach files" : `${files.length} attached`}
        </Button>
        <Text
          fontFamily="body"
          fontSize="13px"
          lineHeight="16px"
          color="fg.muted"
        >
          Plain text or Markdown.
        </Text>
      </HStack>

      {files.length > 0 && (
        <Stack gap="0">
          {files.map((f, i) => (
            <FileRow
              key={`${f.name}-${i}`}
              file={f}
              onRemove={() =>
                setFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
              disabled={disabled}
            />
          ))}
          <Box pt="1.5">
            <Button
              type="button"
              variant="plain"
              size="sm"
              onClick={clearFiles}
              disabled={disabled}
              px="0"
            >
              Clear all
            </Button>
          </Box>
        </Stack>
      )}

      {mutation.isError && (
        <HelperText tone="error">
          Upload failed. {String(mutation.error)}
        </HelperText>
      )}

      <Button
        variant="solid"
        size="lg"
        w="full"
        onClick={hasText ? onAddTextAsFile : onSubmit}
        loading={mutation.isPending}
        disabled={hasText ? false : files.length === 0}
      >
        {hasText ? "Add file" : "Submit for grading"}
      </Button>
    </Stack>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <Text
      as="label"
      {...(htmlFor ? { htmlFor } : {})}
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      color="fg.muted"
      fontWeight="500"
    >
      {children}
    </Text>
  );
}

function FileRow({
  file,
  disabled,
  onRemove,
}: {
  file: File;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <HStack
      gap="3"
      py="2"
      borderBottomWidth="1px"
      borderColor="border.muted"
      _last={{ borderBottomWidth: 0 }}
    >
      <Text
        fontFamily="mono"
        fontSize="13px"
        color="fg"
        flex="1"
        minW="0"
        truncate
      >
        {file.name}
      </Text>
      <Text
        fontFamily="mono"
        fontSize="11px"
        color="fg.muted"
        fontVariantNumeric="tabular-nums"
        flexShrink={0}
      >
        {formatBytes(file.size)}
      </Text>
      <Button
        type="button"
        variant="plain"
        size="sm"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        px="2"
      >
        Remove
      </Button>
    </HStack>
  );
}

function PaperclipIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M21 11.5l-9.5 9.5a5.5 5.5 0 0 1-7.78-7.78l9.5-9.5a3.67 3.67 0 0 1 5.19 5.19l-9.5 9.5a1.83 1.83 0 0 1-2.6-2.6l8.4-8.4" />
    </svg>
  );
}
