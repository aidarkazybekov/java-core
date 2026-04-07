import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-4",
  blockId: 2,
  title: "Control Flow",
  summary:
    "Control flow in Java goes beyond basic if/else and for loops. Switch expressions, labeled breaks, enhanced for-loops, and the behavior of short-circuit evaluation have subtle implications. Modern Java (17+) adds pattern matching in switch, making this a richer and more interview-relevant topic than you might expect.",
  deepDive:
    "The classic control flow structures are if/else, for, while, do-while, and switch. But interviewers focus on the non-obvious parts. The enhanced for-loop (`for (String s : collection)`) compiles to an Iterator pattern — it calls `iterator()`, then `hasNext()` and `next()` in a while loop. This means you cannot remove elements during enhanced-for iteration without ConcurrentModificationException. Use `Iterator.remove()` or `Collection.removeIf()` instead.\n\n" +
    "Switch has evolved dramatically. Traditional switch has fall-through by default (every case needs a break), which is a common bug source. Switch expressions (Java 14+) use arrow syntax (`case X ->`) with no fall-through and can return a value: `int result = switch(x) { case 1 -> 10; case 2 -> 20; default -> 0; };`. They must be exhaustive (cover all cases or have a default). Multi-line cases use `yield` to return a value. Pattern matching in switch (Java 21+) allows `case String s ->` and `case Integer i when i > 0 ->` (guarded patterns), enabling powerful type-based dispatch.\n\n" +
    "Labeled breaks and continues are underused but powerful for nested loops. `outer: for (...)  { for (...) { if (condition) break outer; } }` breaks out of the outer loop. Without labels, `break` only exits the innermost loop. Labeled breaks also work on labeled blocks: `block: { if (condition) break block; /* skipped */ }`. This is sometimes used as a structured alternative to early return in complex validation logic.\n\n" +
    "Short-circuit evaluation is critical: `&&` stops evaluating if the left side is false; `||` stops if the left side is true. This is not just an optimization — it is a correctness guarantee. `if (obj != null && obj.getValue() > 0)` is safe specifically because of short-circuit evaluation. The non-short-circuit operators `&` and `|` always evaluate both sides and should almost never be used for boolean logic. An exception: when both sides have desired side effects, but this is a code smell.\n\n" +
    "Finally blocks always execute — except in two cases: `System.exit()` is called, or the JVM crashes. A finally block that returns a value overrides the return from the try block — `try { return 1; } finally { return 2; }` returns 2. This is surprising and should be avoided. In modern Java, try-with-resources replaces most finally blocks for resource cleanup, and it handles the 'exception in close()' case correctly by using suppressed exceptions.",
  code:
    `public class ControlFlowDemo {
    public static void main(String[] args) {
        // === Switch Expression (Java 14+) ===
        int statusCode = 404;
        String message = switch (statusCode) {
            case 200 -> "OK";
            case 301 -> "Moved Permanently";
            case 404 -> "Not Found";
            case 500 -> "Internal Server Error";
            default -> {
                System.out.println("Unknown code: " + statusCode);
                yield "Unknown"; // 'yield' for multi-line switch expression
            }
        };
        System.out.println(statusCode + ": " + message);

        // === Pattern Matching Switch (Java 21+) ===
        Object obj = 42;
        String description = switch (obj) {
            case Integer i when i > 0  -> "Positive int: " + i;
            case Integer i             -> "Non-positive int: " + i;
            case String s              -> "String of length " + s.length();
            case null                  -> "null value";
            default                    -> "Other: " + obj.getClass().getSimpleName();
        };
        System.out.println("\\nPattern switch: " + description);

        // === Labeled Break — escaping nested loops ===
        System.out.println("\\nLabeled break:");
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int target = 5;
        boolean found = false;
        search:
        for (int row = 0; row < matrix.length; row++) {
            for (int col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] == target) {
                    System.out.println("Found " + target + " at [" + row + "][" + col + "]");
                    found = true;
                    break search; // breaks OUTER loop
                }
            }
        }

        // === Enhanced for-loop ConcurrentModificationException ===
        var list = new java.util.ArrayList<>(java.util.List.of("a", "b", "c", "d"));
        System.out.println("\\nBefore removal: " + list);

        // WRONG: throws ConcurrentModificationException
        // for (String s : list) { if (s.equals("b")) list.remove(s); }

        // RIGHT: use removeIf
        list.removeIf(s -> s.equals("b"));
        System.out.println("After removeIf: " + list);

        // === Finally block return override ===
        System.out.println("\\nFinally return override: " + finallyReturns());
        // Returns 2, not 1!

        // === Short-circuit matters for correctness ===
        String nullStr = null;
        // Safe: short-circuit prevents NPE
        if (nullStr != null && nullStr.length() > 0) {
            System.out.println("not reached");
        }
        System.out.println("Short-circuit prevented NPE on null string");
    }

    // This returns 2, not 1 — finally overrides the try return
    static int finallyReturns() {
        try {
            return 1;
        } finally {
            return 2; // WARNING: this swallows the try return!
        }
    }
}`,
  interviewQs: [
    {
      id: "2-4-q0",
      q: "Why can you not remove elements from a collection during an enhanced for-loop?",
      a: "The enhanced for-loop compiles to Iterator.hasNext()/next() calls. Most collections have a fail-fast iterator that tracks a modification count (modCount). When you call collection.remove() directly (not through the iterator), the modCount increments but the iterator's expected count does not, causing ConcurrentModificationException on the next hasNext()/next() call. The solution is to use Iterator.remove() (which updates the expected count) or Collection.removeIf() (introduced in Java 8, which uses the iterator internally).",
      difficulty: "junior",
    },
    {
      id: "2-4-q1",
      q: "What does `try { return 1; } finally { return 2; }` return, and why?",
      a: "It returns 2. When the try block executes `return 1`, the value 1 is saved and the finally block executes before the method actually returns. The `return 2` in finally overwrites the saved return value with 2. This also applies to exceptions: if try throws an exception and finally has a return, the exception is silently swallowed. This is considered a bug-prone pattern and most static analysis tools flag it. You should never return from a finally block. A related gotcha: if both try and finally throw exceptions, the finally exception replaces the try exception (the original is lost unless you use addSuppressed).",
      difficulty: "mid",
    },
    {
      id: "2-4-q2",
      q: "Explain switch pattern matching with guarded patterns and sealed types in Java 21+. How does exhaustiveness work?",
      a: "Switch pattern matching (Java 21) allows type patterns (`case String s ->`) and guarded patterns (`case String s when s.length() > 5 ->`). The 'when' clause is a guard that further filters after the type match. With sealed types, the compiler enforces exhaustiveness without a default clause. If `sealed interface Shape permits Circle, Square, Triangle`, then `switch(shape) { case Circle c -> ...; case Square s -> ...; case Triangle t -> ...; }` is exhaustive — no default needed. Adding a new permitted subtype is a compile error in all switch expressions over that type, ensuring no case is missed. Guarded patterns must come before their unguarded versions (`case String s when s.isEmpty()` before `case String s`), as the compiler evaluates cases top-to-bottom and the first match wins. Null handling is explicit: you can add `case null ->` or it throws NullPointerException by default.",
      difficulty: "senior",
    },
  ],
  tip: "When switch expressions do not cover all cases, the compiler forces you to add a default. This is one reason to prefer switch expressions over if-else chains — the compiler ensures you handle all cases.",
  springConnection: null,
};
