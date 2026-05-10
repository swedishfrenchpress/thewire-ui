// Display vocabulary for heuristic chips.
//
// Each heuristic in the polarity registry has a verdict word per rating band,
// so the chip's word matches its color: green chips read as good, red chips
// read as bad, orange reads as in-between. Falls back to the bare rating
// label ("HIGH"/"MED"/"LOW") for any heuristic not listed here, so a new
// heuristic name from the agent doesn't break the UI.
//
// Names are matched case-insensitively.

import type { Rating } from "@/lib/types";

const VOCABULARY: Record<string, Record<Rating, string>> = {
  // Negative polarity: high reads as bad → red.
  sensitivity: { high: "Severe", medium: "Notable", low: "Calm" },
  importance: { high: "Heavy", medium: "Moderate", low: "Light" },
  ideology: { high: "Slanted", medium: "Tilted", low: "Neutral" },
  ideology_or_incentives: { high: "Slanted", medium: "Tilted", low: "Neutral" },
  emotive: { high: "Charged", medium: "Tempered", low: "Even" },
  emotive_language: { high: "Charged", medium: "Tempered", low: "Even" },

  // Positive polarity: high reads as good → green.
  consistency: { high: "Solid", medium: "Wavering", low: "Inconsistent" },
  references: { high: "Sourced", medium: "Light", low: "Unsourced" },
  claim_supported: { high: "Backed", medium: "Partial", low: "Unbacked" },
  evidence_quality: { high: "Strong", medium: "Adequate", low: "Weak" },
};

const FALLBACK: Record<Rating, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

export function vocabularyFor(name: string, rating: Rating): string {
  const row = VOCABULARY[name.trim().toLowerCase()];
  return row ? row[rating] : FALLBACK[rating];
}

// Heuristics that are pure counts (claims, validation) carry their number
// inside `description` ("7 factual claim(s) extracted in this topic.").
// Render the number directly instead of a level word — counts have no good /
// bad direction to convey. The structured count field is a follow-up; this
// regex parse is the interim.
export function extractLeadingCount(description: string): number | null {
  const match = description.match(/^\s*(\d+)\b/);
  return match ? Number(match[1]) : null;
}

// Short label that pairs with the extracted count: "12 claims" / "3 validations".
const COUNT_LABEL: Record<string, { singular: string; plural: string }> = {
  claims: { singular: "claim", plural: "claims" },
  validation: { singular: "validation", plural: "validations" },
};

export function countLabelFor(name: string, count: number): string | null {
  const label = COUNT_LABEL[name.trim().toLowerCase()];
  if (!label) return null;
  return count === 1 ? label.singular : label.plural;
}
