import type { CaseSummary, CategorySummary, Rating } from "@/lib/types";
import type { CaseEntry } from "@/lib/cases-store";

export const TRIAGE_RANK: Record<Rating, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface TriageMixCounts {
  high: number;
  medium: number;
  low: number;
}

const ZERO_MIX: TriageMixCounts = { high: 0, medium: 0, low: 0 };

export function triageMix(categories: CategorySummary[]): TriageMixCounts {
  const out: TriageMixCounts = { high: 0, medium: 0, low: 0 };
  for (const c of categories) out[c.triage]++;
  return out;
}

export function topTriage(categories: CategorySummary[]): Rating | null {
  if (categories.length === 0) return null;
  let best: Rating = "low";
  for (const c of categories) {
    if (TRIAGE_RANK[c.triage] < TRIAGE_RANK[best]) best = c.triage;
    if (best === "high") break;
  }
  return best;
}

export type SortKey = "topTriage" | "lastViewed" | "created" | "name" | "documents";
export type SortDir = "asc" | "desc";

export interface Row {
  entry: CaseEntry;
  summary: CaseSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Each key has a "natural" direction (descending for triage / recency / docs,
// ascending for name). The dir param flips that natural order.
function isAscNatural(key: SortKey): boolean {
  return key === "name";
}

function naturalCompare(a: Row, b: Row, key: SortKey): number {
  if (key === "topTriage") {
    const aTop = a.summary ? topTriage(a.summary.categories) : null;
    const bTop = b.summary ? topTriage(b.summary.categories) : null;
    const aRank = aTop ? TRIAGE_RANK[aTop] : 999;
    const bRank = bTop ? TRIAGE_RANK[bTop] : 999;
    if (aRank !== bRank) return aRank - bRank;
    const aMix = a.summary ? triageMix(a.summary.categories) : ZERO_MIX;
    const bMix = b.summary ? triageMix(b.summary.categories) : ZERO_MIX;
    if (aMix.high !== bMix.high) return bMix.high - aMix.high;
    if (aMix.medium !== bMix.medium) return bMix.medium - aMix.medium;
    return Date.parse(b.entry.createdAt) - Date.parse(a.entry.createdAt);
  }
  if (key === "lastViewed") {
    return Date.parse(b.entry.lastViewedAt) - Date.parse(a.entry.lastViewedAt);
  }
  if (key === "created") {
    return Date.parse(b.entry.createdAt) - Date.parse(a.entry.createdAt);
  }
  if (key === "documents") {
    const aDoc = a.summary?.document_count ?? -1;
    const bDoc = b.summary?.document_count ?? -1;
    return bDoc - aDoc;
  }
  return a.entry.displayName.localeCompare(b.entry.displayName, undefined, {
    sensitivity: "base",
  });
}

export function compareCases(
  a: Row,
  b: Row,
  key: SortKey,
  dir: SortDir,
): number {
  const flip = (dir === "asc") === isAscNatural(key) ? 1 : -1;
  return naturalCompare(a, b, key) * flip;
}
