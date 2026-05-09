import { Box, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { TriageBadge } from "@/components/shared/TriageBadge";
import type { Rating } from "@/lib/types";

export const metadata: Metadata = {
  title: "Methodology · Palantir for the People",
};

export default function MethodologyPage() {
  return (
    <Container maxW="6xl" pb="20">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Methodology" },
        ]}
      />
      <Stack gap="10" pt="2">
        <Stack gap="3">
          <Heading
            as="h1"
            fontFamily="heading"
            fontWeight="400"
            letterSpacing="tight"
            fontSize={{ base: "32px", md: "44px" }}
            lineHeight="1.05"
          >
            How triage works
          </Heading>
          <Eyebrow>The rules behind the ranking</Eyebrow>
        </Stack>

        <Section eyebrow="The chain">
          <Prose>
            A case is a folder of documents the user has uploaded. Each
            document is read against a curated set of heuristics. Every
            heuristic that fires carries a rating: high, medium, or low.
            Heuristics group into topics; topics roll up into the case. The
            dashboard sorts cases fastest first, so the first thing on screen
            is the next thing to read.
          </Prose>
          <Prose>
            Four layers, one direction:
            documents, heuristics, topics, case.
          </Prose>
        </Section>

        <Section eyebrow="Heuristics">
          <Prose>
            A heuristic is a named rule that fires on a document when a
            specific signal is present. Each one has a short description so
            its reasoning is legible, and a rating that reflects how serious
            its presence usually is. The set is editorial, not learned. New
            rules ship as live cases reveal patterns the existing set
            misses.
          </Prose>
          <Prose>
            On a topic page, the heuristics that fired are listed verbatim,
            attributed to the documents they fired on. A reader can follow a
            triage decision from the case all the way down to the sentence
            that triggered it.
          </Prose>
        </Section>

        <Section eyebrow="Topic triage">
          <Prose>
            A topic is the cluster of documents in a case that share a
            theme. Its triage is the maximum severity among the heuristics
            that fired on its documents. A topic with even one
            high-rated heuristic is high. The rule is intentionally
            pessimistic: triage exists to make sure nothing severe is
            buried.
          </Prose>
        </Section>

        <Section eyebrow="Case triage">
          <Prose>
            A case takes its triage from its most severe topic. Cases on the
            dashboard are ordered high, then medium, then low; ties break by
            recency. The intent is simple: the first row is the one to look
            at first.
          </Prose>
        </Section>

        <Section eyebrow="The three states">
          <RatingTable />
        </Section>

        <Section eyebrow="What this will not do">
          <Prose>
            Heuristics flag patterns. They do not establish facts. A high
            triage is not a finding. A low triage is not a clearance. The
            wire improves the order of the user&apos;s reading; it does not
            replace the reading.
          </Prose>
          <Prose>
            Heuristics also do not weight each other inside a topic. Two
            mediums do not become a high. The maximum rating in the topic is
            the topic&apos;s rating, full stop. This avoids the false
            confidence of arithmetic over signals that were never numeric to
            begin with.
          </Prose>
        </Section>

        <Section eyebrow="The model">
          <Prose>
            The wire uses a language model to evaluate documents against the
            heuristic set. The model is plumbing. It does not narrate,
            summarize, or recommend. It fires the rules and assigns severity.
            Where a rule fits the document poorly, the model is meant to
            abstain rather than guess; where a document is too short to
            judge, the wire surfaces that fact instead of inventing
            heuristics to satisfy a slot.
          </Prose>
          <Prose>
            The product is not the model. The product is the user&apos;s
            improved judgment.
          </Prose>
        </Section>
      </Stack>
    </Container>
  );
}

function RatingTable() {
  const rows: { rating: Rating; meaning: string }[] = [
    {
      rating: "high",
      meaning:
        "Probably leads the day. Read it now, escalate if confirmed.",
    },
    {
      rating: "medium",
      meaning: "Worth a look. Stays in the queue, not at the top.",
    },
    {
      rating: "low",
      meaning:
        "Likely background. Useful context, rarely the next action.",
    },
  ];

  return (
    <Box maxW="65ch">
      <Stack gap="0">
        {rows.map((r, i) => (
          <HStack
            key={r.rating}
            gap="5"
            align="baseline"
            py="4"
            borderTopWidth={i === 0 ? "0" : "1px"}
            borderColor="border.muted"
          >
            <Box minW="80px">
              <TriageBadge level={r.rating} />
            </Box>
            <Text
              fontFamily="body"
              fontSize="16px"
              lineHeight="26px"
              color="fg"
            >
              {r.meaning}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <Stack
      gap="5"
      pt="6"
      borderTopWidth="1px"
      borderColor="border.muted"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Stack gap="4">{children}</Stack>
    </Stack>
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

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="p"
      fontFamily="body"
      fontSize="16px"
      lineHeight="26px"
      color="fg"
      maxW="65ch"
    >
      {children}
    </Text>
  );
}
