"use client";

import { Box, Portal, Text, Tooltip } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface InfoTipProps {
  /** Eyebrow at the top of the tooltip — usually the term being defined. */
  eyebrow: string;
  /** What the term measures, one sentence. */
  measures: string;
  /** What the rating bands mean for this term, one sentence. */
  bands: string;
  /** The trigger content — typically the term itself. */
  children: ReactNode;
}

/**
 * Footnote-style tooltip for definable terms.
 *
 * The trigger renders the child content with a dotted underline so the
 * reader knows it carries a definition; the tooltip surfaces a short,
 * authoritative gloss on hover and on keyboard focus.
 */
export function InfoTip({ eyebrow, measures, bands, children }: InfoTipProps) {
  return (
    <Tooltip.Root
      openDelay={120}
      closeDelay={100}
      positioning={{ placement: "top-start", gutter: 8 }}
    >
      <Tooltip.Trigger asChild>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          cursor="help"
          textDecoration="underline"
          textDecorationStyle="dotted"
          textDecorationColor="fg.muted"
          textUnderlineOffset="3px"
          tabIndex={0}
          _hover={{ textDecorationColor: "fg" }}
          _focusVisible={{
            outline: "none",
            boxShadow: "focusRing",
            borderRadius: "xs",
          }}
        >
          {children}
        </Box>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            bg="bg"
            color="fg"
            borderWidth="1px"
            borderColor="border"
            borderRadius="sm"
            boxShadow="menu"
            px="3.5"
            py="3"
            maxW="320px"
            // Override the default scale-fade so the surface doesn't pop.
            // Subtle opacity-only transition keeps it on-brand.
          >
            <Text
              textStyle="eyebrow.sm"
              fontWeight="600"
              color="fg.muted"
              pb="2"
            >
              {eyebrow}
            </Text>
            <Text textStyle="body.sm" color="fg" pb="2">
              {measures}
            </Text>
            <Text textStyle="body.sm" color="fg.muted">
              {bands}
            </Text>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
