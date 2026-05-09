"use client";

import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FileUploadArea } from "@/components/FileUploadArea";
import { HelperText } from "@/components/HelperText";
import { createCase } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function deriveDisplayName(files: File[]): string {
  if (files.length === 0) return "Untitled case";
  const first = files[0].name;
  const base = first.replace(/\.[^.]+$/, "").trim() || first;
  if (files.length === 1) return base;
  return `${base} + ${files.length - 1} more`;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

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
      router.push(`/cases/${result.case_id}`);
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;
    mutation.mutate(files);
  };

  return (
    <Container maxW="3xl" py="12">
      <Stack gap="6">
        <Heading size="3xl">Upload</Heading>
        <form onSubmit={onSubmit}>
          <Stack gap="4">
            <FileUploadArea
              files={files}
              onChange={setFiles}
              accept="text/plain,.txt,.md"
              hint="Plain text or Markdown"
              disabled={mutation.isPending}
            />

            {mutation.isError && (
              <HelperText tone="error">
                Upload failed: {String(mutation.error)}
              </HelperText>
            )}

            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={files.length === 0}
              alignSelf="flex-start"
            >
              Upload {files.length} file{files.length === 1 ? "" : "s"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
