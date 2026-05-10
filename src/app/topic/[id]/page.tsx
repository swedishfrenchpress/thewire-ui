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
import { Suspense, useEffect, useRef } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageDistribution } from "@/components/TriageDistribution";
import { HeuristicChip } from "@/components/shared/HeuristicChip";
import { HeuristicName } from "@/components/shared/HeuristicName";
import { TriageTag } from "@/components/TriageTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { ApiRequestError, getTopic, getTopicDocuments } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import { polarityFor } from "@/lib/heuristic-polarity";
import { useCase } from "@/lib/hooks/useCase";
import {
  distributeDocuments,
  distributeHeuristics,
  documentTriage,
} from "@/lib/triage";
import type {
  DocumentRecord,
  Heuristic,
  Rating,
  TopicDetail,
} from "@/lib/types";

// Order heuristics by how much attention they warrant for the journalist.
// A negative-polarity HIGH ("sensitivity HIGH") and a positive-polarity LOW
// ("evidence_quality LOW") both signal a problem; they should lead. Plain
// counts (claims, validation) sit in the middle. Clean signals trail.
function concernRank(h: Heuristic): number {
  const polarity = polarityFor(h.name);
  if (polarity === "unknown") return h.rating === "medium" ? 1 : 2;
  if (h.rating === "medium") return 1;
  const isGood =
    (polarity === "positive" && h.rating === "high") ||
    (polarity === "negative" && h.rating === "low");
  return isGood ? 3 : 0;
}

function sortHeuristics(heuristics: Heuristic[]): Heuristic[] {
  return [...heuristics].sort((a, b) => concernRank(a) - concernRank(b));
}

function HeuristicBullet({ h }: { h: Heuristic }) {
  return (
    <Box display="flex" gap="3" alignItems="baseline">
      <Box flexShrink={0} pt="1">
        <HeuristicChip name={h.name} rating={h.rating} />
      </Box>
      <Stack gap="1.5" minW="0" flex="1">
        <Box>
          <HeuristicName name={h.name} />
        </Box>
        <Text textStyle="body.lg" color="fg">
          {h.description}
        </Text>
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
      p="5"
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

function HeuristicDistributionPanel({
  heuristics,
}: {
  heuristics: Heuristic[];
}) {
  const dist = distributeHeuristics(heuristics);
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="5"
      bg="bg"
    >
      <TriageDistribution
        eyebrow="Signal mix across this topic"
        unit="heuristics"
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
                    textStyle="eyebrow"
                    color="fg.muted"
                    fontVariantNumeric="tabular-nums"
                  >
                    {d.heuristics.length} graded
                  </Text>
                  {highCount > 0 && (
                    <Box
                      as="span"
                      bg="bg.attentionSubtle"
                      color="fg.attention"
                      textStyle="eyebrow.sm"
                      fontWeight="600"
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
    return (
      <HelperText tone="warning">
        This topic page needs a case. Open it from a case.
      </HelperText>
    );
  }
  if (!idsValid) {
    return (
      <HelperText tone="error">Case or topic id is missing.</HelperText>
    );
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
            textStyle={{ base: "heading.lg", md: "display.sm" }}
          >
            {t.title}
          </Heading>
        </Box>
        <Text textStyle="eyebrow" color="fg.muted">
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
              <Text textStyle="body.lg" color="fg" maxW="65ch">
                {t.description}
              </Text>
            )}
            <Stack gap="0" borderTopWidth="1px" borderColor="border.muted">
              <Text
                textStyle="eyebrow"
                color="fg.muted"
                pt="4"
                pb="3"
              >
                Signals across this topic
              </Text>
              {t.heuristics.length === 0 ? (
                <Text color="fg.muted">The agent did not emit heuristics here.</Text>
              ) : (
                <Stack gap="5" pt="1" maxW="65ch">
                  {sortHeuristics(t.heuristics).map((h) => (
                    <HeuristicBullet key={h.name} h={h} />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack gap="4" position={{ lg: "sticky" }} top={{ lg: "6" }}>
            {t.heuristics.length > 0 && (
              <HeuristicDistributionPanel heuristics={t.heuristics} />
            )}
            {/* With a single doc the bar is trivially 100%; only show
                the document mix once a real distribution exists. */}
            {docs.length > 1 && <DistributionPanel docs={docs} />}
          </Stack>
        </GridItem>
      </Grid>

      <Stack gap="3" borderTopWidth="1px" borderColor="border.muted" pt="4">
        <Text textStyle="eyebrow" color="fg.muted">
          Documents in this topic ({t.document_count})
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
