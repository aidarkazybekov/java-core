import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-3",
  blockId: 1,
  title: "Bytecode & Compilation",
  summary:
    "Java source code compiles to platform-independent bytecode (.class files), not native machine code. This intermediate representation is what makes 'write once, run anywhere' work. Understanding bytecode helps you reason about performance, decompilation, and what the JVM actually executes.",
  deepDive:
    "The `javac` compiler transforms `.java` source files into `.class` files containing bytecode — a stack-based instruction set designed for the JVM. Bytecode is not human-readable machine code; it is an intermediate representation that any JVM implementation can execute. Each `.class` file has a precise binary format: magic number (0xCAFEBABE), version info, constant pool, access flags, class/interface info, fields, methods, and attributes.\n\n" +
    "You can inspect bytecode using `javap -c MyClass` (disassembler bundled with JDK). Key bytecode instructions include: `aload/astore` (load/store object references), `iload/istore` (load/store ints), `invokevirtual` (instance method calls with polymorphism), `invokeinterface` (interface method calls), `invokestatic` (static calls), `invokespecial` (constructors, super calls, private methods), and `invokedynamic` (lambdas, string concatenation since Java 9). Understanding these helps you see what the JVM really does with your code.\n\n" +
    "A critical compilation detail: the compiler performs very few optimizations. Things like constant folding and dead code elimination happen at compile time, but almost all serious optimization (inlining, loop unrolling, escape analysis, lock elision) is deferred to the JIT compiler at runtime. This is deliberate — the JIT has runtime profiling data that the static compiler does not, allowing it to make better optimization decisions.\n\n" +
    "String concatenation is a great example of bytecode evolution. Before Java 9, `\"a\" + b + \"c\"` compiled to `StringBuilder.append()` chains. Since Java 9, it compiles to `invokedynamic` with `StringConcatFactory`, allowing the JVM to pick the optimal strategy at runtime. This is why you should stop manually using StringBuilder for simple concatenation — the JVM does it better.\n\n" +
    "Bytecode verification is a security feature: before executing any class, the JVM verifier checks that bytecode is well-formed, types are consistent, and stack operations are balanced. This prevents malicious or corrupted bytecode from crashing the JVM or violating memory safety. Verification happens during the linking phase of class loading.",
  code:
    `// Compile this, then run: javap -c -p BytecodeDemo
// to see the actual bytecode instructions
public class BytecodeDemo {

    // Compile-time constant folding — check bytecode to verify
    private static final int COMPILE_TIME_CONSTANT = 2 * 3 * 7; // becomes 42 in bytecode

    public static void main(String[] args) {
        // 1. See how string concatenation compiles (invokedynamic since Java 9)
        String name = "Java";
        int version = 21;
        String message = "Hello " + name + " " + version; // check bytecode!
        System.out.println(message);

        // 2. Autoboxing — bytecode reveals Integer.valueOf() calls
        Integer boxed = 42;           // invokestatic Integer.valueOf
        int unboxed = boxed;          // invokevirtual Integer.intValue

        // 3. Method dispatch — different invoke* instructions
        Object obj = "test";
        obj.toString();               // invokevirtual (virtual dispatch)
        String.valueOf(42);           // invokestatic (no dispatch)
        Runnable r = () -> {};        // invokedynamic (lambda metafactory)
        r.run();                      // invokeinterface

        // 4. Enhanced for-loop — compiles to iterator pattern
        var list = java.util.List.of("a", "b", "c");
        for (String s : list) {       // becomes Iterator.hasNext()/next()
            System.out.println(s);
        }

        // 5. Try-with-resources — generates complex bytecode
        // with synthetic null checks and suppressed exception handling
        try (var scanner = new java.util.Scanner(System.in)) {
            // bytecode includes: null check, close(), addSuppressed()
        }
    }

    // Polymorphic dispatch — invokevirtual with vtable lookup
    static void demonstrateDispatch() {
        java.util.List<String> list = new java.util.ArrayList<>();
        list.add("test"); // invokevirtual -> resolved at runtime via vtable
    }
}`,
  interviewQs: [
    {
      id: "1-3-q0",
      q: "What is bytecode and why does Java use it instead of compiling directly to machine code?",
      a: "Bytecode is a platform-independent intermediate instruction set stored in .class files. Java uses it to achieve 'write once, run anywhere' — the same .class files run on any platform that has a JVM. The JVM then interprets or JIT-compiles bytecode to native machine code at runtime. An additional benefit is that the JIT compiler can use runtime profiling data to make optimizations that a static ahead-of-time compiler cannot, like optimistic devirtualization and speculative inlining based on actual call patterns.",
      difficulty: "junior",
    },
    {
      id: "1-3-q1",
      q: "What are the different invoke* bytecode instructions and when is each used?",
      a: "There are five: `invokevirtual` is for regular instance method calls with virtual dispatch (most common). `invokeinterface` is for calling methods through an interface reference — slower than invokevirtual because it cannot use a fixed vtable offset. `invokespecial` is for constructors, private methods, and super calls — no virtual dispatch needed. `invokestatic` is for static methods. `invokedynamic` was added in Java 7 for dynamic languages and is used since Java 8 for lambda expressions (via LambdaMetafactory) and since Java 9 for string concatenation (via StringConcatFactory). Understanding invokedynamic is key to knowing how lambdas work at the bytecode level.",
      difficulty: "mid",
    },
    {
      id: "1-3-q2",
      q: "How did string concatenation change at the bytecode level in Java 9, and what are the performance implications?",
      a: "Before Java 9, `javac` compiled string concatenation to explicit `new StringBuilder().append().append().toString()` chains. This was rigid — the JVM could not change the strategy. In Java 9 (JEP 280), concatenation compiles to a single `invokedynamic` call to `StringConcatFactory.makeConcatWithConstants`. At runtime, the bootstrap method generates an optimized strategy (byte array copying, pre-sized buffers, etc.) linked to that call site. This allows the JVM to choose the fastest approach for the platform without changing the compiler. It also means manually using StringBuilder for simple concatenation is now an anti-pattern — the JVM's auto-generated strategy is usually faster because it can pre-compute the exact buffer size. StringBuilder is still useful when concatenating in a loop, since the compiler cannot optimize across iterations.",
      difficulty: "senior",
    },
  ],
  tip: "Run `javap -c -p YourClass` on any code you are curious about. Seeing the actual bytecode for autoboxing, lambdas, and string concatenation demystifies Java and gives you ammunition for interviews.",
  springConnection: {
    concept: "Bytecode generation",
    springFeature: "Spring AOP & CGLIB Proxies",
    explanation:
      "Spring generates proxy classes at runtime using CGLIB (bytecode generation) or JDK dynamic proxies. When you add @Transactional or @Cacheable, Spring creates a subclass of your bean (CGLIB) that overrides methods to add behavior — this is bytecode manipulation happening at runtime. Understanding bytecode helps you debug proxy-related issues like 'self-invocation bypasses @Transactional' — because the generated bytecode only intercepts calls through the proxy reference, not direct `this` calls.",
  },
};
