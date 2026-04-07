# Java Core Interview Prep Platform — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Next.js web app for learning Java fundamentals with a visual roadmap, pre-loaded expert content, code playground, spaced repetition, and Spring connections.

**Architecture:** Next.js 14 App Router with Tailwind CSS, Framer Motion for animations, Shiki for code highlighting. All 58 topic content files are pre-loaded static TypeScript. Progress and spaced repetition state persisted to localStorage. AI "Ask Deeper" feature proxied through a Next.js API route to Claude.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Shiki, localStorage

**Spec:** `docs/superpowers/specs/2026-04-07-java-learning-platform-design.md`

---

## Chunk 1: Project Setup & Core Data Layer

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `.env.local.example`

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
cd /Users/aidarkazybekov/DEV/java-core
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the full Next.js scaffold.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion shiki @anthropic-ai/sdk
```

- [ ] **Step 3: Configure Tailwind with custom design tokens**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#09090b",
          card: "#111114",
          elevated: "#18181b",
        },
        border: "#27272a",
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#52525b",
        },
        accent: {
          green: "#4ade80",
          cyan: "#22d3ee",
          amber: "#f59e0b",
          red: "#f87171",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Set up globals.css**

Replace `src/app/globals.css` (where create-next-app places it — layout.tsx imports from `"./globals.css"`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  @apply bg-bg-primary text-text-secondary font-sans antialiased;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Java Core — Interview Prep",
  description: "Interactive Java learning platform for technical interview preparation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder landing page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-5xl mb-4">☕</div>
        <h1 className="text-2xl font-bold text-text-primary">Java Core — Interview Prep</h1>
        <p className="text-text-muted mt-2">Platform loading...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create .env.local.example**

```bash
# .env.local.example
ANTHROPIC_API_KEY=your-api-key-here
JDOODLE_CLIENT_ID=your-jdoodle-client-id
JDOODLE_CLIENT_SECRET=your-jdoodle-client-secret
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000 — should show the coffee cup placeholder.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Tailwind, design tokens, and fonts"
```

---

### Task 2: TypeScript Types & Roadmap Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/data/roadmap.ts`

- [ ] **Step 1: Create shared TypeScript types**

Create `src/lib/types.ts`:

```typescript
export interface TopicContent {
  id: string;
  blockId: number;
  title: string;
  summary: string;
  deepDive: string;
  code: string;
  interviewQs: InterviewQuestion[];
  tip: string;
  springConnection: SpringConnection | null;
}

export interface SpringConnection {
  concept: string;
  springFeature: string;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  q: string;
  a: string;
  difficulty: "junior" | "mid" | "senior";
}

export interface Block {
  id: number;
  icon: string;
  title: string;
  topics: TopicMeta[];
}

export interface TopicMeta {
  id: string;
  title: string;
  prerequisites?: string[];
}

export interface ProgressState {
  completed: string[];
  srState: Record<string, SRCard>;
  lastVisited: string | null;
  streak: number;
  lastActiveDate: string;
}

export interface SRCard {
  questionId: string;
  interval: number;
  easeFactor: number;
  nextReview: string;
  repetitions: number;
}
```

- [ ] **Step 2: Create roadmap data with all 58 topics**

Create `src/data/roadmap.ts`:

```typescript
import { Block } from "@/lib/types";

export const ROADMAP: Block[] = [
  {
    id: 1,
    icon: "⚙️",
    title: "How Java Works",
    topics: [
      { id: "1-1", title: "JVM Architecture" },
      { id: "1-2", title: "JDK vs JRE vs JVM" },
      { id: "1-3", title: "Bytecode & Compilation" },
      { id: "1-4", title: "ClassLoaders & Delegation" },
      { id: "1-5", title: "JIT Compilation" },
    ],
  },
  {
    id: 2,
    icon: "🔤",
    title: "Language Basics",
    topics: [
      { id: "2-1", title: "Primitive Types & Wrappers" },
      { id: "2-2", title: "Variables & Scope" },
      { id: "2-3", title: "Operators & Casting" },
      { id: "2-4", title: "Control Flow" },
      { id: "2-5", title: "Arrays" },
    ],
  },
  {
    id: 3,
    icon: "🏗️",
    title: "OOP",
    topics: [
      { id: "3-1", title: "Classes & Objects" },
      { id: "3-2", title: "Constructors & this" },
      { id: "3-3", title: "Inheritance & super" },
      { id: "3-4", title: "Polymorphism" },
      { id: "3-5", title: "Interfaces vs Abstract Classes" },
      { id: "3-6", title: "Access Modifiers & static" },
      { id: "3-7", title: "SOLID Principles" },
      { id: "3-8", title: "Design Patterns" },
    ],
  },
  {
    id: 4,
    icon: "📦",
    title: "Core APIs",
    topics: [
      { id: "4-1", title: "String & String Pool" },
      { id: "4-2", title: "StringBuilder vs StringBuffer" },
      { id: "4-3", title: "equals(), hashCode(), toString()" },
      { id: "4-4", title: "Math & Wrapper Classes" },
    ],
  },
  {
    id: 5,
    icon: "⚠️",
    title: "Exception Handling",
    topics: [
      { id: "5-1", title: "Checked vs Unchecked" },
      { id: "5-2", title: "try / catch / finally" },
      { id: "5-3", title: "try-with-resources" },
      { id: "5-4", title: "Custom Exceptions" },
      { id: "5-5", title: "Exception Hierarchy" },
    ],
  },
  {
    id: 6,
    icon: "📚",
    title: "Collections & Generics",
    topics: [
      { id: "6-1", title: "ArrayList vs LinkedList" },
      { id: "6-2", title: "HashMap Internals" },
      { id: "6-3", title: "HashSet, TreeSet, LinkedHashSet" },
      { id: "6-4", title: "ConcurrentHashMap" },
      { id: "6-5", title: "Generics & Type Erasure" },
      { id: "6-6", title: "Wildcards (? extends / ? super)" },
      { id: "6-7", title: "Comparable vs Comparator" },
    ],
  },
  {
    id: 7,
    icon: "λ",
    title: "Streams & Lambdas",
    topics: [
      { id: "7-1", title: "Functional Interfaces" },
      { id: "7-2", title: "Lambda Expressions" },
      { id: "7-3", title: "Method References" },
      { id: "7-4", title: "Stream API" },
      { id: "7-5", title: "Collectors" },
      { id: "7-6", title: "Optional" },
      { id: "7-7", title: "Parallel Streams" },
    ],
  },
  {
    id: 8,
    icon: "🧵",
    title: "Concurrency",
    topics: [
      { id: "8-1", title: "Thread Lifecycle" },
      { id: "8-2", title: "synchronized & volatile" },
      { id: "8-3", title: "Java Memory Model" },
      { id: "8-4", title: "ReentrantLock" },
      { id: "8-5", title: "ExecutorService" },
      { id: "8-6", title: "CompletableFuture" },
      { id: "8-7", title: "Deadlock & Thread Safety" },
    ],
  },
  {
    id: 9,
    icon: "🧠",
    title: "JVM Internals & Memory",
    topics: [
      { id: "9-1", title: "Heap: Young, Old, Metaspace" },
      { id: "9-2", title: "Garbage Collection Algorithms" },
      { id: "9-3", title: "Stack vs Heap" },
      { id: "9-4", title: "Memory Leaks" },
      { id: "9-5", title: "GC Tuning Flags" },
    ],
  },
  {
    id: 10,
    icon: "📡",
    title: "I/O & NIO",
    topics: [
      { id: "10-1", title: "InputStream / OutputStream" },
      { id: "10-2", title: "Reader / Writer" },
      { id: "10-3", title: "NIO Channels & Buffers" },
      { id: "10-4", title: "Path & Files API (NIO.2)" },
      { id: "10-5", title: "Serialization" },
    ],
  },
];

export const TOTAL_TOPICS = ROADMAP.reduce((sum, block) => sum + block.topics.length, 0);

export function getBlock(blockId: number): Block | undefined {
  return ROADMAP.find((b) => b.id === blockId);
}

export function getTopic(topicId: string): { block: Block; topic: TopicMeta } | undefined {
  for (const block of ROADMAP) {
    const topic = block.topics.find((t) => t.id === topicId);
    if (topic) return { block, topic };
  }
  return undefined;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts src/data/roadmap.ts
git commit -m "feat: add TypeScript types and roadmap data for all 58 topics"
```

