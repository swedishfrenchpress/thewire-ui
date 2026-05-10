"use client";

import {
  Button,
  Container,
  HStack,
  Heading,
  Link as ChakraLink,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageTag } from "@/components/TriageTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { casesStore } from "@/lib/cases-store";
import { formatElapsed, useCase } from "@/lib/hooks/useCase";
import type { Rating } from "@/lib/types";

const TRIAGE_ORDER: Record<Rating, number> = { high: 0, medium: 1, low: 2 };

function DashboardContent() {
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const caseIdValid = caseId !== null && Number.isFinite(caseId);

  const { query, elapsedMs, cappedOut, isProcessing } = useCase(caseId);
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  if (caseId === null) {
    return (
      <HelperText tone="warning">
        No case selected. Open the dashboard to start one.
      </HelperText>
    );
  }
  if (!caseIdValid) {
    return <HelperText tone="error">Invalid case id.</HelperText>;
  }
  if (isLoading) return <HelperText>Loading…</HelperText>;
  if (isError) return <HelperText tone="error">Error: {String(error)}</HelperText>;
  if (!data) return null;

  if (data.status === "failed") {
    return (
      <Stack gap="4">
        <CaseMetaLine
          caseId={data.case_id}
          documentCount={data.document_count}
          createdAt={data.created_at}
        />
        <HelperText tone="error">
          Analysis failed for case #{data.case_id}.
        </HelperText>
        <Button asChild variant="solid" size="sm" alignSelf="flex-start">
          <NextLink href="/">Start a new case</NextLink>
        </Button>
      </Stack>
    );
  }

  const sorted = [...data.topics].sort(
    (a, b) => TRIAGE_ORDER[a.triage] - TRIAGE_ORDER[b.triage],
  );

  return (
    <Stack gap="6">
      <CaseMetaLine
        caseId={data.case_id}
        documentCount={data.document_count}
        createdAt={data.created_at}
      />

      {isProcessing && !cappedOut && (
        <ProcessingBanner caseId={data.case_id} elapsedMs={elapsedMs} />
      )}

      {isProcessing && cappedOut && (
        <Stack gap="3">
          <HelperText tone="warning">
            Still processing — refresh to check again.
          </HelperText>
          <Button
            variant="outline"
            size="sm"
            alignSelf="flex-start"
            loading={isFetching}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Stack>
      )}

      {isProcessing && sorted.length < 3 ? (
        <TopicSkeletonRows />
      ) : sorted.length === 0 ? (
        data.status === "complete" && (
          <Text>No topics were inferred for this case.</Text>
        )
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Triage</Table.ColumnHeader>
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>
                  <TriageTag rating={c.triage} />
                </Table.Cell>
                <Table.Cell>
                  <ChakraLink asChild>
                    <NextLink href={`/topic/${c.id}?case=${data.case_id}`}>
                      {c.title}
                    </NextLink>
                  </ChakraLink>
                </Table.Cell>
                <Table.Cell>{c.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Stack>
  );
}

function CaseMetaLine({
  caseId,
  documentCount,
  createdAt,
}: {
  caseId: number;
  documentCount: number;
  createdAt: string;
}) {
  return (
    <Text color="fg.muted" fontSize="14px">
      Case {caseId} — {documentCount} documents — created {createdAt}
    </Text>
  );
}

function ProcessingBanner({
  caseId,
  elapsedMs,
}: {
  caseId: number;
  elapsedMs: number;
}) {
  return (
    <Stack
      gap="2"
      px="4"
      py="3"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="sm"
      bg="bg.subtle"
    >
      <HStack align="center" justify="space-between" gap="3" flexWrap="wrap">
        <Text fontSize="14px" color="fg">
          Analyzing case #{caseId}…
        </Text>
        <Text
          fontFamily="mono"
          fontSize="12px"
          color="fg.muted"
          fontVariantNumeric="tabular-nums"
          aria-label="elapsed time"
        >
          {formatElapsed(elapsedMs)}
        </Text>
      </HStack>
      <ProgressIndicator />
    </Stack>
  );
}

function ProgressIndicator() {
  return (
    <Skeleton
      height="2px"
      width="100%"
      borderRadius="sm"
      aria-hidden
      role="presentation"
    />
  );
}

function TopicSkeletonRows() {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Triage</Table.ColumnHeader>
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: 4 }).map((_, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Skeleton height="16px" width="56px" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="16px" width="40%" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="16px" width="80%" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function caseHeading(caseId: number | null): string {
  if (caseId === null || !Number.isFinite(caseId)) return "Case";
  const entry = casesStore.getCase(caseId);
  return entry?.displayName ?? `Case ${caseId}`;
}

function DashboardCrumbs() {
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  return (
    <Breadcrumbs
      items={[
        { label: "Dashboard", href: "/" },
        { label: caseHeading(caseId) },
      ]}
    />
  );
}

function CaseHeading() {
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  return (
    <Heading
      as="h1"
      fontFamily="heading"
      fontWeight="400"
      letterSpacing="tight"
      fontSize={{ base: "28px", md: "36px" }}
      lineHeight="1.05"
    >
      {caseHeading(caseId)}
    </Heading>
  );
}

export default function DashboardPage() {
  return (
    <Container maxW="5xl" pb="12">
      <Suspense fallback={null}>
        <DashboardCrumbs />
      </Suspense>
      <Stack gap="6" pt="6">
        <Suspense fallback={null}>
          <CaseHeading />
        </Suspense>
        <Suspense fallback={<HelperText>Loading…</HelperText>}>
          <DashboardContent />
        </Suspense>
      </Stack>
    </Container>
  );
}
