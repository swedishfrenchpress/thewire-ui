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
          About the Project
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
          Whistleblowers protect our freedom, we protect their truth.
        </Text>

        <Box
          borderTopWidth="3px"
          borderColor="fg"
          mt="2"
          mb="10"
        />

        <Stack gap="6" maxW="62ch">
          <Prose>
            Whistleblowers are essential to democracy. They expose
            corruption, abuse, and the stories powerful institutions would
            rather keep hidden.
          </Prose>
          <Prose>
            But whistleblowing systems are increasingly vulnerable to spam,
            fabricated evidence, and contradictory claims that bury credible
            reports under noise. As generative AI lowers the cost of
            producing convincing fake material at scale, that problem will
            only intensify.
          </Prose>
          <Prose>
            Palantir for the People equips journalists and investigators
            with the tools to defend against this new wave of information
            warfare — helping them verify evidence, detect inconsistencies,
            and surface credible stories before the truth is drowned out.
          </Prose>
          <Prose fontWeight="600" color="fg">
            Palantir for the People surfaces signal in the face of noise.
	  </Prose>
        </Stack>

        <Section eyebrow="What we do">
          <Prose>
            We classify, grade, and filter large document dumps so reporters
            can find the documents that matter. The agent processes the full
            corpus, prioritizes the sub-groups most worth a reporter&rsquo;s
            time, and ranks individual documents on how readily their claims
            can be externally verified. Documents that contradict themselves
            are filtered out.
          </Prose>
        </Section>

        <Section eyebrow="What we produce">
          <Prose>
            A triaged corpus. Documents are grouped by topic, ordered by
            significance, and graded for verifiability. Self-contradicting
            material is set aside. We do not write, summarize, or recommend.
            We grade. The reporter is the editor.
          </Prose>
        </Section>

        <Section eyebrow="What this is not">
          <Prose>
            Not a secure submission platform. Several well-considered open
            source projects are dedicated to that problem.
          </Prose>
          <Prose>
            Not a truth oracle. LLMs are weak at identifying facts outside
            their training data, and the information in tips is, by
            definition, outside the public domain. If you could google it,
            it would not need to be whistleblown.
          </Prose>
          <Prose>
            Not a replacement for good journalism.
          </Prose>
        </Section>

        <Section eyebrow="Methodology">
          <Prose>
            We run several rounds of LLM-driven classification. Case
            analysis processes the entire document dump to identify the
            high-level topics the documents belong to. Topic analysis
            processes all the documents within a single topic to
            characterize the case being made. Per-document analysis grades
            individual documents to surface red flags and information-rich
            characteristics.
          </Prose>
          <Prose>
            For the full breakdown, see the{" "}
            <InlineLink href="/methodology">methodology page</InlineLink>.
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
