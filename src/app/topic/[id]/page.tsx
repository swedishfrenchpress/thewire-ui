"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
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
import {
  BureauLine,
  BureauNum,
  BureauSep,
} from "@/components/BureauLine";
import { HeuristicBreakdownView } from "@/components/HeuristicBreakdownView";
import { HelperText } from "@/components/HelperText";
import {
  TriageFilterIndicator,
  useTriageFilter,
} from "@/components/TriageFilterIndicator";
import { VerdictDistributionView } from "@/components/VerdictDistribution";
import { HeuristicMoodChip } from "@/components/shared/HeuristicMoodChip";
import { HeuristicName } from "@/components/shared/HeuristicName";
import { TriageTag } from "@/components/TriageTag";
import { VerdictTag } from "@/components/VerdictTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { ApiRequestError, getTopic, getTopicDocuments } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import { getHeuristicDisplay } from "@/lib/heuristic-display";
import { polarityOf } from "@/lib/heuristic-polarity";
import { useCase } from "@/lib/hooks/useCase";
import { distributeDocumentsByVerdict, documentVerdict } from "@/lib/triage";
import type { DocumentRecord, Heuristic, Rating } from "@/lib/types";

// Document verdict and topic triage are different vocabularies that align by
// severity. The keyboard filter (1=high, 2=medium, 3=low) maps to verdict so
// pressing 1 on a topic page shows only "concerning" docs.
const TRIAGE_TO_VERDICT: Record<Rating, "concerning" | "mixed" | "healthy"> = {
  high: "concerning",
  medium: "mixed",
  low: "healthy",
};

// Order pills so concerning leads, mixed sits in the middle, healthy trails.
// Sort key uses the same mood the sidebar buckets use, so the visual order on
// the left matches the bucket order on the right.
const MOOD_RANK = { concerning: 0, mixed: 1, healthy: 2 } as const;

function concernRank(h: Heuristic): number {
  return MOOD_RANK[getHeuristicDisplay(h.name, h.rating).mood];
}

function sortHeuristics(heuristics: Heuristic[]): Heuristic[] {
  return [...heuristics].sort((a, b) => concernRank(a) - concernRank(b));
}

