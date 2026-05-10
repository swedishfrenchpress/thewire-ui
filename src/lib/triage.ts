import type { CaseEntry } from "@/lib/cases-store";
import { polarityOf } from "@/lib/heuristic-polarity";
import type {
  CaseSummary,
  DocumentRecord,
  Heuristic,
  Rating,
  TopicSummary,
} from "@/lib/types";

// A document's verdict is polarity-aware: it asks "how concerning is this?",
// not "what's the highest raw rating present?" A document scored entirely on
// positive-polarity highs (strong evidence, solid consistency) is HEALTHY,
// not CONCERNING, even though those heuristics are stored as rating="high".
export type Verdict = "healthy" | "mixed" | "concerning";

export const VERDICT_LABELS: Record<Verdict, string> = {
  healthy: "Healthy",
  mixed: "Mixed",
  concerning: "Concerning",
};

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

export function topTopic(topics: TopicSummary[]): TopicSummary | null {
  if (topics.length === 0) return null;
  return [...topics].sort(
    (a, b) => TRIAGE_RANK[a.triage] - TRIAGE_RANK[b.triage],
  )[0];
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

// Polarity-aware document verdict. Counts "bad highs" (negative-polarity
// rated high, or positive-polarity rated low) and "good highs" (the inverse).
// Unknown-polarity heuristics (counts like `claims`) don't move the needle.
export function documentVerdict(doc: { heuristics: Heuristic[] }): Verdict {
  let bad = 0;
  let good = 0;
  for (const h of doc.heuristics) {
    const polarity = polarityOf(h);
    if (polarity === "unknown") continue;
    if (h.rating === "medium") continue;
    const isGood =
      (polarity === "positive" && h.rating === "high") ||
      (polarity === "negative" && h.rating === "low");
    if (isGood) good++;
    else bad++;
  }
  if (bad === 0 && good === 0) return "mixed";
  if (bad === 0) return "healthy";
  if (good === 0) return "concerning";
  return bad > good ? "concerning" : "mixed";
}

// --- Verdict-keyed distribution (per-heuristic and per-document) ---

// Per-heuristic verdict. Mirrors documentVerdict but for a single heuristic:
// negative-HIGH or positive-LOW reads concerning; the inverse reads healthy;
// medium ratings and unknown-polarity heuristics are mixed.
export function heuristicVerdict(h: Heuristic): Verdict {
  if (h.rating === "medium") return "mixed";
  const polarity = polarityOf(h);
  if (polarity === "unknown") return "mixed";
  const isGood =
    (polarity === "positive" && h.rating === "high") ||
    (polarity === "negative" && h.rating === "low");
  return isGood ? "healthy" : "concerning";
}

export interface VerdictDistributionSegment {
  verdict: Verdict;
  count: number;
  pct: number;
  items: string[];
}

export interface VerdictDistribution {
  total: number;
  segments: Record<Verdict, VerdictDistributionSegment>;
  ordered: VerdictDistributionSegment[];
  dominant: Verdict | null;
  headline: string;
}

// Bar order matches the chip color ramp: red → orange → green.
const VERDICT_ORDER: Verdict[] = ["concerning", "mixed", "healthy"];

const HEADLINE_VERB: Record<Verdict, string> = {
  concerning: "concerning",
  mixed: "mixed",
  healthy: "healthy",
};

export function distributeByVerdict<T>(
  items: T[],
  getVerdict: (item: T) => Verdict,
  getLabel: (item: T) => string,
  unitLabel: string,
): VerdictDistribution {
  const segments: Record<Verdict, VerdictDistributionSegment> = {
    concerning: { verdict: "concerning", count: 0, pct: 0, items: [] },
    mixed: { verdict: "mixed", count: 0, pct: 0, items: [] },
    healthy: { verdict: "healthy", count: 0, pct: 0, items: [] },
  };

  for (const it of items) {
    const v = getVerdict(it);
    segments[v].count += 1;
    segments[v].items.push(getLabel(it));
  }

  const total = items.length;
  for (const v of VERDICT_ORDER) {
    segments[v].pct = total === 0 ? 0 : (segments[v].count / total) * 100;
  }

  let dominant: Verdict | null = null;
  if (total > 0) {
    dominant = VERDICT_ORDER.reduce<Verdict>(
      (acc, v) => (segments[v].count > segments[acc].count ? v : acc),
      "healthy",
    );
    if (segments[dominant].count === 0) dominant = null;
  }

  const headline =
    dominant === null
      ? `No ${unitLabel} to score.`
      : `${segments[dominant].count} of ${total} ${unitLabel} read as ${HEADLINE_VERB[dominant]}.`;

  return {
    total,
    segments,
    ordered: VERDICT_ORDER.map((v) => segments[v]),
    dominant,
    headline,
  };
}

export function distributeHeuristicsByVerdict(
  heuristics: Heuristic[],
): VerdictDistribution {
  return distributeByVerdict(
    heuristics,
    (h) => heuristicVerdict(h),
    (h) => h.name,
    "signals",
  );
}

export function distributeDocumentsByVerdict(
  docs: DocumentRecord[],
): VerdictDistribution {
  return distributeByVerdict(
    docs,
    (d) => documentVerdict(d),
    (d) => d.filename,
    "documents",
  );
}
