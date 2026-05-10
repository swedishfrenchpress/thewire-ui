"use client";

import { Container, Grid, GridItem, Skeleton, Stack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="6xl" pb="12">
      <Stack pt="6" gap="10">
        <Skeleton height="14px" width="280px" />
        <Stack gap="3">
          <Skeleton height="32px" width="55%" />
          <Skeleton height="14px" width="45%" />
        </Stack>
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1.6fr) minmax(0, 1fr)" }}
          gap={{ base: "8", lg: "12" }}
          alignItems="start"
        >
          <GridItem>
            <Stack gap="6">
              <Skeleton height="120px" />
              <Skeleton height="180px" />
            </Stack>
          </GridItem>
          <GridItem>
            <Skeleton height="180px" />
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}
