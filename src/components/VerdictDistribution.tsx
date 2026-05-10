"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { VERDICT_LABELS, type Verdict, type VerdictDistribution } from "@/lib/triage";

const SEGMENT_STYLE: Record<Verdict, { bg: string; color: string }> = {
  concerning: { bg: "bg.attentionSubtle", color: "fg.attention" },
  mixed: { bg: "bg.warningSubtle", color: "fg.warning" },
  healthy: { bg: "bg.successSubtle", color: "fg.success" },
};

const HEADLINE_VERB: Record<Verdict, string> = {
  concerning: "concerning",
  mixed: "mixed",
  healthy: "healthy",
};

export interface VerdictDistributionProps {
  eyebrow: string;
  /** "documents", "signals" — the unit being counted. */
  unit: string;
  distribution: VerdictDistribution;
  eyebrowTrailing?: ReactNode;
  compact?: boolean;
}

export function VerdictDistributionView({
  eyebrow,
  unit,
  distribution,
  eyebrowTrailing,
  compact = false,
}: VerdictDistributionProps) {
  const { total, ordered, dominant } = distribution;
  const visible = ordered.filter((s) => s.count > 0);
  const empty = total === 0;
  const dominantSeg = dominant ? distribution.segments[dominant] : null;
  const headline =
    empty || !dominant || !dominantSeg
      ? `No ${unit} to score.`
      : `${dominantSeg.pct.toFixed(0)}% of ${unit} read as ${HEADLINE_VERB[dominant]}`;

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
              of {total} {unit} read as{" "}
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
                {VERDICT_LABELS[dominant]}
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
            const style = SEGMENT_STYLE[seg.verdict];
            return (
              <Box
                key={seg.verdict}
                flexBasis="max-content"
                flexGrow={seg.pct}
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
                fontVariantNumeric="tabular-nums"
                title={`${VERDICT_LABELS[seg.verdict]} ${seg.pct.toFixed(0)}% (${seg.count})`}
              >
                {VERDICT_LABELS[seg.verdict]} {seg.pct.toFixed(0)}%
              </Box>
            );
          })
        )}
      </Box>

      {/* Full-width vertical list grouped by verdict */}
      {!compact && !empty && (
        <Stack gap="3" pt="1">
          {visible.map((seg) => {
            const style = SEGMENT_STYLE[seg.verdict];
            return (
              <Stack key={seg.verdict} gap="1.5">
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
                    {VERDICT_LABELS[seg.verdict]}
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
                      key={`${seg.verdict}-${i}-${label}`}
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
