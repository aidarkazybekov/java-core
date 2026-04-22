import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-3",
  blockId: 3,
  title: "Inheritance & super",
  summary:
    "Наследование — IS-A отношение: `Dog extends Animal`. Java поддерживает **одиночное** наследование классов и **множественную** реализацию интерфейсов. `super(...)` вызывает конструктор родителя; `super.method()` — переопределённый метод родителя. Диспетчеризация идёт через vtable по runtime-типу объекта — основа runtime-полиморфизма.\n\n---\n\n" +
    "Inheritance is an IS-A relationship: `Dog extends Animal`. Java supports **single** class inheritance and **multiple** interface implementation. `super(...)` invokes the parent constructor; `super.method()` calls the parent's overridden method. Dispatch goes through the vtable by the object's runtime type — the foundation of runtime polymorphism.",
  deepDive:
    "## Отношения между классами\n\n" +
    "- **Ассоциация (has-a)** — один класс использует другой.\n" +
    "- **Агрегация** (слабая has-a) — обе стороны существуют независимо. Книга может быть перенесена между библиотеками.\n" +
    "- **Композиция** (сильная has-a) — один класс управляет жизненным циклом другого. Страницы существуют только с книгой.\n" +
    "- **Наследование (is-a)** — `Dog` является `Animal`.\n" +
    "- **Реализация** — класс implements интерфейс.\n" +
    "- **Зависимость** — использование класса в сигнатуре метода / параметре.\n\n" +
    "## Что наследуется, что нет\n\n" +
    "Наследуются:\n" +
    "- Public, protected, package-private (если тот же пакет) поля и методы.\n" +
    "- Private поля **существуют** в памяти объекта, но недоступны по имени в потомке.\n\n" +
    "Не наследуются:\n" +
    "- Конструкторы (нужно вызывать через `super(...)`).\n" +
    "- Private методы.\n" +
    "- Static методы наследуются «логически», но могут быть **скрыты** (hidden), не переопределены.\n\n" +
    "## Virtual method dispatch\n\n" +
    "Для instance-методов JVM использует **vtable**: при вызове `ref.method()` смотрим **runtime-тип** объекта, а не объявленный тип ссылки. Это и есть runtime-полиморфизм.\n\n" +
    "```java\n" +
    "Animal a = new Dog(\"Rex\");\n" +
    "a.speak();  // вызывается Dog.speak(), не Animal.speak()\n" +
    "```\n\n" +
    "Для static-методов и полей действует **compile-time binding** — используется объявленный тип ссылки.\n\n" +
    "## Overriding vs hiding\n\n" +
    "| | Method | Static method / Field |\n" +
    "|--|--------|------------------------|\n" +
    "| Механизм | Override (dynamic binding) | Hide (static binding) |\n" +
    "| По какому типу диспетчеризуется | Runtime-тип объекта | Compile-time тип ссылки |\n" +
    "| `@Override` | Да | Нет |\n\n" +
    "```java\n" +
    "class Parent { int x = 1; static String name() { return \"Parent\"; } }\n" +
    "class Child extends Parent { int x = 2; static String name() { return \"Child\"; } }\n\n" +
    "Parent p = new Child();\n" +
    "p.x;         // 1 (поля — hiding, по типу ссылки)\n" +
    "p.name();    // \"Parent\" (static — hiding, по типу ссылки)\n" +
    "```\n\n" +
    "## Правила переопределения\n\n" +
    "- **Та же сигнатура** (имя + параметры).\n" +
    "- **Covariant return type** (Java 5+) — можно возвращать более узкий тип.\n" +
    "- Модификатор доступа — **равный или шире**.\n" +
    "- Checked exceptions — **такие же или уже**. RuntimeException — свободно.\n\n" +
    "> [!tip]\n" +
    "> **Всегда ставьте `@Override`.** Без аннотации опечатка в имени создаст новый метод вместо override — компилятор промолчит, баг всплывёт в рантайме.\n\n" +
    "## `super`\n\n" +
    "Две роли:\n\n" +
    "1. **`super(...)`** — вызов конструктора родителя. Должен быть первым оператором. Если не указан, компилятор вставляет `super()` — и это упадёт, если у родителя нет no-arg.\n" +
    "2. **`super.method()`** — вызов переопределённого метода родителя. Полезно, чтобы **дополнить** поведение:\n" +
    "   ```java\n" +
    "   @Override public String speak() {\n" +
    "       return name + \" barks! (\" + super.speak() + \")\";\n" +
    "   }\n" +
    "   ```\n\n" +
    "**Нельзя** `super.super.method()` — Java даёт подняться только на один уровень.\n\n" +
    "## Почему нет множественного наследования классов\n\n" +
    "**Diamond problem** — если два родителя определяют один метод по-разному, какую реализацию взять? C++ решает через явное разрешение, Java избегает проблемы, запретив множественное наследование классов.\n\n" +
    "**Default-методы интерфейсов (Java 8+)** возвращают контролируемую форму множественного наследования **поведения**. Если два интерфейса дают конфликтующие default-реализации, компилятор **требует** от реализующего класса override этого метода — неоднозначности нет.\n\n" +
    "```java\n" +
    "interface A { default void m() { ... } }\n" +
    "interface B { default void m() { ... } }\n" +
    "class C implements A, B {\n" +
    "    @Override public void m() { A.super.m(); }  // явное разрешение\n" +
    "}\n" +
    "```\n\n" +
    "## `final` и `sealed`\n\n" +
    "- **`final class`** — нельзя наследовать (`String`, все обёртки примитивов).\n" +
    "- **`final method`** — нельзя переопределить.\n" +
    "- **`sealed class / interface`** (Java 17+) — золотая середина: перечислите `permits`-список разрешённых наследников:\n\n" +
    "```java\n" +
    "sealed interface Shape permits Circle, Square, Triangle {}\n" +
    "```\n\n" +
    "Субклассы должны быть `final`, `sealed` (со своим permits) или `non-sealed`. Компилятор знает закрытый набор и делает **exhaustive pattern matching в switch без default**.\n\n" +
    "## Fragile base class — почему композиция > наследование\n\n" +
    "> [!production]\n" +
    "> Изменение базового класса может **скрытно сломать** потомков, которые на него полагались. Классический пример (Bloch, Effective Java): `HashSet` → `InstrumentedHashSet` с переопределённым `add` и `addAll`. `addAll` в `HashSet` внутри вызывает `add` → `add` вызывается **дважды** через override, счётчик удваивается. Поведение не документировано как API — это implementation detail.\n\n" +
    "Правило: «**предпочитай композицию наследованию**» (Bloch). Оберните нужное поведение в поле, а не наследуйте класс. Наследование — только когда вы контролируете базовый класс и IS-A отношение действительно выполняется.\n\n---\n\n" +
    "## Relationships between classes\n\n" +
    "- **Association (has-a)** — one class uses another.\n" +
    "- **Aggregation** (weak has-a) — both sides exist independently. A book can move between libraries.\n" +
    "- **Composition** (strong has-a) — one class owns the other's lifecycle. Pages exist only with the book.\n" +
    "- **Inheritance (is-a)** — `Dog` is an `Animal`.\n" +
    "- **Realisation** — a class implements an interface.\n" +
    "- **Dependency** — use of a class in a method signature / parameter.\n\n" +
    "## What's inherited and what isn't\n\n" +
    "Inherited:\n" +
    "- Public, protected, package-private (same package) fields and methods.\n" +
    "- Private fields **exist** in the object's memory but aren't accessible by name from the child.\n\n" +
    "Not inherited:\n" +
    "- Constructors (must be invoked via `super(...)`).\n" +
    "- Private methods.\n" +
    "- Static methods are \"logically inherited\" but can be **hidden** (not overridden).\n\n" +
    "## Virtual method dispatch\n\n" +
    "For instance methods the JVM uses the **vtable**: on `ref.method()` it uses the object's **runtime type**, not the declared reference type. This is runtime polymorphism.\n\n" +
    "```java\n" +
    "Animal a = new Dog(\"Rex\");\n" +
    "a.speak();  // calls Dog.speak(), not Animal.speak()\n" +
    "```\n\n" +
    "Static methods and fields use **compile-time binding** — the declared reference type wins.\n\n" +
    "## Overriding vs hiding\n\n" +
    "| | Method | Static method / Field |\n" +
    "|--|--------|------------------------|\n" +
    "| Mechanism | Override (dynamic binding) | Hide (static binding) |\n" +
    "| Dispatched by | Runtime type of the object | Compile-time type of the reference |\n" +
    "| `@Override` | Yes | No |\n\n" +
    "```java\n" +
    "class Parent { int x = 1; static String name() { return \"Parent\"; } }\n" +
    "class Child extends Parent { int x = 2; static String name() { return \"Child\"; } }\n\n" +
    "Parent p = new Child();\n" +
    "p.x;         // 1 (fields hide, by reference type)\n" +
    "p.name();    // \"Parent\" (static hides, by reference type)\n" +
    "```\n\n" +
    "## Override rules\n\n" +
    "- **Same signature** (name + parameters).\n" +
    "- **Covariant return type** (Java 5+) — narrower return allowed.\n" +
    "- Access modifier — **equal or wider**.\n" +
    "- Checked exceptions — **same or narrower**. `RuntimeException` is unrestricted.\n\n" +
    "> [!tip]\n" +
    "> **Always add `@Override`.** Without it, a typo creates a new method instead of overriding — the compiler stays silent and the bug shows up at runtime.\n\n" +
    "## `super`\n\n" +
    "Two roles:\n\n" +
    "1. **`super(...)`** — invoke the parent constructor. Must be the first statement. If omitted, the compiler inserts `super()` — this fails if the parent has no no-arg constructor.\n" +
    "2. **`super.method()`** — call the parent's overridden method. Useful to **augment** behaviour:\n" +
    "   ```java\n" +
    "   @Override public String speak() {\n" +
    "       return name + \" barks! (\" + super.speak() + \")\";\n" +
    "   }\n" +
    "   ```\n\n" +
    "You **cannot** `super.super.method()` — Java only lets you go one level up.\n\n" +
    "## Why Java has no multiple class inheritance\n\n" +
    "**The diamond problem** — if two parents define the same method differently, which implementation wins? C++ solves it through explicit resolution, Java sidesteps it by forbidding multiple class inheritance.\n\n" +
    "**Interface default methods (Java 8+)** bring a controlled form of multiple behaviour inheritance. If two interfaces provide conflicting defaults, the compiler **forces** the implementing class to override — no ambiguity remains.\n\n" +
    "```java\n" +
    "interface A { default void m() { ... } }\n" +
    "interface B { default void m() { ... } }\n" +
    "class C implements A, B {\n" +
    "    @Override public void m() { A.super.m(); }  // explicit resolution\n" +
    "}\n" +
    "```\n\n" +
    "## `final` and `sealed`\n\n" +
    "- **`final class`** — cannot be inherited (`String`, all primitive wrappers).\n" +
    "- **`final method`** — cannot be overridden.\n" +
    "- **`sealed class / interface`** (Java 17+) — the middle ground: list the allowed subtypes with `permits`:\n\n" +
    "```java\n" +
    "sealed interface Shape permits Circle, Square, Triangle {}\n" +
    "```\n\n" +
    "Subclasses must be `final`, `sealed` (with their own permits), or `non-sealed`. The compiler knows the closed set and does **exhaustive pattern matching in switch with no default**.\n\n" +
    "## Fragile base class — why composition > inheritance\n\n" +
    "> [!production]\n" +
    "> A change in the base class can **silently break** subclasses that depend on it. Classic example (Bloch, Effective Java): `HashSet` → `InstrumentedHashSet` overriding `add` and `addAll`. `HashSet.addAll` internally calls `add` → overridden `add` is hit **twice**, the counter doubles. The internal call isn't documented as API — it's an implementation detail.\n\n" +
    "Rule: **prefer composition over inheritance** (Bloch). Wrap the behaviour you need in a field rather than extending the class. Use inheritance only when you own the base class and IS-A genuinely holds.",
  code: `public class Animal {
    private final String species;

    public Animal(String species) {
        this.species = species;
    }

    public String speak() {
        return species + " makes a sound";
    }

    // final prevents subclasses from overriding
    public final String getSpecies() {
        return species;
    }
}

public class Dog extends Animal {

    private final String name;

    public Dog(String name) {
        super("Canine");  // must be first statement
        this.name = name;
    }

    @Override
    public String speak() {
        // augment parent behavior
        return name + " barks! (" + super.speak() + ")";
    }

    public static void main(String[] args) {
        Animal a = new Dog("Rex");   // polymorphic reference
        System.out.println(a.speak());
        // "Rex barks! (Canine makes a sound)"

        // a.name  -- won't compile; 'name' is not in Animal

        System.out.println(a.getSpecies()); // "Canine" (final method)
    }
}`,
  interviewQs: [
    {
      id: "3-3-q0",
      q:
        "В чём разница между method overriding и method hiding?\n\n---\n\n" +
        "What's the difference between method overriding and method hiding?",
      a:
        "- **Overriding** — для **instance-методов**. JVM диспетчеризует по **runtime-типу** объекта (dynamic binding). Это и есть runtime-полиморфизм.\n" +
        "- **Hiding** — для **static-методов и полей**. Используется **compile-time тип** ссылки (static binding). Если потомок объявит static-метод с той же сигнатурой, он **скрывает** родительский, а не переопределяет.\n\n" +
        "```java\n" +
        "class Parent { static String tag() { return \"P\"; } }\n" +
        "class Child extends Parent { static String tag() { return \"C\"; } }\n\n" +
        "Parent p = new Child();\n" +
        "p.tag();  // \"P\" — static binds по типу ссылки\n" +
        "```\n\n" +
        "Поля аналогично: `p.field` — поле родителя, даже если объект — `Child`.\n\n---\n\n" +
        "- **Overriding** — for **instance methods**. The JVM dispatches by the object's **runtime type** (dynamic binding). This is runtime polymorphism.\n" +
        "- **Hiding** — for **static methods and fields**. Uses the reference's **compile-time type** (static binding). A child declaring a static method with the same signature **hides** the parent's rather than overriding it.\n\n" +
        "```java\n" +
        "class Parent { static String tag() { return \"P\"; } }\n" +
        "class Child extends Parent { static String tag() { return \"C\"; } }\n\n" +
        "Parent p = new Child();\n" +
        "p.tag();  // \"P\" — static binds to the reference type\n" +
        "```\n\n" +
        "Fields behave the same: `p.field` is the parent's field even if the object is `Child`.",
      difficulty: "junior",
    },
    {
      id: "3-3-q1",
      q:
        "Почему Java не поддерживает множественное наследование классов, и как default-методы интерфейсов меняют картину?\n\n---\n\n" +
        "Why doesn't Java support multiple class inheritance, and how do interface default methods change the picture?",
      a:
        "**Diamond problem**: если два родителя определяют один метод по-разному, какую реализацию наследовать? Java избегает двусмысленности, запретив множественное наследование классов.\n\n" +
        "**Default-методы в интерфейсах (Java 8+)** дают контролируемую форму множественного наследования **поведения** (но не состояния — полей у интерфейсов нет). Если два интерфейса дают конфликтующие default, компилятор **требует** override в реализующем классе — двусмысленность невозможна:\n\n" +
        "```java\n" +
        "interface A { default void m() {} }\n" +
        "interface B { default void m() {} }\n" +
        "class C implements A, B {\n" +
        "    @Override public void m() { A.super.m(); }  // явное разрешение\n" +
        "}\n" +
        "```\n\n" +
        "Это позволило расширить `Collection` (например, `stream()`) без ломки существующих реализаций.\n\n---\n\n" +
        "**The diamond problem**: if two parents define the same method differently, which implementation do you inherit? Java avoids the ambiguity by forbidding multiple class inheritance.\n\n" +
        "**Interface default methods (Java 8+)** give a controlled form of multiple **behaviour** inheritance (not state — interfaces have no fields). If two interfaces provide conflicting defaults, the compiler **forces** an override in the implementing class — ambiguity is impossible:\n\n" +
        "```java\n" +
        "interface A { default void m() {} }\n" +
        "interface B { default void m() {} }\n" +
        "class C implements A, B {\n" +
        "    @Override public void m() { A.super.m(); }  // explicit resolution\n" +
        "}\n" +
        "```\n\n" +
        "This was the mechanism that let Java 8 add `stream()` to `Collection` without breaking every existing implementation.",
      difficulty: "mid",
    },
    {
      id: "3-3-q2",
      q:
        "Объясните sealed-классы, их связь с pattern matching, и как они улучшают традиционные иерархии.\n\n---\n\n" +
        "Explain sealed classes, their link to pattern matching, and how they improve traditional hierarchies.",
      a:
        "**Sealed-классы (Java 17)** ограничивают, кто может их наследовать, через `permits`-список. Набор субтипов **закрыт и известен в compile time**.\n\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square, Triangle {}\n" +
        "record Circle(double r) implements Shape {}\n" +
        "record Square(double side) implements Shape {}\n" +
        "record Triangle(double base, double h) implements Shape {}\n" +
        "```\n\n" +
        "Субклассы обязаны быть `final`, `sealed` (со своим `permits`) или `non-sealed`.\n\n" +
        "**Pattern matching в `switch`** использует закрытость — компилятор проверяет exhaustiveness без `default`:\n\n" +
        "```java\n" +
        "double area = switch (s) {\n" +
        "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
        "    case Square sq  -> sq.side() * sq.side();\n" +
        "    case Triangle t -> t.base() * t.h() / 2;\n" +
        "};\n" +
        "```\n\n" +
        "Добавление нового permitted-варианта — **compile error во всех switch** над этим типом. Пропустить case невозможно.\n\n" +
        "Sealed-типы решают напряжение между **открытостью** (любой может наследовать) и **контролем** (автор хочет закрытый набор вариантов) — это Java-аналог algebraic data types функциональных языков. Отлично сочетается с рекордами.\n\n---\n\n" +
        "**Sealed classes (Java 17)** restrict who may extend them via a `permits` list. The set of subtypes is **closed and known at compile time**.\n\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square, Triangle {}\n" +
        "record Circle(double r) implements Shape {}\n" +
        "record Square(double side) implements Shape {}\n" +
        "record Triangle(double base, double h) implements Shape {}\n" +
        "```\n\n" +
        "Subclasses must be `final`, `sealed` (with their own `permits`), or `non-sealed`.\n\n" +
        "**Pattern matching in `switch`** uses the closedness — the compiler verifies exhaustiveness with no `default`:\n\n" +
        "```java\n" +
        "double area = switch (s) {\n" +
        "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
        "    case Square sq  -> sq.side() * sq.side();\n" +
        "    case Triangle t -> t.base() * t.h() / 2;\n" +
        "};\n" +
        "```\n\n" +
        "Adding a new permitted variant is a **compile error in every switch** over that type. You cannot miss a case.\n\n" +
        "Sealed types resolve the tension between **openness** (anyone can extend) and **control** (the author wants a fixed set of variants) — Java's take on algebraic data types. Pairs well with records.",
      difficulty: "senior",
    },
    {
      id: "3-3-q3",
      q:
        "Что такое fragile base class и почему говорят «предпочитай композицию наследованию»?\n\n---\n\n" +
        "What's the fragile base class problem and why do people say 'prefer composition over inheritance'?",
      a:
        "**Fragile base class** — изменение базового класса может скрытно сломать потомков, которые полагались на **implementation detail** базового, а не на документированный API.\n\n" +
        "Классика Bloch'а (Effective Java):\n\n" +
        "```java\n" +
        "class InstrumentedHashSet<E> extends HashSet<E> {\n" +
        "    int added = 0;\n" +
        "    @Override public boolean add(E e) { added++; return super.add(e); }\n" +
        "    @Override public boolean addAll(Collection<? extends E> c) {\n" +
        "        added += c.size(); return super.addAll(c);\n" +
        "    }\n" +
        "}\n" +
        "```\n\n" +
        "Внутри `HashSet.addAll` вызывает `add` для каждого элемента. Наш override `add` уже инкрементит → счётчик удваивается. Это undocumented implementation detail, на которое полагаться нельзя.\n\n" +
        "**Композиция** делает зависимости явными. Вместо extends — оборачиваем:\n\n" +
        "```java\n" +
        "class InstrumentedSet<E> implements Set<E> {\n" +
        "    private final Set<E> delegate;\n" +
        "    int added = 0;\n" +
        "    public boolean add(E e) { added++; return delegate.add(e); }\n" +
        "    public boolean addAll(Collection<? extends E> c) {\n" +
        "        int n = 0; for (E e : c) if (add(e)) n++; return n > 0;\n" +
        "    }\n" +
        "    // ... другие методы делегируют delegate\n" +
        "}\n" +
        "```\n\n" +
        "Наследование применимо только тогда, когда вы контролируете базовый класс и IS-A отношение по-настоящему выполняется.\n\n---\n\n" +
        "**Fragile base class** — a change in the base class can silently break subclasses that relied on an **implementation detail** rather than the documented API.\n\n" +
        "Bloch's classic (Effective Java):\n\n" +
        "```java\n" +
        "class InstrumentedHashSet<E> extends HashSet<E> {\n" +
        "    int added = 0;\n" +
        "    @Override public boolean add(E e) { added++; return super.add(e); }\n" +
        "    @Override public boolean addAll(Collection<? extends E> c) {\n" +
        "        added += c.size(); return super.addAll(c);\n" +
        "    }\n" +
        "}\n" +
        "```\n\n" +
        "Internally `HashSet.addAll` calls `add` per element. Our overridden `add` already increments → the counter doubles. This is an undocumented implementation detail you cannot rely on.\n\n" +
        "**Composition** makes dependencies explicit. Instead of extending, wrap:\n\n" +
        "```java\n" +
        "class InstrumentedSet<E> implements Set<E> {\n" +
        "    private final Set<E> delegate;\n" +
        "    int added = 0;\n" +
        "    public boolean add(E e) { added++; return delegate.add(e); }\n" +
        "    public boolean addAll(Collection<? extends E> c) {\n" +
        "        int n = 0; for (E e : c) if (add(e)) n++; return n > 0;\n" +
        "    }\n" +
        "    // ... other methods delegate to delegate\n" +
        "}\n" +
        "```\n\n" +
        "Use inheritance only when you own the base class and IS-A genuinely holds.",
      difficulty: "mid",
    },
  ],
  tip:
    "Всегда ставьте `@Override`. Без неё опечатка в имени создаст новый метод вместо переопределения — компилятор промолчит, баг найдёте только в рантайме.\n\n---\n\n" +
    "Always add `@Override`. Without it, a typo in the name silently creates a new method instead of overriding — the compiler stays quiet and the bug only shows up at runtime.",
  springConnection: {
    concept: "Inheritance & super",
    springFeature: "Spring CGLIB Proxies",
    explanation:
      "Spring AOP создаёт прокси, **наследуя** класс вашего бина в рантайме через CGLIB (или использует JDK dynamic proxies, если бин реализует интерфейс).\n\n" +
      "Последствия:\n" +
      "- Класс **не может быть `final`** — CGLIB не сможет его унаследовать. Бросится ошибка при запуске.\n" +
      "- Методы не могут быть `final` или `private` — прокси не сможет их переопределить для внедрения advice (`@Transactional`, `@Cacheable`, `@Async`, `@Secured`).\n" +
      "- **Self-invocation пропускает прокси**. Вызов `this.method()` изнутри того же класса идёт не через прокси, а напрямую — advice не срабатывает. Решение: вынести метод в другой бин или использовать `AopContext.currentProxy()`.\n\n" +
      "Понимание механики наследования объясняет эти ограничения.\n\n---\n\n" +
      "Spring AOP creates proxies by **subclassing** your bean's class at runtime with CGLIB (or JDK dynamic proxies if the bean implements an interface).\n\n" +
      "Consequences:\n" +
      "- The class **cannot be `final`** — CGLIB couldn't extend it. You'll get a startup error.\n" +
      "- Methods can't be `final` or `private` — the proxy couldn't override them to insert advice (`@Transactional`, `@Cacheable`, `@Async`, `@Secured`).\n" +
      "- **Self-invocation bypasses the proxy**. A `this.method()` call from inside the same class goes directly, not through the proxy — advice doesn't fire. Fix: extract the method into another bean, or use `AopContext.currentProxy()`.\n\n" +
      "Understanding inheritance mechanics explains these constraints.",
  },
};
