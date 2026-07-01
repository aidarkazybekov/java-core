# DevCore Learning UX — Plan A: Content Model & Resolver

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the content model + engine with the optional layered/active-recall fields and a graceful-degradation resolver, so the app *can* consume a richer topic shape — without changing any UI or losing/altering existing content.

**Architecture:** Additive, backward-compatible. New fields are optional on `TopicContent` and `NormTopic`; the note parser gains new reserved sections; validation applies parity only to fields that are present; a pure `resolveTopic()` maps a `TopicContent` to a `ResolvedTopic` with legacy fallbacks. The 106-topic round-trip is narrowed to the original fields so later additive authoring can't false-fail it.

**Tech Stack:** TypeScript, Vitest, gray-matter, tsx (all already in place). No new dependencies. No app component changes in this plan.

## Global Constraints

- **Additive & backward-compatible:** every new field is optional; the 106 existing topics and all current components must keep compiling and rendering unchanged.
- **Build-time scripts use RELATIVE imports** (never `@/`).
- **Bilingual convention:** prose fields are single strings joined by `\n\n---\n\n` (RU first), rendered via `localized()`. Structured lists (`checkpoints`, `keyTerms`) are arrays whose text values follow the same bilingual convention where noted.
- **Reserved section names** (case-insensitive) for the note parser now include: `title, summary, deep dive, code, tip, spring, interview, tl;dr, analogy, what & why, how it works, gotcha, recap, checkpoint, key terms`.
- **Parity rule unchanged:** a present bilingual field must have non-empty RU *and* EN; error when `status: published`, warning when `draft`. Absence of an optional field is always allowed.
- **No regression:** existing content is never lost or altered — proven by the (narrowed) 106-topic round-trip.

---

### Task 1: Extend `TopicContent` type with optional fields

**Files:**
- Modify: `src/lib/types.ts`
- Test: `src/lib/types.test.ts`

**Interfaces:**
- Produces: `Checkpoint { id: string; prompt: string; answer: string }`, `KeyTerm { term: string; definition: string }`, and optional `TopicContent` fields `tldr?, analogy?, whatWhy?, howItWorks?, gotcha?, recap?: string`, `checkpoints?: Checkpoint[]`, `keyTerms?: KeyTerm[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/types.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import type { TopicContent } from "./types";

describe("TopicContent optional layered fields", () => {
  it("accepts a topic with the new fields", () => {
    const t: TopicContent = {
      id: "x", blockId: 1, title: "T", summary: "s", deepDive: "d", code: "c",
      interviewQs: [], tip: "t", springConnection: null,
      tldr: "tl", analogy: "an", whatWhy: "ww", howItWorks: "hiw", gotcha: "g", recap: "r",
      checkpoints: [{ id: "cp1", prompt: "p", answer: "a" }],
      keyTerms: [{ term: "term", definition: "def" }],
    };
    expect(t.checkpoints?.[0].id).toBe("cp1");
    expect(t.keyTerms?.[0].term).toBe("term");
  });

  it("accepts a legacy topic without the new fields", () => {
    const t: TopicContent = {
      id: "y", blockId: 1, title: "T", summary: "s", deepDive: "d", code: "c",
      interviewQs: [], tip: "t", springConnection: null,
    };
    expect(t.tldr).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/lib/types.test.ts`
Expected: FAIL — TS error, `tldr`/`checkpoints`/`keyTerms` not on `TopicContent`.

- [ ] **Step 3: Extend types.ts**

