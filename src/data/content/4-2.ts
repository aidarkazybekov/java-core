import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-2",
  blockId: 4,
  title: "StringBuilder vs StringBuffer",
  summary:
    "String является неизменяемым (immutable). StringBuffer (since 1.0) -- модифицируемая строка, все методы synchronized. StringBuilder (since 1.5) -- идентичен StringBuffer, но методы не синхронизированы. StringBuffer и StringBuilder позволяют модифицировать содержимое строки без создания новых объектов, что делает их эффективнее String.\n\n---\n\nStringBuilder and StringBuffer are mutable alternatives to String for efficient text manipulation. StringBuilder is unsynchronized and faster; StringBuffer is synchronized and thread-safe. Understanding when to use each and their internal mechanics is a common interview topic.",
  deepDive:
    "Основная разница между String, StringBuffer, StringBuilder:\n\n- String является неизменяемым (immutable).\n- StringBuffer (since 1.0) -- модифицируемая строка, все методы synchronized.\n- StringBuilder (since 1.5) -- идентичен StringBuffer за исключением того, что его методы не синхронизированы.\n\nStringBuffer и StringBuilder используются при работе с изменяемыми строками. Позволяют модифицировать содержимое строки без создания новых объектов, что делает их более эффективными, чем String.\n\n---\n\nBoth StringBuilder and StringBuffer extend `AbstractStringBuilder`, which holds a mutable `byte[]` (or `char[]` pre-Java 9) and a count of characters used. When you `append()`, characters are added to the existing buffer. If the buffer is full, it is resized to `(oldCapacity * 2) + 2`. This amortized doubling strategy gives O(1) amortized time per append, versus O(n) for String concatenation in a loop (which creates a new String and copies all characters each time).\n\nThe only difference between StringBuilder and StringBuffer is synchronization. Every public method in StringBuffer is `synchronized`, making it safe for concurrent access from multiple threads. StringBuilder has no synchronization, making it significantly faster in single-threaded scenarios. In practice, StringBuffer is almost never needed because string building rarely spans multiple threads -- and when it does, external synchronization or thread-local builders are better designs. StringBuffer is essentially a legacy class from Java 1.0; StringBuilder was added in Java 5 as the preferred replacement.\n\nCapacity management matters for performance. The default initial capacity is 16 characters. If you know the approximate final size, pass it to the constructor: `new StringBuilder(expectedSize)`. This avoids multiple resize-and-copy cycles. Each resize allocates a new array and copies the existing content via `System.arraycopy`, which is efficient but still an O(n) operation where n is the current length. For very large strings (megabytes), pre-sizing can noticeably reduce GC pressure.\n\nA subtle gotcha: `StringBuilder.equals()` is not overridden -- it uses `Object.equals()`, which checks reference identity. Two StringBuilders with the same content are not equal via `.equals()`. To compare contents, use `sb1.toString().equals(sb2.toString())` or `sb1.compareTo(sb2) == 0` (since Java 11, `StringBuilder` implements `Comparable`).\n\nSince Java 9's Compact Strings, StringBuilder also stores Latin-1 strings in a byte[] with one byte per char, inflating to UTF-16 only when a non-Latin-1 character is appended. This means appending a single emoji to a large Latin-1 StringBuilder triggers a full buffer copy with encoding change -- a rare but real performance cliff.",
  code: `public class StringBuilderDemo {
    public static void main(String[] args) {
        // Pre-size when you know the approximate length
        StringBuilder sb = new StringBuilder(256);

        // Efficient append chain (fluent API, returns 'this')
        sb.append("SELECT * FROM users")
          .append(" WHERE active = true")
          .append(" AND created > '2024-01-01'")
          .append(" ORDER BY name")
          .append(" LIMIT 100");

        String sql = sb.toString();
        System.out.println(sql);

        // Common operations
        sb.insert(0, "-- Query\\n");    // insert at position
        sb.delete(0, 11);              // delete range
        sb.replace(0, 6, "SELECT");    // replace range
        sb.reverse();                   // reverse in-place
        System.out.println(sb.length());       // chars used
        System.out.println(sb.capacity());     // buffer size

        // --- Performance comparison ---
        int iterations = 100_000;

        // BAD: String concatenation in loop -- O(n^2)
        long start = System.nanoTime();
        String result = "";
        for (int i = 0; i < iterations; i++) {
            result += "a";  // new String + copy each iteration
        }
        long stringTime = System.nanoTime() - start;

        // GOOD: StringBuilder -- O(n) amortized
        start = System.nanoTime();
        StringBuilder sb2 = new StringBuilder(iterations);
        for (int i = 0; i < iterations; i++) {
            sb2.append("a");
        }
        String result2 = sb2.toString();
        long builderTime = System.nanoTime() - start;

        System.out.printf("String concat: %d ms%n", stringTime / 1_000_000);
        System.out.printf("StringBuilder: %d ms%n", builderTime / 1_000_000);
        // Typical ratio: 1000x+ faster with StringBuilder

        // equals() pitfall
        StringBuilder x = new StringBuilder("hello");
        StringBuilder y = new StringBuilder("hello");
        System.out.println(x.equals(y));              // false!
        System.out.println(x.toString().equals(y.toString())); // true
    }
}`,
  interviewQs: [
    {
      id: "4-2-q0",
      q: "What is the difference between StringBuilder and StringBuffer?",
      a: "StringBuilder is not synchronized (faster, not thread-safe). StringBuffer has all methods synchronized (thread-safe but slower due to lock overhead). Both extend AbstractStringBuilder and have the same API. StringBuilder should be used in all single-threaded scenarios (which is nearly all string building). StringBuffer is a legacy class from Java 1.0; StringBuilder was introduced in Java 5 as its replacement.",
      difficulty: "junior",
    },
    {
      id: "4-2-q1",
      q: "Why is String concatenation in a loop O(n^2) while StringBuilder.append() is O(n)?",
      a: "Each `+=` on a String creates a new String object, copies all existing characters into it, then appends the new characters. After k iterations, the copy for iteration k is O(k), so total work is 1+2+...+n = O(n^2). StringBuilder maintains a mutable buffer and appends in-place. When the buffer fills, it doubles in capacity, copying O(n) characters total across all resizes (amortized). Each append is O(1) amortized, giving O(n) total for n appends.",
      difficulty: "mid",
    },
    {
      id: "4-2-q2",
      q: "Explain how Compact Strings affect StringBuilder internally and describe a scenario where appending a single character triggers a full buffer reallocation with encoding change.",
      a: "Since Java 9, StringBuilder stores Latin-1 content in a byte[] with one byte per char (coder=LATIN1). If all appended content is Latin-1, the buffer stays compact. When a non-Latin-1 character is appended (e.g., a Chinese character or emoji), the StringBuilder must inflate the entire buffer from Latin-1 to UTF-16 encoding: allocate a new byte[] of double the size (2 bytes per char), copy and widen every existing byte to two bytes, then append the new character. This is a one-time O(n) cost that can be surprising in performance-sensitive code processing mixed-encoding input. Pre-inflating with `sb.append('\\u0000')` at the start is a hack to force UTF-16 mode upfront if you know non-Latin-1 content is coming.",
      difficulty: "senior",
    },
  ],
  tip: "In interviews, always mention pre-sizing the StringBuilder when you know the expected length. Saying `new StringBuilder(expectedSize)` shows awareness of buffer management and GC pressure that distinguishes you from junior candidates.",
  springConnection: null,
};
