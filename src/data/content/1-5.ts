import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-5",
  blockId: 1,
  title: "JIT Compilation",
  summary:
    "JIT (Just-In-Time) компилятор -- это то, что делает Java быстрой. Он отслеживает часто выполняемые участки кода ('горячий' код) и компилирует их в оптимизированный нативный машинный код во время выполнения. Именно поэтому Java-приложения ускоряются со временем -- явление, называемое 'прогревом' (warm-up).\n\n---\n\n" +
    "The JIT (Just-In-Time) compiler is what makes Java fast despite being interpreted. It monitors which code paths are executed frequently ('hot' code) and compiles them to optimized native machine code at runtime. This is why Java applications get faster over time — a phenomenon called 'warm-up'.",
  deepDive:
    "## Tiered compilation в HotSpot\n\n" +
    "Чистая интерпретация медленная. JIT решает это: профилирует исполнение, находит горячие методы и компилирует их в нативный код. HotSpot использует **5 уровней**:\n\n" +
    "- **Level 0** — интерпретатор. Нулевой overhead компиляции, медленное исполнение.\n" +
    "- **Levels 1–3** — **C1** (Client Compiler). Быстрая компиляция, умеренный speedup, собирает профилировочные данные.\n" +
    "- **Level 4** — **C2** (Server Compiler). Агрессивные оптимизации: inlining, loop unrolling, escape analysis, elision лока.\n\n" +
    "Такой подход балансирует скорость старта и пиковую пропускную способность.\n\n" +
    "## On-Stack Replacement (OSR)\n\n" +
    "Если в методе есть горячий цикл, JIT может скомпилировать метод и перевести исполнение **из интерпретатора в скомпилированный код прямо внутри цикла** — не дожидаясь следующего вызова метода. Критично для кода, который большую часть времени крутится в узких циклах.\n\n" +
    "## Ключевые оптимизации, которые надо знать\n\n" +
    "- **Method inlining** — подставляет тело метода вместо вызова, убирая overhead и открывая дверь для других оптимизаций.\n" +
    "- **Escape analysis** — определяет, «убегает» ли объект за пределы своего метода. Если нет — JVM может разместить его **на стеке** через scalar replacement, полностью убирая давление на GC.\n" +
    "- **Lock elision** — убирает `synchronized` на объектах, которые escape analysis доказал thread-local.\n" +
    "- **Speculative optimization** — по профилю делает оптимистические предположения («этот виртуальный вызов всегда — `ArrayList.add()`»), генерирует быстрый код для частого случая, и ставит deopt-trap на случай нарушения.\n\n" +
    "## Deoptimization\n\n" +
    "> [!gotcha]\n" +
    "> Deoptimization — страховка JIT. Когда спекулятивное предположение нарушается (загрузился новый класс, меняющий иерархию; впервые взята редкая ветка), JVM откатывается: выбрасывает скомпилированный код и возвращается к интерпретации. В продакшене это видно как **внезапные спайки latency**, в том числе на уже «прогретом» сервисе.\n\n" +
    "## Warm-up в микросервисах\n\n" +
    "Свежая JVM гоняет всё через интерпретатор, и сама JIT-компиляция ест CPU. Поэтому первые сотни запросов к Spring Boot-сервису значительно медленнее, чем в steady state.\n\n" +
    "> [!production]\n" +
    "> Что помогает:\n" +
    "> - Warm-up-скрипт, который прогоняет горячие эндпоинты перед тем, как принимать реальный трафик\n" +
    "> - **CDS / AppCDS** (`-XX:SharedArchiveFile`) — ускоряет загрузку классов\n" +
    "> - `-XX:+AlwaysPreTouch` — сразу коммитит страницы памяти\n" +
    "> - Kubernetes readiness probe с достаточным `initialDelaySeconds` — иначе pod убивают до прогрева\n" +
    "> - **AOT** (GraalVM `native-image` / OpenJDK `jaotc`) — полностью устраняет JIT warm-up ценой более низкой пиковой производительности\n\n" +
    "Флаги для наблюдения: `-XX:+PrintCompilation`, `-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining`.\n\n---\n\n" +
    "## Tiered compilation in HotSpot\n\n" +
    "Pure interpretation is slow. JIT fixes that: it profiles execution, identifies hot methods, and compiles them to native code. HotSpot uses **5 levels**:\n\n" +
    "- **Level 0** — interpreter. Zero compile overhead, slow execution.\n" +
    "- **Levels 1–3** — **C1** (Client Compiler). Fast compile, moderate speedup, gathers profiling data.\n" +
    "- **Level 4** — **C2** (Server Compiler). Aggressive optimisations: inlining, loop unrolling, escape analysis, lock elision.\n\n" +
    "This tiered approach balances startup speed with peak throughput.\n\n" +
    "## On-Stack Replacement (OSR)\n\n" +
    "If a method contains a hot loop, the JIT can compile the method and move execution **from the interpreter to compiled code mid-loop** — without waiting for the method to be called again. Essential for code that spends most of its time in tight loops.\n\n" +
    "## Key optimisations to know\n\n" +
    "- **Method inlining** — replaces a call with the method body, removing call overhead and enabling further optimisations.\n" +
    "- **Escape analysis** — determines whether an object escapes its creating method. If it doesn't, the JVM can allocate it **on the stack** via scalar replacement, removing GC pressure entirely.\n" +
    "- **Lock elision** — removes `synchronized` on objects that escape analysis proves are thread-local.\n" +
    "- **Speculative optimisation** — uses profiling data to make optimistic assumptions (\"this virtual call always hits `ArrayList.add()`\"), generates fast code for the common case, and installs a deopt trap if the assumption breaks.\n\n" +
    "## Deoptimization\n\n" +
    "> [!gotcha]\n" +
    "> Deoptimization is the JIT's safety net. When a speculative assumption is invalidated (a new class loaded changes the hierarchy; a rarely-taken branch is finally taken), the JVM discards the compiled code and falls back to the interpreter. In production this shows up as **sudden latency spikes** even on an already-warmed service.\n\n" +
    "## Warm-up in microservices\n\n" +
    "A freshly started JVM runs everything through the interpreter, and JIT compilation itself consumes CPU. That's why the first few hundred requests to a Spring Boot service are significantly slower than steady state.\n\n" +
    "> [!production]\n" +
    "> What helps:\n" +
    "> - Warm-up scripts that exercise hot endpoints before accepting real traffic\n" +
    "> - **CDS / AppCDS** (`-XX:SharedArchiveFile`) — speeds up class loading\n" +
    "> - `-XX:+AlwaysPreTouch` — commits memory pages upfront\n" +
    "> - Kubernetes readiness probe with a sufficient `initialDelaySeconds` — otherwise the pod gets killed before warm-up finishes\n" +
    "> - **AOT** (GraalVM `native-image` / OpenJDK `jaotc`) — eliminates JIT warm-up entirely at the cost of lower peak throughput\n\n" +
    "Observability flags: `-XX:+PrintCompilation`, `-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining`.",
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
      q:
        "Что такое JIT-компиляция и зачем она нужна Java?\n\n---\n\n" +
        "What is JIT compilation and why does Java need it?",
      a:
        "JIT (Just-In-Time) компиляция превращает часто выполняемый байт-код в нативный машинный код во время исполнения. Java без неё была бы медленной: чистая интерпретация байт-кода примерно в 10–50× медленнее нативного кода.\n\n" +
        "JIT отслеживает выполнение, находит «горячие» методы и циклы, компилирует их в оптимизированный код. Это даёт почти нативную производительность с сохранением платформонезависимости (байт-код портируется, а JIT генерирует нужный машинный код для текущей платформы).\n\n" +
        "Цена — **warm-up**: приложение медленнее в начале, пока JIT профилирует и компилирует горячий код.\n\n---\n\n" +
        "JIT (Just-In-Time) compilation turns frequently-executed bytecode into native machine code at runtime. Without it Java would be slow: pure bytecode interpretation is ~10–50× slower than native code.\n\n" +
        "The JIT watches execution, identifies 'hot' methods and loops, and compiles them to optimised native code. That gives Java near-native performance while keeping platform independence (bytecode is portable, and the JIT emits the right native code for the current platform).\n\n" +
        "The trade-off is **warm-up**: the app is slower initially while the JIT profiles and compiles hot code.",
      difficulty: "junior",
    },
    {
      id: "1-5-q1",
      q:
        "Что такое escape analysis и как он оптимизирует Java-код?\n\n---\n\n" +
        "What is escape analysis and how does it optimize Java code?",
      a:
        "Escape analysis — оптимизация JIT, определяющая, ограничен ли жизненный цикл объекта одним методом или потоком. Если объект «не убегает» (на него нет ссылки из поля и он не возвращается), JIT может:\n\n" +
        "1. **Scalar replacement** — разложить объект на его поля как локальные переменные на стеке, полностью убрав аллокацию в куче.\n" +
        "2. **Lock elision** — убрать `synchronized` на объекте, раз другим потокам он недоступен.\n" +
        "3. Потенциально вообще устранить аллокацию, если данные объекта не используются.\n\n" +
        "Поэтому создание маленьких короткоживущих объектов в Java в оптимизированном коде по сути бесплатно — JIT убирает аллокацию.\n\n---\n\n" +
        "Escape analysis is a JIT optimisation that determines whether an object's lifetime is confined to a single method or thread. If the object doesn't 'escape' (no reference to it is stored in a field or returned), the JIT can:\n\n" +
        "1. **Scalar replacement** — break the object into its fields as local variables on the stack, removing the heap allocation entirely.\n" +
        "2. **Lock elision** — strip `synchronized` off the object since no other thread can reach it.\n" +
        "3. Potentially eliminate the allocation altogether if the object's data isn't used.\n\n" +
        "That's why creating small, short-lived objects in Java is effectively free in optimised code — the JIT eliminates the allocation overhead.",
      difficulty: "mid",
    },
    {
      id: "1-5-q2",
      q:
        "Объясните tiered compilation, деоптимизацию и как это влияет на продакшен-микросервисы.\n\n---\n\n" +
        "Explain tiered compilation, deoptimization, and how they affect production microservices.",
      a:
        "**Tiered compilation** — 5 уровней: L0 (интерпретатор), L1–L3 (C1 с растущим профилированием), L4 (C2 с агрессивными оптимизациями). Код стартует в интерпретаторе, быстро попадает под C1 для умеренного ускорения, а горячие методы в итоге компилируются C2 для пика производительности.\n\n" +
        "**Deoptimization** — когда спекулятивное предположение JIT нарушается (например, загружен новый подкласс, ломающий monomorphic-assumption на call-site), JVM выбрасывает скомпилированный код и откатывается к интерпретации. На графиках это видно как latency-спайки.\n\n" +
        "Для микросервисов это значит:\n\n" +
        "1. Первые 30–60 секунд трафика значительно медленнее (warm-up). Бьёт по P99 и по health-check-таймингу.\n" +
        "2. Загрузка классов в нормальной работе может триггерить deopt-спайки.\n" +
        "3. Митигации:\n" +
        "   - Warm-up-скрипт, прогревающий горячие эндпоинты до получения реального трафика\n" +
        "   - **AppCDS** для ускорения загрузки классов\n" +
        "   - `-XX:+AlwaysPreTouch` — сразу коммитит страницы памяти\n" +
        "   - **GraalVM native-image** — полностью убирает warm-up ценой более низкой пиковой пропускной способности\n\n---\n\n" +
        "**Tiered compilation** — 5 levels: L0 (interpreter), L1–L3 (C1 with increasing profiling), L4 (C2 with aggressive optimisations). Code starts interpreted, is quickly C1-compiled for moderate speedup, and hot methods eventually get C2-compiled for peak performance.\n\n" +
        "**Deoptimization** — when a JIT speculative assumption is invalidated (e.g. a new subclass is loaded that breaks a monomorphic call-site assumption), the JVM discards the compiled code and falls back to interpretation. On dashboards this shows as latency spikes.\n\n" +
        "For microservices this means:\n\n" +
        "1. The first 30–60s of traffic is significantly slower (warm-up). Affects P99 and health-check timing.\n" +
        "2. Class loading during normal operation can trigger deopt spikes.\n" +
        "3. Mitigations:\n" +
        "   - Warm-up script that hits hot endpoints before real traffic arrives\n" +
        "   - **AppCDS** to speed up class loading\n" +
        "   - `-XX:+AlwaysPreTouch` — commits memory pages upfront\n" +
        "   - **GraalVM native-image** — eliminates warm-up entirely at the cost of lower peak throughput",
      difficulty: "senior",
    },
  ],
  tip:
    "Java не медленная. После прогрева JIT-скомпилированный код может сравняться или превзойти C++ в некоторых задачах, потому что JIT использует профилировочные данные, которых нет у статического компилятора.\n\n---\n\n" +
    "Java is NOT slow. After warm-up, JIT-compiled Java code can match or exceed C++ performance in some workloads because the JIT uses runtime profiling data that a static compiler doesn't have.",
  springConnection: {
    concept: "JIT warm-up and startup time",
    springFeature: "Spring Boot AOT & GraalVM Native Image",
    explanation:
      "Spring Boot 3 ввёл **AOT-обработку**: оптимизации кода на этапе сборки. В связке с **GraalVM native-image** это полностью убирает JIT warm-up — приложение стартует за миллисекунды вместо секунд.\n\n" +
      "Компромисс: рантайм-оптимизаций нет, поэтому пиковая пропускная способность может быть ниже, чем у прогретой JVM.\n\n" +
      "Поддержка **CDS (Class Data Sharing)** в Spring Boot — компромисс посередине: ускоряет загрузку классов и сокращает warm-up, при этом сохраняя пиковую производительность JIT.\n\n---\n\n" +
      "Spring Boot 3 introduced **AOT processing** that generates optimised code at build time. Combined with **GraalVM native-image**, it eliminates JIT warm-up entirely — the app starts in milliseconds instead of seconds.\n\n" +
      "Trade-off: no runtime optimisation means peak throughput may be lower than a warmed-up JVM.\n\n" +
      "Spring Boot's **CDS (Class Data Sharing)** support offers a middle ground — it speeds up class loading and reduces warm-up without sacrificing JIT peak performance.",
  },
};