---

### Task 3: Progress & Spaced Repetition Library

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/lib/spaced-repetition.ts`

- [ ] **Step 1: Create progress library**

Create `src/lib/progress.ts`:

```typescript
import { ProgressState } from "./types";

const STORAGE_KEY = "java-prep-progress";

const DEFAULT_STATE: ProgressState = {
  completed: [],
  srState: {},
  lastVisited: null,
  streak: 0,
  lastActiveDate: "",
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function toggleComplete(state: ProgressState, topicId: string): ProgressState {
  const completed = state.completed.includes(topicId)
    ? state.completed.filter((id) => id !== topicId)
    : [...state.completed, topicId];
  return updateStreak({ ...state, completed });
}

export function updateLastVisited(state: ProgressState, topicId: string): ProgressState {
  return { ...state, lastVisited: topicId };
}

function updateStreak(state: ProgressState): ProgressState {
  const today = new Date().toISOString().split("T")[0];
  if (state.lastActiveDate === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;

  return { ...state, streak, lastActiveDate: today };
}
```

- [ ] **Step 2: Create spaced repetition library (SM-2 algorithm)**

Create `src/lib/spaced-repetition.ts`:

```typescript
import { SRCard, ProgressState } from "./types";

export function createCard(questionId: string): SRCard {
  return {
    questionId,
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().split("T")[0],
    repetitions: 0,
  };
}

/**
 * SM-2 algorithm: updates card based on quality rating.
 * @param card - current card state
 * @param quality - 0 (Again), 3 (Hard), 4 (Good), 5 (Easy)
 */
export function reviewCard(card: SRCard, quality: number): SRCard {
  let { interval, easeFactor, repetitions } = card;

  if (quality < 3) {
    // Reset on failure
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = new Date(Date.now() + interval * 86400000)
    .toISOString()
    .split("T")[0];

  return { ...card, interval, easeFactor, nextReview, repetitions };
}

export function getDueCards(state: ProgressState): SRCard[] {
  const today = new Date().toISOString().split("T")[0];
  return Object.values(state.srState).filter((card) => card.nextReview <= today);
}

export function updateSRState(
  state: ProgressState,
  questionId: string,
  quality: number
): ProgressState {
  const existing = state.srState[questionId] || createCard(questionId);
  const updated = reviewCard(existing, quality);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const streak =
    state.lastActiveDate === today
      ? state.streak
      : state.lastActiveDate === yesterday
        ? state.streak + 1
        : 1;
  return {
    ...state,
    srState: { ...state.srState, [questionId]: updated },
    lastActiveDate: today,
    streak,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/progress.ts src/lib/spaced-repetition.ts
git commit -m "feat: add progress persistence and SM-2 spaced repetition library"
```

---

## Chunk 2: Content Data (All 58 Topics)

### Task 4: Generate Pre-loaded Content for All 58 Topics

This is the largest single task — generating expert-quality content for all 58 topics. Each file follows the `TopicContent` interface.

**Files:**
- Create: `src/data/content/index.ts` (barrel export)
- Create: `src/data/content/1-1.ts` through `src/data/content/10-5.ts` (58 files)

**Content quality requirements per topic:**
- `summary`: 2-3 sentences, plain English, why it matters for interviews
- `deepDive`: 3-5 paragraphs covering internals, gotchas, interview depth. Markdown formatted.
- `code`: Real, runnable, well-commented Java. Not hello-world — interview-caliber.
- `interviewQs`: 3 questions (1 junior, 1 mid, 1 senior). Strong answers a senior engineer would give.
- `tip`: One sharp, memorable tip that separates memorizers from understanders.
- `springConnection`: How this Java concept maps to Spring (null for foundational topics like "Arrays").

- [ ] **Step 1: Create content for Block 1 — How Java Works (5 files)**

Create `src/data/content/1-1.ts` through `src/data/content/1-5.ts`.

Example structure for `src/data/content/1-1.ts`:

```typescript
import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-1",
  blockId: 1,
  title: "JVM Architecture",
  summary: "The JVM is the engine that runs Java bytecode on any platform. Understanding its internal components — class loader, runtime data areas, and execution engine — is foundational for debugging performance issues and answering architecture questions in interviews.",
  deepDive: `The Java Virtual Machine is an abstract computing machine with three main subsystems: the Class Loader Subsystem, the Runtime Data Areas, and the Execution Engine.\n\nThe Class Loader Subsystem handles loading .class files into memory. It follows three phases: loading (finding the binary), linking (verification, preparation, resolution), and initialization (running static initializers). The delegation model ensures parent classloaders get first chance, preventing you from accidentally shadowing core classes like java.lang.String.\n\nRuntime Data Areas include the Method Area (shared, stores class metadata and the constant pool), the Heap (shared, where objects live), the Stack (per-thread, holds frames with local variables and operand stack), the PC Register (per-thread, tracks current instruction), and Native Method Stacks.\n\nThe Execution Engine has three components: the Interpreter (reads bytecode line by line — slow but starts immediately), the JIT Compiler (compiles hot methods to native code for speed), and the Garbage Collector (reclaims unused heap memory). Modern JVMs use tiered compilation — starting with the interpreter, then C1 (quick compile), then C2 (optimized compile) for the hottest code.\n\nIn interviews, knowing this architecture lets you explain why Java has warmup time (JIT hasn't kicked in yet), why metaspace can run out (too many classes loaded), and why thread stacks can overflow independently of heap memory.`,
  code: `// Exploring JVM architecture at runtime
public class JVMArchitectureDemo {
    public static void main(String[] args) {
        // Runtime data areas - heap info
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();       // -Xmx
        long totalMemory = runtime.totalMemory();   // current heap size
        long freeMemory = runtime.freeMemory();     // free within current heap

        System.out.println("Max Heap:   " + (maxMemory / 1024 / 1024) + " MB");
        System.out.println("Total Heap: " + (totalMemory / 1024 / 1024) + " MB");
        System.out.println("Used Heap:  " + ((totalMemory - freeMemory) / 1024 / 1024) + " MB");

        // Class loader info
        ClassLoader cl = JVMArchitectureDemo.class.getClassLoader();
        System.out.println("\\nClass loader: " + cl);
        System.out.println("Parent:       " + cl.getParent());
        // Bootstrap loader returns null (it's native)
        System.out.println("Grandparent:  " + cl.getParent().getParent());

        // Available processors (relevant for thread pools)
        System.out.println("\\nCPU cores: " + runtime.availableProcessors());
    }
}`,
  interviewQs: [
    {
      id: "1-1-q0",
      q: "What are the main components of the JVM?",
      a: "The JVM has three main subsystems: (1) Class Loader Subsystem — loads, links, and initializes .class files; (2) Runtime Data Areas — Method Area, Heap, Stack, PC Register, Native Method Stacks; (3) Execution Engine — Interpreter, JIT Compiler, and Garbage Collector. The heap and method area are shared across threads; stacks and PC registers are per-thread.",
      difficulty: "junior",
    },
    {
      id: "1-1-q1",
      q: "Why does a Java application often perform better after running for a few minutes?",
      a: "JVM warmup. The JIT compiler profiles running code and identifies 'hot' methods — those called frequently. It then compiles these from bytecode to optimized native machine code. Modern JVMs use tiered compilation: the interpreter runs first (instant start), C1 compiler does quick optimization, then C2 does aggressive optimization for the hottest code paths. After warmup, critical paths run at near-native speed.",
      difficulty: "mid",
    },
    {
      id: "1-1-q2",
      q: "A production service throws OutOfMemoryError: Metaspace. What's happening and how do you fix it?",
      a: "Metaspace stores class metadata (replaced PermGen in Java 8+). An OOM here means too many classes are loaded — common causes: (1) classloader leaks in app servers during redeployments (old classloaders not GC'd because something holds a reference), (2) heavy use of dynamic proxies or code generation (Spring AOP, Hibernate), (3) too many lambda expressions creating anonymous classes. Fix: increase -XX:MaxMetaspaceSize as a band-aid, but the real fix is finding the leak with tools like jmap -clstats or VisualVM's class loader view.",
      difficulty: "senior",
    },
  ],
  tip: "When an interviewer asks about JVM architecture, don't just list components — connect them to real problems. 'The JIT compiler is why we see latency spikes on cold starts' shows understanding. 'The JVM has an execution engine' shows memorization.",
  springConnection: {
    concept: "JVM Architecture",
    springFeature: "Spring Boot Startup & Bean Initialization",
    explanation: "Spring Boot's startup time is directly affected by JVM warmup. The class loader subsystem loads thousands of Spring classes, the method area fills with bean definitions and proxy metadata, and the JIT compiler hasn't optimized request-handling paths yet. This is why Spring Boot apps benefit from AOT compilation (Spring Native/GraalVM) — it eliminates runtime class loading and JIT warmup. Understanding JVM architecture explains why your first few API calls are slow and why -XX:TieredStopAtLevel=1 speeds up startup (skips C2 optimization).",
  },
};
```

Generate all 5 files for Block 1 following this pattern. Each topic must have unique, expert-level content — not templates with fill-in-the-blank.

- [ ] **Step 2: Create content for Block 2 — Language Basics (5 files)**

Create `src/data/content/2-1.ts` through `src/data/content/2-5.ts` following the same pattern.

- [ ] **Step 3: Create content for Block 3 — OOP (8 files)**

Create `src/data/content/3-1.ts` through `src/data/content/3-8.ts`.

- [ ] **Step 4: Create content for Block 4 — Core APIs (4 files)**

Create `src/data/content/4-1.ts` through `src/data/content/4-4.ts`.

- [ ] **Step 5: Create content for Block 5 — Exception Handling (5 files)**

Create `src/data/content/5-1.ts` through `src/data/content/5-5.ts`.

- [ ] **Step 6: Create content for Block 6 — Collections & Generics (7 files)**

Create `src/data/content/6-1.ts` through `src/data/content/6-7.ts`.

- [ ] **Step 7: Create content for Block 7 — Streams & Lambdas (7 files)**

Create `src/data/content/7-1.ts` through `src/data/content/7-7.ts`.

- [ ] **Step 8: Create content for Block 8 — Concurrency (7 files)**

Create `src/data/content/8-1.ts` through `src/data/content/8-7.ts`.

- [ ] **Step 9: Create content for Block 9 — JVM Internals & Memory (5 files)**

Create `src/data/content/9-1.ts` through `src/data/content/9-5.ts`.

- [ ] **Step 10: Create content for Block 10 — I/O & NIO (5 files)**

Create `src/data/content/10-1.ts` through `src/data/content/10-5.ts`.

- [ ] **Step 11: Create barrel export**

Create `src/data/content/index.ts`:

```typescript
import { TopicContent } from "@/lib/types";

// Dynamic import map for all topic content
const contentModules: Record<string, () => Promise<{ topic: TopicContent }>> = {
  "1-1": () => import("./1-1"),
  "1-2": () => import("./1-2"),
  "1-3": () => import("./1-3"),
  "1-4": () => import("./1-4"),
  "1-5": () => import("./1-5"),
  "2-1": () => import("./2-1"),
  "2-2": () => import("./2-2"),
  "2-3": () => import("./2-3"),
  "2-4": () => import("./2-4"),
  "2-5": () => import("./2-5"),
  "3-1": () => import("./3-1"),
  "3-2": () => import("./3-2"),
  "3-3": () => import("./3-3"),
  "3-4": () => import("./3-4"),
  "3-5": () => import("./3-5"),
  "3-6": () => import("./3-6"),
  "3-7": () => import("./3-7"),
  "3-8": () => import("./3-8"),
  "4-1": () => import("./4-1"),
  "4-2": () => import("./4-2"),
  "4-3": () => import("./4-3"),
  "4-4": () => import("./4-4"),
  "5-1": () => import("./5-1"),
  "5-2": () => import("./5-2"),
  "5-3": () => import("./5-3"),
  "5-4": () => import("./5-4"),
  "5-5": () => import("./5-5"),
  "6-1": () => import("./6-1"),
  "6-2": () => import("./6-2"),
  "6-3": () => import("./6-3"),
  "6-4": () => import("./6-4"),
  "6-5": () => import("./6-5"),
  "6-6": () => import("./6-6"),
  "6-7": () => import("./6-7"),
  "7-1": () => import("./7-1"),
  "7-2": () => import("./7-2"),
  "7-3": () => import("./7-3"),
  "7-4": () => import("./7-4"),
  "7-5": () => import("./7-5"),
  "7-6": () => import("./7-6"),
  "7-7": () => import("./7-7"),
  "8-1": () => import("./8-1"),
  "8-2": () => import("./8-2"),
  "8-3": () => import("./8-3"),
  "8-4": () => import("./8-4"),
  "8-5": () => import("./8-5"),
  "8-6": () => import("./8-6"),
  "8-7": () => import("./8-7"),
  "9-1": () => import("./9-1"),
  "9-2": () => import("./9-2"),
  "9-3": () => import("./9-3"),
  "9-4": () => import("./9-4"),
  "9-5": () => import("./9-5"),
  "10-1": () => import("./10-1"),
  "10-2": () => import("./10-2"),
  "10-3": () => import("./10-3"),
  "10-4": () => import("./10-4"),
  "10-5": () => import("./10-5"),
};

export async function getTopicContent(id: string): Promise<TopicContent | null> {
  const loader = contentModules[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.topic;
}

// For static generation — load all content synchronously at build time
export { contentModules };
```

- [ ] **Step 12: Commit all content files**

```bash
git add src/data/content/
git commit -m "feat: add pre-loaded expert content for all 58 Java topics"
```

---

## Chunk 3: Sidebar & Progress UI Components

### Task 5: Progress Bar Component

**Files:**
- Create: `src/components/ProgressBar.tsx`

- [ ] **Step 1: Create ProgressBar component**

Create `src/components/ProgressBar.tsx`:

```tsx
"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-text-muted tabular-nums whitespace-nowrap">
        {completed}/{total}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgressBar.tsx
git commit -m "feat: add ProgressBar component with gradient fill"
```

---

### Task 6: Progress Ring Component (per-block circular SVG)

**Files:**
- Create: `src/components/ProgressRing.tsx`

- [ ] **Step 1: Create ProgressRing component**

Create `src/components/ProgressRing.tsx`:

```tsx
"use client";

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

export default function ProgressRing({ completed, total, size = 28 }: ProgressRingProps) {
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : completed / total;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#27272a"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#4ade80"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgressRing.tsx
git commit -m "feat: add ProgressRing SVG component for per-block progress"
```

---

### Task 7: Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `src/components/Sidebar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAP, TOTAL_TOPICS } from "@/data/roadmap";
import { Block } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import ProgressRing from "./ProgressRing";

interface SidebarProps {
  completed: Set<string>;
  selectedTopicId: string | null;
  dueCount: number;
  onSelectTopic: (topicId: string) => void;
  onReviewClick: () => void;
}

export default function Sidebar({
  completed,
  selectedTopicId,
  dueCount,
  onSelectTopic,
  onReviewClick,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([1]));

  const toggleBlock = (id: number) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex-shrink-0 bg-bg-card border-r border-border flex flex-col overflow-hidden h-screen"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          {!collapsed && (
            <div>
              <div className="text-[11px] text-accent-green tracking-[3px] uppercase">
                Java Core
              </div>
              <div className="text-lg font-bold text-text-primary">Interview Prep</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-bg-elevated transition-colors text-text-muted"
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
        {!collapsed && <ProgressBar completed={completed.size} total={TOTAL_TOPICS} />}

        {/* Review badge */}
        {!collapsed && dueCount > 0 && (
          <button
            onClick={onReviewClick}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border hover:border-accent-amber transition-colors text-sm"
          >
            <span className="text-accent-amber">🔄</span>
            <span className="text-text-secondary">{dueCount} cards due</span>
          </button>
        )}
      </div>

      {/* Blocks list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2">
          {ROADMAP.map((block) => (
            <SidebarBlock
              key={block.id}
              block={block}
              completed={completed}
              expanded={expandedBlocks.has(block.id)}
              selectedTopicId={selectedTopicId}
              onToggle={() => toggleBlock(block.id)}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </div>
      )}

      {/* Collapsed: just icons */}
      {collapsed && (
        <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1">
          {ROADMAP.map((block) => (
            <button
              key={block.id}
              onClick={() => {
                setCollapsed(false);
                setExpandedBlocks((prev) => new Set(prev).add(block.id));
              }}
              className="p-2 rounded hover:bg-bg-elevated transition-colors"
              title={block.title}
            >
              <span className="text-sm">{block.icon}</span>
            </button>
          ))}
        </div>
      )}
    </motion.aside>
  );
}

function SidebarBlock({
  block,
  completed,
  expanded,
  selectedTopicId,
  onToggle,
  onSelectTopic,
}: {
  block: Block;
  completed: Set<string>;
  expanded: boolean;
  selectedTopicId: string | null;
  onToggle: () => void;
  onSelectTopic: (id: string) => void;
}) {
  const blockDone = block.topics.filter((t) => completed.has(t.id)).length;

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-bg-elevated transition-colors"
      >
        <ProgressRing completed={blockDone} total={block.topics.length} />
        <div className="flex-1 text-left min-w-0">
          <div className="text-[11px] font-semibold text-text-secondary tracking-wide">
            {block.id.toString().padStart(2, "0")}. {block.title}
          </div>
          <div className="text-[10px] text-text-muted">
            {blockDone}/{block.topics.length} done
          </div>
        </div>
        <span className="text-[10px] text-text-muted">{expanded ? "▼" : "▶"}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden ml-6 border-l border-border"
          >
            {block.topics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const isDone = completed.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-all
                    ${isSelected ? "bg-accent-green/10 border-l-2 border-accent-green -ml-px" : "border-l-2 border-transparent -ml-px hover:bg-bg-elevated"}
                  `}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center text-[9px]
                      ${isDone ? "bg-accent-green text-black" : "border border-border"}
                    `}
                  >
                    {isDone ? "✓" : ""}
                  </div>
                  <span
                    className={`text-[11px] leading-tight
                      ${isSelected ? "text-accent-green" : isDone ? "text-text-muted" : "text-text-secondary"}
                    `}
                  >
                    {topic.title}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: add collapsible Sidebar with tree nav, progress rings, and review badge"
```

---

## Chunk 4: Visual Roadmap Graph

### Task 8: RoadmapGraph Component

**Files:**
- Create: `src/components/RoadmapGraph.tsx`

- [ ] **Step 1: Create the SVG roadmap graph**

Create `src/components/RoadmapGraph.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ROADMAP } from "@/data/roadmap";
import { Block } from "@/lib/types";

interface RoadmapGraphProps {
  completed: Set<string>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
}

const NODE_RADIUS = 20;
const NODE_GAP = 56;
const ROW_HEIGHT = 56;
const BLOCK_PADDING_X = 24;
const BLOCK_PADDING_TOP = 48;
const BLOCK_PADDING_BOTTOM = 24;
const BLOCK_GAP = 32;
const MAX_PER_ROW = 5;

function getBlockLayout(block: Block) {
  const rows = Math.ceil(block.topics.length / MAX_PER_ROW);
  const topicsInFirstRow = Math.min(block.topics.length, MAX_PER_ROW);
  const width = topicsInFirstRow * NODE_GAP + BLOCK_PADDING_X * 2;
  const height = BLOCK_PADDING_TOP + rows * ROW_HEIGHT + BLOCK_PADDING_BOTTOM;
  return { rows, width, height };
}

export default function RoadmapGraph({
  completed,
  selectedTopicId,
  onSelectTopic,
}: RoadmapGraphProps) {
  // Calculate total SVG dimensions
  const maxWidth = Math.max(
    ...ROADMAP.map((b) => getBlockLayout(b).width)
  );
  const totalHeight = ROADMAP.reduce(
    (sum, b) => sum + getBlockLayout(b).height + BLOCK_GAP,
    0
  );

  let yOffset = 20;
  const blockPositions: { block: Block; x: number; y: number; layout: ReturnType<typeof getBlockLayout> }[] = [];

  for (const block of ROADMAP) {
    const layout = getBlockLayout(block);
    blockPositions.push({
      block,
      x: (maxWidth - layout.width) / 2,
      y: yOffset,
      layout,
    });
    yOffset += layout.height + BLOCK_GAP;
  }

  return (
    <div className="flex-1 overflow-auto flex justify-center p-8">
      <svg
        width={maxWidth + 40}
        height={totalHeight + 40}
        className="mx-auto"
      >
        {/* Connector lines between blocks */}
        {blockPositions.slice(0, -1).map((bp, i) => {
          const next = blockPositions[i + 1];
          const fromY = bp.y + bp.layout.height;
          const toY = next.y;
          const cx = (maxWidth + 40) / 2;
          return (
            <line
              key={`conn-${i}`}
              x1={cx}
              y1={fromY}
              x2={cx}
              y2={toY}
              stroke="#27272a"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          );
        })}

        {/* Block clusters */}
        {blockPositions.map(({ block, x, y, layout }) => {
          const blockDone = block.topics.filter((t) => completed.has(t.id)).length;
          const allDone = blockDone === block.topics.length;

          return (
            <g key={block.id} transform={`translate(${x + 20}, ${y})`}>
              {/* Block background card */}
              <rect
                x={0}
                y={0}
                width={layout.width}
                height={layout.height}
                rx={12}
                fill={allDone ? "#0f1a0f" : "#111114"}
                stroke={allDone ? "#1e3a2a" : "#1e1e24"}
                strokeWidth={1}
              />

              {/* Block title */}
              <text
                x={layout.width / 2}
                y={28}
                textAnchor="middle"
                fill={allDone ? "#4ade80" : "#a1a1aa"}
                fontSize={12}
                fontWeight={600}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {block.icon} {block.title}
              </text>

              {/* Topic nodes */}
              {block.topics.map((topic, i) => {
                const row = Math.floor(i / MAX_PER_ROW);
                const col = i % MAX_PER_ROW;
                const topicsInThisRow = row === 0
                  ? Math.min(block.topics.length, MAX_PER_ROW)
                  : block.topics.length - MAX_PER_ROW;
                const rowWidth = topicsInThisRow * NODE_GAP;
                const rowStartX = (layout.width - rowWidth) / 2 + NODE_GAP / 2;

                const cx = rowStartX + col * NODE_GAP;
                const cy = BLOCK_PADDING_TOP + row * ROW_HEIGHT + NODE_RADIUS;

                const isDone = completed.has(topic.id);
                const isSelected = selectedTopicId === topic.id;

                return (
                  <g key={topic.id}>
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={NODE_RADIUS}
                      fill={isDone ? "#4ade80" : isSelected ? "#22d3ee" : "#18181b"}
                      stroke={isDone ? "#4ade80" : isSelected ? "#22d3ee" : "#27272a"}
                      strokeWidth={isSelected ? 2 : 1}
                      className="cursor-pointer"
                      onClick={() => onSelectTopic(topic.id)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <text
                      x={cx}
                      y={cy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isDone ? "#000" : "#a1a1aa"}
                      fontSize={9}
                      fontWeight={500}
                      fontFamily="Inter, system-ui, sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {topic.id}
                    </text>
                    {/* Tooltip on hover */}
                    <title>{topic.title}</title>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RoadmapGraph.tsx
git commit -m "feat: add SVG roadmap graph with block clusters, node states, and connectors"
```

---

## Chunk 5: Topic Detail — Content Tabs

### Task 9: LearnTab Component

**Files:**
- Create: `src/components/LearnTab.tsx`

- [ ] **Step 1: Create LearnTab**

Create `src/components/LearnTab.tsx`:

```tsx
"use client";

import { TopicContent } from "@/lib/types";

interface LearnTabProps {
  content: TopicContent;
}

export default function LearnTab({ content }: LearnTabProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="p-4 rounded-lg bg-[#111827] border border-[#1e3a2a] border-l-[3px] border-l-accent-green">
        <div className="text-[10px] text-accent-green tracking-[2px] uppercase mb-2">
          Summary
        </div>
        <p className="text-[13px] leading-[1.8] text-text-secondary">{content.summary}</p>
      </div>

      {/* Deep Dive */}
      <div>
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">
          Deep Dive
        </div>
        {content.deepDive
          .split("\n")
          .filter((p) => p.trim())
          .map((para, i) => (
            <p
              key={i}
              className="text-[13px] leading-[1.85] text-text-secondary mb-3.5"
            >
              {para}
            </p>
          ))}
      </div>

      {/* Interview Tip */}
      {content.tip && (
        <div className="p-4 rounded-lg bg-[#12121a] border border-[#2d2d45] border-l-[3px] border-l-accent-amber">
          <div className="text-[10px] text-accent-amber tracking-[2px] uppercase mb-2">
            Interview Tip
          </div>
          <p className="text-[13px] leading-[1.7] text-text-secondary">{content.tip}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LearnTab.tsx
git commit -m "feat: add LearnTab with summary, deep dive, and interview tip"
```

---

### Task 10: CodeTab + CodePlayground Components

**Files:**
- Create: `src/components/CodeTab.tsx`
- Create: `src/components/CodePlayground.tsx`

- [ ] **Step 1: Create CodePlayground component**

Create `src/components/CodePlayground.tsx`:

```tsx
"use client";

import { useState } from "react";

interface CodePlaygroundProps {
  initialCode: string;
}

export default function CodePlayground({ initialCode }: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch {
      setOutput("Failed to execute. Try copying to your IDE.");
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-text-muted tracking-[2px] uppercase">
          Playground
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-[11px] rounded border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="px-3 py-1 text-[11px] rounded bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50"
          >
            {running ? "Running..." : "▶ Run"}
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full h-48 p-4 bg-[#0d0d10] border border-border rounded-lg font-mono text-[12px] leading-[1.8] text-accent-green resize-y focus:outline-none focus:border-accent-cyan/50"
      />
      {output !== null && (
        <div className="mt-2 p-3 bg-[#0d0d10] border border-border rounded-lg">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
            Output
          </div>
          <pre className="font-mono text-[12px] text-text-secondary whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create CodeTab component with Shiki highlighting**

Create `src/components/CodeTab.tsx`:

```tsx
import { TopicContent } from "@/lib/types";
import CodePlayground from "./CodePlayground";

interface CodeTabProps {
  content: TopicContent;
  highlightedCode: string; // Pre-rendered HTML from Shiki (passed from server component)
}

export default function CodeTab({ content, highlightedCode }: CodeTabProps) {
  const fileName = content.title.replace(/[^a-zA-Z0-9]/g, "") + ".java";

  return (
    <div>
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">
        Java Example
      </div>

      {/* Static highlighted code */}
      <div className="rounded-lg overflow-hidden border border-border">
        {/* Mac-style title bar */}
        <div className="bg-bg-elevated px-4 py-2 flex items-center gap-2 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="text-[11px] text-text-muted ml-2">{fileName}</span>
        </div>
        <div
          className="p-5 bg-[#0d0d10] overflow-x-auto text-[12px] leading-[1.8] [&_pre]:!bg-transparent [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>

      {/* Editable playground */}
      <CodePlayground initialCode={content.code} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CodeTab.tsx src/components/CodePlayground.tsx
git commit -m "feat: add CodeTab with Shiki highlighting and editable CodePlayground"
```

---

### Task 11: InterviewTab with Spaced Repetition

**Files:**
- Create: `src/components/InterviewTab.tsx`

- [ ] **Step 1: Create InterviewTab**

Create `src/components/InterviewTab.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent, ProgressState } from "@/lib/types";

interface InterviewTabProps {
  content: TopicContent;
  progress: ProgressState;
  onRate: (questionId: string, quality: number) => void;
}

const DIFFICULTY_COLORS = {
  junior: "text-accent-green",
  mid: "text-accent-amber",
  senior: "text-accent-red",
};

const RATING_BUTTONS = [
  { label: "Again", quality: 0, color: "bg-accent-red/10 border-accent-red/30 text-accent-red" },
  { label: "Hard", quality: 3, color: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber" },
  { label: "Good", quality: 4, color: "bg-accent-green/10 border-accent-green/30 text-accent-green" },
  { label: "Easy", quality: 5, color: "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" },
];

export default function InterviewTab({ content, progress, onRate }: InterviewTabProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [rated, setRated] = useState<Set<string>>(new Set());

  const revealAnswer = (idx: number) => {
    setRevealed((prev) => new Set(prev).add(idx));
  };

  const handleRate = (questionId: string, quality: number) => {
    onRate(questionId, quality);
    setRated((prev) => new Set(prev).add(questionId));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
        Click to reveal answers — then rate your confidence
      </div>
      {content.interviewQs.map((item, idx) => {
        const isRevealed = revealed.has(idx);
        const isRated = rated.has(item.id);
        const srCard = progress.srState[item.id];

        return (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden border border-border bg-bg-card"
          >
            {/* Question */}
            <div className="p-4 flex gap-3 items-start">
              <span className="text-accent-green text-xs flex-shrink-0 mt-0.5">
                Q{idx + 1}.
              </span>
              <div className="flex-1">
                <p className="text-[13px] text-text-primary leading-relaxed">
                  {item.q}
                </p>
                <span className={`text-[10px] mt-1 inline-block ${DIFFICULTY_COLORS[item.difficulty]}`}>
                  {item.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Reveal button or answer */}
            {!isRevealed ? (
              <button
                onClick={() => revealAnswer(idx)}
                className="w-full py-2.5 border-t border-border bg-bg-elevated text-text-muted text-[11px] tracking-wider hover:text-text-secondary hover:bg-[#1c1c22] transition-colors"
              >
                ▶ REVEAL ANSWER
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-border"
                >
                  <div className="p-4 bg-[#0f1a0f]">
                    <span className="text-text-muted text-[11px] mr-2">A.</span>
                    <span className="text-[13px] text-[#86efac] leading-[1.7]">
                      {item.a}
                    </span>
                  </div>

                  {/* SR Rating buttons */}
                  {!isRated ? (
                    <div className="px-4 py-3 border-t border-border bg-bg-elevated flex items-center gap-2">
                      <span className="text-[10px] text-text-muted mr-2">Rate:</span>
                      {RATING_BUTTONS.map((btn) => (
                        <button
                          key={btn.quality}
                          onClick={() => handleRate(item.id, btn.quality)}
                          className={`px-3 py-1 text-[11px] rounded border ${btn.color} hover:opacity-80 transition-opacity`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-2 border-t border-border bg-bg-elevated text-[11px] text-text-muted">
                      Rated — {srCard ? `next review in ${srCard.interval} day(s)` : "saved"}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InterviewTab.tsx
git commit -m "feat: add InterviewTab with reveal animation and SR rating buttons"
```

---

### Task 12: SpringTab Component

**Files:**
- Create: `src/components/SpringTab.tsx`

- [ ] **Step 1: Create SpringTab**

Create `src/components/SpringTab.tsx`:

```tsx
import { TopicContent } from "@/lib/types";

interface SpringTabProps {
  content: TopicContent;
}

export default function SpringTab({ content }: SpringTabProps) {
  if (!content.springConnection) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-3xl mb-3">🌱</div>
        <p className="text-text-muted text-sm max-w-sm leading-relaxed">
          This is a foundational Java topic. Spring connections appear in later,
          more advanced blocks where these fundamentals are applied.
        </p>
      </div>
    );
  }

  const { concept, springFeature, explanation } = content.springConnection;

  return (
    <div className="flex flex-col gap-5">
      {/* Connection visual */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-bg-card border border-border">
        <div className="flex-1 text-center p-3 rounded bg-bg-elevated border border-border">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
            Java
          </div>
          <div className="text-sm font-semibold text-accent-cyan">{concept}</div>
        </div>
        <div className="text-accent-green text-lg">→</div>
        <div className="flex-1 text-center p-3 rounded bg-bg-elevated border border-border">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
            Spring
          </div>
          <div className="text-sm font-semibold text-accent-green">{springFeature}</div>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">
          How They Connect
        </div>
        {explanation
          .split("\n")
          .filter((p) => p.trim())
          .map((para, i) => (
            <p
              key={i}
              className="text-[13px] leading-[1.85] text-text-secondary mb-3.5"
            >
              {para}
            </p>
          ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SpringTab.tsx
git commit -m "feat: add SpringTab with Java-to-Spring connection visual and explanation"
```

---

## Chunk 6: Ask Deeper, API Routes, Topic Detail Page & Tab Container

### Task 13: AskDeeper Component

**Files:**
- Create: `src/components/AskDeeper.tsx`

Note: AskDeeper must be created BEFORE the Topic page (Task 16) because TopicClient.tsx imports it.

- [ ] **Step 1: Create AskDeeper floating input**

Use the same code as originally specified in Task 15 (now moved here). See AskDeeper.tsx code below in this chunk.

- [ ] **Step 2: Commit**

```bash
git add src/components/AskDeeper.tsx
git commit -m "feat: add AskDeeper floating chat with 3-followup limit and timeout handling"
```

---

### Task 14: API Routes (Ask Deeper + Code Run)

**Files:**
- Create: `src/app/api/ask/route.ts`
- Create: `src/app/api/run/route.ts` (addition beyond spec architecture — needed for JDoodle playground)

Note: API routes must exist before components that call them can be fully tested.

- [ ] **Step 1: Create Claude proxy API route**

Use the `/api/ask/route.ts` code as specified.

- [ ] **Step 2: Create JDoodle proxy API route**

Use the `/api/run/route.ts` code as specified.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/
git commit -m "feat: add API routes for Claude proxy and JDoodle code execution"
```

---

### Task 15: TopicContent Tab Container

**Files:**
- Create: `src/components/TopicContent.tsx`

- [ ] **Step 1: Create TopicContent tab container**

Create `src/components/TopicContent.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import LearnTab from "./LearnTab";
import CodeTab from "./CodeTab";
import InterviewTab from "./InterviewTab";
import SpringTab from "./SpringTab";

interface TopicContentProps {
  content: TopicContentType;
  blockTitle: string;
  isDone: boolean;
  highlightedCode: string;
  progress: ProgressState;
  onMarkDone: () => void;
  onRate: (questionId: string, quality: number) => void;
}

const TABS = [
  { id: "learn", label: "📖 Learn" },
  { id: "code", label: "💻 Code" },
  { id: "interview", label: "🎯 Interview" },
  { id: "spring", label: "🌱 Spring" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TopicContentView({
  content,
  blockTitle,
  isDone,
  highlightedCode,
  progress,
  onMarkDone,
  onRate,
}: TopicContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("learn");

  return (
    <div className="flex-1 overflow-auto p-7 max-w-[860px]">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[11px] text-accent-green tracking-[2px] uppercase mb-1.5">
          {blockTitle}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">{content.title}</h1>
          <button
            onClick={onMarkDone}
            className={`px-4 py-1.5 rounded-md text-xs font-medium border transition-all
              ${isDone
                ? "border-accent-green text-accent-green bg-accent-green/10"
                : "border-border text-text-muted hover:border-text-muted hover:text-text-secondary"
              }
            `}
          >
            {isDone ? "✓ Done" : "Mark done"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs transition-all border-b-2 -mb-px
              ${activeTab === tab.id
                ? "text-accent-green border-accent-green"
                : "text-text-muted border-transparent hover:text-text-secondary"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "learn" && <LearnTab content={content} />}
          {activeTab === "code" && (
            <CodeTab content={content} highlightedCode={highlightedCode} />
          )}
          {activeTab === "interview" && (
            <InterviewTab content={content} progress={progress} onRate={onRate} />
          )}
          {activeTab === "spring" && <SpringTab content={content} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TopicContent.tsx
git commit -m "feat: add TopicContent tab container with animated tab switching"
```

---

### Task 16: Topic Detail Page (Server Component with Shiki)

**Files:**
- Create: `src/app/topic/[id]/page.tsx`
- Create: `src/app/topic/[id]/TopicClient.tsx`

- [ ] **Step 1: Create the server component for Shiki highlighting**

Create `src/app/topic/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { ROADMAP } from "@/data/roadmap";
import { getTopicContent } from "@/data/content";
import { getTopic } from "@/data/roadmap";
import TopicClient from "./TopicClient";

// Generate static params for all 58 topics
export async function generateStaticParams() {
  return ROADMAP.flatMap((block) =>
    block.topics.map((topic) => ({ id: topic.id }))
  );
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = getTopic(id);
  if (!meta) notFound();

  const content = await getTopicContent(id);
  if (!content) notFound();

  // Highlight code with Shiki at build time
  const highlightedCode = await codeToHtml(content.code, {
    lang: "java",
    theme: "github-dark-dimmed",
  });

  return (
    <TopicClient
      content={content}
      blockTitle={meta.block.title}
      highlightedCode={highlightedCode}
    />
  );
}
```

- [ ] **Step 2: Create the client wrapper**

Create `src/app/topic/[id]/TopicClient.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { loadProgress, saveProgress, toggleComplete } from "@/lib/progress";
import { updateSRState, getDueCards } from "@/lib/spaced-repetition";
import Sidebar from "@/components/Sidebar";
import TopicContentView from "@/components/TopicContent";
import AskDeeper from "@/components/AskDeeper";

interface TopicClientProps {
  content: TopicContentType;
  blockTitle: string;
  highlightedCode: string;
}

export default function TopicClient({
  content,
  blockTitle,
  highlightedCode,
}: TopicClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completed = new Set(progress.completed);
  const dueCount = getDueCards(progress).length;

  const handleMarkDone = () => {
    setProgress((prev) => toggleComplete(prev, content.id));
  };

  const handleRate = (questionId: string, quality: number) => {
    setProgress((prev) => updateSRState(prev, questionId, quality));
  };

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        completed={completed}
        selectedTopicId={content.id}
        dueCount={dueCount}
        onSelectTopic={handleSelectTopic}
        onReviewClick={() => router.push("/")}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopicContentView
          content={content}
          blockTitle={blockTitle}
          isDone={completed.has(content.id)}
          highlightedCode={highlightedCode}
          progress={progress}
          onMarkDone={handleMarkDone}
          onRate={handleRate}
        />
        <AskDeeper topicTitle={content.title} content={content} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/topic/
git commit -m "feat: add topic detail page with server-side Shiki highlighting"
```

---

## Chunk 7: Landing Page

### Task 17: Landing Page with Roadmap + Review Section

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/HomeClient.tsx`

- [ ] **Step 1: Create HomeClient with roadmap and sidebar wired together**

Create `src/app/HomeClient.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressState } from "@/lib/types";
import { loadProgress, saveProgress } from "@/lib/progress";
import { getDueCards } from "@/lib/spaced-repetition";
import Sidebar from "@/components/Sidebar";
import RoadmapGraph from "@/components/RoadmapGraph";

export default function HomeClient() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const completed = new Set(progress.completed);
  const dueCards = getDueCards(progress);

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        completed={completed}
        selectedTopicId={null}
        dueCount={dueCards.length}
        onSelectTopic={handleSelectTopic}
        onReviewClick={() => setShowReview(!showReview)}
      />
      <main className="flex-1 overflow-auto">
        {showReview && dueCards.length > 0 ? (
          <div className="p-8 max-w-[700px] mx-auto">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              🔄 Cards Due for Review
            </h2>
            <div className="space-y-3">
              {dueCards.map((card) => {
                const topicId = card.questionId.split("-q")[0];
                return (
                  <button
                    key={card.questionId}
                    onClick={() => router.push(`/topic/${topicId}`)}
                    className="w-full text-left p-4 rounded-lg bg-bg-card border border-border hover:border-accent-amber/50 transition-colors"
                  >
                    <div className="text-sm text-text-secondary">
                      {card.questionId}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      Due: {card.nextReview} · Interval: {card.interval}d
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="text-center pt-12 pb-4">
              <div className="text-5xl mb-4">☕</div>
              <h1 className="text-2xl font-bold text-text-primary">
                Java Core — Interview Prep
              </h1>
              <p className="text-sm text-text-muted mt-2 max-w-md mx-auto leading-relaxed">
                Click any topic node to start learning. Your progress is saved automatically.
              </p>
              {progress.streak > 0 && (
                <div className="mt-3 text-xs text-accent-amber">
                  🔥 {progress.streak} day streak
                </div>
              )}
            </div>
            <RoadmapGraph
              completed={completed}
              selectedTopicId={null}
              onSelectTopic={handleSelectTopic}
            />
          </>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Update the landing page to use HomeClient**

Replace `src/app/page.tsx`:

```tsx
import HomeClient from "./HomeClient";

export default function Home() {
  return <HomeClient />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/app/HomeClient.tsx
git commit -m "feat: add landing page with visual roadmap, review section, and streak counter"
```

---

## Chunk 8: Polish, Responsive, and Final Integration

### Task 18: Responsive Design

**Files:**
- Modify: `src/components/Sidebar.tsx` — add mobile drawer behavior
- Modify: `src/app/HomeClient.tsx` — add mobile menu button

- [ ] **Step 1: Add mobile drawer support to Sidebar**

In `src/components/Sidebar.tsx`, add a `mobile` prop:

Add to the `SidebarProps` interface:
```typescript
  mobile?: boolean;
  onClose?: () => void;
```

Wrap the aside in a mobile overlay when `mobile` is true:
- On mobile: render as fixed overlay with backdrop
- On desktop: render as regular flex aside

This is a modification step — update the component to handle both desktop (inline aside) and mobile (overlay drawer) modes. The parent components (`HomeClient`, `TopicClient`) should detect screen width via a `useMediaQuery` hook and pass `mobile={true}` on screens < 768px, along with a toggle button in the header.

- [ ] **Step 2: Create useMediaQuery hook**

Create `src/lib/use-media-query.ts`:

```typescript
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.tsx src/lib/use-media-query.ts src/app/HomeClient.tsx
git commit -m "feat: add responsive design with mobile drawer sidebar"
```

---

### Task 19: Final Wiring — Verify Full Flow

- [ ] **Step 1: Run the dev server**

```bash
cd /Users/aidarkazybekov/DEV/java-core
npm run dev
```

- [ ] **Step 2: Verify these flows work**

1. Landing page loads with roadmap graph
2. Click a topic node → navigates to `/topic/1-1`
3. Learn tab shows summary, deep dive, tip
4. Code tab shows syntax-highlighted code + playground
5. Interview tab shows Q&A cards with reveal + SR rating
6. Spring tab shows connection or fallback message
7. Ask Deeper sends question and shows response
8. Mark done toggles completion, updates sidebar and roadmap
9. Progress persists across page refreshes (localStorage)
10. Sidebar collapses and expands

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Java Core Interview Prep Platform MVP"
```

---

## Task Dependency Graph

```
Task 1 (Next.js setup)
  └── Task 2 (Types + roadmap data)
        ├── Task 3 (Progress + SR libs)
        ├── Task 4 (All 58 content files) ← largest task, parallelizable per block
        ├── Task 5 (ProgressBar)
        ├── Task 6 (ProgressRing)
        ├── Task 7 (Sidebar) ← depends on 2, 5, 6
        ├── Task 8 (RoadmapGraph) ← depends on 2 (sibling of 7, NOT dependent on it)
        ├── Task 9 (LearnTab) ← depends on 2
        ├── Task 10 (CodeTab + Playground) ← depends on 2
        ├── Task 11 (InterviewTab) ← depends on 2, 3
        ├── Task 12 (SpringTab) ← depends on 2
        ├── Task 13 (AskDeeper) ← depends on 2
        └── Task 14 (API routes) ← depends on 1 only

  Task 15 (TopicContent container) ← depends on 9, 10, 11, 12
  Task 16 (Topic page) ← depends on 4, 13, 14, 15
  Task 17 (Landing page) ← depends on 7, 8
  Task 18 (Responsive) ← depends on 7, 16, 17
  Task 19 (Final verification) ← depends on everything
```

**Parallelizable tasks:** Tasks 3-14 can all be built in parallel once Task 2 is done. Task 4 (content) can be split across 10 parallel subagents (one per block). Tasks 5-13 are all independent leaf components.
