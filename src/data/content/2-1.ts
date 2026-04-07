import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-1",
  blockId: 2,
  title: "Primitive Types & Wrappers",
  summary:
    "Java has 8 primitive types that live on the stack and their corresponding wrapper classes that live on the heap. The interplay between primitives and wrappers — autoboxing, caching, null handling, and equality semantics — is a minefield of subtle bugs and a favorite interview topic.",
  deepDive:
    "Java's 8 primitives are: `byte` (8-bit, -128 to 127), `short` (16-bit), `int` (32-bit), `long` (64-bit), `float` (32-bit IEEE 754), `double` (64-bit IEEE 754), `char` (16-bit unsigned Unicode), and `boolean`. They are stored directly on the stack (or inlined in objects on the heap) with no object overhead. Wrapper classes (Byte, Short, Integer, Long, Float, Double, Character, Boolean) are full objects on the heap with ~16 bytes overhead each.\n\n" +
    "Autoboxing (primitive -> wrapper) and unboxing (wrapper -> primitive) were added in Java 5. The compiler silently inserts `Integer.valueOf(n)` for boxing and `intObj.intValue()` for unboxing. The trap: unboxing a null wrapper throws NullPointerException. This is the number one source of autoboxing bugs — `Integer x = null; int y = x;` compiles cleanly but throws NPE at runtime.\n\n" +
    "The Integer cache is essential interview knowledge. `Integer.valueOf(n)` caches instances for values -128 to 127 (configurable upward via -XX:AutoBoxCacheMax). This means `Integer.valueOf(100) == Integer.valueOf(100)` is `true`, but `Integer.valueOf(200) == Integer.valueOf(200)` is `false`. Always use `.equals()` for wrapper comparison, never `==`. The same caching applies to Byte, Short, Long (-128 to 127), Character (0 to 127), and Boolean (always cached).\n\n" +
    "Performance implications are real. In a tight loop, accidental autoboxing can create millions of garbage objects. `List<Integer>` stores boxed objects, not raw ints — each element is a separate heap object with 16+ bytes overhead versus 4 bytes for an int. For performance-critical code, consider primitive-specialized collections (Eclipse Collections IntList, or the upcoming Valhalla value types). `HashMap<Integer, Integer>` is particularly wasteful — you might use Koloboke or Eclipse Collections IntIntMap instead.\n\n" +
    "Floating-point gotchas: `0.1 + 0.2 != 0.3` due to IEEE 754 representation. Never use `float` or `double` for money — use `BigDecimal`. `Double.NaN != Double.NaN` is `true` (NaN is not equal to anything, including itself), but `Double.valueOf(Double.NaN).equals(Double.valueOf(Double.NaN))` is `true` — the equals() method special-cases NaN for consistency in collections.",
  code:
    `public class PrimitivesAndWrappersDemo {
    public static void main(String[] args) {
        // === Integer Cache Trap ===
        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;
        System.out.println("127 == 127: " + (a == b));   // true (cached)
        System.out.println("128 == 128: " + (c == d));   // false (not cached!)
        System.out.println("128.equals(128): " + c.equals(d)); // true (correct way)

        // === Autoboxing NPE Trap ===
        Integer nullInteger = null;
        try {
            int boom = nullInteger; // Compiles fine. NPE at runtime!
        } catch (NullPointerException e) {
            System.out.println("\\nAutoboxing NPE: unboxing null Integer");
        }

        // === Ternary Operator Unboxing Trap ===
        Integer x = null;
        // This throws NPE because the ternary unboxes to int then reboxes!
        try {
            Integer result = true ? x : 0; // x gets unboxed -> NPE
        } catch (NullPointerException e) {
            System.out.println("Ternary unboxing NPE: mixing Integer and int");
        }

        // === Floating Point ===
        System.out.println("\\n0.1 + 0.2 == 0.3: " + (0.1 + 0.2 == 0.3)); // false!
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2)); // 0.30000000000000004

        // Use BigDecimal for exact arithmetic
        var bd1 = new java.math.BigDecimal("0.1");
        var bd2 = new java.math.BigDecimal("0.2");
        var bd3 = new java.math.BigDecimal("0.3");
        System.out.println("BigDecimal 0.1 + 0.2 == 0.3: " +
            bd1.add(bd2).compareTo(bd3) == 0); // true

        // === NaN Weirdness ===
        System.out.println("\\nNaN == NaN: " + (Double.NaN == Double.NaN)); // false!
        System.out.println("NaN equals NaN: " +
            Double.valueOf(Double.NaN).equals(Double.valueOf(Double.NaN))); // true!

        // === Performance: autoboxing in loops ===
        long start = System.nanoTime();
        Long sum = 0L; // Long, not long — creates ~2 billion temporary objects!
        for (int i = 0; i < 1_000_000; i++) {
            sum += i; // unbox, add, rebox on every iteration
        }
        long boxedTime = System.nanoTime() - start;

        start = System.nanoTime();
        long sum2 = 0L; // primitive — no boxing
        for (int i = 0; i < 1_000_000; i++) {
            sum2 += i;
        }
        long primitiveTime = System.nanoTime() - start;
        System.out.printf("\\nBoxed loop:     %,d ns%n", boxedTime);
        System.out.printf("Primitive loop: %,d ns%n", primitiveTime);
        System.out.printf("Slowdown:       %.1fx%n", (double) boxedTime / primitiveTime);
    }
}`,
  interviewQs: [
    {
      id: "2-1-q0",
      q: "Why does Integer == Integer sometimes return true and sometimes false?",
      a: "The == operator on wrapper objects compares references, not values. Integer.valueOf() caches instances for values -128 to 127. So `Integer a = 127; Integer b = 127;` gives the same cached object (a == b is true). But `Integer a = 128; Integer b = 128;` creates two different objects (a == b is false). This cache range is configurable with -XX:AutoBoxCacheMax. Always use .equals() for wrapper comparison. The same caching applies to Byte, Short, Long (-128 to 127), Character (0 to 127), and Boolean.",
      difficulty: "junior",
    },
    {
      id: "2-1-q1",
      q: "Explain a scenario where autoboxing causes a NullPointerException that is hard to find.",
      a: "The classic case is the ternary operator: `Integer x = null; Integer result = condition ? x : 0;`. This throws NPE because the ternary sees `Integer` and `int` operands, so it unboxes `x` to `int` (NPE on null) before reboxing the result. Another common one: a Map<String, Integer>.get(key) returning null when the key is missing, then passing the result to a method expecting `int`. The implicit unboxing causes NPE, and the stack trace points to a line with no obvious null dereference. A third case: stream operations like `list.stream().mapToInt(Integer::intValue)` on a list containing nulls.",
      difficulty: "mid",
    },
    {
      id: "2-1-q2",
      q: "What are the memory and performance implications of using List<Integer> vs an int[], and what alternatives exist?",
      a: "An int[] stores 4 bytes per element contiguously in memory with one object header (~16 bytes overhead total). A List<Integer> stores references (~4-8 bytes each) to Integer objects (each ~16 bytes with object header + 4 bytes for the int value + padding), so roughly 5-6x more memory per element plus poor cache locality due to pointer chasing. In benchmarks, primitive arrays outperform boxed collections by 3-10x. Alternatives: primitive-specialized collections from Eclipse Collections (IntArrayList, IntIntHashMap), Koloboke, or HPPC. Project Valhalla's value types (expected in future Java) will allow `List<int>` directly, eliminating boxing while keeping the Collections API. For now, IntStream and primitive arrays cover most performance-sensitive cases.",
      difficulty: "senior",
    },
  ],
  tip: "When you see Long, Integer, or Double as a loop accumulator variable, it is almost always a bug. Use the primitive type (long, int, double) to avoid creating millions of garbage wrapper objects.",
  springConnection: {
    concept: "Autoboxing and null primitives",
    springFeature: "Spring Data JPA entity mapping",
    explanation:
      "JPA entity fields that map to nullable database columns must use wrapper types (Integer, Long), not primitives. A primitive `int` field defaults to 0, which is indistinguishable from an actual stored zero — so JPA cannot tell if the column was NULL or 0. Using `Integer` preserves null semantics. However, this means your service layer must handle potential nulls when working with these fields, and autoboxing NPEs become a real risk in calculations involving entity data.",
  },
};
