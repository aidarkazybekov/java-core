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

export type TopicMeta = {
  id: string;
  title: string;
  prerequisites?: string[];
};
