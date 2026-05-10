"use client";

import { Box, HStack, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEdition } from "@/lib/format";
import { Logomark } from "./Logomark";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
];

export function SiteHeader() {
  return (
    <Box as="header">
      <Box maxW="1100px" mx="auto" px="6" pt="6" pb="3">
        <NextLink
          href="/"
          aria-label="Palantir for the People, home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <HStack
            gap="3"
            align="center"
            justify="space-between"
            wrap="wrap"
          >
            <HStack gap="3" align="center">
              <Box color="fg" display="inline-flex">
                <Logomark size={28} />
              </Box>
              <Heading
                as="span"
                fontFamily="heading"
                fontWeight="400"
                fontSize={{ base: "26px", md: "32px" }}
                lineHeight="1"
                letterSpacing="-0.02em"
                color="fg"
              >
                Palantir for the People
              </Heading>
            </HStack>

            <EditionSlug />
          </HStack>
        </NextLink>
      </Box>

      <Box borderTopWidth="2px" borderColor="fg">
        <Box maxW="1100px" mx="auto" px="6">
          <HStack
            gap="0"
            align="stretch"
            justify="space-between"
            borderBottomWidth="1px"
            borderColor="border"
          >
            <HStack gap="0" align="stretch">
              {NAV_LINKS.map((link) => (
                <NavCell
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </HStack>
            <FileAndGradeCell />
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

function EditionSlug() {
  const [edition, setEdition] = useState<string | null>(null);
  useEffect(() => {
    setEdition(formatEdition());
  }, []);

  if (!edition) return null;
  return (
    <Text
      as="span"
      display={{ base: "none", md: "inline" }}
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="500"
      color="fg.muted"
      fontVariantNumeric="tabular-nums"
    >
      {edition}
    </Text>
  );
}

function NavCell({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <NextLink
      href={href}
      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        px={{ base: "3.5", md: "5" }}
        py="3"
        transition="background-color 120ms"
        _hover={{ bg: "bg.subtle" }}
      >
        <Text
          as="span"
          textStyle="link"
          fontWeight="500"
          color={isActive ? "fg" : "fg.muted"}
          transition="color 120ms"
        >
          {label}
        </Text>
      </Box>
    </NextLink>
  );
}

function FileAndGradeCell() {
  const pathname = usePathname();
  const href = pathname === "/" ? "#tip-report" : "/#tip-report";

  return (
    <NextLink
      href={href}
      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        bg="fg"
        color="bg"
        px={{ base: "5", md: "8" }}
        py="3"
        transition="background-color 120ms"
        _hover={{ bg: "neutral.700" }}
      >
        <Text as="span" textStyle="link" fontWeight="600" color="bg">
          File and grade
        </Text>
      </Box>
    </NextLink>
  );
}
