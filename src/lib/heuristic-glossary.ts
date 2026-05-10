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

  // --- Group heuristics (model-derived, cross-document) ---
  // Run only after per-document filtering; topics with fewer than two
  // unfiltered documents skip this pass.
  corroboration: {
    measures:
      "Whether documents in this topic describe overlapping events, parties, or claims with consistent details.",
    bands:
      "Corroborated means independent documents reinforce each other. Conflicting means details don't line up across the corpus.",
  },
  shared_references: {
    measures:
      "Whether concrete references (names, dates, document numbers, transactions) recur across documents, enabling cross-checking.",
    bands:
      "Cross-referenced means specifics appear in more than one document. Disjoint means each document is its own island.",
  },
  coordinated_framing: {
    measures:
      "Whether documents share suspiciously coordinated emotional framing or repeated rhetoric.",
    bands:
      "Synced means polemic phrasing recurs in a way that suggests coordination. Independent means each document writes in its own voice.",
  },
  shared_agenda: {
    measures:
      "Whether documents collectively appear to advance the same agenda, incentive, or vendetta rather than independent reporting.",
    bands:
      "Aligned means the corpus pushes one narrative. Diverse means independent perspectives.",
  },
  contested_narrative: {
    measures:
      "Whether documents contain competing accounts of the same core event, where one account may be framed to discredit another. Review-salience signal — does not affect document filtering.",
    bands:
      "Contested means multiple competing accounts worth comparing. Single means one consistent account across the corpus.",
  },
  timeline_coherence: {
    measures:
      "Whether dates, time ranges, and event ordering form a plausible sequence across documents.",
    bands:
      "Coherent means dates and ordering line up. Inconsistent means contradictory timestamps or impossible sequences.",
  },
  temporal_scope: {
    measures:
      "Whether the alleged conduct appears isolated, short-lived, or sustained over time. Review context — does not affect document filtering.",
    bands:
      "Sustained means a recurring pattern. Isolated means a one-off or short-lived incident.",
  },
};

export function definitionFor(name: string): HeuristicDefinition | null {
  return REGISTRY[name.trim().toLowerCase()] ?? null;
}

/** Pretty-print the heuristic name for display (replace underscores). */
export function displayHeuristicName(name: string): string {
  return name.replace(/_/g, " ");
}

/** Title-case version: "evidence_quality" → "Evidence Quality". */
export function titleCaseHeuristicName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
