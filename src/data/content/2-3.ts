import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-3",
  blockId: 2,
  title: "Operators & Casting",
  summary:
    "Java's operators and type casting rules are full of non-obvious behavior that trips up even experienced developers. Widening vs narrowing conversions, integer promotion rules, and the quirks of == vs equals() are interview staples that reveal whether you truly understand the type system.",
  deepDive:
    "Java performs implicit widening conversions (smaller type to larger type) automatically: byte -> short -> int -> long -> float -> double. Narrowing conversions (larger to smaller) require an explicit cast and can lose data. A subtle trap: `int` to `float` is a widening conversion but can lose precision — int has 32 bits of precision while float only has 24 bits of mantissa. So `(float) 16_777_217` becomes `16_777_216.0`. Similarly, `long` to `double` can lose precision for values above 2^53.\n\n" +
    "Integer promotion rules: in arithmetic expressions, byte, short, and char are always promoted to int before the operation. This is why `byte a = 1; byte b = 2; byte c = a + b;` does not compile — `a + b` produces an int. You need `byte c = (byte)(a + b);`. This promotion also affects compound assignment: `a += b` compiles because compound assignment operators include an implicit cast. So `byte a = 127; a += 1;` silently overflows to -128 without a compile error — a subtle bug.\n\n" +
    "The `==` operator compares primitives by value but objects by reference. For String literals, `==` appears to work because of the string pool — `\"hello\" == \"hello\"` is true because both point to the same interned object. But `new String(\"hello\") == \"hello\"` is false. For wrapper types, `==` works within the cache range (-128 to 127 for Integer) and fails outside it. Always use `.equals()` for object comparison.\n\n" +
    "Instanceof and casting: before Java 16, casting after instanceof required a separate variable declaration: `if (obj instanceof String) { String s = (String) obj; ... }`. Pattern matching (Java 16+) simplifies this to `if (obj instanceof String s) { ... }`. The scoping of the pattern variable is flow-sensitive — `s` is only in scope where the compiler can prove the instanceof check succeeded. This even works with negation: `if (!(obj instanceof String s)) return; // s is in scope here`.\n\n" +
    "Bitwise operators are rarely used in application code but sometimes appear in interviews. `&` and `|` on booleans are non-short-circuit versions of `&&` and `||` — they evaluate both sides regardless. Shift operators: `<<` is left shift, `>>` is signed right shift (preserves sign), `>>>` is unsigned right shift (fills with zeros). The modulo operator `%` preserves the sign of the dividend in Java: `-7 % 3 == -1`, not `2`. Use `Math.floorMod(-7, 3)` if you want a positive result.",
  code:
    `public class OperatorsAndCastingDemo {
    public static void main(String[] args) {
        // === Widening with precision loss ===
        int bigInt = 16_777_217; // 2^24 + 1
        float asFloat = bigInt;  // widening conversion — no cast needed
        System.out.println("int -> float precision loss:");
        System.out.println("  int:   " + bigInt);             // 16777217
        System.out.println("  float: " + (int) asFloat);      // 16777216 (lost!)

        // === Integer promotion trap ===
        byte b1 = 50;
        byte b2 = 60;
        // byte b3 = b1 + b2; // COMPILE ERROR: int cannot be assigned to byte
        byte b3 = (byte)(b1 + b2); // compiles, but: 110 fits, what about overflow?

        byte b4 = 127;
        b4 += 1; // compiles! compound assignment has implicit cast. b4 is now -128
        System.out.println("\\nbyte overflow via +=: " + b4); // -128

        // === == vs equals() ===
        String s1 = "hello";
        String s2 = "hello";
        String s3 = new String("hello");
        System.out.println("\\nString == comparison:");
        System.out.println("  literal == literal: " + (s1 == s2));    // true (pool)
        System.out.println("  literal == new:     " + (s1 == s3));    // false
        System.out.println("  literal.equals(new):" + s1.equals(s3)); // true

        // === Ternary type promotion ===
        // Ternary promotes to common type
        char c = 'A';
        int result = true ? c : 0; // char promoted to int
        System.out.println("\\nTernary char + int: " + result); // 65, not 'A'

        // === Pattern Matching instanceof (Java 16+) ===
        Object obj = "Hello, World!";
        if (obj instanceof String s && s.length() > 5) {
            System.out.println("\\nPattern match: " + s.toUpperCase());
        }

        // Flow scoping — s is in scope after a negative check too
        if (!(obj instanceof String s)) {
            return; // s is not in scope here
        }
        // s IS in scope here because we know instanceof succeeded
        System.out.println("Flow scoping: " + s.length());

        // === Modulo sign behavior ===
        System.out.println("\\nModulo sign:");
        System.out.println("  -7 % 3 = " + (-7 % 3));              // -1 (not 2!)
        System.out.println("  Math.floorMod(-7, 3) = " +
            Math.floorMod(-7, 3));                                   // 2

        // === Short-circuit vs non-short-circuit ===
        int x = 0;
        boolean shortCircuit = (x != 0) && (10 / x > 1);  // safe: second not evaluated
        // boolean noShortCircuit = (x != 0) & (10 / x > 1); // ArithmeticException!
        System.out.println("\\nShort-circuit saved us from division by zero");
    }
}`,
  interviewQs: [
    {
      id: "2-3-q0",
      q: "Why does `byte b = 1; byte c = b + 1;` not compile, but `b += 1;` does?",
      a: "In `b + 1`, the byte `b` is promoted to int (Java promotes all byte/short/char to int in arithmetic), and `1` is an int literal. The result is int, which cannot be assigned to byte without an explicit cast. So you need `byte c = (byte)(b + 1);`. However, compound assignment operators (+=, -=, etc.) include an implicit narrowing cast per the JLS. So `b += 1` is equivalent to `b = (byte)(b + 1)`. This means compound assignment can silently overflow — `byte b = 127; b += 1;` makes b equal to -128 with no compiler warning.",
      difficulty: "junior",
    },
    {
      id: "2-3-q1",
      q: "Can a widening conversion lose data? Give an example.",
      a: "Yes. int-to-float and long-to-double are widening conversions (no cast required) but can lose precision. `int` has 32 bits of integer precision, but `float` only has 24 bits of mantissa. So any int value above 2^24 (16,777,216) may lose precision. Example: `int n = 16_777_217; float f = n;` — f becomes 16,777,216.0 because float cannot represent 16,777,217 exactly. Similarly, `long` values above 2^53 lose precision when widened to `double`. This is a subtle source of bugs in financial calculations and is why the JLS calls these 'widening primitive conversions that may lose information'.",
      difficulty: "mid",
    },
    {
      id: "2-3-q2",
      q: "Explain how pattern matching for instanceof works with flow scoping, and how it handles complex boolean expressions.",
      a: "Pattern matching instanceof (Java 16+) introduces a binding variable whose scope is determined by flow analysis — the variable is only in scope where the compiler can guarantee the pattern matched. `if (obj instanceof String s)` makes `s` available in the if-block. With negation: `if (!(obj instanceof String s)) return;` — after the if, `s` is in scope because the only way to reach that point is if instanceof succeeded. In boolean expressions, `&&` propagates the match: `obj instanceof String s && s.length() > 5` works because `s` is only evaluated if the instanceof succeeded. But `||` does NOT: `obj instanceof String s || s.isEmpty()` is illegal because on the right side of `||`, the instanceof might have failed. This flow-sensitive scoping also applies to switch pattern matching (Java 21) and record patterns, where you can deconstruct record components in a single expression.",
      difficulty: "senior",
    },
  ],
  tip: "The compound assignment operators (+=, *=, etc.) include a hidden cast. `short s = 32767; s += 1;` compiles without error and silently overflows. This is a favorite trick question.",
  springConnection: {
    concept: "Type casting and instanceof",
    springFeature: "Spring type conversion and ConversionService",
    explanation:
      "Spring's ConversionService handles type conversions that go far beyond Java's built-in casting — converting Strings to enums, dates, collections, and custom types. When you declare @Value(\"${server.port}\") int port, Spring's type conversion kicks in to parse the String property into an int. Understanding Java's native casting limitations helps you appreciate why Spring needs a separate conversion framework for property binding, request parameter mapping, and data binding.",
  },
};