function HeuristicBullet({ h }: { h: Heuristic }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "72px minmax(0, 1fr)",
        sm: "88px minmax(0, 1fr)",
      }}
      gap="3"
      alignItems="start"
    >
      <Box pt="0.5">
        <HeuristicMoodChip name={h.name} rating={h.rating} />
      </Box>
      <Stack gap="1.5" minW="0">
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
  const dist = distributeDocumentsByVerdict(docs);
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="5"
      bg="bg"
    >
      <VerdictDistributionView
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
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="5"
      bg="bg"
    >
      <HeuristicBreakdownView heuristics={heuristics} />
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
  const triage = useTriageFilter();
  if (docs.length === 0) {
    return <HelperText>No documents linked to this topic.</HelperText>;
  }
  const VERDICT_ORDER = { concerning: 0, mixed: 1, healthy: 2 };
  const sorted = [...docs].sort(
    (a, b) => VERDICT_ORDER[documentVerdict(a)] - VERDICT_ORDER[documentVerdict(b)],
  );
  const targetVerdict = triage !== null ? TRIAGE_TO_VERDICT[triage] : null;
  const visible =
    targetVerdict === null
      ? sorted
      : sorted.filter((d) => documentVerdict(d) === targetVerdict);
  return (
    <Stack gap="3">
      {triage !== null && (
        <TriageFilterIndicator
          rating={triage}
          shown={visible.length}
          total={docs.length}
        />
      )}
      {visible.length === 0 ? (
        <Text
          as="p"
          fontFamily="body"
          fontSize="14px"
          lineHeight="20px"
          color="fg.muted"
        >
          No documents at {triage} priority.
        </Text>
      ) : (
        (() => {
          const rows = visible.map((d) => {
            const v = documentVerdict(d);
            const flaggedCount = d.heuristics.filter((h) => {
              const polarity = polarityOf(h);
              if (polarity === "unknown" || h.rating === "medium") return false;
              return (
                (polarity === "negative" && h.rating === "high") ||
                (polarity === "positive" && h.rating === "low")
              );
            }).length;
            return { d, v, flaggedCount };
          });
          const HeuristicsMeta = ({
            graded,
            flagged,
          }: {
            graded: number;
            flagged: number;
          }) => (
            <HStack gap="2" align="center">
              <Text
                textStyle="eyebrow"
                color="fg.muted"
                fontVariantNumeric="tabular-nums"
              >
                {graded} graded
              </Text>
              {flagged > 0 && (
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
                  {flagged} flagged
                </Box>
              )}
            </HStack>
          );
          return (
            <>
              <Box display={{ base: "none", md: "block" }}>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader width="100px">
                        Verdict
                      </Table.ColumnHeader>
                      <Table.ColumnHeader>Filename</Table.ColumnHeader>
                      <Table.ColumnHeader width="160px">
                        Heuristics
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rows.map(({ d, v, flaggedCount }) => (
                      <Table.Row key={d.id}>
                        <Table.Cell>
                          <VerdictTag verdict={v} />
                        </Table.Cell>
                        <Table.Cell>
                          <ChakraLink asChild>
                            <NextLink
                              href={`/document/${d.id}?case=${caseId}&topic=${topicId}`}
                              data-document-row
                            >
                              {d.filename}
                            </NextLink>
                          </ChakraLink>
                        </Table.Cell>
                        <Table.Cell>
                          <HeuristicsMeta
                            graded={d.heuristics.length}
                            flagged={flaggedCount}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              <Stack
                display={{ base: "flex", md: "none" }}
                gap="0"
                borderTopWidth="1px"
                borderColor="border.muted"
              >
                {rows.map(({ d, v, flaggedCount }) => (
                  <NextLink
                    key={d.id}
                    href={`/document/${d.id}?case=${caseId}&topic=${topicId}`}
                    data-document-row
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Stack
                      gap="2"
                      py="3"
                      borderBottomWidth="1px"
                      borderColor="border.muted"
                    >
                      <Text
                        fontFamily="body"
                        fontSize="15px"
                        lineHeight="20px"
                        color="fg"
                        truncate
                      >
                        {d.filename}
                      </Text>
                      <HStack gap="2.5" align="center" flexWrap="wrap">
                        <VerdictTag verdict={v} />
                        <HeuristicsMeta
                          graded={d.heuristics.length}
                          flagged={flaggedCount}
                        />
                      </HStack>
                    </Stack>
                  </NextLink>
                ))}
              </Stack>
            </>
          );
        })()
      )}
    </Stack>
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
    enabled: idsValid,
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

  if (detail.isLoading) return null;
  if (detail.isError)
    return <HelperText tone="error">Could not load this topic.</HelperText>;
  if (!detail.data) return null;

  const t = detail.data.topic;
  const docs = docsQuery.data?.documents ?? [];

  return (
    <Stack
      gap="10"
      animation="surfaceIn var(--chakra-durations-settled) var(--chakra-easings-standard) both"
    >
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
              <Box
                pt="4"
                pb="3"
                display="flex"
                alignItems="baseline"
                gap="2"
                flexWrap="wrap"
              >
                <Text as="span" textStyle="eyebrow" color="fg.muted">
                  Signals across this topic
                </Text>
                <Text as="span" textStyle="eyebrow.sm" color="fg.muted">
                  · tap any name for its definition
                </Text>
              </Box>
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

      <TopicBureauLine
        caseId={detail.data.case_id}
        topicId={t.id}
        triage={t.triage}
        docCount={t.document_count}
        docs={docs}
      />
    </Stack>
  );
}

function TopicBureauLine({
  caseId,
  topicId,
  triage,
  docCount,
  docs,
}: {
  caseId: number;
  topicId: number;
  triage: Rating;
  docCount: number;
  docs: DocumentRecord[];
}) {
  const verdictCounts = { concerning: 0, mixed: 0, healthy: 0 };
  for (const d of docs) verdictCounts[documentVerdict(d)]++;
  const haveVerdicts = docs.length > 0;
  return (
    <BureauLine
      left={
        <>
          <Box as="span">
            <BureauNum>{docCount}</BureauNum> {docCount === 1 ? "doc" : "docs"}
          </Box>
          {haveVerdicts ? (
            <>
              <BureauSep />
              <Box as="span">
                <BureauNum>{verdictCounts.concerning}</BureauNum> Concerning{" "}
                <BureauNum>{verdictCounts.mixed}</BureauNum> Mixed{" "}
                <BureauNum>{verdictCounts.healthy}</BureauNum> Healthy
              </Box>
            </>
          ) : null}
        </>
      }
      right={
        <>
          <Box as="span">
            Topic <BureauNum>#{String(topicId).padStart(5, "0")}</BureauNum>
          </Box>
          <BureauSep />
          <Box as="span">
            Case <BureauNum>#{String(caseId).padStart(5, "0")}</BureauNum>
          </Box>
          <BureauSep />
          <Box as="span">{triage} priority</Box>
        </>
      }
    />
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
    <Container maxW="6xl" pb={{ base: "12", md: "20" }}>
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
