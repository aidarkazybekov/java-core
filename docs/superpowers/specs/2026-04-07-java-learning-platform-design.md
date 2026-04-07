# Java Core Interview Prep Platform — Design Spec

## Overview

An interactive web application for learning Java fundamentals and preparing for technical interviews. Combines a visual roadmap, pre-loaded expert content, a code playground, spaced repetition for interview questions, and Spring framework connections — all in a polished dark-themed UI.

**Target user:** Backend developer with ~3 years Spring Boot experience, shaky Java fundamentals, preparing for senior-level interviews.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSG for pre-loaded content, API routes for AI proxy |
| Styling | Tailwind CSS | Rapid iteration, consistent design tokens |
| Animation | Framer Motion | Smooth layout transitions, node graph animations |
| Code Editor | Shiki (syntax highlighting) | Server-side rendering support, accurate Java highlighting |
| State | localStorage + React state | No backend needed for MVP; progress persists across sessions |
| AI Proxy | Next.js API route `/api/ask` | Keeps API key server-side, proxies to Claude |

## Architecture

```
src/
  app/
    layout.tsx              # Root layout, fonts, theme
    page.tsx                # Landing — visual roadmap view
    topic/[id]/page.tsx     # Topic detail page (Learn/Code/Interview/Spring tabs)
    api/ask/route.ts        # Claude API proxy for "Ask Deeper"
  components/
    Sidebar.tsx             # Collapsible tree navigation with progress rings
    RoadmapGraph.tsx        # SVG node graph visualization
    TopicContent.tsx        # Tab container for topic detail
    LearnTab.tsx            # Summary + deep dive + interview tip
    CodeTab.tsx             # Syntax-highlighted code + playground
    InterviewTab.tsx        # Q&A cards with spaced repetition controls
    SpringTab.tsx           # Java → Spring connection callouts
    ProgressBar.tsx         # Global + per-block progress
    AskDeeper.tsx           # AI chat input for follow-up questions
    CodePlayground.tsx      # Editable code area with run/output
  data/
    roadmap.ts              # Block and topic metadata (IDs, titles, icons, prerequisites)
    content/
      1-1.ts ... 10-5.ts    # 58 pre-loaded topic content files
  lib/
    spaced-repetition.ts    # SM-2 algorithm implementation
    progress.ts             # localStorage read/write for completion state
    types.ts                # Shared TypeScript types
  styles/
    globals.css             # Tailwind base + custom properties
```

## Data Model

### Topic Content (pre-loaded, per file)

```typescript
interface TopicContent {
  id: string;                    // e.g., "1-1"
  blockId: number;               // e.g., 1
  title: string;                 // e.g., "JVM Architecture"
  summary: string;               // 2-3 sentence plain-English explanation
  deepDive: string;              // 3-5 paragraphs, markdown-formatted
  code: string;                  // Runnable Java example
  interviewQs: InterviewQuestion[];
  tip: string;                   // One memorable differentiator
  springConnection: {
    concept: string;             // e.g., "Proxy Pattern"
    springFeature: string;       // e.g., "@Transactional, Spring AOP"
    explanation: string;         // How they connect
  } | null;                      // null for topics without Spring relevance
}

interface InterviewQuestion {
  id: string;                    // Stable ID: "{topicId}-q{0-based-index}" — must not reorder after launch
  q: string;
  a: string;
  difficulty: "junior" | "mid" | "senior";
}
```

### Progress State (localStorage)

```typescript
interface ProgressState {
  completed: string[];           // Topic IDs marked done
  srState: Record<string, SRCard>; // Spaced repetition per question
  lastVisited: string | null;    // Last topic ID viewed
  streak: number;                // Consecutive days with activity
  lastActiveDate: string;        // ISO date string
}

interface SRCard {
  questionId: string;            // "{topicId}-q{index}"
  interval: number;              // Days until next review
  easeFactor: number;            // SM-2 ease factor
  nextReview: string;            // ISO date
  repetitions: number;
}
```

### Roadmap Metadata

```typescript
interface Block {
  id: number;
  icon: string;
  title: string;
  topics: TopicMeta[];
}

interface TopicMeta {
  id: string;
  title: string;
  prerequisites?: string[];      // Topic IDs that should be done first
}
```

## Layout & Navigation

### Two-Zone Layout (Sidebar + Main)

