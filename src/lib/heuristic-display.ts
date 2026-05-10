// Single source of truth for topic-level heuristic display: label and mood.
// Both the per-heuristic pills (left side of the topic page) and the bucket
// breakdown (right sidebar) read from this file, so they cannot disagree.
//
// Polarity rules:
// - Group heuristics (corroboration, shared_references, coordinated_framing,
//   shared_agenda, contested_narrative, timeline_coherence, temporal_scope)
//   have polarity documented in the API doc; the map below mirrors that.
// - Server-derived topic summary heuristics (sensitivity, claims, validation,
//   evidence_quality, importance, document_types) do not have a documented
//   polarity. The moods below are editorial calls.
//
// Document-level heuristics (with the API `signal` field) keep using
// `heuristic-polarity.ts` and `heuristic-vocabulary.ts` — they are out of
// scope here.

import type { Rating } from "@/lib/types";

export type Mood = "healthy" | "mixed" | "concerning";

export interface HeuristicDisplay {
  /** Label rendered inside the pill (e.g. "HEAVY", "CALM"). */
  label: string;
  /** Mood drives the pill color and the sidebar bucket. */
  mood: Mood;
}

// TODO(design): editorial calls — review these with the design lead before
// shipping. The API does not document polarity for these heuristics, so the
// good/bad direction is a product decision.
const TOPIC_SUMMARY_DISPLAY: Record<string, Record<Rating, HeuristicDisplay>> = {
  importance: {
    high:   { label: "HEAVY",   mood: "healthy" },
    medium: { label: "MIXED",   mood: "mixed" },
    low:    { label: "LIGHT",   mood: "mixed" },
  },
  claims: {
    high:   { label: "HIGH",    mood: "healthy" },
    medium: { label: "SOME",    mood: "mixed" },
    low:    { label: "FEW",     mood: "concerning" },
  },
  validation: {
    high:   { label: "HIGH",    mood: "healthy" },
    medium: { label: "PARTIAL", mood: "mixed" },
    low:    { label: "WEAK",    mood: "concerning" },
  },
  sensitivity: {
    high:   { label: "ACUTE",   mood: "concerning" },
    medium: { label: "MIXED",   mood: "mixed" },
    low:    { label: "CALM",    mood: "healthy" },
  },
  evidence_quality: {
    high:   { label: "STRONG",  mood: "healthy" },
    medium: { label: "PARTIAL", mood: "mixed" },
    low:    { label: "WEAK",    mood: "concerning" },
  },
  document_types: {
    high:   { label: "VARIED",  mood: "healthy" },
    medium: { label: "MIXED",   mood: "mixed" },
    low:    { label: "NARROW",  mood: "mixed" },
  },
};

// Group heuristics — polarity per the API doc's Group heuristics table.
// Positive polarity: high = healthy, low = concerning.
// Negative polarity: high = concerning, low = healthy.
// Medium is "mixed" by default; a couple of entries override low to "mixed"
// when the low band is review context rather than a problem.
const GROUP_HEURISTIC_DISPLAY: Record<string, Record<Rating, HeuristicDisplay>> = {
  corroboration: {
    high:   { label: "STRONG",      mood: "healthy" },
    medium: { label: "PARTIAL",     mood: "mixed" },
    low:    { label: "WEAK",        mood: "concerning" },
  },
  shared_references: {
    high:   { label: "RECURRING",   mood: "healthy" },
    medium: { label: "PARTIAL",     mood: "mixed" },
    low:    { label: "ABSENT",      mood: "concerning" },
  },
  coordinated_framing: {
    high:   { label: "COORDINATED", mood: "concerning" },
    medium: { label: "MIXED",       mood: "mixed" },
    low:    { label: "INDEPENDENT", mood: "healthy" },
  },
  shared_agenda: {
    high:   { label: "AGENDA",      mood: "concerning" },
    medium: { label: "MIXED",       mood: "mixed" },
    low:    { label: "INDEPENDENT", mood: "healthy" },
  },
  // contested_narrative is review context — low ("agreed") is not a problem.
  contested_narrative: {
    high:   { label: "CONTESTED",   mood: "healthy" },
    medium: { label: "PARTIAL",     mood: "mixed" },
    low:    { label: "AGREED",      mood: "mixed" },
  },
  timeline_coherence: {
    high:   { label: "COHERENT",    mood: "healthy" },
    medium: { label: "PARTIAL",     mood: "mixed" },
    low:    { label: "INCOHERENT",  mood: "concerning" },
  },
  // temporal_scope: isolated allegations are review context, not concerning.
  temporal_scope: {
    high:   { label: "SUSTAINED",   mood: "healthy" },
    medium: { label: "PARTIAL",     mood: "mixed" },
    low:    { label: "ISOLATED",    mood: "mixed" },
  },
};

const HEURISTIC_DISPLAY: Record<string, Record<Rating, HeuristicDisplay>> = {
  ...TOPIC_SUMMARY_DISPLAY,
  ...GROUP_HEURISTIC_DISPLAY,
};

// The heuristic list is open — the API can return new names without a
// frontend update. Fall back to a neutral mood and the rating word.
const FALLBACK: Record<Rating, HeuristicDisplay> = {
  high:   { label: "HIGH",   mood: "mixed" },
  medium: { label: "MEDIUM", mood: "mixed" },
  low:    { label: "LOW",    mood: "mixed" },
};

export function getHeuristicDisplay(
  name: string,
  rating: Rating,
): HeuristicDisplay {
  const row = HEURISTIC_DISPLAY[name.trim().toLowerCase()];
  return row?.[rating] ?? FALLBACK[rating];
}
