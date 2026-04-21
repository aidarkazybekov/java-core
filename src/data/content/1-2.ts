import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-2",
  blockId: 1,
  title: "JDK vs JRE vs JVM",
  summary:
    "JVM исполняет байт-код Java. JRE -- минимально-необходимая реализация виртуальной машины для исполнения Java-приложения (JVM + стандартные библиотеки). JDK -- среда для разработки, включающая JRE и компилятор (javac). Коротко: JDK содержит JRE, которая содержит JVM. С Java 11 отдельный JRE больше не поставляется.\n\n---\n\n" +
    "JDK, JRE, and JVM are nested layers of the Java platform. Confusing them is a red flag in interviews. The JDK is for development (compiler + tools + JRE), the JRE is for running apps (libraries + JVM), and the JVM is the actual bytecode execution engine. Since Java 11, the JRE is no longer distributed separately.",
  deepDive:
    "## Три вложенных слоя\n\n" +
    "- **JVM (Java Virtual Machine)** — спецификация + реализация, которая исполняет байт-код. Это абстрактная машина: HotSpot, OpenJ9, GraalVM, Azul Zing — разные реализации одной спецификации. Загрузка классов, GC, исполнение байт-кода. НЕ включает стандартную библиотеку или инструменты.\n" +
    "- **JRE (Java Runtime Environment)** — JVM + Java Class Library (`rt.jar` до Java 8, модули после) + вспомогательные файлы. Минимум для запуска скомпилированного приложения.\n" +
    "- **JDK (Java Development Kit)** — всё из JRE + инструменты: `javac` (компилятор), `javap` (дизассемблер), `jdb` (отладчик), `jconsole` / `jvisualvm`, `jmap` / `jstack` / `jstat`, `jlink`.\n\n" +
    "**Запомните иерархию**: JDK ⊃ JRE ⊃ JVM.\n\n" +
    "## Что изменилось в Java 11\n\n" +
    "Начиная с Java 11, Oracle перестал выпускать отдельный JRE. Вы получаете полный JDK и используете `jlink`, чтобы собрать кастомный минимальный runtime с только нужными модулями.\n\n" +
    "> [!production]\n" +
    "> Образы `eclipse-temurin:21-jre` и подобные — это НЕ традиционный JRE, а собранные через `jlink` кастомные рантаймы. Полноценный JDK-образ ~300MB, `jlink`-оптимизированный может быть ~40MB. Для контейнеров это критично.\n\n" +
    "## Классическая ловушка\n\n" +
    "> [!gotcha]\n" +
    "> «Можно ли запустить Java-приложение имея только JVM?» — **Нет**. JVM без стандартной библиотеки не может ничего полезного. Даже `public static void main` требует `java.lang.String`, `java.lang.Object` и т.д.\n\n---\n\n" +
    "## Three nested layers\n\n" +
    "- **JVM (Java Virtual Machine)** — a specification + implementation that executes bytecode. An abstract machine: HotSpot, OpenJ9, GraalVM, Azul Zing are different implementations of the same spec. Handles class loading, GC, execution. Does NOT include the standard library or tooling.\n" +
    "- **JRE (Java Runtime Environment)** — JVM + Java Class Library (`rt.jar` pre-Java-8, modules after) + supporting files. Minimum needed to run a compiled app.\n" +
    "- **JDK (Java Development Kit)** — everything in the JRE plus tools: `javac` (compiler), `javap` (disassembler), `jdb` (debugger), `jconsole` / `jvisualvm`, `jmap` / `jstack` / `jstat`, `jlink`.\n\n" +
    "**Memorise the containment**: JDK ⊃ JRE ⊃ JVM.\n\n" +
    "## What changed in Java 11\n\n" +
    "Since Java 11, Oracle stopped shipping a separate JRE. You install the full JDK and use `jlink` to build a custom minimal runtime with only the modules your app needs.\n\n" +
    "> [!production]\n" +
    "> Images like `eclipse-temurin:21-jre` are NOT the traditional JRE — they're `jlink`-built custom runtimes. A full JDK image is ~300MB; a `jlink`-optimised one can be ~40MB. For containers this matters a lot.\n\n" +
    "## Classic interview trap\n\n" +
    "> [!gotcha]\n" +
    "> \"Can you run a Java application with just the JVM?\" — **No**. The JVM alone cannot execute anything useful; even a trivial `public static void main` needs `java.lang.String`, `java.lang.Object` and other classes from the standard library that the JRE provides.",
  code:
    `// Inspecting which layer you're running on
public class JavaPlatformInfo {
    public static void main(String[] args) {
        // JVM information
        System.out.println("=== JVM ===");
        System.out.println("JVM Name:    " + System.getProperty("java.vm.name"));
        System.out.println("JVM Vendor:  " + System.getProperty("java.vm.vendor"));
        System.out.println("JVM Version: " + System.getProperty("java.vm.version"));

        // JRE information
        System.out.println("\\n=== JRE ===");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home:    " + System.getProperty("java.home"));
        System.out.println("Spec Version: " + System.getProperty("java.specification.version"));

        // JDK tools detection — are we running from a JDK?
        System.out.println("\\n=== JDK Detection ===");
        String javaHome = System.getProperty("java.home");
        java.io.File javac = new java.io.File(javaHome, "bin/javac");
        java.io.File javacExe = new java.io.File(javaHome, "bin/javac.exe");
        boolean isJdk = javac.exists() || javacExe.exists();
        System.out.println("Running from JDK: " + isJdk);

        // Module system (Java 9+) — shows the modular JRE
        System.out.println("\\n=== Module System ===");
        Module mod = String.class.getModule();
        System.out.println("String is in module: " + mod.getName());
        System.out.println("Module layer present: " + (mod.getLayer() != null));

        // Available processors and memory (JVM-level)
        System.out.println("\\n=== Runtime ===");
        Runtime rt = Runtime.getRuntime();
        System.out.println("Available processors: " + rt.availableProcessors());
        System.out.println("Max memory (MB): " + rt.maxMemory() / 1024 / 1024);
    }
}`,
  interviewQs: [
    {
      id: "1-2-q0",
      q:
        "Что такое JDK, JRE и JVM? Как они связаны?\n\n---\n\n" +
        "What is the relationship between JDK, JRE, and JVM?",
      a:
        "Три вложенных слоя.\n\n" +
        "- **JVM** — движок исполнения байт-кода (класслоадер, GC, интерпретатор, JIT).\n" +
        "- **JRE** = JVM + стандартная библиотека Java + runtime-ресурсы, нужные для реального запуска программ.\n" +
        "- **JDK** = JRE + инструменты разработки: `javac`, `javap`, `jdb`, `jmap`, `jstack`, `jlink` и др.\n\n" +
        "С Java 11 отдельный JRE больше не поставляется — JDK единственный дистрибутив, а `jlink` позволяет собирать минимальные кастомные рантаймы под своё приложение.\n\n---\n\n" +
        "They are nested layers.\n\n" +
        "- **JVM** — bytecode execution engine (class loading, GC, interpreter, JIT).\n" +
        "- **JRE** = JVM + Java standard library + the runtime resources needed to actually run programs.\n" +
        "- **JDK** = JRE + development tools: `javac`, `javap`, `jdb`, `jmap`, `jstack`, `jlink`, and more.\n\n" +
        "Since Java 11 the standalone JRE is not shipped anymore — the JDK is the only distribution, and `jlink` builds minimal custom runtimes tailored to your application.",
      difficulty: "junior",
    },
    {
      id: "1-2-q1",
      q:
        "Что изменилось в поставке JDK/JRE начиная с Java 11 и почему это важно для деплоя?\n\n---\n\n" +
        "What changed about JDK/JRE distribution starting with Java 11, and why does it matter for deployments?",
      a:
        "С Java 11 и новой каденцией релизов Oracle прекратил выпускать отдельный JRE. Для деплоя это значит: либо поставлять полный JDK (большой образ ~300MB), либо собирать через `jlink` минимальный рантайм, содержащий только используемые модули.\n\n" +
        "Для контейнеров разница существенна: JDK-образ ~300MB, `jlink`-оптимизированный рантайм может быть <50MB. Образы вроде `eclipse-temurin:21-jre` — это не классический JRE, а `jlink`-сборки.\n\n```\n# пример сборки кастомного рантайма\njlink --add-modules java.base,java.logging,java.sql \\\n      --output my-runtime --strip-debug --compress=2\n```\n\n---\n\n" +
        "Starting with Java 11 and the new release cadence, Oracle stopped shipping a standalone JRE. For deployments that means either ship a full JDK (a larger ~300MB image) or use `jlink` to assemble a minimal runtime containing only the modules your app actually uses.\n\n" +
        "For containers the difference is meaningful: a JDK image is ~300MB, a `jlink`-optimised runtime can be <50MB. Images like `eclipse-temurin:21-jre` are actually `jlink`-built custom runtimes, not the traditional JRE.\n\n```\n# example — building a custom runtime\njlink --add-modules java.base,java.logging,java.sql \\\n      --output my-runtime --strip-debug --compress=2\n```",
      difficulty: "mid",
    },
    {
      id: "1-2-q2",
      q:
        "Назовите три разные реализации JVM и объясните, когда имеет смысл выбирать одну вместо другой.\n\n---\n\n" +
        "Name three different JVM implementations and explain when you might choose one over another.",
      a:
        "- **HotSpot (OpenJDK / Oracle)** — дефолт, проверен временем, хорошо документирован. База для большинства приложений.\n" +
        "- **Eclipse OpenJ9 (IBM)** — меньший memory footprint и быстрее стартует, чем HotSpot. Подходит для контейнерных микросервисов, где память ограничена и важен быстрый cold start.\n" +
        "- **GraalVM** — даёт AOT-компиляцию в нативный бинарник через `native-image`: мгновенный старт и низкий расход памяти, но ограничения на рефлексию и динамическую загрузку классов.\n\n" +
        "Выбор под сценарий:\n" +
        "- Spring Boot микросервис в Kubernetes с жёсткими лимитами по памяти и частым масштабированием → OpenJ9 или GraalVM native-image.\n" +
        "- Долгоживущий монолит, где важна пиковая пропускная способность → HotSpot с C2 JIT.\n\n---\n\n" +
        "- **HotSpot (OpenJDK / Oracle)** — the default. Battle-tested, well-documented, the baseline for most apps.\n" +
        "- **Eclipse OpenJ9 (IBM)** — smaller memory footprint and faster startup than HotSpot. Attractive for containerised microservices where memory is tight and cold start matters.\n" +
        "- **GraalVM** — offers AOT compilation to native binaries via `native-image`, giving near-instant startup and low memory, at the cost of reflection / dynamic class loading limitations.\n\n" +
        "Picking by scenario:\n" +
        "- Spring Boot microservice in Kubernetes with tight memory limits and frequent scaling → OpenJ9 or GraalVM native-image.\n" +
        "- Long-running monolith where peak throughput is the goal → HotSpot with its mature C2 JIT.",
      difficulty: "senior",
    },
  ],
  tip:
    "Запомните вложенность: JDK содержит JRE, а JRE содержит JVM. С Java 11 отдельный JRE больше не поставляется — используйте `jlink` для создания минимальных рантаймов в контейнерах.\n\n---\n\n" +
    "Remember the nesting: JDK contains JRE contains JVM. Since Java 11 the JRE is no longer shipped separately — mention `jlink` for custom runtimes in containers and you signal that you understand modern Java deployment.",
  springConnection: {
    concept: "JDK vs JRE in deployment",
    springFeature: "Spring Boot Docker Images & GraalVM Native Image",
    explanation:
      "Spring Boot 3.x умеет собирать GraalVM native-image через `spring-boot-maven-plugin` и профиль `native` — рантайм JVM полностью исчезает, остаётся standalone-бинарник.\n\n" +
      "Для JVM-деплоев layered jar Spring Boot дружит с `jlink`-сборкой кастомных рантаймов, что даёт минимальные Docker-образы. Paketo buildpack, используемый `spring-boot:build-image`, автоматически применяет эти оптимизации (CDS, `jlink`, сжатие слоёв).\n\n---\n\n" +
      "Spring Boot 3.x supports building GraalVM native images via the `spring-boot-maven-plugin` and the `native` profile — the JVM runtime is eliminated entirely, leaving a standalone binary.\n\n" +
      "For JVM-based deployments, Spring Boot's layered jar format pairs with `jlink`-built custom runtimes to produce minimal Docker images. The Paketo buildpack used by `spring-boot:build-image` applies these optimisations automatically (CDS, `jlink`, layer compression).",
  },
};
