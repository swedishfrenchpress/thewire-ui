"use client";

import { Box } from "@chakra-ui/react";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { CaseFilters, type StatusFilters } from "@/components/dashboard/CaseFilters";
import { CaseList } from "@/components/dashboard/CaseList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { getCase } from "@/lib/api";
import { compareCases, type Row, type SortDir, type SortKey } from "@/lib/triage";
import type { CaseSummary } from "@/lib/types";
import { useCases } from "@/lib/use-cases";

const ALL_STATUS: StatusFilters = {
  processing: true,
  complete: true,
  failed: true,
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const entries = useCases();

  const queries = useQueries({
    queries: entries.map((e) => ({
      queryKey: ["case", e.caseId] as const,
      queryFn: () => getCase(e.caseId),
      refetchInterval: (q: { state: { data?: CaseSummary } }) =>
        q.state.data?.status === "processing" ? 3000 : false,
      staleTime: 30_000,
      retry: 2,
    })),
  });

  const rows: Row[] = useMemo(
    () =>
      entries.map((entry, i) => {
        const q = queries[i];
        return {
          entry,
          summary: q?.data,
          isLoading: q?.isLoading ?? false,
          isError: q?.isError ?? false,
          refetch: () => {
            q?.refetch();
          },
        };
      }),
    [entries, queries],
  );

  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "topTriage",
    dir: "desc",
  });
  const [statusFilters, setStatusFilters] =
    useState<StatusFilters>(ALL_STATUS);
  const [search, setSearch] = useState("");

  const { pinned, unpinned } = useMemo(() => {
    let r = rows;
    const q = search.trim().toLowerCase();
    if (q) {
      r = r.filter((row) =>
        row.entry.displayName.toLowerCase().includes(q),
      );
    }
    const allOn =
      statusFilters.processing &&
      statusFilters.complete &&
      statusFilters.failed;
    if (!allOn) {
      r = r.filter((row) => {
        if (!row.summary) return true;
        return statusFilters[row.summary.status];
      });
    }
    const cmp = (a: Row, b: Row) => compareCases(a, b, sort.key, sort.dir);
    return {
      pinned: r.filter((x) => x.entry.pinned).slice().sort(cmp),
      unpinned: r.filter((x) => !x.entry.pinned).slice().sort(cmp),
    };
  }, [rows, sort, statusFilters, search]);

  if (!mounted) {
    return <Box maxW="1280px" mx="auto" px="6" py="6" minH="60vh" />;
  }

  return (
    <Box maxW="1280px" mx="auto" px="6" py="6">
      <DashboardHeader rows={rows} />
      {entries.length > 0 && (
        <CaseFilters
          sort={sort}
          onSortChange={setSort}
          statusFilters={statusFilters}
          onStatusFiltersChange={setStatusFilters}
          search={search}
          onSearchChange={setSearch}
        />
      )}
      <CaseList
        pinned={pinned}
        unpinned={unpinned}
        hasAnyEntries={entries.length > 0}
        sort={sort}
        onSortChange={setSort}
        onClearFilters={() => {
          setStatusFilters(ALL_STATUS);
          setSearch("");
        }}
      />
    </Box>
  );
}
