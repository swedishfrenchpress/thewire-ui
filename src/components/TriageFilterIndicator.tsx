"use client";

import { Button, HStack, Text } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TriageTag } from "@/components/TriageTag";
import type { Rating } from "@/lib/types";

const VALID: Record<string, Rating> = {
  high: "high",
  medium: "medium",
  low: "low",
};

export function readTriageParam(value: string | null): Rating | null {
  if (value === null) return null;
  return VALID[value] ?? null;
}

export function useTriageFilter(): Rating | null {
  const sp = useSearchParams();
  return readTriageParam(sp.get("triage"));
}

export function TriageFilterIndicator({
  rating,
  shown,
  total,
}: {
  rating: Rating;
  shown: number;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const clear = () => {
    const next = new URLSearchParams(sp.toString());
    next.delete("triage");
    const search = next.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <HStack
      gap="3"
      align="center"
      animation="surfaceIn var(--chakra-durations-swift) var(--chakra-easings-standard) both"
    >
      <Text textStyle="eyebrow" color="fg.muted">
        Filtered
      </Text>
      <TriageTag rating={rating} />
      <Text
        textStyle="eyebrow"
        color="fg.muted"
        fontVariantNumeric="tabular-nums"
      >
        {shown} of {total}
      </Text>
      <Button
        type="button"
        variant="plain"
        size="sm"
        onClick={clear}
        px="0"
        aria-label="Clear triage filter"
      >
        Clear (0)
      </Button>
    </HStack>
  );
}
