"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageDistribution } from "@/components/TriageDistribution";
import { HeuristicChip } from "@/components/shared/HeuristicChip";
import { TriageTag } from "@/components/TriageTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { ApiRequestError, getTopic, getTopicDocuments } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import { useCase } from "@/lib/hooks/useCase";
import { distributeDocuments, documentTriage } from "@/lib/triage";
import type {
  DocumentRecord,
  Heuristic,
  Rating,
  TopicDetail,
} from "@/lib/types";

function HeuristicBullet({ h }: { h: Heuristic }) {
  return (
    <Box display="flex" gap="3" alignItems="baseline">
      <Box flexShrink={0} pt="1">
        <HeuristicChip name={h.name} rating={h.rating} />
      </Box>
      <Stack gap="1" minW="0" flex="1">
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontWeight="500"
        >
          {h.name}
        </Text>
        <Text fontSize="15px" lineHeight="22px" color="fg">
          {h.description}
        </Text>
      </Stack>
    </Box>
  );
}

function StatsRow({
  label,
  value,
  indent = false,
}: {
  label: string;
  value: ReactNode;
  indent?: boolean;
}) {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      justifyContent="space-between"
      gap="3"
      py="2"
      borderBottomWidth="1px"
      borderColor="border.muted"
      _last={{ borderBottomWidth: 0 }}
    >
      <Text
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="wider"
        textTransform="uppercase"
        color={indent ? "fg.muted" : "fg"}
        fontWeight="500"
        pl={indent ? "3" : "0"}
      >
        {label}
      </Text>
      <Box
        fontFamily="mono"
        fontSize="13px"
        fontWeight="600"
        color="fg"
        fontVariantNumeric="tabular-nums"
      >
        {value}
      </Box>
    </Box>
  );
}

function StatsPanel({
  topic,
  docs,
}: {
  topic: TopicDetail;
  docs: DocumentRecord[];
}) {
  const docDist = distributeDocuments(docs);
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="4"
      bg="bg"
    >
      <Stack gap="3">
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontWeight="500"
        >
          Triage details
        </Text>
        <Stack gap="0">
          <StatsRow label="Documents" value={topic.document_count} />
          <StatsRow label="High" value={docDist.segments.high.count} indent />
          <StatsRow label="Medium" value={docDist.segments.medium.count} indent />
          <StatsRow label="Low" value={docDist.segments.low.count} indent />
          <StatsRow label="Heuristics" value={topic.heuristics.length} />
          <StatsRow
            label="Severity"
            value={<TriageTag rating={topic.triage} />}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

function DistributionPanel({ docs }: { docs: DocumentRecord[] }) {
  const dist = distributeDocuments(docs);
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="4"
      bg="bg"
    >
      <TriageDistribution
        eyebrow="Document distribution"
        unit="documents"
        distribution={dist}
      />
    </Box>
  );
}

