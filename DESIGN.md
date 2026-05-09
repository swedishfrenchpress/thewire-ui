---
name: the-wire
description: Document triage for newsroom and intake desks.
colors:
  wire-black: "#000000"
  press-ink: "#191919"
  mid-graphite: "#363636"
  desk-graphite: "#616161"
  working-grey: "#8f8f8f"
  column-rule: "#e5e5e5"
  newsprint-tint: "#f7f7f7"
  newsprint: "#ffffff"
  filing-red: "#d50b0b"
  filing-red-deep: "#570303"
  triage-red-tint: "#ffdede"
  wire-yellow: "#eebb04"
  wire-yellow-deep: "#855f00"
  triage-yellow-tint: "#fff8d5"
  cleared-green: "#3cc14e"
  cleared-green-deep: "#1b561a"
  triage-green-tint: "#e0fae0"
  focus-blue: "#0968f6"
typography:
  display:
    fontFamily: "Newsreader, ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 7vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, ui-serif, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, ui-serif, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "0"
  label:
    fontFamily: "'Departure Mono', 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "13px"
    letterSpacing: "0.05em"
rounded:
  xs: "1px"
  sm: "2px"
  md: "4px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.wire-black}"
    textColor: "{colors.newsprint}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.mid-graphite}"
    textColor: "{colors.newsprint}"
  button-outline:
    backgroundColor: "{colors.newsprint}"
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "32px"
  button-destructive:
    backgroundColor: "{colors.filing-red}"
    textColor: "{colors.newsprint}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "32px"
  input:
    backgroundColor: "{colors.newsprint}"
    textColor: "{colors.press-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  chip-triage-high:
    backgroundColor: "{colors.triage-red-tint}"
    textColor: "{colors.filing-red-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  chip-triage-medium:
    backgroundColor: "{colors.triage-yellow-tint}"
    textColor: "{colors.wire-yellow-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  chip-triage-low:
    backgroundColor: "{colors.triage-green-tint}"
    textColor: "{colors.cleared-green-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  card-document:
    backgroundColor: "{colors.newsprint}"
    textColor: "{colors.press-ink}"
    rounded: "{rounded.sm}"
    padding: "20px"
  helper-text:
    backgroundColor: "{colors.newsprint-tint}"
    textColor: "{colors.desk-graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  file-upload-idle:
    backgroundColor: "{colors.newsprint-tint}"
    textColor: "{colors.press-ink}"
    rounded: "{rounded.lg}"
    padding: "32px 24px"
    height: "224px"
---

# Design System: the-wire

## 1. Overview

**Creative North Star: "The Wire-Service Desk"**

the-wire renders like a wire-service copy desk on a slow news day: a clean sheet, ranked dispatches, mono filing slugs, ink for the page and chrome for almost nothing else. The system inherits its weight from the page, not from frames or panels, and its rhythm from the difference between newsprint and ink, not from shadows or color. When the operator sits down, the screen behaves like the desk: stories ranked top-to-bottom by urgency, severity called out in three small chips that read at a glance, and absolutely nothing else asking for attention. Every interaction reads as a desk affordance — pulling a wire, flagging a story, sending it down the stack — translated into UI.

The visual register is split between two specific moves. Headings use Newsreader, the editorial serif, set in a single weight at tight tracking, so titles feel typeset rather than user-generated. Labels and metadata use Departure Mono in uppercase with `0.05em` tracking, the typographic equivalent of a teleprinter slug or a margin annotation. Body text is Geist, kept narrow and quiet to stay out of the way. The palette is monochromatic by doctrine — pure ink, pure page, a single graphite ramp between them — punctuated only by the three triage states (filing red, wire yellow, cleared green) which always appear paired with their literal label so they survive without color. There is no decorative color, no gradient, no glassmorphism, no "AI" sparkle.

The system explicitly rejects the four anti-patterns named in PRODUCT.md: stock SaaS dashboards (no hero metrics, no identical icon cards), consumer-warm app aesthetics (no pastels, no mascots, no chubby rounded UI), enterprise / gov-tech density (no IBM Carbon eight-column form blocks, no navy-and-gold), and AI-tool decoration (no gradient text, no neon-on-black, no shimmer or sparkle). If a screen looks "underdesigned" by any of those references, it is probably correct.

**Key Characteristics:**

