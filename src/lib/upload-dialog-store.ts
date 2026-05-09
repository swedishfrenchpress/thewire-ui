"use client";

import { useSyncExternalStore } from "react";

export interface UploadDialogState {
  open: boolean;
  initialFiles: File[];
}

let state: UploadDialogState = { open: false, initialFiles: [] };
const listeners = new Set<() => void>();

function setState(next: UploadDialogState) {
  state = next;
  for (const l of listeners) l();
}

const SERVER_SNAPSHOT: UploadDialogState = Object.freeze({
  open: false,
  initialFiles: [] as File[],
}) as UploadDialogState;

export const uploadDialogStore = {
  getState(): UploadDialogState {
    return state;
  },
  openDialog(initialFiles: File[] = []): void {
    setState({ open: true, initialFiles });
  },
  closeDialog(): void {
    setState({ open: false, initialFiles: [] });
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useUploadDialog(): UploadDialogState {
  return useSyncExternalStore(
    uploadDialogStore.subscribe,
    uploadDialogStore.getState,
    () => SERVER_SNAPSHOT,
  );
}
