"use client";

import {
  Box,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Logomark } from "./Logomark";

const EVENT_URL = "https://www.aihackforfreedom.org/";
const BACKEND_URL = "https://github.com/carlaKC/pftp-backend";
const FRONTEND_URL = "https://github.com/swedishfrenchpress/pftp-ui";

const SOURCE_LINKS: { href: string; label: string }[] = [
  { href: BACKEND_URL, label: "Backend" },
  { href: FRONTEND_URL, label: "Frontend" },
  { href: EVENT_URL, label: "Event" },
];

export function SiteFooter() {
  return (
    <Box as="footer" mt="20">
      <Box borderTopWidth="1px" borderColor="border">
        <Box maxW="1100px" mx="auto" px="6" pt="10" pb="8">
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={{ base: "10", md: "8" }}
            justify="space-between"
            align={{ base: "flex-start", md: "flex-start" }}
          >
            <Stack gap="3" align="flex-start" maxW="360px">
              <Eyebrow>Built at</Eyebrow>
              <ExternalLink
                href={EVENT_URL}
                fontFamily="heading"
                fontWeight="400"
                fontSize={{ base: "22px", md: "24px" }}
                lineHeight="1.15"
                letterSpacing="-0.01em"
              >
                AI Hack for Freedom II
                <Arrow />
              </ExternalLink>
              <Box>
                <Text
                  fontFamily="body"
                  fontSize="14px"
                  lineHeight="1.5"
                  color="fg.muted"
                >
                  Nashville, Tennessee
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="14px"
                  lineHeight="1.5"
                  color="fg.muted"
                >
                  May 9–10, 2026
                </Text>
              </Box>
            </Stack>

            <Stack
              gap="3"
              align={{ base: "flex-start", md: "flex-end" }}
              minW={{ md: "160px" }}
            >
              <Eyebrow>Source</Eyebrow>
              <Stack gap="1.5" align={{ base: "flex-start", md: "flex-end" }}>
                {SOURCE_LINKS.map((link) => (
                  <ExternalLink
                    key={link.href}
                    href={link.href}
                    fontFamily="body"
                    fontSize="14px"
                    lineHeight="1.5"
                  >
                    {link.label}
                    <Arrow />
                  </ExternalLink>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box borderTopWidth="1px" borderColor="border">
          <Box maxW="1100px" mx="auto" px="6" py="4">
            <HStack gap="2" align="center">
              <Box color="fg" display="inline-flex">
                <Logomark size={14} />
              </Box>
              <Text
                as="span"
                fontFamily="heading"
                fontWeight="400"
                fontSize="14px"
                lineHeight="1"
                letterSpacing="-0.01em"
                color="fg"
              >
                Palantir for the People
              </Text>
            </HStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="500"
      color="fg.muted"
    >
      {children}
    </Text>
  );
}

function ExternalLink({
  href,
  children,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  fontFamily?: string;
  fontWeight?: string | number;
  fontSize?: string | { base: string; md: string };
  lineHeight?: string;
  letterSpacing?: string;
}) {
  return (
    <ChakraLink
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      color="fg"
      textDecoration="none"
      transition="color 120ms"
      _hover={{ color: "fg.muted", textDecoration: "none" }}
      {...rest}
    >
      {children}
    </ChakraLink>
  );
}

function Arrow() {
  return (
    <Text
      as="span"
      ml="1.5"
      fontFamily="mono"
      fontSize="0.85em"
      color="fg.muted"
      display="inline-block"
      transform="translateY(-1px)"
    >
      ↗
    </Text>
  );
}

