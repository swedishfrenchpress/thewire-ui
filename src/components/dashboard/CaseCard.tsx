"use client";

import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog } from "@/components/Dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { casesStore } from "@/lib/cases-store";
import type { Row } from "@/lib/triage";
import type { CaseStatus, CaseSummary } from "@/lib/types";
import { CaseCardMenu, type CaseMenuAction } from "./CaseCardMenu";
import { CaseMetricStrip } from "./CaseMetricStrip";

const StyledButton = chakra("button");

type Props = {
  row: Row;
  /**
   * Section context: when true, the card pulses subtly and the subline
   * copy reads as in-progress instead of finalized.
   */
  variant?: "default" | "processing" | "failed";
};

export function CaseCard({ row, variant = "default" }: Props) {
  const { entry, summary, isError, refetch } = row;
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.displayName);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(entry.displayName);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, entry.displayName]);

  const navigate = () => {
    casesStore.touchViewed(entry.caseId);
    router.push(`/cases/${entry.caseId}`);
  };

  const onCardClick = () => {
    if (editing || confirmingDelete) return;
    navigate();
  };

  const onCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing || confirmingDelete) return;
    if (e.key === "Enter") {
      e.preventDefault();
      navigate();
    }
  };

  const commitRename = () => {
    const next = draft.trim();
    if (next && next !== entry.displayName) {
      casesStore.updateCase(entry.caseId, { displayName: next });
    }
    setEditing(false);
  };
  const cancelRename = () => setEditing(false);

  const requestDelete = () => setConfirmingDelete(true);
  const confirmDelete = () => {
    casesStore.removeCase(entry.caseId);
    setConfirmingDelete(false);
  };

  const handleMenuSelect = (action: CaseMenuAction) => {
    if (action === "rename") {
      setEditing(true);
    } else if (action === "pin") {
      casesStore.pinCase(entry.caseId, !entry.pinned);
    } else if (action === "delete") {
      requestDelete();
    }
  };

  return (
    <Box
      role="link"
      tabIndex={editing ? -1 : 0}
      onClick={onCardClick}
      onKeyDown={onCardKeyDown}
      cursor={editing ? "default" : "pointer"}
      py="6"
      borderBottomWidth="1px"
      borderColor="border.muted"
      transition="background-color var(--chakra-durations-instant) var(--chakra-easings-standard)"
      _hover={editing ? undefined : { bg: "bg.subtle" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
      mx="-3"
      px="3"
      data-pinned={entry.pinned ? "" : undefined}
      aria-label={`Open case ${entry.displayName}`}
    >
      <MetaRow
        pinned={entry.pinned}
        status={summary?.status ?? null}
        isError={isError}
        onMenuSelect={handleMenuSelect}
        onRetry={refetch}
        onRemove={requestDelete}
      />

      <DeleteConfirmDialog
        open={confirmingDelete}
        onOpenChange={(open) => setConfirmingDelete(open)}
        caseName={entry.displayName}
        onConfirm={confirmDelete}
      />

      {editing ? (
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") commitRename();
            else if (e.key === "Escape") cancelRename();
          }}
          onBlur={commitRename}
          mt="3"
          h="9"
          maxW="md"
          fontSize="18px"
          aria-label="Case name"
        />
      ) : (
        <Text
          as="h2"
          mt="3"
          fontFamily="body"
          fontSize="18px"
          lineHeight="22px"
          fontWeight="500"
          color="fg"
        >
          {entry.displayName}
        </Text>
      )}

      <Subline row={row} variant={variant} isError={isError} />

      <CaseMetricStrip row={row} />
    </Box>
  );
}

