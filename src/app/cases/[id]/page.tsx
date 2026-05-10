"use client";

import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import {
  TriageFilterIndicator,
  useTriageFilter,
} from "@/components/TriageFilterIndicator";
import {
  type KeyboardEvent,
  type MouseEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BureauLine,
  BureauNum,
  BureauSep,
} from "@/components/BureauLine";
import { Dialog } from "@/components/Dialog";
import { HelperText } from "@/components/HelperText";
import { TriageTag } from "@/components/TriageTag";
import { WireTime } from "@/components/WireTime";
import { InfoTip } from "@/components/shared/InfoTip";
import {
  CaseCardMenu,
  type CaseMenuAction,
} from "@/components/dashboard/CaseCardMenu";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { type CaseEntry, casesStore } from "@/lib/cases-store";
import { formatElapsed, useCase } from "@/lib/hooks/useCase";
import { TRIAGE_RANK, topTriage, triageMix } from "@/lib/triage";
import type { CaseSummary, Rating, TopicSummary } from "@/lib/types";

const STATUS_LABEL: Record<CaseSummary["status"], string> = {
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};

const GROUPING_THRESHOLD = 5;

function useCaseIdFromParams(): {
  caseId: number | null;
  caseIdValid: boolean;
} {
  const { id } = useParams<{ id: string }>();
  const caseId = id !== undefined ? Number(id) : null;
  const caseIdValid = caseId !== null && Number.isFinite(caseId);
  return { caseId, caseIdValid };
}

function caseHeading(
  entry: CaseEntry | undefined,
  caseId: number | null,
): string {
  if (entry?.displayName) return entry.displayName;
  if (caseId === null || !Number.isFinite(caseId)) return "Case";
  return `Case ${caseId}`;
}

