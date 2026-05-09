"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          lineHeight: "18px",
          borderRadius: "8px",
          background: "var(--chakra-colors-bg)",
          color: "var(--chakra-colors-fg)",
          border: "1px solid var(--chakra-colors-border)",
        },
      }}
    />
  );
}
