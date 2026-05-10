"use client";

import { Box, HStack, Input, SegmentGroup, Text } from "@chakra-ui/react";
import type { ChangeEvent, KeyboardEvent } from "react";

export type DateFilter = "all" | "today" | "7d" | "30d";
export type DeskSort = "topTriage" | "created" | "lastViewed";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

const SORT_OPTIONS: { value: DeskSort; label: string }[] = [
  { value: "topTriage", label: "Triage" },
  { value: "created", label: "Filed" },
  { value: "lastViewed", label: "Viewed" },
];

export function DeskFilters({
  query,
  onQueryChange,
  dateFilter,
  onDateFilterChange,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (f: DateFilter) => void;
  sort: DeskSort;
  onSortChange: (s: DeskSort) => void;
}) {
  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    if (query.length > 0) {
      onQueryChange("");
    } else if (dateFilter !== "all") {
      onDateFilterChange("all");
    } else {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <HStack gap="3" align="center" wrap="wrap">
      <SegmentGroup.Root
        value={dateFilter}
        onValueChange={(d) => onDateFilterChange((d.value ?? "all") as DateFilter)}
        size="sm"
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={DATE_FILTERS} />
      </SegmentGroup.Root>

      <Box position="relative" w="220px">
        <Box
          position="absolute"
          left="3"
          top="50%"
          transform="translateY(-50%)"
          color="fg.muted"
          pointerEvents="none"
          display="flex"
          alignItems="center"
          aria-hidden
        >
          <SearchIcon />
        </Box>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onSearchKey}
          placeholder="Search cases"
          size="sm"
          fontFamily="body"
          fontSize="13px"
          lineHeight="15px"
          pl="9"
          pr="3"
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
          aria-label="Search cases"
          data-shortcut="search"
        />
      </Box>

      <SortToggle sort={sort} onChange={onSortChange} />
    </HStack>
  );
}

function SortToggle({
  sort,
  onChange,
}: {
  sort: DeskSort;
  onChange: (s: DeskSort) => void;
}) {
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as DeskSort);
  };
  const label = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Triage";

  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wide"
        textTransform="uppercase"
        color="fg.muted"
        pr="1.5"
      >
        Sort
      </Text>
      <Box
        as="span"
        position="relative"
        display="inline-flex"
        alignItems="center"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wide"
        textTransform="uppercase"
        color="fg"
        _hover={{ color: "fg.muted" }}
      >
        <Text as="span" pr="1.5">
          {label}
        </Text>
        <Text as="span" fontSize="9px" color="fg.muted" aria-hidden>
          ▾
        </Text>
        <select
          value={sort}
          onChange={onSelect}
          aria-label="Sort cases"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            appearance: "none",
            WebkitAppearance: "none",
            font: "inherit",
            color: "inherit",
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Box>
    </Box>
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
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
