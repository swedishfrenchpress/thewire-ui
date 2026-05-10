"use client";

import { Box } from "@chakra-ui/react";
import { polarityFor, type Polarity } from "@/lib/heuristic-polarity";
import type { Rating } from "@/lib/types";

type ToneStyle = { bg: string; color: string };

const POSITIVE: ToneStyle = { bg: "bg.successSubtle", color: "fg.success" };
const NEGATIVE: ToneStyle = { bg: "bg.attentionSubtle", color: "fg.attention" };
const NEUTRAL_MEDIUM: ToneStyle = {
  bg: "bg.warningSubtle",
  color: "fg.warning",
};
const UNKNOWN: ToneStyle = { bg: "bg.subtle", color: "fg.muted" };

function toneFor(polarity: Polarity, rating: Rating): ToneStyle {
  if (polarity === "unknown") return UNKNOWN;
  if (rating === "medium") return NEUTRAL_MEDIUM;
  const isGood =
    (polarity === "positive" && rating === "high") ||
    (polarity === "negative" && rating === "low");
  return isGood ? POSITIVE : NEGATIVE;
}

type Props = {
  name: string;
  rating: Rating;
};

export function HeuristicChip({ name, rating }: Props) {
  const polarity = polarityFor(name);
  const tone = toneFor(polarity, rating);

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="2"
      py="1"
      bg={tone.bg}
      color={tone.color}
      textStyle="eyebrow.sm"
      fontWeight="600"
      borderRadius="sm"
    >
      {rating}
    </Box>
  );
}
