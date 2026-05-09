"use client";

import { Box, Button, IconButton, Stack, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export function UploadModal({ open, initialFiles = [], onClose }: Props) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>(initialFiles);

  const mutation = useMutation({
    mutationFn: async (selected: File[]) => {
      const documents = await Promise.all(
        selected.map(async (f) => ({
          filename: f.name,
          content: await readFileAsText(f),
        })),
      );
      const result = await createCase({ documents });
      return { result, displayName: deriveDisplayName(selected) };
    },
    onSuccess: ({ result, displayName }) => {
      casesStore.addCase(result.case_id, displayName);
      onClose();
      router.push(`/cases/${result.case_id}`);
    },
  });

  // Reset internal state whenever the modal is opened (or seeded with new files).
  useEffect(() => {
    if (open) {
      setFiles(initialFiles);
      mutation.reset();
    }
    // intentionally exclude mutation from deps — it's only reset on open transitions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    if (files.length === 0 || mutation.isPending) return;
    mutation.mutate(files);
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
            Drop documents to create a case. Plain text or Markdown, up to 10
            files.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="4">
            <Box w="full">
              <FileUploadArea
                files={files}
                onChange={setFiles}
                accept="text/plain,.txt,.md"
                hint="Plain text or Markdown"
                disabled={mutation.isPending}
              />
            </Box>

            {files.length > 0 && (
              <Stack gap="2">
                <Text
                  fontFamily="mono"
                  fontSize="11px"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  color="fg.muted"
                  fontWeight="500"
                >
                  Selected ({files.length})
                </Text>
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
            disabled={files.length === 0}
          >
            Create case ({files.length} file{files.length === 1 ? "" : "s"})
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
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
