"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { getHeuristicDisplay, type Mood } from "@/lib/heuristic-display";
import { titleCaseHeuristicName } from "@/lib/heuristic-glossary";
import type { Heuristic } from "@/lib/types";

const TONE: Record<Mood, { bg: string; color: string }> = {
  concerning: { bg: "bg.attentionSubtle", color: "fg.attention" },
  mixed:      { bg: "bg.warningSubtle",   color: "fg.warning" },
  healthy:    { bg: "bg.successSubtle",   color: "fg.success" },
};

const MOOD_LABEL: Record<Mood, string> = {
  concerning: "Concerning",
  mixed: "Mixed",
  healthy: "Healthy",
};

const MOOD_WORD: Record<Mood, string> = {
  concerning: "concerning",
  mixed: "mixed",
  healthy: "healthy",
};

// Bar order: red → orange → green, matching the chip color ramp used
// throughout the app.
const ORDER: Mood[] = ["concerning", "mixed", "healthy"];

interface Bucket {
  mood: Mood;
  count: number;
  pct: number;
  items: string[];
}

function buildBuckets(heuristics: Heuristic[]): Bucket[] {
  const totals: Record<Mood, Bucket> = {
    concerning: { mood: "concerning", count: 0, pct: 0, items: [] },
    mixed:      { mood: "mixed",      count: 0, pct: 0, items: [] },
    healthy:    { mood: "healthy",    count: 0, pct: 0, items: [] },
  };

  for (const h of heuristics) {
    const { mood } = getHeuristicDisplay(h.name, h.rating);
    totals[mood].count += 1;
    totals[mood].items.push(titleCaseHeuristicName(h.name));
  }

  const total = heuristics.length;
  for (const m of ORDER) {
    totals[m].pct = total === 0 ? 0 : (totals[m].count / total) * 100;
  }
  return ORDER.map((m) => totals[m]);
}

export interface HeuristicBreakdownViewProps {
  heuristics: Heuristic[];
}

export function HeuristicBreakdownView({
  heuristics,
}: HeuristicBreakdownViewProps) {
  const buckets = buildBuckets(heuristics);
  const populated = buckets.filter((b) => b.count > 0);
  const total = heuristics.length;

  return (
    <Stack gap="3">
      <Text textStyle="eyebrow" color="fg.muted">
        Heuristic breakdown
      </Text>

      {total === 0 ? (
        <Text textStyle="body.md" color="fg.muted">
          No heuristics yet
        </Text>
      ) : (
        <>
          {/* Three-count line, equal visual weight, mood-colored */}
          <Text
            textStyle="body.md"
            color="fg.muted"
            fontVariantNumeric="tabular-nums"
          >
            {populated.map((b, i) => (
              <Fragment key={b.mood}>
                {i > 0 && (
                  <Box as="span" color="fg.muted" mx="1">
                    ·
                  </Box>
                )}
                <Box as="span" color={TONE[b.mood].color} fontWeight="500">
                  {b.count} {MOOD_WORD[b.mood]}
                </Box>
              </Fragment>
            ))}
          </Text>

          {/* Stacked bar — segments sized strictly by their percentage so a
              20% segment occupies 20% of the bar's width. */}
          <Box
            display="flex"
            h="8"
            borderRadius="sm"
            overflow="hidden"
            bg="bg.subtle"
          >
            {populated.map((b) => {
              const tone = TONE[b.mood];
              return (
                <Box
                  key={b.mood}
                  flexBasis="0"
                  flexGrow={b.pct}
                  flexShrink={0}
                  bg={tone.bg}
                  color={tone.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  px="2"
                  textStyle="eyebrow"
                  fontWeight="600"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  title={`${MOOD_LABEL[b.mood]} ${b.pct.toFixed(0)}% (${b.count})`}
                >
                  {b.pct.toFixed(0)}%
                </Box>
              );
            })}
          </Box>

          {/* Per-bucket lists below the bar */}
          <Stack gap="3" pt="1">
            {populated.map((b) => {
              const tone = TONE[b.mood];
              return (
                <Stack key={b.mood} gap="1.5">
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="2"
                    alignSelf="flex-start"
                  >
                    <Box
                      as="span"
                      bg={tone.bg}
                      color={tone.color}
                      textStyle="eyebrow.sm"
                      fontWeight="600"
                      px="1.5"
                      py="0.5"
                      borderRadius="sm"
                    >
                      {MOOD_LABEL[b.mood]}
                    </Box>
                    <Text
                      as="span"
                      textStyle="eyebrow.sm"
                      color="fg.muted"
                      fontVariantNumeric="tabular-nums"
                    >
                      · {b.count}
                    </Text>
                  </Box>
                  <Stack gap="0.5">
                    {b.items.map((label, i) => (
                      <Text
                        key={`${b.mood}-${i}-${label}`}
                        as="span"
                        fontFamily="mono"
                        fontSize="13px"
                        lineHeight="18px"
                        color="fg"
                        wordBreak="break-word"
                      >
                        {label}
                      </Text>
                    ))}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </>
      )}
    </Stack>
  );
}