In `src/lib/types.ts`, add the two interfaces (near `InterviewQuestion`) and the optional fields inside `TopicContent`:
```ts
export interface Checkpoint {
  id: string;
  prompt: string;   // bilingual (\n---\n)
  answer: string;   // bilingual
}

export interface KeyTerm {
  term: string;         // single language-neutral label
  definition: string;   // bilingual
}
```
And inside `interface TopicContent { ... }`, after `diagram?: string;`, add:
```ts
  tldr?: string;        // bilingual
  analogy?: string;     // bilingual
  whatWhy?: string;     // bilingual
  howItWorks?: string;  // bilingual
  gotcha?: string;      // bilingual
  recap?: string;       // bilingual
  checkpoints?: Checkpoint[];
  keyTerms?: KeyTerm[];
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npm test -- src/lib/types.test.ts && npm run typecheck`
Expected: PASS; typecheck clean (existing content files/components still compile — new fields are optional).

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/types.test.ts
git commit -m "feat: optional layered/recall fields on TopicContent"
```

---

### Task 2: Extend `NormTopic` + decompose/recompose

**Files:**
- Modify: `scripts/lib/norm.ts`
- Test: `scripts/lib/norm.test.ts`

**Interfaces:**
- Consumes: `Checkpoint`, `KeyTerm` from `../../src/lib/types` (Task 1).
- Produces: `NormCheckpoint { id: string; prompt: Loc; answer: Loc }`, `NormKeyTerm { term: string; definition: Loc }`, and optional `NormTopic` fields `tldr?, analogy?, whatWhy?, howItWorks?, gotcha?, recap?: Loc`, `checkpoints?: NormCheckpoint[]`, `keyTerms?: NormKeyTerm[]`. `decompose`/`recompose` handle them **only when present**.

- [ ] **Step 1: Write the failing test**

Append to `scripts/lib/norm.test.ts`:
```ts
import { decompose as dec2, recompose as rec2 } from "./norm";
import type { TopicContent as TC2 } from "../../src/lib/types";

