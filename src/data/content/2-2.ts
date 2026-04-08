import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-2",
  blockId: 2,
  title: "Variables & Scope",
  summary:
    "Модификатор **final** может применяться к переменным, параметрам, полям, методам и классам: класс не может иметь наследников, метод не может быть переопределен, поле/переменная не может изменить значение после инициализации. **Effectively final** -- переменная, значение которой не меняется после инициализации (важно для лямбд с Java 8). Модификатор **static** означает, что метод/поле принадлежит классу, а не объекту.\n\n---\n\n" +
    "Variable scope in Java determines where a variable is accessible and when it is eligible for garbage collection. Understanding the differences between local variables, instance variables, class variables, and their initialization rules prevents subtle bugs and is frequently tested in interviews.",
  deepDive:
    "**Модификатор final** может применяться к переменным, параметрам методов, полям и методам класса или самим классам. Класс не может иметь наследников; метод не может быть переопределен; поле не может изменить значение после инициализации; параметры методов не могут изменять значение внутри метода; значение локальных переменных не может быть изменено после присвоения. **Effectively final** -- это переменная, значение которой не меняется после инициализации, даже если она не объявлена с модификатором final. Было введено в Java 8: при захвате лямбда-выражением локальной переменной ее значение не должно меняться. **Модификатор static** говорит о том, что метод или поле класса принадлежит не объекту, а классу. Статические члены доступны без создания экземпляра класса, могут вызывать только другие статические методы и поля, не могут ссылаться на this и super. Статические методы можно перегрузить, но переопределить нельзя.\n\n---\n\n" +
    "Java has four variable categories with different scopes and lifetimes. Local variables exist within a method, constructor, or block — they live on the stack, have no default value (must be initialized before use), and are destroyed when the block exits. Instance variables (fields) belong to an object instance — they live on the heap, get default values (0, null, false), and exist as long as the object is reachable. Class variables (static fields) belong to the class itself — they live in Metaspace, get default values, and exist for the lifetime of the classloader. Method parameters behave like local variables but are initialized by the caller.\n\n" +
    "Default values are an important distinction. Instance and class variables are initialized to defaults: numeric types to 0, boolean to false, references to null. Local variables are NOT initialized by default — using an uninitialized local variable is a compile-time error. This is a deliberate design decision: forgetting to initialize a local variable is almost always a bug, so the compiler catches it. But for fields, requiring explicit initialization would be verbose and impractical.\n\n" +
    "The `var` keyword (Java 10+) enables local variable type inference. It is NOT dynamic typing — the type is inferred at compile time and is fixed. `var x = 42;` is identical to `int x = 42;` in the bytecode. `var` can only be used for local variables with initializers — not for fields, method parameters, or return types. A common gotcha: `var list = new ArrayList<>();` infers `ArrayList<Object>`, not the type you might expect. Use `var list = new ArrayList<String>();` to be explicit about the generic type.\n\n" +
    "Effectively final and lambdas: local variables used in lambda expressions or anonymous inner classes must be effectively final (not modified after initialization). This is because lambdas capture the value of the variable, not a reference to the stack slot. If the variable could change after capture, the lambda would have a stale copy. This is why you see the `final` keyword or 'effectively final' requirement. The workaround for mutable state in lambdas is to use an array or AtomicReference as the captured variable.\n\n" +
    "Shadowing occurs when a local variable has the same name as a field. Inside the method, the local variable takes precedence. You access the field via `this.fieldName`. Shadowing is legal but discouraged — it is a common source of bugs, especially in constructors where parameter names match field names. IDEs warn about it, and many style guides forbid it outside constructors.",
  code:
    `public class VariableScopeDemo {
    // Class variable (static) — lives in Metaspace, shared across all instances
    private static int instanceCount = 0;

    // Instance variable — lives on the heap, default value is 0
    private int id;

    // Instance variable — default value is null (NOT initialized)
    private String name;

    public VariableScopeDemo(String name) {
        // 'name' parameter shadows this.name field
        this.name = name; // 'this' disambiguates
        this.id = ++instanceCount;
    }

    public static void main(String[] args) {
        // === Default Values ===
        VariableScopeDemo obj = new VariableScopeDemo("test");
        System.out.println("Instance fields get defaults:");
        System.out.println("  id (set): " + obj.id);

        DefaultValues dv = new DefaultValues();
        System.out.println("  int: " + dv.intField);          // 0
        System.out.println("  boolean: " + dv.boolField);     // false
        System.out.println("  String: " + dv.refField);       // null

        // Local variable — must be initialized before use
        // int uninit;
        // System.out.println(uninit); // COMPILE ERROR: not initialized

        // === var (Java 10+) — type inference ===
        var message = "Hello";   // inferred as String (compile-time)
        var numbers = java.util.List.of(1, 2, 3); // List<Integer>
        // var nothing;           // COMPILE ERROR: cannot infer without initializer
        // var nullVal = null;    // COMPILE ERROR: cannot infer from null

        // GOTCHA: var with diamond operator
        var listBad = new java.util.ArrayList<>();    // ArrayList<Object>!
        var listGood = new java.util.ArrayList<String>(); // ArrayList<String>

        // === Effectively Final & Lambdas ===
        String prefix = "Item"; // effectively final — never reassigned
        // prefix = "Other";    // uncommenting makes it non-effectively-final

        java.util.List.of("A", "B", "C").forEach(item ->
            System.out.println(prefix + ": " + item) // OK: prefix is effectively final
        );

        // Workaround for mutable state in lambdas:
        int[] counter = {0}; // array reference is effectively final
        java.util.List.of("X", "Y", "Z").forEach(item -> {
            counter[0]++; // mutating array contents is fine
            System.out.println(counter[0] + ". " + item);
        });

        // === Block Scope ===
        {
            int blockScoped = 42;
            System.out.println("\\nBlock scoped: " + blockScoped);
        }
        // System.out.println(blockScoped); // COMPILE ERROR: out of scope

        // for-loop variable scope
        for (int i = 0; i < 3; i++) {
            // 'i' only exists inside this loop
        }
        // System.out.println(i); // COMPILE ERROR: 'i' out of scope
    }

    static class DefaultValues {
        int intField;        // default: 0
        boolean boolField;   // default: false
        String refField;     // default: null
    }
}`,
  interviewQs: [
    {
      id: "2-2-q0",
      q: "What is the difference between local variables and instance variables regarding initialization?",
      a: "Instance variables (fields) are automatically initialized to default values: 0 for numeric types, false for boolean, null for references. Local variables are NOT initialized by default — you must assign a value before using them, or the compiler will reject the code. This is a deliberate safety feature because an uninitialized local variable is almost certainly a bug. The JLS mandates definite assignment analysis for local variables at compile time.",
      difficulty: "junior",
    },
    {
      id: "2-2-q1",
      q: "Why must local variables used in lambdas be final or effectively final?",
      a: "Lambdas capture the VALUE of the local variable, not a reference to the stack slot. The local variable lives on the thread's stack and is destroyed when the method returns, but the lambda may outlive the method (e.g., stored in a field or passed to another thread). If the variable could be modified after capture, the lambda's copy would be stale, leading to confusing behavior. Java enforces effectively-final to prevent this inconsistency. The workaround for mutable state is capturing a reference to a mutable container (array, AtomicReference, or a custom holder object) — the reference is final, but its contents can change.",
      difficulty: "mid",
    },
    {
      id: "2-2-q2",
      q: "How does `var` interact with generics, and what are the pitfalls?",
      a: "var uses the compiler's inferred type, which can be surprising with generics. `var list = new ArrayList<>()` infers `ArrayList<Object>` because the diamond operator infers Object when there is no target type. You must write `var list = new ArrayList<String>()` to get the right generic type. With factory methods, `var list = List.of(1, 2)` correctly infers `List<Integer>`. Another pitfall: `var x = condition ? \"hello\" : 42;` infers `Serializable & Comparable<...>` — the intersection type of String and Integer — which is technically correct but probably not what you wanted. Also, var cannot be used for fields, method parameters, return types, or catch clause types — it is strictly for local variables with initializers.",
      difficulty: "senior",
    },
    {
      id: "2-2-q3",
      q: "Расскажите про модификаторы final и static. К чему они применяются?",
      a: "Модификатор final: к классу -- класс не может иметь наследников; к методу -- метод не может быть переопределен; к полю -- значение не может измениться после инициализации; к параметру/локальной переменной -- значение не может быть изменено после присвоения. Модификатор static: метод или поле принадлежит классу, а не объекту. Доступ без создания экземпляра. Статические методы могут вызывать только другие статические методы, не могут ссылаться на this/super. Статические методы можно перегрузить, но нельзя переопределить.",
      difficulty: "junior",
    },
    {
      id: "2-2-q4",
      q: "Что такое effectively final и зачем это нужно?",
      a: "Effectively final -- это переменная, значение которой не меняется после инициализации, даже если она не объявлена с модификатором final. Концепция была введена в Java 8 и связана с лямбда-выражениями: при захвате лямбда-выражением локальной переменной ее значение не должно меняться. Лямбда захватывает копию значения переменной (а не ссылку на ячейку стека), поэтому если значение изменится после захвата, копия будет устаревшей.",
      difficulty: "mid",
    },
    {
      id: "2-2-q5",
      q: "Каков порядок инициализации статических полей потомка и его предка?",
      a: "Статические блоки и поля инициализируются от первого предка до последнего наследника во время загрузки класса ClassLoader-ом. Сначала инициализируется статическое поле, потом статический блок. При создании объекта попарно от предка до последнего потомка вызываются: инициализация нестатических полей, динамический блок инициализации, затем конструктор.",
      difficulty: "mid",
    },
  ],
  tip: "Запомните: effectively final переменная -- та, значение которой не меняется после инициализации, даже без ключевого слова final. Это критично для лямбд. Если нужна мутация в лямбде -- используйте AtomicInteger или одноэлементный массив.\n\n---\n\n" +
    "When a local variable captures a value in a lambda and you need to mutate it, use an AtomicInteger or a single-element array as the captured reference. The reference is effectively final, but its contents are mutable.",
  springConnection: {
    concept: "Variable scope and lifecycle",
    springFeature: "Spring Bean Scopes (singleton, prototype, request, session)",
    explanation:
      "Spring bean scopes map to variable lifetime concepts. A singleton-scoped bean is like a static class variable — one instance for the application's lifetime. A prototype-scoped bean is like a local variable — a new instance each time, eligible for GC when no longer referenced. Request and session scopes in Spring MVC tie bean lifetime to HTTP request/session boundaries. Understanding scope helps you avoid a common bug: injecting a request-scoped bean into a singleton — the singleton captures one instance forever instead of getting a fresh one per request. Spring's scoped proxies solve this.",
  },
};
