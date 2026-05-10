"use client";

import {
  Box,
  Button,
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
  type KeyboardEvent,
  type MouseEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog } from "@/components/Dialog";
import { HelperText } from "@/components/HelperText";
import { TriageTag } from "@/components/TriageTag";
import { TriageMix } from "@/components/shared/TriageMix";
import {
  CaseCardMenu,
  type CaseMenuAction,
} from "@/components/dashboard/CaseCardMenu";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { type CaseEntry, casesStore } from "@/lib/cases-store";
import { formatRelative } from "@/lib/format";
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

function formatCreatedRelative(iso: string): string {
  const rel = formatRelative(iso);
  if (rel === "just now") return "Just now";
  if (rel === "—") return "—";
  return `${rel} ago`;
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
  if (isLoading) return <HelperText>Loading…</HelperText>;
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
      <CaseHeader
        data={data}
        elapsedMs={elapsedMs}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

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
        <TopicsSection caseId={data.case_id} topics={sorted} />
      )}
    </Stack>
  );
}

function CaseHeader({
  data,
  elapsedMs: _elapsedMs,
  onRefresh,
  isFetching = false,
}: {
  data: CaseSummary;
  elapsedMs: number;
  onRefresh?: () => void;
  isFetching?: boolean;
}) {
  const entry = casesStore.getCase(data.case_id);
  const displayName = caseHeading(entry, data.case_id);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(displayName);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, displayName]);

  const commitRename = () => {
    const next = draft.trim();
    if (next && next !== displayName) {
      casesStore.updateCase(data.case_id, { displayName: next });
    }
    setEditing(false);
  };
  const cancelRename = () => setEditing(false);

  const handleMenuSelect = (action: CaseMenuAction) => {
    if (action === "rename") {
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
            />
          ) : (
            <Heading
              as="h1"
              fontFamily="heading"
              fontWeight="400"
              letterSpacing="tight"
              fontSize={{ base: "28px", md: "36px" }}
              lineHeight="1.05"
            >
              {displayName}
            </Heading>
          )}
        </Box>

        <HStack gap="2" align="center">
          {onRefresh && data.status !== "failed" && (
            <Button
              variant="outline"
              size="sm"
              loading={isFetching}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
          <CaseCardMenu
            pinned={entry?.pinned ?? false}
            onSelect={handleMenuSelect}
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
        caseName={displayName}
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
        {formatCreatedRelative(createdAt)}
      </Text>
      <Sep />
      <Text as="span" fontFamily="mono" fontSize="11px" lineHeight="13px">
        {documentCount} {documentCount === 1 ? "document" : "documents"}
      </Text>
      <Sep />
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        color="fg.disabled"
      >
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
  const mix = triageMix(topics);
  const total = topics.length;

  return (
    <Box
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="border.muted"
      py="4"
    >
      <Grid
        templateColumns={{ base: "1fr 1fr", md: "repeat(4, auto)" }}
        gap={{ base: "4", md: "8" }}
        alignItems="center"
      >
        <Stat label="Highest triage" value={top ? <TriageTag rating={top} /> : "—"} />
        <Stat
          label={`Topics · ${total}`}
          value={<TriageMix mix={mix} />}
        />
        <Stat
          label="Documents"
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
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack gap="1.5" align="flex-start">
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
      <Skeleton
        height="2px"
        width="100%"
        borderRadius="sm"
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
    <Container maxW="5xl" pb="12">
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

