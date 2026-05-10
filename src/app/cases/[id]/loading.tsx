"use client";

import { Container, Grid, GridItem, Skeleton, Stack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="5xl" pb="12">
      <Stack pt="6" gap="8">
        <Skeleton height="14px" width="180px" />
        <Stack gap="5">
          <Skeleton height="36px" width="50%" />
          <Skeleton height="14px" width="40%" />
        </Stack>
        <Stack gap="0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid
              key={i}
              templateColumns={{ base: "auto 1fr", md: "80px 1fr" }}
              gap="5"
              py="4"
              borderTopWidth={i === 0 ? "0" : "1px"}
              borderColor="border.muted"
            >
              <GridItem>
                <Skeleton height="16px" width="56px" />
              </GridItem>
              <GridItem>
                <Stack gap="2">
                  <Skeleton height="20px" width="40%" />
                  <Skeleton height="16px" width="80%" />
                </Stack>
              </GridItem>
            </Grid>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