- **Ink and newsprint, with three exceptions.** Pure `#000000` on pure `#ffffff` (or inverted in dark mode), one graphite ramp, plus the three triage tints. That is the entire color story.
- **Near-square corners.** `2px` radii are the default for buttons, inputs, chips, cards, and menus. `8px` is reserved for one element: the file-drop tile.
- **Mono labels, serif titles, sans body.** Three faces, three jobs, no overlap. The mono register signals "metadata" and is used for buttons, table column headers, links, triage chips, and any uppercase microcopy.
- **Flat by default; depth only on focus and float.** No ambient shadows. Surfaces stack via 1px borders and a single subtle background tint. The only shadows are the focus ring and the menu popover.
- **Status earns color; nothing else does.** Red, yellow, and green appear exclusively for triage state. They never mean "primary action," "decoration," or "category."
- **Dual-theme inversion.** Dark mode is not a tinted dark; it is a full inversion to chalk-on-blackboard, preserving the same monochromatic doctrine.

## 2. Colors: The Wire-Service Palette

A monochromatic ink ramp plus three status pairs. Every chromatic event in the interface is a triage signal; if a color appears, it means severity.

### Primary

- **Wire Black** (`#000000`, `oklch(0% 0 0)`): The press's deepest ink. Used as the primary button background, as the `::selection` background, and as the dark-mode page background. The literal endpoint of the ramp; reserved, not casually applied.
- **Press Ink** (`#191919`, `oklch(20% 0 0)`): Default body text and primary heading color in light mode. The "set type" color — what reads as content rather than chrome.

### Tertiary: Triage States

Each triage state is a *pair* of colors: a saturated tint for the chip background and a deep variant for the foreground text on top of that tint. Both always appear together so AA contrast holds and so the text label survives if the color does not.

- **Filing Red** (`#d50b0b`, `oklch(54% 0.21 28)`) on **Triage Red Tint** (`#ffdede`): HIGH triage. The chip background is the tint; the chip label, plus matching deep variant `#570303`, is the text. Filing Red also serves as the destructive button background.
- **Wire Yellow** (`#eebb04`, `oklch(82% 0.16 90)`) on **Triage Yellow Tint** (`#fff8d5`): MEDIUM triage. Deep label variant `#855f00` (wire-yellow-deep). Used for the medium chip and any "in-progress" / "warning" helper text.
- **Cleared Green** (`#3cc14e`, `oklch(70% 0.20 145)`) on **Triage Green Tint** (`#e0fae0`): LOW triage. Deep label variant `#1b561a` (cleared-green-deep). Used for the low chip and for `success` helper text.

### Neutral

- **Mid-Graphite** (`#363636`, `oklch(28% 0 0)`): Hover state for the primary (Wire Black) button. The "pressed" register.
- **Desk-Graphite** (`#616161`, `oklch(48% 0 0)`): Muted text — secondary metadata, table cell descriptions, default helper-text color.
- **Working-Grey** (`#8f8f8f`, `oklch(64% 0 0)`): Subtle text and the medium border (e.g. dashed border on the file-upload tile in `dragging` state). The midtone between page and ink.
- **Column-Rule** (`#e5e5e5`, `oklch(91% 0 0)`): Default 1px border; also doubles as the subtle-divider color between table rows. Named for the printer's term for the thin vertical line between columns of set type.
- **Newsprint-Tint** (`#f7f7f7`, `oklch(97% 0 0)`): Subtle background — for helper-text pills, table headers, the file-upload tile at rest, the inner panel that holds raw document content. The "off-white margin."
- **Newsprint** (`#ffffff`, `oklch(100% 0 0)`): The page itself. Default surface; primary button foreground; default card background.

### Special

- **Focus Blue** (`#0968f6`, `oklch(54% 0.22 260)`): Not part of the visual language at all — used only inside the focus ring (`0 0 0 1px newsprint, 0 0 0 3px focus-blue/0.5`). Never apply Focus Blue to text, fills, or borders. It is the keyboard-only signal.

### Named Rules

**The Ink Rule.** The only neutrals are pure `#000000` and pure `#ffffff` and the graphite ramp between them. Do not tint either endpoint toward another hue. The ink-on-newsprint extremity is the brand; tinted neutrals soften it into a generic SaaS surface.

**The Triage-Only Rule.** Filing Red, Wire Yellow, and Cleared Green appear *only* in the context of a triage signal — the chip, its tinted background, the destructive-button variant of Filing Red, and tone-matched helper text. They are forbidden as decorative accents, "primary brand color" treatments, illustration fills, or iconography hues. If a designer wants color for a non-triage reason, the answer is "no color."

