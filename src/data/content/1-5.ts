import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-5",
  blockId: 1,
  title: "JIT Compilation",
  summary:
    "JIT (Just-In-Time) компилятор -- это то, что делает Java быстрой. Он отслеживает часто выполняемые участки кода ('горячий' код) и компилирует их в оптимизированный нативный машинный код во время выполнения. Именно поэтому Java-приложения ускоряются со временем -- явление, называемое 'прогревом' (warm-up).\n\n---\n\n" +
    "The JIT (Just-In-Time) compiler is what makes Java fast despite being interpreted. It monitors which code paths are executed frequently ('hot' code) and compiles them to optimized native machine code at runtime. This is why Java applications get faster over time — a phenomenon called 'warm-up'.",
  deepDive:
    "JVM исполняет байт-код, но чистая интерпретация медленная. JIT-компилятор решает эту проблему: он профилирует выполнение, находит 'горячие' методы и компилирует их в нативный машинный код. HotSpot JVM использует многоуровневую компиляцию: интерпретатор (Level 0), C1 компилятор (Levels 1-3, быстрая компиляция) и C2 компилятор (Level 4, агрессивные оптимизации: inlining, escape analysis, lock elision). Деоптимизация -- откат к интерпретации при нарушении спекулятивных предположений JIT.\n\n---\n\n" +
    "The HotSpot JVM uses a tiered compilation strategy with five levels. Initially, code is interpreted (Level 0 — no compilation overhead, slow execution). As methods are called repeatedly, they are first compiled by C1 (Client Compiler, Levels 1-3) which does quick optimizations. Methods that become truly hot are then recompiled by C2 (Server Compiler, Level 4) which applies aggressive optimizations like inlining, loop unrolling, escape analysis, and dead code elimination. This tiered approach balances startup speed with peak throughput.\n\n" +
    "The JIT uses On-Stack Replacement (OSR) to optimize long-running loops. If a method contains a hot loop, the JIT can compile the method and transfer execution from the interpreter to the compiled code mid-loop — without waiting for the method to be called again. This is essential for applications that spend most of their time in tight loops.\n\n" +
    "Key JIT optimizations you should know: Method inlining replaces a method call with the method body, eliminating call overhead and enabling further optimizations. Escape Analysis determines whether an object is referenced outside its creating method — if it does not escape, the JVM can allocate it on the stack instead of the heap (scalar replacement), eliminating GC pressure entirely. Lock elision removes synchronization on objects that escape analysis proves are thread-local. Speculative optimization uses profiling data to make assumptions (e.g., 'this virtual call always targets ArrayList.add()') and generates fast code for the common case, with a deoptimization trap if the assumption fails.\n\n" +
    "Deoptimization is the JIT's safety net. When a speculative assumption is invalidated (new class loaded that changes the class hierarchy, a rarely-taken branch is finally taken), the JVM deoptimizes: it discards the compiled code and falls back to interpreted execution. This can cause sudden, temporary performance drops in production — visible as latency spikes.\n\n" +
    "Warm-up is a critical concern for microservices. A freshly started JVM runs everything through the interpreter, and JIT compilation itself consumes CPU. This is why the first few hundred requests to a Spring Boot service are significantly slower than steady-state. Solutions include: warm-up scripts that exercise hot paths before accepting traffic, Class Data Sharing (CDS/AppCDS) to speed up class loading, and AOT compilation (GraalVM native-image or OpenJDK's jaotc) to eliminate JIT warm-up entirely.",
  code:
    `// Demonstrating JIT warm-up and its impact on performance
public class JitWarmupDemo {
    public static void main(String[] args) {
        // Run with: java -XX:+PrintCompilation JitWarmupDemo
        // to see JIT compilation events in real time

        int iterations = 100_000;
        long[] times = new long[5];

        // Run the benchmark 5 times — watch performance improve
        for (int round = 0; round < 5; round++) {
            long start = System.nanoTime();

            long sum = 0;
            for (int i = 0; i < iterations; i++) {
                sum += complexCalculation(i);
            }

            times[round] = System.nanoTime() - start;
            System.out.printf("Round %d: %,d ns (sum=%d)%n",
                round, times[round], sum);
        }

        System.out.printf("%nSpeedup from round 0 to round 4: %.1fx%n",
            (double) times[0] / times[4]);

        // Demonstrate escape analysis
        System.out.println("\\n=== Escape Analysis Demo ===");
        escapeAnalysisDemo();
    }

    // This method will get inlined by C2 after enough calls
    private static long complexCalculation(int n) {
        // Object that does NOT escape — JIT can eliminate the allocation
        // entirely via scalar replacement (escape analysis)
        long[] pair = new long[]{n * 2L, n * 3L};
        return pair[0] + pair[1];
    }

    // Demonstrating the effect of escape analysis on allocation
    private static void escapeAnalysisDemo() {
        // Warm up
        for (int i = 0; i < 100_000; i++) {
            createPointNoEscape(i, i);
        }

        // Measure allocation-heavy code after JIT kicks in
        Runtime rt = Runtime.getRuntime();
        System.gc();
        long memBefore = rt.totalMemory() - rt.freeMemory();

        long sum = 0;
        for (int i = 0; i < 1_000_000; i++) {
            sum += createPointNoEscape(i, i);
        }

        long memAfter = rt.totalMemory() - rt.freeMemory();
        System.out.println("Sum: " + sum);
        System.out.printf("Memory delta: %,d bytes%n", memAfter - memBefore);
        System.out.println("(If close to 0, escape analysis eliminated allocations)");
    }

    // Point object that does not escape this method
    // JIT's escape analysis can replace this with scalar values on the stack
    private static long createPointNoEscape(int x, int y) {
        int[] point = new int[]{x, y}; // candidate for scalar replacement
        return point[0] + point[1];
    }
}`,
  interviewQs: [
    {
      id: "1-5-q0",
      q: "What is JIT compilation and why does Java need it?",
      a: "JIT (Just-In-Time) compilation converts frequently executed bytecode into native machine code at runtime. Java needs it because bytecode interpretation alone is slow — about 10-50x slower than native code. The JIT monitors execution, identifies 'hot' methods and loops, and compiles them to optimized native code. This gives Java near-native performance while preserving platform independence (bytecode is portable, and the JIT generates the right native code for the current platform). The trade-off is warm-up time: an application is slow initially while the JIT profiles and compiles hot code.",
      difficulty: "junior",
    },
    {
      id: "1-5-q1",
      q: "What is escape analysis and how does it optimize Java code?",
      a: "Escape analysis is a JIT optimization that determines whether an object's lifetime is confined to a single method or thread. If an object does not 'escape' the method (no reference to it is stored in a field or returned), the JIT can: (1) perform scalar replacement — decompose the object into its fields as local variables on the stack, eliminating heap allocation entirely, (2) eliminate synchronization on the object since no other thread can access it (lock elision), and (3) potentially eliminate the allocation altogether if the object's data is not used. This is why creating small, short-lived objects in Java is effectively free in optimized code — the JIT eliminates the allocation overhead.",
      difficulty: "mid",
    },
    {
      id: "1-5-q2",
      q: "Explain tiered compilation, deoptimization, and how they affect production microservices.",
      a: "Tiered compilation uses 5 levels: L0 (interpreter), L1-L3 (C1 compiler with increasing profiling), L4 (C2 compiler with aggressive optimizations). Code starts interpreted, gets C1-compiled quickly for moderate speedup, and hot methods eventually get C2-compiled for peak performance. Deoptimization occurs when the JIT's speculative assumptions are invalidated (e.g., a new subclass is loaded that breaks a monomorphic call site assumption). The JVM discards the compiled code and falls back to interpretation, causing latency spikes. For microservices, this means: (1) the first 30-60 seconds of traffic will be significantly slower (warm-up), affecting p99 latencies and health check timing, (2) class loading during normal operation can trigger deoptimization spikes, (3) solutions include warm-up request scripts before receiving real traffic, AppCDS to speed class loading, -XX:+AlwaysPreTouch to pre-commit memory pages, and potentially GraalVM native-image to eliminate warm-up entirely at the cost of lower peak throughput.",
      difficulty: "senior",
    },
  ],
  tip: "Java НЕ медленная. После прогрева JIT-скомпилированный код может сравняться или превзойти производительность C++ в некоторых задачах, потому что JIT использует данные профилирования, недоступные статическому компилятору.\n\n---\n\n" +
    "Java is NOT slow. After warm-up, JIT-compiled Java code can match or exceed C++ performance in some workloads because the JIT uses runtime profiling data that a static compiler does not have.",
  springConnection: {
    concept: "JIT warm-up and startup time",
    springFeature: "Spring Boot AOT & GraalVM Native Image",
    explanation:
      "Spring Boot 3 introduced AOT (Ahead-of-Time) processing that generates optimized code at build time. Combined with GraalVM native-image, it eliminates JIT warm-up entirely — the application starts in milliseconds instead of seconds. The trade-off: no runtime optimization means peak throughput may be lower than a warmed-up JVM. Spring Boot's CDS (Class Data Sharing) support offers a middle ground — it speeds up class loading and reduces warm-up without sacrificing JIT peak performance.",
  },
};
