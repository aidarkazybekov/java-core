import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-7",
  blockId: 3,
  title: "SOLID Principles",
  summary:
    "SOLID is a set of five object-oriented design principles that produce maintainable, testable, and extensible code. They guide class design decisions and are among the most frequently discussed topics in mid-to-senior Java interviews.",
  deepDive:
    "The Single Responsibility Principle (SRP) states that a class should have only one reason to change. This does not mean one method -- it means one axis of change. A `UserService` that handles authentication, email sending, and database persistence has three reasons to change. Splitting it into `AuthService`, `EmailService`, and `UserRepository` isolates change and simplifies testing. In practice, SRP often manifests as extracting collaborators and injecting them as dependencies.\n\nThe Open-Closed Principle (OCP) says classes should be open for extension but closed for modification. You achieve this through polymorphism: define abstractions (interfaces or abstract classes) and add new behavior by implementing them, not by editing existing code. The Strategy pattern is a textbook OCP example. The Liskov Substitution Principle (LSP) requires that subtypes be substitutable for their base types without altering correctness. A classic violation: `Square extends Rectangle` breaks LSP if `setWidth()` and `setHeight()` are independent in Rectangle but coupled in Square. Violating LSP causes bugs in code that accepts the base type.\n\nThe Interface Segregation Principle (ISP) says clients should not be forced to depend on methods they don't use. A fat `Repository` interface with `find`, `save`, `delete`, and `export` forces read-only clients to depend on mutating methods. Splitting into `ReadableRepository` and `WritableRepository` respects ISP. The Dependency Inversion Principle (DIP) states that high-level modules should depend on abstractions, not on low-level modules. Both should depend on interfaces. This is the theoretical foundation of Dependency Injection frameworks.\n\nIn real codebases, SOLID is about trade-offs, not absolutes. Over-applying SRP leads to class explosion; rigid OCP can produce unnecessary abstraction layers. The principles are heuristics for identifying design smells: when a change ripples across many files, some SOLID principle is likely violated. Senior engineers apply them judiciously, refactoring toward SOLID as complexity grows rather than imposing it prematurely.\n\nInterviewers often ask for concrete violations and fixes. Prepare examples: a God class violating SRP, an if-else chain violating OCP (replace with polymorphism), a broken subtype violating LSP, a fat interface violating ISP, and direct `new` instantiation of dependencies violating DIP (fix with constructor injection).",
  code: `// --- DIP + OCP example ---

// Abstraction (interface)
public interface NotificationSender {
    void send(String to, String message);
}

// Low-level modules implement the abstraction
public class EmailSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("Email to " + to + ": " + message);
    }
}

public class SmsSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("SMS to " + to + ": " + message);
    }
}

// High-level module depends on the abstraction (DIP)
// Adding new channels requires no changes here (OCP)
public class OrderService {
    private final NotificationSender sender; // depends on interface

    // Constructor injection -- DIP in practice
    public OrderService(NotificationSender sender) {
        this.sender = sender;
    }

    public void placeOrder(String customerContact, String item) {
        // ... order logic ...
        sender.send(customerContact, "Your order for " + item + " is confirmed!");
    }

    public static void main(String[] args) {
        // Swap implementations without changing OrderService
        OrderService emailOrders = new OrderService(new EmailSender());
        emailOrders.placeOrder("alice@mail.com", "Laptop");

        OrderService smsOrders = new OrderService(new SmsSender());
        smsOrders.placeOrder("+1234567890", "Phone");
    }
}`,
  interviewQs: [
    {
      id: "3-7-q0",
      q: "Explain the Single Responsibility Principle with an example of a violation and how to fix it.",
      a: "SRP states a class should have one reason to change. Violation: a `ReportService` that fetches data from a database, applies business rules, and formats output as PDF. If the database schema changes, the business logic changes, or the output format changes, the same class must be modified. Fix: split into `ReportRepository` (data access), `ReportCalculator` (business logic), and `PdfFormatter` (presentation). Each class has one axis of change and can be tested independently.",
      difficulty: "junior",
    },
    {
      id: "3-7-q1",
      q: "How does the Liskov Substitution Principle differ from simple IS-A inheritance? Give a classic violation.",
      a: "IS-A is structural (Dog IS-A Animal), but LSP is behavioral: a subclass must honor the base class's contract including preconditions, postconditions, and invariants. Classic violation: Square extends Rectangle. Rectangle's contract allows independent width/height changes, but Square couples them (setting width also sets height). Code expecting a Rectangle that calls setWidth(5) then setHeight(3) and asserts area == 15 breaks with a Square (area would be 9). Fix: use separate classes or make Rectangle immutable.",
      difficulty: "mid",
    },
    {
      id: "3-7-q2",
      q: "In a large microservices codebase, how do you balance SOLID principles against practical concerns like performance and code complexity?",
      a: "SOLID principles are guidelines, not laws. Over-applying SRP can cause class explosion and indirection overhead that hurts debuggability. OCP taken to an extreme produces abstraction layers no one needs yet (YAGNI violation). In microservices, each service is already an SRP/DIP boundary -- inside a small service, pragmatic design may tolerate fewer abstractions. The key is to apply SOLID where change is expected: define interfaces at module boundaries, keep internal implementation simple, and refactor toward SOLID when real change pressure appears. Performance-sensitive paths may intentionally violate DIP (direct calls vs virtual dispatch) with benchmarking to justify it. The senior skill is knowing when the cost of the principle exceeds its benefit.",
      difficulty: "senior",
    },
  ],
  tip: "When asked about SOLID, don't just recite definitions -- give a before/after code example for at least one principle. Showing a concrete refactoring demonstrates that you apply these principles in practice.",
  springConnection: {
    concept: "SOLID Principles",
    springFeature: "Spring Dependency Injection",
    explanation:
      "Spring is essentially the Dependency Inversion Principle made into a framework. High-level business logic depends on interfaces; Spring's IoC container wires in concrete implementations at runtime. @Autowired, @Qualifier, and @Primary are DIP tooling. Spring profiles (`@Profile`) enable OCP by swapping implementations per environment. Understanding SOLID is understanding why Spring was designed the way it was.",
  },
};