**The Pair Rule.** A chromatic foreground is only legal on its own tinted background. Filing Red text appears on Triage Red Tint, Wire Yellow Deep text appears on Triage Yellow Tint, Cleared Green Deep text appears on Triage Green Tint. Never put a triage color on Newsprint or on Press Ink without the matching tint behind it; the contrast budget assumes the pair.

## 3. Typography

**Display Font:** Newsreader (variable, axes `opsz` 9–144, `wght` 200–800), with `ui-serif`, `Georgia`, `'Times New Roman'`, `serif` as fallbacks.
**Body Font:** Geist (variable, `wght` 100–900), with `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'` as fallbacks.
**Label/Mono Font:** Departure Mono (the design intent), with `'JetBrains Mono'` as the substitute currently shipped, then `ui-monospace`, `'SF Mono'`, `Menlo`, `Monaco`, `Consolas`.

**Character:** A three-face stack with strict role separation — Newsreader for set type (titles), Geist for utility prose (descriptions, body), Departure Mono for the machine register (labels, buttons, chips, table headers). The pairing reads like a working newsroom typesetting brief: serif headlines, sans body, monospace metadata. No face crosses into another's job.

### Hierarchy

- **Display** (Newsreader, weight 400, `clamp(2.5rem, 7vw, 4rem)`, line-height 1.05, tracking -0.02em): Top of every page — "Upload", "Dashboard", "Category". Set in a single weight; emphasis comes from optical size, not from going bolder.
- **Headline** (Newsreader, weight 400, 1.875rem ≈ 30px, line-height 1.1, tracking -0.02em): Inline page subjects — the category title on `/category/[id]`. Sits next to a triage chip rather than above it.
- **Title** (Newsreader, weight 400, 1.125rem ≈ 18px, line-height 1.25, tracking -0.02em): Section heads ("Category heuristics", "Documents (n)") and document filenames. The smallest serif step; below this, type goes sans.
- **Body** (Geist, weight 400, 14px, line-height 18px, tracking 0): Default running text. Cap line length at 65–75ch on prose surfaces. Heuristic descriptions also use 14/20 for slightly more reading rhythm.
- **Label** (Departure Mono, weight 500, 11px, tracking 0.05em, UPPERCASE): The machine register. Used on table column headers ("TRIAGE", "TITLE"), buttons (12-13px at this weight 600), triage chips ("HIGH", "MEDIUM", "LOW") at 10-11px, and link text. Always uppercase. Always tracked +0.05em (or `wider` 0.12em on link labels for extra breathing room).

### Named Rules

**The Three-Face Rule.** Newsreader for titles, Geist for body, Departure Mono for labels. No exceptions, no swaps, no decorative use of one face inside another's lane. If a piece of text doesn't clearly belong to one of the three jobs, the text is wrong, not the type.

**The One-Weight Rule (for Newsreader).** All Newsreader-set headings ship at weight 400 only. Hierarchy is built from optical size and tracking, not from bolder or lighter cuts. Newsreader's variable axes (`opsz`, `wght`) exist as fallback flexibility, not as a license to mix weights inside the same view.

**The Uppercase Mono Rule.** Departure Mono is *always* uppercase and *always* tracked. Lowercase mono reads as code; uppercase tracked mono reads as a teleprinter slug, which is the register the system needs.

## 4. Elevation

The system is **flat by doctrine.** Surfaces are differentiated by background tint and by 1px borders, never by ambient drop shadows. There are no "elevated cards", no "raised panels", no `box-shadow: 0 4px 20px rgba(0,0,0,0.1)` SaaS halos. The page reads like printed material on a matte surface.

Two exceptions exist, both functional:

### Shadow Vocabulary

- **focusRing** (`box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px rgba(9, 104, 246, 0.5)`): Keyboard focus signal on every interactive element — buttons, inputs, menu items. The white halo separates the blue glow from any adjacent dark fill so the ring stays visible against any background. Never suppressed.
- **menu** (`box-shadow: 0 8px 16px -8px rgba(0,0,0,0.04), 0 6px 6px -3px rgba(0,0,0,0.04), 0 3px 3px -1.5px rgba(0,0,0,0.04), 0 1px 1px -0.5px rgba(0,0,0,0.04)`): Floating UI only — popover menus, select dropdowns. A four-layer composite at 4% opacity that reads as "this surface is detached from the page" without any visible glow. Tuned to be just-perceptible; do not raise the opacity to make it "feel" more lifted.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows are reserved for two roles: the focus ring (keyboard signal) and the menu/popover composite (detached float). No card, no panel, no button, no input gets an ambient shadow under any condition, including hover.

