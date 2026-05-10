import type {
  CaseSummary,
  CreateCaseRequest,
  CreateCaseResponse,
  TopicDetailResponse,
  TopicDocumentsResponse,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://the-wire-backend-production-267d.up.railway.app";

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as {
        error?: { message?: string; code?: string };
      };
      if (body?.error?.message) message = body.error.message;
      if (body?.error?.code) code = body.error.code;
    } catch {
      // non-JSON body; fall back to status
    }
    throw new ApiRequestError(message, res.status, code);
  }

  return res.json() as Promise<T>;
}

export function createCase(
  body: CreateCaseRequest,
): Promise<CreateCaseResponse> {
  return request("/api/v1/cases", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getCase(caseId: number): Promise<CaseSummary> {
  return request(`/api/v1/cases/${caseId}`);
}

export function getTopic(
  caseId: number,
  topicId: number,
): Promise<TopicDetailResponse> {
  return request(`/api/v1/cases/${caseId}/topics/${topicId}`);
}

export function getTopicDocuments(
  caseId: number,
  topicId: number,
): Promise<TopicDocumentsResponse> {
  return request(`/api/v1/cases/${caseId}/topics/${topicId}/documents`);
}
