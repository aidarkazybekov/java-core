import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-7",
  blockId: 3,
  title: "SOLID Principles",
  summary:
    "SOLID — пять принципов ООП-дизайна: **S** Single Responsibility, **O** Open-Closed, **L** Liskov Substitution, **I** Interface Segregation, **D** Dependency Inversion. Это не законы, а эвристики для поддерживаемого, тестируемого и расширяемого кода. Частый материал для mid/senior интервью.\n\n---\n\n" +
    "SOLID — five OO design principles: **S** Single Responsibility, **O** Open-Closed, **L** Liskov Substitution, **I** Interface Segregation, **D** Dependency Inversion. Not laws but heuristics for maintainable, testable, extensible code. Common mid/senior interview material.",
  deepDive:
    "## S — Single Responsibility Principle\n\n" +
    "**У класса должна быть одна причина для изменения.**\n\n" +
    "Не «один метод», а **одна ось изменения**.\n\n" +
    "**Нарушение**: `ReportService` делает fetch из БД, применяет бизнес-правила, генерирует PDF. Три причины для изменения → три SRP-риска.\n\n" +
    "**Исправление**:\n" +
    "- `ReportRepository` — data access.\n" +
    "- `ReportCalculator` — бизнес-логика.\n" +
    "- `PdfFormatter` — представление.\n\n" +
    "Каждый класс можно тестировать изолированно. Изменение схемы БД не трогает PDF-код.\n\n" +
    "## O — Open-Closed Principle\n\n" +
    "**Открыт для расширения, закрыт для изменения.**\n\n" +
    "Новое поведение добавляется через **новые реализации абстракции**, а не правкой существующего кода. Инструмент — полиморфизм.\n\n" +
    "**Нарушение**: `if-else`-цепочка по типу.\n\n" +
    "```java\n" +
    "double area(Shape s) {\n" +
    "    if (s instanceof Circle)    return Math.PI * ((Circle)s).r * ...;\n" +
    "    if (s instanceof Rectangle) return ((Rectangle)s).w * ((Rectangle)s).h;\n" +
    "    // каждый новый Shape требует правки метода\n" +
    "}\n" +
    "```\n\n" +
    "**Исправление** — паттерн Strategy / виртуальная диспетчеризация:\n\n" +
    "```java\n" +
    "interface Shape { double area(); }\n" +
    "class Circle implements Shape { public double area() { ... } }\n" +
    "class Rectangle implements Shape { public double area() { ... } }\n" +
    "// Новая фигура? Новый класс. Существующий код не трогается.\n" +
    "```\n\n" +
    "## L — Liskov Substitution Principle\n\n" +
    "**Подтип должен быть взаимозаменяем с базовым типом без нарушения корректности.**\n\n" +
    "Не просто структурное IS-A, а **поведенческое**: подкласс должен соблюдать preconditions, postconditions и инварианты родителя.\n\n" +
    "**Классическое нарушение — Square extends Rectangle**:\n\n" +
    "```java\n" +
    "class Rectangle { int w, h; void setW(int w) { this.w = w; } void setH(int h) { this.h = h; } }\n" +
    "class Square extends Rectangle { void setW(int w) { this.w = w; this.h = w; } ... }\n\n" +
    "void test(Rectangle r) { r.setW(5); r.setH(3); assert r.w * r.h == 15; }\n" +
    "test(new Square());  // FAIL: w=h=3, area == 9\n" +
    "```\n\n" +
    "Код, полагающийся на независимость `setW` и `setH` (естественное предположение для Rectangle), ломается при подстановке Square.\n\n" +
    "**Исправление**: Rectangle и Square — параллельные классы с общим интерфейсом `Shape`. Либо сделайте Rectangle immutable (`withWidth(...)` вместо `setW(...)`).\n\n" +
    "## I — Interface Segregation Principle\n\n" +
    "**Клиенты не должны зависеть от методов, которые они не используют.**\n\n" +
    "Fat-интерфейсы заставляют клиентов реализовывать ненужные методы (часто через `UnsupportedOperationException`) и делают моки громоздкими.\n\n" +
    "**Нарушение**:\n" +
    "```java\n" +
    "interface Worker {\n" +
    "    void work();\n" +
    "    void eat();\n" +
    "    void sleep();\n" +
    "}\n" +
    "class Robot implements Worker {\n" +
    "    public void work() { ... }\n" +
    "    public void eat() { throw new UnsupportedOperationException(); }\n" +
    "    public void sleep() { throw new UnsupportedOperationException(); }\n" +
    "}\n" +
    "```\n\n" +
    "**Исправление**:\n" +
    "```java\n" +
    "interface Workable { void work(); }\n" +
    "interface Feedable { void eat(); }\n" +
    "interface Sleepable { void sleep(); }\n\n" +
    "class Human implements Workable, Feedable, Sleepable { ... }\n" +
    "class Robot implements Workable { ... }\n" +
    "```\n\n" +
    "## D — Dependency Inversion Principle\n\n" +
    "**Модули верхнего уровня не зависят от модулей нижнего уровня. Оба зависят от абстракций.** Абстракции не зависят от деталей, детали — от абстракций.\n\n" +
    "**Нарушение**: `OrderService` напрямую `new EmailSender()`.\n\n" +
    "**Исправление**: вводим интерфейс, инжектим реализацию через конструктор.\n\n" +
    "```java\n" +
    "interface NotificationSender { void send(String to, String msg); }\n" +
    "class EmailSender implements NotificationSender { ... }\n" +
    "class SmsSender implements NotificationSender { ... }\n\n" +
    "class OrderService {\n" +
    "    private final NotificationSender sender;\n" +
    "    public OrderService(NotificationSender sender) { this.sender = sender; }\n" +
    "}\n" +
    "```\n\n" +
    "`OrderService` зависит от интерфейса. Можно подставить любую реализацию — Spring делает это автоматически через DI. DIP — **теоретический фундамент** DI-фреймворков.\n\n" +
    "## Прагматизм\n\n" +
    "> [!production]\n" +
    "> SOLID — **эвристики, не законы**. Переприменение SRP → взрыв классов. Жёсткий OCP → абстракции «на всякий случай» (нарушение YAGNI). Применяйте SOLID там, где **ожидается изменение**: границы модулей, точки интеграции. Внутри небольшого сервиса прагматичный дизайн может терпеть меньше абстракций.\n\n" +
    "**Симптомы нарушения SOLID** = «design smells»:\n" +
    "- Изменение рассыпается по многим файлам → нарушена SRP или OCP.\n" +
    "- `instanceof`-цепочки → OCP.\n" +
    "- Подкласс падает тест родителя → LSP.\n" +
    "- `throw new UnsupportedOperationException()` в реализации → ISP.\n" +
    "- Класс `new`-ает свои зависимости → DIP (нельзя замокать → нельзя протестировать).\n\n---\n\n" +
    "## S — Single Responsibility Principle\n\n" +
    "**A class should have one reason to change.**\n\n" +
    "Not \"one method\" but **one axis of change**.\n\n" +
    "**Violation**: `ReportService` fetches from DB, applies business rules, generates PDF. Three reasons to change → three SRP risks.\n\n" +
    "**Fix**:\n" +
    "- `ReportRepository` — data access.\n" +
    "- `ReportCalculator` — business logic.\n" +
    "- `PdfFormatter` — presentation.\n\n" +
    "Each class is testable in isolation. Schema change doesn't touch PDF code.\n\n" +
    "## O — Open-Closed Principle\n\n" +
    "**Open for extension, closed for modification.**\n\n" +
    "New behaviour is added through **new implementations of an abstraction**, not by editing existing code. The tool is polymorphism.\n\n" +
    "**Violation**: an `if-else` chain keyed by type.\n\n" +
    "```java\n" +
    "double area(Shape s) {\n" +
    "    if (s instanceof Circle)    return Math.PI * ((Circle)s).r * ...;\n" +
    "    if (s instanceof Rectangle) return ((Rectangle)s).w * ((Rectangle)s).h;\n" +
    "    // every new Shape requires editing this method\n" +
    "}\n" +
    "```\n\n" +
    "**Fix** — Strategy pattern / virtual dispatch:\n\n" +
    "```java\n" +
    "interface Shape { double area(); }\n" +
    "class Circle implements Shape { public double area() { ... } }\n" +
    "class Rectangle implements Shape { public double area() { ... } }\n" +
    "// A new shape? A new class. Existing code is untouched.\n" +
    "```\n\n" +
    "## L — Liskov Substitution Principle\n\n" +
    "**A subtype must be substitutable for its base type without breaking correctness.**\n\n" +
    "Not just structural IS-A but **behavioural**: the subclass must honour the parent's preconditions, postconditions, and invariants.\n\n" +
    "**The canonical violation — Square extends Rectangle**:\n\n" +
    "```java\n" +
    "class Rectangle { int w, h; void setW(int w) { this.w = w; } void setH(int h) { this.h = h; } }\n" +
    "class Square extends Rectangle { void setW(int w) { this.w = w; this.h = w; } ... }\n\n" +
    "void test(Rectangle r) { r.setW(5); r.setH(3); assert r.w * r.h == 15; }\n" +
    "test(new Square());  // FAIL: w=h=3, area == 9\n" +
    "```\n\n" +
    "Code relying on `setW` and `setH` being independent (a natural Rectangle assumption) breaks when a Square is substituted.\n\n" +
    "**Fix**: Rectangle and Square are parallel classes sharing a `Shape` interface. Or make Rectangle immutable (`withWidth(...)` instead of `setW(...)`).\n\n" +
    "## I — Interface Segregation Principle\n\n" +
    "**Clients should not depend on methods they don't use.**\n\n" +
    "Fat interfaces force clients to implement irrelevant methods (often via `UnsupportedOperationException`) and make mocks bloated.\n\n" +
    "**Violation**:\n" +
    "```java\n" +
    "interface Worker {\n" +
    "    void work();\n" +
    "    void eat();\n" +
    "    void sleep();\n" +
    "}\n" +
    "class Robot implements Worker {\n" +
    "    public void work() { ... }\n" +
    "    public void eat() { throw new UnsupportedOperationException(); }\n" +
    "    public void sleep() { throw new UnsupportedOperationException(); }\n" +
    "}\n" +
    "```\n\n" +
    "**Fix**:\n" +
    "```java\n" +
    "interface Workable { void work(); }\n" +
    "interface Feedable { void eat(); }\n" +
    "interface Sleepable { void sleep(); }\n\n" +
    "class Human implements Workable, Feedable, Sleepable { ... }\n" +
    "class Robot implements Workable { ... }\n" +
    "```\n\n" +
    "## D — Dependency Inversion Principle\n\n" +
    "**High-level modules must not depend on low-level modules. Both depend on abstractions.** Abstractions don't depend on details; details depend on abstractions.\n\n" +
    "**Violation**: `OrderService` directly `new EmailSender()`.\n\n" +
    "**Fix**: introduce an interface, inject the implementation via the constructor.\n\n" +
    "```java\n" +
    "interface NotificationSender { void send(String to, String msg); }\n" +
    "class EmailSender implements NotificationSender { ... }\n" +
    "class SmsSender implements NotificationSender { ... }\n\n" +
    "class OrderService {\n" +
    "    private final NotificationSender sender;\n" +
    "    public OrderService(NotificationSender sender) { this.sender = sender; }\n" +
    "}\n" +
    "```\n\n" +
    "`OrderService` depends on the interface. Any implementation can be substituted — Spring does it automatically via DI. DIP is the **theoretical foundation** of DI frameworks.\n\n" +
    "## Pragmatism\n\n" +
    "> [!production]\n" +
    "> SOLID is **heuristics, not laws**. Over-applying SRP → class explosion. Rigid OCP → just-in-case abstractions (YAGNI violation). Apply SOLID where **change is expected**: module boundaries, integration points. Inside a small service, pragmatic design can tolerate fewer abstractions.\n\n" +
    "**SOLID-violation symptoms** = \"design smells\":\n" +
    "- A change ripples across many files → SRP or OCP violated.\n" +
    "- `instanceof` chains → OCP.\n" +
    "- Subclass fails the parent's test → LSP.\n" +
    "- `throw new UnsupportedOperationException()` in implementations → ISP.\n" +
    "- A class `new`s its dependencies → DIP (can't mock → can't test).",
  code: `// --- DIP + OCP example ---

public interface NotificationSender {
    void send(String to, String message);
}

public class EmailSender implements NotificationSender {
    @Override public void send(String to, String message) {
        System.out.println("Email to " + to + ": " + message);
    }
}

public class SmsSender implements NotificationSender {
    @Override public void send(String to, String message) {
        System.out.println("SMS to " + to + ": " + message);
    }
}

public class OrderService {
    private final NotificationSender sender;

    public OrderService(NotificationSender sender) {
        this.sender = sender;
    }

    public void placeOrder(String customerContact, String item) {
        sender.send(customerContact, "Your order for " + item + " is confirmed!");
    }

    public static void main(String[] args) {
        OrderService emailOrders = new OrderService(new EmailSender());
        emailOrders.placeOrder("alice@mail.com", "Laptop");

        OrderService smsOrders = new OrderService(new SmsSender());
        smsOrders.placeOrder("+1234567890", "Phone");
    }
}`,
  interviewQs: [
    {
      id: "3-7-q0",
      q:
        "Объясните Single Responsibility Principle на примере нарушения и его исправления.\n\n---\n\n" +
        "Explain the Single Responsibility Principle with an example of a violation and how to fix it.",
      a:
        "SRP: у класса должна быть **одна причина для изменения**.\n\n" +
        "**Нарушение**: `ReportService` делает всё сразу — fetch из БД, применение бизнес-правил, генерация PDF. Три причины для изменения → тестирование сложное, изменение схемы БД трогает PDF-код.\n\n" +
        "**Исправление**: разделить на три класса, каждый с одной осью изменений:\n" +
        "- `ReportRepository` — data access.\n" +
        "- `ReportCalculator` — бизнес-логика.\n" +
        "- `PdfFormatter` — представление.\n\n" +
        "Каждый можно тестировать в изоляции и менять независимо. Инъекция зависимостей связывает их вместе.\n\n---\n\n" +
        "SRP: a class should have **one reason to change**.\n\n" +
        "**Violation**: `ReportService` does it all — DB fetch, business rules, PDF generation. Three reasons to change → hard to test, a schema change touches PDF code.\n\n" +
        "**Fix**: split into three classes, each with one axis of change:\n" +
        "- `ReportRepository` — data access.\n" +
        "- `ReportCalculator` — business logic.\n" +
        "- `PdfFormatter` — presentation.\n\n" +
        "Each is testable in isolation and changes independently. Dependency injection wires them together.",
      difficulty: "junior",
    },
    {
      id: "3-7-q1",
      q:
        "Чем LSP отличается от простого IS-A? Приведите классическое нарушение.\n\n---\n\n" +
        "How does LSP differ from simple IS-A inheritance? Give a classic violation.",
      a:
        "IS-A — **структурное** (Dog IS-A Animal). LSP — **поведенческое**: подкласс обязан соблюдать контракт родителя (preconditions, postconditions, инварианты, исключения).\n\n" +
        "**Классическое нарушение — Square extends Rectangle**:\n\n" +
        "Контракт Rectangle позволяет независимо менять width и height. Square связывает их (`setW` меняет и `w`, и `h`). Код, зависящий от независимости:\n\n" +
        "```java\n" +
        "void test(Rectangle r) {\n" +
        "    r.setW(5); r.setH(3);\n" +
        "    assert r.area() == 15;\n" +
        "}\n" +
        "test(new Square());  // FAIL: w = h = 3, area = 9\n" +
        "```\n\n" +
        "**Исправление**: Rectangle и Square — параллельные классы `implements Shape`, **не** наследование. Либо сделать Rectangle immutable (`withWidth(...)` возвращает новый Rectangle).\n\n" +
        "LSP — самый строгий из SOLID. Нарушения часто скрываются в сеттерах и мутабельности: чтобы соблюсти LSP, подкласс не может **усилить** precondition и не может **ослабить** postcondition родителя.\n\n---\n\n" +
        "IS-A is **structural** (Dog IS-A Animal). LSP is **behavioural**: the subclass must honour the parent's contract (preconditions, postconditions, invariants, exceptions).\n\n" +
        "**Canonical violation — Square extends Rectangle**:\n\n" +
        "Rectangle's contract allows independent width/height changes. Square couples them (`setW` changes both `w` and `h`). Code assuming independence:\n\n" +
        "```java\n" +
        "void test(Rectangle r) {\n" +
        "    r.setW(5); r.setH(3);\n" +
        "    assert r.area() == 15;\n" +
        "}\n" +
        "test(new Square());  // FAIL: w = h = 3, area = 9\n" +
        "```\n\n" +
        "**Fix**: Rectangle and Square as parallel `implements Shape` classes, **not** inheritance. Or make Rectangle immutable (`withWidth(...)` returns a new Rectangle).\n\n" +
        "LSP is the strictest SOLID principle. Violations often hide in setters and mutability: to honour LSP, a subclass cannot **strengthen** the parent's preconditions and cannot **weaken** its postconditions.",
      difficulty: "mid",
    },
    {
      id: "3-7-q2",
      q:
        "Как балансировать SOLID с производительностью и сложностью кода в больших микросервисах?\n\n---\n\n" +
        "In a large microservices codebase, how do you balance SOLID against performance and complexity?",
      a:
        "SOLID — **руководства, не законы**. Слепое применение приводит к:\n" +
        "- **Взрыву классов** от переприменённого SRP — сложно отлаживать, сложно читать.\n" +
        "- **Спекулятивным абстракциям** от жёсткого OCP — слои, которые «когда-нибудь пригодятся», нарушают YAGNI.\n" +
        "- **Performance penalty** — virtual dispatch через интерфейс медленнее прямого вызова, особенно в tight loops (JIT это оптимизирует, но не всегда).\n\n" +
        "**Практические правила**:\n" +
        "- В микросервисах каждый сервис уже граница SRP/DIP — внутри маленького сервиса меньше абстракций приемлемо.\n" +
        "- Интерфейсы на **границах модулей**, не между каждыми классами.\n" +
        "- Refactor **toward** SOLID, когда давление изменений реально возникло — не «на всякий случай».\n" +
        "- Performance-critical path может намеренно нарушать DIP (прямые вызовы) — но с бенчмарками на руках.\n\n" +
        "**Senior-навык**: понимать, когда цена принципа превышает выгоду. Абстракция стоит cognitive load + индирекции — платите за неё ровно столько, сколько она экономит на будущих изменениях.\n\n---\n\n" +
        "SOLID is **guidance, not law**. Blind application leads to:\n" +
        "- **Class explosion** from over-applied SRP — hard to debug, hard to read.\n" +
        "- **Speculative abstractions** from rigid OCP — layers that \"might be useful someday\" violate YAGNI.\n" +
        "- **Performance penalty** — virtual dispatch through an interface is slower than a direct call, especially in tight loops (JIT optimises it but not always).\n\n" +
        "**Practical rules**:\n" +
        "- In microservices, each service is already an SRP/DIP boundary — inside a small service, fewer abstractions are acceptable.\n" +
        "- Interfaces at **module boundaries**, not between every class.\n" +
        "- Refactor **toward** SOLID once real change pressure appears — not \"just in case\".\n" +
        "- A performance-critical path may intentionally violate DIP (direct calls) — but with benchmarks in hand.\n\n" +
        "**Senior skill**: knowing when a principle's cost outweighs its benefit. Abstraction costs cognitive load + indirection — pay for it only in proportion to the future change it saves.",
      difficulty: "senior",
    },
  ],
  tip:
    "На интервью по SOLID не зачитывайте определения — дайте **before/after** пример кода хотя бы для одного принципа. Конкретный рефакторинг показывает, что вы применяете принципы в практике, а не только знаете их по учебнику.\n\n---\n\n" +
    "When asked about SOLID, don't recite definitions — give a **before/after** code example for at least one principle. A concrete refactoring shows you apply the principles in practice, not just know them from a textbook.",
  springConnection: {
    concept: "SOLID Principles",
    springFeature: "Spring Dependency Injection",
    explanation:
      "Spring — это **DIP как фреймворк**. Высокоуровневая бизнес-логика зависит от интерфейсов; Spring IoC-контейнер инжектит конкретные реализации в рантайме.\n\n" +
      "- `@Autowired`, `@Qualifier`, `@Primary` — инструменты DIP.\n" +
      "- `@Profile` — OCP в действии: разные реализации для разных окружений (dev/prod).\n" +
      "- `@Conditional` — выбор реализации по условиям без правки консьюмеров.\n\n" +
      "Понимание SOLID — это понимание, **почему** Spring устроен так, как устроен. Без DIP/OCP в голове фреймворк кажется магией; с ними — очевидной реализацией принципов.\n\n---\n\n" +
      "Spring is **DIP as a framework**. High-level business logic depends on interfaces; the Spring IoC container injects concrete implementations at runtime.\n\n" +
      "- `@Autowired`, `@Qualifier`, `@Primary` — DIP tooling.\n" +
      "- `@Profile` — OCP in action: different implementations for different environments (dev/prod).\n" +
      "- `@Conditional` — pick an implementation based on conditions, no consumer edits.\n\n" +
      "Understanding SOLID is understanding **why** Spring was designed this way. Without DIP/OCP in mind, the framework looks like magic; with them, it's an obvious realisation of the principles.",
  },
};
