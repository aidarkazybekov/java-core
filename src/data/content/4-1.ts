import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-1",
  blockId: 4,
  title: "String & String Pool",
  summary:
    "String is an immutable, final class backed by a char[] (or byte[] since Java 9). The String Pool (interned strings) in the heap reduces memory by reusing identical string literals. Understanding immutability, interning, and memory implications is essential for Java interviews.",
  deepDive:
    "Strings in Java are immutable: once created, their contents cannot be changed. Every method that appears to modify a String (concat, replace, substring, toUpperCase) actually returns a new String object. Immutability provides thread safety (no synchronization needed for shared Strings), enables safe use as HashMap keys (the hashCode is cached on first computation), and allows the JVM to optimize aggressively through the String Pool.\n\nThe String Pool is a special area within the heap (moved from PermGen to the main heap in Java 7) that stores unique string literals. When you write `String s = \"hello\"`, the JVM checks the pool; if \"hello\" already exists, it returns the existing reference. The `intern()` method explicitly adds a String to the pool or returns the existing pooled reference. This means `\"hello\" == \"hello\"` is `true` (same pooled reference), but `new String(\"hello\") == \"hello\"` is `false` (new creates a heap object outside the pool). Always use `.equals()` for String comparison.\n\nSince Java 9, Strings use Compact Strings (JEP 254): the internal storage is a `byte[]` with a `coder` field indicating Latin-1 (one byte per char) or UTF-16 (two bytes per char). Strings containing only ASCII/Latin-1 characters use half the memory of the pre-Java-9 `char[]` representation. This is a transparent optimization that does not change the API.\n\nString concatenation with `+` in a loop is a classic performance antipattern because each concatenation creates a new String object. However, since Java 9, `javac` compiles `+` into `invokedynamic` calls (JEP 280) that the JVM optimizes using `StringConcatFactory`, making simple concatenation expressions efficient. For loops, `StringBuilder` is still recommended. The `+` optimization only applies to expressions, not to repeated append operations across iterations.\n\nInterning large numbers of strings can backfire. The default pool uses a hashtable (`-XX:StringTableSize`, default 65536 buckets in modern JVMs). Interning millions of unique strings degrades lookup to O(n) per bucket. Also, interned strings are strong references that are never GC'd until the JVM exits (they are part of the string table roots). Use interning selectively for a known, bounded set of frequently repeated strings -- like enum-like values or parsed identifiers.",
  code: `public class StringPoolDemo {
    public static void main(String[] args) {
        // Literal goes to the String Pool
        String a = "Java";
        String b = "Java";
        System.out.println(a == b);        // true (same pool reference)

        // 'new' always creates a separate heap object
        String c = new String("Java");
        System.out.println(a == c);        // false (different objects)
        System.out.println(a.equals(c));   // true (same content)

        // intern() returns the pool reference
        String d = c.intern();
        System.out.println(a == d);        // true

        // Concatenation of literals is resolved at compile time
        String e = "Ja" + "va";
        System.out.println(a == e);        // true (compiler folds constants)

        // Concatenation with a variable happens at runtime -> new object
        String prefix = "Ja";
        String f = prefix + "va";
        System.out.println(a == f);        // false

        // Compact Strings: ASCII uses 1 byte per char internally
        String ascii = "hello";             // Latin-1 encoded (5 bytes)
        String unicode = "\\u4F60\\u597D";       // UTF-16 encoded (4 bytes)

        // Immutability: every "modification" returns a new String
        String original = "immutable";
        String upper = original.toUpperCase();
        System.out.println(original);       // "immutable" (unchanged)
        System.out.println(upper);          // "IMMUTABLE" (new object)
    }
}`,
  interviewQs: [
    {
      id: "4-1-q0",
      q: "Why are Strings immutable in Java?",
      a: "Immutability provides three key benefits: (1) Thread safety -- Strings can be shared across threads without synchronization. (2) Security -- Strings used in class loading, network connections, and file paths cannot be tampered with after creation. (3) Performance -- the hashCode can be cached (computed once, stored), and the String Pool can safely reuse instances because no one can modify a pooled String.",
      difficulty: "junior",
    },
    {
      id: "4-1-q1",
      q: "How does String concatenation work internally since Java 9, and when should you still use StringBuilder?",
      a: "Since Java 9 (JEP 280), the `+` operator compiles to an `invokedynamic` call to `StringConcatFactory`, which generates an optimized concatenation strategy at runtime (typically a single byte[] allocation sized to the result). This makes single-expression concatenation efficient. However, in loops, each iteration is a separate invokedynamic call creating a new String. Use StringBuilder in loops to accumulate across iterations with a single buffer. Also use StringBuilder when building strings across method calls or conditional branches where the compiler cannot optimize a single expression.",
      difficulty: "mid",
    },
    {
      id: "4-1-q2",
      q: "Explain Compact Strings (JEP 254), the String Pool's internal data structure, and the risks of excessive interning.",
      a: "Compact Strings (Java 9) replace the internal `char[]` with a `byte[]` plus a `coder` flag. Strings containing only Latin-1 chars use one byte per character (LATIN1 coder), halving memory usage. Non-Latin-1 strings fall back to two bytes per char (UTF16 coder). The String Pool is a native hashtable in the JVM (not a Java HashMap), sized by `-XX:StringTableSize`. Each bucket is a linked list. Excessive interning risks: (1) hash collisions degrade lookup time if the table is too small, (2) interned strings are strong references from the string table root, not collected until JVM exit, so interning millions of unique strings causes memory leaks, (3) the pool lock can become a contention point under heavy concurrent interning. Use interning only for a bounded, frequently repeated set of strings.",
      difficulty: "senior",
    },
  ],
  tip: "Never use == to compare Strings unless you're explicitly testing reference identity (e.g., checking if a value is interned). In interviews, immediately correcting `==` to `.equals()` shows attention to a bug that plagues production code.",
  springConnection: {
    concept: "String & Immutability",
    springFeature: "Spring Property Resolution",
    explanation:
      "Spring resolves @Value('${property}') placeholders into Strings. Because Strings are immutable, injected configuration values are inherently thread-safe. Spring's Environment abstraction and PropertySource chain all return Strings. Understanding String interning also explains why Spring uses `String.intern()` internally for bean names and scope identifiers, keeping lookup fast for the bounded set of known names.",
  },
};