describe("decompose/recompose new optional fields", () => {
  const rich: TC2 = {
    id: "z", blockId: 1, title: "T", summary: "s", deepDive: "d", code: "c",
    interviewQs: [], tip: "t", springConnection: null,
    tldr: "кратко\n\n---\n\nshort",
    checkpoints: [{ id: "cp1", prompt: "п\n\n---\n\np", answer: "о\n\n---\n\na" }],
    keyTerms: [{ term: "treeify", definition: "де\n\n---\n\ndef" }],
  };

  it("decomposes present optional fields to Loc", () => {
    const n = dec2(rich);
    expect(n.tldr).toEqual({ ru: "кратко", en: "short" });
    expect(n.checkpoints?.[0]).toEqual({ id: "cp1", prompt: { ru: "п", en: "p" }, answer: { ru: "о", en: "a" } });
    expect(n.keyTerms?.[0]).toEqual({ term: "treeify", definition: { ru: "де", en: "def" } });
  });

  it("omits absent optional fields (legacy stays clean)", () => {
    const legacy: TC2 = { id: "l", blockId: 1, title: "T", summary: "s", deepDive: "d", code: "c", interviewQs: [], tip: "t", springConnection: null };
    const n = dec2(legacy);
    expect("tldr" in n).toBe(false);
    expect("checkpoints" in n).toBe(false);
  });

  it("round-trips present optional fields", () => {
    expect(dec2(rec2(dec2(rich)))).toEqual(dec2(rich));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- scripts/lib/norm.test.ts`
Expected: FAIL — `n.tldr`/`checkpoints`/`keyTerms` are undefined (not yet handled).

- [ ] **Step 3: Extend norm.ts**

In `scripts/lib/norm.ts`: add the two interfaces after `NormSpring`, add the optional fields to `NormTopic`, and make `decompose`/`recompose` build the object then conditionally attach the new fields.

Add interfaces + `NormTopic` fields:
```ts
export interface NormCheckpoint { id: string; prompt: Loc; answer: Loc }
export interface NormKeyTerm { term: string; definition: Loc }
```
Inside `interface NormTopic { ... }` (after `spring`):
```ts
  tldr?: Loc; analogy?: Loc; whatWhy?: Loc; howItWorks?: Loc; gotcha?: Loc; recap?: Loc;
  checkpoints?: NormCheckpoint[];
  keyTerms?: NormKeyTerm[];
```

Change `decompose` to assign to a `const n` then conditionally add before returning:
```ts
export function decompose(t: TopicContent): NormTopic {
  const n: NormTopic = {
    id: t.id,
    blockId: t.blockId,
    diagram: t.diagram,
    title: L(t.title),
    summary: L(t.summary),
    deepDive: L(t.deepDive),
    tip: L(t.tip),
    code: t.code,
    interviewQs: t.interviewQs.map((q) => ({ id: q.id, difficulty: q.difficulty, q: L(q.q), a: L(q.a) })),
    spring: t.springConnection
      ? { concept: L(t.springConnection.concept), springFeature: L(t.springConnection.springFeature), explanation: L(t.springConnection.explanation) }
      : null,
  };
  if (t.tldr !== undefined) n.tldr = L(t.tldr);
  if (t.analogy !== undefined) n.analogy = L(t.analogy);
  if (t.whatWhy !== undefined) n.whatWhy = L(t.whatWhy);
  if (t.howItWorks !== undefined) n.howItWorks = L(t.howItWorks);
  if (t.gotcha !== undefined) n.gotcha = L(t.gotcha);
  if (t.recap !== undefined) n.recap = L(t.recap);
  if (t.checkpoints) n.checkpoints = t.checkpoints.map((c) => ({ id: c.id, prompt: L(c.prompt), answer: L(c.answer) }));
  if (t.keyTerms) n.keyTerms = t.keyTerms.map((k) => ({ term: k.term, definition: L(k.definition) }));
  return n;
}
```
At the end of `recompose`, before `if (n.diagram !== undefined) topic.diagram = n.diagram;`, add:
```ts
  if (n.tldr) topic.tldr = J(n.tldr);
  if (n.analogy) topic.analogy = J(n.analogy);
  if (n.whatWhy) topic.whatWhy = J(n.whatWhy);
  if (n.howItWorks) topic.howItWorks = J(n.howItWorks);
  if (n.gotcha) topic.gotcha = J(n.gotcha);
  if (n.recap) topic.recap = J(n.recap);
  if (n.checkpoints) topic.checkpoints = n.checkpoints.map((c) => ({ id: c.id, prompt: J(c.prompt), answer: J(c.answer) }));
  if (n.keyTerms) topic.keyTerms = n.keyTerms.map((k) => ({ term: k.term, definition: J(k.definition) }));
```

- [ ] **Step 4: Run tests**

Run: `npm test -- scripts/lib/norm.test.ts`
Expected: PASS (all cases, including the legacy-stays-clean and round-trip cases).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/norm.ts scripts/lib/norm.test.ts
git commit -m "feat: NormTopic carries optional layered/recall fields"
```

---

### Task 3: Note serializer/parser — new sections

**Files:**
- Modify: `scripts/lib/note.ts`
- Test: `scripts/lib/note.test.ts`

**Interfaces:**
- Consumes: `NormTopic` (incl. new optional fields) from `./norm`.
- Produces: `serializeNote`/`parseNotePair` round-trip the new sections `## TL;DR`, `## Analogy`, `## What & Why`, `## How It Works`, `## Gotcha`, `## Recap`, `## Checkpoint` (`### [id] prompt` + answer body), `## Key Terms` (`- term :: definition`).

- [ ] **Step 1: Write the failing test**

Append to `scripts/lib/note.test.ts`:
```ts
import type { NormTopic as NT2 } from "./norm";

describe("note round-trip with new optional sections", () => {
  const n: NT2 = {
    id: "1-1", blockId: 1, diagram: "jvm-architecture",
    title: { ru: "JVM", en: "JVM" }, summary: { ru: "с", en: "s" },
    deepDive: { ru: "г", en: "d" }, tip: { ru: "т", en: "t" }, code: "class A {}",
    interviewQs: [{ id: "1-1-q1", difficulty: "mid", q: { ru: "в", en: "q" }, a: { ru: "о", en: "a" } }],
    spring: null,
    tldr: { ru: "кратко\n\nдве строки", en: "short\n\ntwo lines" },
    analogy: { ru: "аналогия", en: "analogy" },
    whatWhy: { ru: "чч", en: "ww" },
    howItWorks: { ru: "## Внутри\nтекст", en: "## Inside\ntext" },
    gotcha: { ru: "подвох", en: "gotcha" },
    recap: { ru: "итог", en: "recap" },
    checkpoints: [{ id: "cp1", prompt: { ru: "вопрос", en: "prompt" }, answer: { ru: "ответ", en: "answer" } }],
    keyTerms: [{ term: "treeify", definition: { ru: "дерево", en: "tree it" } }],
  };

  it("preserves all new sections", () => {
    const { en, ru } = serializeNote(n, "java-core", "draft");
    const back = parseNotePair(en, ru);
    expect(back.tldr).toEqual(n.tldr);
    expect(back.analogy).toEqual(n.analogy);
    expect(back.whatWhy).toEqual(n.whatWhy);
    expect(back.howItWorks).toEqual(n.howItWorks);  // has an inner ## heading
    expect(back.gotcha).toEqual(n.gotcha);
    expect(back.recap).toEqual(n.recap);
    expect(back.checkpoints).toEqual(n.checkpoints);
    expect(back.keyTerms).toEqual(n.keyTerms);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- scripts/lib/note.test.ts`
Expected: FAIL — new fields are undefined after parse.

- [ ] **Step 3: Extend note.ts**

(a) Extend `RESERVED`:
```ts
const RESERVED = new Set([
  "title", "summary", "deep dive", "code", "tip", "spring", "interview",
  "tl;dr", "analogy", "what & why", "how it works", "gotcha", "recap", "checkpoint", "key terms",
]);
```

(b) Add two parsers (near `parseSpring`):
```ts
function parseCheckpoints(enText: string | undefined, ruText: string | undefined) {
  if (enText === undefined && ruText === undefined) return undefined;
  const side = (text: string) => {
    const items: { id: string; prompt: string; answer: string }[] = [];
    let cur: { id: string; prompt: string; answer: string } | null = null;
    let buf: string[] = [];
    const flush = () => { if (cur) { cur.answer = buf.join("\n").trim(); items.push(cur); } buf = []; };
    for (const line of text.split("\n")) {
      const m = line.match(/^###\s+\[([^\]]+)\]\s*(.*)$/);
      if (m) { flush(); cur = { id: m[1].trim(), prompt: m[2].trim(), answer: "" }; }
      else if (cur) buf.push(line);
    }
    flush();
    return items;
  };
  const en = side(enText ?? "");
  const ru = side(ruText ?? "");
  return en.map((e, i) => ({
    id: e.id,
    prompt: { ru: ru[i]?.prompt ?? "", en: e.prompt },
    answer: { ru: ru[i]?.answer ?? "", en: e.answer },
  }));
}

function parseKeyTerms(enText: string | undefined, ruText: string | undefined) {
  if (enText === undefined && ruText === undefined) return undefined;
  const side = (text: string) => {
    const items: { term: string; definition: string }[] = [];
    for (const line of text.split("\n")) {
      const m = line.match(/^-\s*(.+?)\s*::\s*(.*)$/);
      if (m) items.push({ term: m[1].trim(), definition: m[2].trim() });
    }
    return items;
  };
  const en = side(enText ?? "");
  const ru = side(ruText ?? "");
  return en.map((e, i) => ({ term: e.term, definition: { ru: ru[i]?.definition ?? "", en: e.definition } }));
}
```

(c) In `serializeNote`'s `body(side)`, before the `## Interview` block, append the optional sections:
```ts
    if (n.tldr) parts.push(`## TL;DR\n${n.tldr[side]}`);
    if (n.analogy) parts.push(`## Analogy\n${n.analogy[side]}`);
    if (n.whatWhy) parts.push(`## What & Why\n${n.whatWhy[side]}`);
    if (n.howItWorks) parts.push(`## How It Works\n${n.howItWorks[side]}`);
    if (n.gotcha) parts.push(`## Gotcha\n${n.gotcha[side]}`);
    if (n.recap) parts.push(`## Recap\n${n.recap[side]}`);
    if (n.checkpoints) {
      const cps = n.checkpoints.map((c) => `### [${c.id}] ${c.prompt[side]}\n${c.answer[side]}`).join("\n\n");
      parts.push(`## Checkpoint\n${cps}`);
    }
    if (n.keyTerms) {
      const kts = n.keyTerms.map((k) => `- ${k.term} :: ${k.definition[side]}`).join("\n");
      parts.push(`## Key Terms\n${kts}`);
    }
```

(d) In `parseNotePair`, after building `topic` and before the `diagram` line, add:
```ts
  const optLoc = (key: string): Loc | undefined =>
    es[key] !== undefined || rs[key] !== undefined ? { ru: rs[key] ?? "", en: es[key] ?? "" } : undefined;
  const tldr = optLoc("tl;dr"); if (tldr) topic.tldr = tldr;
  const analogy = optLoc("analogy"); if (analogy) topic.analogy = analogy;
  const whatWhy = optLoc("what & why"); if (whatWhy) topic.whatWhy = whatWhy;
  const howItWorks = optLoc("how it works"); if (howItWorks) topic.howItWorks = howItWorks;
  const gotcha = optLoc("gotcha"); if (gotcha) topic.gotcha = gotcha;
  const recap = optLoc("recap"); if (recap) topic.recap = recap;
  const checkpoints = parseCheckpoints(es["checkpoint"], rs["checkpoint"]); if (checkpoints) topic.checkpoints = checkpoints;
  const keyTerms = parseKeyTerms(es["key terms"], rs["key terms"]); if (keyTerms) topic.keyTerms = keyTerms;
```

- [ ] **Step 4: Run tests**

Run: `npm test -- scripts/lib/note.test.ts`
Expected: PASS (both the pre-existing round-trip test and the new-sections test).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/note.ts scripts/lib/note.test.ts
git commit -m "feat: note format supports layered/recall sections"
```

---

### Task 4: Validate parity on present new fields

**Files:**
- Modify: `scripts/lib/validate.ts`
- Test: `scripts/lib/validate.test.ts`

**Interfaces:**
- Consumes: `NormTopic` (new optional fields) from `./norm`.
- Produces: `validateTopic` also parity-checks `tldr, analogy, whatWhy, howItWorks, gotcha, recap` (when present), each `checkpoints[].prompt/answer`, each `keyTerms[].definition`, and non-empty `keyTerms[].term` — draft-aware.

- [ ] **Step 1: Write the failing test**

Append to `scripts/lib/validate.test.ts`:
```ts
describe("validateTopic new optional fields", () => {
  const withTldr = { ...base, tldr: { ru: "", en: "short" } };

  it("errors on a present field missing RU when published", () => {
    expect(validateTopic(withTldr, "published").errors.length).toBeGreaterThan(0);
  });
  it("warns (not errors) when draft", () => {
    const r = validateTopic(withTldr, "draft");
    expect(r.errors).toEqual([]);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("flags an empty key-term label", () => {
    const bad = { ...base, keyTerms: [{ term: "", definition: { ru: "д", en: "d" } }] };
    expect(validateTopic(bad, "published").errors.some((e) => e.includes("keyTerms"))).toBe(true);
  });
});
```
(`base` is the existing complete `NormTopic` fixture already defined at the top of this test file.)

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- scripts/lib/validate.test.ts`
Expected: FAIL — new fields are not yet validated.

- [ ] **Step 3: Extend validate.ts**

In `scripts/lib/validate.ts`, before the `return status === "published" ...` line, add:
```ts
  if (n.tldr) checkLoc(n.tldr, "tldr");
  if (n.analogy) checkLoc(n.analogy, "analogy");
  if (n.whatWhy) checkLoc(n.whatWhy, "whatWhy");
  if (n.howItWorks) checkLoc(n.howItWorks, "howItWorks");
  if (n.gotcha) checkLoc(n.gotcha, "gotcha");
  if (n.recap) checkLoc(n.recap, "recap");
  n.checkpoints?.forEach((c, i) => {
    checkLoc(c.prompt, `checkpoints[${i}].prompt`);
    checkLoc(c.answer, `checkpoints[${i}].answer`);
  });
  n.keyTerms?.forEach((k, i) => {
    if (!k.term.trim()) issues.push(`${n.id}: keyTerms[${i}].term is empty`);
    checkLoc(k.definition, `keyTerms[${i}].definition`);
  });
```

- [ ] **Step 4: Run tests**

Run: `npm test -- scripts/lib/validate.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/validate.ts scripts/lib/validate.test.ts
git commit -m "feat: validate parity on layered/recall fields"
```

---

### Task 5: `resolveTopic()` degradation resolver

**Files:**
- Create: `src/lib/resolve-topic.ts`
- Test: `src/lib/resolve-topic.test.ts`

**Interfaces:**
- Consumes: `TopicContent`, `Checkpoint`, `KeyTerm`, `InterviewQuestion`, `SpringConnection` from `./types`.
- Produces: `ResolvedTopic` and `resolveTopic(c: TopicContent): ResolvedTopic`. `tldr` falls back to `summary`; `howItWorks` to `deepDive`; `gotcha` to `tip` (empty tip → undefined); `analogy/whatWhy/recap` pass through (may be undefined); `checkpoints/keyTerms` default to `[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/resolve-topic.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { resolveTopic } from "./resolve-topic";
import type { TopicContent } from "./types";

const legacy: TopicContent = {
  id: "l", blockId: 1, title: "T", summary: "S", deepDive: "D", code: "C",
  interviewQs: [], tip: "TIP", springConnection: null,
};

const rich: TopicContent = {
  ...legacy, id: "r", tldr: "TLDR", analogy: "AN", whatWhy: "WW",
  howItWorks: "HIW", gotcha: "G", recap: "R",
  checkpoints: [{ id: "cp1", prompt: "p", answer: "a" }],
  keyTerms: [{ term: "k", definition: "d" }],
};

describe("resolveTopic", () => {
  it("falls back to legacy fields", () => {
    const r = resolveTopic(legacy);
    expect(r.tldr).toBe("S");
    expect(r.howItWorks).toBe("D");
    expect(r.gotcha).toBe("TIP");
    expect(r.analogy).toBeUndefined();
    expect(r.recap).toBeUndefined();
    expect(r.checkpoints).toEqual([]);
    expect(r.keyTerms).toEqual([]);
  });

  it("prefers authored fields", () => {
    const r = resolveTopic(rich);
    expect(r.tldr).toBe("TLDR");
    expect(r.howItWorks).toBe("HIW");
    expect(r.gotcha).toBe("G");
    expect(r.analogy).toBe("AN");
    expect(r.checkpoints).toHaveLength(1);
  });

  it("treats empty tip as no gotcha", () => {
    expect(resolveTopic({ ...legacy, tip: "" }).gotcha).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/lib/resolve-topic.test.ts`
Expected: FAIL — module `./resolve-topic` not found.

- [ ] **Step 3: Implement resolve-topic.ts**

Create `src/lib/resolve-topic.ts`:
```ts
import type { TopicContent, Checkpoint, KeyTerm, InterviewQuestion, SpringConnection } from "./types";

export interface ResolvedTopic {
  id: string;
  blockId: number;
  title: string;
  tldr: string;              // bilingual — always present (falls back to summary)
  analogy?: string;
  whatWhy?: string;
  howItWorks: string;        // always present (falls back to deepDive)
  code: string;
  gotcha?: string;           // falls back to tip; empty tip → undefined
  recap?: string;
  checkpoints: Checkpoint[];
  keyTerms: KeyTerm[];
  interviewQs: InterviewQuestion[];
  springConnection: SpringConnection | null;
  diagram?: string;
}

export function resolveTopic(c: TopicContent): ResolvedTopic {
  return {
    id: c.id,
    blockId: c.blockId,
    title: c.title,
    tldr: c.tldr ?? c.summary,
    analogy: c.analogy,
    whatWhy: c.whatWhy,
    howItWorks: c.howItWorks ?? c.deepDive,
    code: c.code,
    gotcha: c.gotcha ?? (c.tip ? c.tip : undefined),
    recap: c.recap,
    checkpoints: c.checkpoints ?? [],
    keyTerms: c.keyTerms ?? [],
    interviewQs: c.interviewQs,
    springConnection: c.springConnection,
    diagram: c.diagram,
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/lib/resolve-topic.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/resolve-topic.ts src/lib/resolve-topic.test.ts
git commit -m "feat: resolveTopic graceful-degradation helper"
```

---

### Task 6: Depth persistence (`depth.ts`)

**Files:**
- Create: `src/lib/depth.ts`
- Test: `src/lib/depth.test.ts`

**Interfaces:**
- Produces: `type Depth = "quick" | "standard" | "deep"`, `DEFAULT_DEPTH = "standard"`, `coerceDepth(raw: string | null): Depth`, `loadDepth(): Depth`, `saveDepth(d: Depth): void`. (The React `useDepth` hook that wraps these lives in Plan B, where it's consumed.)

- [ ] **Step 1: Write the failing test**

Create `src/lib/depth.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { coerceDepth, loadDepth, DEFAULT_DEPTH } from "./depth";

describe("depth", () => {
  it("coerces valid values", () => {
    expect(coerceDepth("quick")).toBe("quick");
    expect(coerceDepth("standard")).toBe("standard");
    expect(coerceDepth("deep")).toBe("deep");
  });
  it("coerces invalid/null to the default", () => {
    expect(coerceDepth("nonsense")).toBe(DEFAULT_DEPTH);
    expect(coerceDepth(null)).toBe(DEFAULT_DEPTH);
    expect(DEFAULT_DEPTH).toBe("standard");
  });
  it("loadDepth returns the default under SSR (no window)", () => {
    expect(loadDepth()).toBe(DEFAULT_DEPTH);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/lib/depth.test.ts`
Expected: FAIL — module `./depth` not found.

- [ ] **Step 3: Implement depth.ts**

Create `src/lib/depth.ts` (mirrors the SSR-guard pattern in `progress.ts`):
```ts
export type Depth = "quick" | "standard" | "deep";
export const DEFAULT_DEPTH: Depth = "standard";
const STORAGE_KEY = "devcore:depth";

export function coerceDepth(raw: string | null): Depth {
  return raw === "quick" || raw === "standard" || raw === "deep" ? raw : DEFAULT_DEPTH;
}

export function loadDepth(): Depth {
  if (typeof window === "undefined") return DEFAULT_DEPTH;
  try {
    return coerceDepth(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_DEPTH;
  }
}

export function saveDepth(d: Depth): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, d);
  } catch {
    // ignore
  }
}
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npm test -- src/lib/depth.test.ts && npm run typecheck`
Expected: PASS; typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/depth.ts src/lib/depth.test.ts
git commit -m "feat: depth persistence helpers"
```

---

### Task 7: Narrow the round-trip to original fields + verify no regression

**Files:**
- Modify: `scripts/roundtrip.test.ts`

**Interfaces:**
- Consumes: `decompose` (now emits extra optional fields for authored topics) and the baseline fixture.
- Produces: a round-trip that compares only the **original** NormTopic keys, so future additive authoring cannot false-fail it.

- [ ] **Step 1: Rewrite the round-trip comparison**

Replace the body of the first `it(...)` in `scripts/roundtrip.test.ts` so it compares a projection. The full file becomes:
```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { decompose } from "./lib/norm";
import baseline from "../tests/fixtures/content-baseline.json";

// The baseline captures the ORIGINAL topic shape. New optional fields
// (tldr/analogy/checkpoints/…) are additive and intentionally absent from it,
// so we compare only the original keys — proving existing content is never lost
// or altered, while allowing authored enrichment.
const ORIGINAL_KEYS = [
  "id", "blockId", "diagram", "title", "summary", "deepDive", "tip", "code", "interviewQs", "spring",
] as const;

function pickOriginal(n: Record<string, unknown>): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const k of ORIGINAL_KEYS) if (k in n) o[k] = n[k];
  return o;
}

describe("vault → compile round-trip preserves original content", () => {
  const ids = Object.keys(baseline as Record<string, unknown>);

  it("regenerates every topic's original fields identically", async () => {
    for (const id of ids) {
      const mod = await import(resolve(`src/data/content/${id}.ts`));
      const regenerated = pickOriginal(decompose(mod.topic) as unknown as Record<string, unknown>);
      expect(regenerated, `topic ${id}`).toEqual((baseline as Record<string, unknown>)[id]);
    }
  });

  it("the source TS files exist", () => {
    for (const id of ids) {
      expect(() => readFileSync(resolve(`src/data/content/${id}.ts`), "utf8")).not.toThrow();
    }
  });
});
```

- [ ] **Step 2: Regenerate content and run the full suite**

Run: `npm run compile-content && npm test`
Expected: compile emits 106 modules with 0 errors; all tests PASS including the narrowed round-trip (106 topics — unchanged, since no new fields are authored yet).

- [ ] **Step 3: Verify the app still builds and typechecks**

Run: `npm run typecheck && npm run build`
Expected: 0 type errors; `next build` succeeds. (The app ignores the new optional fields — no UI change in this plan.)

- [ ] **Step 4: Commit**

```bash
git add scripts/roundtrip.test.ts
git commit -m "test: narrow round-trip to original fields (additive-safe)"
```

---

## Self-Review

**Spec coverage (against `2026-07-01-devcore-learning-ux-design.md`):**
- §4 model extension (types + note sections + engine threading) → Tasks 1, 2, 3. ✓
- §4 validation parity on present fields → Task 4. ✓
- §5 `resolveTopic()` degradation → Task 5. ✓
- §6 depth persistence (`localStorage` key `devcore:depth`, default `standard`) → Task 6 (`depth.ts`; the React `useDepth` hook is Plan B). ✓
- §11 no-regression round-trip narrowed to original fields → Task 7. ✓
- **Deferred to Plan B (by design):** the `LessonView` UI, `DepthControl` + `useDepth` hook, active-recall components (`Checkpoint`/`KeyTerm`/`Glossary`/`MiniQuiz`/`CompletionNudge`), Mermaid/`DiagramRef` renderer, and authoring the 5 exemplars. Flagged so they aren't lost.

**Placeholder scan:** none — every step has runnable code or an exact command. ✓

**Type consistency:** `Checkpoint`/`KeyTerm` (Task 1) reused by `norm.ts` decompose (Task 2), `resolve-topic.ts` (Task 5). `NormCheckpoint`/`NormKeyTerm`/optional `Loc` fields (Task 2) consumed by `note.ts` (Task 3) and `validate.ts` (Task 4). Reserved section names match between `note.ts` `RESERVED` (Task 3) and the Global Constraints list. `Depth`/`DEFAULT_DEPTH` (Task 6) will be consumed by Plan B's hook. ✓

---

## Notes for the executor
- Run tasks in order; Tasks 1–6 are independently testable; Task 7 depends on 1–3 (decompose must emit the new fields for the projection logic to matter, though the 106 legacy topics exercise only the original keys).
- No app component is touched in this plan — the app keeps rendering today's UI while gaining the richer data capability. Plan B builds the UI on top.