// Render-time prettifier for filename-derived case titles. Replaces
// hyphens / underscores with spaces and sentence-cases the first letter
// only — auto title-casing every word would mis-capitalize across cases.
// Stored displayName in casesStore is left untouched.
function prettifyDisplayName(name: string): string {
  const spaced = name.replace(/[-_]+/g, " ");
  if (spaced.length === 0) return spaced;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function CaseDetail() {
  const { caseId, caseIdValid } = useCaseIdFromParams();

  const { query, elapsedMs, cappedOut, isProcessing } = useCase(caseId);
  const { data, isLoading, isError, refetch, isFetching } = query;

  if (!caseIdValid) {
    return (
      <HelperText tone="error">Case id is missing or invalid.</HelperText>
    );
  }
  if (isLoading) return <TopicSkeletonList />;
  if (isError) {
    return (
      <Stack gap="3">
        <HelperText tone="error">Could not load case #{caseId}.</HelperText>
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
    );
  }
  if (!data) return null;

  if (data.status === "failed") {
    return (
      <Stack gap="6">
        <CaseHeader data={data} elapsedMs={elapsedMs} />
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
    (a, b) => TRIAGE_RANK[a.triage] - TRIAGE_RANK[b.triage],
  );

  return (
    <Stack gap="8">
      <CaseHeader data={data} elapsedMs={elapsedMs} onRefresh={() => refetch()} />

      {isProcessing && !cappedOut && (
        <ProcessingBanner caseId={data.case_id} elapsedMs={elapsedMs} />
      )}

      {isProcessing && cappedOut && (
        <Stack gap="3">
          <HelperText tone="warning">
            Still processing. The case has run past the usual cap; refresh to
            check again.
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
        <TopicSkeletonList />
      ) : sorted.length === 0 ? (
        data.status === "complete" && (
          <Box
            borderTopWidth="1px"
            borderColor="border.muted"
            pt="6"
          >
            <Text fontSize="14px" color="fg.muted">
              No topics were inferred for this case.
            </Text>
          </Box>
        )
      ) : (
        <Box
          animation="surfaceIn var(--chakra-durations-settled) var(--chakra-easings-standard) both"
        >
          <TopicsSection caseId={data.case_id} topics={sorted} />
        </Box>
      )}

      {data.status === "complete" && <MethodologyFootnote />}

      <CaseBureauLine data={data} />
    </Stack>
  );
}

function CaseBureauLine({ data }: { data: CaseSummary }) {
  const mix = triageMix(data.topics);
  const docCount = data.document_count;
  return (
    <BureauLine
      left={
        <>
          <Box as="span">
            <BureauNum>{docCount}</BureauNum> {docCount === 1 ? "doc" : "docs"}
          </Box>
          <BureauSep />
          <Box as="span">
            <BureauNum>{mix.high}</BureauNum>H{" "}
            <BureauNum>{mix.medium}</BureauNum>M{" "}
            <BureauNum>{mix.low}</BureauNum>L
          </Box>
        </>
      }
      right={
        <>
          <Box as="span">
            Case <BureauNum>#{String(data.case_id).padStart(5, "0")}</BureauNum>
          </Box>
          <BureauSep />
          <Box as="span" color={data.status === "failed" ? "fg.attention" : "fg"}>
            {STATUS_LABEL[data.status]}
          </Box>
          <BureauSep />
          <Box as="span">
            <WireTime iso={data.created_at} eyebrow="Filed" />
          </Box>
        </>
      }
    />
  );
}

function CaseHeader({
  data,
  elapsedMs: _elapsedMs,
  onRefresh,
}: {
  data: CaseSummary;
  elapsedMs: number;
  onRefresh?: () => void;
}) {
  const entry = casesStore.getCase(data.case_id);
  const storedName = caseHeading(entry, data.case_id);
  const headingText = prettifyDisplayName(storedName);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(headingText);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(headingText);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, headingText]);

  const commitRename = () => {
    const next = draft.trim();
    if (next && next !== storedName) {
      casesStore.updateCase(data.case_id, { displayName: next });
    }
    setEditing(false);
  };
  const cancelRename = () => setEditing(false);

  const handleMenuSelect = (action: CaseMenuAction) => {
    if (action === "refresh") {
      onRefresh?.();
    } else if (action === "rename") {
      setEditing(true);
    } else if (action === "pin") {
      casesStore.pinCase(data.case_id, !(entry?.pinned ?? false));
    } else if (action === "delete") {
      setConfirmingDelete(true);
    }
  };

  const handleHeadingKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelRename();
    }
  };

  return (
    <Stack gap="5">
      <HStack
        align={{ base: "flex-start", md: "flex-start" }}
        justify="space-between"
        gap="4"
        wrap="wrap"
      >
        <Box flex="1" minW="0">
          {editing ? (
            <Input
              key="edit"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleHeadingKey}
              h="auto"
              fontFamily="heading"
              fontWeight="400"
              letterSpacing="tight"
              fontSize={{ base: "28px", md: "36px" }}
              lineHeight="1.05"
              px="2"
              py="1"
              border="1px solid"
              borderColor="border.muted"
              borderRadius="sm"
              bg="bg"
              aria-label="Case name"
              animation="fadeIn var(--chakra-durations-instant) var(--chakra-easings-standard)"
            />
          ) : (
            <Heading
              key="view"
              as="h1"
              fontFamily="heading"
              fontWeight="400"
              letterSpacing="tight"
              fontSize={{ base: "28px", md: "36px" }}
              lineHeight="1.05"
              animation="fadeIn var(--chakra-durations-instant) var(--chakra-easings-standard)"
            >
              {headingText}
            </Heading>
          )}
        </Box>

        <HStack gap="2" align="center">
          <CaseCardMenu
            pinned={entry?.pinned ?? false}
            onSelect={handleMenuSelect}
            showRefresh={Boolean(onRefresh) && data.status !== "failed"}
          />
        </HStack>
      </HStack>

      <StatusStrip
        caseId={data.case_id}
        status={data.status}
        createdAt={data.created_at}
        documentCount={data.document_count}
      />

      {data.status !== "failed" && data.topics.length > 0 && (
        <AtAGlance topics={data.topics} documentCount={data.document_count} />
      )}

      <DeleteConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        caseName={headingText}
        onConfirm={() => {
          casesStore.removeCase(data.case_id);
          setConfirmingDelete(false);
        }}
      />
    </Stack>
  );
}

function StatusStrip({
  caseId,
  status,
  createdAt,
  documentCount,
}: {
  caseId: number;
  status: CaseSummary["status"];
  createdAt: string;
  documentCount: number;
}) {
  const dot = (
    <Box
      as="span"
      w="6px"
      h="6px"
      borderRadius="full"
      bg={
        status === "failed"
          ? "fg.attention"
          : status === "processing"
          ? "fg.warning"
          : "fg.success"
      }
      display="inline-block"
      aria-hidden
    />
  );

  return (
    <HStack
      gap="3"
      align="center"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="500"
      color="fg.muted"
      flexWrap="wrap"
    >
      <HStack gap="2" align="center" color="fg">
        {dot}
        <Text as="span" fontFamily="mono" fontSize="11px" lineHeight="13px">
          {STATUS_LABEL[status]}
        </Text>
      </HStack>
      <Sep />
      <Text as="span" fontFamily="mono" fontSize="11px" lineHeight="13px">
        <WireTime iso={createdAt} eyebrow="Filed" />
      </Text>
      <Sep />
      <Text as="span" fontFamily="mono" fontSize="11px" lineHeight="13px">
        {documentCount} {documentCount === 1 ? "document" : "documents"}
      </Text>
      <Sep />
      <Text as="span" fontFamily="mono" fontSize="11px" lineHeight="13px">
        Case #{caseId}
      </Text>
    </HStack>
  );
}

