export type Rating = "high" | "medium" | "low";

// Per-heuristic polarity signal from the API. Only populated on document-level
// heuristics (the closed set: consistency, references, emotive_language,
// ideology). Topic-level heuristics omit it; we fall back to the static
// polarity registry for those.
export type Signal = "positive" | "negative";

export interface Heuristic {
  name: string;
  rating: Rating;
  description: string;
  signal?: Signal;
}

export interface TopicSummary {
  id: number;
  title: string;
  triage: Rating;
  description: string;
}

export type CaseStatus = "processing" | "complete" | "failed";

export interface CaseSummary {
  case_id: number;
  created_at: string;
  status: CaseStatus;
  document_count: number;
  topics: TopicSummary[];
  // Optional cover image URL the backend may attach during analysis. When
  // absent the frontend falls back to a deterministic placeholder.
  cover_image_url?: string;
}

export interface TopicDetail {
  id: number;
  title: string;
  triage: Rating;
  description: string;
  document_count: number;
  heuristics: Heuristic[];
}

export interface TopicDetailResponse {
  case_id: number;
  topic: TopicDetail;
}

export interface DocumentRecord {
  id: number;
  filename: string;
  content: string;
  heuristics: Heuristic[];
  facts_to_verify: string[];
}

export interface TopicDocumentsResponse {
  case_id: number;
  topic_id: number;
  documents: DocumentRecord[];
}

export interface CreateCaseRequest {
  documents: { filename?: string; content: string }[];
}

export interface CreateCaseResponse {
  case_id: number;
}

export interface ApiError {
  error: { code: string; message: string };
}
