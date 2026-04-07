import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-3",
  blockId: 3,
  title: "Inheritance & super",
  summary:
    "Inheritance lets a subclass reuse and extend a parent class's fields and methods. The `super` keyword accesses the parent's constructors and overridden members. Java enforces single class inheritance but allows implementing multiple interfaces.",
  deepDive:
    "Inheritance establishes an IS-A relationship: a `Dog extends Animal` means every Dog is an Animal. The subclass inherits all non-private members of the parent (though private fields exist in the object's memory -- they are just inaccessible by name). Method resolution at runtime follows the virtual method table (vtable): the JVM looks up the actual class of the object, not the declared type of the reference, which is the foundation of runtime polymorphism.\n\nThe `super` keyword has two uses. First, `super(...)` invokes a parent constructor and must be the first statement in the child's constructor. If omitted, the compiler inserts `super()` implicitly -- which fails if the parent lacks a no-arg constructor. Second, `super.method()` calls the parent's version of an overridden method, useful for augmenting rather than replacing behavior. Note that you cannot chain `super.super.method()` -- Java only gives you one level up.\n\nMethod overriding follows strict rules: same signature, covariant return type (since Java 5), equal or broader access modifier, and the overriding method may only throw the same or narrower checked exceptions. The `@Override` annotation is not required but is a best practice -- it turns silent signature mismatches into compile errors. Fields are not polymorphic: accessing a field through a parent-type reference gives the parent's field (this is called hiding, not overriding).\n\nThe `final` keyword can prevent inheritance entirely (`final class`) or prevent overriding of specific methods (`final method`). Sealing (Java 17 `sealed` classes) provides a middle ground: you enumerate exactly which classes may extend the sealed class, enabling exhaustive pattern matching while still allowing controlled extension.\n\nOveruse of inheritance is a well-known design pitfall. The 'fragile base class' problem means that changes in a parent class can break subclasses in subtle ways. Effective Java recommends 'favor composition over inheritance' -- wrap the behavior you need in a field rather than extending the class. Inheritance across package boundaries is particularly risky because you couple to implementation details you do not control.",
  code: `public class Animal {
    private final String species;

    public Animal(String species) {
        this.species = species;
    }

    public String speak() {
        return species + " makes a sound";
    }

    // final prevents subclasses from overriding
    public final String getSpecies() {
        return species;
    }
}

public class Dog extends Animal {

    private final String name;

    public Dog(String name) {
        super("Canine");  // must be first statement
        this.name = name;
    }

    @Override
    public String speak() {
        // augment parent behavior
        return name + " barks! (" + super.speak() + ")";
    }

    public static void main(String[] args) {
        Animal a = new Dog("Rex");   // polymorphic reference
        System.out.println(a.speak());
        // "Rex barks! (Canine makes a sound)"

        // a.name  -- won't compile; 'name' is not in Animal

        System.out.println(a.getSpecies()); // "Canine" (final method)
    }
}`,
  interviewQs: [
    {
      id: "3-3-q0",
      q: "What is the difference between method overriding and method hiding in Java?",
      a: "Overriding applies to instance methods: the JVM dispatches based on the runtime type of the object (dynamic binding). Hiding applies to static methods and fields: the version called/accessed depends on the compile-time type of the reference (static binding). If a subclass defines a static method with the same signature as the parent's static method, it hides it rather than overriding it.",
      difficulty: "junior",
    },
    {
      id: "3-3-q1",
      q: "Why does Java not support multiple class inheritance, and how do default methods in interfaces change the picture?",
      a: "Multiple class inheritance creates the diamond problem: ambiguity when two parent classes define the same method with different implementations. Java avoids this by allowing only single class inheritance. Interfaces with default methods (Java 8+) reintroduce a controlled form of multiple inheritance of behavior. If two interfaces provide conflicting defaults, the implementing class must override the method to resolve the ambiguity explicitly, keeping the resolution deterministic.",
      difficulty: "mid",
    },
    {
      id: "3-3-q2",
      q: "Explain sealed classes, their relationship to pattern matching, and how they improve upon traditional inheritance hierarchies.",
      a: "Sealed classes (Java 17) restrict which classes may extend them via a `permits` clause. This creates a closed set of subtypes known at compile time. The compiler can then verify exhaustiveness in switch expressions using pattern matching -- if all permitted subtypes are covered, no default branch is needed. Sealed classes solve the tension between openness (anyone can extend) and control (the author wants a fixed set of variants), similar to algebraic data types in functional languages. They combine well with records for concise data-carrying subtypes.",
      difficulty: "senior",
    },
  ],
  tip: "Always annotate overridden methods with @Override. Without it, a typo in the method name silently creates a new method instead of overriding, leading to bugs that are very hard to trace.",
  springConnection: {
    concept: "Inheritance & super",
    springFeature: "Spring CGLIB Proxies",
    explanation:
      "Spring AOP creates proxies by subclassing your bean class at runtime using CGLIB (unless the bean implements an interface, in which case JDK dynamic proxies are used). This means your class cannot be `final`, and the proxy overrides your methods to insert advice (transactions, caching, security). Understanding inheritance mechanics explains why `final` classes/methods break Spring AOP and why self-invocation skips the proxy.",
  },
};
