# DevCore Learning UX — Design

**Date:** 2026-07-01
**Status:** Approved design, ready for implementation planning
**Repo:** `~/DEV/java-core` (DevCore)
**Depends on:** the merged Content Engine (in-repo vault → generated `src/data/content`).

---

## 1. Overview

The Content Engine made the `content/` vault the source of truth and proved the 106 topics render identically. This phase — **Learning UX** — makes each topic *effortless to consume* by delivering the four pedagogy principles the owner chose: **layered depth, consistent template, visual-first, active recall.**

It does three things:
1. **Extends the content model** with new *optional* layered/recall fields (backward-compatible — the 106 existing topics keep working via graceful degradation).
2. **Rebuilds the topic page** from a 4-tab shell into a **single scroll with a `Quick · Standard · Deep` depth control**, in a **calm, typography-led** visual style (minimal cards, one accent colour).
3. **Fully authors 5 flagship exemplar topics** to prove the experience; bulk authoring of the other 101 is deferred to the Vault Ingest phase.

## 2. Goals & non-goals

**Goals**
- Every topic renders in the consistent template with a working Quick/Standard/Deep control, even when only legacy fields exist.
- Exemplars demonstrate the full experience: TL;DR, analogy, checkpoints, key-term tooltips, a diagram, and the mini-quiz.
- Calm visual language: content structured by typography + whitespace; boxed callouts reserved for code and the single gotcha; one accent colour (green), amber only for the gotcha.
- No regression: existing content is never lost or altered.

**Non-goals (this phase)**
- Authoring the new fields for all 106 topics (only 5 exemplars now; bulk = Vault Ingest phase).
- Accounts / server-side persistence / Telegram (later phases). Depth choice persists in `localStorage` for now.
- Rebrand/landing/OG/CI (Portfolio Foundation phase).

## 3. Visual principle (the approved direction)

Typography-led, not card-led. Concretely:
- **Boxed** elements: the code block and the **single** `Gotcha` callout. Nothing else gets a border+fill.
- **TL;DR**: a larger lead line with a thin green left-rule — not a filled card.
- **Analogy**: soft italic, prefaced "Think of it like…".
- **Recap**: a small labelled line, not a green box.
- **Checkpoint** and **completion nudge**: light dividers/links, not dashed boxes.
- **One accent** (`accent-green`) for structure/interactive affordances; **amber** exclusively for the gotcha. Blue/other accents removed.
- Hierarchy comes from font size, weight, colour temperature, and spacing. This scales to long real `deepDive` prose (unlike stacked cards) and reads as premium (good for LinkedIn media).

## 4. Content model extension

New **optional** fields. Existing fields (`summary`, `deepDive`, `code`, `tip`, `interviewQs`, `springConnection`, `diagram`, `title`) are unchanged. Bilingual prose keeps the project's `\n---\n` convention (rendered via `localized()`); structured lists are arrays.

**New note sections (reserved headings, all optional):**
`## TL;DR`, `## Analogy`, `## What & Why`, `## How It Works`, `## Gotcha`, `## Recap`, `## Checkpoint`, `## Key Terms`.

**`TopicContent` additions (`src/lib/types.ts`):**
```ts
interface KeyTerm { term: string; definition: string; }        // definition is bilingual (\n---\n)
interface Checkpoint { id: string; prompt: string; answer: string; }  // prompt/answer bilingual

interface TopicContent {
  // ...existing fields unchanged...
  tldr?: string;         // bilingual
  analogy?: string;      // bilingual
  whatWhy?: string;      // bilingual
  howItWorks?: string;   // bilingual
  gotcha?: string;       // bilingual
  recap?: string;        // bilingual
  checkpoints?: Checkpoint[];
  keyTerms?: KeyTerm[];
  // diagram extended — see §7
}
```

**Engine threading** (build-time, extends the existing pipeline):
- `scripts/lib/note.ts` — add the new reserved section names to `RESERVED`; parse `## Checkpoint` (a `### <prompt>` + answer body list) and `## Key Terms` (a `- term :: definition` list) into structured arrays; serialize them back (round-trip).
- `scripts/lib/norm.ts` — `NormTopic` gains the optional fields (prose as `Loc`, checkpoints/keyTerms as arrays of `Loc`-bearing objects). `decompose`/`recompose` handle them **only when present** (absent → not emitted), so the existing baseline stays valid for legacy topics.
- `scripts/lib/emit.ts` — `recompose` includes new fields when present.
- `scripts/lib/validate.ts` — parity check applies to any **present** new field (author a TL;DR → both RU & EN required); absence is always allowed (these are enhancements), even for `published`.

