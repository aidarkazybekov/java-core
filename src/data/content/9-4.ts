import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "9-4",
  blockId: 9,
  title: "Memory Leaks",
  summary:
    "Java's garbage collector cannot reclaim objects that are still reachable. Memory leaks occur when objects accumulate unintentionally due to forgotten references, listener registrations, caches without eviction, or classloader retention. Detecting and fixing them requires profiling tools and disciplined resource management.",
  deepDive:
    "## Виды ссылок\n\nСуществует 4 вида ссылок, определенных в пакете java.lang.ref:\n\n- **Strong reference** -- обычные ссылки, которые мы ежедневно используем. Пока на объект есть сильная ссылка, GC его не удалит.\n\n- **Soft reference** (мягкая ссылка) -- объект может быть удален GC только при критической нехватке памяти, и то в последнюю очередь. Часто используется для кэширования: объект будет оставаться в памяти, пока системе не потребуется дополнительная память.\n\n- **Weak reference** (слабая ссылка) -- объект может быть очищен в любой момент, как только на него не останется сильных ссылок. Слабая ссылка никак не мешает GC удалить объект. Если объект будет удален, ссылка будет указывать на null.\n\n- **Phantom reference** (фантомная ссылка) -- объект считается недоступным для программы и будет удален GC, но прежде удаления он попадет в специальную очередь (ReferenceQueue). Обычно применяются в продвинутых механизмах управления ресурсами.\n\n## Утечки памяти\n\nGarbage Collection -- автоматическое управление памятью, которое освобождает память от объектов, больше не используемых программой. Сборщик мусора находит неиспользуемые объекты и освобождает память. Однако утечки памяти возникают, когда объекты остаются достижимыми из корневых точек (статические переменные, стеки потоков, JNI-ссылки).\n\nСуществует 4 типа корневых точек:\n- Локальные переменные и параметры методов\n- Потоки\n- Статические переменные\n- Ссылки из JNI (интерфейс для вызова нативных функций из Java)\n\n---\n\nA memory leak in Java means objects that are no longer needed remain reachable from GC roots (static fields, thread stacks, JNI references), preventing collection. The most common causes include: static collections that grow unboundedly, event listeners or callbacks that are registered but never unregistered, inner classes holding implicit references to their enclosing instance, ThreadLocal variables not cleaned up after use, and unclosed resources like streams or connections that hold native memory.\n\nIn Spring applications, common leak patterns include: prototype-scoped beans injected into singletons (the prototype is held forever), ApplicationListener or @EventListener handlers that cache data without eviction, session-scoped attributes in web applications that accumulate under load, Hibernate first-level cache holding entity references in long-running transactions, and classloader leaks during hot redeployment in servlet containers where static references prevent the old classloader from being garbage collected.\n\nDetecting memory leaks involves monitoring heap usage over time (a steadily growing Old Generation after full GCs is a strong signal), taking heap dumps with jmap or -XX:+HeapDumpOnOutOfMemoryError, and analyzing them with tools like Eclipse MAT, VisualVM, or YourKit. Look for the dominator tree to find which objects retain the most memory, and check the shortest path to GC roots to understand why objects are being kept alive.\n\nPrevention best practices: use WeakReference or WeakHashMap for caches that should not prevent GC; always clean ThreadLocal values in a finally block or use try-with-resources patterns; size bounded caches with Caffeine or Guava Cache with explicit eviction policies; remove event listeners when components are destroyed; and close all resources in finally blocks or use try-with-resources. For Spring specifically, ensure @PreDestroy cleanup methods are implemented and that ApplicationContext shutdown hooks fire properly.",
  code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.WeakHashMap;

public class MemoryLeakExamples {

    // LEAK: Static collection grows forever
    private static final List<byte[]> leakyCache = new ArrayList<>();

    // FIX: Use bounded cache or WeakHashMap
    private static final Map<String, byte[]> safeCache = new WeakHashMap<>();

    // LEAK: ThreadLocal not cleaned up
    private static final ThreadLocal<byte[]> threadData = new ThreadLocal<>();

