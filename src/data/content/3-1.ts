import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-1",
  blockId: 3,
  title: "Classes & Objects",
  summary:
    "Classes are blueprints that define state (fields) and behavior (methods); objects are runtime instances allocated on the heap. Understanding memory layout, class loading, and the relationship between reference variables and heap objects is fundamental to every Java interview.",
  deepDive:
    "A class in Java is a compile-time construct that the JVM loads, verifies, and links before any instance is created. The class file contains the constant pool, field descriptors, method bytecode, and metadata such as access flags. When you write `new MyClass()`, the JVM allocates memory on the heap for that object's instance fields (plus an object header containing the mark word, klass pointer, and potential padding for alignment). The reference variable itself lives on the stack (or inside another object if it is a field).\n\nObject identity versus equality is a crucial distinction. Two references can point to the same object (`==` returns true) or to different objects with identical state (`equals()` returns true if properly overridden). The default `equals()` inherited from `Object` checks reference identity, which is almost never what domain code wants. Failing to override `equals()` and `hashCode()` together is one of the most common bugs in production Java.\n\nThe lifecycle of an object begins with allocation and constructor execution and ends when no strong references point to it and the garbage collector reclaims the memory. Between these events, an object may be softly, weakly, or phantom-reachable, each with distinct GC semantics. Finalizers (`finalize()`) are effectively deprecated since Java 9 in favor of `Cleaner` and try-with-resources, because finalizer execution order is non-deterministic and can resurrect objects, causing memory leaks.\n\nAnother subtlety is that Java passes object references by value. When you pass a reference to a method, the method receives a copy of the pointer, not the object itself. Reassigning the parameter inside the method has no effect on the caller's variable, but mutating the object through the copied reference is visible everywhere. This is a perennial interview topic that trips up candidates who conflate \"pass by reference\" with \"passing a reference by value.\"\n\nFinally, nested and inner classes deserve attention. A non-static inner class holds an implicit reference to its enclosing instance, which can cause memory leaks if the inner class outlives the outer object (common with listeners and callbacks). Static nested classes do not carry this reference and are generally preferred unless access to the enclosing instance is required.",
  code: `// Demonstrates class structure, object creation, and reference semantics
public class Employee {
    // Instance fields (stored on the heap per object)
    private final String name;
    private double salary;

    // Static field (stored in metaspace, shared across all instances)
    private static int headcount = 0;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
        headcount++;
    }

    // Passing references by value demo
    public static void tryReassign(Employee e) {
        e = new Employee("Ghost", 0); // caller's reference is unchanged
    }

    public static void mutate(Employee e) {
        e.salary = 999_999;           // caller sees the mutation
    }

    public static void main(String[] args) {
        Employee a = new Employee("Alice", 80_000);
        Employee b = a;               // both point to the same heap object

        System.out.println(a == b);   // true  (same reference)

        tryReassign(a);
        System.out.println(a.name);   // "Alice" (unchanged)

        mutate(a);
        System.out.println(a.salary); // 999999.0 (mutated via copied ref)
        System.out.println(b.salary); // 999999.0 (b points to same object)
    }
}`,
  interviewQs: [
    {
      id: "3-1-q0",
      q: "What is the difference between a class and an object in Java?",
      a: "A class is a compile-time blueprint stored as a .class file containing field definitions, method bytecode, and metadata. An object is a runtime instance allocated on the heap when `new` is invoked. The class is loaded once by the ClassLoader; many objects can be created from a single class. The reference variable (stack) points to the object (heap).",
      difficulty: "junior",
    },
    {
      id: "3-1-q1",
      q: "Is Java pass-by-reference or pass-by-value? Explain with an example.",
      a: "Java is always pass-by-value. For primitives, the value itself is copied. For objects, the reference (pointer) is copied by value. Inside a method, reassigning the parameter to a new object does not affect the caller's variable. However, mutating the object through the copied reference is visible to the caller because both references point to the same heap object.",
      difficulty: "mid",
    },
    {
      id: "3-1-q2",
      q: "Explain the memory layout of a Java object on the HotSpot JVM, including the object header.",
      a: "On HotSpot (64-bit, compressed oops enabled), an object header is typically 12 bytes: an 8-byte mark word (hash code, GC age, lock state, biased locking bits) and a 4-byte compressed klass pointer referencing the class metadata in metaspace. Instance fields follow, laid out by the JVM with field reordering and padding for alignment (objects are aligned to 8-byte boundaries). Arrays add a 4-byte length field after the header. The total size is always rounded up to the next 8-byte multiple, meaning even an empty `new Object()` consumes 16 bytes.",
      difficulty: "senior",
    },
  ],
  tip: "When an interviewer asks about pass-by-value, draw a stack/heap diagram showing two reference variables pointing to the same heap object -- it instantly proves you understand the mechanics.",
  springConnection: {
    concept: "Classes & Objects",
    springFeature: "Spring Bean Lifecycle",
    explanation:
      "Spring manages object creation through the IoC container. Instead of calling `new`, you declare beans (classes) and Spring instantiates, configures, and wires them. Understanding how objects are created and referenced is essential to grasping singleton vs prototype scope, where a singleton bean means one instance per ApplicationContext (single reference shared), while prototype gives a new heap object per injection point.",
  },
};
