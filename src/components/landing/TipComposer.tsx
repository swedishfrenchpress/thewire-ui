"use client";

import { Box, Button, HStack, Stack, Text, Textarea } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { HelperText } from "@/components/HelperText";
import { createCase } from "@/lib/api";
import { notify } from "@/lib/notify";
import { casesStore } from "@/lib/cases-store";
import {
  deriveDisplayName,
  formatBytes,
  readFileAsText,
} from "@/lib/upload-helpers";

const ACCEPT = "text/plain,.txt,.md";

export function TipComposer() {
  const router = useRouter();
  const [reportText, setReportText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      text,
      selected,
    }: {
      text: string;
      selected: File[];
    }) => {
      const documents = await Promise.all(
        selected.map(async (f) => ({
          filename: f.name,
          content: await readFileAsText(f),
        })),
      );
      const trimmed = text.trim();
      if (trimmed.length > 0) {
        // TODO: switch to a per-document `description` field when backend ships it.
        documents.unshift({ filename: "report.txt", content: trimmed });
      }
      const result = await createCase({ documents });
      return {
        result,
        displayName: deriveDisplayName(text, selected),
        count: documents.length,
      };
    },
    onSuccess: ({ result, displayName, count }) => {
      casesStore.addCase(result.case_id, displayName);
      setReportText("");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      router.push(`/cases/${result.case_id}`);
      notify.filed(`Analyzing ${displayName}`, {
        meta: `Case #${String(result.case_id).padStart(5, "0")} · ${count} document${count === 1 ? "" : "s"} · processing`,
      });
    },
  });

  const hasContent = reportText.trim().length > 0 || files.length > 0;
  const disabled = mutation.isPending;

  const onPickFiles = (incoming: FileList | null) => {
    if (!incoming || disabled) return;
    const next = Array.from(incoming);
    setFiles(next);
  };

  const clearFiles = () => {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = () => {
    if (!hasContent || disabled) return;
    mutation.mutate({ text: reportText, selected: files });
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
            borderColor: "border.strong",
          }}
          _disabled={{
            bg: "bg",
            color: "fg.disabled",
            cursor: "not-allowed",
          }}
        />
      </Stack>

      <HStack justify="space-between" align="center" gap="3" wrap="wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <PaperclipIcon />
          {files.length === 0
            ? "Attach files"
            : `${files.length} attached`}
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
        onClick={onSubmit}
        loading={mutation.isPending}
        disabled={!hasContent}
      >
        File and grade
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
