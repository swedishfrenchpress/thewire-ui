"use client";

import { useEffect } from "react";

// One quiet line in the dev console. This is the entire easter-egg budget
// for the-wire's brand: no Konami code, no ASCII art, no rotating message.
// Talks to the developer in the same voice the product talks to the user.
export function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log(
      "%cthe-wire · for editorial use only",
      [
        "font-family: ui-monospace, SFMono-Regular, Menlo, monospace",
        "font-size: 11px",
        "letter-spacing: 0.05em",
        "color: #616161",
      ].join(";"),
    );
  }, []);
  return null;
}
