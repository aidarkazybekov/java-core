import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-1",
  blockId: 4,
  title: "String & String Pool",
  summary:
    "`String` — **immutable** и **final** класс, внутри `byte[]` + coder flag (Java 9+, Compact Strings). **String Pool** — специальная область в Heap, хранящая уникальные строковые литералы (Flyweight). Литералы попадают в пул автоматически; `new String(...)` — **вне** пула; `.intern()` — явно помещает в пул. `==` сравнивает ссылки, `.equals()` — содержимое.\n\n---\n\n" +
    "`String` is an **immutable**, **final** class backed by a `byte[]` + coder flag (Java 9+, Compact Strings). The **String Pool** is a special area in the heap holding unique string literals (Flyweight pattern). Literals go into the pool automatically; `new String(...)` is **outside** the pool; `.intern()` explicitly pools a string. `==` compares references, `.equals()` compares content.",
  deepDive:
    "## Immutability — зачем и что даёт\n\n" +
    "Однажды созданная строка **никогда не меняется**. Любой метод, кажущийся модифицирующим (`concat`, `replace`, `substring`, `toUpperCase`), возвращает **новый** объект. Что это даёт:\n\n" +
    "- **Thread safety** — можно шарить между потоками без синхронизации.\n" +
    "- **Безопасность** — строка, использованная для имени класса, URL, file path, не может быть изменена после проверки.\n" +
    "- **Кэш hashCode** — `hashCode()` вычисляется один раз и хранится в поле. Поэтому `String` идеальный ключ для `HashMap`.\n" +
    "- **String Pool** — JVM может безопасно переиспользовать инстансы.\n" +
    "- **Корректная загрузка классов** — имя класса не изменится между проверкой и использованием.\n\n" +
    "## String Pool (Flyweight)\n\n" +
    "Специальная область в Heap (до Java 7 была в **PermGen**, с Java 7 — в main heap). Хранит уникальные строки.\n\n" +
    "**Что попадает в пул автоматически**:\n" +
    "- Строковые литералы (`\"hello\"`).\n" +
    "- Компиляционные константы (`final String x = \"a\" + \"b\"`).\n\n" +
    "**Что НЕ попадает**:\n" +
    "- `new String(\"hello\")` — всегда создаёт **новый** объект в heap вне пула.\n" +
    "- Рантайм-конкатенация с переменной — тоже новый объект.\n\n" +
    "**`.intern()`** — явно кладёт строку в пул или возвращает существующую pooled-ссылку:\n" +
    "```java\n" +
    "String s = new String(\"hello\").intern();  // из пула\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> `\"hello\" == \"hello\"` → **true** (один pooled-объект).\n" +
    "> `new String(\"hello\") == \"hello\"` → **false** (разные объекты).\n" +
    "> `\"Ja\" + \"va\" == \"Java\"` → **true** (compile-time constant folding).\n" +
    "> `var x = \"Ja\"; x + \"va\" == \"Java\"` → **false** (runtime concatenation).\n\n" +
    "## Compact Strings (JEP 254, Java 9)\n\n" +
    "До Java 9: внутреннее хранилище — `char[]` (2 байта на символ всегда).\n\n" +
    "Java 9+: `byte[]` + **coder flag**:\n" +
    "- **LATIN1 (0)** — один байт на символ, для ASCII и Latin-1 строк.\n" +
    "- **UTF16 (1)** — два байта на символ, для строк с не-Latin-1 символами.\n\n" +
    "Для большинства приложений (ASCII-доминантных) — **экономия памяти в 2×**. API не изменился, всё прозрачно.\n\n" +
    "## Конкатенация — что под капотом\n\n" +
    "**До Java 9**: `javac` компилировал `\"a\" + b + \"c\"` в цепочку `new StringBuilder().append().append().toString()`. Жёстко и медленно для сложных случаев.\n\n" +
    "**Java 9+ (JEP 280)**: `+` компилируется в **одиночный `invokedynamic`** к `StringConcatFactory.makeConcatWithConstants`. JVM в рантайме генерирует оптимальную стратегию (одна аллокация byte[] с точным размером).\n\n" +
    "> [!tip]\n" +
    "> В одном выражении — пользуйтесь `+`, JVM оптимизирует лучше ручного StringBuilder. **В цикле** — `StringBuilder`, потому что компилятор не может оптимизировать across iterations.\n\n" +
    "## Основные методы\n\n" +
    "- `length()`, `charAt(i)`, `isEmpty()`, `isBlank()` (Java 11+).\n" +
    "- Сравнение: `equals`, `equalsIgnoreCase`, `compareTo`, `compareToIgnoreCase`.\n" +
    "- Поиск: `indexOf`, `lastIndexOf`, `contains`, `startsWith`, `endsWith`.\n" +
    "- Извлечение: `substring`, `split`, `chars()` (IntStream).\n" +
    "- Преобразование: `toUpperCase`, `toLowerCase`, `trim`, `strip` (Java 11+, Unicode-aware), `replace`, `replaceAll` (regex), `replaceFirst`.\n" +
    "- Форматирование: `format`, `formatted` (Java 15+), `String.join`.\n" +
    "- Java 15+: **text blocks** `\"\"\" ... \"\"\"` для многострочных литералов.\n\n" +
    "## Риски чрезмерного `intern()`\n\n" +
    "> [!production]\n" +
    "> Пул внутри — native hashtable (`-XX:StringTableSize`, по умолчанию 65536 bucket'ов в современных JVM).\n" +
    ">\n" +
    "> Риски:\n" +
    "> - **Hash-коллизии** деградируют lookup до O(n) на bucket, если таблица мала.\n" +
    "> - **Сильные ссылки** — pooled-строки живут до выхода JVM (GC roots). Интернирование миллионов уникальных строк → утечка памяти.\n" +
    "> - **Lock contention** — под высокой конкурентной нагрузкой пул может стать узким местом.\n" +
    ">\n" +
    "> Применяйте `intern()` только к **ограниченному, часто повторяющемуся** множеству значений (enum-like, parsed identifiers).\n\n" +
    "## `switch` на строках (Java 7+)\n\n" +
    "Работает через `hashCode() + equals()` внутри. JVM компилирует в tableswitch по хэшам с fallback проверкой equals для collision-случаев.\n\n" +
    "## String vs StringBuilder vs StringBuffer\n\n" +
    "| | Mutability | Thread-safe | Когда |\n" +
    "|--|-----------|-------------|-------|\n" +
    "| `String` | No | Yes (immutable) | По умолчанию |\n" +
    "| `StringBuilder` | Yes | No | Single-thread построение |\n" +
    "| `StringBuffer` | Yes | Yes (synchronized) | Legacy; редко нужен |\n\n---\n\n" +
    "## Immutability — why and what it gives\n\n" +
    "Once created, a String **never changes**. Any apparently-modifying method (`concat`, `replace`, `substring`, `toUpperCase`) returns a **new** object. Benefits:\n\n" +
    "- **Thread safety** — shareable across threads without synchronisation.\n" +
    "- **Security** — a string used for a class name, URL, or file path cannot be mutated after a check.\n" +
    "- **Cached hashCode** — `hashCode()` is computed once and stored in a field. That's why `String` is the ideal `HashMap` key.\n" +
    "- **String Pool** — the JVM can safely reuse instances.\n" +
    "- **Correct class loading** — a class name won't change between verification and use.\n\n" +
    "## String Pool (Flyweight)\n\n" +
    "A special heap area (pre-Java-7 it was in **PermGen**; since Java 7 in the main heap). Stores unique strings.\n\n" +
    "**What the pool receives automatically**:\n" +
    "- String literals (`\"hello\"`).\n" +
    "- Compile-time constants (`final String x = \"a\" + \"b\"`).\n\n" +
    "**What it does NOT**:\n" +
    "- `new String(\"hello\")` — always creates a **new** heap object outside the pool.\n" +
    "- Runtime concatenation with a variable — another fresh object.\n\n" +
    "**`.intern()`** — explicitly pools a string or returns the existing pooled reference:\n" +
    "```java\n" +
    "String s = new String(\"hello\").intern();  // from the pool\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> `\"hello\" == \"hello\"` → **true** (same pooled object).\n" +
    "> `new String(\"hello\") == \"hello\"` → **false** (different objects).\n" +
    "> `\"Ja\" + \"va\" == \"Java\"` → **true** (compile-time constant folding).\n" +
    "> `var x = \"Ja\"; x + \"va\" == \"Java\"` → **false** (runtime concatenation).\n\n" +
    "## Compact Strings (JEP 254, Java 9)\n\n" +
    "Pre-Java-9: internal storage was `char[]` (2 bytes per char, always).\n\n" +
    "Java 9+: `byte[]` + a **coder flag**:\n" +
    "- **LATIN1 (0)** — one byte per char, for ASCII and Latin-1 strings.\n" +
    "- **UTF16 (1)** — two bytes per char, for strings containing non-Latin-1 characters.\n\n" +
    "For most apps (ASCII-dominant) — **memory is halved**. The API is unchanged, the optimisation is transparent.\n\n" +
    "## Concatenation under the hood\n\n" +
    "**Pre-Java-9**: `javac` compiled `\"a\" + b + \"c\"` into a `new StringBuilder().append().append().toString()` chain. Rigid and slow for complex cases.\n\n" +
    "**Java 9+ (JEP 280)**: `+` compiles to a **single `invokedynamic`** → `StringConcatFactory.makeConcatWithConstants`. At runtime the JVM picks the optimal strategy (one byte[] allocation of the exact size).\n\n" +
    "> [!tip]\n" +
    "> In a single expression — use `+`, the JVM optimises better than manual StringBuilder. **In a loop** — use `StringBuilder`, because the compiler can't optimise across iterations.\n\n" +
    "## Core methods\n\n" +
    "- `length()`, `charAt(i)`, `isEmpty()`, `isBlank()` (Java 11+).\n" +
    "- Comparison: `equals`, `equalsIgnoreCase`, `compareTo`, `compareToIgnoreCase`.\n" +
    "- Search: `indexOf`, `lastIndexOf`, `contains`, `startsWith`, `endsWith`.\n" +
    "- Extract: `substring`, `split`, `chars()` (IntStream).\n" +
    "- Transform: `toUpperCase`, `toLowerCase`, `trim`, `strip` (Java 11+, Unicode-aware), `replace`, `replaceAll` (regex), `replaceFirst`.\n" +
    "- Format: `format`, `formatted` (Java 15+), `String.join`.\n" +
    "- Java 15+: **text blocks** `\"\"\" ... \"\"\"` for multi-line literals.\n\n" +
    "## Risks of excessive `intern()`\n\n" +
    "> [!production]\n" +
    "> The pool is a native hashtable inside the JVM (`-XX:StringTableSize`, default 65536 buckets in modern JVMs).\n" +
    ">\n" +
    "> Risks:\n" +
    "> - **Hash collisions** degrade lookup to O(n) per bucket if the table is too small.\n" +
    "> - **Strong references** — pooled strings live until JVM exit (GC roots). Interning millions of unique strings → memory leak.\n" +
    "> - **Lock contention** — under heavy concurrent interning the pool can become a bottleneck.\n" +
    ">\n" +
    "> Apply `intern()` only to a **bounded, frequently repeated** set of values (enum-like, parsed identifiers).\n\n" +
    "## `switch` on Strings (Java 7+)\n\n" +
    "Works via `hashCode() + equals()` internally. The JVM compiles it into a `tableswitch` on hashes with an equals fallback for collision cases.\n\n" +
    "## String vs StringBuilder vs StringBuffer\n\n" +
    "| | Mutable | Thread-safe | When |\n" +
    "|--|--------|-------------|------|\n" +
    "| `String` | No | Yes (immutable) | Default |\n" +
    "| `StringBuilder` | Yes | No | Single-threaded building |\n" +
    "| `StringBuffer` | Yes | Yes (synchronized) | Legacy; rarely needed |",
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
        String unicode = "\\u4F60\\u597D";  // UTF-16 encoded (4 bytes)

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
      q:
        "Почему строки в Java immutable?\n\n---\n\n" +
        "Why are Strings immutable in Java?",
      a:
        "Три ключевых преимущества:\n\n" +
        "1. **Thread safety** — строки можно безопасно шарить между потоками без синхронизации.\n" +
        "2. **Безопасность** — строки, используемые для загрузки классов, URL, file path, не могут быть изменены после проверки.\n" +
        "3. **Производительность** — `hashCode()` кэшируется (вычисляется один раз, хранится в поле), **String Pool** может безопасно переиспользовать инстансы, потому что никто не может модифицировать pooled-строку.\n\n" +
        "Immutable-дизайн также позволяет JVM применять aggressive оптимизации — `substring()` в Java 6 шарил backing-массив (с тех пор изменено для предотвращения утечек).\n\n---\n\n" +
        "Three key benefits:\n\n" +
        "1. **Thread safety** — Strings can be shared across threads without synchronisation.\n" +
        "2. **Security** — Strings used in class loading, URLs, file paths cannot be tampered with after a check.\n" +
        "3. **Performance** — `hashCode()` is cached (computed once, stored in a field), and the **String Pool** can safely reuse instances because no one can modify a pooled String.\n\n" +
        "The immutable design also enables aggressive JVM optimisations — `substring()` in Java 6 shared the backing array (changed since to prevent leaks).",
      difficulty: "junior",
    },
    {
      id: "4-1-q1",
      q:
        "В чём разница между строковыми литералами, `new String(...)` и `.intern()`?\n\n---\n\n" +
        "What's the difference between string literals, `new String(...)`, and `.intern()`?",
      a:
        "- **Литерал** (`\"hello\"`) — попадает в **String Pool** автоматически при загрузке класса. `\"hello\" == \"hello\"` → true (одна pooled-ссылка).\n" +
        "- **`new String(\"hello\")`** — всегда создаёт **новый** объект в heap **вне** пула, даже если идентичный литерал уже в пуле. `new String(\"hello\") == \"hello\"` → false.\n" +
        "- **`.intern()`** — явно кладёт строку в пул или возвращает существующую pooled-ссылку. `new String(\"hello\").intern() == \"hello\"` → true.\n\n" +
        "Компиляционные константы (`\"a\" + \"b\"`) тоже попадают в пул, но рантайм-конкатенация с переменной (`prefix + \"b\"`) — нет.\n\n" +
        "**Правило**: `.equals()` для содержимого, `==` только если явно проверяете identity.\n\n---\n\n" +
        "- **Literal** (`\"hello\"`) — goes into the **String Pool** automatically on class load. `\"hello\" == \"hello\"` → true (same pooled reference).\n" +
        "- **`new String(\"hello\")`** — always creates a **new** heap object **outside** the pool, even if an identical literal already exists. `new String(\"hello\") == \"hello\"` → false.\n" +
        "- **`.intern()`** — explicitly pools the string or returns the existing pooled reference. `new String(\"hello\").intern() == \"hello\"` → true.\n\n" +
        "Compile-time constants (`\"a\" + \"b\"`) also enter the pool, but runtime concatenation with a variable (`prefix + \"b\"`) doesn't.\n\n" +
        "**Rule**: `.equals()` for content comparison, `==` only if you're explicitly checking identity.",
      difficulty: "junior",
    },
    {
      id: "4-1-q2",
      q:
        "Как работает конкатенация строк начиная с Java 9 и когда всё равно использовать StringBuilder?\n\n---\n\n" +
        "How does String concatenation work internally since Java 9, and when should you still use StringBuilder?",
      a:
        "С Java 9 (JEP 280) оператор `+` компилируется в **одиночный `invokedynamic`** → `StringConcatFactory.makeConcatWithConstants`. В рантайме bootstrap-метод генерирует оптимальную стратегию (обычно одна byte[]-аллокация точного размера).\n\n" +
        "**Для одиночного выражения** — `+` эффективнее ручного `StringBuilder`: JVM может предварительно вычислить размер буфера и сделать одну аллокацию.\n\n" +
        "**Когда `StringBuilder` всё равно нужен**:\n" +
        "- **В циклах** — каждая итерация = отдельный `invokedynamic`-вызов, создающий новый String. `StringBuilder` аккумулирует в единый буфер:\n" +
        "```java\n" +
        "StringBuilder sb = new StringBuilder();\n" +
        "for (String s : list) sb.append(s).append(\",\");\n" +
        "String result = sb.toString();\n" +
        "```\n" +
        "- **Построение across method calls или conditional branches** — компилятор не может соптимизировать одно выражение.\n" +
        "- **Динамический размер** — когда вы не знаете количество частей заранее.\n\n" +
        "`StringBuffer` — legacy-версия `StringBuilder` с synchronized. Редко нужна, практически всегда подходит `StringBuilder`.\n\n---\n\n" +
        "Since Java 9 (JEP 280) the `+` operator compiles to a **single `invokedynamic`** → `StringConcatFactory.makeConcatWithConstants`. At runtime the bootstrap method generates an optimal strategy (usually a single byte[] allocation of the exact size).\n\n" +
        "**For a single expression** — `+` is more efficient than manual `StringBuilder`: the JVM can pre-compute the buffer size and do one allocation.\n\n" +
        "**When `StringBuilder` is still needed**:\n" +
        "- **In loops** — each iteration is a separate `invokedynamic` call that creates a new String. `StringBuilder` accumulates into a single buffer:\n" +
        "```java\n" +
        "StringBuilder sb = new StringBuilder();\n" +
        "for (String s : list) sb.append(s).append(\",\");\n" +
        "String result = sb.toString();\n" +
        "```\n" +
        "- **Building across method calls or conditional branches** — the compiler can't optimise one expression.\n" +
        "- **Dynamic size** — when you don't know the number of pieces up front.\n\n" +
        "`StringBuffer` is the legacy synchronised version of `StringBuilder`. Rarely needed; `StringBuilder` is almost always the right tool.",
      difficulty: "mid",
    },
    {
      id: "4-1-q3",
      q:
        "Объясните Compact Strings (JEP 254), внутреннюю структуру String Pool и риски чрезмерного interning.\n\n---\n\n" +
        "Explain Compact Strings (JEP 254), the String Pool's internal data structure, and the risks of excessive interning.",
      a:
        "**Compact Strings (Java 9, JEP 254)** — внутренний `char[]` заменён на `byte[]` + `coder`-флаг:\n" +
        "- **LATIN1 (0)** — 1 байт/символ (ASCII и Latin-1).\n" +
        "- **UTF16 (1)** — 2 байта/символ (строки с не-Latin-1).\n\n" +
        "Для типичного ASCII-доминантного приложения — **экономия памяти в 2×**, без изменений в API.\n\n" +
        "**String Pool** — нативная hashtable в JVM (не `HashMap`!), размер регулируется `-XX:StringTableSize` (по умолчанию 65536 bucket'ов). Каждый bucket — связанный список.\n\n" +
        "**Риски `intern()`**:\n\n" +
        "1. **Collision degradation** — при малом размере таблицы lookup становится O(n) по bucket.\n" +
        "2. **Strong references** — pooled-строки являются GC-roots, **не собираются до выхода JVM**. Interning миллионов уникальных строк → утечка памяти.\n" +
        "3. **Lock contention** — под высокой конкурентной нагрузкой пул может стать bottleneck'ом.\n\n" +
        "**Правило**: применять `intern()` только к **ограниченному, часто повторяющемуся** множеству значений (enum-подобные, parsed identifiers из фиксированного домена).\n\n" +
        "Мониторинг: `jcmd <pid> VM.stringtable` покажет размер и коллизии.\n\n---\n\n" +
        "**Compact Strings (Java 9, JEP 254)** — the internal `char[]` was replaced by a `byte[]` + `coder` flag:\n" +
        "- **LATIN1 (0)** — 1 byte/char (ASCII and Latin-1).\n" +
        "- **UTF16 (1)** — 2 bytes/char (strings with non-Latin-1).\n\n" +
        "For a typical ASCII-dominant app — **memory is halved** with no API change.\n\n" +
        "**The String Pool** is a native hashtable inside the JVM (not a `HashMap`!), sized by `-XX:StringTableSize` (default 65536 buckets). Each bucket is a linked list.\n\n" +
        "**Risks of `intern()`**:\n\n" +
        "1. **Collision degradation** — with a too-small table, lookup degrades to O(n) per bucket.\n" +
        "2. **Strong references** — pooled strings are GC roots, **not collected until JVM exit**. Interning millions of unique strings → memory leak.\n" +
        "3. **Lock contention** — under heavy concurrent interning the pool can become a bottleneck.\n\n" +
        "**Rule**: use `intern()` only for a **bounded, frequently repeated** set of values (enum-like, parsed identifiers from a fixed domain).\n\n" +
        "Monitoring: `jcmd <pid> VM.stringtable` shows size and collisions.",
      difficulty: "senior",
    },
  ],
  tip:
    "Никогда не используйте `==` для сравнения String, если не тестируете явно identity (например, проверяете, что значение интерновано). На интервью немедленное исправление `==` на `.equals()` показывает внимание к частому production-багу.\n\n---\n\n" +
    "Never use `==` for String comparison unless explicitly testing reference identity (e.g. checking whether a value is interned). In interviews, immediately correcting `==` to `.equals()` signals awareness of a bug that plagues production code.",
  springConnection: {
    concept: "String & Immutability",
    springFeature: "Spring Property Resolution",
    explanation:
      "Spring резолвит `@Value(\"${property}\")`-плейсхолдеры в `String`. Благодаря immutability инжектированные конфигурационные значения автоматически thread-safe.\n\n" +
      "`Environment` и цепочка `PropertySource` всегда возвращают строки. Spring внутри использует `String.intern()` для имён бинов и scope-идентификаторов — ограниченный набор известных имён, частое сравнение по identity, идеальный кейс для interning.\n\n" +
      "Ключи `ApplicationContext.getBean(name)`, lookup по имени в registry — везде выгоду даёт immutability + pooling.\n\n---\n\n" +
      "Spring resolves `@Value(\"${property}\")` placeholders into `String`s. Thanks to immutability, injected configuration values are automatically thread-safe.\n\n" +
      "`Environment` and the `PropertySource` chain always return Strings. Internally, Spring uses `String.intern()` for bean names and scope identifiers — a bounded set of known names with frequent identity comparisons, the ideal interning use case.\n\n" +
      "Keys in `ApplicationContext.getBean(name)`, name lookup in the registry — immutability + pooling pay off everywhere.",
  },
};
