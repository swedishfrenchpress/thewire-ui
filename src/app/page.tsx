"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ActiveCases } from "@/components/dashboard/ActiveCases";
import { OrbHero } from "@/components/landing/OrbHero";
import { TipComposer } from "@/components/landing/TipComposer";
import { formatRelative } from "@/lib/format";
import { NULL_DASH } from "@/lib/null-state";
import { useDeskSignalRows } from "@/lib/use-desk-signal";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { rows, signal } = useDeskSignalRows();

  return (
    <>
      <OrbHero signal={signal} />

      <Box maxW="640px" mx="auto" px="6" pb="10">
        <TipComposer />
      </Box>

      {mounted && rows.length > 0 && (
        <Box maxW="1100px" mx="auto" px="6" pb="20">
          <DatelineStrip
            activeCount={signal.activeCount}
            lastFilingAgeMs={signal.lastFilingAgeMs}
          />
          <Box pt="6">
            <ActiveCases rows={rows} />
          </Box>
        </Box>
      )}
    </>
  );
}

function DatelineStrip({
  activeCount,
  lastFilingAgeMs,
}: {
  activeCount: number;
  lastFilingAgeMs: number;
}) {
  const lastUpdated = useMemo(() => {
    if (!Number.isFinite(lastFilingAgeMs)) return NULL_DASH;
    const isoNow = Date.now() - lastFilingAgeMs;
    return formatRelative(new Date(isoNow).toISOString());
  }, [lastFilingAgeMs]);

  return (
    <HStack
      gap="6"
      wrap="wrap"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="border.muted"
      py="2.5"
      aria-hidden
    >
      <Datum
        label="Active cases"
        value={String(activeCount).padStart(2, "0")}
      />
      <Datum label="Last filing" value={lastUpdated} />
    </HStack>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap="2" align="baseline">
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
        {label}
      </Text>
      <Text
        as="span"
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wide"
        textTransform="uppercase"
        fontWeight="500"
        color="fg"
        fontVariantNumeric="tabular-nums"
      >
        {value}
      </Text>
    </HStack>
  );
}
