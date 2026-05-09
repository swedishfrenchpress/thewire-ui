"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/Dialog";
import { FileUploadArea } from "@/components/FileUploadArea";
import { HelperText } from "@/components/HelperText";
import { createCase } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import {
  deriveDisplayName,
  formatBytes,
  readFileAsText,
} from "@/lib/upload-helpers";

type Props = {
  open: boolean;
  initialFiles?: File[];
  onClose: () => void;
};

const MAX_FILES = 5;

export function UploadModal({ open, initialFiles = [], onClose }: Props) {
  const [reportText, setReportText] = useState("");
  const [files, setFiles] = useState<File[]>(initialFiles);

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
        // TODO: switch to a per-document `description` field when the backend ships it.
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
      onClose();
      toast.success("Case created", {
        description: `${displayName}, ${count} document${count === 1 ? "" : "s"}`,
      });
    },
  });

  useEffect(() => {
    if (open) {
      setReportText("");
      setFiles(initialFiles);
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContent = reportText.trim().length > 0 || files.length > 0;

  const onSubmit = () => {
    if (!hasContent || mutation.isPending) return;
    mutation.mutate({ text: reportText, selected: files });
  };

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open && !mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>New case</Dialog.Title>
          <Dialog.Description>
            Type a report, attach documents, or both. We triage what you send.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="6">
            <Stack gap="2">
              <FieldLabel>What is the report?</FieldLabel>
              <Textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe what happened. When, where, who was involved."
                minH="160px"
                resize="vertical"
                disabled={mutation.isPending}
                fontFamily="body"
                fontSize="14px"
                lineHeight="20px"
                px="3"
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

            <Stack gap="2">
              <FieldLabel>Attach documents (optional)</FieldLabel>
              <Box w="full">
                <FileUploadArea
                  files={files}
                  onChange={setFiles}
                  accept="text/plain,.txt,.md"
                  hint="Plain text or Markdown"
                  maxFiles={MAX_FILES}
                  disabled={mutation.isPending}
                />
              </Box>
            </Stack>

            {files.length > 0 && (
              <Stack gap="2">
                <FieldLabel>Selected ({files.length})</FieldLabel>
                <Stack gap="0">
                  {files.map((f, i) => (
                    <FileRow
                      key={`${f.name}-${i}`}
                      file={f}
                      disabled={mutation.isPending}
                      onRemove={() => removeFile(i)}
                    />
                  ))}
                </Stack>
              </Stack>
            )}

            {mutation.isError && (
              <HelperText tone="error">
                Upload failed: {String(mutation.error)}
              </HelperText>
            )}
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" flex="1" disabled={mutation.isPending}>
              Cancel
            </Button>
          </Dialog.ActionTrigger>
          <Button
            variant="solid"
            flex="1"
            onClick={onSubmit}
            loading={mutation.isPending}
            disabled={!hasContent}
          >
            Create case
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="label"
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
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      py="2"
      borderBottomWidth="1px"
      borderColor="border.muted"
      _last={{ borderBottomWidth: 0 }}
    >
      <Box minW="0" flex="1">
        <Text
          fontFamily="mono"
          fontSize="13px"
          color="fg"
          truncate
        >
          {file.name}
        </Text>
      </Box>
      <Text
        fontFamily="mono"
        fontSize="11px"
        color="fg.muted"
        fontVariantNumeric="tabular-nums"
        flexShrink={0}
      >
        {formatBytes(file.size)}
      </Text>
      <IconButton
        type="button"
        aria-label={`Remove ${file.name}`}
        size="2xs"
        variant="ghost"
        disabled={disabled}
        onClick={onRemove}
      >
        <RemoveIcon />
      </IconButton>
    </Box>
  );
}

function RemoveIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M3 3l10 10" />
      <path d="M13 3L3 13" />
    </svg>
  );
}
