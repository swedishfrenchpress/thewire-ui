"use client";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/Dialog";

const G_PREFIX_TIMEOUT_MS = 1000;

type Scope = "anywhere" | "list" | "triage" | "home";

type Shortcut = {
  keys: string[];
  label: string;
  scope: Scope;
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["?"], label: "Show shortcuts", scope: "anywhere" },
  { keys: ["g", "h"], label: "Go to home", scope: "anywhere" },
  { keys: ["j"], label: "Next row", scope: "list" },
  { keys: ["k"], label: "Previous row", scope: "list" },
  { keys: ["Enter"], label: "Open focused row", scope: "list" },
  { keys: ["1"], label: "Filter to high", scope: "triage" },
  { keys: ["2"], label: "Filter to medium", scope: "triage" },
  { keys: ["3"], label: "Filter to low", scope: "triage" },
  { keys: ["0"], label: "Clear triage filter", scope: "triage" },
  { keys: ["/"], label: "Focus search", scope: "home" },
  { keys: ["Esc"], label: "Clear search and focus", scope: "home" },
];

type TriageRating = "high" | "medium" | "low";

const TRIAGE_KEY: Record<string, TriageRating> = {
  "1": "high",
  "2": "medium",
  "3": "low",
};

function isTriageSurface(pathname: string): boolean {
  return (
    pathname === "/" ||
    /^\/cases\/\d+/.test(pathname) ||
    /^\/topic\/\d+/.test(pathname)
  );
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

// Map the current pathname to the data-attribute that tags its navigable rows.
// Returns null on surfaces with no list to step through (e.g. /document/[id]).
function getRowSelector(pathname: string): string | null {
  if (pathname === "/") return "[data-case-card]";
  if (/^\/cases\/\d+/.test(pathname)) return "[data-topic-row]";
  if (/^\/topic\/\d+/.test(pathname)) return "[data-document-row]";
  return null;
}

function focusSearch(): boolean {
  const el = document.querySelector<HTMLInputElement>(
    "input[data-shortcut='search']",
  );
  if (!el) return false;
  el.focus();
  el.select();
  return true;
}

function focusRow(selector: string, direction: 1 | -1): boolean {
  const rows = Array.from(
    document.querySelectorAll<HTMLElement>(selector),
  );
  if (rows.length === 0) return false;
  const current = document.activeElement as HTMLElement | null;
  const index = current ? rows.indexOf(current) : -1;
  let next: number;
  if (index === -1) {
    next = direction === 1 ? 0 : rows.length - 1;
  } else {
    next = (index + direction + rows.length) % rows.length;
  }
  rows[next]?.focus();
  return true;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showCheat, setShowCheat] = useState(false);
  const gPressedAtRef = useRef<number | null>(null);

  const onHome = pathname === "/";
  const rowSelector = getRowSelector(pathname);
  const triageSurface = isTriageSurface(pathname);

  const setTriageParam = useCallback(
    (rating: TriageRating | null) => {
      const url = new URL(window.location.href);
      if (rating === null) {
        url.searchParams.delete("triage");
      } else {
        url.searchParams.set("triage", rating);
      }
      const search = url.searchParams.toString();
      router.replace(`${url.pathname}${search ? `?${search}` : ""}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const editable = isEditableTarget(e.target);

      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey && !editable) {
        e.preventDefault();
        setShowCheat((s) => !s);
        return;
      }

      if (e.key === "Escape" && showCheat) {
        setShowCheat(false);
        return;
      }

      if (editable) {
        gPressedAtRef.current = null;
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        gPressedAtRef.current = null;
        return;
      }

      if (
        e.key === "h" &&
        gPressedAtRef.current !== null &&
        Date.now() - gPressedAtRef.current < G_PREFIX_TIMEOUT_MS
      ) {
        e.preventDefault();
        gPressedAtRef.current = null;
        router.push("/");
        return;
      }

      if (e.key === "g") {
        gPressedAtRef.current = Date.now();
        return;
      }

      gPressedAtRef.current = null;

      if (onHome && e.key === "/") {
        if (focusSearch()) e.preventDefault();
        return;
      }

      if (triageSurface) {
        if (e.key in TRIAGE_KEY) {
          e.preventDefault();
          setTriageParam(TRIAGE_KEY[e.key]);
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          setTriageParam(null);
          return;
        }
      }

      if (!rowSelector) return;

      if (e.key === "j") {
        if (focusRow(rowSelector, 1)) e.preventDefault();
        return;
      }

      if (e.key === "k") {
        if (focusRow(rowSelector, -1)) e.preventDefault();
        return;
      }
    },
    [onHome, rowSelector, router, setTriageParam, showCheat, triageSurface],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return <CheatOverlay open={showCheat} onOpenChange={setShowCheat} />;
}

function CheatOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(d) => onOpenChange(d.open)}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Keyboard shortcuts</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="4">
            <Section title="Anywhere">
              {SHORTCUTS.filter((s) => s.scope === "anywhere").map((s) => (
                <Row key={s.keys.join("+")} keys={s.keys} label={s.label} />
              ))}
            </Section>
            <Section title="Lists · home, case, topic">
              {SHORTCUTS.filter((s) => s.scope === "list").map((s) => (
                <Row key={s.keys.join("+")} keys={s.keys} label={s.label} />
              ))}
            </Section>
            <Section title="Triage · home, case, topic">
              {SHORTCUTS.filter((s) => s.scope === "triage").map((s) => (
                <Row key={s.keys.join("+")} keys={s.keys} label={s.label} />
              ))}
            </Section>
            <Section title="Home">
              {SHORTCUTS.filter((s) => s.scope === "home").map((s) => (
                <Row key={s.keys.join("+")} keys={s.keys} label={s.label} />
              ))}
            </Section>
          </Stack>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap="2">
      <Text
        fontFamily="mono"
        fontSize="11px"
        lineHeight="13px"
        letterSpacing="wider"
        textTransform="uppercase"
        color="fg.muted"
        fontWeight="500"
      >
        {title}
      </Text>
      <Stack gap="1.5">{children}</Stack>
    </Stack>
  );
}

function Row({ keys, label }: { keys: string[]; label: string }) {
  return (
    <HStack justify="space-between" align="center" gap="4">
      <Text fontFamily="body" fontSize="14px" lineHeight="18px" color="fg">
        {label}
      </Text>
      <HStack gap="1">
        {keys.map((k, i) => (
          <KeyCap key={`${k}-${i}`}>{k}</KeyCap>
        ))}
      </HStack>
    </HStack>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="kbd"
      fontFamily="mono"
      fontSize="11px"
      lineHeight="14px"
      letterSpacing="wide"
      textTransform="uppercase"
      fontWeight="500"
      color="fg"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="sm"
      px="2"
      py="0.5"
      minW="6"
      textAlign="center"
    >
      {children}
    </Box>
  );
}
