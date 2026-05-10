"use client";

import {
  Box,
  HStack,
  Input,
  SegmentGroup,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type KeyboardEvent } from "react";
import { casesStore } from "@/lib/cases-store";
import { coverImageFor } from "@/lib/cover-image";
import {
  corroborationScore,
  distributeTopics,
  topTopic,
  type Distribution,
  type Row,
} from "@/lib/triage";
import type { Rating } from "@/lib/types";

const SEGMENT_BG: Record<Rating, string> = {
  high: "bg.attentionSubtle",
  medium: "bg.warningSubtle",
  low: "bg.successSubtle",
};

const MONTHS_FULL = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function formatDateline(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

type DateFilter = "all" | "today" | "7d" | "30d";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

function dateFilterCutoff(filter: DateFilter, now: number): number | null {
  if (filter === "all") return null;
  const day = 24 * 60 * 60 * 1000;
  if (filter === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (filter === "7d") return now - 7 * day;
  if (filter === "30d") return now - 30 * day;
  return null;
}

function dateMatches(row: Row, cutoff: number | null): boolean {
  if (cutoff === null) return true;
  const created = Date.parse(row.entry.createdAt);
  if (Number.isNaN(created)) return true;
  return created >= cutoff;
}

function rowMatches(row: Row, query: string): boolean {
  if (query.length === 0) return true;
  const haystack: string[] = [row.entry.displayName];
  if (row.summary) {
    for (const t of row.summary.topics) {
      haystack.push(t.title, t.description);
    }
  }
  const q = query.toLowerCase();
  return haystack.some((s) => s.toLowerCase().includes(q));
}

function headlineFor(row: Row): string {
  const top = row.summary ? topTopic(row.summary.topics) : null;
  return top?.title ?? row.entry.displayName;
}

function eyebrowFor(row: Row): string {
  const date = formatDateline(row.entry.createdAt);
  const { summary, isError } = row;
  const left = (() => {
    if (isError || summary?.status === "failed") return "Analysis failed";
    if (!summary || summary.status === "processing") return "Awaiting analysis";
    const t = summary.topics.length;
    const d = summary.document_count;
    return `${t} ${t === 1 ? "topic" : "topics"} · ${d} ${d === 1 ? "document" : "documents"}`;
  })();
  return date ? `${left} · ${date}` : left;
}

export function ActiveCases({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const filtered = useMemo(() => {
    const cutoff = dateFilterCutoff(dateFilter, Date.now());
    const q = query.trim();
    return rows.filter(
      (row) => dateMatches(row, cutoff) && rowMatches(row, q),
    );
  }, [rows, query, dateFilter]);

  if (rows.length === 0) return null;

  const emptyReason =
    query.trim().length > 0
      ? `No cases match "${query}".`
      : dateFilter !== "all"
      ? "No cases in this date range."
      : "No cases match.";

  return (
    <Stack gap="5" w="full">
      <Eyebrow>
        Active cases · {filtered.length}
        {filtered.length !== rows.length ? ` of ${rows.length}` : ""}
      </Eyebrow>

      <HStack
        align="center"
        justify="space-between"
        gap="3"
        wrap="wrap"
      >
        <SegmentGroup.Root
          value={dateFilter}
          onValueChange={(d) => setDateFilter((d.value ?? "all") as DateFilter)}
          size="sm"
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={DATE_FILTERS} />
        </SegmentGroup.Root>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cases"
          size="sm"
          maxW="280px"
          fontFamily="body"
          fontSize="13px"
          lineHeight="15px"
          px="3"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          bg="bg"
          color="fg"
          _placeholder={{ color: "fg.muted" }}
          _hover={{ bg: "bg.subtle" }}
          _focusVisible={{
            outline: "none",
            bg: "bg",
            borderColor: "border.strong",
          }}
          aria-label="Search cases"
        />
      </HStack>

      {filtered.length === 0 ? (
        <Box py="8" borderTopWidth="1px" borderColor="border.muted">
          <Text
            fontFamily="body"
            fontSize="14px"
            lineHeight="20px"
            color="fg.muted"
          >
            {emptyReason}
          </Text>
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={{ base: "6", md: "8" }}
        >
          {filtered.map((row) => (
            <CaseCard key={row.entry.caseId} row={row} />
          ))}
        </Box>
      )}
    </Stack>
  );
}

function CaseCard({ row }: { row: Row }) {
  const router = useRouter();
  const { entry, summary, isError } = row;
  const href = `/cases/${entry.caseId}`;

  const navigate = () => {
    casesStore.touchViewed(entry.caseId);
    router.push(href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  const isProcessing = !summary || summary.status === "processing";
  const isFailed = isError || summary?.status === "failed";
  const isComplete = summary?.status === "complete";

  return (
    <Box
      role="link"
      tabIndex={0}
      onClick={navigate}
      onKeyDown={onKeyDown}
      aria-label={`Open ${entry.displayName}`}
      cursor="pointer"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="md"
      bg="bg"
      overflow="hidden"
      transition="background-color 120ms, border-color 120ms"
      _hover={{ bg: "bg.subtle", borderColor: "border" }}
      _focusVisible={{
        outline: "none",
        boxShadow: "focusRing",
        position: "relative",
        zIndex: 1,
      }}
      display="flex"
      flexDirection="column"
    >
      <CardCover
        caseId={entry.caseId}
        coverImageUrl={summary?.cover_image_url}
        headline={headlineFor(row)}
        showImage={isComplete && !isFailed}
        muted={isFailed}
      />

      <Stack gap="3" px="5" py="5" flex="1">
        <Eyebrow>{eyebrowFor(row)}</Eyebrow>

        <Text
          as="h3"
          fontFamily="heading"
          fontWeight="500"
          fontSize={{ base: "22px", md: "26px" }}
          lineHeight="1.15"
          letterSpacing="tight"
          color="fg"
          lineClamp={3}
        >
          {headlineFor(row)}
        </Text>

        <CardMetricRow row={row} />

        <Box pt="1">
          <NextLink
            href={href}
            style={{ textDecoration: "none" }}
            onClick={(e) => {
              // Let the link's default click handle nav so router.push isn't
              // double-fired by the card-level onClick. casesStore.touchViewed
              // is harmless to call twice but prefer single nav.
              e.stopPropagation();
              casesStore.touchViewed(entry.caseId);
            }}
          >
            <Text
              as="span"
              fontFamily="body"
              fontSize="13px"
              lineHeight="16px"
              color="fg"
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: "fg.muted" }}
            >
              Review the case
            </Text>
          </NextLink>
        </Box>
      </Stack>
    </Box>
  );
}

function CardCover({
  caseId,
  coverImageUrl,
  headline,
  showImage,
  muted,
}: {
  caseId: number;
  coverImageUrl: string | undefined;
  headline: string;
  showImage: boolean;
  muted: boolean;
}) {
  return (
    <Box
      position="relative"
      width="100%"
      aspectRatio="16 / 9"
      bg={muted ? "bg.subtle" : "bg.subtle"}
      overflow="hidden"
    >
      {showImage ? (
        <Image
          src={coverImageFor(caseId, coverImageUrl)}
          alt={headline}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      ) : muted ? (
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontFamily="mono"
            fontSize="11px"
            letterSpacing="wider"
            textTransform="uppercase"
            color="fg.muted"
            fontWeight="500"
          >
            Analysis failed
          </Text>
        </Box>
      ) : (
        <Skeleton width="100%" height="100%" />
      )}
    </Box>
  );
}

function CardMetricRow({ row }: { row: Row }) {
  const { summary, isError, entry } = row;

  if (isError || summary?.status === "failed") {
    return (
      <Text fontSize="13px" lineHeight="18px" color="fg.muted">
        Analysis failed for this case.
      </Text>
    );
  }

  if (!summary || summary.status === "processing") {
    return (
      <Stack gap="2">
        <Skeleton height="6px" borderRadius="sm" width="100%" />
        <Skeleton height="14px" width="60%" />
      </Stack>
    );
  }

  if (summary.topics.length === 0) {
    return (
      <Text fontSize="13px" lineHeight="18px" color="fg.muted">
        No topics inferred for this case.
      </Text>
    );
  }

  const dist = distributeTopics(summary.topics);
  const score = corroborationScore(entry.caseId);

  return (
    <Stack gap="2">
      <MiniBar distribution={dist} />
      <HStack gap="2" align="baseline" wrap="wrap">
        <Text
          as="span"
          fontFamily="body"
          fontSize="13px"
          lineHeight="16px"
          color="fg"
          fontWeight="600"
          fontVariantNumeric="tabular-nums"
        >
          {score}% corroboration
        </Text>
        <Text
          as="span"
          fontFamily="body"
          fontSize="13px"
          lineHeight="16px"
          color="fg.muted"
        >
          · {summary.topics.length}{" "}
          {summary.topics.length === 1 ? "topic" : "topics"}
        </Text>
      </HStack>
    </Stack>
  );
}

function MiniBar({ distribution }: { distribution: Distribution }) {
  const visible = distribution.ordered.filter((s) => s.count > 0);
  if (visible.length === 0) {
    return (
      <Box height="6px" borderRadius="sm" bg="bg.subtle" width="100%" />
    );
  }
  return (
    <Box
      display="flex"
      height="6px"
      borderRadius="sm"
      overflow="hidden"
      bg="bg.subtle"
      role="figure"
      aria-label={`${distribution.headline}`}
    >
      {visible.map((seg) => (
        <Box
          key={seg.rating}
          flexBasis={`${seg.pct}%`}
          flexGrow={0}
          flexShrink={0}
          bg={SEGMENT_BG[seg.rating]}
          title={`${seg.count} ${seg.count === 1 ? "topic" : "topics"} rated ${seg.rating}`}
        />
      ))}
    </Box>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="500"
      color="fg.muted"
    >
      {children}
    </Text>
  );
}
