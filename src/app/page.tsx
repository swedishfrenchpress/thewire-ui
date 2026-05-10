"use client";

import { Box } from "@chakra-ui/react";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ActiveCases } from "@/components/dashboard/ActiveCases";
import { OrbHero } from "@/components/landing/OrbHero";
import { TipComposer } from "@/components/landing/TipComposer";
import { getCase } from "@/lib/api";
import { compareCases, type Row } from "@/lib/triage";
import type { CaseSummary } from "@/lib/types";
import { useCases } from "@/lib/use-cases";

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
        q.state.data?.status === "processing" ? 5000 : false,
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

  const sortedRows = useMemo(() => sortRows(rows), [rows]);

  if (!mounted) {
    return <Box minH="60vh" />;
  }

  return (
    <>
      <OrbHero />
      <Box maxW="640px" mx="auto" px="6" pb="10">
        <TipComposer />
      </Box>
      {sortedRows.length > 0 && (
        <Box
          maxW="1200px"
          mx="auto"
          px="6"
          pb="20"
          borderTopWidth="1px"
          borderColor="border.muted"
          pt="8"
        >
          <ActiveCases rows={sortedRows} />
        </Box>
      )}
    </>
  );
}

function sortRows(rows: Row[]): Row[] {
  const active: Row[] = [];
  const processing: Row[] = [];
  const failed: Row[] = [];

  for (const r of rows) {
    const status = r.summary?.status;
    if (status === "processing" || (r.isLoading && !r.summary)) {
      processing.push(r);
    } else if (status === "failed" || r.isError) {
      failed.push(r);
    } else {
      active.push(r);
    }
  }

  active.sort((a, b) => {
    if (a.entry.pinned !== b.entry.pinned) return a.entry.pinned ? -1 : 1;
    const triageCmp = compareCases(a, b, "topTriage", "desc");
    if (triageCmp !== 0) return triageCmp;
    return compareCases(a, b, "lastViewed", "desc");
  });

  processing.sort((a, b) => compareCases(a, b, "lastViewed", "desc"));
  failed.sort((a, b) => compareCases(a, b, "created", "desc"));

  return [...active, ...processing, ...failed];
}
