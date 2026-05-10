"use client";

import { Text } from "@chakra-ui/react";
import { definitionFor, displayHeuristicName } from "@/lib/heuristic-glossary";
import { InfoTip } from "@/components/shared/InfoTip";

interface Props {
  name: string;
}

/**
 * Renders a heuristic name as the wire-service mono label, with an
 * InfoTip if the name appears in the glossary. Names without a glossary
 * entry render as plain text so we never invent a definition we can't
 * back up.
 */
export function HeuristicName({ name }: Props) {
  const def = definitionFor(name);
  const label = (
    <Text as="span" textStyle="eyebrow" color="fg.muted">
      {displayHeuristicName(name)}
    </Text>
  );

  if (!def) return label;

  return (
    <InfoTip
      eyebrow={displayHeuristicName(name)}
      measures={def.measures}
      bands={def.bands}
    >
      {label}
    </InfoTip>
  );
}
