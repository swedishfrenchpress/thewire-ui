"use client";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/Dialog";

const G_PREFIX_TIMEOUT_MS = 1000;
const HOME_PATHS = new Set(["/"]);

type Shortcut = {
  keys: string[];
  label: string;
  scope: "global" | "home";
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["/"], label: "Focus search", scope: "home" },
  { keys: ["j"], label: "Next case", scope: "home" },
  { keys: ["k"], label: "Previous case", scope: "home" },
  { keys: ["Enter"], label: "Open focused case", scope: "home" },
  { keys: ["Esc"], label: "Clear search and focus", scope: "home" },
  { keys: ["g", "d"], label: "Go to dashboard", scope: "global" },
  { keys: ["?"], label: "Show shortcuts", scope: "global" },
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
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

function focusCase(direction: 1 | -1): boolean {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-case-card]"),
  );
  if (cards.length === 0) return false;
  const current = document.activeElement as HTMLElement | null;
  const index = current ? cards.indexOf(current) : -1;
  let next: number;
  if (index === -1) {
    next = direction === 1 ? 0 : cards.length - 1;
  } else {
    next = (index + direction + cards.length) % cards.length;
  }
  cards[next]?.focus();
  return true;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showCheat, setShowCheat] = useState(false);
  const gPressedAtRef = useRef<number | null>(null);

  const onHome = HOME_PATHS.has(pathname);

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
        e.key === "d" &&
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

      if (!onHome) return;

      if (e.key === "/") {
        if (focusSearch()) e.preventDefault();
        return;
      }

      if (e.key === "j") {
        if (focusCase(1)) e.preventDefault();
        return;
      }

      if (e.key === "k") {
        if (focusCase(-1)) e.preventDefault();
        return;
      }
    },
    [onHome, router, showCheat],
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
              {SHORTCUTS.filter((s) => s.scope === "global").map((s) => (
                <Row key={s.keys.join("+")} keys={s.keys} label={s.label} />
              ))}
            </Section>
            <Section title="Dashboard">
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