**The Border-Carries-Depth Rule.** When two surfaces sit on each other (a card on the page, an inner content panel inside a card), depth is conveyed by a 1px `column-rule` border and a switch between `newsprint` and `newsprint-tint`. This is the entire toolkit. Nesting beyond two levels of surface is not legal: if you want a third level, redesign.

## 5. Components

Each component leads with the character it carries, then specifies shape and behavior. The set is intentionally small — the system does not need a card library or a 40-component menagerie.

### Buttons

The button is a metal nameplate, not a chiclet. Departure Mono labels in uppercase, near-square corners, no ambient shadow, transitions only on `background-color`, `color`, `border-color`, `box-shadow` (never on layout). Primary is wire-black with newsprint type; secondary is outline; ghost and plain are for in-line use.

- **Shape:** `2px` radius (`rounded.sm`). Heights: `lg` 40px, `md` 32px (default), `sm` 24px. Padding is 16px horizontal on lg/md, 8px on sm. Min-width matches height to keep a filed-icon-only button square.
- **Primary** (solid): `wire-black` background, `newsprint` foreground, `mid-graphite` on hover, `desk-graphite` on active. The default action.
- **Outline:** `newsprint` background, `press-ink` foreground, 1px `column-rule` border. Hover lifts the background to `newsprint-tint`. The default secondary.
- **Ghost / Plain:** Transparent background. Ghost uses background `newsprint-tint` on hover; plain uses only a foreground color shift (`fg` → `fg.muted`). For toolbar / inline use where a visible button would be too loud.
- **Destructive:** `filing-red` background, `newsprint` foreground, `red.700` (`#570303`-adjacent) on hover. Its disabled state is `triage-red-tint` background with `red.300` text.
- **Hover / Focus:** Hover transitions are `fast` (Chakra's `fast` token, ~150ms) on all four properties listed above. Focus uses the `focusRing` shadow exclusively; never a CSS `outline`.
- **Disabled:** `bg.subtle` (newsprint-tint), `fg.disabled` (a working-grey-adjacent muted), `border.muted` border, `cursor: not-allowed`. The control reads as inert without going invisible.

### Triage Chips

The signature component. A short uppercase label set in Departure Mono, sitting on its own tinted background, that reads "this thing is HIGH/MEDIUM/LOW" before the user has read the surrounding text.

- **Style:** Filled inline pill — tint background, deep-color text, `2px` radius, `4px 8px` padding, 10px Departure Mono at weight 600 with 0.05em tracking, uppercase.
- **State:** Three variants — high (filing-red on triage-red-tint), medium (wire-yellow-deep on triage-yellow-tint), low (cleared-green-deep on triage-green-tint). They never carry hover or active states; the chip is informational, not interactive.
- **Pairing:** Always rendered alongside the literal word ("HIGH" / "MEDIUM" / "LOW"). Never reduced to a colored dot. See the Pair Rule.

### Cards / Containers

Cards are restrained — flat surfaces with a 1px hairline border and `2px` radius. Two variants in service.

- **Document Card** (`card-document`): `newsprint` background, full 1px `column-rule` border, `2px` radius, 20px internal padding. Holds a document's filename (Title), a stack of heuristics, and an inner content panel.
- **Inner Content Panel:** Inside the document card, the raw `.txt` / `.md` content sits in a `newsprint-tint` background with a 1px `border.muted` (`newsprint-tint` itself, used as a barely-there border) and `2px` radius. Body content here uses Departure Mono at 12/18 to preserve the source's whitespace and to read as raw material rather than presentation.
- **Heuristic Card:** Same shape, smaller — 1px `border.muted` (the lighter border), `2px` radius, 16px internal padding. Holds a mono-label heuristic name, the matching triage chip, and a Geist body description.
- **Shadow Strategy:** None. See the Flat-By-Default Rule.
- **Border:** Always `column-rule` for the document card's outer edge, `border.muted` for the inner heuristic card. A two-step border palette is enough to convey nesting depth without a third color.
- **Internal Padding:** 20px (document) / 16px (heuristic) / 16px (inner content panel). Slightly varied to give a sense of nesting rhythm.

### Inputs / Fields

Quiet, sizable form controls. 40px tall, body type at 14/18, 1px `column-rule` border, `2px` radius, sitting on `newsprint`. Hover lifts the border to `working-grey`. Focus replaces the border at `working-grey` and stacks the `focusRing` shadow on top — both, not one.

- **Style:** 40px height, 12px horizontal padding, `2px` radius. Geist 14/18 body type. Placeholder uses `desk-graphite` (`fg.muted`).
- **Focus:** `working-grey` border + `focusRing` shadow. Never a CSS `outline`.
- **Error / Disabled:** Disabled drops the field to `newsprint-tint` background with disabled foreground; placeholder also dims. Errors are not shown inside the field — they appear as a `helper-text` below it (see Helper Text), so the input itself stays visually consistent.

### Helper Text

Inline status pills that hold short prose — error messages, processing states, empty-state nudges. The shape they take is small and contained; they are not banners and they do not span the full width by default.

- **Style:** Inline-flex, `2px` radius, 8px / 12px padding, Geist 13/16, four `tone` variants:
  - `neutral` — `newsprint-tint` background, `desk-graphite` text, `•` icon. Default loading and "in progress" register.
  - `success` — `triage-green-tint` background, `cleared-green-deep` text, `✓` icon. For "filed" / "cleared" / "complete" affordances.
  - `error` — `triage-red-tint` background, `filing-red-deep` text, `✕` icon. Includes `role="alert"` for screen readers. The default for any failure narrative.
  - `warning` — `triage-yellow-tint` background, `wire-yellow-deep` text, `!` icon. For non-fatal flags ("missing case id", "no case selected").
- **Voice:** Sentence-case, no exclamation, declarative. Errors describe what happened, never apologize.

### File Upload Tile

The signature consumer-facing surface — the only place in the system that uses an `8px` radius. Reads as a *flat insertable surface*, not a "drop zone box" with a dashed border by default.

- **Style:** `newsprint-tint` background at rest, no border (transparent 1px), `8px` radius, 224px minimum height, 24px / 32px internal padding. Centered stack: 24px outline upload icon, Geist 14/18 prompt text, an outline secondary button ("Or select file"), then a two-line metadata block in `desk-graphite` 13/16 ("Up to 10 files", "Plain text or Markdown").
- **States:**
  - `idle` — flat newsprint-tint, no visible border.
  - `dragging` — background lifts to `column-rule` (`bg.muted`), border switches to dashed 1px `working-grey`. The dashed border *only appears in this state*; it is not the default chrome.
  - `disabled` — idle styling at 40% opacity, `cursor: not-allowed`.
- **Behavior:** Click anywhere on the tile to open the file picker. The interior secondary button stops propagation so it doesn't double-fire. Drag-over events `preventDefault` to enable drop. Transitions on `background-color, border-color` only, ~120ms.

### Tables

The dashboard's primary affordance. Wire-service column headers (uppercase mono) set against newsprint, `column-rule` separators, no zebra striping, no row shadows. Designed to be skim-readable top-down.

- **Column Header Cell:** Departure Mono 11px, weight 500, `0.05em` tracking, uppercase, `desk-graphite` color, 1px bottom border in `column-rule`. No background tint; the header is on the page itself.
- **Body Cell:** Geist 14px, `press-ink` color, 1px bottom border in `border.muted` (the lighter border). No internal background. The triage chip in the leftmost cell carries the visual weight.
- **Sort:** Client-side by triage rank (high → medium → low). The order itself is the sort cue; no headers carry a sort arrow because there is only one valid sort.
- **Row Click:** The Title cell is a `ChakraLink` over a `NextLink`, mono uppercase, `wide` tracking, underline-offset `0.25em` so the rule sits below the cap-height. Hover dims to `desk-graphite`.

### Menus / Popovers

Floating UI for select dropdowns and contextual menus. The only surfaces in the system that carry a (very subtle) ambient shadow.

- **Content:** `newsprint` background, 1px `column-rule` border, `2px` radius, `menu` shadow (the four-layer 4%-opacity composite), 4px vertical inner padding, 160px minimum width.
- **Item:** Geist 14/18, `press-ink` text, 12px / 8px padding, no radius (sharp inside the rounded outer container). Hover, focus, and highlighted states all share `newsprint-tint` background. Selected adds weight 500.
- **Item Group Label:** Departure Mono 10px, uppercase, `wide` tracking, `desk-graphite`. The same teleprinter-slug treatment used in tables.
- **Separator:** 1px `border.muted` (the light variant). Used sparingly.

## 6. Do's and Don'ts

### Do:

- **Do** lead every screen with a triage signal at the top of the eye path. Sort fastest-first; the user should know within one second where the HIGH category is.
- **Do** use the literal label ("HIGH" / "MEDIUM" / "LOW") next to every triage chip, on every surface. Color is never the sole carrier; the Pair Rule and the small-text contrast budget both depend on it.
- **Do** keep Newsreader at weight 400 across all heading sizes. Build hierarchy from optical size and tracking, not from going bolder.
- **Do** use the `focusRing` token on every interactive element. It is the keyboard signal; never replace it with a CSS `outline` and never suppress it for visual taste.
- **Do** use Departure Mono uppercase for any string that would be a "label", "slug", or "metadata" in print: column headers, button text, link text, chip text, group labels, status microcopy. The register is itself the brand.
- **Do** keep Geist body text within 65–75ch on prose surfaces. Heuristic descriptions and document content panels should not span 1200px columns.
- **Do** vary spacing between sections (Chakra `gap-3`, `gap-4`, `gap-6`) for visual rhythm. Identical padding everywhere reads as monotonous.
- **Do** respect `prefers-reduced-motion` on every transition, polling indicator, and progressive reveal.
- **Do** treat the page itself as the canvas — page background `newsprint`, content lives directly on it. Most things do not need a wrapping card.

### Don't:

- **Don't** add ambient drop shadows to cards, buttons, inputs, or panels. The Flat-By-Default Rule is doctrine. Shadows exist on `focusRing` and `menu` only.
- **Don't** tint the `wire-black` or `newsprint` neutrals toward another hue. The Ink Rule keeps the system at its press-ready extremity; tinted neutrals are how this system becomes a generic SaaS surface.
- **Don't** use Filing Red, Wire Yellow, or Cleared Green for any non-triage purpose — no "primary brand red", no decorative green tag, no yellow caution banner that is not actually a triage signal. The Triage-Only Rule is the entire color budget.
- **Don't** apply any triage color to text on plain `newsprint` or `press-ink` surfaces. The Pair Rule mandates the matching tinted background; the small-text contrast budget assumes it.
- **Don't** use the **stock SaaS dashboard** template called out in PRODUCT.md — no hero metric grid, no big-number-with-gradient, no identical icon-and-text card rows. If a screen could pass for a Stripe-clone landing or a Vercel template, it has failed.
- **Don't** use the **consumer-warm app** vocabulary called out in PRODUCT.md — no pastel illustrations, no mascot, no chubby rounded UI, no emoji-decorated empty states, no "Looks like there's nothing here yet 👀" copy.
- **Don't** use the **enterprise / gov-tech** vocabulary called out in PRODUCT.md — no IBM Carbon density, no navy-and-gold, no breadcrumb soup, no eight-column dense forms with collapse-all toggles.
- **Don't** use the **AI-tool aesthetic** called out in PRODUCT.md — no gradient text, no glassmorphism, no neon-on-black, no sparkle / star iconography, no "powered by" framing, no shimmer effects on streamed text.
- **Don't** mix Newsreader weights inside the same view. The One-Weight Rule says weight 400 across every Newsreader-set heading.
- **Don't** set Departure Mono in lowercase. Lowercase mono reads as code; the system needs the uppercase teleprinter register.
- **Don't** nest a card inside a card inside a card. Two levels of surface (card + inner content panel) is the maximum; a third level signals the architecture is wrong, not the styling.
- **Don't** use side-stripe borders (`border-left` greater than 1px as a colored stripe on cards, list items, callouts, or alerts). Convey severity with the chip and the tinted card background, never with a left rail.
- **Don't** animate CSS layout properties (`width`, `height`, `padding`, `margin`, `top`, `left`). Use `background-color`, `color`, `border-color`, `transform`, `opacity`, `box-shadow`. Transitions are `fast` (~150ms) on the four color properties; nothing should bounce or elastic.
- **Don't** use the em dash in copy. Use commas, colons, semicolons, periods, or parentheses. The voice is editorial, not affected.
- **Don't** decorate the model. No "Thinking…" with a shimmer, no "✨ AI insights", no "Here's what I found for you!". The model is plumbing; the user's judgment is the product.
