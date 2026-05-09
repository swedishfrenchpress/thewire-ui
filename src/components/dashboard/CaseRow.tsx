"use client";

import { Box, Input, Skeleton, Table, Text, chakra } from "@chakra-ui/react";

const StyledButton = chakra("button");
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { TriageMix } from "@/components/shared/TriageMix";
import { casesStore } from "@/lib/cases-store";
import { formatRelative } from "@/lib/format";
import { topTriage, triageMix, type Row } from "@/lib/triage";

export function CaseRow({ row }: { row: Row }) {
  const { entry, summary, isLoading, isError, refetch } = row;
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.displayName);
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

  const onRowClick = () => {
    if (editing) return;
    navigate();
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (editing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      navigate();
    }
  };

  const commit = () => {
    const next = draft.trim();
    if (next && next !== entry.displayName) {
      casesStore.updateCase(entry.caseId, { displayName: next });
    }
    setEditing(false);
  };
  const cancel = () => setEditing(false);

  const top = summary ? topTriage(summary.categories) : null;
  const mix = summary
    ? triageMix(summary.categories)
    : { high: 0, medium: 0, low: 0 };
  const isProcessing = summary?.status === "processing";

  return (
    <Table.Row
      data-row=""
      role="button"
      tabIndex={0}
      onClick={onRowClick}
      onKeyDown={onRowKeyDown}
      cursor={editing ? "default" : "pointer"}
      transition="background-color 150ms"
      _hover={editing ? undefined : { bg: "bg.subtle" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
    >
      <Table.Cell px="2" py="3" w="40px">
        <PinButton
          pinned={entry.pinned}
          onClick={() => casesStore.pinCase(entry.caseId, !entry.pinned)}
        />
      </Table.Cell>

      <Table.Cell px="3" py="3">
        {editing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") commit();
              else if (e.key === "Escape") cancel();
            }}
            onBlur={commit}
            size="sm"
            aria-label="Case name"
          />
        ) : (
          <Box display="inline-flex" alignItems="center" gap="2" maxW="100%">
            <Text
              as="span"
              fontFamily="body"
              fontSize="14px"
              lineHeight="18px"
              color="fg"
              truncate
            >
              {entry.displayName}
            </Text>
            <PencilButton
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            />
          </Box>
        )}
      </Table.Cell>

      <Table.Cell px="3" py="3" w="92px">
        <CellShell loading={isLoading} error={isError}>
          <TriageBadge level={top} />
        </CellShell>
      </Table.Cell>

      <Table.Cell px="3" py="3" w="120px">
        <CellShell loading={isLoading} error={isError}>
          {isProcessing && summary && summary.categories.length === 0 ? (
            <Box
              as="span"
              fontFamily="mono"
              fontSize="13px"
              fontStyle="italic"
              color="fg.muted"
              animation="wirePulse 2s ease-in-out infinite"
            >
              Analyzing…
            </Box>
          ) : (
            <TriageMix mix={mix} />
          )}
        </CellShell>
      </Table.Cell>

      <Table.Cell
        px="3"
        py="3"
        w="70px"
        textAlign="right"
        fontFamily="mono"
        fontSize="13px"
        color="fg"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <CellShell loading={isLoading} error={isError} alignRight>
          <Box
            as="span"
            animation={
              isProcessing
                ? "wirePulse 2s ease-in-out infinite"
                : undefined
            }
          >
            {summary?.document_count ?? 0}
          </Box>
        </CellShell>
      </Table.Cell>

      <Table.Cell px="3" py="3" w="160px">
        {isError ? (
          <Box display="inline-flex" alignItems="center" gap="2">
            <Text
              as="span"
              fontFamily="mono"
              fontSize="11px"
              lineHeight="13px"
              fontWeight="500"
              letterSpacing="wide"
              textTransform="uppercase"
              color="fg.attention"
            >
              Unable to load
            </Text>
            <RowIconButton
              ariaLabel="Retry"
              onClick={(e) => {
                e.stopPropagation();
                refetch();
              }}
            >
              <RefreshIcon />
            </RowIconButton>
            <RowIconButton
              ariaLabel="Remove from index"
              onClick={(e) => {
                e.stopPropagation();
                casesStore.removeCase(entry.caseId);
              }}
            >
              <CloseIcon />
            </RowIconButton>
          </Box>
        ) : isLoading || !summary ? (
          <Skeleton h="13px" w="92px" />
        ) : (
          <StatusBadge status={summary.status} />
        )}
      </Table.Cell>

      <Table.Cell
        px="3"
        py="3"
        w="78px"
        textAlign="right"
        fontFamily="mono"
        fontSize="13px"
        color="fg.muted"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {formatRelative(entry.createdAt)}
      </Table.Cell>
    </Table.Row>
  );
}

function CellShell({
  loading,
  error,
  alignRight,
  children,
}: {
  loading: boolean;
  error: boolean;
  alignRight?: boolean;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <Skeleton
        h="13px"
        w={alignRight ? "32px" : "60px"}
        ml={alignRight ? "auto" : undefined}
      />
    );
  }
  if (error) {
    return (
      <Box as="span" color="fg.muted" fontFamily="mono" fontSize="13px">
        —
      </Box>
    );
  }
  return <>{children}</>;
}

function PinButton({
  pinned,
  onClick,
}: {
  pinned: boolean;
  onClick: () => void;
}) {
  return (
    <StyledButton
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={pinned ? "Unpin case" : "Pin case"}
      aria-pressed={pinned}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="6"
      h="6"
      bg="transparent"
      color={pinned ? "fg" : "fg.muted"}
      borderRadius="sm"
      cursor="pointer"
      transition="color 150ms"
      _hover={{ color: "fg" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
    >
      {pinned ? <PinFilledIcon /> : <PinOutlineIcon />}
    </StyledButton>
  );
}

function PencilButton({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <StyledButton
      type="button"
      data-pencil=""
      onClick={onClick}
      aria-label="Rename case"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="5"
      h="5"
      bg="transparent"
      color="fg.muted"
      borderRadius="sm"
      cursor="pointer"
      _hover={{ color: "fg" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
    >
      <PencilIcon />
    </StyledButton>
  );
}

function RowIconButton({
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
      _hover={{ color: "fg" }}
      _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
    >
      {children}
    </StyledButton>
  );
}

function PinOutlineIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M12 3v6" />
      <path d="M7 9h10l-2 4H9l-2-4z" />
      <path d="M12 13v8" />
    </svg>
  );
}
function PinFilledIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11 3h2v6h4l-2 4h-2v8h-2v-8H9l-2-4h4z" />
    </svg>
  );
}
function PencilIcon() {
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
      <path d="M3 21h4l11-11-4-4L3 17v4z" />
      <path d="M14 6l4 4" />
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
