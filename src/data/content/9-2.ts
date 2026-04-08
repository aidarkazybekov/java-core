import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "9-2",
  blockId: 9,
  title: "Garbage Collection Algorithms",
  summary:
    "The JVM offers several garbage collectors: Serial, Parallel, CMS (deprecated), G1, ZGC, and Shenandoah. Each makes different trade-offs between throughput, latency, and footprint, and choosing the right one depends on your application's requirements.",
  deepDive:
    "## Алгоритм GC\n\nJava использует различные алгоритмы GC, которые эволюционировали с течением времени. Основные этапы:\n\n- **Mark (Маркировка)** -- определение объектов, которые можно удалить\n- **Sweep (Очистка)** -- освобождение памяти\n- **Compact (Сжатие)** -- перемещение оставшихся объектов, чтобы устранить фрагментацию\n\n**Критерии для сравнения GC:**\n- Максимальная задержка -- максимальное время, на которое сборщик приостанавливает выполнение программы (stop-the-world, STW)\n- Пропускная способность -- отношение общего времени работы программы к общему времени простоя, вызванного сборкой мусора\n- Потребляемые ресурсы -- объем ресурсов процессора и/или дополнительной памяти, потребляемых сборщиком\n\n## Типы GC\n\n- **Serial GC** -- самый первый сборщик мусора. Однопоточный, с минимальным потреблением ресурсов. Включается опцией -XX:+UseSerialGC. Вся его работа -- это один сплошной STW.\n\n- **Parallel GC** -- устроен так же как Serial GC, но использует несколько потоков.\n\n- **Concurrent Mark Sweep GC (CMS)** -- дефолтный до Java 8. Снижает паузы за счет работы параллельно с программой. Малая сборка аналогична Parallel GC. Большая сборка работает в фоновом режиме, не дожидаясь заполнения старшего поколения.\n\n- **G1 GC** -- современный GC для больших объемов памяти. Разделяет память на регионы и управляет ими на основе приоритетов. По умолчанию с Java 9.\n\n- **Z GC** -- низкая задержка, подходит для больших объемов памяти (до ТБ). Появился с Java 11 (экспериментально), стабилен с Java 15.\n\n- **Shenandoah GC** -- низкая задержка, фокусируется на минимизации пауз. Появился в Java 12 (экспериментально), стабилен с Java 15.\n\n---\n\nThe Serial collector uses a single thread for both minor and major collections, pausing all application threads (stop-the-world). It is suitable only for small heaps or client applications. The Parallel collector (default in JDK 8) uses multiple threads for Young and Old generation collections, maximizing throughput but still causing stop-the-world pauses proportional to heap size.\n\nG1 (Garbage-First) became the default in JDK 9. It divides the heap into equal-sized regions rather than contiguous generations, allowing it to collect the regions with the most garbage first. G1 targets a configurable pause-time goal (-XX:MaxGCPauseMillis, default 200ms) by performing incremental mixed collections. It handles large heaps (4 GB+) much better than Parallel while maintaining predictable pause times.\n\nZGC (production-ready since JDK 15) and Shenandoah are low-latency collectors designed for sub-millisecond pause times regardless of heap size. ZGC uses colored pointers and load barriers to perform concurrent relocation, keeping pauses under 1ms even on terabyte-scale heaps. Shenandoah achieves similar goals using Brooks forwarding pointers and concurrent compaction. Both are ideal for latency-sensitive services but may sacrifice some throughput compared to Parallel or G1.\n\nThe key trade-off triangle is throughput vs. latency vs. footprint. Parallel maximizes throughput. G1 balances throughput and latency. ZGC/Shenandoah minimize latency at the cost of higher CPU overhead for concurrent work and slightly larger memory footprint due to concurrent marking metadata. Understanding your application's SLA (e.g., p99 latency requirement) drives the collector choice.",
  code: `// Demonstrating GC behavior with different collectors
// Run with: java -XX:+UseG1GC -Xlog:gc*:gc.log -Xms256m -Xmx256m GCDemo
// Or:       java -XX:+UseZGC  -Xlog:gc*:gc.log -Xms256m -Xmx256m GCDemo

import java.util.ArrayList;
import java.util.List;

public class GCDemo {
    // Simulate mixed allocation patterns
    static final List<byte[]> longLived = new ArrayList<>();

    public static void main(String[] args) throws InterruptedException {
        System.out.println("GC: " + java.lang.management.ManagementFactory
            .getGarbageCollectorMXBeans().stream()
            .map(gc -> gc.getName())
            .reduce((a, b) -> a + ", " + b)
            .orElse("Unknown"));

        // Phase 1: Allocate long-lived objects (promote to Old Gen)
        for (int i = 0; i < 50; i++) {
            longLived.add(new byte[1024 * 1024]); // 1 MB each
        }
        System.out.println("Long-lived allocated: 50 MB");

        // Phase 2: High churn of short-lived objects (minor GCs)
        for (int i = 0; i < 500; i++) {
            byte[] temp = new byte[512 * 1024]; // 512 KB, immediately eligible for GC
            if (i % 100 == 0) {
                System.out.printf("Iteration %d - Free: %,d KB%n",
                    i, Runtime.getRuntime().freeMemory() / 1024);
            }
        }

        // Phase 3: Release long-lived objects (triggers major/mixed GC)
        longLived.clear();
        System.gc(); // Suggest full GC

        Thread.sleep(1000);
        System.out.printf("Final free memory: %,d KB%n",
            Runtime.getRuntime().freeMemory() / 1024);
    }
}`,
  interviewQs: [
    {
      id: "9-2-q0",
      q: "What is the difference between a minor GC and a major (full) GC?",
      a: "A minor GC collects only the Young Generation (Eden + Survivor spaces). It is fast because most young objects are already dead. A major or full GC collects the entire heap including Old Generation and sometimes Metaspace. Full GCs are much slower because they scan more memory and often compact the heap. In G1, 'mixed' collections are an intermediate step that collects Young Gen plus selected Old Gen regions without scanning the entire Old Gen.",
      difficulty: "junior",
    },
    {
      id: "9-2-q1",
      q: "How does G1 GC differ from the Parallel collector, and when would you choose each?",
      a: "Parallel GC uses contiguous generational spaces and focuses on throughput with multi-threaded stop-the-world pauses. G1 divides the heap into equal-sized regions, performs incremental mixed collections targeting a pause-time goal, and handles large heaps more predictably. Choose Parallel for batch/offline workloads where throughput matters more than latency. Choose G1 for interactive/server workloads where you need predictable pause times (e.g., web services with SLA requirements), especially with heaps over 4 GB.",
      difficulty: "mid",
    },
    {
      id: "9-2-q2",
      q: "Explain how ZGC achieves sub-millisecond pause times regardless of heap size. What are the trade-offs?",
      a: "ZGC uses colored pointers (metadata stored in unused pointer bits) and load barriers inserted at every reference load to perform almost all GC work concurrently with the application. Marking, relocation, and reference updating happen concurrently; the only stop-the-world phases are brief root scanning pauses. ZGC remaps object references through a read barrier so relocated objects are accessed transparently. Trade-offs include: higher CPU overhead (10-15%) for barrier processing, slightly larger memory footprint for multi-mapping, and no generational collection before JDK 21 (Generational ZGC). It is not ideal for small heaps where G1's pauses are already acceptable.",
      difficulty: "senior",
    },
  ],
  tip: "Always test GC selection under realistic production load using GC logs and tools like GCViewer or GCEasy -- synthetic benchmarks rarely predict real behavior.",
  springConnection: {
    concept: "Garbage Collection Algorithms",
    springFeature: "Spring Boot JVM GC configuration",
    explanation:
      "Spring Boot applications can specify GC flags in JAVA_OPTS or via the spring-boot-maven-plugin configuration. For Spring WebFlux reactive services with strict latency SLAs, ZGC is often the best choice. Spring Boot Actuator exposes gc.pause metrics that help you compare collector performance in production.",
  },
};
