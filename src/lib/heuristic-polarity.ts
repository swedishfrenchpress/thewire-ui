// Polarity registry for heuristic-rating coloring.
//
// API.md: "Polarity is heuristic-specific; for unknown heuristic names, render
// the rating neutrally and rely on the description."
//
// - "positive" heuristics: HIGH = good for the journalist (green),
//   LOW = bad (red). Example: `consistency`, `references`.
// - "negative" heuristics: HIGH = bad / concerning (red),
//   LOW = good (green). Example: `emotive`, `ideology`.
// - MEDIUM is always orange regardless of polarity.
// - Unknown polarity renders gray-neutral.
//
// Names are matched case-insensitively. Extend this map as the agent's
// heuristic vocabulary stabilizes.

export type Polarity = "positive" | "negative" | "unknown";

const REGISTRY: Record<string, Polarity> = {
  consistency: "positive",
  references: "positive",
  emotive: "negative",
  ideology: "negative",
};

export function polarityFor(name: string): Polarity {
  return REGISTRY[name.trim().toLowerCase()] ?? "unknown";
}
