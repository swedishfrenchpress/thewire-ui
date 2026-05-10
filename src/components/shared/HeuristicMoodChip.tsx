"use client";

import { Box } from "@chakra-ui/react";
import { getHeuristicDisplay, type Mood } from "@/lib/heuristic-display";
import type { Rating } from "@/lib/types";

type ToneStyle = { bg: string; color: string };

const TONE: Record<Mood, ToneStyle> = {
  healthy:    { bg: "bg.successSubtle",   color: "fg.success" },
  mixed:      { bg: "bg.warningSubtle",   color: "fg.warning" },
  concerning: { bg: "bg.attentionSubtle", color: "fg.attention" },
};

type Props = {
  name: string;
  rating: Rating;
};

export function HeuristicMoodChip({ name, rating }: Props) {
  const { label, mood } = getHeuristicDisplay(name, rating);
  const tone = TONE[mood];

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
      borderColor="transparent"
      textStyle="eyebrow.sm"
      fontWeight="600"
      borderRadius="sm"
    >
      {label}
    </Box>
  );
}