function Sep() {
  return (
    <Box as="span" color="fg.disabled" aria-hidden>
      ·
    </Box>
  );
}

function AtAGlance({
  topics,
  documentCount,
}: {
  topics: TopicSummary[];
  documentCount: number;
}) {
  const top = topTriage(topics);

  return (
    <Box
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="border.muted"
      py="4"
    >
      <Grid
        templateColumns={{ base: "1fr 1fr", md: "repeat(3, auto)" }}
        gap={{ base: "4", md: "8" }}
        alignItems="center"
      >
        <Stat
          label="Priority"
          info={{
            eyebrow: "PRIORITY",
            measures:
              "The highest priority across this case's topics.",
            bands:
              "Driven by the most urgent topic the analysis surfaced.",
          }}
          value={top ? <TriageTag rating={top} /> : "—"}
        />
        <Stat
          label="Documents"
          info={{
            eyebrow: "DOCUMENTS",
            measures:
              "Plain-text and Markdown files attached to this case.",
            bands:
              "Each is read once and graded against the topics that emerge.",
          }}
          value={
            <Text
              as="span"
              fontFamily="mono"
              fontSize="14px"
              lineHeight="16px"
              color="fg"
              fontVariantNumeric="tabular-nums"
              fontWeight="500"
            >
              {documentCount}
            </Text>
          }
        />
        <Stat
          label="Top topic"
          info={{
            eyebrow: "TOP TOPIC",
            measures: "The topic with the highest priority in this case.",
            bands:
              "Listed first in the topics list; click to see its heuristics and documents.",
          }}
          value={
            <Text
              as="span"
              fontFamily="body"
              fontSize="13px"
              lineHeight="16px"
              color="fg"
              maxW="32ch"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {topTopicTitle(topics) ?? "—"}
            </Text>
          }
        />
      </Grid>
    </Box>
  );
}

function topTopicTitle(topics: TopicSummary[]): string | null {
  if (topics.length === 0) return null;
  return [...topics].sort(
    (a, b) => TRIAGE_RANK[a.triage] - TRIAGE_RANK[b.triage],
  )[0]?.title ?? null;
}

function Stat({
  label,
  value,
  info,
}: {
  label: string;
  value: React.ReactNode;
  info?: { eyebrow: string; measures: string; bands: string };
}) {
  const labelEl = (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="10px"
      lineHeight="12px"
      letterSpacing="wider"
      textTransform="uppercase"
      color="fg.muted"
      fontWeight="500"
    >
      {label}
    </Text>
  );
  return (
    <Stack gap="1.5" align="flex-start">
      {info ? (
        <InfoTip
          eyebrow={info.eyebrow}
          measures={info.measures}
          bands={info.bands}
        >
          {labelEl}
        </InfoTip>
      ) : (
        labelEl
      )}
      <Box>{value}</Box>
    </Stack>
  );
}

