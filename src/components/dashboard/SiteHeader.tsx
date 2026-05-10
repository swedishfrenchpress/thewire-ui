"use client";

import { Box, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Logomark } from "./Logomark";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
];

export function SiteHeader() {
  return (
    <Box as="header">
      <Stack
        gap="3"
        align="center"
        textAlign="center"
        pt={{ base: "8", md: "10" }}
        pb={{ base: "5", md: "6" }}
        px="6"
      >
        <NextLink
          href="/"
          aria-label="Palantir for the People, home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <HStack gap="3" align="center" justify="center">
            <Box color="fg" display="inline-flex">
              <Logomark size={32} />
            </Box>
            <Heading
              as="span"
              textStyle={{ base: "display.sm", md: "display.md" }}
              fontWeight="600"
              lineHeight="1"
              color="fg"
            >
              Palantir for the People
            </Heading>
          </HStack>
        </NextLink>

        <Text
          as="span"
          textStyle="eyebrow"
          letterSpacing="wider"
          color="fg.muted"
        >
          Documents · Scored · Defensible
        </Text>
      </Stack>

      <Box borderTopWidth="2px" borderColor="fg">
        <HStack
          gap="0"
          maxW="1200px"
          mx="auto"
          align="stretch"
          justify="center"
          borderBottomWidth="1px"
          borderColor="border"
        >
          {NAV_LINKS.map((link) => (
            <NavCell key={link.href} href={link.href} label={link.label} />
          ))}
          <AnalyzeTipCell />
        </HStack>
      </Box>
    </Box>
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
        px={{ base: "4", md: "6" }}
        py="3.5"
        borderRightWidth="1px"
        borderColor="border.muted"
        transition="background-color 120ms"
        _hover={{ bg: "bg.subtle" }}
      >
        <Text
          as="span"
          textStyle="link"
          fontWeight={isActive ? "600" : "500"}
          color={isActive ? "fg" : "fg.muted"}
          transition="color 120ms"
        >
          {label}
        </Text>
      </Box>
    </NextLink>
  );
}

function AnalyzeTipCell() {
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
        py="3.5"
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
