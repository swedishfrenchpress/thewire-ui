"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Fragment, type ReactNode } from "react";

export type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <Box
      as="nav"
      aria-label="Breadcrumb"
      pt="6"
      pb="2"
    >
      <HStack
        as="ol"
        gap="2"
        align="center"
        listStyleType="none"
        flexWrap="wrap"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <Box as="li" display="inline-flex" alignItems="center" minW="0">
                {item.href && !isLast ? (
                  <NextLink
                    href={item.href}
                    style={{ textDecoration: "none" }}
                  >
                    <CrumbLabel muted>{item.label}</CrumbLabel>
                  </NextLink>
                ) : (
                  <CrumbLabel current={isLast}>{item.label}</CrumbLabel>
                )}
              </Box>
              {!isLast && <Separator />}
            </Fragment>
          );
        })}
      </HStack>
    </Box>
  );
}

function CrumbLabel({
  children,
  muted,
  current,
}: {
  children: ReactNode;
  muted?: boolean;
  current?: boolean;
}) {
  return (
    <Text
      as="span"
      textStyle="eyebrow"
      color={current ? "fg" : "fg.muted"}
      maxW="40ch"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      _hover={muted ? { color: "fg" } : undefined}
      transition="color 150ms"
      aria-current={current ? "page" : undefined}
    >
      {children}
    </Text>
  );
}

function Separator() {
  return (
    <Box
      as="span"
      role="presentation"
      aria-hidden
      textStyle="eyebrow"
      fontWeight="400"
      color="fg.disabled"
    >
      /
    </Box>
  );
}
