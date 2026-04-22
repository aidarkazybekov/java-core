import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-3",
  blockId: 2,
  title: "Operators & Casting",
  summary:
    "Java — строго типизированный язык, но поддерживает приведение типов (casting): тождественное, расширение, сужение (примитивов и объектов), преобразование к строке. Арифметика **всегда** продвигает `byte`/`short`/`char` до `int`. `instanceof` проверяет возможность приведения; `ClassCastException` — ошибка в рантайме.\n\n---\n\n" +
    "Java is strongly typed but supports casting: identity, widening, narrowing (for primitives and objects), and string conversion. Arithmetic **always** promotes `byte`/`short`/`char` to `int`. `instanceof` checks castability at runtime; `ClassCastException` is the failure mode.",
  deepDive:
    "## Виды приведения\n\n" +
    "- **Identity** — к тому же типу, бесплатно.\n" +
    "- **Widening (расширение) примитивов** — от менее ёмкого к более ёмкому: `byte → short → int → long → float → double`. Автоматически.\n" +
    "- **Narrowing (сужение) примитивов** — требует явный cast, может потерять данные.\n" +
    "- **Upcasting объектов** — к родителю, автоматически.\n" +
    "- **Downcasting объектов** — к потомку, требует явный cast. Ошибка приведения → `ClassCastException`.\n" +
    "- **Преобразование к строке** — `\"x=\" + 42` — любое значение приводится через `String.valueOf(...)`.\n\n" +
    "## Widening с потерей точности\n\n" +
    "> [!gotcha]\n" +
    "> `int → float` и `long → double` — widening-преобразования (cast не нужен), но **могут потерять точность**. `int` имеет 32 бита, `float` — только 24 бита мантиссы. Значения выше 2²⁴ (16 777 216) уже не влезают. Аналогично `long` → `double` теряет точность выше 2⁵³. JLS честно называет это «widening primitive conversions that may lose information».\n\n" +
    "## Integer promotion — главная ловушка арифметики\n\n" +
    "В арифметических выражениях `byte`, `short`, `char` **всегда** продвигаются до `int` перед операцией. Поэтому:\n\n" +
    "```java\n" +
    "byte a = 1, b = 2;\n" +
    "byte c = a + b;     // COMPILE ERROR: a + b это int\n" +
    "byte c = (byte)(a + b);  // OK\n" +
    "```\n\n" +
    "Но compound assignment (`+=`, `-=` и т.д.) включает **неявный cast** согласно JLS:\n\n" +
    "```java\n" +
    "byte b = 127;\n" +
    "b += 1;  // компилируется, эквивалентно b = (byte)(b + 1). b теперь -128 (overflow!)\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> Это любимый трюковый вопрос: составные операторы молча переполняются без предупреждения компилятора.\n\n" +
    "## == vs equals()\n\n" +
    "- На примитивах `==` сравнивает значения.\n" +
    "- На объектах `==` сравнивает **ссылки** (идентичность).\n" +
    "- Со String-литералами `==` часто «кажется работающим» из-за **string pool**: `\"hello\" == \"hello\"` → true (оба в пуле). Но `new String(\"hello\") == \"hello\"` → false.\n" +
    "- С обёртками — та же история с кэшем -128..127.\n\n" +
    "**Всегда используйте `.equals()` для объектов.**\n\n" +
    "## Pattern matching для instanceof (Java 16+)\n\n" +
    "Старый код:\n\n" +
    "```java\n" +
    "if (obj instanceof String) {\n" +
    "    String s = (String) obj;\n" +
    "    System.out.println(s.length());\n" +
    "}\n" +
    "```\n\n" +
    "Новый — компактнее и типобезопасен:\n\n" +
    "```java\n" +
    "if (obj instanceof String s) {\n" +
    "    System.out.println(s.length());\n" +
    "}\n" +
    "```\n\n" +
    "**Flow scoping** — переменная `s` видна только там, где компилятор доказал, что instanceof сработал. Работает даже с отрицанием:\n\n" +
    "```java\n" +
    "if (!(obj instanceof String s)) return;\n" +
    "// s в области видимости здесь — сюда можно попасть только если instanceof сработал\n" +
    "System.out.println(s.length());\n" +
    "```\n\n" +
    "В Java 21 pattern matching расширен на `switch` и записи — можно деструктурировать компоненты рекорда в одном выражении.\n\n" +
    "## Битовые операторы и shift\n\n" +
    "- `&`, `|`, `^` — побитовые (без short-circuit на booleans).\n" +
    "- `&&`, `||` — short-circuit (вторая часть не вычисляется, если уже понятно).\n" +
    "- `<<` — left shift.\n" +
    "- `>>` — signed right shift (сохраняет знак).\n" +
    "- `>>>` — unsigned right shift (заполняет нулями).\n\n" +
    "## Modulo — знак сохраняется от делимого\n\n" +
    "`-7 % 3 == -1` (а не `2`). Если нужен положительный результат — `Math.floorMod(-7, 3) == 2`.\n\n---\n\n" +
    "## Kinds of conversions\n\n" +
    "- **Identity** — to the same type, free.\n" +
    "- **Widening (primitive)** — smaller to larger: `byte → short → int → long → float → double`. Implicit.\n" +
    "- **Narrowing (primitive)** — explicit cast required, can lose data.\n" +
    "- **Upcasting (object)** — to a parent, implicit.\n" +
    "- **Downcasting (object)** — to a subtype, explicit cast. Mismatch → `ClassCastException`.\n" +
    "- **String conversion** — `\"x=\" + 42` — anything is converted via `String.valueOf(...)`.\n\n" +
    "## Widening with precision loss\n\n" +
    "> [!gotcha]\n" +
    "> `int → float` and `long → double` are widening (no cast needed) but **can lose precision**. `int` has 32 bits of precision; `float` only has 24 bits of mantissa. Values above 2²⁴ (16 777 216) stop fitting exactly. Same for `long → double` above 2⁵³. The JLS candidly calls these \"widening primitive conversions that may lose information\".\n\n" +
    "## Integer promotion — the big arithmetic pitfall\n\n" +
    "In arithmetic expressions `byte`, `short`, `char` are **always** promoted to `int` before the operation:\n\n" +
    "```java\n" +
    "byte a = 1, b = 2;\n" +
    "byte c = a + b;     // COMPILE ERROR: a + b is an int\n" +
    "byte c = (byte)(a + b);  // OK\n" +
    "```\n\n" +
    "But compound assignment (`+=`, `-=`, ...) includes an **implicit cast** per the JLS:\n\n" +
    "```java\n" +
    "byte b = 127;\n" +
    "b += 1;  // compiles, equivalent to b = (byte)(b + 1). b is now -128 (overflow!)\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> A favourite trick question: compound operators silently overflow with no compiler warning.\n\n" +
    "## == vs equals()\n\n" +
    "- On primitives, `==` compares values.\n" +
    "- On objects, `==` compares **references** (identity).\n" +
    "- With String literals `==` often \"seems to work\" because of the **string pool**: `\"hello\" == \"hello\"` → true. But `new String(\"hello\") == \"hello\"` → false.\n" +
    "- With wrappers — same story via the -128..127 cache.\n\n" +
    "**Always use `.equals()` for objects.**\n\n" +
    "## Pattern matching for instanceof (Java 16+)\n\n" +
    "Old code:\n\n" +
    "```java\n" +
    "if (obj instanceof String) {\n" +
    "    String s = (String) obj;\n" +
    "    System.out.println(s.length());\n" +
    "}\n" +
    "```\n\n" +
    "New — shorter and type-safe:\n\n" +
    "```java\n" +
    "if (obj instanceof String s) {\n" +
    "    System.out.println(s.length());\n" +
    "}\n" +
    "```\n\n" +
    "**Flow scoping** — `s` is only in scope where the compiler proved the instanceof matched. Works even with negation:\n\n" +
    "```java\n" +
    "if (!(obj instanceof String s)) return;\n" +
    "// s IS in scope here — the only way to reach this point is if instanceof succeeded\n" +
    "System.out.println(s.length());\n" +
    "```\n\n" +
    "Java 21 extends pattern matching to `switch` and records — you can deconstruct record components in a single expression.\n\n" +
    "## Bitwise and shift\n\n" +
    "- `&`, `|`, `^` — bitwise (no short-circuit on booleans).\n" +
    "- `&&`, `||` — short-circuit (second side not evaluated if unnecessary).\n" +
    "- `<<` — left shift.\n" +
    "- `>>` — signed right shift (preserves sign).\n" +
    "- `>>>` — unsigned right shift (fills with zeros).\n\n" +
    "## Modulo — sign follows the dividend\n\n" +
    "`-7 % 3 == -1` (not `2`). For a positive result use `Math.floorMod(-7, 3) == 2`.",
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
      q:
        "Какие виды приведения типов есть в Java?\n\n---\n\n" +
        "What kinds of type conversion does Java support?",
      a:
        "- **Identity** — к тому же типу.\n" +
        "- **Widening (расширение) примитивов** — неявно: `byte → short → int → long → float → double`. Может терять точность (`int → float`, `long → double`).\n" +
        "- **Narrowing (сужение) примитивов** — явный cast, может потерять данные.\n" +
        "- **Upcasting объектов** — к родителю, неявно.\n" +
        "- **Downcasting объектов** — к потомку, явный cast. Если тип несовместим → `ClassCastException`.\n" +
        "- **String conversion** — `\"x=\" + 42`, через `String.valueOf(...)`.\n\n" +
        "Проверка перед downcast — `instanceof`; с Java 16+ есть pattern matching: `if (obj instanceof String s) { ... }`.\n\n---\n\n" +
        "- **Identity** — same type.\n" +
        "- **Primitive widening** — implicit: `byte → short → int → long → float → double`. Can lose precision (`int → float`, `long → double`).\n" +
        "- **Primitive narrowing** — explicit cast, can lose data.\n" +
        "- **Object upcasting** — to a parent, implicit.\n" +
        "- **Object downcasting** — to a subtype, explicit cast. Mismatch → `ClassCastException`.\n" +
        "- **String conversion** — `\"x=\" + 42`, via `String.valueOf(...)`.\n\n" +
        "Guard a downcast with `instanceof`; since Java 16+ use pattern matching: `if (obj instanceof String s) { ... }`.",
      difficulty: "junior",
    },
    {
      id: "2-3-q1",
      q:
        "Почему `byte b = 1; byte c = b + 1;` не компилируется, а `b += 1;` — да?\n\n---\n\n" +
        "Why does `byte b = 1; byte c = b + 1;` not compile, but `b += 1;` does?",
      a:
        "В `b + 1` `byte` продвигается до `int` (integer promotion — Java приводит `byte`/`short`/`char` к `int` в любой арифметике), а литерал `1` — уже `int`. Результат — `int`, его нельзя присвоить в `byte` без явного cast. Поэтому `byte c = (byte)(b + 1);`.\n\n" +
        "Но составные операторы присваивания (`+=`, `-=` и т.д.) согласно JLS содержат **неявный narrowing-cast**. То есть `b += 1` эквивалентно `b = (byte)(b + 1)`. Это значит compound-assignment может молча переполниться: `byte b = 127; b += 1;` даёт `b = -128` без warning'а.\n\n---\n\n" +
        "In `b + 1` the `byte` is promoted to `int` (integer promotion — Java widens `byte`/`short`/`char` to `int` in any arithmetic), and the literal `1` is already an `int`. The result is `int`, which can't be assigned to `byte` without an explicit cast. Hence `byte c = (byte)(b + 1);`.\n\n" +
        "But compound assignment operators (`+=`, `-=`, ...) per the JLS carry an **implicit narrowing cast**. So `b += 1` is equivalent to `b = (byte)(b + 1)`. That means compound assignment can silently overflow: `byte b = 127; b += 1;` gives `b = -128` with no warning.",
      difficulty: "junior",
    },
    {
      id: "2-3-q2",
      q:
        "Может ли widening-преобразование потерять данные? Приведите пример.\n\n---\n\n" +
        "Can a widening conversion lose data? Give an example.",
      a:
        "Да. `int → float` и `long → double` — это widening-преобразования (cast не нужен), но **могут потерять точность**.\n\n" +
        "`int` — 32 бита точности; `float` — только 24 бита мантиссы. Любое значение выше 2²⁴ = 16 777 216 может потерять точность:\n\n" +
        "```java\n" +
        "int n = 16_777_217;\n" +
        "float f = n;            // 16777216.0f — мы потеряли 1\n" +
        "```\n\n" +
        "Аналогично `long → double` теряет точность выше 2⁵³. Это реальный источник багов в финансовых вычислениях — JLS честно называет это «widening primitive conversions that may lose information».\n\n---\n\n" +
        "Yes. `int → float` and `long → double` are widening (no cast required) but **can lose precision**.\n\n" +
        "`int` has 32 bits of integer precision; `float` only has 24 bits of mantissa. Any value above 2²⁴ = 16 777 216 can lose precision:\n\n" +
        "```java\n" +
        "int n = 16_777_217;\n" +
        "float f = n;            // 16777216.0f — we lost 1\n" +
        "```\n\n" +
        "Similarly `long → double` loses precision above 2⁵³. A real source of bugs in financial maths — the JLS honestly calls these \"widening primitive conversions that may lose information\".",
      difficulty: "mid",
    },
    {
      id: "2-3-q3",
      q:
        "Как работает pattern matching для `instanceof` и flow-scoping в Java 16+?\n\n---\n\n" +
        "How does pattern matching for `instanceof` and flow scoping work in Java 16+?",
      a:
        "Pattern matching `instanceof` вводит **binding-переменную**, область видимости которой определяется flow-анализом — переменная видна только там, где компилятор доказал, что паттерн сработал.\n\n" +
        "```java\n" +
        "if (obj instanceof String s) {\n" +
        "    // s видна здесь\n" +
        "}\n" +
        "```\n\n" +
        "С отрицанием:\n" +
        "```java\n" +
        "if (!(obj instanceof String s)) return;\n" +
        "// s видна здесь — сюда можно дойти только если instanceof сработал\n" +
        "```\n\n" +
        "В булевых выражениях:\n" +
        "- `obj instanceof String s && s.length() > 5` — OK, `s` доступна в правой части `&&`, т.к. до неё добираемся только при успешном match.\n" +
        "- `obj instanceof String s || s.isEmpty()` — **ошибка**: в правой части `||` паттерн мог не сработать.\n\n" +
        "Java 21 расширил pattern matching на `switch` и рекорды — можно деструктурировать компоненты рекорда в одном выражении.\n\n---\n\n" +
        "Pattern matching `instanceof` introduces a **binding variable** whose scope is determined by flow analysis — it's only visible where the compiler proved the pattern matched.\n\n" +
        "```java\n" +
        "if (obj instanceof String s) {\n" +
        "    // s is in scope here\n" +
        "}\n" +
        "```\n\n" +
        "With negation:\n" +
        "```java\n" +
        "if (!(obj instanceof String s)) return;\n" +
        "// s IS in scope here — the only way to reach this point is if instanceof succeeded\n" +
        "```\n\n" +
        "In boolean expressions:\n" +
        "- `obj instanceof String s && s.length() > 5` — OK, `s` is available on the RHS of `&&`, since we only get there when the match succeeded.\n" +
        "- `obj instanceof String s || s.isEmpty()` — **illegal**: on the RHS of `||` the pattern might not have matched.\n\n" +
        "Java 21 extends pattern matching to `switch` and records — you can deconstruct record components in a single expression.",
      difficulty: "senior",
    },
  ],
  tip:
    "Составные операторы присваивания (`+=`, `*=`, ...) содержат **скрытый cast**. `short s = 32767; s += 1;` компилируется и молча переполняется. Любимый трюк на собеседованиях.\n\n---\n\n" +
    "Compound assignment (`+=`, `*=`, ...) carries a **hidden cast**. `short s = 32767; s += 1;` compiles and silently overflows. A favourite trick question.",
  springConnection: {
    concept: "Type casting and instanceof",
    springFeature: "Spring ConversionService",
    explanation:
      "`ConversionService` Spring'а решает задачи приведения, далеко выходящие за нативные возможности Java: `String → enum`, `String → Date`, `String → List`, любые пользовательские типы.\n\n" +
      "Когда вы пишете `@Value(\"${server.port}\") int port`, срабатывает Spring'овый type conversion — он парсит строковое property в `int`. То же для `@RequestParam`, `@PathVariable`, data binding в формах.\n\n" +
      "Понимание ограничений нативного Java-casting помогает ценить, зачем нужен отдельный conversion-фреймворк для property binding, mapping запросов и сериализации.\n\n---\n\n" +
      "Spring's `ConversionService` handles conversions that go well beyond Java's built-in casting: `String → enum`, `String → Date`, `String → List`, any user-defined types.\n\n" +
      "When you write `@Value(\"${server.port}\") int port`, Spring's type conversion parses the String property into an `int`. Same for `@RequestParam`, `@PathVariable`, and form data binding.\n\n" +
      "Understanding the limits of native Java casting makes clear why Spring needs a separate conversion framework for property binding, request mapping, and serialisation.",
  },
};