```
+------------------+--------------------------------+
|                  |                                |
|    Sidebar       |     Main Area                  |
|    (280px,       |     (flex-1)                   |
|     collapsible) |                                |
|                  |     Default: Visual Roadmap     |
|    - Tree nav    |     On topic select: Content    |
|    - Progress    |                                |
|    - Quick jump  |                                |
|                  |                                |
+------------------+--------------------------------+
```

**Sidebar** (always accessible):
- Collapsible via hamburger icon (collapses to icon-only 56px strip)
- Tree structure: blocks as expandable sections, topics as leaves
- Per-block progress ring (circular SVG, fills as topics complete)
- Global progress bar at top
- Active topic highlighted with green accent border

**Main Area — Roadmap View** (default):
- SVG-based node graph
- 10 block clusters arranged top-to-bottom
- Topics as circular nodes within each cluster
- Lines connecting blocks showing progression path
- Node states: grey (not started), blue pulse (in progress), green (completed)
- Click node to navigate to topic detail
- Scrollable within its container (zoom/pan deferred to post-MVP)

**Main Area — Topic Detail** (when topic selected):
- Breadcrumb: Block name > Topic name
- "Mark done" button top-right
- Four tabs: Learn | Code | Interview | Spring
- "Ask Deeper" floating input at bottom

## Feature Details

### 1. Visual Roadmap Graph

SVG rendered with React components (not a library dependency). Each block is a group:

- Block label (icon + title) centered above its topic nodes
- Topic nodes arranged in a row (up to 5 per row; 6+ topics wrap into a 2-row grid with 16px gap)
- Connector lines between blocks (vertical flow, top to bottom)
- Smooth color transitions when marking topics complete
- On hover: topic title tooltip
- On click: navigate to `/topic/[id]`

Node sizing: 40px diameter circles. Block clusters have subtle background cards.

### 2. Code Playground

CodeTab.tsx renders the static example via Shiki and embeds CodePlayground.tsx for the editable area.

1. **Static example** — pre-loaded, syntax-highlighted Java code (Shiki, server-rendered)
2. **Editable playground** — plain textarea below the static example (no client-side syntax highlighting for MVP)
3. **"Run" button** — sends code to JDoodle API (free tier: ~200 executions/day, sufficient for personal use). Requires env vars `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET`.
4. **"Copy to clipboard" button** — always available as fallback

The playground is optional — static examples work standalone.

### 3. Spaced Repetition System

Implementation of the SM-2 algorithm:

- After revealing an answer, user rates: "Again" (0), "Hard" (3), "Good" (4), "Easy" (5)
- Rating updates interval and ease factor per SM-2
- Questions due for review surface in a "Review" section on the landing page
- Badge counter on sidebar shows how many questions are due today
- All state in localStorage — no account needed

MVP review UI: a "N cards due for review" badge on the sidebar. Clicking it shows a flat list of due cards on the landing page (embedded section, not a separate route). Full review dashboard with charts and weak-topic analysis deferred to post-MVP.

### 4. Spring Connections

A fourth tab on each topic that shows:
- **Java concept** (left) → **Spring feature** (right) with an arrow
- 2-3 paragraph explanation of how the Java internal powers the Spring abstraction
- Real-world example: "When your @Cacheable method returns stale data, understanding HashMap's resize behavior explains why"

Topics without Spring relevance (e.g., "Arrays", "Control Flow") show a message: "This is a foundational topic. Spring connections appear in later blocks."

### 5. Ask Deeper (AI Feature)

A floating input bar at the bottom of topic detail:
- Placeholder: "Ask a follow-up question about {topic.title}..."
- Sends to `/api/ask` which proxies to Claude with context:
  - System prompt (Java interview tutor role)
  - Context: `summary` + `deepDive` (truncated to 2000 chars if needed) + `tip`
  - Prior Q&A pairs from this session included in conversation history
  - User's question
- Response renders as a chat bubble above the input
- Limited to 3 follow-ups per topic to manage API costs (configurable, stored in component state)
- Error handling: 15-second timeout, inline error message on failure ("Couldn't reach AI — try again"), graceful handling of missing/invalid API key (shows setup instructions)

### 6. Progress System

- **Global progress bar** — top of sidebar, percentage + fraction
- **Per-block progress rings** — circular SVG next to each block title
- **Streak counter** — consecutive days with at least one topic marked done OR one SR review completed. Date comparison uses browser's local date.
- All persisted to localStorage

