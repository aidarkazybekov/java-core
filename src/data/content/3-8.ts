import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-8",
  blockId: 3,
  title: "Design Patterns",
  summary:
    "Паттерны — типовые решения повторяющихся задач проектирования (GoF, 1994). Три группы: **порождающие** (Singleton, Factory, Builder, Prototype), **структурные** (Adapter, Decorator, Proxy, Facade, Composite, Flyweight), **поведенческие** (Strategy, Observer, Template Method, State, Chain of Responsibility). Modern Java (лямбды, рекорды, sealed) часто упрощает или заменяет их.\n\n---\n\n" +
    "Patterns are proven solutions to recurring design problems (GoF, 1994). Three groups: **creational** (Singleton, Factory, Builder, Prototype), **structural** (Adapter, Decorator, Proxy, Facade, Composite, Flyweight), **behavioural** (Strategy, Observer, Template Method, State, Chain of Responsibility). Modern Java (lambdas, records, sealed) often simplifies or replaces them.",
  deepDive:
    "## Порождающие (Creational)\n\n" +
    "**Контролируют создание объектов.**\n\n" +
    "- **Singleton** — один экземпляр на scope. В Java лучший способ — `enum Singleton { INSTANCE; }` (thread-safe, защищён от reflection, корректно сериализуется). См. также Initialization-on-Demand Holder (3-6).\n" +
    "- **Factory Method** — интерфейс создания, подклассы выбирают тип. JDK-пример: `Collection.iterator()` — каждая коллекция возвращает свой итератор.\n" +
    "- **Abstract Factory** — семейство связанных объектов. `DocumentBuilderFactory`, `XMLInputFactory`.\n" +
    "- **Builder** — пошаговое создание сложного объекта, особенно незаменим для immutable с многими optional-параметрами (Effective Java Item 2). JDK: `StringBuilder`, `Stream.Builder`, `HttpRequest.newBuilder()`.\n" +
    "- **Prototype** — копирование без знания конкретного типа. В Java обычно через copy-конструктор, не через `clone()`.\n\n" +
    "## Структурные (Structural)\n\n" +
    "**Композиция объектов.**\n\n" +
    "- **Adapter** — преобразует один интерфейс в другой. `Arrays.asList(T[])` адаптирует массив к `List`. `InputStreamReader` адаптирует `InputStream` (bytes) к `Reader` (chars).\n" +
    "- **Decorator** — динамически добавляет поведение, не трогая интерфейс. **JDK I/O streams** — эталон: `new BufferedReader(new InputStreamReader(new FileInputStream(...)))`.\n" +
    "- **Proxy** — суррогат, контролирующий доступ к реальному объекту. Варианты:\n" +
    "  - Remote proxy (RMI).\n" +
    "  - Virtual proxy (lazy loading, JPA proxies).\n" +
    "  - Protection proxy (security checks).\n" +
    "  - Smart proxy (добавляет логику — Spring AOP).\n" +
    "- **Facade** — простой интерфейс к сложной подсистеме. Spring `JdbcTemplate` — фасад над JDBC.\n" +
    "- **Composite** — древовидная структура, где листья и контейнеры обрабатываются единообразно. UI-компоненты, AST компиляторов.\n" +
    "- **Flyweight** — разделение общего состояния для экономии памяти. `Integer.valueOf(-128..127)`, `String.intern()`.\n\n" +
    "## Поведенческие (Behavioural)\n\n" +
    "**Взаимодействие между объектами.**\n\n" +
    "- **Strategy** — взаимозаменяемые алгоритмы за одним интерфейсом. JDK: `Comparator`. С лямбдами превращается в один лайнер:\n" +
    "  ```java\n" +
    "  list.sort((a, b) -> a.name().compareTo(b.name()));\n" +
    "  ```\n" +
    "- **Observer** — один-ко-многим подписка на события. Classic `java.util.Observer` (deprecated). Modern: `ApplicationEventPublisher` в Spring, `Flow.Subscriber` (reactive streams).\n" +
    "- **Template Method** — скелет алгоритма в базовом классе + hook-методы, которые переопределяют потомки. JDK: `AbstractList`, `HttpServlet.doGet`. Spring: `JdbcTemplate`, `RestTemplate`.\n" +
    "- **Chain of Responsibility** — запрос проходит по цепочке хэндлеров. **Servlet Filter chain**, **Spring Security FilterChain**, **Spring HandlerInterceptor**.\n" +
    "- **State** — объект меняет поведение в зависимости от внутреннего состояния. Можно реализовать через sealed-иерархию.\n" +
    "- **Command** — объектный запрос с параметрами. `Runnable`, `Callable`. С лямбдами почти исчезает как отдельный паттерн.\n" +
    "- **Iterator** — обход без раскрытия структуры. Java-контракт: `Iterator<T>` с `hasNext()` / `next()`.\n" +
    "- **Memento** — снимок состояния для отмены. Undo/redo в редакторах.\n" +
    "- **Visitor** — double dispatch. В Java 21 заменяется **sealed + switch с pattern matching** — элегантнее и exhaustiveness compile-time.\n\n" +
    "## Как modern Java изменил паттерны\n\n" +
    "> [!tip]\n" +
    "> - **Лямбды** схлопывают Strategy, Command, Observer, Callback в одну строку — больше не нужен отдельный класс-обёртка.\n" +
    "> - **Records** (Java 16) убирают Builder для простых value-объектов с малым числом полей.\n" +
    "> - **Sealed + switch pattern matching** (Java 21) реализует Visitor без Visitor-интерфейса, с exhaustiveness-проверкой компилятора.\n" +
    "> - **DI-контейнеры** (Spring, Guice) убирают ручной Singleton и Factory для управляемых объектов.\n" +
    "> - **Optional** и **Stream** — встроенный Null Object и Iterator/Builder в одном.\n\n" +
    "Паттерны не исчезают — меняется синтаксис их выражения. Понимание паттернов важно как **общий словарь** для обсуждения дизайна.\n\n" +
    "## Практические замечания на интервью\n\n" +
    "> [!production]\n" +
    "> - Не просто называйте паттерн — покажите **проблему**, которую он решает, и **trade-off**.\n" +
    "> - Свяжите с **JDK/Spring**: «Strategy — это `Comparator`», «Proxy — это Spring AOP».\n" +
    "> - Осознавайте недостатки: Singleton → скрытое глобальное состояние, сложнее тестировать. Strategy → индирекция.\n" +
    "> - Знайте, когда **не** применять: Builder для 2-3 обязательных полей — overkill. Observer для синхронной коммуникации — ненужная сложность.\n\n---\n\n" +
    "## Creational\n\n" +
    "**Control object creation.**\n\n" +
    "- **Singleton** — one instance per scope. In Java the best form is `enum Singleton { INSTANCE; }` (thread-safe, reflection-proof, serialises correctly). Also see Initialization-on-Demand Holder (3-6).\n" +
    "- **Factory Method** — an interface for creation, subclasses pick the type. JDK example: `Collection.iterator()` — every collection returns its own iterator.\n" +
    "- **Abstract Factory** — families of related objects. `DocumentBuilderFactory`, `XMLInputFactory`.\n" +
    "- **Builder** — step-by-step construction of a complex object, essential for immutables with many optional parameters (Effective Java Item 2). JDK: `StringBuilder`, `Stream.Builder`, `HttpRequest.newBuilder()`.\n" +
    "- **Prototype** — copying without knowing the concrete type. In Java usually via a copy constructor, not `clone()`.\n\n" +
    "## Structural\n\n" +
    "**Object composition.**\n\n" +
    "- **Adapter** — converts one interface to another. `Arrays.asList(T[])` adapts an array to `List`. `InputStreamReader` adapts `InputStream` (bytes) to `Reader` (chars).\n" +
    "- **Decorator** — adds behaviour dynamically without changing the interface. **JDK I/O streams** are the canonical example: `new BufferedReader(new InputStreamReader(new FileInputStream(...)))`.\n" +
    "- **Proxy** — a surrogate that controls access to the real object. Variants:\n" +
    "  - Remote proxy (RMI).\n" +
    "  - Virtual proxy (lazy loading, JPA proxies).\n" +
    "  - Protection proxy (security checks).\n" +
    "  - Smart proxy (adds logic — Spring AOP).\n" +
    "- **Facade** — a simple interface to a complex subsystem. Spring `JdbcTemplate` is a facade over JDBC.\n" +
    "- **Composite** — a tree where leaves and containers are handled uniformly. UI components, compiler ASTs.\n" +
    "- **Flyweight** — shared state for memory savings. `Integer.valueOf(-128..127)`, `String.intern()`.\n\n" +
    "## Behavioural\n\n" +
    "**Object interaction.**\n\n" +
    "- **Strategy** — interchangeable algorithms behind one interface. JDK: `Comparator`. With lambdas it collapses to a one-liner:\n" +
    "  ```java\n" +
    "  list.sort((a, b) -> a.name().compareTo(b.name()));\n" +
    "  ```\n" +
    "- **Observer** — one-to-many event subscription. Classic `java.util.Observer` (deprecated). Modern: `ApplicationEventPublisher` in Spring, `Flow.Subscriber` (reactive streams).\n" +
    "- **Template Method** — algorithm skeleton in the base class + hook methods subclasses override. JDK: `AbstractList`, `HttpServlet.doGet`. Spring: `JdbcTemplate`, `RestTemplate`.\n" +
    "- **Chain of Responsibility** — a request travels through a chain of handlers. **Servlet Filter chain**, **Spring Security FilterChain**, **Spring HandlerInterceptor**.\n" +
    "- **State** — an object changes behaviour with its internal state. Can be modelled with a sealed hierarchy.\n" +
    "- **Command** — an object-wrapped request. `Runnable`, `Callable`. With lambdas it almost disappears as a standalone pattern.\n" +
    "- **Iterator** — traversal without exposing structure. Java's `Iterator<T>` with `hasNext()` / `next()`.\n" +
    "- **Memento** — a state snapshot for undo. Editors' undo/redo.\n" +
    "- **Visitor** — double dispatch. In Java 21 replaced by **sealed + switch pattern matching** — more elegant with compile-time exhaustiveness.\n\n" +
    "## How modern Java reshaped the patterns\n\n" +
    "> [!tip]\n" +
    "> - **Lambdas** collapse Strategy, Command, Observer, Callback into a single expression — no wrapper class needed.\n" +
    "> - **Records** (Java 16) eliminate Builder for simple value objects with few fields.\n" +
    "> - **Sealed + switch pattern matching** (Java 21) implements Visitor without a Visitor interface, with compiler-checked exhaustiveness.\n" +
    "> - **DI containers** (Spring, Guice) replace manual Singleton and Factory for managed objects.\n" +
    "> - **Optional** and **Stream** — built-in Null Object and Iterator/Builder rolled together.\n\n" +
    "Patterns don't disappear — their syntactic expression changes. Understanding patterns is still valuable as a **shared vocabulary** for design discussions.\n\n" +
    "## Interview practice notes\n\n" +
    "> [!production]\n" +
    "> - Don't just name a pattern — show the **problem** it solves and the **trade-off**.\n" +
    "> - Tie it to **JDK/Spring**: \"Strategy is `Comparator`\", \"Proxy is Spring AOP\".\n" +
    "> - Know the downsides: Singleton → hidden global state, harder to test. Strategy → indirection.\n" +
    "> - Know when **not** to apply: Builder for 2-3 required fields is overkill. Observer for synchronous communication is unnecessary complexity.",
  code: `// --- Strategy Pattern (with lambdas) ---
import java.util.*;

@FunctionalInterface
interface PricingStrategy {
    double calculate(double basePrice, int quantity);
}

class OrderCalculator {
    private final PricingStrategy strategy;
    OrderCalculator(PricingStrategy strategy) { this.strategy = strategy; }
    double total(double basePrice, int qty) { return strategy.calculate(basePrice, qty); }
}

// --- Builder Pattern (immutable object) ---
class HttpRequest {
    private final String method, url, body;
    private final Map<String, String> headers;

    private HttpRequest(Builder b) {
        this.method = b.method;
        this.url = b.url;
        this.headers = Map.copyOf(b.headers);
        this.body = b.body;
    }

    static class Builder {
        private final String method, url;
        private Map<String, String> headers = new LinkedHashMap<>();
        private String body;
        Builder(String method, String url) { this.method = method; this.url = url; }
        Builder header(String k, String v) { headers.put(k, v); return this; }
        Builder body(String body) { this.body = body; return this; }
        HttpRequest build() { return new HttpRequest(this); }
    }
}

class PatternDemo {
    public static void main(String[] args) {
        PricingStrategy bulk = (price, qty) -> price * qty * 0.9;
        PricingStrategy retail = (price, qty) -> price * qty;

        var bulkCalc = new OrderCalculator(bulk);
        System.out.println(bulkCalc.total(100, 5));   // 450.0

        var retailCalc = new OrderCalculator(retail);
        System.out.println(retailCalc.total(100, 5)); // 500.0

        HttpRequest req = new HttpRequest.Builder("POST", "/api/orders")
            .header("Content-Type", "application/json")
            .body("{\\"item\\":\\"laptop\\"}")
            .build();
    }
}`,
  interviewQs: [
    {
      id: "3-8-q0",
      q:
        "Объясните Singleton и назовите два способа реализации в Java.\n\n---\n\n" +
        "Explain the Singleton pattern and name two ways to implement it in Java.",
      a:
        "Singleton — один экземпляр класса на scope, с глобальной точкой доступа.\n\n" +
        "**1. Enum singleton** (рекомендация Josh Bloch):\n" +
        "```java\n" +
        "public enum Db { INSTANCE; public void doWork() { ... } }\n" +
        "```\n" +
        "Thread-safe by construction, **защищён от reflection** (JVM не даёт создать второй enum-инстанс), корректно сериализуется.\n\n" +
        "**2. Initialization-on-Demand Holder**:\n" +
        "```java\n" +
        "public class Singleton {\n" +
        "    private Singleton() {}\n" +
        "    private static class Holder { static final Singleton INSTANCE = new Singleton(); }\n" +
        "    public static Singleton getInstance() { return Holder.INSTANCE; }\n" +
        "}\n" +
        "```\n" +
        "Ленивый, thread-safe через гарантии class init lock'а JVM.\n\n" +
        "**Double-checked locking** с `volatile` — третий вариант, но он error-prone (особенно до Java 5 с ослабленной JMM).\n\n" +
        "Недостатки Singleton в целом: скрытое глобальное состояние, сложности в тестировании. В Spring singleton-scope бина — альтернатива.\n\n---\n\n" +
        "Singleton — one instance per scope, with a global access point.\n\n" +
        "**1. Enum singleton** (Josh Bloch's recommendation):\n" +
        "```java\n" +
        "public enum Db { INSTANCE; public void doWork() { ... } }\n" +
        "```\n" +
        "Thread-safe by construction, **immune to reflection** (JVM won't let you create a second enum instance), serialises correctly.\n\n" +
        "**2. Initialization-on-Demand Holder**:\n" +
        "```java\n" +
        "public class Singleton {\n" +
        "    private Singleton() {}\n" +
        "    private static class Holder { static final Singleton INSTANCE = new Singleton(); }\n" +
        "    public static Singleton getInstance() { return Holder.INSTANCE; }\n" +
        "}\n" +
        "```\n" +
        "Lazy, thread-safe via the JVM's class init lock guarantees.\n\n" +
        "**Double-checked locking** with `volatile` is a third option but error-prone (especially pre-Java-5 with a looser JMM).\n\n" +
        "Overall Singleton downsides: hidden global state, harder to test. A Spring singleton-scoped bean is the usual modern alternative.",
      difficulty: "junior",
    },
    {
      id: "3-8-q1",
      q:
        "В чём разница между Decorator и Proxy? Дайте Java-пример каждого.\n\n---\n\n" +
        "What's the difference between Decorator and Proxy? Give a Java example of each.",
      a:
        "Оба оборачивают объект, но **намерение** разное.\n\n" +
        "**Decorator** — добавляет поведение **прозрачно** (тот же интерфейс, расширенный функционал).\n" +
        "Пример — Java I/O streams:\n" +
        "```java\n" +
        "Reader r = new BufferedReader(new InputStreamReader(new FileInputStream(path)));\n" +
        "// FileInputStream — данные; InputStreamReader — bytes→chars; BufferedReader — буферизация\n" +
        "```\n" +
        "Каждый слой добавляет свою ответственность, сохраняя контракт `Reader`.\n\n" +
        "**Proxy** — **контролирует доступ** к реальному объекту (lazy loading, security, remote access).\n" +
        "Примеры:\n" +
        "- `Collections.unmodifiableList(list)` — proxy, блокирующий мутации.\n" +
        "- JPA lazy-loading proxy — не достаёт данные до первого обращения.\n" +
        "- Spring AOP proxy — перехватывает вызовы для `@Transactional`, `@Cacheable`.\n\n" +
        "**Структурное отличие**: Proxy часто **создаёт или управляет** реальным объектом внутри. Decorator получает его **извне** как компонент.\n\n---\n\n" +
        "Both wrap an object, but their **intent** differs.\n\n" +
        "**Decorator** — adds behaviour **transparently** (same interface, enhanced functionality).\n" +
        "Example — Java I/O streams:\n" +
        "```java\n" +
        "Reader r = new BufferedReader(new InputStreamReader(new FileInputStream(path)));\n" +
        "// FileInputStream — data; InputStreamReader — bytes→chars; BufferedReader — buffering\n" +
        "```\n" +
        "Each layer adds a concern while keeping the `Reader` contract.\n\n" +
        "**Proxy** — **controls access** to the real object (lazy loading, security, remote access).\n" +
        "Examples:\n" +
        "- `Collections.unmodifiableList(list)` — proxy that blocks mutations.\n" +
        "- JPA lazy-loading proxy — fetches data only on first access.\n" +
        "- Spring AOP proxy — intercepts calls for `@Transactional`, `@Cacheable`.\n\n" +
        "**Structural difference**: a Proxy often **creates or manages** the real object internally. A Decorator receives it **externally** as a component.",
      difficulty: "mid",
    },
    {
      id: "3-8-q2",
      q:
        "Как лямбды, рекорды и sealed-классы изменили реализацию классических GoF-паттернов в modern Java?\n\n---\n\n" +
        "How have lambdas, records, and sealed classes changed the way classic GoF patterns are implemented in modern Java?",
      a:
        "**Лямбды** схлопывают многие behavioural-паттерны в одну строку:\n" +
        "- **Strategy** → лямбда, передаваемая методу. `list.sort((a, b) -> ...)`.\n" +
        "- **Command** → `Runnable` / `Supplier`.\n" +
        "- **Observer** → `Consumer<Event>` как callback.\n\n" +
        "**Records (Java 16)** убирают Builder-boilerplate для простых value-объектов. Если все поля обязательные и их немного — canonical-конструктор рекорда достаточен:\n" +
        "```java\n" +
        "record Point(int x, int y) {}  // вместо PointBuilder\n" +
        "```\n\n" +
        "**Sealed-классы (Java 17)** + pattern matching switch (Java 21) реализуют Visitor без отдельного Visitor-интерфейса, с **compile-time exhaustiveness**:\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square {}\n" +
        "double area = switch (s) {\n" +
        "    case Circle c -> Math.PI * c.r() * c.r();\n" +
        "    case Square sq -> sq.side() * sq.side();\n" +
        "};  // компилятор проверит все case\n" +
        "```\n" +
        "Abstract Factory может возвращать sealed-тип, потребитель использует pattern matching вместо полиморфной диспетчеризации.\n\n" +
        "**Паттерны не исчезают** — меняется синтаксис. Из class-based plumbing код становится более декларативным, expression-oriented.\n\n---\n\n" +
        "**Lambdas** collapse many behavioural patterns to a single expression:\n" +
        "- **Strategy** → a lambda passed to a method. `list.sort((a, b) -> ...)`.\n" +
        "- **Command** → `Runnable` / `Supplier`.\n" +
        "- **Observer** → `Consumer<Event>` as a callback.\n\n" +
        "**Records (Java 16)** remove Builder boilerplate for simple value objects. If all fields are required and few — the canonical constructor of a record suffices:\n" +
        "```java\n" +
        "record Point(int x, int y) {}  // no PointBuilder needed\n" +
        "```\n\n" +
        "**Sealed classes (Java 17)** + switch pattern matching (Java 21) implement Visitor without a Visitor interface, with **compile-time exhaustiveness**:\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square {}\n" +
        "double area = switch (s) {\n" +
        "    case Circle c -> Math.PI * c.r() * c.r();\n" +
        "    case Square sq -> sq.side() * sq.side();\n" +
        "};  // compiler verifies all cases\n" +
        "```\n" +
        "An Abstract Factory can return a sealed type, and the consumer uses pattern matching instead of polymorphic dispatch.\n\n" +
        "**Patterns don't disappear** — the syntax changes. Code shifts from class-based plumbing toward declarative, expression-oriented forms.",
      difficulty: "senior",
    },
  ],
  tip:
    "На интервью по паттернам всегда связывайте с **реальным примером из JDK или Spring**. «Strategy — это Comparator», «Proxy — основа Spring AOP» — такие связки показывают, что вы видите паттерны в живом коде, а не только в учебнике.\n\n---\n\n" +
    "In design-pattern interviews, always tie the pattern to a **real JDK or Spring example**. \"Strategy is Comparator\", \"Proxy is the foundation of Spring AOP\" — these links show you see patterns in live code, not just textbooks.",
  springConnection: {
    concept: "Design Patterns",
    springFeature: "Spring Framework Patterns",
    explanation:
      "Spring — выставка паттернов:\n\n" +
      "- **Singleton** — дефолтный scope бина.\n" +
      "- **Factory** — `BeanFactory`, `@Bean`-методы, `FactoryBean`.\n" +
      "- **Proxy** — AOP-прокси для `@Transactional`, `@Cacheable`, `@Async`, `@Secured`.\n" +
      "- **Template Method** — `JdbcTemplate`, `RestTemplate`, `JmsTemplate` — скелет операции с callback'ами.\n" +
      "- **Observer** — `ApplicationEventPublisher` + `@EventListener`.\n" +
      "- **Strategy** — pluggable `HandlerMapping`, `ViewResolver`, `ConversionService`.\n" +
      "- **Chain of Responsibility** — `FilterChain` в Spring Security, `HandlerInterceptor` в MVC.\n" +
      "- **Decorator** — `HttpServletRequestWrapper`, обёртки `DataSource`.\n" +
      "- **Facade** — `JdbcTemplate` над голым JDBC.\n\n" +
      "Понимание GoF — это понимание **архитектуры Spring**. Без них фреймворк кажется магией.\n\n---\n\n" +
      "Spring is a patterns showcase:\n\n" +
      "- **Singleton** — default bean scope.\n" +
      "- **Factory** — `BeanFactory`, `@Bean` methods, `FactoryBean`.\n" +
      "- **Proxy** — AOP proxies for `@Transactional`, `@Cacheable`, `@Async`, `@Secured`.\n" +
      "- **Template Method** — `JdbcTemplate`, `RestTemplate`, `JmsTemplate` — operation skeletons with callbacks.\n" +
      "- **Observer** — `ApplicationEventPublisher` + `@EventListener`.\n" +
      "- **Strategy** — pluggable `HandlerMapping`, `ViewResolver`, `ConversionService`.\n" +
      "- **Chain of Responsibility** — `FilterChain` in Spring Security, `HandlerInterceptor` in MVC.\n" +
      "- **Decorator** — `HttpServletRequestWrapper`, `DataSource` wrappers.\n" +
      "- **Facade** — `JdbcTemplate` over raw JDBC.\n\n" +
      "Understanding GoF is understanding **Spring's architecture**. Without them the framework feels like magic.",
  },
};
