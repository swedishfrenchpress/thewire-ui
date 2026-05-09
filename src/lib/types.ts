export type Rating = "high" | "medium" | "low";

export interface Heuristic {
  name: string;
  rating: Rating;
  description: string;
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
