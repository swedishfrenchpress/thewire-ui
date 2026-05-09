# Product

## Register

product

## Users

People drowning in unstructured documents who need to know what matters in the next ten minutes — newsroom investigations, intelligence and fraud analysts, regulatory tip-line reviewers, internal-affairs intake. They show up with a folder of `.txt` and `.md` files (leaks, transcripts, scraped filings, FOIA returns, raw notes) and they need a defensible read on which threads to pull first. Their job context is rarely calm: a deadline, a pending interview, a brief due, a tip that may or may not be a story. They are domain experts in their own field; they are not visual-design enthusiasts and they have no patience for tooling that performs intelligence rather than producing it.

## Product Purpose

the-wire ingests a corpus of plain-text documents and returns a triaged, categorized read on it: which themes the corpus contains, which categories are high/medium/low priority, and which heuristics each document fires against. The user uploads, the system grades, the user navigates the result fastest-first. Success is measured in the speed and confidence of the user's next action — opening the right document, escalating the right category, killing the rest. The product is not the model; the product is the user's improved judgment.

## Brand Personality

Clinical and editorial. Three words: **deadpan, expert, restrained**.

Voice is the AP/FT desk, not the SaaS landing page. Sentence-case prose. Active voice. No exclamation marks. No "let's get started," no "✨ AI insights," no "powered by." Numbers and verbs, not adjectives. When the system needs to speak, it speaks like a senior editor leaving a margin note: short, declarative, never apologetic, never cute.

Visually the brand reads as wire-service infrastructure that happens to be well-typeset — Newsreader for headings (editorial weight without being precious), Departure Mono for labels and metadata (machine register, not decoration), Geist for body. Color is monochromatic by default; the only chromatic events are the three triage states. Withholding decoration is itself the statement.

## Anti-references

All four anti-references were called out explicitly. the-wire should be unmistakably none of these:

- **Stock SaaS dashboard.** No hero-metric template (big number / small label / supporting stat / gradient). No identical-card grids. No "Acme Inc." marketing chrome. If a screenshot of the-wire could be a Stripe-clone landing or a Vercel template, it has failed.
- **Consumer-warm app.** No pastel illustrations, no mascot, no chubby rounded shapes, no emoji-decorated empty states, no "Looks like there's nothing here yet 👀" copy. The user is not being entertained.
- **Enterprise / gov-tech.** No IBM Carbon density, no navy-and-gold, no breadcrumb soup, no settings-tab archipelago, no eight-column dense forms with collapse-all toggles. The fact that the work is serious does not require the chrome to look like SAP.
- **AI-tool aesthetic.** No gradient text, no glassmorphism, no neon-on-black, no sparkle/star iconography, no "magic" framing. The model is plumbing. The product never references its own intelligence.

Positive touchstones (in spirit, not visual copy): Plain, Linear in its quietest moments, early Stripe docs, FT.com and The Economist for typographic restraint, the Bloomberg terminal for "information dense without visual noise."

## Design Principles

1. **The wire is the metaphor.** Incoming signal, ranked by urgency, presented in newsroom register. The dashboard is a desk, not a homepage. Categories are the day's wires; documents are the underlying filings. Build like you're laying out a section front, not a SaaS hero.

2. **Triage is the entire UX.** A user landing on the dashboard should know within one second where the high-severity material is. Triage state earns color; nearly nothing else does. Sort, weight, and visually privilege fastest-first; never bury severity below decoration.

3. **Restraint signals authority.** Empty space is content. The default surface has nothing on it. We do not add a card just because there is room for one, and we do not add a graph just because we have the data. If a screen looks "underdesigned" by SaaS standards, it is probably correct.

4. **Editorial prose, not interface copy.** Labels, helper text, errors, and empty states read like a sub-editor wrote them — short, declarative, sentence case, no exclamation marks, no "Oops!". Errors describe what happened; they do not perform sympathy.

5. **The model is plumbing; judgment is the product.** Never personify, never narrate, never decorate the AI. No spinner that says "Thinking…", no shimmer effect on streamed text, no "Here's what I found for you!". Show the output, attribute the model only where it carries information (e.g. heuristic name), and trust the user to interpret.

## Accessibility & Inclusion

Target WCAG 2.1 AA across all surfaces. Specific commitments that follow from the register:

- **Color is never the sole carrier of meaning.** Triage state always pairs the color chip with the literal word ("HIGH"/"MEDIUM"/"LOW") and, where space allows, the rank ordering. Verify the 10–11px Departure Mono labels meet AA contrast at their used sizes against `bg.attentionSubtle`, `bg.warningSubtle`, `bg.successSubtle` — the small-text bar is 4.5:1.
- **Reduced motion is respected.** Honor `prefers-reduced-motion` on every transition, polling indicator, and progressive-reveal during processing.
- **Keyboard-first.** Triage tables, category lists, and document navigation are operable without a pointer; focus rings use the existing `focusRing` token and are never suppressed.
- **Color blindness.** The red/yellow/green triage ramp is accompanied by the literal label and by sort order, so deuteranopes and protanopes can read severity from position and text alone.
- **Locale-neutral copy.** Avoid idioms ("the wire" stays as a product name only; UI strings stay literal) so eventual i18n is mechanical, not creative.
