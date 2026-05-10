"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { compareCases, type Row } from "@/lib/triage";
import { CaseListRow } from "./CaseListRow";
import {
  DeskFilters,
  type DateFilter,
  type DeskSort,
} from "./DeskFilters";

function dateFilterCutoff(filter: DateFilter, now: number): number | null {
  if (filter === "all") return null;
  const day = 24 * 60 * 60 * 1000;
  if (filter === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (filter === "7d") return now - 7 * day;
  if (filter === "30d") return now - 30 * day;
  return null;
}

function dateMatches(row: Row, cutoff: number | null): boolean {
  if (cutoff === null) return true;
  const created = Date.parse(row.entry.createdAt);
  if (Number.isNaN(created)) return true;
  return created >= cutoff;
}

function rowMatches(row: Row, query: string): boolean {
  if (query.length === 0) return true;
  const haystack: string[] = [row.entry.displayName];
  if (row.summary) {
    for (const t of row.summary.topics) {
      haystack.push(t.title, t.description);
    }
  }
  const q = query.toLowerCase();
  return haystack.some((s) => s.toLowerCase().includes(q));
}

export function ActiveCases({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sort, setSort] = useState<DeskSort>("topTriage");

  const filtered = useMemo(() => {
    const cutoff = dateFilterCutoff(dateFilter, Date.now());
    const q = query.trim();
    return rows.filter(
      (row) => dateMatches(row, cutoff) && rowMatches(row, q),
    );
  }, [rows, query, dateFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // Pinned always above unpinned for the triage default; otherwise the
      // explicit sort key wins.
      if (sort === "topTriage" && a.entry.pinned !== b.entry.pinned) {
        return a.entry.pinned ? -1 : 1;
      }
      const cmp = compareCases(a, b, sort, "desc");
      if (cmp !== 0) return cmp;
      return compareCases(a, b, "lastViewed", "desc");
    });
  }, [filtered, sort]);

  return (
    <Stack gap="6" w="full">
      <Box
        display="flex"
        flexWrap="wrap"
        gap="4"
        rowGap="3"
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Text
          as="h2"
          textStyle={{ base: "heading.lg", md: "display.sm" }}
          color="fg"
        >
          Active cases
        </Text>
        <DeskFilters
          query={query}
          onQueryChange={setQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sort={sort}
          onSortChange={setSort}
        />
      </Box>

      {sorted.length === 0 ? (
        <Box
          key={`empty|${query}|${dateFilter}`}
          borderTopWidth="1px"
          borderColor="border.muted"
          pt="6"
          animation="surfaceIn var(--chakra-durations-swift) var(--chakra-easings-standard) both"
        >
          <Text
            as="span"
            fontFamily="mono"
            fontSize="11px"
            lineHeight="13px"
            letterSpacing="wider"
            textTransform="uppercase"
            fontWeight="500"
            color="fg.muted"
          >
            No matches
          </Text>
          <Text
            as="p"
            fontFamily="body"
            fontSize="14px"
            lineHeight="20px"
            color="fg"
            pt="2"
          >
            {emptyReason(query, dateFilter)}
          </Text>
        </Box>
      ) : (
        <Box
          key={`rows|${query}|${dateFilter}|${sort}`}
          animation="surfaceIn var(--chakra-durations-swift) var(--chakra-easings-standard) both"
        >
          {sorted.map((row, i) => (
            <CaseListRow
              key={row.entry.caseId}
              row={row}
              isFirst={i === 0}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}

function emptyReason(query: string, dateFilter: DateFilter): string {
  const trimmed = query.trim();
  if (trimmed.length > 0) return `No cases match "${trimmed}".`;
  if (dateFilter !== "all") return "No cases in this date range.";
  return "No cases match.";
}