    public static void main(String[] args) {
        // --- Example 1: Unbounded static cache ---
        System.out.println("=== Unbounded cache leak ===");
        for (int i = 0; i < 100; i++) {
            leakyCache.add(new byte[1024 * 100]); // 100 KB per entry, never evicted
        }
        System.out.printf("Leaky cache size: %d entries, ~%d MB%n",
            leakyCache.size(), leakyCache.size() * 100 / 1024);

        // --- Example 2: ThreadLocal leak pattern ---
        System.out.println("\\n=== ThreadLocal leak ===");
        Thread worker = new Thread(() -> {
            threadData.set(new byte[1024 * 1024]); // 1 MB
            // BAD: forgetting threadData.remove()
            System.out.println("ThreadLocal set, but never removed!");
        });
        worker.start();
        try { worker.join(); } catch (InterruptedException ignored) {}

        // --- Example 3: Proper cleanup with try-finally ---
        System.out.println("\\n=== Proper ThreadLocal cleanup ===");
        ThreadLocal<Map<String, String>> context = new ThreadLocal<>();
        try {
            context.set(new HashMap<>());
            context.get().put("user", "admin");
            System.out.println("Context: " + context.get());
        } finally {
            context.remove(); // Always clean up!
            System.out.println("ThreadLocal cleaned up");
        }

        // --- Example 4: Inner class reference leak ---
        System.out.println("\\n=== Inner class reference leak ===");
        OuterClass outer = new OuterClass();
        OuterClass.InnerClass inner = outer.createInner();
        // 'inner' holds implicit reference to 'outer',
        // preventing 'outer' from being GC'd even if we null it:
        // outer = null; // inner still keeps outer alive!
        System.out.println("Inner holds outer reference: " + inner.getOuterData());
    }
}

class OuterClass {
    private byte[] largeData = new byte[1024 * 1024]; // 1 MB

    class InnerClass { // Non-static inner class holds reference to OuterClass
        String getOuterData() {
            return "Outer data size: " + largeData.length;
        }
    }

    InnerClass createInner() {
        return new InnerClass();
    }

    // FIX: Use static inner class + explicit reference if needed
    // static class SafeInnerClass { ... }
}`,
  interviewQs: [
    {
      id: "9-4-q0",
      q: "Can Java have memory leaks even though it has garbage collection? Give an example.",
      a: "Yes. The GC can only collect unreachable objects. If your code holds references to objects that are no longer needed -- for example, adding objects to a static List and never removing them -- those objects remain reachable and will never be collected. Other common examples include ThreadLocal values not removed after use, unclosed streams/connections, and listeners registered but never unregistered.",
      difficulty: "junior",
    },
    {
      id: "9-4-q1",
      q: "What are common memory leak patterns in Spring applications, and how do you prevent them?",
      a: "Common patterns: (1) Prototype beans injected into singletons -- the singleton holds the prototype reference forever. Fix: inject Provider<T> or ObjectFactory<T> instead. (2) @EventListener handlers that accumulate state without eviction. Fix: use bounded caches like Caffeine. (3) Hibernate session holding entity references in long transactions. Fix: keep transactions short, use stateless sessions for bulk operations. (4) ThreadLocal in servlet filters not cleaned up. Fix: always call remove() in a finally block or use Spring's RequestContextHolder. (5) Session-scoped attributes growing under load. Fix: set session timeouts and limit stored data.",
      difficulty: "mid",
    },
    {
      id: "9-4-q2",
      q: "Walk me through diagnosing a production memory leak: Old Gen is steadily growing and full GCs are not reclaiming memory. What steps do you take?",
      a: "Step 1: Confirm the leak by checking GC logs -- if heap usage after each full GC is progressively higher, it is a leak. Step 2: Capture a heap dump (jmap -dump:live,format=b,file=heap.hprof <pid> or trigger via -XX:+HeapDumpOnOutOfMemoryError). Step 3: Open the dump in Eclipse MAT and look at the Leak Suspects report and Dominator Tree to find the largest retained objects. Step 4: Trace the shortest path to GC roots to understand why these objects are reachable. Step 5: Identify the code pattern (static cache, listener, ThreadLocal, classloader) and fix it. Step 6: Use allocation tracking (e.g., async-profiler or JFR) to pinpoint the allocation site if the dump alone is not conclusive. Step 7: Deploy the fix and verify heap usage stabilizes post-full-GC.",
      difficulty: "senior",
    },
  ],
  tip: "Always set -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp in production -- you only get one chance to capture the heap state when OOM strikes.",
  springConnection: {
    concept: "Memory Leaks",
    springFeature: "Spring Boot Actuator health indicators and DevTools",
    explanation:
      "Spring Boot Actuator can expose heap memory metrics and GC statistics for leak detection dashboards. Spring DevTools' automatic restart during development can itself cause classloader leaks if static references hold objects from the old classloader. In production, combining Actuator metrics with Prometheus alerts on jvm.memory.used trending upward is the standard approach for early leak detection.",
  },
};
