"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export function TopBar() {
  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
      position="sticky"
      top="0"
      zIndex="docked"
    >
      <HStack
        h="48px"
        maxW="960px"
        mx="auto"
        px="6"
        align="center"
      >
        <NextLink
          href="/"
          aria-label="The Wire — home"
          style={{ textDecoration: "none" }}
        >
          <Text
            as="span"
            fontFamily="mono"
            fontSize="12px"
            lineHeight="14px"
            letterSpacing="wide"
            textTransform="uppercase"
            fontWeight="500"
            color="fg"
            _hover={{ color: "fg.muted" }}
            transition="color 150ms"
          >
            The Wire
          </Text>
        </NextLink>
      </HStack>
    </Box>
  );
}
