import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-5",
  blockId: 3,
  title: "Interfaces vs Abstract Classes",
  summary:
    "Абстрактный класс -- содержит базовый функционал для дочерних классов, методы помечаются abstract. Интерфейс -- набор правил (контракт), который должен соблюдать реализующий класс. С Java 8 интерфейсы поддерживают default и static методы. Поля интерфейса -- public static final, методы -- public abstract по умолчанию.\n\n---\n\nInterfaces define contracts with abstract methods and support multiple inheritance of type; abstract classes provide partial implementations with shared state. Choosing correctly between them is a key design decision tested in every senior interview.",
  deepDive:
    "Абстрактный класс -- это класс, который содержит базовый функционал для дочерних классов. Абстрактные методы помечаются ключевым словом abstract.\n\nИнтерфейс -- это набор правил (контракт), который должен соблюдать класс, реализующий интерфейс.\n- С Java 8 разрешается размещать реализацию default и static методов.\n- Поля по умолчанию являются public, static и final.\n- Методы по умолчанию public abstract.\n- abstract метод не может быть final или private.\n\nОтличия абстрактного класса от интерфейса:\n- Абстрактный класс может реализовать несколько интерфейсов, но наследоваться только от одного класса.\n- Интерфейс может наследовать другие интерфейсы.\n- Интерфейс не содержит конструктора, абстрактный содержит.\n- Абстрактные классы используются только при наличии отношения «is-a».\n- Интерфейсы могут реализовать не связанные друг с другом классы.\n- Абстрактные классы применяются при построении иерархии однотипных, схожих классов.\n\n---\n\nAn interface in Java defines a contract: a set of method signatures that implementing classes must fulfill. Since Java 8, interfaces can also contain default methods (with a body) and static methods. Java 9 added private methods in interfaces for sharing logic between defaults. Despite these additions, interfaces still cannot hold instance state -- all fields are implicitly `public static final`. An abstract class, by contrast, can have constructors, instance fields, and methods with any access modifier.\n\nThe critical differentiator is multiple inheritance. A class can implement many interfaces but extend only one class. This makes interfaces the primary tool for defining capabilities (Comparable, Serializable, AutoCloseable) that cut across class hierarchies. Abstract classes are best when subclasses share significant implementation or mutable state -- for example, `AbstractList` in the JDK provides a skeletal implementation of `List` so that concrete classes only override a few methods.\n\nDefault methods solved the interface evolution problem: adding a method to an interface no longer breaks all existing implementors. However, they introduced the diamond problem for interfaces. If two interfaces provide conflicting default methods, the implementing class must override the method to resolve the ambiguity. The resolution rules are: (1) class methods win over interface defaults, (2) more specific interfaces win over less specific ones (sub-interface beats super-interface), (3) if ambiguity remains, the compiler forces an explicit override.\n\nFunctional interfaces (interfaces with exactly one abstract method, annotated with `@FunctionalInterface`) are the backbone of lambda expressions. `Runnable`, `Callable`, `Function`, `Predicate`, `Consumer`, and `Supplier` from `java.util.function` are all functional interfaces. The compiler verifies that a `@FunctionalInterface` has exactly one abstract method, preventing accidental addition of a second one.\n\nA modern design heuristic: start with an interface. If you discover shared code among implementors, introduce an abstract skeletal class (e.g., `AbstractShape`) that implements the interface. Consumers depend on the interface; implementors may optionally extend the skeletal class. This is the 'interface + skeletal implementation' pattern recommended in Effective Java.",
  code: `// Interface with default and static methods
public interface Loggable {
    // abstract -- must be implemented
    String toLogString();

    // default -- provides fallback behavior
    default void log() {
        System.out.println("[LOG] " + toLogString());
    }

    // static utility
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

    // Template method -- defines skeleton, subclasses fill in details
    @Override
    public final String toLogString() {
        return getClass().getSimpleName()
            + "[id=" + id + ", created=" + createdAt + "] " + details();
    }

    protected abstract String details();

    public long getId() { return id; }
}

// Concrete class benefits from both interface and abstract class
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
        u.log(); // default method from Loggable, template from AbstractEntity

        Loggable quick = Loggable.of("quick message");
        quick.log();
    }
}`,
  interviewQs: [
    {
      id: "3-5-q0",
      q: "When should you use an interface versus an abstract class?",
      a: "Use an interface when defining a capability or contract that multiple unrelated classes can share (e.g., Comparable, Serializable). Use an abstract class when subclasses share common state or substantial implementation. Since a class can implement multiple interfaces but extend only one class, interfaces provide more flexibility for cross-cutting concerns.",
      difficulty: "junior",
    },
    {
      id: "3-5-q1",
      q: "How does Java resolve conflicts when a class implements two interfaces with the same default method?",
      a: "If two interfaces provide conflicting default methods and neither is more specific (one does not extend the other), the compiler forces the implementing class to override the method explicitly. Inside that override, you can delegate to a specific interface's default using `InterfaceA.super.method()`. The rules are: (1) class/abstract class methods always win, (2) a more specific sub-interface default wins over a less specific one, (3) otherwise the class must resolve the conflict.",
      difficulty: "mid",
    },
    {
      id: "3-5-q2",
      q: "Explain the 'interface + skeletal implementation' pattern and how the JDK uses it.",
      a: "The pattern defines a public interface (e.g., `List`) and a package-private or public abstract class (e.g., `AbstractList`) that provides a skeletal implementation. Clients code to the interface for maximum flexibility. Implementors extend the abstract class to inherit boilerplate (e.g., `iterator()`, `equals()`, `hashCode()`) and only override a few primitive methods. If a class already extends another class and cannot extend the skeletal class, it can still implement the interface directly and optionally use the skeletal class via a private inner class that delegates (simulated multiple inheritance). This pattern decouples contract from implementation while minimizing code duplication.",
      difficulty: "senior",
    },
  ],
  tip: "In interviews, mentioning the 'interface + skeletal implementation' pattern from Effective Java (Item 20) signals deep understanding and immediately elevates your answer above generic 'interfaces are for contracts' responses.",
  springConnection: {
    concept: "Interfaces",
    springFeature: "Spring JDK Dynamic Proxies",
    explanation:
      "When a Spring bean implements at least one interface, Spring defaults to JDK dynamic proxies for AOP, creating a proxy that implements the same interfaces. This is why Spring encourages programming to interfaces: the proxy is only type-compatible with the interface, not the concrete class. If you inject by concrete type, you need CGLIB proxying. Understanding this interface-vs-class proxy distinction explains many ClassCastException surprises in Spring applications.",
  },
};
