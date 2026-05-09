import type {
  CaseSummary,
  CategoryDetailResponse,
  CategoryDocumentsResponse,
  CreateCaseRequest,
  CreateCaseResponse,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://the-wire-backend-production-267d.up.railway.app";

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
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      // non-JSON body; fall back to status
    }
    throw new Error(message);
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

export function getCategory(
  caseId: number,
  categoryId: number,
): Promise<CategoryDetailResponse> {
  return request(`/api/v1/cases/${caseId}/categories/${categoryId}`);
}

export function getCategoryDocuments(
  caseId: number,
  categoryId: number,
): Promise<CategoryDocumentsResponse> {
  return request(`/api/v1/cases/${caseId}/categories/${categoryId}/documents`);
}
