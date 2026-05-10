"use client";

import { Box } from "@chakra-ui/react";
import { polarityOf, type Polarity } from "@/lib/heuristic-polarity";
import {
  countLabelFor,
  extractLeadingCount,
  vocabularyFor,
} from "@/lib/heuristic-vocabulary";
import type { Rating, Signal } from "@/lib/types";

type ToneStyle = { bg: string; color: string; border: string };

const POSITIVE: ToneStyle = {
  bg: "bg.successSubtle",
  color: "fg.success",
  border: "transparent",
};
const NEGATIVE: ToneStyle = {
  bg: "bg.attentionSubtle",
  color: "fg.attention",
  border: "transparent",
};
const NEUTRAL_MEDIUM: ToneStyle = {
  bg: "bg.warningSubtle",
  color: "fg.warning",
  border: "transparent",
};
// Unknown polarity (count metrics like `claims`, `validation`) — no
// good/bad direction to encode, but we still need HIGH and LOW to read as
// distinct from MEDIUM and from each other.
const UNKNOWN_HIGH: ToneStyle = {
  bg: "bg.muted",
  color: "fg",
  border: "transparent",
};
const UNKNOWN_LOW: ToneStyle = {
  bg: "transparent",
  color: "fg.muted",
  border: "border.muted",
};

function toneFor(polarity: Polarity, rating: Rating): ToneStyle {
  if (rating === "medium") return NEUTRAL_MEDIUM;
  if (polarity === "unknown") {
    return rating === "high" ? UNKNOWN_HIGH : UNKNOWN_LOW;
  }
  const isGood =
    (polarity === "positive" && rating === "high") ||
    (polarity === "negative" && rating === "low");
  return isGood ? POSITIVE : NEGATIVE;
}

type Props = {
  name: string;
  rating: Rating;
  // Optional. Count metrics (claims, validation) embed a number in the
  // description ("7 factual claim(s)…"); when present we render the number
  // instead of a level word.
  description?: string;
  // Optional. The API populates `signal` on document-level heuristics; when
  // present it overrides the static polarity registry.
  signal?: Signal;
};

export function HeuristicChip({ name, rating, description, signal }: Props) {
  const polarity = polarityOf({ name, signal });
  const tone = toneFor(polarity, rating);
  const label = labelFor(name, rating, polarity, description);

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="2"
      py="1"
      bg={tone.bg}
      color={tone.color}
      borderWidth="1px"
      borderColor={tone.border}
      textStyle="eyebrow.sm"
      fontWeight="600"
      borderRadius="sm"
    >
      {label}
    </Box>
  );
}

function labelFor(
  name: string,
  rating: Rating,
  polarity: Polarity,
  description: string | undefined,
): string {
  if (polarity === "unknown" && description) {
    const count = extractLeadingCount(description);
    if (count !== null) {
      const unit = countLabelFor(name, count);
      if (unit) return `${count} ${unit}`;
    }
  }
  return vocabularyFor(name, rating);
}
