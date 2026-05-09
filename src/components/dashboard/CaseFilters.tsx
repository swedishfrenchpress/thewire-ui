"use client";

import { Box, Button, HStack, Input, NativeSelect } from "@chakra-ui/react";
import type { CaseStatus } from "@/lib/types";
import type { SortDir, SortKey } from "@/lib/triage";

export type StatusFilters = Record<CaseStatus, boolean>;

const STATUSES: CaseStatus[] = ["processing", "complete", "failed"];

const STATUS_LABELS: Record<CaseStatus, string> = {
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};

type Props = {
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (s: { key: SortKey; dir: SortDir }) => void;
  statusFilters: StatusFilters;
  onStatusFiltersChange: (f: StatusFilters) => void;
  search: string;
  onSearchChange: (s: string) => void;
};

export function CaseFilters({
  sort,
  onSortChange,
  statusFilters,
  onStatusFiltersChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <HStack
      gap="4"
      py="3"
      borderBottomWidth="1px"
      borderColor="border.muted"
      wrap="wrap"
      align="center"
    >
      <HStack gap="2" align="center">
        <Box
          as="span"
          fontFamily="mono"
          fontSize="10px"
          lineHeight="12px"
          letterSpacing="wide"
          textTransform="uppercase"
          color="fg.muted"
        >
          Sort
        </Box>
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field
            value={sort.key}
            onChange={(e) =>
              onSortChange({
                key: e.target.value as SortKey,
                dir: sort.dir,
              })
            }
            aria-label="Sort cases by"
          >
            <option value="topTriage">Top triage</option>
            <option value="lastViewed">Last viewed</option>
            <option value="created">Created</option>
            <option value="name">Name</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onSortChange({
              key: sort.key,
              dir: sort.dir === "asc" ? "desc" : "asc",
            })
          }
          aria-label={`Toggle sort direction; current ${sort.dir}`}
        >
          {sort.dir === "asc" ? "↑" : "↓"}
        </Button>
      </HStack>

      <HStack gap="1">
        {STATUSES.map((s) => {
          const active = statusFilters[s];
          return (
            <Button
              key={s}
              size="sm"
              variant={active ? "solid" : "outline"}
              aria-pressed={active}
              onClick={() =>
                onStatusFiltersChange({ ...statusFilters, [s]: !active })
              }
            >
              {STATUS_LABELS[s]}
            </Button>
          );
        })}
      </HStack>

      <Box ml="auto" position="relative" minW="240px" flex="0 1 320px">
        <Box
          position="absolute"
          left="3"
          top="50%"
          transform="translateY(-50%)"
          color="fg.muted"
          pointerEvents="none"
          display="inline-flex"
        >
          <SearchIcon />
        </Box>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name"
          size="sm"
          pl="9"
          aria-label="Filter cases by name"
        />
      </Box>
    </HStack>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}
