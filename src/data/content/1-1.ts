import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-1",
  blockId: 1,
  title: "JVM Architecture",
  summary:
    "The JVM is the runtime engine that executes Java bytecode. Understanding its internal architecture — class loading, memory areas, and the execution engine — is foundational to debugging performance issues, memory leaks, and understanding why Java behaves the way it does in production.",
  deepDive:
    "The JVM is an abstract computing machine with three major subsystems: the Class Loader Subsystem, the Runtime Data Areas, and the Execution Engine. When you run `java MyApp`, the JVM bootstrap sequence initializes these subsystems, loads your class, and begins executing bytecode.\n\n" +
    "Runtime Data Areas are where most interview questions focus. The Method Area (Metaspace since Java 8) stores class metadata, constant pools, and static variables — it is shared across all threads. The Heap is the shared memory region where all object instances live, managed by the garbage collector. Each thread gets its own PC Register (tracking the current bytecode instruction), JVM Stack (holding frames for each method call with local variables and operand stacks), and Native Method Stack (for JNI calls). A critical gotcha: local variables live on the stack, but if a local variable references an object, the object itself is on the heap.\n\n" +
    "The Execution Engine reads bytecode from the method area and executes it. It contains the Interpreter (executes bytecode line by line — slow but starts fast), the JIT Compiler (compiles hot bytecode paths into native machine code for speed), and the Garbage Collector. The interplay between interpreter and JIT is why Java apps warm up over time — initial requests are slow, then performance improves as hot paths get compiled.\n\n" +
    "Stack memory is automatically reclaimed when a method returns; heap memory requires garbage collection. StackOverflowError means your call stack exceeded its depth (usually infinite recursion). OutOfMemoryError can come from the heap (too many objects), Metaspace (too many loaded classes — common in app servers with classloader leaks), or even native memory. Knowing which area caused the OOM is the first step in diagnosing production issues.\n\n" +
    "In interviews, you are expected to draw or describe the JVM architecture diagram: ClassLoader feeds into Method Area, objects go to Heap, each thread has its own Stack/PC/Native Stack, and the Execution Engine ties it all together. Knowing that the heap is further divided into Young Generation (Eden + Survivor spaces) and Old Generation is essential for GC tuning discussions.",
  code:
    `// Exploring JVM memory areas at runtime
public class JvmArchitectureDemo {
    // Static field -> stored in Method Area (Metaspace)
    private static final String APP_NAME = "JVM Demo";

    // Instance field -> stored on the Heap (as part of the object)
    private int[] largeArray = new int[1_000_000];

    public static void main(String[] args) {
        // 'demo' reference is on the stack; the object is on the heap
        JvmArchitectureDemo demo = new JvmArchitectureDemo();

        // Runtime memory inspection
        Runtime rt = Runtime.getRuntime();
        System.out.println("Max heap:   " + rt.maxMemory() / 1024 / 1024 + " MB");
        System.out.println("Total heap: " + rt.totalMemory() / 1024 / 1024 + " MB");
        System.out.println("Free heap:  " + rt.freeMemory() / 1024 / 1024 + " MB");
        System.out.println("Used heap:  " +
            (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024 + " MB");

        // Thread stack info
        System.out.println("\\nActive threads: " + Thread.activeCount());
        System.out.println("Current thread stack depth: " +
            Thread.currentThread().getStackTrace().length);

        // Demonstrate StackOverflowError
        try {
            infiniteRecursion(0);
        } catch (StackOverflowError e) {
            System.out.println("\\nStackOverflowError caught!");
            System.out.println("Stack frames before overflow vary by JVM and -Xss setting");
        }
    }

    // Each call adds a frame to the thread's JVM Stack
    private static void infiniteRecursion(int depth) {
        infiniteRecursion(depth + 1);
    }
}`,
  interviewQs: [
    {
      id: "1-1-q0",
      q: "What are the main runtime data areas in the JVM and which are shared between threads?",
      a: "The JVM has five runtime data areas. Shared across all threads: the Heap (stores all object instances) and the Method Area / Metaspace (stores class metadata, constant pool, static variables). Per-thread areas: the JVM Stack (one frame per method call, holding local variables and operand stack), the PC Register (address of the current bytecode instruction), and the Native Method Stack (for JNI calls). Understanding this distinction is key to reasoning about thread safety — shared areas need synchronization, per-thread areas do not.",
      difficulty: "junior",
    },
    {
      id: "1-1-q1",
      q: "What is the difference between StackOverflowError and OutOfMemoryError? Can you get an OOM from stack space?",
      a: "StackOverflowError occurs when a thread's call stack exceeds its maximum depth (controlled by -Xss), typically from deep or infinite recursion. OutOfMemoryError occurs when the JVM cannot allocate memory — this can happen in the heap (-Xmx exhausted), Metaspace (too many loaded classes), or even in native memory. Yes, you can get 'OutOfMemoryError: unable to create new native thread' when the OS cannot allocate stack space for a new thread — this is distinct from StackOverflowError. The stack size per thread times the number of threads can exhaust native memory even when heap space is fine.",
      difficulty: "mid",
    },
    {
      id: "1-1-q2",
      q: "Why did Java 8 replace PermGen with Metaspace, and what production implications does this have?",
      a: "PermGen was a fixed-size region in the heap that stored class metadata, interned strings, and static variables. It had a hard upper limit (-XX:MaxPermSize) that frequently caused 'OutOfMemoryError: PermGen space' in app servers that loaded/unloaded classes frequently (hot deployments). Metaspace replaced it in Java 8 by moving class metadata to native memory, which grows dynamically and is bounded only by available system memory (or -XX:MaxMetaspaceSize if set). Interned strings moved to the main heap. The production implication is that classloader leaks now consume native memory silently instead of failing fast with a PermGen OOM. You should always set -XX:MaxMetaspaceSize in production to prevent a leak from consuming all system memory and crashing the entire host.",
      difficulty: "senior",
    },
  ],
  tip: "When you hear 'where does X live in memory?', think: static/class metadata -> Metaspace, objects -> Heap, local variable references -> Stack (but the object they point to is still on the heap).",
  springConnection: {
    concept: "JVM Memory Areas",
    springFeature: "Spring Application Context & Bean Scopes",
    explanation:
      "Spring singleton beans live as objects on the heap for the entire application lifetime, referenced by the ApplicationContext. Prototype-scoped beans are also on the heap but become eligible for GC once your code releases the reference. Understanding heap vs. Metaspace matters for diagnosing Spring Boot memory issues — a large number of proxy classes (from AOP, CGLIB) can bloat Metaspace, while too many singleton beans with large state can exhaust the heap.",
  },
};
