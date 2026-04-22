import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-1",
  blockId: 2,
  title: "Primitive Types & Wrappers",
  summary:
    "В Java 8 примитивных типов: `boolean` (1 бит), `byte` (1 байт, -128..127), `short` (2 байта), `int` (4 байта), `long` (8 байт), `float` (4 байта), `double` (8 байт), `char` (2 байта, UTF-16). Autoboxing — неявная упаковка примитива в класс-обёртку. Целочисленные обёртки в диапазоне -128..+127 кэшируются JVM.\n\n---\n\n" +
    "Java has 8 primitive types that live on the stack (or inline in heap objects) and their corresponding wrapper classes that live on the heap. The interplay — autoboxing, caching, null handling, equality semantics — is a minefield of subtle bugs and a favourite interview topic.",
  deepDive:
    "## Восемь примитивов\n\n" +
    "| Тип       | Размер     | Диапазон / значения                 |\n" +
    "|-----------|------------|-------------------------------------|\n" +
    "| `boolean` | 1 бит\\*    | true / false                        |\n" +
    "| `byte`    | 1 байт     | -128..127                           |\n" +
    "| `short`   | 2 байта    | -32768..32767                       |\n" +
    "| `int`     | 4 байта    | ±2.1 × 10⁹                          |\n" +
    "| `long`    | 8 байт     | ±9.2 × 10¹⁸                         |\n" +
    "| `float`   | 4 байта    | IEEE 754 одинарная точность         |\n" +
    "| `double`  | 8 байт     | IEEE 754 двойная точность           |\n" +
    "| `char`    | 2 байта    | UTF-16 code unit (0..65535)         |\n\n" +
    "\\* На самом деле `boolean` занимает байт или int-слот в зависимости от контекста (JVM spec не фиксирует размер).\n\n" +
    "Примитивы лежат на **стеке** или inline внутри объектов. Обёртки (`Integer`, `Long` и т.д.) — полноценные объекты в **куче** с ~16 байтами overhead каждый.\n\n" +
    "## Autoboxing и его ловушки\n\n" +
    "Autoboxing добавлен в Java 5. Компилятор молча вставляет `Integer.valueOf(n)` при упаковке и `intObj.intValue()` при распаковке.\n\n" +
    "> [!gotcha]\n" +
    "> Распаковка `null` бросает `NullPointerException`. `Integer x = null; int y = x;` — компилируется чисто, падает в рантайме. Это источник #1 auto­boxing-багов.\n\n" +
    "Менее очевидная ловушка — тернарный оператор:\n\n" +
    "```java\n" +
    "Integer x = null;\n" +
    "Integer result = cond ? x : 0;  // NPE! x распакуется в int, потом упакуется обратно\n" +
    "```\n\n" +
    "Смешение `Integer` и `int` в тернарнике заставляет компилятор распаковать **обе ветки** до общего типа `int`.\n\n" +
    "## Кэш Integer [-128..127]\n\n" +
    "`Integer.valueOf(n)` кэширует экземпляры для значений **-128..127** (верхнюю границу можно поднять через `-XX:AutoBoxCacheMax`):\n\n" +
    "```java\n" +
    "Integer.valueOf(100) == Integer.valueOf(100)  // true — один объект из кэша\n" +
    "Integer.valueOf(200) == Integer.valueOf(200)  // false — разные объекты!\n" +
    "```\n\n" +
    "Аналогичное кэширование у `Byte`, `Short`, `Long` (-128..127), `Character` (0..127) и `Boolean` (всегда кэшируется).\n\n" +
    "> [!tip]\n" +
    "> **Всегда** сравнивайте обёртки через `.equals()`, никогда через `==`. Это настолько важное правило, что современные IDE подсвечивают `==` на `Integer` как warning.\n\n" +
    "## Производительность и память\n\n" +
    "`int[]` хранит 4 байта на элемент подряд в памяти. `List<Integer>` — это массив ссылок (~4-8 байт) на отдельные объекты `Integer` (~16 байт каждый). Получается в 5-6× больше памяти и плохая кэш-локальность из-за pointer chasing.\n\n" +
    "> [!production]\n" +
    "> Для hot-path кода и больших коллекций чисел: используйте `IntStream`, примитивные массивы или библиотеки типа Eclipse Collections (`IntArrayList`, `IntIntHashMap`), Koloboke, HPPC. Project Valhalla со временем принесёт настоящие value types — `List<int>` без боксинга.\n\n" +
    "## Ловушки плавающей точки\n\n" +
    "- `0.1 + 0.2 == 0.3` → **false** (IEEE 754 не представляет точно).\n" +
    "- Никогда не используйте `float`/`double` для денег. `BigDecimal` — правильный инструмент.\n" +
    "- `Double.NaN != Double.NaN` → **true** (NaN не равен ничему, даже себе).\n" +
    "- Но `Double.valueOf(Double.NaN).equals(Double.valueOf(Double.NaN))` → **true** — `equals()` специально обрабатывает NaN для консистентности в коллекциях.\n\n---\n\n" +
    "## The eight primitives\n\n" +
    "| Type      | Size       | Range / values                      |\n" +
    "|-----------|------------|-------------------------------------|\n" +
    "| `boolean` | 1 bit\\*    | true / false                        |\n" +
    "| `byte`    | 1 byte     | -128..127                           |\n" +
    "| `short`   | 2 bytes    | -32768..32767                       |\n" +
    "| `int`     | 4 bytes    | ±2.1 × 10⁹                          |\n" +
    "| `long`    | 8 bytes    | ±9.2 × 10¹⁸                         |\n" +
    "| `float`   | 4 bytes    | IEEE 754 single precision           |\n" +
    "| `double`  | 8 bytes    | IEEE 754 double precision           |\n" +
    "| `char`    | 2 bytes    | UTF-16 code unit (0..65535)         |\n\n" +
    "\\* `boolean` actually takes a byte or int-sized slot depending on context — the JVM spec doesn't fix the size.\n\n" +
    "Primitives live on the **stack** or inline inside heap objects. Wrapper classes (`Integer`, `Long`, ...) are full objects on the **heap** with ~16 bytes of overhead each.\n\n" +
    "## Autoboxing and its traps\n\n" +
    "Autoboxing was added in Java 5. The compiler silently inserts `Integer.valueOf(n)` for boxing and `intObj.intValue()` for unboxing.\n\n" +
    "> [!gotcha]\n" +
    "> Unboxing a null wrapper throws `NullPointerException`. `Integer x = null; int y = x;` compiles cleanly but fails at runtime — the #1 source of autoboxing bugs.\n\n" +
    "A subtler trap is the ternary operator:\n\n" +
    "```java\n" +
    "Integer x = null;\n" +
    "Integer result = cond ? x : 0;  // NPE! x is unboxed to int, then reboxed\n" +
    "```\n\n" +
    "Mixing `Integer` and `int` in a ternary forces the compiler to unbox **both branches** to the common type `int`.\n\n" +
    "## The Integer cache [-128..127]\n\n" +
    "`Integer.valueOf(n)` caches instances for values **-128..127** (the upper bound is configurable via `-XX:AutoBoxCacheMax`):\n\n" +
    "```java\n" +
    "Integer.valueOf(100) == Integer.valueOf(100)  // true — same cached object\n" +
    "Integer.valueOf(200) == Integer.valueOf(200)  // false — two objects!\n" +
    "```\n\n" +
    "Analogous caching exists on `Byte`, `Short`, `Long` (-128..127), `Character` (0..127), and `Boolean` (always cached).\n\n" +
    "> [!tip]\n" +
    "> **Always** compare wrappers with `.equals()`, never with `==`. This rule is important enough that modern IDEs flag `==` on `Integer` as a warning.\n\n" +
    "## Performance and memory\n\n" +
    "`int[]` stores 4 bytes per element contiguously. `List<Integer>` is an array of references (~4-8 bytes) pointing to separate `Integer` objects (~16 bytes each). That's 5-6× more memory plus poor cache locality due to pointer chasing.\n\n" +
    "> [!production]\n" +
    "> For hot-path code and large numeric collections: use `IntStream`, primitive arrays, or libraries like Eclipse Collections (`IntArrayList`, `IntIntHashMap`), Koloboke, HPPC. Project Valhalla will eventually bring real value types — `List<int>` with no boxing.\n\n" +
    "## Floating-point traps\n\n" +
    "- `0.1 + 0.2 == 0.3` → **false** (IEEE 754 cannot represent these exactly).\n" +
    "- Never use `float`/`double` for money. `BigDecimal` is the right tool.\n" +
    "- `Double.NaN != Double.NaN` → **true** (NaN is equal to nothing, not even itself).\n" +
    "- But `Double.valueOf(Double.NaN).equals(Double.valueOf(Double.NaN))` → **true** — `equals()` special-cases NaN for consistency in collections.",
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
            (bd1.add(bd2).compareTo(bd3) == 0)); // true

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
      q:
        "Перечислите примитивные типы Java и их размеры.\n\n---\n\n" +
        "Name Java's primitive types and their sizes.",
      a:
        "**8 примитивов:**\n\n" +
        "- `boolean` — true/false (размер не фиксирован спецификацией JVM)\n" +
        "- `byte` — 1 байт, -128..127\n" +
        "- `short` — 2 байта, -32768..32767\n" +
        "- `int` — 4 байта, ±2.1 × 10⁹\n" +
        "- `long` — 8 байт, ±9.2 × 10¹⁸\n" +
        "- `float` — 4 байта, IEEE 754\n" +
        "- `double` — 8 байт, IEEE 754\n" +
        "- `char` — 2 байта, UTF-16 code unit\n\n" +
        "Все примитивы лежат на стеке или inline в объектах; overhead заголовка объекта у них отсутствует.\n\n---\n\n" +
        "**8 primitives:**\n\n" +
        "- `boolean` — true/false (size not fixed by JVM spec)\n" +
        "- `byte` — 1 byte, -128..127\n" +
        "- `short` — 2 bytes, -32768..32767\n" +
        "- `int` — 4 bytes, ±2.1 × 10⁹\n" +
        "- `long` — 8 bytes, ±9.2 × 10¹⁸\n" +
        "- `float` — 4 bytes, IEEE 754\n" +
        "- `double` — 8 bytes, IEEE 754\n" +
        "- `char` — 2 bytes, UTF-16 code unit\n\n" +
        "All primitives live on the stack or inline in objects; there's no object-header overhead.",
      difficulty: "junior",
    },
    {
      id: "2-1-q1",
      q:
        "Почему `Integer == Integer` иногда даёт `true`, а иногда `false`?\n\n---\n\n" +
        "Why does `Integer == Integer` sometimes return true and sometimes false?",
      a:
        "`==` на объектах сравнивает **ссылки**, не значения. `Integer.valueOf()` кэширует экземпляры для значений **-128..127**.\n\n" +
        "```java\n" +
        "Integer a = 127, b = 127;  // один кэшированный объект → a == b (true)\n" +
        "Integer a = 128, b = 128;  // два разных объекта → a == b (false)\n" +
        "```\n\n" +
        "Верхнюю границу можно поднять через `-XX:AutoBoxCacheMax`. Аналогичное кэширование у `Byte`, `Short`, `Long` (-128..127), `Character` (0..127), `Boolean` (всегда).\n\n" +
        "Правильный способ — `.equals()`. Современные IDE подсвечивают `==` на обёртках как предупреждение.\n\n---\n\n" +
        "`==` on objects compares **references**, not values. `Integer.valueOf()` caches instances for **-128..127**.\n\n" +
        "```java\n" +
        "Integer a = 127, b = 127;  // one cached object → a == b (true)\n" +
        "Integer a = 128, b = 128;  // two different objects → a == b (false)\n" +
        "```\n\n" +
        "The upper bound is tunable via `-XX:AutoBoxCacheMax`. Same caching on `Byte`, `Short`, `Long` (-128..127), `Character` (0..127), `Boolean` (always).\n\n" +
        "Use `.equals()`. Modern IDEs flag `==` on wrappers as a warning.",
      difficulty: "junior",
    },
    {
      id: "2-1-q2",
      q:
        "Опишите сценарий, в котором autoboxing вызывает `NullPointerException`, который трудно найти.\n\n---\n\n" +
        "Describe a scenario where autoboxing causes a hard-to-find NullPointerException.",
      a:
        "Классика — тернарный оператор:\n\n" +
        "```java\n" +
        "Integer x = null;\n" +
        "Integer result = cond ? x : 0;  // NPE!\n" +
        "```\n\n" +
        "Тернарник видит `Integer` и `int`, и распаковывает `x` в `int` (NPE на null) перед обратным боксингом.\n\n" +
        "Другой частый случай — `Map<String, Integer>.get(key)` возвращает `null`, и результат передаётся в метод, ожидающий `int`. Неявная распаковка падает, а трейс указывает на строку без видимого null-dereference.\n\n" +
        "Третий — стримы: `list.stream().mapToInt(Integer::intValue)` на списке с `null`-элементами.\n\n---\n\n" +
        "The classic case is the ternary operator:\n\n" +
        "```java\n" +
        "Integer x = null;\n" +
        "Integer result = cond ? x : 0;  // NPE!\n" +
        "```\n\n" +
        "The ternary sees `Integer` and `int` operands, so it unboxes `x` to `int` (NPE on null) before reboxing the result.\n\n" +
        "Another common one: `Map<String, Integer>.get(key)` returns null when the key is missing, then the result is passed to a method expecting `int`. The implicit unboxing causes NPE and the stack trace points to a line with no obvious null deref.\n\n" +
        "Third: `list.stream().mapToInt(Integer::intValue)` on a list containing nulls.",
      difficulty: "mid",
    },
    {
      id: "2-1-q3",
      q:
        "Какие последствия по памяти и производительности у `List<Integer>` против `int[]`, и какие есть альтернативы?\n\n---\n\n" +
        "What are the memory and performance implications of `List<Integer>` vs `int[]`, and what alternatives exist?",
      a:
        "- `int[]` — 4 байта на элемент подряд в памяти, один заголовок объекта (~16 байт overhead).\n" +
        "- `List<Integer>` — массив ссылок (4-8 байт каждая) на объекты `Integer` (~16 байт заголовок + 4 байта значение + padding). Итого ~5-6× больше памяти + плохая кэш-локальность из-за pointer chasing.\n\n" +
        "На бенчмарках примитивные массивы обходят боксированные коллекции в 3-10×.\n\n" +
        "**Альтернативы:**\n" +
        "- Eclipse Collections: `IntArrayList`, `IntIntHashMap`\n" +
        "- Koloboke, HPPC — специализированные коллекции\n" +
        "- `IntStream` и примитивные массивы в JDK покрывают большинство кейсов\n" +
        "- Project Valhalla в будущих версиях Java даст value types и `List<int>` без боксинга\n\n---\n\n" +
        "- `int[]` — 4 bytes per element, contiguous memory, a single object header (~16 bytes overhead total).\n" +
        "- `List<Integer>` — an array of references (~4-8 bytes each) to separate `Integer` objects (~16-byte header + 4-byte value + padding). ~5-6× more memory, plus poor cache locality due to pointer chasing.\n\n" +
        "In benchmarks, primitive arrays beat boxed collections by 3-10×.\n\n" +
        "**Alternatives:**\n" +
        "- Eclipse Collections: `IntArrayList`, `IntIntHashMap`\n" +
        "- Koloboke, HPPC — specialised primitive collections\n" +
        "- `IntStream` and primitive arrays from the JDK cover most cases\n" +
        "- Project Valhalla will eventually add value types and un-boxed `List<int>`",
      difficulty: "senior",
    },
  ],
  tip:
    "Если видите `Long`, `Integer` или `Double` как переменную-аккумулятор в цикле — это почти всегда ошибка. Используйте примитив (`long`, `int`, `double`), чтобы не создавать миллионы мусорных объектов-обёрток.\n\n---\n\n" +
    "If you see `Long`, `Integer`, or `Double` as a loop accumulator, it's almost always a bug. Use the primitive (`long`, `int`, `double`) to avoid creating millions of garbage wrapper objects.",
  springConnection: {
    concept: "Autoboxing and null primitives",
    springFeature: "Spring Data JPA entity mapping",
    explanation:
      "JPA-поля, маппящиеся на nullable-колонки БД, должны использовать обёртки (`Integer`, `Long`), а не примитивы.\n\n" +
      "Примитив `int` по умолчанию равен 0, что неотличимо от реального хранимого нуля — JPA не может сказать, была ли колонка NULL или 0. `Integer` сохраняет семантику null.\n\n" +
      "Обратная сторона: сервисный слой должен обрабатывать возможные null при работе с полями сущностей, и autoboxing-NPE становится реальным риском в вычислениях над данными из БД.\n\n---\n\n" +
      "JPA entity fields that map to nullable database columns must use wrapper types (`Integer`, `Long`), not primitives.\n\n" +
      "A primitive `int` defaults to 0, which is indistinguishable from an actual stored zero — JPA cannot tell if the column was NULL or 0. Using `Integer` preserves null semantics.\n\n" +
      "The trade-off: your service layer must handle potential nulls when working with entity data, and autoboxing NPEs become a real risk in calculations involving fields from the database.",
  },
};
