"use client";

import {
  Box,
  Container,
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageTag } from "@/components/TriageTag";
import { getCategory, getCategoryDocuments } from "@/lib/api";
import type { Heuristic, Rating } from "@/lib/types";

const RATING_TONE: Record<Rating, "success" | "warning" | "error"> = {
  high: "error",
  medium: "warning",
  low: "success",
};

function HeuristicList({ items }: { items: Heuristic[] }) {
  if (items.length === 0)
    return <Text color="fg.muted">No heuristics returned.</Text>;
  return (
    <Stack gap="3">
      {items.map((h) => (
        <Box
          key={h.name}
          p="4"
          borderWidth="1px"
          borderColor="border.muted"
          borderRadius="sm"
          bg="bg"
        >
          <Stack gap="2">
            <Box display="flex" alignItems="center" gap="3">
              <Text
                fontFamily="mono"
                fontSize="11px"
                textTransform="uppercase"
                letterSpacing="0.05em"
                color="fg.muted"
                fontWeight="500"
              >
                {h.name}
              </Text>
              <TriageTag rating={h.rating} />
            </Box>
            <Text fontSize="14px" lineHeight="20px">
              {h.description}
            </Text>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

function CategoryContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const categoryId = Number(id);
  const idsValid =
    caseId !== null && Number.isFinite(caseId) && Number.isFinite(categoryId);

  const detail = useQuery({
    queryKey: ["category", caseId, categoryId],
    queryFn: () => getCategory(caseId as number, categoryId),
    enabled: idsValid,
  });

  const docs = useQuery({
    queryKey: ["category-documents", caseId, categoryId],
    queryFn: () => getCategoryDocuments(caseId as number, categoryId),
    enabled: idsValid,
  });

  if (caseId === null) {
    return <HelperText tone="warning">Missing ?case= query param.</HelperText>;
  }
  if (!idsValid) {
    return <HelperText tone="error">Invalid ids.</HelperText>;
  }
  if (detail.isLoading) return <HelperText>Loading…</HelperText>;
  if (detail.isError)
    return <HelperText tone="error">Error: {String(detail.error)}</HelperText>;
  if (!detail.data) return null;

  const c = detail.data.category;
  // Use the rating tone for the section banner — gives the page an immediate visual cue.
  const tone = RATING_TONE[c.triage];

  return (
    <Stack gap="6">
      <ChakraLink asChild>
        <NextLink href={`/dashboard?case=${detail.data.case_id}`}>
          ← Back to dashboard
        </NextLink>
      </ChakraLink>

      <Stack gap="3">
        <Box display="flex" alignItems="center" gap="3">
          <TriageTag rating={c.triage} />
          <Heading size="xl">{c.title}</Heading>
        </Box>
        <HelperText tone={tone}>{c.description}</HelperText>
      </Stack>

      <Stack gap="3">
        <Heading size="md">Category heuristics</Heading>
        <HeuristicList items={c.heuristics} />
      </Stack>

      <Stack gap="3">
        <Heading size="md">Documents ({c.document_count})</Heading>
        {docs.isLoading && <HelperText>Loading documents…</HelperText>}
        {docs.isError && (
          <HelperText tone="error">Error: {String(docs.error)}</HelperText>
        )}
        {docs.data && (
          <Stack gap="6">
            {docs.data.documents.map((d) => (
              <Box
                key={d.id}
                p="5"
                borderWidth="1px"
                borderColor="border"
                borderRadius="sm"
                bg="bg"
              >
                <Stack gap="4">
                  <Heading size="sm">{d.filename}</Heading>
                  <HeuristicList items={d.heuristics} />
                  <Box
                    p="4"
                    bg="bg.subtle"
                    borderRadius="sm"
                    borderWidth="1px"
                    borderColor="border.muted"
                  >
                    <Text
                      whiteSpace="pre-wrap"
                      fontFamily="mono"
                      fontSize="12px"
                      lineHeight="18px"
                    >
                      {d.content}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default function CategoryPage() {
  return (
    <Container maxW="4xl" py="12">
      <Stack gap="6">
        <Heading size="3xl">Category</Heading>
        <Suspense fallback={<HelperText>Loading…</HelperText>}>
          <CategoryContent />
        </Suspense>
      </Stack>
    </Container>
  );
}
