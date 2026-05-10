import type { CaseEntry } from "@/lib/cases-store";
import type {
  CaseSummary,
  DocumentRecord,
  Heuristic,
  Rating,
  TopicSummary,
} from "@/lib/types";

export const TRIAGE_RANK: Record<Rating, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const TRIAGE_LABELS: Record<Rating, string> = {
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

export interface TriageMixCounts {
  high: number;
  medium: number;
  low: number;
}

const ZERO_MIX: TriageMixCounts = { high: 0, medium: 0, low: 0 };

export function triageMix(topics: TopicSummary[]): TriageMixCounts {
  const out: TriageMixCounts = { high: 0, medium: 0, low: 0 };
  for (const t of topics) out[t.triage]++;
  return out;
}

// Placeholder corroboration score (0-100) until the API returns one per topic.
// Deterministic from caseId so the same case shows the same number across renders.
// Range biased to 60-95 for plausible demo values; tighten or widen when real
// scores arrive.
export function corroborationScore(caseId: number): number {
  const mixed = Math.imul(caseId | 0, 2654435761) >>> 0;
  return 60 + (mixed % 36);
}

export function topTriage(topics: TopicSummary[]): Rating | null {
  if (topics.length === 0) return null;
  let best: Rating = "low";
  for (const t of topics) {
    if (TRIAGE_RANK[t.triage] < TRIAGE_RANK[best]) best = t.triage;
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
    const aTop = a.summary ? topTriage(a.summary.topics) : null;
    const bTop = b.summary ? topTriage(b.summary.topics) : null;
    const aRank = aTop ? TRIAGE_RANK[aTop] : 999;
    const bRank = bTop ? TRIAGE_RANK[bTop] : 999;
    if (aRank !== bRank) return aRank - bRank;
    const aMix = a.summary ? triageMix(a.summary.topics) : ZERO_MIX;
    const bMix = b.summary ? triageMix(b.summary.topics) : ZERO_MIX;
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

// --- Distribution math (used by the topic + document detail pages) ---

export function maxSeverity(ratings: Rating[]): Rating | null {
  if (ratings.length === 0) return null;
  return ratings.reduce<Rating>(
    (acc, r) => (TRIAGE_RANK[r] < TRIAGE_RANK[acc] ? r : acc),
    "low",
  );
}

export function documentTriage(doc: { heuristics: Heuristic[] }): Rating {
  return maxSeverity(doc.heuristics.map((h) => h.rating)) ?? "low";
}

export interface DistributionSegment {
  rating: Rating;
  count: number;
  pct: number;
  items: string[];
}

export interface Distribution {
  total: number;
  segments: Record<Rating, DistributionSegment>;
  ordered: DistributionSegment[];
  dominant: Rating | null;
  headline: string;
}

const ORDER: Rating[] = ["high", "medium", "low"];

export function distribute<T>(
  items: T[],
  getRating: (item: T) => Rating,
  getLabel: (item: T) => string,
  unitLabel: string,
): Distribution {
  const segments: Record<Rating, DistributionSegment> = {
    high: { rating: "high", count: 0, pct: 0, items: [] },
    medium: { rating: "medium", count: 0, pct: 0, items: [] },
    low: { rating: "low", count: 0, pct: 0, items: [] },
  };

  for (const it of items) {
    const r = getRating(it);
    segments[r].count += 1;
    segments[r].items.push(getLabel(it));
  }

  const total = items.length;
  for (const r of ORDER) {
    segments[r].pct = total === 0 ? 0 : (segments[r].count / total) * 100;
  }

  let dominant: Rating | null = null;
  if (total > 0) {
    dominant = ORDER.reduce<Rating>(
      (acc, r) => (segments[r].count > segments[acc].count ? r : acc),
      "low",
    );
    if (segments[dominant].count === 0) dominant = null;
  }

  const headline =
    dominant === null
      ? `No ${unitLabel} to score.`
      : `${segments[dominant].count} of ${total} ${unitLabel} rate ${TRIAGE_LABELS[dominant]}.`;

  return {
    total,
    segments,
    ordered: ORDER.map((r) => segments[r]),
    dominant,
    headline,
  };
}

export function distributeDocuments(docs: DocumentRecord[]): Distribution {
  return distribute(
    docs,
    (d) => documentTriage(d),
    (d) => d.filename,
    "documents",
  );
}

export function distributeHeuristics(heuristics: Heuristic[]): Distribution {
  return distribute(
    heuristics,
    (h) => h.rating,
    (h) => h.name,
    "heuristics",
  );
}