function MetaRow({
  pinned,
  status,
  isError,
  onMenuSelect,
  onRetry,
  onRemove,
}: {
  pinned: boolean;
  status: CaseStatus | null;
  isError: boolean;
  onMenuSelect: (a: CaseMenuAction) => void;
  onRetry: () => void;
  onRemove: () => void;
}) {
  return (
    <HStack justify="space-between" align="center" gap="3">
      <HStack gap="3" align="center" flexWrap="wrap">
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          color="fg.muted"
          aria-hidden
        >
          <FolderIcon />
        </Box>

        {pinned && (
          <>
            <Box
              display="inline-flex"
              alignItems="center"
              gap="1.5"
              color="fg"
              textStyle="eyebrow.sm"
            >
              <PinFilledIcon />
              Pinned
            </Box>
            <Bullet />
          </>
        )}

        {isError ? (
          <ErrorInline onRetry={onRetry} onRemove={onRemove} />
        ) : status ? (
          <StatusBadge status={status} />
        ) : (
          <StatusBadge status="processing" />
        )}
      </HStack>

      <CaseCardMenu pinned={pinned} onSelect={onMenuSelect} />
    </HStack>
  );
}

function Subline({
  row,
  variant,
  isError,
}: {
  row: Row;
  variant: Props["variant"];
  isError: boolean;
}) {
  if (isError) {
    return (
      <Text mt="1" textStyle="body.sm" color="fg.muted">
        The summary could not be fetched.
      </Text>
    );
  }
  const summary = row.summary;
  const text = sublineText(summary, variant);
  return (
    <Text
      mt="1"
      fontFamily="body"
      fontSize="13px"
      lineHeight="16px"
      color="fg.muted"
      maxW="56ch"
    >
      {text}
    </Text>
  );
}

function sublineText(
  summary: CaseSummary | undefined,
  variant: Props["variant"],
): string {
  if (!summary) return "Loading metadata…";
  if (variant === "failed" || summary.status === "failed") {
    return "Analysis failed.";
  }
  if (variant === "processing" || summary.status === "processing") {
    const docs = summary.document_count;
    return `Analyzing ${docs} document${docs === 1 ? "" : "s"}…`;
  }
  const tops = summary.topics.length;
  const docs = summary.document_count;
  const TRIAGE_ORDER = { high: 0, medium: 1, low: 2 } as const;
  const topTopic = [...summary.topics].sort(
    (a, b) => TRIAGE_ORDER[a.triage] - TRIAGE_ORDER[b.triage],
  )[0];
  const parts = [
    `${tops} topic${tops === 1 ? "" : "s"}`,
    `${docs} document${docs === 1 ? "" : "s"}`,
  ];
  if (topTopic?.title) parts.push(`top: ${topTopic.title}`);
  return parts.join(" · ");
}

function ErrorInline({
  onRetry,
  onRemove,
}: {
  onRetry: () => void;
  onRemove: () => void;
}) {
  return (
    <HStack gap="2" align="center">
      <Text as="span" textStyle="eyebrow" color="fg.attention">
        Unable to load
      </Text>
      <InlineIconButton
        ariaLabel="Retry"
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
      >
        <RefreshIcon />
      </InlineIconButton>
      <InlineIconButton
        ariaLabel="Remove from index"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <CloseIcon />
      </InlineIconButton>
    </HStack>
  );
}

function InlineIconButton({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}) {
  return (
    <StyledButton
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="5"
      h="5"
      bg="transparent"
      color="fg.muted"
      borderRadius="sm"
      cursor="pointer"
      transition="color var(--chakra-durations-instant) var(--chakra-easings-standard)"
      _hover={{ color: "fg" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
    >
      {children}
    </StyledButton>
  );
}

function Bullet() {
  return (
    <Box
      as="span"
      color="fg.disabled"
      fontFamily="mono"
      fontSize="10px"
      lineHeight="12px"
      aria-hidden
    >
      •
    </Box>
  );
}

function FolderIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M3 6h6l2 2h10v11H3z" />
    </svg>
  );
}

function PinFilledIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11 3h2v6h4l-2 4h-2v8h-2v-8H9l-2-4h4z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  caseName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseName: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Remove this case?</Dialog.Title>
          <Dialog.Description>
            {caseName} will be cleared from this index. The underlying analysis
            on the server is unaffected.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" flex="1">
              Cancel
            </Button>
          </Dialog.ActionTrigger>
          <Button
            variant="solid"
            colorPalette="red"
            flex="1"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Remove
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