## 5. Graceful degradation — `resolveTopic()`

A pure helper `src/lib/resolve-topic.ts` maps a `TopicContent` to a `ResolvedTopic` — the layered view the UI renders — filling gaps from legacy fields:

| Layer field | Source (fallback) |
|---|---|
| `tldr` | `tldr` ?? `summary` |
| `analogy` | `analogy` (else omitted) |
| `whatWhy` | `whatWhy` (else omitted) |
| `howItWorks` | `howItWorks` ?? `deepDive` |
| `gotcha` | `gotcha` ?? `tip` |
| `recap` | `recap` (else omitted) |
| `checkpoints` / `keyTerms` | as authored (else empty) |
| `interviewQs` / `spring` / `diagram` | unchanged |

So a legacy topic yields: Quick = summary(as TL;DR) + diagram + (no recap); Standard = + deepDive(as How It Works) + code + tip(as gotcha); Deep = + interview + spring. Fully coherent with zero authoring. `resolveTopic` is pure and unit-tested.

## 6. Topic page (single scroll + depth control)

`src/app/topic/[id]/TopicClient.tsx` + `src/components/TopicContent.tsx` are rebuilt into a layered `LessonView`. The 4-tab shell is removed; Code/Interview/Spring content moves into the layers.

**Depth control** — a `Quick · Standard · Deep` segmented control (default **Standard**). Choice persisted via a `useDepth` hook (`localStorage` key `devcore:depth`; server-synced in the Accounts phase). Keyboard: `1/2/3` set depth (replacing the old tab shortcuts).

**Layer → content mapping (render order fixed = the consistent template):**
- **Quick**: TL;DR → analogy → diagram → recap
- **Standard**: Quick **+** What&Why → How It Works → code → gotcha → inline checkpoints
- **Deep**: Standard **+** interview Qs (existing reveal/rate SM-2 flow) → Spring connection → key-terms glossary → prerequisites
- **Always at end**: the mini-quiz + completion nudge

Preserved: `ReadingProgress`, `TableOfContents`, reading-time, RU/EN toggle, `AskDeeper`, `CodePlayground`, `Sidebar`, prev/next nav, `StudySessionOverlay`.

## 7. Diagrams (Mermaid + React hybrid)

