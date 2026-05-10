"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getCase } from "./api";
import { TRIAGE_RANK, type Row } from "./triage";
import type { CaseSummary } from "./types";
import { useCases } from "./use-cases";

export type DeskSignal = {
  activeCount: number;
  processingCount: number;
  failedCount: number;
  meanSeverity: number; // 0 = all low, 1 = all high
  highShare: number; // fraction of topics rated high
  lastFilingAgeMs: number; // ms since most recent createdAt; Infinity if none
};

export const IDLE_SIGNAL: DeskSignal = {
  activeCount: 0,
  processingCount: 0,
  failedCount: 0,
  meanSeverity: 0,
  highShare: 0,
  lastFilingAgeMs: Number.POSITIVE_INFINITY,
};

const SEVERITY_SCORE: Record<number, number> = {
  [TRIAGE_RANK.high]: 1,
  [TRIAGE_RANK.medium]: 0.5,
  [TRIAGE_RANK.low]: 0,
};

function computeSignal(rows: Row[], now: number): DeskSignal {
  if (rows.length === 0) return IDLE_SIGNAL;

  let processingCount = 0;
  let failedCount = 0;
  let totalTopics = 0;
  let highTopics = 0;
  let severitySum = 0;
  let mostRecent = 0;

  for (const r of rows) {
    const created = Date.parse(r.entry.createdAt);
    if (!Number.isNaN(created) && created > mostRecent) mostRecent = created;

    const status = r.summary?.status;
    if (status === "processing" || (r.isLoading && !r.summary)) {
      processingCount++;
      continue;
    }
    if (status === "failed" || r.isError) {
      failedCount++;
      continue;
    }
    if (!r.summary) continue;

    for (const t of r.summary.topics) {
      totalTopics++;
      const rank = TRIAGE_RANK[t.triage];
      severitySum += SEVERITY_SCORE[rank] ?? 0;
      if (rank === TRIAGE_RANK.high) highTopics++;
    }
  }

  return {
    activeCount: rows.length,
    processingCount,
    failedCount,
    meanSeverity: totalTopics === 0 ? 0 : severitySum / totalTopics,
    highShare: totalTopics === 0 ? 0 : highTopics / totalTopics,
    lastFilingAgeMs: mostRecent === 0 ? Number.POSITIVE_INFINITY : now - mostRecent,
  };
}

// Single source of truth for the desk's current state. Used by the home page
// (ranked list) and by /file (orb instrumentation + signal readout) so both
// surfaces are reading from the same query store at the same moment.
export function useDeskSignalRows(): { rows: Row[]; signal: DeskSignal } {
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

  const rows = useMemo(() => {
    return entries.map((entry, i) => {
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
    });
  }, [entries, queries]);

  const signal = useMemo(() => computeSignal(rows, Date.now()), [rows]);

  return { rows, signal };
}