## Design Language

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#09090b` | Page background |
| `--bg-card` | `#111114` | Card/sidebar background |
| `--bg-elevated` | `#18181b` | Hover states, elevated surfaces |
| `--border` | `#27272a` | Borders, dividers |
| `--text-primary` | `#fafafa` | Headings |
| `--text-secondary` | `#a1a1aa` | Body text |
| `--text-muted` | `#52525b` | Metadata, hints |
| `--accent-green` | `#4ade80` | Progress, completion, active states |
| `--accent-cyan` | `#22d3ee` | Interactive elements, links |
| `--accent-amber` | `#f59e0b` | Tips, warnings |
| `--accent-red` | `#f87171` | Errors, "Again" rating |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Inter | 20-28px | 700 |
| Body | Inter | 14px | 400 |
| Code | JetBrains Mono | 13px | 400 |
| Labels | Inter | 11px | 600, uppercase, tracked |
| Sidebar items | Inter | 13px | 500 |

### Animations (Framer Motion)

- Page transitions: slide + fade (200ms)
- Node completion: scale pulse (1 → 1.2 → 1) + color fill
- Tab switching: crossfade (150ms)
- Sidebar collapse: width transition (200ms)
- Card hover: subtle translateY(-2px) + shadow
- Skeleton loaders: shimmer gradient while AI content loads

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| >= 1280px | Full two-zone layout |
| 768-1279px | Sidebar collapsed by default, roadmap simplified |
| < 768px | Sidebar as drawer overlay, single-column content, roadmap as vertical list |

## Content Generation Plan

All 58 topics get pre-loaded content files. Structure per file:

1. **Summary** — What it is, why it matters (2-3 sentences)
2. **Deep dive** — Internals, gotchas, interview-relevant depth (3-5 paragraphs)
3. **Code example** — Real, runnable, well-commented Java
4. **Interview Qs** — 3 questions (1 junior, 1 mid, 1 senior difficulty)
5. **Tip** — One memorable differentiator
6. **Spring connection** — Where applicable

Content is generated by Claude during build, reviewed, and committed as static TypeScript files.

## Roadmap Blocks & Topics (58 total)

| # | Block | Topics |
|---|-------|--------|
| 1 | How Java Works | JVM Architecture, JDK vs JRE vs JVM, Bytecode & Compilation, ClassLoaders & Delegation, JIT Compilation |
| 2 | Language Basics | Primitive Types & Wrappers, Variables & Scope, Operators & Casting, Control Flow, Arrays |
| 3 | OOP | Classes & Objects, Constructors & this, Inheritance & super, Polymorphism, Interfaces vs Abstract Classes, Access Modifiers & static, SOLID Principles, Design Patterns |
| 4 | Core APIs | String & String Pool, StringBuilder vs StringBuffer, equals()/hashCode()/toString(), Math & Wrapper Classes |
| 5 | Exception Handling | Checked vs Unchecked, try/catch/finally, try-with-resources, Custom Exceptions, Exception Hierarchy |
| 6 | Collections & Generics | ArrayList vs LinkedList, HashMap Internals, HashSet/TreeSet/LinkedHashSet, ConcurrentHashMap, Generics & Type Erasure, Wildcards, Comparable vs Comparator |
| 7 | Streams & Lambdas | Functional Interfaces, Lambda Expressions, Method References, Stream API, Collectors, Optional, Parallel Streams |
| 8 | Concurrency | Thread Lifecycle, synchronized & volatile, Java Memory Model, ReentrantLock, ExecutorService, CompletableFuture, Deadlock & Thread Safety |
| 9 | JVM Internals & Memory | Heap: Young/Old/Metaspace, GC Algorithms, Stack vs Heap, Memory Leaks, GC Tuning Flags |
| 10 | I/O & NIO | InputStream/OutputStream, Reader/Writer, NIO Channels & Buffers, Path & Files API, Serialization |

## Scope Boundaries

**In scope (MVP):**
- All 58 topics with pre-loaded content
- Visual roadmap graph
- Sidebar tree navigation
- Four content tabs (Learn, Code, Interview, Spring)
- Code syntax highlighting
- Spaced repetition for interview Qs
- Progress tracking (localStorage)
- Ask Deeper AI feature (3 follow-ups per topic)
- Responsive design
- Dark theme

**Out of scope (future):**
- User accounts / cloud sync
- Actual Java code execution in browser (WebAssembly JVM)
- Spring learning section (Block 11+)
- Community features
- Mobile native app
- Analytics dashboard
