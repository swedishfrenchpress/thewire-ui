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
  // Document-level signals.
  consistency: "positive",
  references: "positive",
  emotive: "negative",
  emotive_language: "negative",
  ideology: "negative",
  ideology_or_incentives: "negative",
  claim_supported: "positive",

  // Topic-level signals.
  // sensitivity drives the topic's triage directly: HIGH = severe content.
  sensitivity: "negative",
  // importance is HIGH when the topic carries specific allegations or risk.
  importance: "negative",
  // evidence_quality caps the triage: HIGH evidence is good for the journalist.
  evidence_quality: "positive",
  // claims and validation are count metrics, not directional. Leave neutral.

  // Group heuristics (model-derived, cross-document) — see API.md.
  corroboration: "positive",
  shared_references: "positive",
  timeline_coherence: "positive",
  // The API marks contested_narrative and temporal_scope as positive even
  // though their descriptions call them review-context signals; we honor the
  // API's tag.
  contested_narrative: "positive",
  temporal_scope: "positive",
  coordinated_framing: "negative",
  shared_agenda: "negative",
};

export function polarityFor(name: string): Polarity {
  return REGISTRY[name.trim().toLowerCase()] ?? "unknown";
}

// Authoritative polarity for a heuristic instance. The API supplies `signal`
// on document-level heuristics — prefer it. For topic-level heuristics (group
// signals), the API omits the field and we fall back to the static registry.
export function polarityOf(h: {
  name: string;
  signal?: "positive" | "negative";
}): Polarity {
  if (h.signal) return h.signal;
  return polarityFor(h.name);
}
