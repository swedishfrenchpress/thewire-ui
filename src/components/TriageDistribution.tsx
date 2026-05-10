"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import {
  RATING_SHORT_LABEL,
  TRIAGE_LABELS,
  type Distribution,
} from "@/lib/triage";
import type { Rating } from "@/lib/types";

const SEGMENT_STYLE: Record<Rating, { bg: string; color: string }> = {
  high: { bg: "bg.attentionSubtle", color: "fg.attention" },
  medium: { bg: "bg.warningSubtle", color: "fg.warning" },
  low: { bg: "bg.successSubtle", color: "fg.success" },
};

export interface TriageDistributionProps {
  eyebrow: string;
  /** "documents", "heuristics", "topics" — the unit being counted. */
  unit: string;
  distribution: Distribution;
  eyebrowTrailing?: ReactNode;
  compact?: boolean;
}

export function TriageDistribution({
  eyebrow,
  unit,
  distribution,
  eyebrowTrailing,
  compact = false,
}: TriageDistributionProps) {
  const { total, ordered, dominant } = distribution;
  const visible = ordered.filter((s) => s.count > 0);
  const empty = total === 0;
  const dominantSeg = dominant ? distribution.segments[dominant] : null;
  const headline =
    empty || !dominant || !dominantSeg
      ? `No ${unit} to score.`
      : `${dominantSeg.pct.toFixed(0)}% of ${unit} rate ${TRIAGE_LABELS[dominant]}`;

  return (
    <Stack gap={compact ? "2" : "3"} role="figure" aria-label={headline}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="3"
      >
        <Text textStyle="eyebrow" color="fg.muted">
          {eyebrow}
        </Text>
        {eyebrowTrailing}
      </Box>

      {!compact && (
        <Text textStyle="body.md" color="fg.muted">
          {empty || !dominant || !dominantSeg ? (
            headline
          ) : (
            <>
              <Box
                as="span"
                color="fg"
                fontWeight="500"
                fontVariantNumeric="tabular-nums"
              >
                {dominantSeg.pct.toFixed(0)}%
              </Box>{" "}
              of {total} {unit} rate{" "}
              <Box
                as="span"
                bg={SEGMENT_STYLE[dominant].bg}
                color={SEGMENT_STYLE[dominant].color}
                textStyle="eyebrow"
                fontWeight="600"
                px="1.5"
                py="0.5"
                borderRadius="sm"
              >
                {TRIAGE_LABELS[dominant]}
              </Box>
            </>
          )}
        </Text>
      )}

      {/* Stacked bar */}
      <Box
        display="flex"
        h={compact ? "5" : "8"}
        borderRadius="sm"
        overflow="hidden"
        bg="bg.subtle"
      >
        {empty ? (
          <Box flex="1" />
        ) : (
          visible.map((seg) => {
            const style = SEGMENT_STYLE[seg.rating];
            return (
              <Box
                key={seg.rating}
                flexBasis={`${seg.pct}%`}
                flexGrow={0}
                flexShrink={0}
                bg={style.bg}
                color={style.color}
                display="flex"
                alignItems="center"
                px="2"
                textStyle={compact ? "eyebrow.sm" : "eyebrow"}
                fontWeight="600"
                whiteSpace="nowrap"
                overflow="hidden"
                title={`${TRIAGE_LABELS[seg.rating]} ${seg.pct.toFixed(0)}% (${seg.count})`}
              >
                {RATING_SHORT_LABEL[seg.rating]} {seg.pct.toFixed(0)}%
              </Box>
            );
          })
        )}
      </Box>

      {/* Full-width vertical list grouped by rating */}
      {!compact && !empty && (
        <Stack gap="3" pt="1">
          {visible.map((seg) => {
            const style = SEGMENT_STYLE[seg.rating];
            return (
              <Stack key={seg.rating} gap="1.5">
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="2"
                  alignSelf="flex-start"
                >
                  <Box
                    as="span"
                    bg={style.bg}
                    color={style.color}
                    textStyle="eyebrow.sm"
                    fontWeight="600"
                    px="1.5"
                    py="0.5"
                    borderRadius="sm"
                  >
                    {RATING_SHORT_LABEL[seg.rating]}
                  </Box>
                  <Text
                    as="span"
                    textStyle="eyebrow.sm"
                    color="fg.muted"
                    fontVariantNumeric="tabular-nums"
                  >
                    · {seg.count}
                  </Text>
                </Box>
                <Stack gap="0.5">
                  {seg.items.map((label, i) => (
                    <Text
                      key={`${seg.rating}-${i}-${label}`}
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
      )}
    </Stack>
  );
}
