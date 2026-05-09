"use client";

import { Box, Button, Stack, Table, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { Row, SortDir, SortKey } from "@/lib/triage";
import { CaseRow } from "./CaseRow";

type Column = {
  key: SortKey | null;
  label: string;
  width?: string;
  align?: "left" | "right";
};

const COLUMNS: Column[] = [
  { key: null, label: "", width: "40px" },
  { key: "name", label: "Name" },
  { key: "topTriage", label: "Triage", width: "92px" },
  { key: null, label: "Mix", width: "120px" },
  { key: "documents", label: "Docs", width: "70px", align: "right" },
  { key: null, label: "Status", width: "160px" },
  { key: "created", label: "Created", width: "78px", align: "right" },
];

type Props = {
  pinned: Row[];
  unpinned: Row[];
  hasAnyEntries: boolean;
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (s: { key: SortKey; dir: SortDir }) => void;
  onClearFilters: () => void;
};

export function CaseList({
  pinned,
  unpinned,
  hasAnyEntries,
  sort,
  onSortChange,
  onClearFilters,
}: Props) {
  if (!hasAnyEntries) {
    return (
      <Stack
        align="center"
        py="24"
        px="6"
        gap="5"
        bg="bg.subtle"
        mt="6"
        borderRadius="sm"
        textAlign="center"
      >
        <EmptyStateIcon />
        <Stack gap="2" align="center" maxW="md">
          <Text
            fontFamily="heading"
            fontSize="20px"
            lineHeight="26px"
            letterSpacing="tight"
            color="fg"
          >
            No cases yet
          </Text>
          <Text fontFamily="body" fontSize="14px" color="fg.muted">
            Upload plain text or Markdown documents to start a case. The wire
            will triage and categorize them.
          </Text>
        </Stack>
        <Button asChild variant="solid" size="md">
          <NextLink href="/upload">Upload files</NextLink>
        </Button>
      </Stack>
    );
  }

  const totalVisible = pinned.length + unpinned.length;

  if (totalVisible === 0) {
    return (
      <Stack align="center" py="12" gap="3">
        <Text fontFamily="body" fontSize="14px" color="fg.muted">
          No cases match these filters.
        </Text>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Stack>
    );
  }

  const onHeaderClick = (key: SortKey | null) => {
    if (!key) return;
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: "desc" });
    }
  };

  return (
    <Box mt="2">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map((c, i) => (
              <Table.ColumnHeader
                key={i}
                w={c.width}
                textAlign={c.align}
                cursor={c.key ? "pointer" : "default"}
                onClick={() => onHeaderClick(c.key)}
                userSelect="none"
                _hover={c.key ? { color: "fg" } : undefined}
              >
                {c.label}
                {c.key && sort.key === c.key && (
                  <Box as="span" ml="1">
                    {sort.dir === "asc" ? "↑" : "↓"}
                  </Box>
                )}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        {pinned.length > 0 && (
          <Table.Body>
            {pinned.map((r) => (
              <CaseRow key={r.entry.caseId} row={r} />
            ))}
            <Table.Row aria-hidden>
              <Table.Cell
                colSpan={COLUMNS.length}
                p="0"
                h="1px"
                bg="border"
                borderBottom="none"
              />
            </Table.Row>
          </Table.Body>
        )}

        {unpinned.length > 0 && (
          <Table.Body>
            {unpinned.map((r) => (
              <CaseRow key={r.entry.caseId} row={r} />
            ))}
          </Table.Body>
        )}
      </Table.Root>
    </Box>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      style={{ color: "var(--chakra-colors-fg-muted)" }}
    >
      <path d="M10 14h12l3 3h13v22H10z" />
      <path d="M24 22v10" />
      <path d="M20 26l4-4 4 4" />
    </svg>
  );
}
