import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";

export const metadata: Metadata = {
  title: "About · Palantir for the People",
};

export default function AboutPage() {
  return (
    <Container maxW="6xl" pb="20">
      <Breadcrumbs
        items={[{ label: "Dashboard", href: "/" }, { label: "About" }]}
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
            About the wire
          </Heading>
          <Eyebrow>What it is, what it is not</Eyebrow>
        </Stack>

        <Section eyebrow="What this is">
          <Prose>
            The wire ingests plain-text corpora (leaks, transcripts, FOIA
            returns, raw notes) and returns a triaged, categorized read on
            which threads to pull first. It is built for people on a deadline:
            newsroom investigations, intelligence and fraud analysts,
            regulatory tip-line reviewers, internal-affairs intake.
          </Prose>
          <Prose>
            The user uploads. The system grades. The user navigates the
            result fastest first. Success is measured in the speed and
            confidence of the next action: opening the right document,
            escalating the right topic, killing the rest.
          </Prose>
        </Section>

        <Section eyebrow="What this is not">
          <Prose>
            Not a chat assistant. Not a generator. Not a summarizer that
            performs intelligence rather than producing it. The output is
            structured triage, not prose.
          </Prose>
          <Prose>
            The model is plumbing. Judgment is the product. The wire never
            personifies, never narrates, never decorates its work. It fires
            the rules, assigns severity, and gets out of the way.
          </Prose>
        </Section>

        <Section eyebrow="Who runs it">
          {/* TODO: replace with real attribution before public launch. */}
          <Prose>
            Built as an independent project by Erik. Editorial direction,
            heuristic curation, and product calls are made in-house. Methods
            are documented on the{" "}
            <InlineLink href="/methodology">methodology page</InlineLink>; new
            rules ship as cases reveal patterns the existing set misses.
          </Prose>
        </Section>
      </Stack>
    </Container>
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

function InlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "0.25em",
      }}
    >
      {children}
    </a>
  );
}
