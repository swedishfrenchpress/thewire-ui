"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getCase } from "@/lib/api";
import type { CaseSummary } from "@/lib/types";

export const FAST_INTERVAL_MS = 2_000;
export const SLOW_INTERVAL_MS = 5_000;
export const FAST_WINDOW_MS = 30_000;
export const HARD_CAP_MS = 5 * 60 * 1_000;

export interface UseCaseResult {
  query: UseQueryResult<CaseSummary, unknown>;
  elapsedMs: number;
  cappedOut: boolean;
  isProcessing: boolean;
}

export function useCase(
  caseId: number | null,
  options?: { enabled?: boolean },
): UseCaseResult {
  const idValid = caseId !== null && Number.isFinite(caseId);
  const enabled = idValid && (options?.enabled ?? true);

  const mountedAtRef = useRef<number>(Date.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
    setTick(0);
  }, [caseId]);

  const query = useQuery<CaseSummary>({
    queryKey: ["case", caseId],
    queryFn: () => getCase(caseId as number),
    enabled,
    refetchIntervalInBackground: false,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status !== "processing") return false;
      const elapsed = Date.now() - mountedAtRef.current;
      if (elapsed > HARD_CAP_MS) return false;
      return elapsed < FAST_WINDOW_MS ? FAST_INTERVAL_MS : SLOW_INTERVAL_MS;
    },
  });

  const isProcessing = query.data?.status === "processing";

  useEffect(() => {
    if (!isProcessing) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1_000);
    return () => window.clearInterval(id);
  }, [isProcessing]);

  const elapsedMs = Date.now() - mountedAtRef.current;
  const cappedOut = isProcessing && elapsedMs > HARD_CAP_MS;

  return { query, elapsedMs, cappedOut, isProcessing };
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
