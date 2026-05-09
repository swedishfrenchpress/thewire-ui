"use client";

export interface CaseEntry {
  caseId: number;
  displayName: string;
  pinned: boolean;
  createdAt: string;
  lastViewedAt: string;
}

const KEY = "thewire.cases.v1";
const isBrowser = typeof window !== "undefined";

const listeners = new Set<() => void>();
let cache: CaseEntry[] | null = null;

function isEntry(x: unknown): x is CaseEntry {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.caseId === "number" &&
    typeof o.displayName === "string" &&
    typeof o.pinned === "boolean" &&
    typeof o.createdAt === "string" &&
    typeof o.lastViewedAt === "string"
  );
}

function read(): CaseEntry[] {
  if (!isBrowser) return [];
  if (cache !== null) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      cache = [];
      return cache;
    }
    const parsed: unknown = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed.filter(isEntry) as CaseEntry[]) : [];
    return cache;
  } catch {
    cache = [];
    return cache;
  }
}

function write(next: CaseEntry[]) {
  cache = next;
  if (isBrowser) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // quota / disabled — keep cache in memory but skip persistence
    }
  }
  for (const l of listeners) l();
}

function onStorageEvent(e: StorageEvent) {
  if (e.key !== KEY) return;
  cache = null;
  for (const l of listeners) l();
}

export const casesStore = {
  listCases(): CaseEntry[] {
    return read();
  },

  getCase(caseId: number): CaseEntry | undefined {
    return read().find((e) => e.caseId === caseId);
  },

  addCase(caseId: number, displayName: string): CaseEntry {
    const now = new Date().toISOString();
    const existing = read().find((e) => e.caseId === caseId);
    const entry: CaseEntry = existing
      ? { ...existing, lastViewedAt: now }
      : {
          caseId,
          displayName,
          pinned: false,
          createdAt: now,
          lastViewedAt: now,
        };
    const next = read().filter((e) => e.caseId !== caseId);
    next.push(entry);
    write(next);
    return entry;
  },

  updateCase(
    caseId: number,
    partial: Partial<Omit<CaseEntry, "caseId">>,
  ): void {
    const next = read().map((e) =>
      e.caseId === caseId ? { ...e, ...partial } : e,
    );
    write(next);
  },

  removeCase(caseId: number): void {
    write(read().filter((e) => e.caseId !== caseId));
  },

  pinCase(caseId: number, pinned: boolean): void {
    casesStore.updateCase(caseId, { pinned });
  },

  touchViewed(caseId: number): void {
    casesStore.updateCase(caseId, { lastViewedAt: new Date().toISOString() });
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (isBrowser && listeners.size === 1) {
      window.addEventListener("storage", onStorageEvent);
    }
    return () => {
      listeners.delete(listener);
      if (isBrowser && listeners.size === 0) {
        window.removeEventListener("storage", onStorageEvent);
      }
    };
  },
};
