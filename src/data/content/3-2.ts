import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-2",
  blockId: 3,
  title: "Constructors & this",
  summary:
    "Конструктор -- это специальный метод, у которого отсутствует возвращаемый тип и который имеет то же имя, что и класс. Конструктор вызывается при создании нового объекта класса и определяет действия, необходимые для его инициализации.\n\n---\n\nConstructors initialize object state at creation time and cannot be inherited. The `this` keyword refers to the current instance and enables constructor chaining, field disambiguation, and passing the current object as an argument.",
  deepDive:
    "Конструктор -- это специальный метод, у которого отсутствует возвращаемый тип и который имеет то же имя, что и класс, в котором он используется. Конструктор вызывается при создании нового объекта класса и определяет действия, необходимые для его инициализации.\n\nПорядок инициализации: статические поля и блоки инициализируются при загрузке класса ClassLoader-ом (от первого предка до последнего наследника). Затем при создании объекта попарно от предка до последнего потомка вызываются: инициализация полей (не static), динамический блок инициализации, затем конструктор.\n\n---\n\nA constructor is a special method whose name matches the class name, has no return type (not even void), and is invoked exactly once per `new` expression. If you declare no constructor, the compiler inserts a default no-arg constructor that calls `super()`. The moment you define any constructor, the default disappears -- a common source of compilation errors when subclasses expect a no-arg parent constructor that no longer exists.\n\nConstructor chaining via `this(...)` lets one constructor delegate to another within the same class, reducing duplication. The call to `this(...)` or `super(...)` must be the first statement in the constructor body (a restriction relaxed only in preview features as of Java 22). Order of execution during object creation is: (1) static initializers and static blocks (once, at class load), (2) instance initializer blocks in textual order, (3) the constructor body after chaining resolves.\n\nThe `this` keyword is an implicit reference to the current object. It has three primary uses: disambiguating a field from a parameter with the same name (`this.name = name`), invoking another constructor (`this(...)`), and passing the current instance to another method or constructor (`register(this)`). Note that `this` cannot be used in a static context because static methods belong to the class, not to any instance.\n\nA subtle pitfall is \"leaking this\" during construction. If you pass `this` to an external method or publish it to another thread inside the constructor, the object may be observed in a partially constructed state. This is especially dangerous in multithreaded code: fields assigned after the leak point may not yet be visible to the observer. The Java Memory Model does not guarantee safe publication of `this` during construction unless you use final fields or explicit synchronization.\n\nCopy constructors (a constructor that takes an instance of its own class) are a useful alternative to `clone()`. They are type-safe, do not require implementing `Cloneable`, and give full control over deep vs shallow copying. Record classes (Java 16+) generate a canonical constructor automatically but allow you to add compact constructors for validation.",
  code: `public class Account {
    private final String owner;
    private double balance;
    private final long createdAt;

    // Primary constructor
    public Account(String owner, double balance) {
        if (balance < 0) throw new IllegalArgumentException("Negative balance");
        this.owner = owner;       // 'this' disambiguates field from param
        this.balance = balance;
        this.createdAt = System.currentTimeMillis();
    }

    // Chained constructor -- delegates to the primary one
    public Account(String owner) {
        this(owner, 0.0);         // must be the first statement
    }

    // Copy constructor -- safer alternative to clone()
    public Account(Account other) {
        this(other.owner, other.balance);
    }

    // Instance initializer block -- runs before every constructor body
    {
        System.out.println("Instance initializer: object being created");
    }

    public void deposit(double amount) {
        this.balance += amount;   // 'this' is optional here but adds clarity
    }

    public Account transferTo(Account target, double amount) {
        this.balance -= amount;
        target.deposit(amount);
        return this;              // returning 'this' enables method chaining
    }

    public static void main(String[] args) {
        Account a = new Account("Alice", 1000);
        Account b = new Account("Bob");
        a.transferTo(b, 200).deposit(50); // chained via 'return this'
        System.out.println(a.balance);    // 850.0
        System.out.println(b.balance);    // 200.0
    }
}`,
  interviewQs: [
    {
      id: "3-2-q0",
      q: "What happens if you don't define any constructor in a class?",
      a: "The compiler generates a default no-argument constructor that simply calls `super()` (the parent's no-arg constructor). If the parent class has no accessible no-arg constructor, the code will not compile. As soon as you define any explicit constructor, the compiler stops generating the default one.",
      difficulty: "junior",
    },
    {
      id: "3-2-q1",
      q: "In what order are static blocks, instance initializers, and constructors executed? What about inheritance?",
      a: "On first class access: parent static initializers/blocks, then child static initializers/blocks (once per class). On every `new`: parent instance initializers then parent constructor body, followed by child instance initializers then child constructor body. Instance initializers are copied into every constructor by the compiler, executing before the constructor's own code but after the `super()` call.",
      difficulty: "mid",
    },
    {
      id: "3-2-q2",
      q: "What is the 'leaking this' problem and why is it dangerous in concurrent code?",
      a: "Leaking `this` means passing the current instance to external code before the constructor finishes. In concurrent contexts, another thread may see the object in a half-constructed state -- fields not yet assigned, final field semantics not yet guaranteed by the JMM. For example, registering `this` as a listener inside a constructor can let callbacks execute against uninitialized fields. The fix is to use a static factory method that constructs the object fully, then registers it externally.",
      difficulty: "senior",
    },
  ],
  tip: "If your class has multiple constructors, use a single 'primary' constructor with all parameters and have others chain to it via `this(...)`. This mirrors the telescoping pattern and guarantees all validation runs in one place.",
  springConnection: {
    concept: "Constructors",
    springFeature: "Constructor Injection",
    explanation:
      "Spring's preferred DI style is constructor injection: the container calls the constructor with resolved dependencies. Since Spring 4.3, a single-constructor class doesn't even need @Autowired. Constructor injection guarantees that required dependencies are non-null and makes beans immutable-friendly (final fields), directly leveraging Java's constructor semantics.",
  },
};
