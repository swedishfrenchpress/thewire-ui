import { Box, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { HeuristicChip } from "@/components/shared/HeuristicChip";
import { TriageBadge } from "@/components/shared/TriageBadge";
import type { Rating } from "@/lib/types";

export const metadata: Metadata = {
  title: "Methodology · Palantir for the People",
};

export default function MethodologyPage() {
  return (
    <Container maxW="3xl" pb="20">
      <Stack gap="0" pt={{ base: "8", md: "12" }}>
        <RedEyebrow>How we verify</RedEyebrow>

        <Heading
          as="h1"
          textStyle={{ base: "display.md", md: "display.lg" }}
          fontWeight="600"
          color="fg"
          pt="3"
        >
          Methodology
        </Heading>

        <Text
          as="p"
          fontFamily="body"
          fontSize={{ base: "18px", md: "20px" }}
          lineHeight="30px"
          color="fg.muted"
          pt="4"
          pb="6"
          maxW="62ch"
        >
          The grading pipeline is the central editorial instrument of the
          platform. Every triage decision is traceable to a heuristic, and
          every heuristic carries a plain-language description.
        </Text>

        <Box borderTopWidth="3px" borderColor="fg" mt="2" mb="10" />

        <Stack gap="6" maxW="62ch">
          <Prose>
            A case is a folder of documents the journalist has uploaded. The
            agent reads every document, assigns it to a topic, generates a
            graded signal for each topic and each document, and rolls the
            most severe signal up to the case. The journalist reads the
            case fastest first: highest severity on top, the rest in order
            below.
          </Prose>
          <Prose fontWeight="600" color="fg">
            Topics, heuristics, and triage are the three primitives. Nothing
            else in the system carries editorial weight.
          </Prose>
        </Stack>

        <Section eyebrow="Topics">
          <Prose>
            A topic is a reusable theme the agent infers from the
            submitted documents (for example, &ldquo;Procurement,&rdquo;
            &ldquo;Communications messaging,&rdquo; &ldquo;Sanctions
            evasion&rdquo;). Each document belongs to exactly one topic.
            When a new case shares a theme with an older case, the agent
            assigns it to the existing topic; when no existing topic fits,
            the agent names a new one.
          </Prose>
          <Prose>
            Topic identity is global across the platform, so two
            independent leaks about the same procurement scheme will land
            in the same topic and become directly comparable.
          </Prose>
        </Section>

        <Section eyebrow="Heuristics">
          <Prose>
            A heuristic is a named, graded signal the agent emits while
            reading a document. Each heuristic has three fields: a name
            (for example, <Mono>sensitivity</Mono>,{" "}
            <Mono>claim_supported</Mono>), a rating in{" "}
            <Mono>high / medium / low</Mono>, and a description that
            explains in plain language why it fired.
          </Prose>
          <Prose>
            The heuristic set is open: the agent generates the names it
            needs for the document in front of it. We do not maintain a
            closed taxonomy. The benefit is fidelity to the actual
            evidence; the cost is that two cases will not always have
            identical heuristic sets, and cross-case comparison happens
            through topics rather than through fixed metrics.
          </Prose>
          <HeuristicList />
        </Section>

        <Section eyebrow="Sensitivity and topic triage">
          <Prose>
            Every topic carries a sensitivity level on a four-point scale.
            Sensitivity is derived from the highest-sensitivity heuristic
            the agent fired on any document in that topic, for that case.
            The mapping to a triage rating is fixed:
          </Prose>
          <SensitivityTable />
        </Section>

        <Section eyebrow="Case triage">
          <Prose>
            A case takes its triage from its most severe topic. When the
            cases list orders rows on the dashboard, it sorts by case
            triage first (high, then medium, then low) and then by
            recency. The case that lands at the top of the list is the
            next thing the journalist should read.
          </Prose>
        </Section>

        <Section eyebrow="The three triage states">
          <TriageTable />
        </Section>

        <Section eyebrow="What the grading does not measure">
          <Prose>
            The grading is a measurement of evidence the agent can see in
            the documents the journalist uploaded. It is not a probability
            of truth. A topic graded high means the agent found heuristics
            of high severity in the documents that landed in it; it does
            not mean the underlying allegation is more or less likely to
            be true.
          </Prose>
          <Prose>
            The grading also does not measure legal admissibility, public
            interest, or the editorial gravity of a finding. Those
            judgments are made by reporters and editors after the grading
            is computed.
          </Prose>
          <Prose>
            Heuristics also do not weight against each other inside a
            topic. Two medium-rated heuristics do not become a high. The
            severity of the topic is the maximum severity it contains,
            full stop. This avoids the false confidence of arithmetic over
            signals that were never numeric to begin with.
          </Prose>
        </Section>

        <Section eyebrow="The model">
          <Prose>
            The agent is a language model (currently Maple) that runs
            against a structured prompt. Its job is to read the document,
            assign it to a topic, and emit graded heuristics. It does not
            narrate, summarize, or recommend. It is a working part of the
            grading pipeline, not a contributor to the editorial product.
          </Prose>
          <Prose>
            The model is also replaceable. If a stronger or more
            specialized model becomes available, the grading layer is
            swapped without changes to the heuristic schema, the
            sensitivity scale, or the dashboard.
          </Prose>
        </Section>

        <Box pt="14" mt="10" borderTopWidth="1px" borderColor="border.muted">
          <Text textStyle="body.sm" color="fg.muted" maxW="62ch">
            The grading pipeline is open to inspection. We invite security
            researchers, journalists, and adversarial red-teamers to audit,
            critique, and propose improvements.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}

function HeuristicList() {
  const items: { name: string; rating: Rating; description: string }[] = [
    {
      name: "consistency",
      rating: "high",
      description:
        "All four submissions agree on the figures and the timeline.",
    },
    {
      name: "references",
      rating: "high",
      description:
        "Two independent FOIA returns and one ministry memo support the same fact pattern.",
    },
    {
      name: "emotive",
      rating: "low",
      description:
        "Language is neutral and procedural. No charged adjectives.",
    },
    {
      name: "ideology",
      rating: "low",
      description:
        "No partisan framing detected. The narrative reads as descriptive.",
    },
    {
      name: "sensitivity",
      rating: "high",
      description: "Highest sensitivity level in this topic is 3.",
    },
    {
      name: "claim_supported",
      rating: "medium",
      description:
        "Atlas lacked a purchase order. Evidence: no PO on file.",
    },
  ];

  return (
    <Box pt="2">
      <Text as="p" textStyle="body.md" color="fg.muted" pb="3">
        Examples the agent has emitted in production:
      </Text>
      <Stack
        gap="0"
        borderTopWidth="1px"
        borderColor="border.muted"
      >
        {items.map((h) => (
          <HStack
            key={h.name}
            gap="4"
            align="flex-start"
            py="3.5"
            borderBottomWidth="1px"
            borderColor="border.muted"
          >
            <Box minW="170px">
              <Mono>{h.name}</Mono>
            </Box>
            <Box flexShrink={0}>
              <HeuristicChip name={h.name} rating={h.rating} />
            </Box>
            <Text textStyle="body.md" color="fg" flex="1">
              {h.description}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}

function SensitivityTable() {
  const rows: { level: string; rating: Rating; meaning: string }[] = [
    {
      level: "Level 1",
      rating: "low",
      meaning:
        "Background. Useful context, rarely the next action.",
    },
    {
      level: "Level 2",
      rating: "medium",
      meaning: "Worth a look. In the queue, not at the top.",
    },
    {
      level: "Levels 3 and 4",
      rating: "high",
      meaning: "Read first. Strongest evidence in the case.",
    },
  ];

  return (
    <Stack gap="0" borderTopWidth="1px" borderColor="border.muted" pt="0">
      {rows.map((r) => (
        <HStack
          key={r.level}
          gap="5"
          align="center"
          py="4"
          borderBottomWidth="1px"
          borderColor="border.muted"
        >
          <Box minW="120px">
            <Text
              fontFamily="mono"
              fontSize="12px"
              lineHeight="14px"
              letterSpacing="wide"
              textTransform="uppercase"
              fontWeight="600"
              color="fg"
            >
              {r.level}
            </Text>
          </Box>
          <Box minW="80px" flexShrink={0}>
            <TriageBadge level={r.rating} />
          </Box>
          <Text textStyle="body.md" color="fg.muted" flex="1">
            {r.meaning}
          </Text>
        </HStack>
      ))}
    </Stack>
  );
}

function TriageTable() {
  const rows: { rating: Rating; meaning: string }[] = [
    {
      rating: "high",
      meaning:
        "Strongest evidence in the case. Read first; verify; consider escalation.",
    },
    {
      rating: "medium",
      meaning: "Worth a look. In the queue once the highs are clear.",
    },
    {
      rating: "low",
      meaning: "Background. Context for the rest, rarely the next action.",
    },
  ];

  return (
    <Stack gap="0" borderTopWidth="1px" borderColor="border.muted">
      {rows.map((r) => (
        <HStack
          key={r.rating}
          gap="5"
          align="center"
          py="4"
          borderBottomWidth="1px"
          borderColor="border.muted"
        >
          <Box minW="80px" flexShrink={0}>
            <TriageBadge level={r.rating} />
          </Box>
          <Text textStyle="body.lg" color="fg" flex="1">
            {r.meaning}
          </Text>
        </HStack>
      ))}
    </Stack>
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
      gap="4"
      pt="8"
      mt="8"
      borderTopWidth="1px"
      borderColor="border.muted"
      maxW="62ch"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Stack gap="4">{children}</Stack>
    </Stack>
  );
}

function RedEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text as="span" textStyle="eyebrow" fontWeight="600" color="fg.attention">
      {children}
    </Text>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text as="span" textStyle="eyebrow" fontWeight="600" color="fg">
      {children}
    </Text>
  );
}

function Prose({
  children,
  fontWeight = "400",
  color = "fg",
}: {
  children: React.ReactNode;
  fontWeight?: string;
  color?: string;
}) {
  return (
    <Text as="p" textStyle="body.lg" color={color} fontWeight={fontWeight}>
      {children}
    </Text>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="code"
      fontFamily="mono"
      fontSize="13px"
      bg="bg.subtle"
      color="fg"
      px="1.5"
      py="0.5"
      borderRadius="sm"
    >
      {children}
    </Text>
  );
}
