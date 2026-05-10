"use client";

import { Container, Grid, GridItem, Skeleton, Stack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="6xl" pb="12">
      <Stack pt="6" gap="10">
        <Skeleton height="14px" width="240px" />
        <Stack gap="3">
          <Skeleton height="36px" width="60%" />
          <Skeleton height="14px" width="40%" />
        </Stack>
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1.6fr) minmax(0, 1fr)" }}
          gap={{ base: "8", lg: "12" }}
          alignItems="start"
        >
          <GridItem>
            <Stack gap="6">
              <Skeleton height="80px" />
              <Stack gap="5">
                <Skeleton height="60px" />
                <Skeleton height="60px" />
                <Skeleton height="60px" />
              </Stack>
            </Stack>
          </GridItem>
          <GridItem>
            <Skeleton height="220px" />
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}
