"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageDistribution } from "@/components/TriageDistribution";
import { HeuristicChip } from "@/components/shared/HeuristicChip";
import { HeuristicName } from "@/components/shared/HeuristicName";
import { TriageTag } from "@/components/TriageTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { getTopic, getTopicDocuments } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import {
  TRIAGE_LABELS,
  distributeHeuristics,
  documentTriage,
} from "@/lib/triage";
import type { DocumentRecord, Heuristic } from "@/lib/types";

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

function DistributionPanel({ doc }: { doc: DocumentRecord }) {
  const dist = distributeHeuristics(doc.heuristics);
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="sm"
      p="5"
      bg="bg"
    >
      <TriageDistribution
        eyebrow="Heuristic distribution"
        unit="heuristics"
        distribution={dist}
      />
    </Box>
  );
}

function SourcePanel({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="3" borderTopWidth="1px" borderColor="border.muted" pt="6">
      <Button
        type="button"
        variant="plain"
        size="sm"
        alignSelf="flex-start"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        px="0"
      >
        <Box as="span" aria-hidden>
          {open ? "▾" : "▸"}
        </Box>
        {open ? "Hide source text" : "Show source text"}
      </Button>
      {open && (
        <Box
          bg="bg.subtle"
          borderRadius="sm"
          borderWidth="1px"
          borderColor="border.muted"
          p="4"
          maxH="60vh"
          overflowY="auto"
        >
          <Text
            as="pre"
            whiteSpace="pre-wrap"
            fontFamily="mono"
            fontSize="12px"
            lineHeight="18px"
            color="fg"
          >
            {content}
          </Text>
        </Box>
      )}
    </Stack>
  );
}

function DocumentCrumbs({
  caseId,
  topicId,
  topicTitle,
  filename,
}: {
  caseId: number | null;
  topicId: number | null;
  topicTitle?: string;
  filename?: string;
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
        {
          label: topicTitle ?? "Topic",
          href:
            caseId !== null && topicId !== null
              ? `/topic/${topicId}?case=${caseId}`
              : undefined,
        },
        { label: filename ?? "Document" },
      ]}
    />
  );
}

function DocumentContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const topicParam = searchParams.get("topic");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const topicId = topicParam !== null ? Number(topicParam) : null;
  const documentId = Number(id);
  const idsValid =
    caseId !== null &&
    Number.isFinite(caseId) &&
    topicId !== null &&
    Number.isFinite(topicId) &&
    Number.isFinite(documentId);

  const docsQuery = useQuery({
    queryKey: ["topic-documents", caseId, topicId],
    queryFn: () => getTopicDocuments(caseId as number, topicId as number),
    enabled: idsValid,
  });

  if (!idsValid) {
    return (
      <HelperText tone="error">
        This document page needs a case and a topic. Open it from a topic.
      </HelperText>
    );
  }
  if (docsQuery.isLoading) return <HelperText>Loading…</HelperText>;
  if (docsQuery.isError)
    return <HelperText tone="error">Could not load this document.</HelperText>;
  if (!docsQuery.data) return null;

  const doc = docsQuery.data.documents.find((d) => d.id === documentId);
  if (!doc) {
    return (
      <HelperText tone="error">Document not found in this topic.</HelperText>
    );
  }

  const overall = documentTriage(doc);
  const lines = doc.content.split("\n").length;
  const chars = doc.content.length;

  return (
    <Stack gap="10">
      <Stack gap="3">
        <Box display="flex" alignItems="center" gap="3" flexWrap="wrap">
          <TriageTag rating={overall} />
          <Heading
            as="h1"
            fontFamily="mono"
            fontWeight="400"
            letterSpacing="normal"
            fontSize={{ base: "20px", md: "26px" }}
            lineHeight="1.2"
            wordBreak="break-all"
          >
            {doc.filename}
          </Heading>
        </Box>
        <Text textStyle="eyebrow" color="fg.muted">
          {doc.heuristics.length} heuristic
          {doc.heuristics.length === 1 ? "" : "s"} graded · severity{" "}
          {TRIAGE_LABELS[overall]} · {lines} line{lines === 1 ? "" : "s"} ·{" "}
          {chars.toLocaleString()} char{chars === 1 ? "" : "s"}
        </Text>
      </Stack>

      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0, 1.6fr) minmax(0, 1fr)" }}
        gap={{ base: "8", lg: "12" }}
        alignItems="start"
      >
        <GridItem>
          <Stack gap="6">
            <Stack gap="0" borderTopWidth="1px" borderColor="border.muted">
              <Text textStyle="eyebrow" color="fg.muted" pt="4" pb="2">
                Signals from this document
              </Text>
              {doc.heuristics.length === 0 ? (
                <Text color="fg.muted">The agent did not emit heuristics here.</Text>
              ) : (
                <Stack gap="5" pt="2" maxW="65ch">
                  {doc.heuristics.map((h) => (
                    <HeuristicBullet key={h.name} h={h} />
                  ))}
                </Stack>
              )}
            </Stack>
            <SourcePanel content={doc.content} />
          </Stack>
        </GridItem>
        <GridItem>
          <Stack gap="4" position={{ lg: "sticky" }} top={{ lg: "6" }}>
            {doc.heuristics.length > 0 && <DistributionPanel doc={doc} />}
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  );
}

function DocumentHeaderCrumbs() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const topicParam = searchParams.get("topic");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const topicId = topicParam !== null ? Number(topicParam) : null;
  const documentId = Number(id);
  const idsValid =
    caseId !== null &&
    Number.isFinite(caseId) &&
    topicId !== null &&
    Number.isFinite(topicId) &&
    Number.isFinite(documentId);

  const topicQuery = useQuery({
    queryKey: ["topic", caseId, topicId],
    queryFn: () => getTopic(caseId as number, topicId as number),
    enabled: idsValid,
  });
  const docsQuery = useQuery({
    queryKey: ["topic-documents", caseId, topicId],
    queryFn: () => getTopicDocuments(caseId as number, topicId as number),
    enabled: idsValid,
  });
  const filename = docsQuery.data?.documents.find((d) => d.id === documentId)?.filename;

  return (
    <DocumentCrumbs
      caseId={caseId}
      topicId={topicId}
      topicTitle={topicQuery.data?.topic.title}
      filename={filename}
    />
  );
}

export default function DocumentPage() {
  return (
    <Container maxW="6xl" pb="12">
      <Suspense fallback={null}>
        <DocumentHeaderCrumbs />
      </Suspense>
      <Stack pt="6">
        <Suspense fallback={<HelperText>Loading…</HelperText>}>
          <DocumentContent />
        </Suspense>
      </Stack>
    </Container>
  );
}
