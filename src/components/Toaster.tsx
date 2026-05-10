"use client";

import { Toaster as SonnerToaster } from "sonner";

// Sonner's chrome is suppressed: every toast is rendered via toast.custom() with
// the WireToast component. This Toaster only owns position, gap, and the offset.
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="light"
      gap={8}
      offset={24}
      visibleToasts={4}
      toastOptions={{
        unstyled: true,
      }}
    />
  );
}
