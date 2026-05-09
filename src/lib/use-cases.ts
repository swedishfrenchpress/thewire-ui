"use client";

import { useSyncExternalStore } from "react";
import { casesStore, type CaseEntry } from "./cases-store";

const SERVER_SNAPSHOT: readonly CaseEntry[] = Object.freeze([]);

function getServerSnapshot(): readonly CaseEntry[] {
  return SERVER_SNAPSHOT;
}

export function useCases(): CaseEntry[] {
  return useSyncExternalStore(
    casesStore.subscribe,
    casesStore.listCases,
    getServerSnapshot as () => CaseEntry[],
  );
}
