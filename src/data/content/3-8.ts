import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-8",
  blockId: 3,
  title: "Design Patterns",
  summary:
    "Паттерны проектирования -- часто встречающиеся решения определенных проблем при проектировании архитектуры программ. Порождающие: Singleton, Prototype, Builder, Factory. Структурные: Adapter, Decorator, Proxy, Bridge, Facade, Composite, Flyweight. Поведенческие: Chain of Responsibility, State, Observer, Memento, Strategy, Iterator.\n\n---\n\nDesign patterns are proven solutions to recurring software design problems. Java interviews focus on creational patterns (Singleton, Factory, Builder), structural patterns (Proxy, Decorator, Adapter), and behavioral patterns (Strategy, Observer, Template Method).",
  deepDive:
    "Паттерны проектирования -- это готовые решения, стандартизация кода, программистский словарь.\n\nПорождающие паттерны (создание объектов без лишних зависимостей):\n- Singleton (одиночка) -- гарантирует один экземпляр класса с глобальной точкой доступа.\n- Prototype (прототип) -- копирование объектов без подробностей их реализации.\n- Builder (строитель) -- пошаговое создание сложных объектов.\n- Factory (фабрика) -- общий интерфейс для создания объектов, подклассы определяют конкретный тип.\n\nСтруктурные паттерны (иерархии классов):\n- Adapter -- позволяет несовместимым интерфейсам работать вместе.\n- Decorator (обертка) -- динамическое добавление поведения без наследования.\n- Proxy (заместитель) -- перехватывает вызовы к оригинальному объекту.\n- Facade (фасад) -- простой интерфейс к сложной системе.\n- Composite (компоновщик) -- древовидная структура объектов.\n- Flyweight (легковес) -- экономия памяти, разделение общего состояния.\n\nПоведенческие паттерны (взаимодействие между объектами):\n- Chain of Responsibility -- последовательная передача запросов по цепочке обработчиков.\n- Observer (наблюдатель) -- механизм подписки на события.\n- Strategy (стратегия) -- взаимозаменяемые алгоритмы (пример: Comparator).\n- State (состояние) -- объекты меняют поведение в зависимости от состояния.\n- Memento (снимок) -- сохранение и восстановление состояний.\n- Iterator -- обход элементов без раскрытия деталей реализации.\n\n---\n\nCreational patterns control object creation. The Singleton pattern ensures one instance per scope; in Java, the simplest implementation is a single-element enum (`enum Singleton { INSTANCE; }`), which is serialization-safe and reflection-proof. The Factory Method pattern defines an interface for creating objects and lets subclasses decide the concrete type -- `Collection.iterator()` is a JDK example. The Builder pattern separates construction of a complex object from its representation, invaluable for immutable objects with many optional parameters (Effective Java Item 2). The Abstract Factory provides a family of related objects without specifying concrete classes.\n\nStructural patterns deal with composition. The Proxy pattern provides a surrogate that controls access to the real object -- Spring AOP creates proxies that wrap beans to add transactional behavior, security checks, or logging. The Decorator pattern attaches additional responsibilities dynamically; Java I/O streams are a classic example (`BufferedInputStream` wrapping `FileInputStream`). The Adapter pattern converts one interface to another: `Arrays.asList()` adapts an array to the `List` interface.\n\nBehavioral patterns manage algorithms and communication. The Strategy pattern encapsulates interchangeable algorithms behind an interface, selected at runtime -- `Comparator` is a JDK Strategy. The Observer pattern defines a one-to-many dependency; `java.util.Observer` (deprecated) and modern event listeners/reactive streams follow this pattern. The Template Method defines an algorithm skeleton in a base class with hook methods that subclasses override -- `AbstractList.get()` and `HttpServlet.doGet()` are examples.\n\nModern Java has changed some patterns. Lambdas replace many Strategy and Command implementations -- instead of a `Comparator` class, you pass `(a, b) -> a.name().compareTo(b.name())`. Records reduce the need for Builder when the object has few fields. Sealed classes enable Visitor-like exhaustive pattern matching via switch expressions. The classic GoF Singleton is largely replaced by DI container management.\n\nIn interviews, don't just name patterns. Explain the problem they solve, show the Java code, connect to JDK or Spring usage, and discuss trade-offs. For example, the Singleton pattern is simple but makes unit testing harder (hidden global state); the Strategy pattern adds indirection but enables Open-Closed compliance.",
  code: `// --- Strategy Pattern (with lambdas) ---
import java.util.*;

@FunctionalInterface
interface PricingStrategy {
    double calculate(double basePrice, int quantity);
}

class OrderCalculator {
    private final PricingStrategy strategy;

    OrderCalculator(PricingStrategy strategy) {
        this.strategy = strategy;
    }

    double total(double basePrice, int qty) {
        return strategy.calculate(basePrice, qty);
    }
}

// --- Builder Pattern (immutable object) ---
class HttpRequest {
    private final String method;
    private final String url;
    private final Map<String, String> headers;
    private final String body;

    private HttpRequest(Builder b) {
        this.method = b.method;
        this.url = b.url;
        this.headers = Map.copyOf(b.headers); // immutable copy
        this.body = b.body;
    }

    static class Builder {
        private final String method;
        private final String url;
        private Map<String, String> headers = new LinkedHashMap<>();
        private String body;

        Builder(String method, String url) {
            this.method = method;
            this.url = url;
        }

        Builder header(String k, String v) { headers.put(k, v); return this; }
        Builder body(String body) { this.body = body; return this; }

        HttpRequest build() { return new HttpRequest(this); }
    }
}

// --- Demo ---
class PatternDemo {
    public static void main(String[] args) {
        // Strategy via lambda
        PricingStrategy bulk = (price, qty) -> price * qty * 0.9;
        PricingStrategy retail = (price, qty) -> price * qty;

        var bulkCalc = new OrderCalculator(bulk);
        System.out.println(bulkCalc.total(100, 5));   // 450.0

        var retailCalc = new OrderCalculator(retail);
        System.out.println(retailCalc.total(100, 5)); // 500.0

        // Builder
        HttpRequest req = new HttpRequest.Builder("POST", "/api/orders")
            .header("Content-Type", "application/json")
            .body("{\"item\":\"laptop\"}")
            .build();
    }
}`,
  interviewQs: [
    {
      id: "3-8-q0",
      q: "Explain the Singleton pattern and name two ways to implement it in Java.",
      a: "Singleton ensures exactly one instance of a class exists. Two implementations: (1) Enum singleton -- `enum Db { INSTANCE; }` -- serialization-safe, reflection-proof, concise. (2) Initialization-on-Demand Holder -- a private static inner class holding a static final instance, leveraging JVM class loading guarantees for thread-safe lazy initialization without synchronization. Double-checked locking with volatile is a third option but more error-prone.",
      difficulty: "junior",
    },
    {
      id: "3-8-q1",
      q: "What is the difference between the Decorator and Proxy patterns? Give a Java example of each.",
      a: "Both wrap an object, but their intent differs. Decorator adds behavior transparently (same interface, enhanced functionality) -- Java I/O: `new BufferedReader(new FileReader(path))` adds buffering. Proxy controls access to the real object (lazy loading, security, remote access) -- `Collections.unmodifiableList()` returns a proxy that blocks mutations. The structural difference is that a Proxy often creates or manages the real object internally, while a Decorator receives it from outside. Spring AOP uses the Proxy pattern to intercept method calls on beans.",
      difficulty: "mid",
    },
    {
      id: "3-8-q2",
      q: "How have lambdas, records, and sealed classes changed the way classic GoF patterns are implemented in modern Java?",
      a: "Lambdas collapse many behavioral patterns to a single line: Strategy becomes a lambda passed to a method, Command becomes a `Runnable` or `Supplier`, Observer becomes a `Consumer` callback. Records (Java 16) reduce Builder pattern boilerplate for simple value types -- if all fields are required and few in number, a record's canonical constructor suffices. Sealed classes enable the Visitor pattern without a separate Visitor interface: a sealed hierarchy with a switch expression over all permitted subtypes achieves exhaustive handling, checked by the compiler. The Abstract Factory can return sealed types, allowing the consumer to pattern-match instead of using polymorphic dispatch. These features don't eliminate patterns but reduce the ceremony, shifting from class-based plumbing to more declarative, expression-oriented code.",
      difficulty: "senior",
    },
  ],
  tip: "In design pattern interviews, always connect the pattern to a real JDK or Spring example. Saying 'Strategy is like Comparator' or 'Proxy powers Spring AOP' shows you see patterns in real code, not just textbooks.",
  springConnection: {
    concept: "Design Patterns",
    springFeature: "Spring Framework Patterns",
    explanation:
      "Spring is a showcase of design patterns. Singleton: default bean scope. Factory: BeanFactory and @Bean methods. Proxy: AOP proxies for @Transactional, @Cacheable, @Async. Template Method: JdbcTemplate, RestTemplate (execute skeleton with customizable callbacks). Observer: ApplicationEventPublisher and @EventListener. Strategy: pluggable HandlerMapping, ViewResolver. Understanding these patterns is understanding Spring's architecture.",
  },
};