function DocumentList({
  docs,
  caseId,
  topicId,
}: {
  docs: DocumentRecord[];
  caseId: number;
  topicId: number;
}) {
  if (docs.length === 0) {
    return <HelperText>No documents linked to this topic.</HelperText>;
  }
  const sorted = [...docs].sort((a, b) => {
    const ra = documentTriage(a);
    const rb = documentTriage(b);
    const order: Record<Rating, number> = { high: 0, medium: 1, low: 2 };
    return order[ra] - order[rb];
  });
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader width="80px">Triage</Table.ColumnHeader>
          <Table.ColumnHeader>Filename</Table.ColumnHeader>
          <Table.ColumnHeader width="160px">Heuristics</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((d) => {
          const t = documentTriage(d);
          const highCount = d.heuristics.filter((h) => h.rating === "high").length;
          return (
            <Table.Row key={d.id}>
              <Table.Cell>
                <TriageTag rating={t} />
              </Table.Cell>
              <Table.Cell>
                <ChakraLink asChild>
                  <NextLink
                    href={`/document/${d.id}?case=${caseId}&topic=${topicId}`}
                  >
                    {d.filename}
                  </NextLink>
                </ChakraLink>
              </Table.Cell>
              <Table.Cell>
                <Box display="inline-flex" alignItems="center" gap="2">
                  <Text
                    fontFamily="mono"
                    fontSize="11px"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    color="fg.muted"
                    fontWeight="500"
                    fontVariantNumeric="tabular-nums"
                  >
                    {d.heuristics.length} fired
                  </Text>
                  {highCount > 0 && (
                    <Box
                      as="span"
                      bg="bg.attentionSubtle"
                      color="fg.attention"
                      fontFamily="mono"
                      fontSize="10px"
                      fontWeight="600"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      px="1.5"
                      py="0.5"
                      borderRadius="sm"
                      fontVariantNumeric="tabular-nums"
                    >
                      {highCount} HIGH
                    </Box>
                  )}
                </Box>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}

function TopicCrumbs({
  caseId,
  topicTitle,
}: {
  caseId: number | null;
  topicTitle?: string;
}) {
  const entry =
    caseId !== null && Number.isFinite(caseId)
      ? casesStore.getCase(caseId)
      : undefined;
  const caseLabel = entry?.displayName ?? `Case ${caseId ?? ""}`.trim();
  return (
    <Breadcrumbs
      items={[
        { label: "Dashboard", href: "/" },
        {
          label: caseLabel,
          href: caseId !== null ? `/cases/${caseId}` : undefined,
        },
        { label: topicTitle ?? "Topic" },
      ]}
    />
  );
}

function TopicContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const topicId = Number(id);
  const idsValid =
    caseId !== null && Number.isFinite(caseId) && Number.isFinite(topicId);

  const detail = useQuery({
    queryKey: ["topic", caseId, topicId],
    queryFn: () => getTopic(caseId as number, topicId),
    enabled: idsValid,
    retry: (failureCount, err) => {
      if (err instanceof ApiRequestError && err.status === 404) return false;
      return failureCount < 2;
    },
  });

  const docsQuery = useQuery({
    queryKey: ["topic-documents", caseId, topicId],
    queryFn: () => getTopicDocuments(caseId as number, topicId),
    enabled: idsValid && !detail.isError,
    retry: (failureCount, err) => {
      if (err instanceof ApiRequestError && err.status === 404) return false;
      return failureCount < 2;
    },
  });

  const topicNotFound =
    detail.error instanceof ApiRequestError && detail.error.status === 404;

  // When the topic 404s, poll the parent case so we can detect when analysis
  // finishes. Same cadence as the dashboard.
  const caseQuery = useCase(caseId, { enabled: idsValid && topicNotFound });
  const caseStatus = caseQuery.query.data?.status;

  // Re-fetch the topic the moment the case becomes complete.
  const lastSeenStatusRef = useRef<typeof caseStatus>(undefined);
  useEffect(() => {
    if (
      lastSeenStatusRef.current === "processing" &&
      caseStatus === "complete"
    ) {
      detail.refetch();
    }
    lastSeenStatusRef.current = caseStatus;
  }, [caseStatus, detail]);

  if (caseId === null) {
    return <HelperText tone="warning">Missing ?case= query param.</HelperText>;
  }
  if (!idsValid) {
    return <HelperText tone="error">Invalid ids.</HelperText>;
  }

  if (topicNotFound) {
    return (
      <TopicPendingState
        caseId={caseId as number}
        caseStatus={caseStatus}
        caseError={caseQuery.query.error}
      />
    );
  }

  if (detail.isLoading) return <HelperText>Loading…</HelperText>;
  if (detail.isError)
    return <HelperText tone="error">Could not load this topic.</HelperText>;
  if (!detail.data) return null;

  const t = detail.data.topic;
  const docs = docsQuery.data?.documents ?? [];

  return (
    <Stack gap="10">
      <Stack gap="3">
        <Box display="flex" alignItems="center" gap="3" flexWrap="wrap">
          <TriageTag rating={t.triage} />
          <Heading
            as="h1"
            fontFamily="heading"
            fontWeight="400"
            letterSpacing="tight"
            fontSize={{ base: "28px", md: "36px" }}
            lineHeight="1.05"
          >
            {t.title}
          </Heading>
        </Box>
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontWeight="500"
        >
          {t.document_count} document{t.document_count === 1 ? "" : "s"} ·{" "}
          {t.heuristics.length} heuristic
          {t.heuristics.length === 1 ? "" : "s"}
        </Text>
      </Stack>

      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0, 1.6fr) minmax(0, 1fr)" }}
        gap={{ base: "8", lg: "12" }}
        alignItems="start"
      >
        <GridItem>
          <Stack gap="6">
            {t.description && (
              <Text
                fontFamily="body"
                fontSize="16px"
                lineHeight="26px"
                color="fg"
                maxW="65ch"
              >
                {t.description}
              </Text>
            )}
            <Stack gap="0" borderTopWidth="1px" borderColor="border.muted">
              <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="wider"
                textTransform="uppercase"
                color="fg.muted"
                fontWeight="500"
                pt="4"
                pb="2"
              >
                What this topic fires on
              </Text>
              {t.heuristics.length === 0 ? (
                <Text color="fg.muted">No heuristics returned.</Text>
              ) : (
                <Stack gap="5" pt="2" maxW="65ch">
                  {t.heuristics.map((h) => (
                    <HeuristicBullet key={h.name} h={h} />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack gap="4" position={{ lg: "sticky" }} top={{ lg: "6" }}>
            {docs.length > 0 && <DistributionPanel docs={docs} />}
            <StatsPanel topic={t} docs={docs} />
          </Stack>
        </GridItem>
      </Grid>

      <Stack gap="3">
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="wider"
          textTransform="uppercase"
          color="fg.muted"
          fontWeight="500"
        >
          Documents in scope ({t.document_count})
        </Text>
        {docsQuery.isLoading && <HelperText>Loading documents…</HelperText>}
        {docsQuery.isError && (
          <HelperText tone="error">
            Could not load documents for this topic.
          </HelperText>
        )}
        {docsQuery.data && (
          <DocumentList
            docs={docsQuery.data.documents}
            caseId={detail.data.case_id}
            topicId={t.id}
          />
        )}
      </Stack>
    </Stack>
  );
}

function TopicPendingState({
  caseId,
  caseStatus,
  caseError,
}: {
  caseId: number;
  caseStatus: "processing" | "complete" | "failed" | undefined;
  caseError: unknown;
}) {
  const backHref = `/cases/${caseId}`;

  if (caseError instanceof ApiRequestError && caseError.status === 404) {
    return (
      <Stack gap="4">
        <HelperText tone="error">
          Case #{caseId} was not found.
        </HelperText>
        <Button asChild variant="outline" size="sm" alignSelf="flex-start">
          <NextLink href="/">Back to dashboard</NextLink>
        </Button>
      </Stack>
    );
  }

  if (caseStatus === "failed") {
    return (
      <Stack gap="4">
        <HelperText tone="error">
          Analysis failed for case #{caseId}.
        </HelperText>
        <Button asChild variant="outline" size="sm" alignSelf="flex-start">
          <NextLink href={backHref}>Back to case</NextLink>
        </Button>
      </Stack>
    );
  }

  if (caseStatus === "complete") {
    // Case is done but the topic still 404s — it isn't part of this case.
    return (
      <Stack gap="4">
        <HelperText tone="warning">
          This topic is not part of case #{caseId}.
        </HelperText>
        <Button asChild variant="outline" size="sm" alignSelf="flex-start">
          <NextLink href={backHref}>Back to case</NextLink>
        </Button>
      </Stack>
    );
  }

  // Default: case is still processing (or we haven't gotten its status yet).
  return (
    <Stack gap="4">
      <HelperText>
        This topic is not yet available. The case is still processing.
      </HelperText>
      <Button asChild variant="outline" size="sm" alignSelf="flex-start">
        <NextLink href={backHref}>Back to case</NextLink>
      </Button>
    </Stack>
  );
}

function TopicHeaderCrumbs() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const topicId = Number(id);
  const idsValid =
    caseId !== null && Number.isFinite(caseId) && Number.isFinite(topicId);
  const detail = useQuery({
    queryKey: ["topic", caseId, topicId],
    queryFn: () => getTopic(caseId as number, topicId),
    enabled: idsValid,
    retry: (failureCount, err) => {
      if (err instanceof ApiRequestError && err.status === 404) return false;
      return failureCount < 2;
    },
  });
  return (
    <TopicCrumbs caseId={caseId} topicTitle={detail.data?.topic.title} />
  );
}

export default function TopicPage() {
  return (
    <Container maxW="6xl" pb="12">
      <Suspense fallback={null}>
        <TopicHeaderCrumbs />
      </Suspense>
      <Stack pt="6">
        <Suspense fallback={<HelperText>Loading…</HelperText>}>
          <TopicContent />
        </Suspense>
      </Stack>
    </Container>
  );
}
