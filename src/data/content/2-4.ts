import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-4",
  blockId: 2,
  title: "Control Flow",
  summary:
    "Классика — `if/else`, `for`, `while`, `do-while`, `switch`. Современная Java добавила switch-выражения (Java 14+) со стрелочным синтаксисом и pattern matching в `switch` (Java 21+). Знание enhanced for-loop, labeled break и поведения `finally` отличает зрелого разработчика.\n\n---\n\n" +
    "The classics are `if/else`, `for`, `while`, `do-while`, `switch`. Modern Java added switch expressions (Java 14+) with arrow syntax and pattern matching in `switch` (Java 21+). Knowing the enhanced for-loop, labeled break, and `finally` semantics separates a mature engineer.",
  deepDive:
    "## Виды циклов\n\n" +
    "- **`while`** — цикл с предусловием. Условие проверяется **до** первой итерации. Используется, когда число итераций заранее неизвестно.\n" +
    "- **`do-while`** — цикл с постусловием. Тело выполняется **минимум один раз**.\n" +
    "- **`for`** — цикл со счётчиком. Начальное и конечное значения заданы в заголовке.\n" +
    "- **Enhanced for-loop (for-each)** — `for (String s : collection)`. Компилируется в `Iterator.hasNext()` / `next()`.\n\n" +
    "> [!gotcha]\n" +
    "> Нельзя удалять элементы из коллекции во время enhanced-for — получите `ConcurrentModificationException`. Итератор отслеживает `modCount`; прямой `collection.remove()` меняет его и fail-fast проверка срабатывает. Используйте `Iterator.remove()` или `Collection.removeIf(...)`.\n\n" +
    "## Switch — эволюция\n\n" +
    "**Классический** switch имеет fall-through по умолчанию (каждый `case` требует `break`). Пропуск `break` — распространённый баг.\n\n" +
    "**Switch-выражение (Java 14+)** со стрелочным синтаксисом — без fall-through, возвращает значение:\n\n" +
    "```java\n" +
    "int result = switch (x) {\n" +
    "    case 1 -> 10;\n" +
    "    case 2 -> 20;\n" +
    "    default -> 0;\n" +
    "};\n" +
    "```\n\n" +
    "Для многострочного case используется `yield`:\n\n" +
    "```java\n" +
    "String msg = switch (code) {\n" +
    "    case 200 -> \"OK\";\n" +
    "    case 500 -> {\n" +
    "        log.error(\"Server error\");\n" +
    "        yield \"Internal Error\";\n" +
    "    }\n" +
    "    default -> \"Unknown\";\n" +
    "};\n" +
    "```\n\n" +
    "Switch-выражение должно быть **exhaustive** — покрывать все варианты или иметь `default`.\n\n" +
    "## Pattern matching в switch (Java 21+)\n\n" +
    "```java\n" +
    "String desc = switch (obj) {\n" +
    "    case Integer i when i > 0 -> \"positive \" + i;\n" +
    "    case Integer i            -> \"non-positive \" + i;\n" +
    "    case String s             -> \"string, length=\" + s.length();\n" +
    "    case null                 -> \"null\";\n" +
    "    default                   -> \"other\";\n" +
    "};\n" +
    "```\n\n" +
    "**Guarded patterns** (`when`) фильтруют после type-match. Guarded-версия должна идти **до** unguarded.\n\n" +
    "**Sealed types** + switch — компилятор проверяет exhaustiveness без `default`:\n\n" +
    "```java\n" +
    "sealed interface Shape permits Circle, Square, Triangle {}\n" +
    "double area = switch (shape) {\n" +
    "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
    "    case Square s   -> s.side() * s.side();\n" +
    "    case Triangle t -> t.base() * t.height() / 2;\n" +
    "};  // default не нужен\n" +
    "```\n\n" +
    "Добавление нового permitted-подтипа — compile error во всех switch над этим типом. Пропуск case невозможен.\n\n" +
    "## Labeled break / continue\n\n" +
    "Недооценённый инструмент для вложенных циклов:\n\n" +
    "```java\n" +
    "outer:\n" +
    "for (int i = 0; i < n; i++) {\n" +
    "    for (int j = 0; j < m; j++) {\n" +
    "        if (matrix[i][j] == target) {\n" +
    "            break outer;  // выходит из ВНЕШНЕГО цикла\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "Без метки `break` выходит только из ближайшего цикла. Метки работают и на блоках, иногда используются как структурированная альтернатива early-return в сложной валидации.\n\n" +
    "## Short-circuit — гарантия корректности, не оптимизация\n\n" +
    "- `&&` не вычисляет правую часть, если левая = `false`.\n" +
    "- `||` не вычисляет правую часть, если левая = `true`.\n\n" +
    "Именно поэтому безопасно: `if (obj != null && obj.getValue() > 0)`. Это не просто ускорение — это корректность.\n\n" +
    "Операторы `&` и `|` на booleans вычисляют **обе стороны всегда** — для логики не применять.\n\n" +
    "## finally — два сюрприза\n\n" +
    "`finally` выполняется **всегда**, кроме двух случаев: `System.exit(...)` и крах JVM.\n\n" +
    "> [!gotcha]\n" +
    "> `try { return 1; } finally { return 2; }` возвращает **2**. Return в finally **перезаписывает** сохранённое возвращаемое значение try. Если try бросает исключение и в finally есть return — исключение молча проглатывается. Статические анализаторы флагают этот паттерн — никогда не возвращайте из finally.\n\n" +
    "`try-with-resources` заменяет большинство `finally`-блоков и корректно обрабатывает «исключение в `close()`» через suppressed exceptions.\n\n---\n\n" +
    "## Kinds of loops\n\n" +
    "- **`while`** — pre-test loop. Condition checked **before** the first iteration. Use when the iteration count isn't known up front.\n" +
    "- **`do-while`** — post-test loop. Body runs **at least once**.\n" +
    "- **`for`** — counted loop. Initial and end values in the header.\n" +
    "- **Enhanced for-loop (for-each)** — `for (String s : collection)`. Compiles to `Iterator.hasNext()` / `next()`.\n\n" +
    "> [!gotcha]\n" +
    "> You cannot remove elements during an enhanced-for — you'll get `ConcurrentModificationException`. The iterator tracks a `modCount`; a direct `collection.remove()` changes it and the fail-fast check trips. Use `Iterator.remove()` or `Collection.removeIf(...)`.\n\n" +
    "## Switch — the evolution\n\n" +
    "**Classic** switch has fall-through by default (each `case` needs a `break`). Forgetting a `break` is a common bug.\n\n" +
    "**Switch expression (Java 14+)** uses arrow syntax, no fall-through, returns a value:\n\n" +
    "```java\n" +
    "int result = switch (x) {\n" +
    "    case 1 -> 10;\n" +
    "    case 2 -> 20;\n" +
    "    default -> 0;\n" +
    "};\n" +
    "```\n\n" +
    "Multi-line cases use `yield`:\n\n" +
    "```java\n" +
    "String msg = switch (code) {\n" +
    "    case 200 -> \"OK\";\n" +
    "    case 500 -> {\n" +
    "        log.error(\"Server error\");\n" +
    "        yield \"Internal Error\";\n" +
    "    }\n" +
    "    default -> \"Unknown\";\n" +
    "};\n" +
    "```\n\n" +
    "Switch expressions must be **exhaustive** — cover every case or have a `default`.\n\n" +
    "## Pattern matching in switch (Java 21+)\n\n" +
    "```java\n" +
    "String desc = switch (obj) {\n" +
    "    case Integer i when i > 0 -> \"positive \" + i;\n" +
    "    case Integer i            -> \"non-positive \" + i;\n" +
    "    case String s             -> \"string, length=\" + s.length();\n" +
    "    case null                 -> \"null\";\n" +
    "    default                   -> \"other\";\n" +
    "};\n" +
    "```\n\n" +
    "**Guarded patterns** (`when`) filter after the type match. The guarded form must come **before** the unguarded one.\n\n" +
    "**Sealed types** + switch — the compiler checks exhaustiveness without a `default`:\n\n" +
    "```java\n" +
    "sealed interface Shape permits Circle, Square, Triangle {}\n" +
    "double area = switch (shape) {\n" +
    "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
    "    case Square s   -> s.side() * s.side();\n" +
    "    case Triangle t -> t.base() * t.height() / 2;\n" +
    "};  // no default needed\n" +
    "```\n\n" +
    "Adding a new permitted subtype is a compile error in every switch over that type. You cannot miss a case.\n\n" +
    "## Labeled break / continue\n\n" +
    "Underused tool for nested loops:\n\n" +
    "```java\n" +
    "outer:\n" +
    "for (int i = 0; i < n; i++) {\n" +
    "    for (int j = 0; j < m; j++) {\n" +
    "        if (matrix[i][j] == target) {\n" +
    "            break outer;  // exits the OUTER loop\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "Without a label `break` only exits the innermost loop. Labels also work on blocks, sometimes used as a structured alternative to early-return in complex validation.\n\n" +
    "## Short-circuit — correctness, not optimisation\n\n" +
    "- `&&` doesn't evaluate the right side if the left is `false`.\n" +
    "- `||` doesn't evaluate the right side if the left is `true`.\n\n" +
    "That's why `if (obj != null && obj.getValue() > 0)` is safe. This isn't just speed — it's correctness.\n\n" +
    "`&` and `|` on booleans evaluate **both sides always** — avoid for logic.\n\n" +
    "## finally — two surprises\n\n" +
    "`finally` runs **always**, except in two cases: `System.exit(...)` or a JVM crash.\n\n" +
    "> [!gotcha]\n" +
    "> `try { return 1; } finally { return 2; }` returns **2**. A return in `finally` **overwrites** the try's saved return value. If try throws and finally returns, the exception is silently swallowed. Static analysers flag this — never return from `finally`.\n\n" +
    "`try-with-resources` replaces most `finally` blocks and handles the \"exception thrown by `close()`\" case correctly via suppressed exceptions.",
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
        search:
        for (int row = 0; row < matrix.length; row++) {
            for (int col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] == target) {
                    System.out.println("Found " + target + " at [" + row + "][" + col + "]");
                    break search;
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
        System.out.println("\\nFinally return override: " + finallyReturns()); // 2!

        // === Short-circuit matters for correctness ===
        String nullStr = null;
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
      q:
        "Какие виды циклов есть в Java, когда применять каждый?\n\n---\n\n" +
        "What loop kinds does Java have and when do you use each?",
      a:
        "- **`while`** — цикл с предусловием. Условие проверяется до итерации. Для случаев, когда число итераций неизвестно.\n" +
        "- **`do-while`** — цикл с постусловием. Тело выполняется хотя бы раз. Подходит для меню, валидации ввода.\n" +
        "- **`for`** — со счётчиком. Известное число итераций.\n" +
        "- **Enhanced for-loop (`for-each`)** — для итерации по коллекциям и массивам. Внутри компилируется в `Iterator.hasNext()/next()`.\n\n---\n\n" +
        "- **`while`** — pre-test loop. Condition checked before each iteration. For cases where the iteration count isn't known.\n" +
        "- **`do-while`** — post-test loop. Body runs at least once. Fits menus and input validation.\n" +
        "- **`for`** — counted loop. Known iteration count.\n" +
        "- **Enhanced for-loop (`for-each`)** — for iterating collections and arrays. Compiles to `Iterator.hasNext()/next()`.",
      difficulty: "junior",
    },
    {
      id: "2-4-q1",
      q:
        "Почему нельзя удалять элементы коллекции внутри enhanced for-loop?\n\n---\n\n" +
        "Why can't you remove collection elements during an enhanced for-loop?",
      a:
        "Enhanced for-loop компилируется в вызовы `Iterator.hasNext()` / `next()`. Большинство коллекций имеют fail-fast итератор, который отслеживает `modCount` (счётчик модификаций).\n\n" +
        "Когда вы вызываете `collection.remove(...)` напрямую (не через итератор), `modCount` увеличивается, а ожидаемый счётчик итератора — нет. На следующем `hasNext()`/`next()` срабатывает проверка и кидается `ConcurrentModificationException`.\n\n" +
        "**Решения:**\n" +
        "- `Iterator.remove()` — обновляет ожидаемый счётчик.\n" +
        "- `Collection.removeIf(Predicate)` (Java 8+) — использует итератор внутри.\n" +
        "- `CopyOnWriteArrayList` / `ConcurrentHashMap` — weak-consistent итераторы, CME не кидают.\n\n---\n\n" +
        "Enhanced for-loop compiles to `Iterator.hasNext()` / `next()`. Most collections have a fail-fast iterator that tracks a `modCount` (modification counter).\n\n" +
        "When you call `collection.remove(...)` directly (not through the iterator), `modCount` increments but the iterator's expected count doesn't. On the next `hasNext()`/`next()` the check trips and throws `ConcurrentModificationException`.\n\n" +
        "**Fixes:**\n" +
        "- `Iterator.remove()` — updates the expected count.\n" +
        "- `Collection.removeIf(Predicate)` (Java 8+) — uses the iterator internally.\n" +
        "- `CopyOnWriteArrayList` / `ConcurrentHashMap` — weakly consistent iterators, don't throw CME.",
      difficulty: "junior",
    },
    {
      id: "2-4-q2",
      q:
        "Что вернёт `try { return 1; } finally { return 2; }` и почему?\n\n---\n\n" +
        "What does `try { return 1; } finally { return 2; }` return, and why?",
      a:
        "Вернёт **2**. Когда `try` выполняет `return 1`, значение 1 сохраняется, но перед реальным возвратом метода выполняется `finally`. `return 2` в `finally` **перезаписывает** сохранённое значение.\n\n" +
        "То же с исключениями: если `try` бросает исключение, а `finally` имеет `return`, исключение **молча проглатывается**. Если оба — try и finally — бросают исключение, исключение из finally заменяет исключение из try (оригинал теряется, если не использовать `addSuppressed`).\n\n" +
        "Статические анализаторы и IDE флагают return из finally. **Никогда не возвращайте из finally.**\n\n---\n\n" +
        "It returns **2**. When the `try` executes `return 1`, the value 1 is saved, but `finally` runs before the method actually returns. `return 2` in `finally` **overwrites** the saved value.\n\n" +
        "Same with exceptions: if `try` throws and `finally` has a `return`, the exception is **silently swallowed**. If both `try` and `finally` throw, the finally exception replaces the try exception (the original is lost unless you use `addSuppressed`).\n\n" +
        "Static analysers and IDEs flag returns from `finally`. **Never return from `finally`.**",
      difficulty: "mid",
    },
    {
      id: "2-4-q3",
      q:
        "Объясните pattern matching в `switch` с guarded-паттернами и sealed-типами. Как работает exhaustiveness?\n\n---\n\n" +
        "Explain pattern matching in `switch` with guarded patterns and sealed types. How does exhaustiveness work?",
      a:
        "`switch` с pattern matching (Java 21) позволяет type-patterns (`case String s ->`) и guarded patterns (`case String s when s.length() > 5 ->`). `when` — фильтр после type-match. Guarded-версия должна идти **до** unguarded (компилятор идёт сверху вниз, первый match побеждает).\n\n" +
        "С **sealed types** компилятор гарантирует exhaustiveness без `default`:\n\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square, Triangle {}\n" +
        "double area = switch (shape) {\n" +
        "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
        "    case Square s   -> s.side() * s.side();\n" +
        "    case Triangle t -> t.base() * t.height() / 2;\n" +
        "};\n" +
        "```\n\n" +
        "Добавление нового permitted-подтипа — compile error во всех switch над этим типом. Это надёжная замена Visitor pattern.\n\n" +
        "Null обрабатывается явно: `case null ->` или `switch` по умолчанию бросит NPE.\n\n---\n\n" +
        "Pattern matching `switch` (Java 21) supports type patterns (`case String s ->`) and guarded patterns (`case String s when s.length() > 5 ->`). The `when` clause filters further after the type match. The guarded form must appear **before** the unguarded one (the compiler evaluates top to bottom, first match wins).\n\n" +
        "With **sealed types** the compiler enforces exhaustiveness without `default`:\n\n" +
        "```java\n" +
        "sealed interface Shape permits Circle, Square, Triangle {}\n" +
        "double area = switch (shape) {\n" +
        "    case Circle c   -> Math.PI * c.r() * c.r();\n" +
        "    case Square s   -> s.side() * s.side();\n" +
        "    case Triangle t -> t.base() * t.height() / 2;\n" +
        "};\n" +
        "```\n\n" +
        "Adding a new permitted subtype is a compile error in every switch over that type. A robust replacement for the Visitor pattern.\n\n" +
        "Null is explicit: `case null ->` or the switch throws NPE by default.",
      difficulty: "senior",
    },
  ],
  tip:
    "Когда switch-выражение не покрывает все варианты, компилятор **требует** `default`. Это одна из причин предпочитать switch-выражения цепочкам `if-else` — компилятор гарантирует обработку всех случаев.\n\n---\n\n" +
    "When a switch expression doesn't cover every case, the compiler **requires** a `default`. That's one reason to prefer switch expressions over `if-else` chains — the compiler guarantees you handle every case.",
  springConnection: null,
};
