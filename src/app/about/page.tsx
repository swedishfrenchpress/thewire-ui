import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Palantir for the People",
};

export default function AboutPage() {
  return (
    <Container maxW="3xl" pb="20">
      <Stack gap="0" pt={{ base: "8", md: "12" }}>
        <Eyebrow>About</Eyebrow>

        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="400"
          letterSpacing="-0.02em"
          fontSize={{ base: "44px", md: "60px" }}
          lineHeight="1"
          color="fg"
          pt="3"
        >
          About Palantir for the People
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
          Palantir for the People is a verification tool for newsrooms. It
          helps journalists assess whistleblower claims and source documents
          using a transparent agent that grades evidence and surfaces the
          strongest leads first.
        </Text>

        <Box
          borderTopWidth="3px"
          borderColor="fg"
          mt="2"
          mb="10"
        />

        <Stack gap="6" maxW="62ch">
          <Prose>
            Authoritarian regimes, captured institutions, and corrupt private
            actors depend on opacity to function. The people closest to
            wrongdoing (civil servants, contractors, NGO staff, family
            members) usually know what is happening before any journalist
            does. Few of them come forward, and the few who do arrive at
            newsrooms with folders of unstructured material that overworked
            desks rarely have the time to read in full.
          </Prose>
          <Prose fontWeight="600" color="fg">
            Palantir for the People is the verification layer between the
            source and the desk.
          </Prose>
        </Stack>

        <Section eyebrow="What we do">
          <Prose>
            Journalists upload documents, transcripts, leaked memos, and
            notes. The agent reads each document, assigns it to a topic, and
            grades it against an open set of heuristics: sensitivity, claim
            support, classification rationale, and others that the model
            generates as it goes. Every grading carries a short description
            so the reporter can see, in plain language, what the heuristic
            measured and how the agent graded it.
          </Prose>
          <Prose>
            Topics roll up to a case. The case lands on the dashboard ranked
            fastest first: high severity at the top, low severity at the
            bottom. The reporter walks the queue and stops where the
            evidence stops being defensible.
          </Prose>
        </Section>

        <Section eyebrow="What we produce">
          <Prose>
            Triaged topics, graded documents, and named heuristics with
            descriptions. We do not write, summarize, or recommend. We
            grade. The reporter is the editor.
          </Prose>
        </Section>

        <Section eyebrow="What this is not">
          <Prose>
            Not a tip line for anonymous submitters. Not a publication. Not
            a substitute for reporting, calling sources, or verifying
            documents in the field. A high triage is the start of the work,
            not the end of it. A low triage is the back of the queue, not a
            clearance.
          </Prose>
          <Prose>
            We are also not the model. The model is a working part of the
            grading pipeline. It is replaceable, auditable, and does not
            speak for the product.
          </Prose>
        </Section>

        <Section eyebrow="Governance">
          <Prose>
            Palantir for the People is built as an independent project. The
            grading methodology is documented on the{" "}
            <InlineLink href="/methodology">methodology page</InlineLink> and
            the codebase is open to inspection.
          </Prose>
          <Prose>
            We accept no advertising, no government contracts, and no
            donations from named subjects of submitted documents.
          </Prose>
        </Section>

        <Section eyebrow="Contact">
          <Prose>
            {/* TODO: replace with real contact addresses before public launch. */}
            For press: press@palantirforthepeople.org
          </Prose>
          <Prose>Source code: github.com/swedishfrenchpress/thewire-ui</Prose>
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="13px"
      letterSpacing="wider"
      textTransform="uppercase"
      fontWeight="600"
      color="fg"
    >
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
    <Text
      as="p"
      fontFamily="body"
      fontSize="16px"
      lineHeight="26px"
      color={color}
      fontWeight={fontWeight}
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
