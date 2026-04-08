import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-4",
  blockId: 3,
  title: "Polymorphism",
  summary:
    "Полиморфизм -- возможность иметь разные формы для одной и той же сущности. Виды: Ad-hoc (статический) -- перегрузка методов; Параметрический -- дженерики; Динамический -- переопределение методов. Перегрузка -- несколько методов с одинаковым именем, но разными параметрами. Переопределение -- своя реализация метода суперкласса.\n\n---\n\nPolymorphism allows one interface to represent multiple underlying forms. Java supports compile-time polymorphism (method overloading) and runtime polymorphism (method overriding with dynamic dispatch). It is the mechanism that makes code extensible without modification.",
  deepDive:
    "Полиморфизм -- это возможность иметь разные формы для одной и той же сущности. Виды полиморфизма:\n- Ad-hoc (статический, компиляционный): перегрузка методов\n- Параметрический: дженерики\n- Динамический: переопределение методов\n\nПерегрузка метода -- позволяет задать несколько методов с одинаковым именем, но разными параметрами, в одном классе.\n\nПереопределение -- позволяет предоставить свою реализацию метода, определенного в суперклассе. При переопределении можно ослабить модификатор доступа (например, с protected на public) и заменить возвращаемый тип на его наследника.\n\nСигнатура метода -- это имя метода и его параметры. В сигнатуру не входят возвращаемый тип, исключения и модификаторы.\n\n---\n\nPolymorphism literally means 'many forms.' In Java it manifests in two ways. Compile-time (static) polymorphism is method overloading: multiple methods with the same name but different parameter lists, resolved by the compiler based on argument types. Runtime (dynamic) polymorphism is method overriding: the JVM dispatches the call to the actual object's class, not the declared reference type. The JVM accomplishes this via the virtual method table (vtable) -- each class has a table of method pointers, and an overridden entry points to the subclass's implementation.\n\nThe power of runtime polymorphism is that calling code depends on abstractions (parent class or interface), while concrete behavior varies with the actual object. This is the Open-Closed Principle in action: you add new behavior by adding a new subclass, without modifying existing code that uses the parent type. For example, a `List<Shape>` can contain circles, rectangles, and triangles, and calling `shape.area()` invokes the correct implementation for each.\n\nOverloading resolution has subtle rules. The compiler picks the most specific applicable method. Widening beats boxing, boxing beats varargs. This means `void foo(long x)` is preferred over `void foo(Integer x)` when called with an `int`. Autoboxing (Java 5) added complexity: `foo(Integer)` vs `foo(long)` with an `int` argument chooses `foo(long)` because widening a primitive is cheaper in the compiler's ranking. Understanding these rules prevents surprise dispatch errors.\n\nCovariant return types (Java 5) allow an overriding method to return a subtype of the parent's return type, which tightens the contract without breaking polymorphism. Contravariant parameter types are not supported in Java -- changing a parameter type creates an overload, not an override, which is a common mistake.\n\nGeneric polymorphism (parametric polymorphism) through generics enables type-safe code reuse. Combined with bounded wildcards (`<? extends T>`, `<? super T>`), it supports the PECS principle (Producer Extends, Consumer Super), allowing collections to be used polymorphically while preserving compile-time type safety.",
  code: `public abstract class Shape {
    public abstract double area();

    @Override
    public String toString() {
        return getClass().getSimpleName() + " area=" + area();
    }
}

public class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() { return Math.PI * radius * radius; }
}

public class Rectangle extends Shape {
    private final double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }

    @Override
    public double area() { return w * h; }
}

// --- Overloading resolution demo ---
public class OverloadDemo {
    static String describe(Object o)  { return "Object";  }
    static String describe(String s)  { return "String";  }
    static String describe(long l)    { return "long";    }
    static String describe(Integer i) { return "Integer"; }

    public static void main(String[] args) {
        // Runtime polymorphism
        Shape s = new Circle(5);
        System.out.println(s);         // "Circle area=78.539..."
        s = new Rectangle(3, 4);
        System.out.println(s);         // "Rectangle area=12.0"

        // Overloading resolution
        int x = 42;
        System.out.println(describe(x));          // "long" (widening beats boxing)
        System.out.println(describe("hello"));    // "String" (most specific)
        System.out.println(describe((Object)"a"));// "Object" (explicit cast)
    }
}`,
  interviewQs: [
    {
      id: "3-4-q0",
      q: "What is the difference between method overloading and method overriding?",
      a: "Overloading is compile-time polymorphism: same method name, different parameter lists, resolved by the compiler. Overriding is runtime polymorphism: subclass redefines a parent's instance method with the same signature, resolved by the JVM based on the actual object type at runtime via dynamic dispatch. Overloading is within the same class (or inherited); overriding is between a superclass and subclass.",
      difficulty: "junior",
    },
    {
      id: "3-4-q1",
      q: "Explain how the JVM performs dynamic method dispatch internally.",
      a: "Each class has a virtual method table (vtable) created at class loading time. The vtable is an array of pointers to the actual method implementations. When a subclass overrides a method, its vtable entry for that method points to the subclass's version. At the call site, the JVM reads the object's class pointer from the object header, looks up the vtable, and jumps to the method at the correct index. HotSpot further optimizes with inline caching: monomorphic call sites (always seeing the same type) are inlined directly, bimorphic sites use a two-way branch, and megamorphic sites fall back to the full vtable lookup.",
      difficulty: "mid",
    },
    {
      id: "3-4-q2",
      q: "How do bridge methods relate to polymorphism, and when does the compiler generate them?",
      a: "Bridge methods are synthetic methods the compiler generates to preserve polymorphism after type erasure. For example, if `class StringList extends ArrayList<String>` overrides `get(int)` to return `String`, after erasure the parent's method returns `Object`. The compiler creates a bridge method `Object get(int)` that delegates to `String get(int)`, maintaining the vtable contract. They also appear with covariant return types. You can detect them via `Method.isBridge()`. Ignoring bridge methods can cause issues in reflection-based frameworks that iterate over declared methods.",
      difficulty: "senior",
    },
  ],
  tip: "When explaining polymorphism in an interview, always give a concrete example: declare a variable with a parent type, assign a child instance, and call an overridden method. Then explain which version runs and why.",
  springConnection: {
    concept: "Polymorphism",
    springFeature: "Spring Interface-Based Design",
    explanation:
      "Spring heavily leverages polymorphism. You program to interfaces (e.g., `UserService`) and Spring injects the concrete implementation at runtime. This is runtime polymorphism in action. It enables swapping implementations (e.g., `JpaUserRepository` vs `MongoUserRepository`) without changing consuming code, and it is also what makes Spring's JDK dynamic proxy-based AOP possible.",
  },
};
