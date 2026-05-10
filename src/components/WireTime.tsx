"use client";

import { Box } from "@chakra-ui/react";
import { formatRelative } from "@/lib/format";

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function formatWireSlug(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const month = MONTHS[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${day} ${hh}:${mm}`;
}

function relativeWithSuffix(iso: string): string {
  const rel = formatRelative(iso);
  if (rel === "just now") return "just now";
  if (rel === "—") return "—";
  return `${rel} ago`;
}

// Inline wire-service timestamp: an absolute teleprinter slug paired with
// a muted relative descriptor. Stays in the parent's font register so it
// slots into mono strips (StatusStrip) without typographic seams.
export function WireTime({
  iso,
  eyebrow,
}: {
  iso: string;
  eyebrow?: string;
}) {
  const slug = formatWireSlug(iso);
  if (slug === null) {
    return (
      <Box as="span" color="fg.muted">
        —
      </Box>
    );
  }
  const rel = relativeWithSuffix(iso);
  return (
    <>
      {eyebrow ? (
        <Box as="span" color="fg.muted" mr="1.5">
          {eyebrow}
        </Box>
      ) : null}
      <Box as="span" fontVariantNumeric="tabular-nums">
        {slug}
      </Box>
      <Box as="span" color="fg.muted" ml="1.5">
        · {rel}
      </Box>
    </>
  );
}
