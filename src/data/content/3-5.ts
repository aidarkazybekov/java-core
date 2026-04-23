import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-5",
  blockId: 3,
  title: "Interfaces vs Abstract Classes",
  summary:
    "**Интерфейс** — контракт: набор методов, которые класс обязан реализовать. С Java 8 поддерживает `default` и `static` методы, с Java 9 — `private`. Все поля — `public static final`. **Абстрактный класс** может иметь состояние (поля), конструкторы и методы любой видимости. Класс реализует **много** интерфейсов, но наследует **один** класс.\n\n---\n\n" +
    "An **interface** is a contract — a set of methods a class must implement. Since Java 8 it supports `default` and `static` methods, since Java 9 — `private`. All fields are `public static final`. An **abstract class** can have state (fields), constructors, and methods with any visibility. A class implements **many** interfaces but extends **one** class.",
  deepDive:
    "## Интерфейс\n\n" +
    "- **Контракт**: сигнатуры методов, которые реализующий класс обязан предоставить.\n" +
    "- Все **поля** неявно `public static final` — это константы, не состояние.\n" +
    "- **Методы по умолчанию** `public abstract`.\n" +
    "- `abstract`-метод не может быть `final` или `private`.\n" +
    "- **Нет конструктора**.\n\n" +
    "**Что добавили Java 8+:**\n" +
    "- `default` методы — реализация прямо в интерфейсе. Для эволюции API без ломки существующих реализаций (так добавили `stream()` в `Collection`).\n" +
    "- `static` методы — утилиты, относящиеся к интерфейсу.\n" +
    "- (Java 9) `private` методы — шаринг кода между default-ами.\n\n" +
    "## Абстрактный класс\n\n" +
    "- Содержит **частичную реализацию**.\n" +
    "- Может иметь **state** (instance fields), конструкторы, static и instance методы.\n" +
    "- Методы могут быть любой видимости (`private`, `protected`, `public`).\n" +
    "- Может быть `abstract` (нельзя инстанцировать) или иметь абстрактные методы без полного покрытия.\n" +
    "- Реализует несколько интерфейсов, но наследуется только от одного класса.\n\n" +
    "## Ключевые отличия\n\n" +
    "| | Interface | Abstract class |\n" +
    "|--|-----------|----------------|\n" +
    "| Множественное наследование | Да (implements many) | Нет (extends one) |\n" +
    "| Состояние (instance fields) | Нет | Да |\n" +
    "| Конструктор | Нет | Да |\n" +
    "| Модификаторы методов | `public` по умолчанию | Любые |\n" +
    "| Когда применять | Контракт, capability | Общая реализация + state |\n\n" +
    "## Когда что выбирать\n\n" +
    "**Интерфейс** — когда:\n" +
    "- Определяете capability, пересекающую иерархии: `Comparable`, `Serializable`, `AutoCloseable`, `Iterable`.\n" +
    "- Хотите mock/stub для тестов.\n" +
    "- Нужно множественное наследование поведения.\n" +
    "- В Spring — инъекция по интерфейсу = легче тестировать, свободнее заменять реализации.\n\n" +
    "**Абстрактный класс** — когда:\n" +
    "- Подклассы делят значимую реализацию.\n" +
    "- Нужно общее состояние (поля) и конструкторы для инициализации.\n" +
    "- Template method pattern — вы задаёте скелет алгоритма, потомки заполняют частности.\n\n" +
    "## Diamond-конфликт default-методов\n\n" +
    "Если два интерфейса дают конфликтующие default-методы, компилятор **требует** override:\n\n" +
    "```java\n" +
    "interface A { default String hi() { return \"A\"; } }\n" +
    "interface B { default String hi() { return \"B\"; } }\n\n" +
    "class C implements A, B {\n" +
    "    @Override public String hi() { return A.super.hi(); }  // явное разрешение\n" +
    "}\n" +
    "```\n\n" +
    "**Правила приоритета** (если неочевидно):\n" +
    "1. **Класс побеждает интерфейс** — метод из class-иерархии приоритетнее default-а.\n" +
    "2. **Более специфичный интерфейс побеждает менее специфичный** — sub-interface > super-interface.\n" +
    "3. Если неоднозначно — класс **обязан** переопределить.\n\n" +
    "## Функциональные интерфейсы и лямбды\n\n" +
    "**Functional interface** — интерфейс с **ровно одним** abstract-методом (SAM, Single Abstract Method). Default и static не считаются. Основа для лямбд:\n\n" +
    "```java\n" +
    "@FunctionalInterface\n" +
    "interface Loggable {\n" +
    "    String toLogString();\n" +
    "    default void log() { System.out.println(toLogString()); }\n" +
    "}\n\n" +
    "Loggable l = () -> \"hello\";  // лямбда — инстанс functional interface\n" +
    "```\n\n" +
    "Аннотация `@FunctionalInterface` не обязательна, но полезна: компилятор проверит, что у интерфейса ровно один abstract-метод — предотвращает случайное добавление второго, ломающего лямбды.\n\n" +
    "Из `java.util.function`: `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`, `UnaryOperator<T>`, `BinaryOperator<T>`, `BiFunction`, `BiPredicate` и др.\n\n" +
    "## Interface + Skeletal implementation\n\n" +
    "> [!tip]\n" +
    "> Паттерн из Effective Java (Item 20): объявите **интерфейс** + **абстрактный класс**, реализующий скелет.\n\n" +
    "Примеры в JDK: `Collection` + `AbstractCollection`, `List` + `AbstractList`, `Map` + `AbstractMap`.\n\n" +
    "**Клиенты** зависят от интерфейса. **Реализаторы** наследуют абстрактный класс — и получают iterator, equals, hashCode «из коробки», переопределяя только несколько базовых методов (`get`, `size` для `AbstractList`).\n\n" +
    "Если класс уже наследует другой класс и не может extend skeletal — реализует интерфейс напрямую, а внутри использует private inner class, делегирующий на skeletal (эмуляция множественного наследования).\n\n---\n\n" +
    "## Interface\n\n" +
    "- A **contract**: method signatures an implementing class must provide.\n" +
    "- All **fields** are implicitly `public static final` — constants, not state.\n" +
    "- Methods are `public abstract` by default.\n" +
    "- An `abstract` method cannot be `final` or `private`.\n" +
    "- **No constructor**.\n\n" +
    "**What Java 8+ added:**\n" +
    "- `default` methods — implementation directly in the interface. Enables API evolution without breaking existing implementations (how `stream()` was added to `Collection`).\n" +
    "- `static` methods — utilities that belong with the interface.\n" +
    "- (Java 9) `private` methods — sharing code between defaults.\n\n" +
    "## Abstract class\n\n" +
    "- Holds a **partial implementation**.\n" +
    "- Can have **state** (instance fields), constructors, static and instance methods.\n" +
    "- Methods can have any visibility (`private`, `protected`, `public`).\n" +
    "- Can be `abstract` (uninstantiable) or contain abstract methods without fully covering them.\n" +
    "- Implements several interfaces but extends only one class.\n\n" +
    "## Key differences\n\n" +
    "| | Interface | Abstract class |\n" +
    "|--|-----------|----------------|\n" +
    "| Multiple inheritance | Yes (implements many) | No (extends one) |\n" +
    "| State (instance fields) | No | Yes |\n" +
    "| Constructor | No | Yes |\n" +
    "| Method modifiers | `public` default | Any |\n" +
    "| When to use | Contract, capability | Shared implementation + state |\n\n" +
    "## When to choose which\n\n" +
    "**Interface** — when:\n" +
    "- Defining a capability that cuts across hierarchies: `Comparable`, `Serializable`, `AutoCloseable`, `Iterable`.\n" +
    "- You need easy mocking/stubbing in tests.\n" +
    "- Multiple behaviour inheritance is required.\n" +
    "- In Spring — inject by interface = easier testing, freer to swap implementations.\n\n" +
    "**Abstract class** — when:\n" +
    "- Subclasses share significant implementation.\n" +
    "- Common state (fields) and constructors are needed.\n" +
    "- Template method pattern — you provide the algorithm skeleton, subclasses fill in pieces.\n\n" +
    "## Diamond conflict for default methods\n\n" +
    "If two interfaces provide conflicting defaults, the compiler **forces** an override:\n\n" +
    "```java\n" +
    "interface A { default String hi() { return \"A\"; } }\n" +
    "interface B { default String hi() { return \"B\"; } }\n\n" +
    "class C implements A, B {\n" +
    "    @Override public String hi() { return A.super.hi(); }  // explicit resolution\n" +
    "}\n" +
    "```\n\n" +
    "**Priority rules** (when not obvious):\n" +
    "1. **Class wins over interface** — a method from the class hierarchy beats a default.\n" +
    "2. **More specific interface wins** — sub-interface > super-interface.\n" +
    "3. If ambiguous — the class **must** override.\n\n" +
    "## Functional interfaces and lambdas\n\n" +
    "A **functional interface** has **exactly one** abstract method (SAM, Single Abstract Method). Defaults and static don't count. The foundation of lambdas:\n\n" +
    "```java\n" +
    "@FunctionalInterface\n" +
    "interface Loggable {\n" +
    "    String toLogString();\n" +
    "    default void log() { System.out.println(toLogString()); }\n" +
    "}\n\n" +
    "Loggable l = () -> \"hello\";  // a lambda — an instance of a functional interface\n" +
    "```\n\n" +
    "`@FunctionalInterface` is optional but useful: the compiler verifies there's exactly one abstract method — preventing accidental addition of a second one that would break lambda use.\n\n" +
    "From `java.util.function`: `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`, `UnaryOperator<T>`, `BinaryOperator<T>`, `BiFunction`, `BiPredicate`, and more.\n\n" +
    "## Interface + Skeletal implementation\n\n" +
    "> [!tip]\n" +
    "> Effective Java Item 20: declare an **interface** + an **abstract class** implementing a skeleton.\n\n" +
    "JDK examples: `Collection` + `AbstractCollection`, `List` + `AbstractList`, `Map` + `AbstractMap`.\n\n" +
    "**Clients** depend on the interface. **Implementors** extend the abstract class and get iterator, equals, hashCode \"for free\", overriding just a few base methods (`get`, `size` for `AbstractList`).\n\n" +
    "If a class already extends another and can't extend the skeletal class, it implements the interface directly and internally uses a private inner class delegating to the skeletal (emulating multiple inheritance).",
  code: `// Interface with default and static methods
public interface Loggable {
    String toLogString();

    default void log() {
        System.out.println("[LOG] " + toLogString());
    }

    static Loggable of(String message) {
        return () -> message;  // lambda since Loggable is functional
    }
}

// Abstract class with shared state and template method
public abstract class AbstractEntity implements Loggable {
    private final long id;
    private final java.time.Instant createdAt;

    protected AbstractEntity(long id) {
        this.id = id;
        this.createdAt = java.time.Instant.now();
    }

    // Template method — subclasses fill in details
    @Override
    public final String toLogString() {
        return getClass().getSimpleName()
            + "[id=" + id + ", created=" + createdAt + "] " + details();
    }

    protected abstract String details();

    public long getId() { return id; }
}

public class User extends AbstractEntity {
    private final String email;

    public User(long id, String email) {
        super(id);
        this.email = email;
    }

    @Override
    protected String details() {
        return "email=" + email;
    }

    public static void main(String[] args) {
        User u = new User(1, "alice@example.com");
        u.log();                           // default from Loggable + template from AbstractEntity

        Loggable quick = Loggable.of("quick message");
        quick.log();
    }
}`,
  interviewQs: [
    {
      id: "3-5-q0",
      q:
        "Когда использовать интерфейс, а когда абстрактный класс?\n\n---\n\n" +
        "When should you use an interface versus an abstract class?",
      a:
        "**Интерфейс** — когда нужно определить **capability** или контракт для потенциально несвязанных классов (`Comparable`, `AutoCloseable`, `Serializable`) или получить множественное наследование поведения.\n\n" +
        "**Абстрактный класс** — когда подклассы делят значительную реализацию или общее изменяемое состояние. Template method pattern — идеальный случай.\n\n" +
        "Так как класс может implements много интерфейсов, но extends только один класс — интерфейсы гибче для cross-cutting concerns. Современная практика: **начните с интерфейса**, и если найдёте общий код у реализаторов — добавьте абстрактный skeletal-класс, реализующий интерфейс.\n\n---\n\n" +
        "**Interface** — when you need to define a **capability** or contract for potentially unrelated classes (`Comparable`, `AutoCloseable`, `Serializable`), or to get multiple behaviour inheritance.\n\n" +
        "**Abstract class** — when subclasses share substantial implementation or common mutable state. The template method pattern is the ideal case.\n\n" +
        "Because a class can implement many interfaces but extend only one class, interfaces are more flexible for cross-cutting concerns. Modern practice: **start with an interface**, and if you find shared code among implementations, add an abstract skeletal class implementing the interface.",
      difficulty: "junior",
    },
    {
      id: "3-5-q1",
      q:
        "Как Java разрешает конфликт, когда класс реализует два интерфейса с одинаковым default-методом?\n\n---\n\n" +
        "How does Java resolve conflicts when a class implements two interfaces with the same default method?",
      a:
        "Если оба default-метода остаются — компилятор **заставляет** реализатор переопределить метод, иначе ошибка. Внутри override можно делегировать конкретному интерфейсу: `InterfaceA.super.method()`.\n\n" +
        "**Правила разрешения**:\n" +
        "1. **Класс / абстрактный класс побеждает** — если метод определён в class-иерархии (не только в интерфейсах), он выигрывает у default.\n" +
        "2. **Более специфичный интерфейс побеждает** — если один интерфейс `extends` другой, default в под-интерфейсе выигрывает.\n" +
        "3. **Иначе** — класс обязан переопределить.\n\n" +
        "```java\n" +
        "interface A { default String hi() { return \"A\"; } }\n" +
        "interface B { default String hi() { return \"B\"; } }\n\n" +
        "class C implements A, B {\n" +
        "    @Override public String hi() { return B.super.hi(); }  // выбираем B\n" +
        "}\n" +
        "```\n\n---\n\n" +
        "If both defaults remain, the compiler **forces** the implementer to override — else a compile error. Inside the override you can delegate to a specific interface: `InterfaceA.super.method()`.\n\n" +
        "**Resolution rules**:\n" +
        "1. **Class / abstract class wins** — if the method is defined in the class hierarchy (not only in interfaces), it beats any default.\n" +
        "2. **More specific interface wins** — if one interface `extends` another, the default in the sub-interface wins.\n" +
        "3. **Otherwise** — the class must override.\n\n" +
        "```java\n" +
        "interface A { default String hi() { return \"A\"; } }\n" +
        "interface B { default String hi() { return \"B\"; } }\n\n" +
        "class C implements A, B {\n" +
        "    @Override public String hi() { return B.super.hi(); }  // pick B\n" +
        "}\n" +
        "```",
      difficulty: "mid",
    },
    {
      id: "3-5-q2",
      q:
        "Объясните паттерн «interface + skeletal implementation» и как JDK его использует.\n\n---\n\n" +
        "Explain the 'interface + skeletal implementation' pattern and how the JDK uses it.",
      a:
        "Паттерн (Effective Java, Item 20): **публичный интерфейс** + **абстрактный класс**, реализующий скелет.\n\n" +
        "**Клиенты** зависят от интерфейса для максимальной гибкости. **Реализаторы** наследуют абстрактный класс, получают boilerplate даром (итератор, equals, hashCode) и переопределяют только 2-3 базовых метода.\n\n" +
        "**Примеры в JDK**:\n" +
        "- `List` + `AbstractList` — `AbstractList` реализует iterator, equals, hashCode, subList. Потомку достаточно `get(int)` и `size()`.\n" +
        "- `Set` + `AbstractSet`, `Map` + `AbstractMap`, `Queue` + `AbstractQueue`.\n" +
        "- `Collection` + `AbstractCollection`.\n\n" +
        "**Что если класс уже наследует другой класс** и не может extend skeletal? Реализует интерфейс напрямую + private inner class, делегирующий в skeletal — эмуляция множественного наследования.\n\n" +
        "Преимущества:\n" +
        "- Контракт отделён от реализации.\n" +
        "- Минимум дублирования кода.\n" +
        "- Гибкость для нестандартных реализаторов.\n\n---\n\n" +
        "The pattern (Effective Java Item 20): a **public interface** + an **abstract class** providing a skeletal implementation.\n\n" +
        "**Clients** depend on the interface for maximum flexibility. **Implementors** extend the abstract class, get boilerplate for free (iterator, equals, hashCode) and only override 2-3 primitive methods.\n\n" +
        "**Examples in the JDK**:\n" +
        "- `List` + `AbstractList` — `AbstractList` implements iterator, equals, hashCode, subList. A subclass only needs `get(int)` and `size()`.\n" +
        "- `Set` + `AbstractSet`, `Map` + `AbstractMap`, `Queue` + `AbstractQueue`.\n" +
        "- `Collection` + `AbstractCollection`.\n\n" +
        "**What if a class already extends another** and can't extend the skeletal? It implements the interface directly + a private inner class delegating to the skeletal — emulating multiple inheritance.\n\n" +
        "Advantages:\n" +
        "- Contract decoupled from implementation.\n" +
        "- Minimal code duplication.\n" +
        "- Flexibility for non-standard implementers.",
      difficulty: "senior",
    },
  ],
  tip:
    "На интервью упоминание паттерна «interface + skeletal implementation» из Effective Java (Item 20) сразу сигнализирует о глубоком понимании и поднимает ответ над общим «интерфейсы — для контрактов».\n\n---\n\n" +
    "In interviews, mentioning the 'interface + skeletal implementation' pattern from Effective Java (Item 20) instantly signals deep understanding and lifts your answer above generic 'interfaces are for contracts'.",
  springConnection: {
    concept: "Interfaces",
    springFeature: "Spring JDK Dynamic Proxies",
    explanation:
      "Когда Spring-бин реализует хотя бы один интерфейс, Spring по умолчанию использует **JDK dynamic proxies** для AOP — создаёт прокси, реализующий те же интерфейсы.\n\n" +
      "Последствия:\n" +
      "- Прокси совместим по типу только с **интерфейсом**, не с конкретным классом.\n" +
      "- Инъекция бина как `@Autowired MyServiceImpl service;` (по конкретному классу) не совпадёт с прокси → `ClassCastException` или `NoSuchBeanDefinitionException`.\n" +
      "- Если инъекция нужна по классу — Spring падает обратно на **CGLIB**, который наследует класс.\n\n" +
      "Вывод: **программируйте против интерфейсов** в Spring — это и хорошая практика ООП, и выравнивает поведение с AOP-прокси.\n\n---\n\n" +
      "When a Spring bean implements at least one interface, Spring defaults to **JDK dynamic proxies** for AOP — creating a proxy that implements the same interfaces.\n\n" +
      "Consequences:\n" +
      "- The proxy is type-compatible only with the **interface**, not the concrete class.\n" +
      "- Injecting a bean as `@Autowired MyServiceImpl service;` (by concrete class) won't match the proxy → `ClassCastException` or `NoSuchBeanDefinitionException`.\n" +
      "- If class-based injection is needed, Spring falls back to **CGLIB** proxies that subclass the target.\n\n" +
      "Takeaway: **code to interfaces** in Spring — it's both good OO practice and aligns with AOP proxy semantics.",
  },
};