`DiagramRef` discriminated union behind the existing `<Diagram>` wrapper:
```ts
type DiagramRef = { kind: "react"; key: string } | { kind: "mermaid"; src: string };
```
- Legacy `diagram: "jvm-architecture"` (plain string) is interpreted as `{kind:"react", key}` — the 7 existing hand-built diagrams keep working.
- Note frontmatter `diagram: mermaid` + a `## Diagram` fenced ```mermaid block → `{kind:"mermaid", src}`.
- New `MermaidDiagram` component renders client-side via **dynamic `import("mermaid")`** (keeps it out of the main bundle; shows a lightweight placeholder while loading; SSR renders nothing for the mermaid branch).
- Each exemplar has a diagram: **1-1, 6-2, 7-4, 8-1 already have React diagrams** (`jvm-architecture`, `hashmap-internals`, `stream-pipeline`, `thread-lifecycle`) and reuse them; **3-7 (SOLID)** gets a **new Mermaid** diagram (the first Mermaid diagram, proving that path).

## 8. Active recall (all four)

- **Mini-quiz** — `MiniQuiz` component samples up to 3 of the topic's `interviewQs`, wrapping the existing QuizMode reveal/rate flow and calling `updateSRState` so it feeds spaced repetition. Works for all 106 topics (data exists). Fewer than 3 Qs → use what exists.
- **Inline checkpoints** — `Checkpoint` component renders each authored checkpoint as a light "🧠 Before you scroll…" divider with a reveal for the answer. Placed after How It Works. Shown only where authored.
- **Key-term tooltips** — `KeyTerm`: a Markdown post-process underlines the **first** occurrence of each authored `keyTerm` in the prose and shows a bilingual definition popover on hover/tap. The Deep layer also renders a `Glossary` list of all terms.
- **Completion nudge** — when the reader scrolls to the recap (reuse the `ReadingProgress` IntersectionObserver), a quiet "You've read it — test yourself?" link scrolls to the mini-quiz. Marking-complete uses the existing `toggleComplete`.

## 9. File structure (units, each one responsibility)

**Engine (extend existing):** `scripts/lib/note.ts`, `norm.ts`, `emit.ts`, `validate.ts`; `src/lib/types.ts`.

**App — new:**
- `src/lib/resolve-topic.ts` — degradation + `ResolvedTopic` type (pure)
- `src/lib/use-depth.ts` — depth state + `localStorage` persistence
- `src/components/lesson/DepthControl.tsx`, `TldrLead.tsx`, `Analogy.tsx`, `Gotcha.tsx`, `Recap.tsx`, `Checkpoint.tsx`, `KeyTerm.tsx`, `Glossary.tsx`, `MiniQuiz.tsx`, `CompletionNudge.tsx`, `MermaidDiagram.tsx`
- `src/components/LessonView.tsx` — orchestrates the layers (replaces the tab shell in `TopicContent.tsx`)

**App — modified:** `TopicClient.tsx` (depth state, `1/2/3` shortcuts, render `LessonView`), `Diagram.tsx` (`DiagramRef` union), `Markdown.tsx` (key-term underlining hook). `InterviewTab`/`CodePlayground`/`SpringTab` content is reused inside layers (not standalone tabs).

**Content:** author 5 exemplar notes (+ `ru/` mirrors): `1-1`, `6-2`, `8-1`, `7-4`, `3-7` with the new sections; mark them `status: published` so parity is enforced on their new fields.

## 10. Data flow

```
content/ note (+new sections, ru/ mirror)
   │ compile-content (extended note parser + validators)
   ▼
src/data/content/<id>.ts  (TopicContent + optional new fields, generated)
   │ getTopicContent
   ▼
TopicClient → resolveTopic() → ResolvedTopic → LessonView
   │                                              ├─ DepthControl (Quick/Standard/Deep, localStorage)
   │                                              ├─ layers (TL;DR/analogy/diagram/whatWhy/howItWorks/code/gotcha/checkpoints/recap)
   │                                              ├─ Deep: InterviewQs (SM-2) · Spring · Glossary
   │                                              └─ MiniQuiz (→ updateSRState) + CompletionNudge
```

## 11. Testing

- **No-regression (adapted):** the 106-topic round-trip is narrowed to compare the **original fields only** (`title, summary, deepDive, code, tip, interviewQs, spring, diagram`) against the baseline — proving existing content is never lost/altered while new fields are additive.
- **Unit:** `resolveTopic` fallback matrix; new note sections (checkpoints/keyTerms/prose) serialize↔parse round-trip; depth→layer mapping; mini-quiz sampling (≤3, fewer-than-3).
- **Exemplar parity:** the 5 `published` exemplars pass the parity validator on all authored new fields (RU+EN).
- **Build/smoke:** `next build` succeeds; a sampled exemplar renders all three depths; a legacy topic renders all three depths via degradation.
- CI (Vitest + typecheck) stays green; fresh-clone compile hooks already in place.

## 12. Risks & mitigations

- **Baseline vs additive content** → the narrowed round-trip (§11) is the guard; exemplars won't false-fail.
- **Mermaid bundle weight / SSR** → dynamic client-only import + placeholder; no SSR of mermaid.
- **Large `TopicClient`/`TopicContent` rework** → decompose into small `lesson/` components with clear props; land incrementally behind `resolveTopic`.
- **Key-term underlining touching Markdown rendering** → limit to first occurrence, operate on rendered text nodes only, never inside code blocks; unit-test the matcher.
- **Next 16 non-standard** (see AGENTS.md) → consult `node_modules/next/dist/docs/` before routing/layout changes.

## 13. Success criteria

- Every topic renders single-scroll with a working Quick/Standard/Deep control; legacy topics fill all layers via degradation.
- The 5 exemplars show TL;DR, analogy, a diagram, inline checkpoints, key-term tooltips, and the mini-quiz — in the calm typography-led style (code + gotcha are the only boxes).
- Mini-quiz feeds SM-2; completion nudge works.
- No-regression round-trip passes on original fields; exemplar parity passes; `next build` + CI green.
