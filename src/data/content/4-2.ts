import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-2",
  blockId: 4,
  title: "StringBuilder vs StringBuffer",
  summary:
    "**`StringBuilder`** (Java 5+) — мутабельный буфер для построения строк, **не синхронизирован**, быстрый. **`StringBuffer`** (Java 1.0) — то же самое, но все методы `synchronized`, thread-safe. Оба наследуют `AbstractStringBuilder` с `byte[]`-буфером (Java 9+) и стратегией удвоения емкости. `String` concat в цикле — O(n²), StringBuilder.append — амортизированно O(1).\n\n---\n\n" +
    "**`StringBuilder`** (Java 5+) is a mutable buffer for building strings, **unsynchronised** and fast. **`StringBuffer`** (Java 1.0) is the same, but every method is `synchronized` — thread-safe. Both extend `AbstractStringBuilder` with a `byte[]` buffer (Java 9+) and capacity-doubling. `String` concat in a loop is O(n²); `StringBuilder.append` is amortised O(1).",
  deepDive:
    "## Три класса — три роли\n\n" +
    "| | Mutable | Thread-safe | Появился | Когда |\n" +
    "|--|--------|-------------|----------|-------|\n" +
    "| `String` | **No** | Yes (immutable) | 1.0 | По умолчанию для значений-строк |\n" +
    "| `StringBuffer` | Yes | Yes (`synchronized`) | 1.0 | Legacy; при многопоточном построении — и то редко |\n" +
    "| `StringBuilder` | Yes | **No** | 5.0 | Single-thread построение — почти всегда |\n\n" +
    "Оба `StringBuilder` и `StringBuffer` наследуют `AbstractStringBuilder`, который хранит мутабельный `byte[]`-буфер и count использованных символов. API идентичны.\n\n" +
    "## Почему `+` в цикле O(n²)\n\n" +
    "```java\n" +
    "String s = \"\";\n" +
    "for (int i = 0; i < n; i++) s += \"x\";  // O(n²)!\n" +
    "```\n\n" +
    "Каждый `+=` создаёт **новый `String`**, копирует все существующие символы в него и добавляет новый. На итерации k копируется k символов. Суммарно: `1 + 2 + ... + n = O(n²)`.\n\n" +
    "Для n = 100 000 — это 10 миллиардов операций копирования. Типичный микро-бенчмарк показывает **1000× разницу** с `StringBuilder`.\n\n" +
    "## Почему `StringBuilder.append` амортизированно O(1)\n\n" +
    "Буфер хранится в `byte[]` определённой capacity. При `append`:\n" +
    "1. Если места хватает — просто копируются байты. O(k) для k новых символов.\n" +
    "2. Если нет — буфер **удваивается** (`(oldCapacity * 2) + 2`), старое содержимое копируется в новый массив через `System.arraycopy`.\n\n" +
    "Амортизационно: общая работа на n appends = O(n), потому что resize случается O(log n) раз и суммарно копируется 2n символов. Отсюда O(1) на append **в среднем**.\n\n" +
    "## Pre-sizing — важная оптимизация\n\n" +
    "Default capacity — 16 символов. Если знаете приблизительный финальный размер, **передайте в конструктор**:\n\n" +
    "```java\n" +
    "// BAD — несколько resize-циклов\n" +
    "StringBuilder sb = new StringBuilder();\n" +
    "for (User u : users) sb.append(u.name()).append(\",\");  // n users → log n resizes\n" +
    "\n" +
    "// GOOD — одна аллокация\n" +
    "StringBuilder sb = new StringBuilder(users.size() * 20);\n" +
    "```\n\n" +
    "Для очень больших строк (мегабайты) pre-sizing заметно снижает GC pressure.\n\n" +
    "## StringBuffer vs StringBuilder — синхронизация\n\n" +
    "Единственное отличие — каждый публичный метод `StringBuffer` объявлен `synchronized`. Для single-thread построения — ненужный overhead (захват монитора).\n\n" +
    "> [!production]\n" +
    "> **Практика**: `StringBuffer` почти никогда не нужен. Построение строки редко когда идёт параллельно из нескольких потоков; когда идёт — лучше внешняя синхронизация или thread-local буфер. `StringBuffer` — legacy с Java 1.0, `StringBuilder` — его правильная замена с Java 5.\n\n" +
    "## Ловушка `equals()`\n\n" +
    "> [!gotcha]\n" +
    "> `StringBuilder.equals()` **не переопределён** — используется `Object.equals()`, сравнение по ссылке. Два StringBuilder с одинаковым содержимым **не равны** через `.equals()`!\n" +
    "> \n" +
    "> Правильно: `sb1.toString().equals(sb2.toString())` или, с Java 11+, `sb1.compareTo(sb2) == 0` (`StringBuilder` implements `Comparable`).\n\n" +
    "## Compact Strings и ловушка inflation\n\n" +
    "С Java 9 `StringBuilder` тоже использует Compact Strings — хранит Latin-1 контент в `byte[]` с одним байтом на символ.\n\n" +
    "> [!gotcha]\n" +
    "> Когда вы добавляете **не-Latin-1** символ (китайский, emoji) к большому Latin-1 буферу, StringBuilder вынужден **инфлейтировать весь буфер** в UTF-16: выделить новый `byte[]` двойного размера, расширить каждый существующий байт в два, и только потом добавить новый символ. Одноразовая O(n) стоимость, сюрприз в performance-чувствительном коде с mixed-encoding входом.\n" +
    "> \n" +
    "> Workaround: если точно знаете, что будет не-Latin-1 контент, начните с `sb.append('\\u00ff').deleteCharAt(0)` (force UTF-16 mode) — хак, но работает.\n\n" +
    "## Основные методы\n\n" +
    "- `append(...)` — добавить (overload для всех примитивов, `String`, `CharSequence`, `Object`).\n" +
    "- `insert(int offset, ...)` — вставить в позицию.\n" +
    "- `delete(int start, int end)`, `deleteCharAt(int i)`.\n" +
    "- `replace(int start, int end, String s)`.\n" +
    "- `reverse()` — in-place.\n" +
    "- `setLength(int n)` — обрезать или расширить (новые позиции `\\u0000`).\n" +
    "- `charAt`, `indexOf`, `substring` (возвращает новый `String`).\n" +
    "- `length()` — число использованных символов.\n" +
    "- `capacity()` — размер буфера.\n" +
    "- `ensureCapacity(int n)` — гарантировать минимум.\n" +
    "- `trimToSize()` — сжать буфер до длины (редко нужно).\n\n" +
    "Все `append`/`insert`/`replace` возвращают `this` → **fluent API**.\n\n" +
    "## Когда использовать `+`, когда `StringBuilder`\n\n" +
    "- **Одиночное выражение** (`\"x=\" + x + \", y=\" + y`) — `+`. С Java 9+ JVM оптимизирует через `StringConcatFactory` лучше ручного StringBuilder.\n" +
    "- **Цикл** — `StringBuilder`. Компилятор не может оптимизировать across iterations.\n" +
    "- **Построение через условия/методы** — `StringBuilder`, особенно если порядок и состав частей зависит от логики.\n" +
    "- **Streams**: `stream.collect(Collectors.joining(\",\"))` использует StringBuilder внутри — часто удобнее и читаемее.\n\n---\n\n" +
    "## Three classes — three roles\n\n" +
    "| | Mutable | Thread-safe | Since | When |\n" +
    "|--|--------|-------------|-------|------|\n" +
    "| `String` | **No** | Yes (immutable) | 1.0 | Default for string values |\n" +
    "| `StringBuffer` | Yes | Yes (`synchronized`) | 1.0 | Legacy; for multithreaded building — even then rare |\n" +
    "| `StringBuilder` | Yes | **No** | 5.0 | Single-thread building — almost always |\n\n" +
    "Both `StringBuilder` and `StringBuffer` extend `AbstractStringBuilder`, which holds a mutable `byte[]` buffer and a used-chars count. Their APIs are identical.\n\n" +
    "## Why `+` in a loop is O(n²)\n\n" +
    "```java\n" +
    "String s = \"\";\n" +
    "for (int i = 0; i < n; i++) s += \"x\";  // O(n²)!\n" +
    "```\n\n" +
    "Each `+=` creates a **new `String`**, copies all existing characters, and appends the new one. At iteration k, k chars are copied. Total: `1 + 2 + ... + n = O(n²)`.\n\n" +
    "For n = 100 000 — that's 10 billion copy operations. A typical microbenchmark shows a **1000× gap** vs `StringBuilder`.\n\n" +
    "## Why `StringBuilder.append` is amortised O(1)\n\n" +
    "The buffer is a `byte[]` of some capacity. On `append`:\n" +
    "1. If there's room — bytes are simply copied. O(k) for k new characters.\n" +
    "2. If not — the buffer **doubles** (`(oldCapacity * 2) + 2`) and the old content is copied via `System.arraycopy`.\n\n" +
    "Amortised: total work across n appends is O(n) because resizes happen O(log n) times and copy 2n chars in total. That's O(1) per append **on average**.\n\n" +
    "## Pre-sizing is a meaningful optimisation\n\n" +
    "Default capacity is 16 chars. If you know the approximate final size, **pass it to the constructor**:\n\n" +
    "```java\n" +
    "// BAD — several resize cycles\n" +
    "StringBuilder sb = new StringBuilder();\n" +
    "for (User u : users) sb.append(u.name()).append(\",\");  // n users → log n resizes\n" +
    "\n" +
    "// GOOD — one allocation\n" +
    "StringBuilder sb = new StringBuilder(users.size() * 20);\n" +
    "```\n\n" +
    "For very large strings (megabytes) pre-sizing noticeably reduces GC pressure.\n\n" +
    "## StringBuffer vs StringBuilder — synchronisation\n\n" +
    "The only difference: every public method of `StringBuffer` is `synchronized`. For single-thread building that's unnecessary overhead (monitor acquisition).\n\n" +
    "> [!production]\n" +
    "> **Practice**: `StringBuffer` is almost never needed. Building a string rarely spans multiple threads; when it does, external synchronisation or a thread-local builder is better. `StringBuffer` is legacy from Java 1.0; `StringBuilder` is its proper replacement from Java 5.\n\n" +
    "## The `equals()` trap\n\n" +
    "> [!gotcha]\n" +
    "> `StringBuilder.equals()` is **not overridden** — it inherits `Object.equals()`, which is identity comparison. Two StringBuilders with identical content are **not equal** via `.equals()`!\n" +
    "> \n" +
    "> Correct: `sb1.toString().equals(sb2.toString())` or, on Java 11+, `sb1.compareTo(sb2) == 0` (`StringBuilder` implements `Comparable`).\n\n" +
    "## Compact Strings and the inflation trap\n\n" +
    "Since Java 9 `StringBuilder` also uses Compact Strings — Latin-1 content is stored as `byte[]` with one byte per char.\n\n" +
    "> [!gotcha]\n" +
    "> When you append a **non-Latin-1** char (Chinese, emoji) to a large Latin-1 buffer, StringBuilder must **inflate the whole buffer** to UTF-16: allocate a new `byte[]` of double size, widen every existing byte into two, then append the new char. A one-time O(n) cost — a surprising perf cliff in code that processes mixed-encoding input.\n" +
    "> \n" +
    "> Workaround: if you know non-Latin-1 content is coming, start with `sb.append('\\u00ff').deleteCharAt(0)` (forces UTF-16 mode upfront) — a hack, but it works.\n\n" +
    "## Core methods\n\n" +
    "- `append(...)` — add (overloads for all primitives, `String`, `CharSequence`, `Object`).\n" +
    "- `insert(int offset, ...)` — insert at position.\n" +
    "- `delete(int start, int end)`, `deleteCharAt(int i)`.\n" +
    "- `replace(int start, int end, String s)`.\n" +
    "- `reverse()` — in-place.\n" +
    "- `setLength(int n)` — truncate or extend (new positions filled with `\\u0000`).\n" +
    "- `charAt`, `indexOf`, `substring` (returns a new `String`).\n" +
    "- `length()` — number of used chars.\n" +
    "- `capacity()` — buffer size.\n" +
    "- `ensureCapacity(int n)` — guarantee minimum.\n" +
    "- `trimToSize()` — shrink buffer to length (rarely needed).\n\n" +
    "All `append`/`insert`/`replace` return `this` → **fluent API**.\n\n" +
    "## When to use `+`, when `StringBuilder`\n\n" +
    "- **Single expression** (`\"x=\" + x + \", y=\" + y`) — `+`. Since Java 9+ the JVM optimises through `StringConcatFactory` better than manual StringBuilder.\n" +
    "- **Loop** — `StringBuilder`. The compiler can't optimise across iterations.\n" +
    "- **Building through conditions/methods** — `StringBuilder`, especially if the order and set of pieces depends on logic.\n" +
    "- **Streams**: `stream.collect(Collectors.joining(\",\"))` uses StringBuilder internally — often cleaner and more readable.",
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
      q:
        "В чём разница между StringBuilder и StringBuffer?\n\n---\n\n" +
        "What's the difference between StringBuilder and StringBuffer?",
      a:
        "- **`StringBuilder`** — **не синхронизирован**. Быстрый, но не thread-safe.\n" +
        "- **`StringBuffer`** — все публичные методы `synchronized`. Thread-safe, но overhead на захвате монитора.\n\n" +
        "Оба наследуют `AbstractStringBuilder` и имеют идентичный API. `StringBuilder` добавлен в Java 5 как замена `StringBuffer` для single-thread-кейсов (99%+).\n\n" +
        "Используйте **`StringBuilder`** почти всегда. `StringBuffer` — legacy с Java 1.0; ситуации реального многопоточного построения встречаются крайне редко, и там обычно лучше внешняя синхронизация или thread-local buffer.\n\n---\n\n" +
        "- **`StringBuilder`** — **not synchronised**. Fast, but not thread-safe.\n" +
        "- **`StringBuffer`** — every public method is `synchronized`. Thread-safe, but pays the monitor-acquisition overhead.\n\n" +
        "Both extend `AbstractStringBuilder` and have the same API. `StringBuilder` was added in Java 5 as the replacement for single-threaded use (99%+).\n\n" +
        "Use **`StringBuilder`** almost always. `StringBuffer` is legacy from Java 1.0; real multithreaded building is rare, and when needed, external synchronisation or a thread-local buffer is usually better.",
      difficulty: "junior",
    },
    {
      id: "4-2-q1",
      q:
        "Почему `String` конкатенация в цикле O(n²), а `StringBuilder.append()` — O(n)?\n\n---\n\n" +
        "Why is String concatenation in a loop O(n²) while StringBuilder.append() is O(n)?",
      a:
        "**`String +=`**: каждая итерация создаёт **новый `String`**, копирует все существующие символы и добавляет новый. На итерации k копируется k символов. Суммарно: `1 + 2 + ... + n = O(n²)`.\n\n" +
        "**`StringBuilder.append`**: буфер `byte[]` фиксированной capacity. При переполнении capacity **удваивается**. Амортизационно resize случается O(log n) раз и копирует суммарно 2n символов. Итого O(n) для n appends — O(1) на append в среднем.\n\n" +
        "Для n = 100 000 разница — ~1000× в реальных бенчмарках.\n\n" +
        "Нюанс Java 9+: **одиночное выражение** `a + b + c` компилируется в один `invokedynamic` → эффективно, как StringBuilder. **В цикле** каждая итерация — отдельный `invokedynamic`, и оптимизация across iterations невозможна — вот почему вручную StringBuilder нужен именно в циклах.\n\n---\n\n" +
        "**`String +=`**: each iteration creates a **new `String`**, copies all existing chars, and appends the new one. At iteration k, k chars are copied. Total: `1 + 2 + ... + n = O(n²)`.\n\n" +
        "**`StringBuilder.append`**: a `byte[]` buffer of some capacity. On overflow the capacity **doubles**. Amortised, resizes happen O(log n) times and copy 2n chars in total. That's O(n) for n appends — O(1) per append on average.\n\n" +
        "For n = 100 000 the gap is ~1000× in real benchmarks.\n\n" +
        "Java 9+ nuance: a **single expression** `a + b + c` compiles to one `invokedynamic` → as efficient as StringBuilder. **In a loop** every iteration is a separate `invokedynamic`, and cross-iteration optimisation is impossible — that's why manual StringBuilder is needed specifically in loops.",
      difficulty: "mid",
    },
    {
      id: "4-2-q2",
      q:
        "Объясните, как Compact Strings влияют на StringBuilder и опишите сценарий, в котором append одного символа вызывает полную реаллокацию.\n\n---\n\n" +
        "Explain how Compact Strings affect StringBuilder and describe a scenario where appending a single char triggers a full buffer reallocation.",
      a:
        "С Java 9 `StringBuilder` использует Compact Strings: Latin-1 контент хранится в `byte[]` с **одним** байтом на символ (coder=LATIN1). Пока весь контент Latin-1, буфер остаётся компактным.\n\n" +
        "Когда добавляется **не-Latin-1 символ** (китайский, emoji, кириллица за пределами Latin-1), StringBuilder вынужден **инфлейтировать весь буфер** из Latin-1 в UTF-16:\n" +
        "1. Аллоцировать новый `byte[]` **двойного размера** (2 байта на символ).\n" +
        "2. **Расширить каждый существующий байт** до двух байт.\n" +
        "3. Скопировать в новый массив.\n" +
        "4. Только потом добавить новый символ.\n\n" +
        "Это **одноразовая O(n) стоимость**, сюрприз в performance-чувствительном коде, обрабатывающем mixed-encoding входные данные (пользовательские имена, логи с эмодзи).\n\n" +
        "**Workaround**: если знаете, что будет не-Latin-1 контент, принудительно включите UTF-16 mode с самого начала:\n" +
        "```java\n" +
        "StringBuilder sb = new StringBuilder(expectedSize);\n" +
        "sb.append('\\u00ff');  // выше Latin-1\n" +
        "sb.deleteCharAt(0);    // удалить, но coder остаётся UTF16\n" +
        "```\n\n---\n\n" +
        "Since Java 9 `StringBuilder` uses Compact Strings: Latin-1 content is stored in a `byte[]` with **one** byte per char (coder=LATIN1). While all content stays Latin-1, the buffer remains compact.\n\n" +
        "When a **non-Latin-1 character** is appended (Chinese, emoji, Cyrillic outside Latin-1), StringBuilder must **inflate the whole buffer** from Latin-1 to UTF-16:\n" +
        "1. Allocate a new `byte[]` of **double size** (2 bytes per char).\n" +
        "2. **Widen every existing byte** to two bytes.\n" +
        "3. Copy into the new array.\n" +
        "4. Only then append the new character.\n\n" +
        "This is a **one-time O(n) cost**, a surprising perf cliff in performance-sensitive code processing mixed-encoding input (user-supplied names, logs with emoji).\n\n" +
        "**Workaround**: if you know non-Latin-1 content is coming, force UTF-16 mode up front:\n" +
        "```java\n" +
        "StringBuilder sb = new StringBuilder(expectedSize);\n" +
        "sb.append('\\u00ff');  // above Latin-1\n" +
        "sb.deleteCharAt(0);    // remove, but coder stays UTF16\n" +
        "```",
      difficulty: "senior",
    },
    {
      id: "4-2-q3",
      q:
        "Какая ловушка с `.equals()` у StringBuilder?\n\n---\n\n" +
        "What's the `.equals()` trap with StringBuilder?",
      a:
        "`StringBuilder.equals()` **не переопределён** — наследуется от `Object`, сравнение по identity (ссылке).\n\n" +
        "```java\n" +
        "StringBuilder x = new StringBuilder(\"hello\");\n" +
        "StringBuilder y = new StringBuilder(\"hello\");\n" +
        "x.equals(y);                  // false!\n" +
        "x.toString().equals(y.toString());  // true\n" +
        "```\n\n" +
        "Для сравнения содержимого:\n" +
        "- `sb1.toString().equals(sb2.toString())`.\n" +
        "- С Java 11+: `sb1.compareTo(sb2) == 0` (StringBuilder implements Comparable).\n\n" +
        "Причина: StringBuilder — mutable. Равные «сейчас» инстансы могут стать неравными при следующем append. Такой объект — плохой кандидат для HashMap ключа, поэтому `equals()` и `hashCode()` оставили как identity-сравнение, чтобы не создавать иллюзию корректности.\n\n---\n\n" +
        "`StringBuilder.equals()` is **not overridden** — it inherits from `Object`, comparing by identity (reference).\n\n" +
        "```java\n" +
        "StringBuilder x = new StringBuilder(\"hello\");\n" +
        "StringBuilder y = new StringBuilder(\"hello\");\n" +
        "x.equals(y);                  // false!\n" +
        "x.toString().equals(y.toString());  // true\n" +
        "```\n\n" +
        "To compare content:\n" +
        "- `sb1.toString().equals(sb2.toString())`.\n" +
        "- Java 11+: `sb1.compareTo(sb2) == 0` (StringBuilder implements Comparable).\n\n" +
        "Reason: StringBuilder is mutable. Instances equal \"right now\" may become unequal on the next append. Such an object is a bad HashMap key, so `equals()` and `hashCode()` were left as identity comparisons to avoid a false sense of correctness.",
      difficulty: "mid",
    },
  ],
  tip:
    "На интервью всегда упомяните pre-sizing `StringBuilder`, когда знаете ожидаемую длину. `new StringBuilder(expectedSize)` показывает понимание buffer management и GC pressure — отличает от junior-кандидата.\n\n---\n\n" +
    "In interviews, always mention pre-sizing `StringBuilder` when you know the expected length. `new StringBuilder(expectedSize)` signals awareness of buffer management and GC pressure — distinguishes you from junior candidates.",
  springConnection: null,
};
