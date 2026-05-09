"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { TRIAGE_LABELS, type Distribution } from "@/lib/triage";
import type { Rating } from "@/lib/types";

const SEGMENT_STYLE: Record<Rating, { bg: string; color: string }> = {
  high: { bg: "bg.attentionSubtle", color: "fg.attention" },
  medium: { bg: "bg.warningSubtle", color: "fg.warning" },
  low: { bg: "bg.successSubtle", color: "fg.success" },
};

const SHORT_LABEL: Record<Rating, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export interface TriageDistributionProps {
  eyebrow: string;
  /** "documents", "heuristics", "topics" — the unit being counted. */
  unit: string;
  distribution: Distribution;
  maxItemsPerColumn?: number;
  eyebrowTrailing?: ReactNode;
  compact?: boolean;
}

export function TriageDistribution({
  eyebrow,
  unit,
  distribution,
  maxItemsPerColumn = 4,
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
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontWeight="500"
        >
          {eyebrow}
        </Text>
        {eyebrowTrailing}
      </Box>

      {!compact && (
        <Text fontSize="14px" lineHeight="20px" color="fg.muted">
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
                fontFamily="mono"
                fontWeight="600"
                fontSize="11px"
                letterSpacing="wide"
                textTransform="uppercase"
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
                fontFamily="mono"
                fontWeight="600"
                fontSize={compact ? "10px" : "11px"}
                letterSpacing="wide"
                textTransform="uppercase"
                whiteSpace="nowrap"
                overflow="hidden"
                title={`${TRIAGE_LABELS[seg.rating]} ${seg.pct.toFixed(0)}% (${seg.count})`}
              >
                {SHORT_LABEL[seg.rating]} {seg.pct.toFixed(0)}%
              </Box>
            );
          })
        )}
      </Box>

      {/* Item columns under each segment */}
      {!compact && !empty && (
        <Box display="flex" gap="2" alignItems="flex-start">
          {visible.map((seg) => {
            const style = SEGMENT_STYLE[seg.rating];
            const overflow = Math.max(0, seg.items.length - maxItemsPerColumn);
            const shown = seg.items.slice(0, maxItemsPerColumn);
            return (
              <Stack
                key={seg.rating}
                flexBasis={`${seg.pct}%`}
                flexGrow={0}
                flexShrink={0}
                gap="1"
                minW="0"
              >
                {shown.map((label, i) => (
                  <Box
                    key={`${seg.rating}-${i}-${label}`}
                    bg={style.bg}
                    color={style.color}
                    fontFamily="mono"
                    fontSize="10px"
                    lineHeight="11px"
                    fontWeight="500"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    px="2"
                    py="1"
                    borderRadius="sm"
                    title={label}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {truncate(label, 18)}
                  </Box>
                ))}
                {overflow > 0 && (
                  <Box
                    fontFamily="mono"
                    fontSize="10px"
                    lineHeight="11px"
                    fontWeight="500"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    color="fg.muted"
                    px="2"
                    py="1"
                  >
                    +{overflow} MORE
                  </Box>
                )}
              </Stack>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
