import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-2",
  blockId: 2,
  title: "Variables & Scope",
  summary:
    "Четыре категории переменных в Java: локальные (стек), поля экземпляра (куча), статические поля (Metaspace) и параметры. Ключевые слова `final` / `static` / `var` и концепция **effectively final** — критичны для корректности и для работы лямбд.\n\n---\n\n" +
    "Java has four variable categories with different scopes and lifetimes: locals (stack), instance fields (heap), static fields (Metaspace), and parameters. Modifiers `final` / `static` / `var` and the **effectively final** concept are essential for correctness and for lambda capture.",
  deepDive:
    "## Четыре категории переменных\n\n" +
    "| Категория | Где живёт | Значение по умолчанию | Время жизни |\n" +
    "|-----------|-----------|------------------------|---------------|\n" +
    "| Локальная (в методе / блоке) | JVM Stack | **нет** (compile error) | до выхода из блока |\n" +
    "| Параметр метода | JVM Stack | инициализируется вызывающим | до возврата метода |\n" +
    "| Поле экземпляра | Heap | `0` / `false` / `null` | пока объект reachable |\n" +
    "| Статическое поле | Metaspace | `0` / `false` / `null` | пока classloader жив |\n\n" +
    "> [!gotcha]\n" +
    "> Локальные переменные **не инициализируются** автоматически. Использование неинициализированной локальной — compile error. У полей дефолты есть. Это намеренно: забыть инициализировать локальную — почти всегда баг, и компилятор ловит это (definite assignment analysis).\n\n" +
    "## final — применяется ко всему\n\n" +
    "- **К классу** — нельзя наследоваться (`public final class String`).\n" +
    "- **К методу** — нельзя переопределить.\n" +
    "- **К полю** — значение задаётся раз (либо в объявлении, либо в конструкторе / static-блоке).\n" +
    "- **К параметру / локальной** — нельзя переприсвоить.\n\n" +
    "`final` не делает объект immutable: `final List<String> list = new ArrayList<>();` — сам reference фиксирован, но `list.add(...)` разрешён. Для реальной неизменяемости — `List.copyOf(...)` или `Collections.unmodifiableList(...)`.\n\n" +
    "## static\n\n" +
    "`static` означает, что член принадлежит **классу**, а не экземпляру. Доступен без создания объекта. Ограничения:\n\n" +
    "- Статический метод не имеет `this` и `super`.\n" +
    "- Статические методы нельзя **переопределить** (они скрываются — hiding, не overriding). Полиморфизм на static не работает.\n" +
    "- Статическое поле инициализируется при первом использовании класса, через `<clinit>`.\n\n" +
    "## var — вывод типа (Java 10+)\n\n" +
    "`var` — это не динамическая типизация. Тип выводится **в compile time** и фиксируется. `var x = 42;` идентично `int x = 42;` на уровне байт-кода.\n\n" +
    "Ограничения: только локальные переменные **с инициализатором**. Не работает для полей, параметров, возвращаемых типов.\n\n" +
    "> [!gotcha]\n" +
    "> `var list = new ArrayList<>();` выведет `ArrayList<Object>`, не тот, что вы ожидали. Diamond-оператор без target type падает в `Object`. Пишите `new ArrayList<String>()` или используйте `List.of(...)`.\n\n" +
    "## Effectively final и лямбды\n\n" +
    "Локальные переменные, используемые в лямбдах и анонимных классах, должны быть **effectively final** — не меняться после инициализации.\n\n" +
    "Почему: лямбда захватывает **значение** переменной (её копию), а не ссылку на слот стека. Локальная живёт на стеке потока и уничтожается при возврате метода, но лямбда может пережить метод (например, передана в другой поток). Если бы значение менялось, копия в лямбде была бы устаревшей — Java запрещает эту непоследовательность.\n\n" +
    "Обходной путь для мутабельного состояния — захватить **ссылку на контейнер** (массив, `AtomicInteger`, свой holder). Ссылка финальна, содержимое — нет:\n\n" +
    "```java\n" +
    "int[] counter = {0};\n" +
    "list.forEach(x -> counter[0]++);  // OK — мутируем содержимое\n" +
    "```\n\n" +
    "## Shadowing и порядок инициализации\n\n" +
    "Локальная с тем же именем, что и поле, затеняет поле; доступ через `this.field`. Классика — конструктор `public User(String name) { this.name = name; }`.\n\n" +
    "> [!info]\n" +
    "> **Порядок инициализации класса** (важно на интервью):\n" +
    "> 1. Static-поля и static-блоки **от корня иерархии к потомку** (внутри класса — в порядке объявления).\n" +
    "> 2. При `new Foo()` — instance-поля и init-блоки, затем конструктор, опять от предка к потомку.\n\n---\n\n" +
    "## Four variable categories\n\n" +
    "| Category | Where it lives | Default value | Lifetime |\n" +
    "|----------|----------------|---------------|----------|\n" +
    "| Local (method / block) | JVM Stack | **none** (compile error) | until block exits |\n" +
    "| Method parameter | JVM Stack | initialised by caller | until method returns |\n" +
    "| Instance field | Heap | `0` / `false` / `null` | while object is reachable |\n" +
    "| Static field | Metaspace | `0` / `false` / `null` | while classloader is alive |\n\n" +
    "> [!gotcha]\n" +
    "> Local variables are **not** default-initialised. Using an uninitialised local is a compile error. Fields have defaults. This is deliberate: forgetting to initialise a local is nearly always a bug, and the compiler catches it (definite assignment analysis).\n\n" +
    "## final — applies to almost everything\n\n" +
    "- **On a class** — no inheritance (`public final class String`).\n" +
    "- **On a method** — can't be overridden.\n" +
    "- **On a field** — set once, in declaration, constructor, or static block.\n" +
    "- **On a parameter / local** — can't be reassigned.\n\n" +
    "`final` doesn't make the object immutable: `final List<String> list = new ArrayList<>();` — the reference is fixed, but `list.add(...)` is allowed. For real immutability use `List.copyOf(...)` or `Collections.unmodifiableList(...)`.\n\n" +
    "## static\n\n" +
    "`static` means the member belongs to the **class**, not an instance. Accessible without creating an object. Restrictions:\n\n" +
    "- Static methods have no `this` or `super`.\n" +
    "- Static methods can't be **overridden** (they are *hidden* — hiding, not overriding). Polymorphism doesn't apply.\n" +
    "- Static fields initialise on first class use, via `<clinit>`.\n\n" +
    "## var — local type inference (Java 10+)\n\n" +
    "`var` is **not** dynamic typing. The type is inferred at compile time and fixed. `var x = 42;` is identical to `int x = 42;` at the bytecode level.\n\n" +
    "Restrictions: only local variables **with an initialiser**. Not allowed for fields, parameters, or return types.\n\n" +
    "> [!gotcha]\n" +
    "> `var list = new ArrayList<>();` infers `ArrayList<Object>`, not what you expected. The diamond operator with no target type falls back to `Object`. Write `new ArrayList<String>()` or use `List.of(...)`.\n\n" +
    "## Effectively final and lambdas\n\n" +
    "Local variables used in lambdas and anonymous classes must be **effectively final** — not modified after initialisation.\n\n" +
    "Why: the lambda captures the **value** (a copy), not a reference to the stack slot. The local lives on the thread stack and dies when the method returns, but the lambda can outlive the method (stored in a field, passed to another thread). If the value could change, the lambda's copy would go stale — Java forbids that inconsistency.\n\n" +
    "Workaround for mutable state: capture a reference to a **mutable container** (array, `AtomicInteger`, a holder). The reference is final, the contents aren't:\n\n" +
    "```java\n" +
    "int[] counter = {0};\n" +
    "list.forEach(x -> counter[0]++);  // OK — mutating the array contents\n" +
    "```\n\n" +
    "## Shadowing and initialisation order\n\n" +
    "A local with the same name as a field shadows the field; access the field via `this.field`. Classic: `public User(String name) { this.name = name; }`.\n\n" +
    "> [!info]\n" +
    "> **Class initialisation order** (common interview question):\n" +
    "> 1. Static fields + static blocks **from the root of the hierarchy down to the subclass** (inside one class — declaration order).\n" +
    "> 2. On `new Foo()` — instance fields and init blocks, then the constructor body, again from parent to child.",
  code:
    `public class VariableScopeDemo {
    // Class variable (static) — lives in Metaspace, shared across all instances
    private static int instanceCount = 0;

    // Instance variable — lives on the heap, default value is 0
    private int id;

    // Instance variable — default value is null (NOT initialized)
    private String name;

    public VariableScopeDemo(String name) {
        // 'name' parameter shadows this.name field
        this.name = name; // 'this' disambiguates
        this.id = ++instanceCount;
    }

    public static void main(String[] args) {
        // === Default Values ===
        VariableScopeDemo obj = new VariableScopeDemo("test");
        System.out.println("Instance fields get defaults:");
        System.out.println("  id (set): " + obj.id);

        DefaultValues dv = new DefaultValues();
        System.out.println("  int: " + dv.intField);          // 0
        System.out.println("  boolean: " + dv.boolField);     // false
        System.out.println("  String: " + dv.refField);       // null

        // Local variable — must be initialized before use
        // int uninit;
        // System.out.println(uninit); // COMPILE ERROR: not initialized

        // === var (Java 10+) — type inference ===
        var message = "Hello";   // inferred as String (compile-time)
        var numbers = java.util.List.of(1, 2, 3); // List<Integer>
        // var nothing;           // COMPILE ERROR: cannot infer without initializer
        // var nullVal = null;    // COMPILE ERROR: cannot infer from null

        // GOTCHA: var with diamond operator
        var listBad = new java.util.ArrayList<>();    // ArrayList<Object>!
        var listGood = new java.util.ArrayList<String>(); // ArrayList<String>

        // === Effectively Final & Lambdas ===
        String prefix = "Item"; // effectively final — never reassigned
        // prefix = "Other";    // uncommenting makes it non-effectively-final

        java.util.List.of("A", "B", "C").forEach(item ->
            System.out.println(prefix + ": " + item) // OK: prefix is effectively final
        );

        // Workaround for mutable state in lambdas:
        int[] counter = {0}; // array reference is effectively final
        java.util.List.of("X", "Y", "Z").forEach(item -> {
            counter[0]++; // mutating array contents is fine
            System.out.println(counter[0] + ". " + item);
        });

        // === Block Scope ===
        {
            int blockScoped = 42;
            System.out.println("\\nBlock scoped: " + blockScoped);
        }
        // System.out.println(blockScoped); // COMPILE ERROR: out of scope

        // for-loop variable scope
        for (int i = 0; i < 3; i++) {
            // 'i' only exists inside this loop
        }
        // System.out.println(i); // COMPILE ERROR: 'i' out of scope
    }

    static class DefaultValues {
        int intField;        // default: 0
        boolean boolField;   // default: false
        String refField;     // default: null
    }
}`,
  interviewQs: [
    {
      id: "2-2-q0",
      q:
        "В чём разница в инициализации локальных переменных и полей?\n\n---\n\n" +
        "What's the difference between local variables and fields regarding initialisation?",
      a:
        "- **Поля** (instance и static) автоматически инициализируются дефолтами: `0` для числовых, `false` для `boolean`, `null` для ссылок.\n" +
        "- **Локальные** — **не** инициализируются. Использование до присвоения — compile error (definite assignment analysis).\n\n" +
        "Это сознательное решение: забыть инициализировать локальную — почти всегда баг, компилятор ловит. А для полей требовать явную инициализацию было бы громоздко.\n\n---\n\n" +
        "- **Fields** (instance and static) are auto-initialised with defaults: `0` for numerics, `false` for `boolean`, `null` for references.\n" +
        "- **Locals** are **not** initialised. Using one before assignment is a compile error (definite assignment analysis).\n\n" +
        "This is deliberate: forgetting to init a local is nearly always a bug, so the compiler catches it. Requiring explicit init for fields would be impractical.",
      difficulty: "junior",
    },
    {
      id: "2-2-q1",
      q:
        "Расскажите про модификаторы `final` и `static`. К чему они применяются?\n\n---\n\n" +
        "Explain `final` and `static`. What can they apply to?",
      a:
        "**`final`:**\n" +
        "- Класс — нельзя наследовать (`String`, все классы-обёртки примитивов).\n" +
        "- Метод — нельзя переопределить.\n" +
        "- Поле — значение задаётся один раз (в объявлении, конструкторе или static-блоке).\n" +
        "- Параметр / локальная — нельзя переприсвоить.\n\n" +
        "`final` не делает объект immutable — лишь ссылку фиксирует.\n\n" +
        "**`static`:**\n" +
        "- Член принадлежит **классу**, не экземпляру. Доступ без `new`.\n" +
        "- Статический метод не имеет `this` и `super`.\n" +
        "- Статические методы можно **перегрузить**, но нельзя **переопределить** (hiding, не overriding) — полиморфизм не применяется.\n" +
        "- Статические поля инициализируются через `<clinit>` при первом использовании класса.\n\n---\n\n" +
        "**`final`:**\n" +
        "- Class — no inheritance (`String`, all primitive wrappers).\n" +
        "- Method — can't be overridden.\n" +
        "- Field — value set once (in declaration, constructor, or static block).\n" +
        "- Parameter / local — can't be reassigned.\n\n" +
        "`final` doesn't make the object immutable — only the reference is fixed.\n\n" +
        "**`static`:**\n" +
        "- Member belongs to the **class**, not the instance. Accessed without `new`.\n" +
        "- A static method has no `this` or `super`.\n" +
        "- Static methods can be **overloaded** but not **overridden** (they're hidden, not overridden) — polymorphism doesn't apply.\n" +
        "- Static fields initialise via `<clinit>` on first class use.",
      difficulty: "junior",
    },
    {
      id: "2-2-q2",
      q:
        "Почему локальные переменные в лямбдах должны быть effectively final?\n\n---\n\n" +
        "Why must local variables used in lambdas be effectively final?",
      a:
        "Лямбда захватывает **значение** локальной переменной (её копию), а не ссылку на слот стека.\n\n" +
        "Локальная живёт на стеке потока и уничтожается при возврате метода. Но лямбда может пережить метод — её хранят в поле, передают в другой поток, планируют на выполнение позже. Если бы значение локальной менялось после захвата, у лямбды осталась бы устаревшая копия — это привело бы к запутанному поведению, и Java запрещает такую неоднозначность через требование effectively final.\n\n" +
        "Обходной путь для мутабельного состояния — захватить ссылку на мутабельный контейнер (массив, `AtomicInteger`, ваш holder): сама ссылка final, содержимое — нет.\n\n" +
        "```java\n" +
        "int[] counter = {0};\n" +
        "list.forEach(x -> counter[0]++);  // OK\n" +
        "```\n\n---\n\n" +
        "A lambda captures the **value** of the local (a copy), not a reference to the stack slot.\n\n" +
        "The local lives on the thread stack and dies when the method returns. But the lambda can outlive the method — stored in a field, handed to another thread, scheduled for later execution. If the local could change after capture, the lambda's copy would be stale — confusing, so Java forbids it via the effectively-final requirement.\n\n" +
        "Workaround for mutable state: capture a reference to a mutable container (array, `AtomicInteger`, a holder): the reference is final, the contents are not.\n\n" +
        "```java\n" +
        "int[] counter = {0};\n" +
        "list.forEach(x -> counter[0]++);  // OK\n" +
        "```",
      difficulty: "mid",
    },
    {
      id: "2-2-q3",
      q:
        "Каков порядок инициализации полей и блоков у потомка и предка?\n\n---\n\n" +
        "What's the initialisation order for fields and blocks across parent and child classes?",
      a:
        "При первом использовании класса:\n\n" +
        "1. **Static-поля и static-блоки** — сначала у предка, потом у потомка. Внутри одного класса — в порядке объявления.\n\n" +
        "При `new Foo()`:\n\n" +
        "2. **Instance-поля + init-блоки**, затем **тело конструктора** — снова от предка к потомку. Конструктор предка вызывается первым (явно или неявно через `super()`).\n\n" +
        "```\nClass load:   Parent.static → Child.static\nObject new:   Parent.instance+init → Parent() →\n              Child.instance+init  → Child()\n```\n\n---\n\n" +
        "On first class use:\n\n" +
        "1. **Static fields and static blocks** — parent first, then child. Inside one class: declaration order.\n\n" +
        "On `new Foo()`:\n\n" +
        "2. **Instance fields + init blocks**, then the **constructor body** — again parent to child. The parent constructor runs first (explicit or implicit `super()`).\n\n" +
        "```\nClass load:   Parent.static → Child.static\nObject new:   Parent.instance+init → Parent() →\n              Child.instance+init  → Child()\n```",
      difficulty: "mid",
    },
    {
      id: "2-2-q4",
      q:
        "Как `var` взаимодействует с дженериками, и какие подводные камни?\n\n---\n\n" +
        "How does `var` interact with generics, and what are the pitfalls?",
      a:
        "`var` использует тип, выведенный компилятором — иногда результат неожиданный.\n\n" +
        "- `var list = new ArrayList<>()` выводит `ArrayList<Object>` — diamond без target type падает в `Object`. Пишите `new ArrayList<String>()`.\n" +
        "- `var list = List.of(1, 2)` корректно выводит `List<Integer>`.\n" +
        "- `var x = cond ? \"hello\" : 42;` даёт `Serializable & Comparable<...>` — intersection type. Технически верно, но практически — почти всегда баг.\n\n" +
        "**Ограничения `var`:**\n" +
        "- Только локальные переменные **с инициализатором**.\n" +
        "- Нельзя для полей, параметров, возвращаемых типов, `catch`-блоков.\n" +
        "- `var x = null;` — compile error (нет чего выводить).\n\n---\n\n" +
        "`var` uses the compiler-inferred type, which can surprise you.\n\n" +
        "- `var list = new ArrayList<>()` infers `ArrayList<Object>` — diamond with no target type falls back to `Object`. Write `new ArrayList<String>()`.\n" +
        "- `var list = List.of(1, 2)` correctly infers `List<Integer>`.\n" +
        "- `var x = cond ? \"hello\" : 42;` gives `Serializable & Comparable<...>` — an intersection type. Technically correct, nearly always a bug.\n\n" +
        "**`var` restrictions:**\n" +
        "- Only local variables **with an initialiser**.\n" +
        "- Not allowed for fields, parameters, return types, `catch` clauses.\n" +
        "- `var x = null;` — compile error (nothing to infer from).",
      difficulty: "senior",
    },
  ],
  tip:
    "Если в лямбде нужно менять счётчик — захватывайте `AtomicInteger` или одноэлементный массив. Ссылка остаётся effectively final, а содержимое можно мутировать.\n\n---\n\n" +
    "When a lambda needs to mutate a counter, capture an `AtomicInteger` or a single-element array. The reference stays effectively final; the contents are mutable.",
  springConnection: {
    concept: "Variable scope and lifecycle",
    springFeature: "Spring Bean Scopes (singleton, prototype, request, session)",
    explanation:
      "Scopes бинов в Spring отображаются на концепции времени жизни переменных:\n\n" +
      "- **singleton-бин** — как статическое поле класса: один экземпляр на всё время жизни приложения.\n" +
      "- **prototype-бин** — как локальная переменная: новый экземпляр на каждый запрос, доступен для GC, когда на него нет ссылок.\n" +
      "- **request / session-scope** (в Spring MVC) привязывает жизнь бина к границам HTTP-запроса или сессии.\n\n" +
      "Понимание scope предотвращает классический баг: инъекция request-scope бина в singleton — singleton захватывает один экземпляр навсегда, а не получает новый на каждый запрос. Решается через scoped proxies (`@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)`).\n\n---\n\n" +
      "Spring bean scopes map to variable-lifetime concepts:\n\n" +
      "- **singleton bean** — like a static class field: one instance for the application's lifetime.\n" +
      "- **prototype bean** — like a local variable: a new instance per request, eligible for GC once references drop.\n" +
      "- **request / session scope** (in Spring MVC) ties bean lifetime to HTTP request or session boundaries.\n\n" +
      "Understanding scope prevents a classic bug: injecting a request-scoped bean into a singleton — the singleton captures one instance forever rather than getting a fresh one per request. Fixed via scoped proxies (`@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)`).",
  },
};
