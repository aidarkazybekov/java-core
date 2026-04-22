import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-6",
  blockId: 3,
  title: "Access Modifiers & static",
  summary:
    "Четыре модификатора доступа: `private` (класс), default/package-private (пакет), `protected` (наследники + пакет), `public` (везде). `static` — член принадлежит **классу**, а не экземпляру; живёт в Metaspace, инициализируется один раз через `<clinit>`. Правило: делайте всё максимально приватным и расширяйте только по обоснованию.\n\n---\n\n" +
    "Four access modifiers: `private` (class), default/package-private (package), `protected` (subclasses + package), `public` (everywhere). `static` — the member belongs to the **class**, not an instance; lives in Metaspace, initialised once via `<clinit>`. Rule: keep everything as private as possible and widen only with justification.",
  deepDive:
    "## Четыре уровня доступа\n\n" +
    "| Модификатор | Сам класс | Пакет | Наследники (др. пакет) | Везде |\n" +
    "|-------------|-----------|-------|------------------------|-------|\n" +
    "| `private` | ✓ | | | |\n" +
    "| default (нет ключевого слова) | ✓ | ✓ | | |\n" +
    "| `protected` | ✓ | ✓ | ✓ | |\n" +
    "| `public` | ✓ | ✓ | ✓ | ✓ |\n\n" +
    "**Top-level классы** могут быть только `public` или default. Inner/nested классы — все четыре.\n\n" +
    "> [!gotcha]\n" +
    "> `protected` член доступен потомку в другом пакете **только через наследование** — не через sibling-инстанс. `parent.protectedField` из метода потомка, когда `parent` — ссылка на другой объект-родитель, **не** компилируется (если мы в другом пакете).\n\n" +
    "**Правило инкапсуляции**: используйте **самый ограничивающий** модификатор, совместимый с задачей. Поля — почти всегда `private`, доступ через методы (или никак — для immutable).\n\n" +
    "## Java Module System (JPMS, Java 9+)\n\n" +
    "Даже `public` класс недоступен вне модуля, если модуль не **экспортирует** пакет:\n\n" +
    "```java\n" +
    "// module-info.java\n" +
    "module com.example.core {\n" +
    "    exports com.example.core.api;      // доступно всем\n" +
    "    exports com.example.core.internal to com.example.trusted;  // qualified export\n" +
    "}\n" +
    "```\n\n" +
    "Это добавляет пятый уровень контроля — **модульная видимость**.\n\n" +
    "## static\n\n" +
    "**Семантика**: член принадлежит **классу**, а не экземпляру.\n\n" +
    "- Статическое поле — одно на классhash: хранится в **Metaspace** (метаданные класса), не на куче per-object.\n" +
    "- Статический метод — нет `this`, нет `super`, не может ссылаться на instance-поля напрямую.\n" +
    "- **Статический блок** `static { ... }` — выполняется один раз при инициализации класса (в `<clinit>`).\n" +
    "- Static-члены инициализируются **в текстовом порядке** объявления.\n\n" +
    "## Static vs instance\n\n" +
    "| | Static | Instance |\n" +
    "|--|--------|----------|\n" +
    "| Где хранится | Metaspace | Heap (в составе объекта) |\n" +
    "| Когда инициализируется | Один раз при загрузке класса | На каждом `new` |\n" +
    "| Access | `Class.member` или `instance.member` (IDE warn) | Только через `instance` |\n" +
    "| Полиморфизм | Нет — static binding (hiding, не overriding) | Да — virtual dispatch |\n" +
    "| `this` / `super` | Нет | Да |\n\n" +
    "## Static factory methods\n\n" +
    "Паттерн из Effective Java: приватный конструктор + публичный static-метод.\n\n" +
    "```java\n" +
    "public class Duration {\n" +
    "    private Duration(long ns) { ... }\n" +
    "    public static Duration ofSeconds(long s)    { return new Duration(s * 1_000_000_000L); }\n" +
    "    public static Duration ofMillis(long ms)    { return new Duration(ms * 1_000_000L); }\n" +
    "    public static Duration ofNanos(long ns)     { return new Duration(ns); }\n" +
    "}\n" +
    "```\n\n" +
    "**Преимущества перед конструкторами**:\n" +
    "- Имена описательные: `Duration.ofSeconds(5)` vs `new Duration(5, SECONDS)`.\n" +
    "- Можно **кэшировать** (см. `Integer.valueOf`, `Boolean.valueOf`, `Optional.empty()`).\n" +
    "- Можно возвращать подтип.\n" +
    "- Могут быть `static` в разных классах — фабрика для иерархии (`List.of(...)`, `Set.of(...)`).\n\n" +
    "JDK: `Integer.valueOf`, `Optional.of` / `empty`, `List.of`, `Collectors.toList`, `EnumSet.of`.\n\n" +
    "## Static initialization — порядок и ловушки\n\n" +
    "Static-поля и блоки инициализируются в **текстовом порядке** объявления. Ссылка на поле, объявленное ниже, увидит дефолт:\n\n" +
    "```java\n" +
    "class Oops {\n" +
    "    static int a = b + 1;  // b = 0 (default) — a = 1\n" +
    "    static int b = 10;\n" +
    "}\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> **Циклические static-зависимости** между классами могут привести к тому, что класс используется до завершения инициализации → `NullPointerException` или `ExceptionInInitializerError`. Если `<clinit>` бросит исключение — класс помечается **permanently unusable**, любой последующий доступ бросит `NoClassDefFoundError`.\n\n" +
    "## Initialization-on-Demand Holder\n\n" +
    "Лучший паттерн для thread-safe lazy singleton без синхронизации:\n\n" +
    "```java\n" +
    "public class Singleton {\n" +
    "    private Singleton() {}\n" +
    "    private static class Holder {\n" +
    "        static final Singleton INSTANCE = new Singleton();\n" +
    "    }\n" +
    "    public static Singleton getInstance() {\n" +
    "        return Holder.INSTANCE;\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "Работает благодаря гарантиям JLS §12.4.1: класс **не инициализируется** до первого активного использования. Первый вызов `getInstance()` триггерит загрузку `Holder` — `<clinit>` запускается. JVM гарантирует, что `<clinit>` выполняется под **class init lock** — thread-safe.\n\n" +
    "**Лучше, чем double-checked locking** (требует `volatile` + тонкая работа с JMM). Проще, чем eager singleton (`public static final Singleton INSTANCE = new Singleton();`) — действительно ленив.\n\n" +
    "**Enum singleton** (Bloch) — ещё проще и защищён от reflection/serialization атак:\n" +
    "```java\n" +
    "public enum Singleton { INSTANCE; public void doWork() { ... } }\n" +
    "```\n\n---\n\n" +
    "## Four access levels\n\n" +
    "| Modifier | Same class | Package | Subclass (other pkg) | Anywhere |\n" +
    "|----------|------------|---------|----------------------|----------|\n" +
    "| `private` | ✓ | | | |\n" +
    "| default (no keyword) | ✓ | ✓ | | |\n" +
    "| `protected` | ✓ | ✓ | ✓ | |\n" +
    "| `public` | ✓ | ✓ | ✓ | ✓ |\n\n" +
    "**Top-level classes** can only be `public` or default. Inner/nested classes — all four.\n\n" +
    "> [!gotcha]\n" +
    "> A `protected` member is accessible from a subclass in another package **only through inheritance** — not through a sibling instance. `parent.protectedField` from a subclass method, where `parent` is another parent-typed reference, **won't** compile (when we're in a different package).\n\n" +
    "**Encapsulation rule**: use the **most restrictive** modifier compatible with the task. Fields — almost always `private`, accessed via methods (or not at all — for immutables).\n\n" +
    "## Java Module System (JPMS, Java 9+)\n\n" +
    "Even a `public` class is inaccessible from outside the module unless the module **exports** the package:\n\n" +
    "```java\n" +
    "// module-info.java\n" +
    "module com.example.core {\n" +
    "    exports com.example.core.api;      // public to all\n" +
    "    exports com.example.core.internal to com.example.trusted;  // qualified export\n" +
    "}\n" +
    "```\n\n" +
    "This adds a fifth layer of control — **module visibility**.\n\n" +
    "## static\n\n" +
    "**Semantics**: the member belongs to the **class**, not an instance.\n\n" +
    "- A static field is one per class: stored in **Metaspace** (class metadata), not on the heap per object.\n" +
    "- A static method has no `this`, no `super`, can't reference instance fields directly.\n" +
    "- A **static block** `static { ... }` runs once when the class initialises (in `<clinit>`).\n" +
    "- Static members initialise **in declaration order**.\n\n" +
    "## Static vs instance\n\n" +
    "| | Static | Instance |\n" +
    "|--|--------|----------|\n" +
    "| Stored where | Metaspace | Heap (inside the object) |\n" +
    "| When initialised | Once, at class load | On every `new` |\n" +
    "| Access | `Class.member` or `instance.member` (IDE warn) | Only via `instance` |\n" +
    "| Polymorphism | No — static binding (hiding, not overriding) | Yes — virtual dispatch |\n" +
    "| `this` / `super` | No | Yes |\n\n" +
    "## Static factory methods\n\n" +
    "A pattern from Effective Java: private constructor + public static method.\n\n" +
    "```java\n" +
    "public class Duration {\n" +
    "    private Duration(long ns) { ... }\n" +
    "    public static Duration ofSeconds(long s)    { return new Duration(s * 1_000_000_000L); }\n" +
    "    public static Duration ofMillis(long ms)    { return new Duration(ms * 1_000_000L); }\n" +
    "    public static Duration ofNanos(long ns)     { return new Duration(ns); }\n" +
    "}\n" +
    "```\n\n" +
    "**Advantages over constructors**:\n" +
    "- Descriptive names: `Duration.ofSeconds(5)` vs `new Duration(5, SECONDS)`.\n" +
    "- Can **cache** instances (see `Integer.valueOf`, `Boolean.valueOf`, `Optional.empty()`).\n" +
    "- Can return a subtype.\n" +
    "- Can be `static` across classes — factories for a hierarchy (`List.of(...)`, `Set.of(...)`).\n\n" +
    "JDK: `Integer.valueOf`, `Optional.of` / `empty`, `List.of`, `Collectors.toList`, `EnumSet.of`.\n\n" +
    "## Static initialisation — order and traps\n\n" +
    "Static fields and blocks initialise **in declaration order**. A reference to a field declared later sees the default:\n\n" +
    "```java\n" +
    "class Oops {\n" +
    "    static int a = b + 1;  // b = 0 (default) — a = 1\n" +
    "    static int b = 10;\n" +
    "}\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> **Cyclic static dependencies** between classes can cause a class to be used before initialisation completes → `NullPointerException` or `ExceptionInInitializerError`. If `<clinit>` throws — the class is marked **permanently unusable**, any later access throws `NoClassDefFoundError`.\n\n" +
    "## Initialization-on-Demand Holder\n\n" +
    "The best pattern for thread-safe lazy singletons without synchronisation:\n\n" +
    "```java\n" +
    "public class Singleton {\n" +
    "    private Singleton() {}\n" +
    "    private static class Holder {\n" +
    "        static final Singleton INSTANCE = new Singleton();\n" +
    "    }\n" +
    "    public static Singleton getInstance() {\n" +
    "        return Holder.INSTANCE;\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "It works thanks to JLS §12.4.1 guarantees: a class is **not initialised** until first active use. The first call to `getInstance()` triggers loading of `Holder` — its `<clinit>` runs. The JVM guarantees `<clinit>` is executed under the **class init lock** — thread-safe.\n\n" +
    "**Better than double-checked locking** (requires `volatile` + careful JMM reasoning). Simpler than an eager singleton (`public static final Singleton INSTANCE = new Singleton();`) — genuinely lazy.\n\n" +
    "**Enum singleton** (Bloch) — even simpler and immune to reflection/serialisation attacks:\n" +
    "```java\n" +
    "public enum Singleton { INSTANCE; public void doWork() { ... } }\n" +
    "```",
  code: `public class Counter {
    private static int totalCount = 0;
    private int localCount = 0;

    static {
        System.out.println("Counter class loaded, totalCount initialized");
    }

    public void increment() {
        localCount++;
        totalCount++;
    }

    public static int getTotalCount() {
        return totalCount;
    }

    private Counter() {}

    public static Counter create() {
        return new Counter();
    }

    public static void main(String[] args) {
        Counter a = Counter.create();
        Counter b = Counter.create();

        a.increment();
        a.increment();
        b.increment();

        System.out.println(a.localCount);         // 2
        System.out.println(b.localCount);         // 1
        System.out.println(Counter.getTotalCount()); // 3 (shared)
    }
}

// --- Initialization-on-Demand Holder idiom ---
public class Singleton {
    private Singleton() {}

    // Inner class is not loaded until getInstance() is called
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Holder.INSTANCE;  // thread-safe, lazy, no synchronization
    }
}`,
  interviewQs: [
    {
      id: "3-6-q0",
      q:
        "Какие четыре модификатора доступа в Java и их области видимости?\n\n---\n\n" +
        "What are the four access modifiers in Java and their scopes?",
      a:
        "- **`private`** — только свой класс. Даже потомки не имеют доступа.\n" +
        "- **default** (без ключевого слова) — свой пакет (package-private).\n" +
        "- **`protected`** — свой пакет + потомки (в других пакетах, но только через наследование).\n" +
        "- **`public`** — везде.\n\n" +
        "**Top-level класс** — только `public` или default. **Nested/inner** — все четыре. С JPMS даже `public` класс невидим вне модуля, если пакет не экспортирован.\n\n" +
        "Общее правило: **максимум ограничений**. Поля — почти всегда `private`.\n\n---\n\n" +
        "- **`private`** — same class only. Not even subclasses can access.\n" +
        "- **default** (no keyword) — same package (package-private).\n" +
        "- **`protected`** — same package + subclasses in other packages (only through inheritance).\n" +
        "- **`public`** — everywhere.\n\n" +
        "**Top-level class** — only `public` or default. **Nested/inner** — all four. With JPMS, even a `public` class is invisible outside the module unless the package is exported.\n\n" +
        "General rule: **be as restrictive as possible**. Fields — almost always `private`.",
      difficulty: "junior",
    },
    {
      id: "3-6-q1",
      q:
        "Можно ли переопределить static-метод? Что произойдёт при объявлении такого же метода в подклассе?\n\n---\n\n" +
        "Can a static method be overridden? What happens if a subclass declares the same method?",
      a:
        "Нет, static-методы **не переопределяются** — у них compile-time binding по типу ссылки, не по runtime-типу объекта. Если потомок объявит static-метод с той же сигнатурой — он **скрывает** (hides) метод родителя, не переопределяет.\n\n" +
        "```java\n" +
        "class Parent { static String tag() { return \"P\"; } }\n" +
        "class Child extends Parent { static String tag() { return \"C\"; } }\n\n" +
        "Parent p = new Child();\n" +
        "p.tag();       // \"P\" — по типу ссылки, не по объекту\n" +
        "Child.tag();   // \"C\"\n" +
        "```\n\n" +
        "Полиморфизм не применим. Поэтому static **нельзя** использовать там, где нужна поздняя связка поведения — это корень многих проблем с мокированием: классический Mockito (до 3.4) не мог мокать static-методы именно потому, что они решаются compile-time.\n\n---\n\n" +
        "No, static methods are **not overridden** — they have compile-time binding by the reference type, not the object's runtime type. If a subclass declares a static method with the same signature, it **hides** the parent's method, doesn't override it.\n\n" +
        "```java\n" +
        "class Parent { static String tag() { return \"P\"; } }\n" +
        "class Child extends Parent { static String tag() { return \"C\"; } }\n\n" +
        "Parent p = new Child();\n" +
        "p.tag();       // \"P\" — by reference type, not object\n" +
        "Child.tag();   // \"C\"\n" +
        "```\n\n" +
        "Polymorphism doesn't apply. So static **cannot** be used where you need late behaviour binding — root cause of many mocking problems: classic Mockito (before 3.4) couldn't mock static methods precisely because they bind at compile time.",
      difficulty: "mid",
    },
    {
      id: "3-6-q2",
      q:
        "Объясните Initialization-on-Demand Holder и почему он предпочтительнее double-checked locking для singleton.\n\n---\n\n" +
        "Explain the Initialization-on-Demand Holder idiom and why it's preferable to double-checked locking for a singleton.",
      a:
        "Паттерн использует **приватный static nested-класс** с `static final` инстансом:\n\n" +
        "```java\n" +
        "public class Singleton {\n" +
        "    private Singleton() {}\n" +
        "    private static class Holder {\n" +
        "        static final Singleton INSTANCE = new Singleton();\n" +
        "    }\n" +
        "    public static Singleton getInstance() { return Holder.INSTANCE; }\n" +
        "}\n" +
        "```\n\n" +
        "По JLS §12.4.1, класс **не инициализируется** до первого активного использования. Первый `getInstance()` триггерит загрузку `Holder`, `<clinit>` создаёт инстанс. JVM гарантирует, что `<clinit>` выполняется под class init lock — **thread-safe by construction**.\n\n" +
        "**Преимущества перед DCL**:\n" +
        "- Нет необходимости в `volatile` и синхронизации на call-site.\n" +
        "- Невозможно неправильно написать — ошибки в DCL (особенно до Java 5 с ослабленной JMM) были легендарными.\n" +
        "- Ленивый: `INSTANCE` создаётся только при первом вызове `getInstance()`.\n\n" +
        "**Ещё проще — enum singleton** (Bloch, Effective Java):\n" +
        "```java\n" +
        "public enum Singleton { INSTANCE; public void doWork() { ... } }\n" +
        "```\n" +
        "Thread-safe, serializable правильно, защищён от reflection-атак.\n\n---\n\n" +
        "The pattern uses a **private static nested class** with a `static final` instance:\n\n" +
        "```java\n" +
        "public class Singleton {\n" +
        "    private Singleton() {}\n" +
        "    private static class Holder {\n" +
        "        static final Singleton INSTANCE = new Singleton();\n" +
        "    }\n" +
        "    public static Singleton getInstance() { return Holder.INSTANCE; }\n" +
        "}\n" +
        "```\n\n" +
        "Per JLS §12.4.1, a class is **not initialised** until first active use. The first `getInstance()` triggers loading of `Holder`, whose `<clinit>` creates the instance. The JVM guarantees `<clinit>` runs under the class init lock — **thread-safe by construction**.\n\n" +
        "**Advantages over DCL**:\n" +
        "- No need for `volatile` or call-site synchronisation.\n" +
        "- Impossible to get wrong — DCL bugs (especially pre-Java-5 with a looser JMM) were legendary.\n" +
        "- Lazy: `INSTANCE` is created only on the first `getInstance()` call.\n\n" +
        "**Even simpler — enum singleton** (Bloch, Effective Java):\n" +
        "```java\n" +
        "public enum Singleton { INSTANCE; public void doWork() { ... } }\n" +
        "```\n" +
        "Thread-safe, serialises correctly, immune to reflection attacks.",
      difficulty: "senior",
    },
  ],
  tip:
    "Когда интервьюер спрашивает про static, упомяните, что static-методы нельзя легко мокать в классическом Mockito (до 3.4). Это показывает, что вы понимаете тестовые последствия дизайн-решений, а не только семантику языка.\n\n---\n\n" +
    "When asked about static in interviews, mention that static methods can't be easily mocked in classic Mockito (pre-3.4). That shows you understand the testing implications of design decisions, not just language semantics.",
  springConnection: {
    concept: "static & Access Modifiers",
    springFeature: "Spring Bean Scopes & Utility Classes",
    explanation:
      "Spring singleton-бины — **не** Java `static` singletons. Один инстанс **на ApplicationContext**, а не на classloader. Разные контексты → разные инстансы. Это важно в тестах со `@SpringBootTest` — каждый тест может иметь свой контекст и, значит, свой singleton.\n\n" +
      "`@Bean`-методы в `@Configuration`-классах — **instance-методы** (CGLIB-проксируются), **не** static. Это осознанное ограничение: static-метод нельзя перехватить для проверки scope и inter-bean-зависимостей. Если сделать `@Bean`-метод `static`, Spring теряет возможность возвращать одну и ту же singleton-ссылку при внутренних вызовах — появляются дубликаты бина.\n\n---\n\n" +
      "Spring singleton beans are **not** Java `static` singletons. One instance **per ApplicationContext**, not per classloader. Different contexts → different instances. This matters in `@SpringBootTest` — each test may have its own context, thus its own singleton.\n\n" +
      "`@Bean` methods on `@Configuration` classes are **instance methods** (CGLIB-proxied), **not** static. A deliberate restriction: a static method can't be intercepted for scope management and inter-bean references. If you mark a `@Bean` method `static`, Spring loses the ability to return the same singleton on internal calls — duplicate beans appear.",
  },
};
