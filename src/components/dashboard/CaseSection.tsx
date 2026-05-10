"use client";

import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { Row } from "@/lib/triage";
import { CaseCard } from "./CaseCard";
import { SectionHeader, type SectionTone } from "./SectionHeader";

type Props = {
  label: string;
  icon: ReactNode;
  tone: SectionTone;
  rows: Row[];
  cardVariant?: "default" | "processing" | "failed";
  emptyMessage?: string;
};

function CaseSection({
  label,
  icon,
  tone,
  rows,
  cardVariant = "default",
  emptyMessage,
}: Props) {
  return (
    <Box>
      <SectionHeader
        icon={icon}
        label={label}
        tone={tone}
        count={rows.length}
      />
      {rows.length === 0 ? (
        emptyMessage ? (
          <Text
            mt="0"
            mb="2"
            fontFamily="body"
            fontSize="14px"
            lineHeight="18px"
            color="fg.muted"
          >
            {emptyMessage}
          </Text>
        ) : null
      ) : (
        <Box>
          {rows.map((row) => (
            <CaseCard
              key={row.entry.caseId}
              row={row}
              variant={cardVariant}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function ActiveCasesSection({ rows }: { rows: Row[] }) {
  return (
    <CaseSection
      label="Active cases"
      icon={<DocumentIcon />}
      tone="attention"
      rows={rows}
      emptyMessage="No active cases. Upload documents to file the first."
    />
  );
}

export function ProcessingSection({ rows }: { rows: Row[] }) {
  return (
    <CaseSection
      label="Processing"
      icon={<ClockIcon />}
      tone="warning"
      rows={rows}
      cardVariant="processing"
    />
  );
}

export function FailedSection({ rows }: { rows: Row[] }) {
  return (
    <CaseSection
      label="Failed"
      icon={<AlertIcon />}
      tone="attention"
      rows={rows}
      cardVariant="failed"
    />
  );
}

function DocumentIcon() {
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
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h7" />
      <path d="M9 17h7" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon() {
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
      <path d="M12 4l10 17H2z" />
      <path d="M12 10v5" />
      <path d="M12 18v.5" />
    </svg>
  );
}
