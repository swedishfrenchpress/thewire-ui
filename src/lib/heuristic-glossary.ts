// Authoritative definitions for the heuristic vocabulary the agent emits.
//
// The grading API returns a per-instance `description` string ("7 factual
// claim(s) extracted in this topic.") which tells the reader the *value*
// the heuristic took on. It does not tell the reader what the heuristic
// *is* or what the verdict bands mean for that specific signal. This
// glossary supplies that — short, declarative, derived from API behavior
// and from the published methodology.
//
// Names are matched case-insensitively. An unknown name returns null and
// the UI omits the tooltip rather than inventing one.

export interface HeuristicDefinition {
  /** What the heuristic measures. One sentence. */
  measures: string;
  /** What the rating bands mean for this specific heuristic. */
  bands: string;
}

const REGISTRY: Record<string, HeuristicDefinition> = {
  // --- Topic-level signals (returned on /topics/{id}) ---
  sensitivity: {
    measures:
      "The highest sensitivity rating any document in this topic received, on a four-point scale.",
    bands:
      "Drives the topic's triage. Level 1 reads as Calm, level 2 as Notable, levels 3 and 4 as Severe.",
  },
  claims: {
    measures:
      "How many factual claims the agent extracted from documents in this topic.",
    bands:
      "More claims means more material to verify, not necessarily more severe.",
  },
  validation: {
    measures:
      "How those extracted claims fared when checked: supported, contradicted, or unverifiable.",
    bands:
      "A high count of supported claims argues the topic is well-evidenced; contradicted claims argue the opposite.",
  },
  importance: {
    measures:
      "The agent's plain-language judgment of why this topic matters editorially.",
    bands:
      "Light reads as opinion or context. Moderate is worth a look. Heavy carries specific allegations of wrongdoing or risk.",
  },
  evidence_quality: {
    measures:
      "Quality of the underlying evidence: sourcing, specificity, corroboration.",
    bands:
      "Caps the topic's triage. Weak evidence holds the topic at a low verdict even if a claim sounds severe.",
  },

  // --- Document-level signals (returned on /topics/{id}/documents) ---
  consistency: {
    measures:
      "Internal coherence of the document's argumentation and stated facts.",
    bands:
      "Solid means coherent and self-consistent. Inconsistent means contradictions or significant logical gaps.",
  },
  references: {
    measures:
      "Verifiable specifics in the document: named entities, dates, document numbers, transactions.",
    bands:
      "Sourced means many checkable details. Unsourced means abstractions and unsupported claims.",
  },
  emotive_language: {
    measures: "Use of inflammatory or emotionally charged language.",
    bands:
      "Charged means a polemic register. Even means neutral, procedural prose.",
  },
  emotive: {
    measures: "Use of inflammatory or emotionally charged language.",
    bands:
      "Charged means a polemic register. Even means neutral, procedural prose.",
  },
  ideology_or_incentives: {
    measures:
      "Whether the document is agenda-driven or framed by partisan incentives.",
    bands:
      "Slanted means strongly ideological framing. Neutral means descriptive and even-handed.",
  },
  ideology: {
    measures:
      "Whether the document is agenda-driven or framed by partisan incentives.",
    bands:
      "Slanted means strongly ideological framing. Neutral means descriptive and even-handed.",
  },
  claim_supported: {
    measures:
      "For an extracted factual claim, whether the agent could find supporting evidence.",
    bands:
      "Backed means corroborated by independent sources. Unbacked means contradicted or unverifiable.",
  },
};

export function definitionFor(name: string): HeuristicDefinition | null {
  return REGISTRY[name.trim().toLowerCase()] ?? null;
}

/** Pretty-print the heuristic name for display (replace underscores). */
export function displayHeuristicName(name: string): string {
  return name.replace(/_/g, " ");
}
