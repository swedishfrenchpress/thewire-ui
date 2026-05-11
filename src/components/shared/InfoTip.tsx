"use client";

import { Box, Popover, Portal, Text } from "@chakra-ui/react";
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

// Footnote-style definition popover. Tap or click the dotted-underlined term
// to surface a short, authoritative gloss; click outside or press Escape to
// dismiss. Popover is used over Tooltip so touch devices can trigger it —
// Tooltip is hover/focus only and never opens on tap.
export function InfoTip({ eyebrow, measures, bands, children }: InfoTipProps) {
  return (
    <Popover.Root positioning={{ placement: "top-start", gutter: 8 }}>
      <Popover.Trigger asChild>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          cursor="help"
          textDecoration="underline"
          textDecorationStyle="dotted"
          textDecorationColor="fg.muted"
          textUnderlineOffset="3px"
          _hover={{ textDecorationColor: "fg" }}
          _focusVisible={{
            outline: "none",
            boxShadow: "focusRing",
            borderRadius: "xs",
          }}
        >
          {children}
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            bg="bg"
            color="fg"
            borderWidth="1px"
            borderColor="border"
            borderRadius="sm"
            boxShadow="menu"
            px="3.5"
            py="3"
            maxW="320px"
            _focusVisible={{ outline: "none" }}
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
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
