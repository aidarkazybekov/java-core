import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-1",
  blockId: 1,
  title: "JVM Architecture",
  summary:
    "JVM (Java Virtual Machine) -- виртуальная машина, исполняющая байт-код Java. Она является ядром платформы Java: загрузка классов, управление памятью (Heap, Metaspace, Stack), сборка мусора и JIT-компиляция -- все это происходит внутри JVM. Понимание архитектуры JVM критично для диагностики проблем производительности и утечек памяти.\n\n---\n\n" +
    "The JVM is the runtime engine that executes Java bytecode. Understanding its internal architecture — class loading, memory areas, and the execution engine — is foundational to debugging performance issues, memory leaks, and understanding why Java behaves the way it does in production.",
  deepDive:
    "## Три подсистемы JVM\n\n" +
    "JVM — абстрактная вычислительная машина, исполняющая байт-код Java. Состоит из трёх подсистем:\n\n" +
    "- **Class Loader Subsystem** — загрузка (`.class` → метаданные в Metaspace), связывание (верификация → подготовка static-полей → резолвинг символических ссылок) и инициализация (`<clinit>`).\n" +
    "- **Runtime Data Areas** — области памяти во время исполнения.\n" +
    "- **Execution Engine** — интерпретатор + JIT + сборщик мусора.\n\n" +
    "## Runtime Data Areas\n\n" +
    "**Общие между всеми потоками (shared):**\n\n" +
    "- **Heap** — все объекты и массивы. Делится на Young Generation (Eden + S0 + S1) и Old Generation.\n" +
    "- **Method Area (Metaspace с Java 8)** — метаданные классов, Runtime Constant Pool, `static`-поля, байт-код методов. Находится в native-памяти, не ограничена `-Xmx`.\n\n" +
    "**Per-thread (у каждого потока свои):**\n\n" +
    "- **JVM Stack** — фреймы методов (локальные переменные + operand stack + return address).\n" +
    "- **PC Register** — адрес текущей инструкции байт-кода.\n" +
    "- **Native Method Stack** — для вызовов через JNI.\n\n" +
    "> [!gotcha]\n" +
    "> Локальная переменная-ссылка живёт в стеке, но сам объект, на который она указывает, — в куче. Поэтому `static`-поле — НЕ thread-safe автоматически: оно лежит в Metaspace (shared), и все потоки пишут в одну ячейку.\n\n" +
    "## Execution Engine\n\n" +
    "- **Интерпретатор** — выполняет байт-код по инструкции. Старт мгновенный, но медленный.\n" +
    "- **JIT-компилятор (HotSpot)** — отслеживает горячие методы и компилирует в native-код. Tiered compilation: C1 (быстро, Tier 1–3) → C2 (агрессивные оптимизации: inlining, escape analysis, loop unrolling, Tier 4).\n" +
    "- **OSR (On-Stack Replacement)** — может скомпилировать метод прямо во время его исполнения (важно для длинного цикла в `main`).\n" +
    "- **Deoptimization** — если оптимистическое предположение сломано (например, появился новый подкласс), JVM откатывается к интерпретатору.\n\n" +
    "Именно из-за tiered compilation Java-приложения «прогреваются»: первые запросы — холодные и медленные.\n\n" +
    "## Области памяти, о которых часто забывают\n\n" +
    "`-Xmx` ограничивает только heap. Реальное RSS-потребление процесса складывается из:\n\n" +
    "- Heap (`-Xmx`)\n" +
    "- Metaspace (`-XX:MaxMetaspaceSize` — ОБЯЗАТЕЛЬНО задавать в проде)\n" +
    "- CodeCache для JIT-кода (`-XX:ReservedCodeCacheSize`, по умолчанию 240MB)\n" +
    "- Direct buffers (`-XX:MaxDirectMemorySize`, используется NIO/Netty)\n" +
    "- Стеки потоков (native-память: N потоков × `-Xss`)\n" +
    "- GC bookkeeping, card tables, symbol tables\n\n" +
    "Поэтому RSS процесса обычно в 1.5–2× больше `-Xmx`.\n\n" +
    "> [!production]\n" +
    "> Обязательный минимум в проде: `-Xmx`, `-XX:MaxMetaspaceSize`, `-XX:+HeapDumpOnOutOfMemoryError`, `-XX:HeapDumpPath`. Для отладки native-памяти: `-XX:NativeMemoryTracking=summary` + `jcmd <pid> VM.native_memory summary`.\n\n---\n\n" +
    "## Three JVM subsystems\n\n" +
    "The JVM is an abstract computing machine that executes Java bytecode. It has three subsystems:\n\n" +
    "- **Class Loader Subsystem** — loading (`.class` → metadata in Metaspace), linking (verification → preparation of `static` fields → resolution of symbolic refs), and initialization (`<clinit>`).\n" +
    "- **Runtime Data Areas** — memory regions used while the program runs.\n" +
    "- **Execution Engine** — interpreter + JIT + garbage collector.\n\n" +
    "## Runtime Data Areas\n\n" +
    "**Shared across all threads:**\n\n" +
    "- **Heap** — all object instances and arrays. Split into Young Generation (Eden + S0 + S1) and Old Generation.\n" +
    "- **Method Area (Metaspace since Java 8)** — class metadata, Runtime Constant Pool, `static` fields, method bytecode. Lives in native memory, not bounded by `-Xmx`.\n\n" +
    "**Per-thread (each thread has its own):**\n\n" +
    "- **JVM Stack** — frames for each method call (local variables + operand stack + return address).\n" +
    "- **PC Register** — address of the current bytecode instruction.\n" +
    "- **Native Method Stack** — for JNI calls into native code.\n\n" +
    "> [!gotcha]\n" +
    "> A local reference variable lives on the stack, but the object it points to is on the heap. That's also why a `static` field is NOT automatically thread-safe — it lives in Metaspace (shared), and every thread writes to the same slot.\n\n" +
    "## Execution Engine\n\n" +
    "- **Interpreter** — executes bytecode instruction-by-instruction. Instant start, slow steady state.\n" +
    "- **JIT Compiler (HotSpot)** — tracks hot methods and compiles them to native code. Tiered compilation: C1 (fast, Tier 1–3) → C2 (aggressive: inlining, escape analysis, loop unrolling, Tier 4).\n" +
    "- **OSR (On-Stack Replacement)** — can compile a method *while it's still running* (important for long loops in `main`).\n" +
    "- **Deoptimization** — if an optimistic assumption is invalidated (e.g. a new subclass appears), JVM falls back to the interpreter.\n\n" +
    "Tiered compilation is why Java apps need to warm up: the first few requests are cold and slow.\n\n" +
    "## Memory areas people forget\n\n" +
    "`-Xmx` only bounds the heap. Real process RSS is the sum of:\n\n" +
    "- Heap (`-Xmx`)\n" +
    "- Metaspace (`-XX:MaxMetaspaceSize` — always set this in prod)\n" +
    "- CodeCache for JIT-compiled code (`-XX:ReservedCodeCacheSize`, default 240MB)\n" +
    "- Direct buffers (`-XX:MaxDirectMemorySize` — used by NIO, Netty)\n" +
    "- Thread stacks (native memory: N threads × `-Xss`)\n" +
    "- GC bookkeeping, card tables, symbol tables\n\n" +
    "That's why process RSS is typically 1.5–2× the `-Xmx` you configured.\n\n" +
    "> [!production]\n" +
    "> Minimum prod flags: `-Xmx`, `-XX:MaxMetaspaceSize`, `-XX:+HeapDumpOnOutOfMemoryError`, `-XX:HeapDumpPath`. For native-memory debugging: `-XX:NativeMemoryTracking=summary` + `jcmd <pid> VM.native_memory summary`.",
  code:
    `// Exploring JVM memory areas at runtime
public class JvmArchitectureDemo {
    // Static field -> stored in Method Area (Metaspace)
    private static final String APP_NAME = "JVM Demo";

    // Instance field -> stored on the Heap (as part of the object)
    private int[] largeArray = new int[1_000_000];

    public static void main(String[] args) {
        // 'demo' reference is on the stack; the object is on the heap
        JvmArchitectureDemo demo = new JvmArchitectureDemo();

        // Runtime memory inspection
        Runtime rt = Runtime.getRuntime();
        System.out.println("Max heap:   " + rt.maxMemory() / 1024 / 1024 + " MB");
        System.out.println("Total heap: " + rt.totalMemory() / 1024 / 1024 + " MB");
        System.out.println("Free heap:  " + rt.freeMemory() / 1024 / 1024 + " MB");
        System.out.println("Used heap:  " +
            (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024 + " MB");

        // Thread stack info
        System.out.println("\\nActive threads: " + Thread.activeCount());
        System.out.println("Current thread stack depth: " +
            Thread.currentThread().getStackTrace().length);

        // Demonstrate StackOverflowError
        try {
            infiniteRecursion(0);
        } catch (StackOverflowError e) {
            System.out.println("\\nStackOverflowError caught!");
            System.out.println("Stack frames before overflow vary by JVM and -Xss setting");
        }
    }

    // Each call adds a frame to the thread's JVM Stack
    private static void infiniteRecursion(int depth) {
        infiniteRecursion(depth + 1);
    }
}`,
  interviewQs: [
    {
      id: "1-1-q0",
      q:
        "Какие основные области данных времени выполнения есть в JVM и какие из них общие для всех потоков?\n\n---\n\n" +
        "What are the main runtime data areas in the JVM, and which are shared between threads?",
      a:
        "JVM имеет пять областей данных времени выполнения.\n\n" +
        "Общие между потоками (shared):\n" +
        "• Heap -- здесь живут все объекты (new Foo() -> Heap). Делится на Young (Eden + S0 + S1) и Old Generation.\n" +
        "• Method Area / Metaspace -- метаданные классов, Runtime Constant Pool, static поля, байт-код методов.\n\n" +
        "Per-thread (у каждого потока свои):\n" +
        "• JVM Stack -- стек фреймов методов (локальные переменные + operand stack + return address).\n" +
        "• PC Register -- адрес текущей инструкции байт-кода.\n" +
        "• Native Method Stack -- для вызовов через JNI.\n\n" +
        "Почему это важно: в shared-областях нужна синхронизация (два потока могут одновременно писать в один объект на Heap -- отсюда race conditions), а per-thread области безопасны по умолчанию. Поэтому локальные примитивы thread-safe, а поля объекта на Heap -- нет.\n\n" +
        "Частая ловушка: static поле 'thread-safe потому что static' -- неверно. Static живет в Metaspace (shared), то есть к нему тоже одновременно обращаются все потоки.\n\n---\n\n" +
        "The JVM has five runtime data areas.\n\n" +
        "Shared across threads:\n" +
        "• Heap — all object instances live here (`new Foo()` → Heap). Split into Young Generation (Eden + S0 + S1) and Old Generation for GC.\n" +
        "• Method Area / Metaspace — class metadata, Runtime Constant Pool, `static` fields, method bytecode.\n\n" +
        "Per-thread (each thread owns its own):\n" +
        "• JVM Stack — frames for each method call (local variables + operand stack + return address).\n" +
        "• PC Register — address of the current bytecode instruction.\n" +
        "• Native Method Stack — used for JNI calls into native code.\n\n" +
        "Why it matters: shared areas need synchronization (two threads writing the same heap object → race condition), per-thread areas are safe by construction. That's why local primitives are inherently thread-safe, but an object's fields on the heap are not.\n\n" +
        "Common trap: `static` fields are NOT automatically thread-safe just because they're static — they live in Metaspace (shared), so all threads touch the same slot.",
      difficulty: "junior",
    },
    {
      id: "1-1-q1",
      q:
        "Где в памяти JVM живут: примитивная локальная переменная, объект, ссылка на объект, static поле, литерал строки? Разберите на примере.\n\n---\n\n" +
        "Where in JVM memory do these live: a primitive local variable, an object, a reference to that object, a `static` field, and a string literal? Walk through a concrete example.",
      a:
        "Рассмотрим код:\n\n" +
        "```java\n" +
        "class Order {\n" +
        "  static int counter = 0;        // (1)\n" +
        "  String code = \"A-001\";         // (2)\n" +
        "  public void process() {\n" +
        "    int qty = 5;                 // (3)\n" +
        "    Order other = new Order();   // (4)(5)\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "(1) `counter` -- static -> Metaspace (поле класса, одно на всю JVM).\n" +
        "(2) `code` -- instance поле -> живет внутри объекта Order на Heap.\n" +
        "(3) `qty` -- локальный примитив -> JVM Stack текущего потока, внутри фрейма process().\n" +
        "(4) `other` -- локальная ссылка -> JVM Stack (4 или 8 байт -- сам указатель).\n" +
        "(5) `new Order()` -- сам объект -> Heap (в Eden при первом создании).\n\n" +
        "Строковый литерал `\"A-001\"` -> String Pool. В Java 7+ пул перенесен в Heap; в Metaspace хранятся только имена классов и метаданные.\n\n" +
        "Ключевой момент: ссылка и объект -- это два разных места в памяти. Когда метод завершается, стек-фрейм (с `qty` и `other`) автоматически уничтожается, но объект Order на Heap останется, пока до него есть reachable-ссылки -- затем GC его заберет.\n\n---\n\n" +
        "Consider this code:\n\n" +
        "```java\n" +
        "class Order {\n" +
        "  static int counter = 0;        // (1)\n" +
        "  String code = \"A-001\";         // (2)\n" +
        "  public void process() {\n" +
        "    int qty = 5;                 // (3)\n" +
        "    Order other = new Order();   // (4)(5)\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "(1) `counter` — static field → Metaspace (one slot per JVM).\n" +
        "(2) `code` — instance field → lives inside the Order object on the Heap.\n" +
        "(3) `qty` — local primitive → JVM Stack of the current thread, inside the `process()` frame.\n" +
        "(4) `other` — local reference → JVM Stack (a 4/8-byte pointer, not the object).\n" +
        "(5) `new Order()` — the object itself → Heap (Eden space on first allocation).\n\n" +
        "The string literal `\"A-001\"` → String Pool. In Java 7+ the pool lives in the Heap; Metaspace only holds class names and metadata.\n\n" +
        "Key insight: the reference and the object are two different memory locations. When the method returns, the stack frame (with `qty` and `other`) is reclaimed automatically, but the Order instance on the Heap survives until no reachable references remain — then GC collects it.",
      difficulty: "junior",
    },
    {
      id: "1-1-q2",
      q:
        "В чем разница между StackOverflowError и OutOfMemoryError? Можно ли получить OOM из-за стека? Как это диагностировать в проде?\n\n---\n\n" +
        "What's the difference between `StackOverflowError` and `OutOfMemoryError`? Can stack space cause an OOM? How do you diagnose this in production?",
      a:
        "**StackOverflowError**: поток превысил глубину своего стека (обычно бесконечная или слишком глубокая рекурсия). Размер регулируется `-Xss` (по умолчанию ~512KB-1MB).\n\n" +
        "```java\n" +
        "void recurse() { recurse(); } // SOE через ~10-20K фреймов\n" +
        "```\n\n" +
        "**OutOfMemoryError** -- JVM не может выделить память. Под этим названием скрывается несколько разных ошибок:\n" +
        "• `Java heap space` -- закончился -Xmx. Часто -- утечка памяти (коллекция растет без ограничений).\n" +
        "• `GC overhead limit exceeded` -- JVM тратит >98% времени на GC и освобождает <2% памяти.\n" +
        "• `Metaspace` -- слишком много загруженных классов (classloader leak в app-серверах).\n" +
        "• `unable to create new native thread` -- OS не может выделить память под стек нового потока. Это именно OOM из-за стека, но не StackOverflow! Если у вас тысячи потоков, каждый со стеком по 1MB, это уже гигабайты native-памяти.\n" +
        "• `Direct buffer memory` -- исчерпан `-XX:MaxDirectMemorySize` (NIO, Netty).\n\n" +
        "Диагностика в проде:\n" +
        "1. Всегда запускайте с `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/logs/heap`.\n" +
        "2. Анализ дампа: Eclipse MAT, VisualVM, JProfiler -- смотрите Leak Suspects.\n" +
        "3. Live-диагностика: `jcmd <pid> GC.heap_info`, `jstat -gc <pid> 1s`, `jmap -histo:live <pid>`.\n" +
        "4. Для 'unable to create thread': `ulimit -a`, `cat /proc/<pid>/status | grep Threads`.\n\n---\n\n" +
        "**StackOverflowError**: a thread exceeded its call stack depth — typically infinite/too-deep recursion. Stack size is controlled by `-Xss` (default ~512KB–1MB).\n\n" +
        "```java\n" +
        "void recurse() { recurse(); } // SOE after ~10-20K frames\n" +
        "```\n\n" +
        "**OutOfMemoryError** is an umbrella — several distinct failures share the name:\n" +
        "• `Java heap space` — `-Xmx` exhausted. Usually a memory leak (a collection grows unbounded).\n" +
        "• `GC overhead limit exceeded` — JVM spends >98% of time in GC and reclaims <2%.\n" +
        "• `Metaspace` — too many loaded classes (classloader leaks in app servers).\n" +
        "• `unable to create new native thread` — OS can't allocate stack space for a new thread. This IS an OOM caused by stack, but it's NOT a StackOverflow! Thousands of threads × 1MB stack each = gigabytes of native memory.\n" +
        "• `Direct buffer memory` — `-XX:MaxDirectMemorySize` exhausted (NIO, Netty).\n\n" +
        "Production diagnosis:\n" +
        "1. Always run with `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/logs/heap`.\n" +
        "2. Dump analysis: Eclipse MAT, VisualVM, JProfiler — use the Leak Suspects report.\n" +
        "3. Live inspection: `jcmd <pid> GC.heap_info`, `jstat -gc <pid> 1s`, `jmap -histo:live <pid>`.\n" +
        "4. For 'unable to create thread': `ulimit -a`, `cat /proc/<pid>/status | grep Threads`.",
      difficulty: "mid",
    },
    {
      id: "1-1-q3",
      q:
        "Что такое JIT-компиляция? Почему Java-приложения 'прогреваются', и как это влияет на SLA и бенчмарки?\n\n---\n\n" +
        "What is JIT compilation? Why do Java apps need to 'warm up', and how does this affect SLAs and benchmarks?",
      a:
        "Execution Engine JVM работает в двух режимах:\n\n" +
        "**Интерпретатор** -- читает байт-код по инструкции и выполняет. Запускается мгновенно, но медленный (каждая итерация цикла -- диспетчеризация).\n\n" +
        "**JIT-компилятор** (HotSpot) -- отслеживает 'горячие' методы (счетчик вызовов > порога, по умолчанию ~10K) и компилирует их в native-код. Есть tiered compilation:\n" +
        "• Tier 0: интерпретатор.\n" +
        "• Tier 1-3: C1 compiler (быстрая, простая компиляция).\n" +
        "• Tier 4: C2 compiler (агрессивные оптимизации: inlining, escape analysis, loop unrolling).\n\n" +
        "Отсюда warm-up: первые запросы идут через интерпретатор -- медленно. По мере прогрева C1 -> C2 компилируют горячие пути, и latency падает в 10-100 раз.\n\n" +
        "Последствия для прода:\n" +
        "• Первые N секунд после старта сервис 'холодный'. Kubernetes readiness probe с низким timeout может убить pod до прогрева.\n" +
        "• Canary-деплой: новая инстанция медленнее старых -- может завалить P99 latency.\n" +
        "• Микробенчмарки: НИКОГДА не меряйте производительность без warm-up итераций. Используйте JMH -- он делает warm-up автоматически.\n" +
        "• Решения: AOT-компиляция (GraalVM native-image), CDS (Class Data Sharing), прогрев по checklist'у перед включением трафика.\n\n" +
        "Флаги для наблюдения: `-XX:+PrintCompilation`, `-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining`.\n\n---\n\n" +
        "The JVM Execution Engine runs in two modes:\n\n" +
        "**Interpreter** — reads bytecode instruction-by-instruction and executes it. Starts instantly, but slow (every loop iteration pays dispatch overhead).\n\n" +
        "**JIT Compiler** (HotSpot) — tracks 'hot' methods (invocation counter > threshold, default ~10K) and compiles them to native code. Tiered compilation:\n" +
        "• Tier 0: interpreter.\n" +
        "• Tier 1–3: C1 compiler (quick, simple compilation).\n" +
        "• Tier 4: C2 compiler (aggressive optimizations: inlining, escape analysis, loop unrolling).\n\n" +
        "Hence warm-up: the first few requests hit the interpreter — slow. As hot paths are compiled by C1 → C2, latency drops 10–100×.\n\n" +
        "Production consequences:\n" +
        "• For the first N seconds after startup the service is 'cold'. A Kubernetes readiness probe with a short timeout can kill the pod before warm-up finishes.\n" +
        "• Canary deploys: the new instance is slower than old ones — can blow your P99 latency.\n" +
        "• Microbenchmarks: NEVER measure performance without warm-up iterations. Use JMH — it handles warm-up for you.\n" +
        "• Mitigations: AOT compilation (GraalVM native-image), CDS (Class Data Sharing), synthetic traffic warm-up before adding to the load balancer.\n\n" +
        "Observability flags: `-XX:+PrintCompilation`, `-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining`.",
      difficulty: "mid",
    },
    {
      id: "1-1-q4",
      q:
        "Почему в Java 8 PermGen заменили на Metaspace? Какие production-последствия это имеет, и какие флаги обязательно настраивать?\n\n---\n\n" +
        "Why did Java 8 replace PermGen with Metaspace, and what are the production implications? Which flags must you always set?",
      a:
        "**PermGen (до Java 8)** -- фиксированный регион внутри Heap для метаданных классов, interned strings и static-ов. Проблема: жесткий лимит `-XX:MaxPermSize` (по умолчанию 64-82MB). В app-серверах (Tomcat, JBoss) с частыми hot-deploy'ами classloader'ы не всегда выгружались -> PermGen быстро переполнялся -> 'OutOfMemoryError: PermGen space'. Классика -- постоянно после ~10-20 передеплоев.\n\n" +
        "**Metaspace (Java 8+)** -- метаданные классов перенесены в native memory (вне Heap). Ключевые изменения:\n" +
        "• По умолчанию размер не ограничен -- растет, пока есть RAM у процесса.\n" +
        "• Interned strings переехали в обычный Heap (можно дампить, GC-ить).\n" +
        "• Class metadata тоже может освобождаться при выгрузке classloader'а.\n\n" +
        "Production-последствия, почему это опасно:\n" +
        "• Старый PermGen OOM падал громко и рано. Новый Metaspace leak тихо ест native memory, пока не убьет всю ноду (OOM killer в Linux).\n" +
        "• Без лимита на Metaspace один баг с classloader'ом может съесть всю память хоста и положить соседние сервисы.\n\n" +
        "Обязательные флаги в проде:\n" +
        "```\n" +
        "-XX:MaxMetaspaceSize=512m          # верхняя граница -- must have\n" +
        "-XX:MetaspaceSize=256m             # начальный размер, снижает ре-трешолды\n" +
        "-XX:+HeapDumpOnOutOfMemoryError\n" +
        "-XX:HeapDumpPath=/var/logs/heap\n" +
        "```\n\n" +
        "Мониторинг: `jcmd <pid> VM.metaspace` или `jstat -gcmetacapacity <pid>`. Если Metaspace растет линейно со временем без стабилизации -- classloader leak. Типичные причины: ThreadLocal, который держит ссылку на класс; неправильная отписка от JDBC-драйверов; Spring-контексты, которые не закрываются.\n\n---\n\n" +
        "**PermGen (pre-Java 8)** — a fixed region inside the Heap holding class metadata, interned strings, and statics. Problem: hard cap via `-XX:MaxPermSize` (default 64–82MB). In app servers (Tomcat, JBoss) with frequent hot deploys, classloaders often failed to unload → PermGen filled up → `OutOfMemoryError: PermGen space`. A classic bug: crash after ~10–20 redeploys.\n\n" +
        "**Metaspace (Java 8+)** — class metadata moved to native memory (outside the Heap). Key changes:\n" +
        "• By default, size is unbounded — grows until the process runs out of RAM.\n" +
        "• Interned strings moved to the regular Heap (dumpable, GC-able).\n" +
        "• Class metadata can be reclaimed when a classloader unloads.\n\n" +
        "Why this is dangerous in production:\n" +
        "• The old PermGen OOM failed loudly and early. A Metaspace leak now silently eats native memory until the Linux OOM killer takes down the whole node.\n" +
        "• Without a Metaspace cap, one classloader bug can consume all host memory and crash co-located services.\n\n" +
        "Mandatory production flags:\n" +
        "```\n" +
        "-XX:MaxMetaspaceSize=512m          # upper bound — must have\n" +
        "-XX:MetaspaceSize=256m             # initial size, avoids re-thresholds\n" +
        "-XX:+HeapDumpOnOutOfMemoryError\n" +
        "-XX:HeapDumpPath=/var/logs/heap\n" +
        "```\n\n" +
        "Monitoring: `jcmd <pid> VM.metaspace` or `jstat -gcmetacapacity <pid>`. If Metaspace grows linearly without stabilizing → classloader leak. Common causes: ThreadLocals holding class references, JDBC driver deregistration failures, Spring contexts not shut down cleanly.",
      difficulty: "senior",
    },
    {
      id: "1-1-q5",
      q:
        "Продовский сервис получает OutOfMemoryError: Java heap space через 6 часов после старта. Heap растет медленно и монотонно. Как вы пошагово диагностируете утечку памяти?\n\n---\n\n" +
        "A production service throws `OutOfMemoryError: Java heap space` about 6 hours after start. The heap grows slowly and monotonically. Walk through your step-by-step memory-leak diagnosis.",
      a:
        "План действий:\n\n" +
        "**1. Убедиться, что дамп уже есть.** Сервис должен запускаться с `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/logs/heap/`. Если нет -- немедленно добавить и дождаться следующего падения (или снять дамп вручную до падения: `jcmd <pid> GC.heap_dump /tmp/leak.hprof`).\n\n" +
        "**2. Подтвердить, что это именно leak, а не нормальный рост.** Смотрим GC-логи (`-Xlog:gc*:file=gc.log` в Java 9+). Признаки утечки:\n" +
        "• После Full GC used heap не падает до прежнего уровня (монотонный рост baseline).\n" +
        "• Интервалы между GC сокращаются, длительность растет.\n" +
        "• Пик Old Gen после GC приближается к max heap.\n\n" +
        "**3. Анализ дампа в Eclipse MAT:**\n" +
        "• Leak Suspects Report -- автоматически показывает подозрительные объекты.\n" +
        "• Dominator Tree -- какой объект удерживает больше всего retained heap.\n" +
        "• Histogram -- топ классов по количеству и размеру. Обычные подозреваемые: HashMap$Node, char[]/byte[], ArrayList.\n" +
        "• Path to GC Roots (exclude weak/soft) для подозрительных объектов -- покажет, кто держит ссылку.\n\n" +
        "**4. Типичные виновники:**\n" +
        "• Статическая коллекция используется как кеш без eviction (Map кидает записи, но не удаляет).\n" +
        "• ThreadLocal в thread-pool'е -- threads живут вечно, ThreadLocal-значения накапливаются.\n" +
        "• Listener'ы / observer'ы без отписки.\n" +
        "• Неправильно закрытые ресурсы (Statement, ResultSet, InputStream).\n" +
        "• Внутренние классы (inner class) неявно держат ссылку на enclosing instance.\n\n" +
        "**5. Быстрая live-проверка без дампа:**\n" +
        "```\n" +
        "jcmd <pid> GC.class_histogram | head -30   # топ-классы\n" +
        "jstat -gcutil <pid> 1s                     # метрики GC в реальном времени\n" +
        "jmap -histo:live <pid> | head -30          # после форсированного GC\n" +
        "```\n\n" +
        "**6. Фикс + proof.** После правки запустить нагрузочный тест на несколько часов с мониторингом Old Gen -- baseline должен стабилизироваться, а не расти.\n\n---\n\n" +
        "Playbook:\n\n" +
        "**1. Make sure a heap dump already exists.** The service must run with `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/logs/heap/`. If not, add it immediately and wait for the next crash (or capture a live dump before the crash: `jcmd <pid> GC.heap_dump /tmp/leak.hprof`).\n\n" +
        "**2. Confirm it's a leak, not normal growth.** Check GC logs (`-Xlog:gc*:file=gc.log` in Java 9+). Leak signals:\n" +
        "• After Full GC, used heap doesn't drop back to the previous baseline (monotonic growth).\n" +
        "• GC intervals shrink, durations grow.\n" +
        "• Old Gen peak after GC trends toward max heap.\n\n" +
        "**3. Analyze the dump in Eclipse MAT:**\n" +
        "• Leak Suspects Report — auto-identifies suspicious accumulators.\n" +
        "• Dominator Tree — which object retains the most heap.\n" +
        "• Histogram — top classes by count and size. Usual suspects: `HashMap$Node`, `char[]`/`byte[]`, `ArrayList`.\n" +
        "• Path to GC Roots (exclude weak/soft) for suspects — reveals who's holding the reference.\n\n" +
        "**4. Typical culprits:**\n" +
        "• A static collection used as a cache without eviction (Map keeps inserting, never removes).\n" +
        "• ThreadLocal in a thread pool — threads live forever, ThreadLocal values accumulate.\n" +
        "• Listeners/observers never unregistered.\n" +
        "• Resources not closed (Statement, ResultSet, InputStream).\n" +
        "• Non-static inner classes implicitly holding the enclosing instance.\n\n" +
        "**5. Quick live checks without a dump:**\n" +
        "```\n" +
        "jcmd <pid> GC.class_histogram | head -30   # top classes\n" +
        "jstat -gcutil <pid> 1s                     # live GC metrics\n" +
        "jmap -histo:live <pid> | head -30          # after a forced GC\n" +
        "```\n\n" +
        "**6. Fix + proof.** After the fix, run a multi-hour load test while watching Old Gen — the baseline must stabilize, not keep climbing.",
      difficulty: "senior",
    },
  ],
  tip: "Когда слышите вопрос 'где X живет в памяти?', думайте так: статика/метаданные классов -> Metaspace, объекты -> Heap, локальные переменные-ссылки -> Stack (но объект, на который они указывают, все равно в Heap).\n\n---\n\n" +
    "When you hear 'where does X live in memory?', think: static/class metadata -> Metaspace, objects -> Heap, local variable references -> Stack (but the object they point to is still on the heap).",
  springConnection: {
    concept: "JVM Memory Areas",
    springFeature: "Spring Application Context & Bean Scopes",
    explanation:
      "Spring singleton beans live as objects on the heap for the entire application lifetime, referenced by the ApplicationContext. Prototype-scoped beans are also on the heap but become eligible for GC once your code releases the reference. Understanding heap vs. Metaspace matters for diagnosing Spring Boot memory issues — a large number of proxy classes (from AOP, CGLIB) can bloat Metaspace, while too many singleton beans with large state can exhaust the heap.",
  },
};