function TopicsSection({
  caseId,
  topics,
}: {
  caseId: number;
  topics: TopicSummary[];
}) {
  const triage = useTriageFilter();

  if (triage !== null) {
    const filtered = topics.filter((t) => t.triage === triage);
    return (
      <Stack gap="4">
        <SectionHeading label={`Topics · ${topics.length}`} />
        <TriageFilterIndicator
          rating={triage}
          shown={filtered.length}
          total={topics.length}
        />
        {filtered.length === 0 ? (
          <Text
            as="p"
            fontFamily="body"
            fontSize="14px"
            lineHeight="20px"
            color="fg.muted"
          >
            No topics at {triage} priority.
          </Text>
        ) : (
          <Stack gap="0">
            {filtered.map((t, i) => (
              <TopicRow
                key={t.id}
                topic={t}
                caseId={caseId}
                isFirst={i === 0}
              />
            ))}
          </Stack>
        )}
      </Stack>
    );
  }

  const grouped = topics.length >= GROUPING_THRESHOLD;

  if (!grouped) {
    return (
      <Stack gap="4">
        <SectionHeading label={`Topics · ${topics.length}`} />
        <Stack gap="0">
          {topics.map((t, i) => (
            <TopicRow
              key={t.id}
              topic={t}
              caseId={caseId}
              isFirst={i === 0}
            />
          ))}
        </Stack>
      </Stack>
    );
  }

  const buckets: Record<Rating, TopicSummary[]> = {
    high: [],
    medium: [],
    low: [],
  };
  for (const t of topics) buckets[t.triage].push(t);

  return (
    <Stack gap="6">
      <SectionHeading label={`Topics · ${topics.length}`} />
      {(["high", "medium", "low"] as Rating[]).map((r) => {
        const bucket = buckets[r];
        if (bucket.length === 0) return null;
        return (
          <Stack key={r} gap="3">
            <BucketHeading rating={r} count={bucket.length} />
            <Stack gap="0">
              {bucket.map((t, i) => (
                <TopicRow
                  key={t.id}
                  topic={t}
                  caseId={caseId}
                  isFirst={i === 0}
                />
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <Box borderTopWidth="1px" borderColor="fg" pt="3">
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        color="fg"
        fontWeight="600"
      >
        {label}
      </Text>
    </Box>
  );
}

function BucketHeading({
  rating,
  count,
}: {
  rating: Rating;
  count: number;
}) {
  return (
    <HStack gap="2" align="center">
      <TriageTag rating={rating} />
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        color="fg.muted"
        fontWeight="500"
      >
        · {count}
      </Text>
    </HStack>
  );
}

function TopicRow({
  topic,
  caseId,
  isFirst,
}: {
  topic: TopicSummary;
  caseId: number;
  isFirst: boolean;
}) {
  return (
    <NextLink
      href={`/topic/${topic.id}?case=${caseId}`}
      data-topic-row
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        py="4"
        borderTopWidth={isFirst ? "0" : "1px"}
        borderColor="border.muted"
        transition="background-color 120ms"
        _hover={{ bg: "bg.subtle" }}
        _focusVisible={{
          outline: "none",
          boxShadow: "focusRing",
          position: "relative",
          zIndex: 1,
        }}
        mx="-3"
        px="3"
        cursor="pointer"
      >
        <Grid
          templateColumns={{
            base: "auto 1fr",
            md: "80px 1fr",
          }}
          gap={{ base: "3", md: "5" }}
          alignItems="baseline"
        >
          <GridItem alignSelf="flex-start" pt="0.5">
            <TriageTag rating={topic.triage} />
          </GridItem>
          <GridItem minW="0">
            <Stack gap="1.5">
              <Text
                as="span"
                fontFamily="heading"
                fontWeight="400"
                fontSize={{ base: "18px", md: "20px" }}
                lineHeight="1.2"
                letterSpacing="tight"
                color="fg"
              >
                {topic.title}
              </Text>
              <Text
                as="p"
                fontFamily="body"
                fontSize="14px"
                lineHeight="20px"
                color="fg.muted"
                maxW="75ch"
                lineClamp={2}
              >
                {topic.description}
              </Text>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </NextLink>
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
      <Box
        height="2px"
        width="100%"
        borderRadius="sm"
        bg="bg.muted"
        animation="wirePulse 2s ease-in-out infinite"
        aria-hidden
        role="presentation"
      />
    </Stack>
  );
}

function TopicSkeletonList() {
  return (
    <Stack gap="0">
      {Array.from({ length: 4 }).map((_, i) => (
        <Box
          key={i}
          py="4"
          borderTopWidth={i === 0 ? "0" : "1px"}
          borderColor="border.muted"
        >
          <Grid templateColumns={{ base: "auto 1fr", md: "80px 1fr" }} gap="5">
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
        </Box>
      ))}
    </Stack>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  caseName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseName: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(d) => onOpenChange(d.open)}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Remove this case?</Dialog.Title>
          <Dialog.Description>
            {caseName} will be cleared from this index. The underlying analysis
            on the server is unaffected.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" flex="1">
              Cancel
            </Button>
          </Dialog.ActionTrigger>
          <Button
            variant="solid"
            colorPalette="red"
            flex="1"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Remove
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

function MethodologyFootnote() {
  return (
    <Box borderTopWidth="1px" borderColor="border.muted" pt="6" mt="2">
      <Text fontFamily="body" fontSize="14px" lineHeight="20px" color="fg.muted">
        <ChakraLink asChild>
          <NextLink href="/methodology">How we score documents</NextLink>
        </ChakraLink>
      </Text>
    </Box>
  );
}

function CaseCrumbs() {
  const { caseId } = useCaseIdFromParams();
  const entry =
    caseId !== null && Number.isFinite(caseId)
      ? casesStore.getCase(caseId)
      : undefined;
  return (
    <Breadcrumbs
      items={[
        { label: "Dashboard", href: "/" },
        { label: caseHeading(entry, caseId) },
      ]}
    />
  );
}

export default function CasePage() {
  return (
    <Container maxW="5xl" pb={{ base: "12", md: "20" }}>
      <Suspense fallback={null}>
        <CaseCrumbs />
      </Suspense>
      <Stack gap="6" pt="6">
        <Suspense fallback={<HelperText>Loading…</HelperText>}>
          <CaseDetail />
        </Suspense>
      </Stack>
    </Container>
  );
}

