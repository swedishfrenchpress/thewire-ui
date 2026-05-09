"use client";

import {
  Container,
  Heading,
  Link as ChakraLink,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HelperText } from "@/components/HelperText";
import { TriageTag } from "@/components/TriageTag";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { getCase } from "@/lib/api";
import { casesStore } from "@/lib/cases-store";
import type { Rating } from "@/lib/types";

const TRIAGE_ORDER: Record<Rating, number> = { high: 0, medium: 1, low: 2 };

function DashboardContent() {
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam !== null ? Number(caseParam) : null;
  const caseIdValid = caseId !== null && Number.isFinite(caseId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCase(caseId as number),
    enabled: caseIdValid,
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 2000 : false,
  });

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
        <Text color="fg.muted" fontSize="14px">
          Case {data.case_id} — {data.document_count} documents — created{" "}
          {data.created_at}
        </Text>
        <HelperText tone="error">Analysis failed for this case.</HelperText>
      </Stack>
    );
  }

  const sorted = [...data.topics].sort(
    (a, b) => TRIAGE_ORDER[a.triage] - TRIAGE_ORDER[b.triage],
  );

  return (
    <Stack gap="6">
      <Text color="fg.muted" fontSize="14px">
        Case {data.case_id} — {data.document_count} documents — created{" "}
        {data.created_at}
      </Text>

      {data.status === "processing" && (
        <HelperText>
          Analyzing documents…
          {data.topics.length > 0
            ? ` ${data.topics.length} topic${data.topics.length === 1 ? "" : "s"} available so far.`
            : ""}
        </HelperText>
      )}

      {sorted.length === 0 ? (
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
