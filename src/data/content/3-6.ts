import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-6",
  blockId: 3,
  title: "Access Modifiers & static",
  summary:
    "Модификаторы доступа: private (класс), default/package-private (пакет), protected (наследники + пакет), public (вся система). Модификатор final: класс не может иметь наследников, метод не может быть переопределен, поле не может изменить значение после инициализации. Модификатор static: метод/поле принадлежит классу, а не объекту.\n\n---\n\nAccess modifiers (public, protected, default, private) control visibility of classes, fields, and methods. The `static` keyword binds a member to the class rather than any instance. Mastering both is critical for encapsulation, API design, and understanding class loading.",
  deepDive:
    "Модификаторы доступа:\n- private: область видимости -- класс\n- default (package-private): текущий класс, пакет\n- protected: наследники, текущий класс, классы в текущем пакете\n- public: класс/члены класса доступны всем\n\nМодификатор final может применяться к переменным, параметрам методов, полям, методам и классам:\n- Класс не может иметь наследников\n- Метод не может быть переопределен\n- Поле не может изменить значение после инициализации\n- Параметры/локальные переменные не могут менять значение\n\nEffectively final -- переменная, значение которой не меняется после инициализации, даже без модификатора final (Java 8, для лямбда-выражений).\n\nМодификатор static -- метод или поле принадлежит классу, а не объекту, доступ без создания экземпляра. Статические методы могут вызывать только другие статические методы и поля, не могут ссылаться на this и super. Статические методы можно перегрузить, но переопределить нельзя.\n\n---\n\nJava has four access levels. `private` restricts to the declaring class only -- not even subclasses can access it. Default (package-private, no keyword) allows access within the same package. `protected` extends package-private by also allowing subclass access regardless of package. `public` means unrestricted access. The encapsulation principle dictates: make everything as private as possible and widen access only with justification. Fields should almost always be private, exposed through getter/setter methods if needed.\n\nSubtle rules trip up candidates. A `protected` member is accessible to subclasses in other packages only through inheritance -- you cannot access a protected member of a sibling instance of the parent class in a different package. Top-level classes can only be `public` or package-private; inner classes can use all four modifiers. With Java modules (JPMS, Java 9+), even `public` classes are inaccessible unless the module exports the package, adding another layer of visibility control.\n\nThe `static` keyword means 'belongs to the class, not to an instance.' Static fields are shared across all instances and live in metaspace (not on the heap per object). Static methods cannot access instance members or use `this`/`super`. Static blocks run once when the class is loaded -- useful for initializing complex static state. A common idiom is the static factory method (`of()`, `valueOf()`, `getInstance()`) which provides named, flexible alternatives to constructors.\n\nStatic initialization order can cause subtle bugs. Static fields are initialized in textual order; a static field referencing another that is declared later sees the default value (0, null, false). Circular static dependencies between classes can cause a class to be used before its static initializer completes, leading to `NullPointerException` or `ExceptionInInitializerError`. The 'Initialization-on-Demand Holder' idiom exploits the JLS guarantee that a class is not initialized until first use to implement thread-safe lazy singletons without synchronization.\n\nStatic imports (`import static java.lang.Math.PI`) reduce verbosity but can harm readability if overused. Using `static` for utility methods in final classes with private constructors (e.g., `Collections`, `Math`, `Objects`) is idiomatic Java. However, static methods are not polymorphic -- they cannot be overridden, only hidden -- so they are unsuitable when you need late binding.",
  code: `public class Counter {
    // Static field: shared across all instances, lives in metaspace
    private static int totalCount = 0;

    // Instance field: per-object, lives on the heap
    private int localCount = 0;

    // Static block: runs once at class loading time
    static {
        System.out.println("Counter class loaded, totalCount initialized");
    }

    public void increment() {
        localCount++;
        totalCount++;  // static field accessible from instance method
    }

    // Static method: no 'this', cannot access instance fields directly
    public static int getTotalCount() {
        // localCount++;  -- compile error: cannot access instance member
        return totalCount;
    }

    // Private constructor + static factory (common pattern)
    private Counter() {}

    public static Counter create() {
        return new Counter();  // named factory, could add caching
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
      q: "What are the four access modifiers in Java and what is their scope?",
      a: "private: same class only. default (package-private): same package. protected: same package plus subclasses in other packages (through inheritance only). public: everywhere. Top-level classes can only be public or package-private. The general rule is to use the most restrictive modifier possible to maintain encapsulation.",
      difficulty: "junior",
    },
    {
      id: "3-6-q1",
      q: "Can you override a static method? What happens if you define the same static method in a subclass?",
      a: "No, static methods cannot be overridden because they are resolved at compile time based on the reference type, not the runtime object type. If a subclass defines a static method with the same signature, it hides the parent's static method. Calling via the parent type invokes the parent's version; calling via the child type invokes the child's version. This is static binding, not dynamic dispatch, so polymorphism does not apply.",
      difficulty: "mid",
    },
    {
      id: "3-6-q2",
      q: "Explain the Initialization-on-Demand Holder idiom and why it is preferred over double-checked locking for singletons.",
      a: "The Holder idiom uses a private static inner class containing a static final instance. Per JLS 12.4.1, a class is not initialized until first active use. Calling `getInstance()` triggers loading of the Holder class, which initializes the singleton. The JVM guarantees that class initialization is thread-safe (the class init lock). This is lazy, thread-safe, and requires no synchronization at the call site, unlike double-checked locking which requires a `volatile` field and careful ordering. It is also immune to reflection-based breaks if you add an enum variant, though enum singletons are even simpler.",
      difficulty: "senior",
    },
  ],
  tip: "When asked about static in interviews, mention that static methods cannot be mocked easily in traditional Mockito (pre-3.4). This shows you understand the testing implications of design decisions, not just the language semantics.",
  springConnection: {
    concept: "static & Access Modifiers",
    springFeature: "Spring Bean Scopes & Utility Classes",
    explanation:
      "Spring singletons are not Java `static` singletons -- they are one instance per ApplicationContext, not per classloader. Understanding this distinction prevents confusion. Also, Spring's @Bean factory methods are instance methods on @Configuration classes (CGLIB-proxied), not static methods, precisely because static methods cannot be intercepted for scope management. If you make a @Bean method static, Spring loses the ability to enforce scoping and inter-bean references.",
  },
};
