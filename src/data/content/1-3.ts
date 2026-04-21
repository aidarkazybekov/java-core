import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-3",
  blockId: 1,
  title: "Bytecode & Compilation",
  summary:
    "Исходный код Java компилируется компилятором javac (входит в JDK) в платформо-независимый байт-код (.class файлы), а не в нативный машинный код. Именно байт-код обеспечивает принцип 'write once, run anywhere' -- JVM на любой платформе может его исполнить.\n\n---\n\n" +
    "Java source code compiles to platform-independent bytecode (.class files), not native machine code. This intermediate representation is what makes 'write once, run anywhere' work. Understanding bytecode helps you reason about performance, decompilation, and what the JVM actually executes.",
  deepDive:
    "## Как устроен байт-код\n\n" +
    "Компилятор `javac` превращает `.java` в `.class`. Внутри `.class` — стековый набор инструкций для JVM. Формат файла фиксированный:\n\n" +
    "- Magic number `0xCAFEBABE`\n" +
    "- Major/minor version (v52 = Java 8, v65 = Java 21)\n" +
    "- Constant pool — строки, классы, сигнатуры\n" +
    "- Флаги доступа, интерфейсы, поля, методы, атрибуты\n\n" +
    "Посмотреть байт-код любого класса: `javap -c -p MyClass`.\n\n" +
    "## Пять `invoke*` инструкций\n\n" +
    "- `invokevirtual` — обычный вызов метода экземпляра, с виртуальной диспетчеризацией (самая частая).\n" +
    "- `invokeinterface` — вызов через интерфейсную ссылку; медленнее, чем `invokevirtual`, так как vtable не фиксирован.\n" +
    "- `invokespecial` — конструкторы, приватные методы, `super.method()` — без диспетчеризации.\n" +
    "- `invokestatic` — статические методы.\n" +
    "- `invokedynamic` — добавлен в Java 7 для динамических языков. С Java 8 используется для лямбд (через `LambdaMetafactory`), с Java 9 — для конкатенации строк (через `StringConcatFactory`).\n\n" +
    "## Оптимизации делает JIT, не `javac`\n\n" +
    "Компилятор делает минимум: constant folding, устранение мёртвого кода на уровне выражений. Всё остальное (inlining, escape analysis, loop unrolling, lock elision) — это JIT во время выполнения. Это сознательное решение: у JIT есть профилировочные данные, которых нет у статического компилятора.\n\n" +
    "## Конкатенация строк — интересный случай\n\n" +
    "> [!tip]\n" +
    "> До Java 9: `\"a\" + b + \"c\"` компилировалось в цепочку `new StringBuilder().append().append().toString()`.\n" +
    "> С Java 9 (JEP 280): это одна инструкция `invokedynamic` → `StringConcatFactory`, и JVM сама выбирает оптимальную стратегию в рантайме. Поэтому **ручной `StringBuilder` для простой конкатенации теперь антипаттерн** — JVM делает лучше.\n\n" +
    "## Верификация байт-кода\n\n" +
    "Перед исполнением любого класса JVM-верификатор проверяет: байт-код корректен, типы согласованы, стек сбалансирован. Это защита от повреждённого или вредоносного байт-кода. Верификация происходит в фазе linking при загрузке класса.\n\n---\n\n" +
    "## What bytecode looks like\n\n" +
    "`javac` turns `.java` into `.class`. Inside the `.class` is a stack-based instruction set for the JVM. The file format is strictly defined:\n\n" +
    "- Magic number `0xCAFEBABE`\n" +
    "- Major/minor version (v52 = Java 8, v65 = Java 21)\n" +
    "- Constant pool — strings, class refs, signatures\n" +
    "- Access flags, interfaces, fields, methods, attributes\n\n" +
    "Inspect any class: `javap -c -p MyClass`.\n\n" +
    "## The five `invoke*` instructions\n\n" +
    "- `invokevirtual` — regular instance method call with virtual dispatch (most common).\n" +
    "- `invokeinterface` — calls through an interface reference; slower than `invokevirtual` because the vtable isn't fixed.\n" +
    "- `invokespecial` — constructors, private methods, `super.method()` — no virtual dispatch.\n" +
    "- `invokestatic` — static methods.\n" +
    "- `invokedynamic` — added in Java 7 for dynamic languages. Used since Java 8 for lambdas (via `LambdaMetafactory`) and since Java 9 for string concatenation (via `StringConcatFactory`).\n\n" +
    "## Optimisations are the JIT's job, not `javac`'s\n\n" +
    "`javac` does very little: constant folding and dead-code elimination at the expression level. Everything else (inlining, escape analysis, loop unrolling, lock elision) is deferred to the JIT at runtime. This is deliberate — the JIT has profiling data a static compiler does not.\n\n" +
    "## String concatenation — an illuminating case\n\n" +
    "> [!tip]\n" +
    "> Pre-Java-9: `\"a\" + b + \"c\"` compiled to `new StringBuilder().append().append().toString()`.\n" +
    "> Since Java 9 (JEP 280) it's a single `invokedynamic` → `StringConcatFactory`, and the JVM chooses the optimal strategy at runtime. So **manually reaching for `StringBuilder` for simple concatenation is now an anti-pattern** — the JVM does better.\n\n" +
    "## Bytecode verification\n\n" +
    "Before executing any class the JVM verifier checks that bytecode is well-formed, types are consistent, and the operand stack balances. This prevents corrupted/malicious bytecode from crashing the JVM or breaking memory safety. Verification runs during the linking phase of class loading.",
  code:
    `// Compile this, then run: javap -c -p BytecodeDemo
// to see the actual bytecode instructions
public class BytecodeDemo {

    // Compile-time constant folding — check bytecode to verify
    private static final int COMPILE_TIME_CONSTANT = 2 * 3 * 7; // becomes 42 in bytecode

    public static void main(String[] args) {
        // 1. See how string concatenation compiles (invokedynamic since Java 9)
        String name = "Java";
        int version = 21;
        String message = "Hello " + name + " " + version; // check bytecode!
        System.out.println(message);

        // 2. Autoboxing — bytecode reveals Integer.valueOf() calls
        Integer boxed = 42;           // invokestatic Integer.valueOf
        int unboxed = boxed;          // invokevirtual Integer.intValue

        // 3. Method dispatch — different invoke* instructions
        Object obj = "test";
        obj.toString();               // invokevirtual (virtual dispatch)
        String.valueOf(42);           // invokestatic (no dispatch)
        Runnable r = () -> {};        // invokedynamic (lambda metafactory)
        r.run();                      // invokeinterface

        // 4. Enhanced for-loop — compiles to iterator pattern
        var list = java.util.List.of("a", "b", "c");
        for (String s : list) {       // becomes Iterator.hasNext()/next()
            System.out.println(s);
        }

        // 5. Try-with-resources — generates complex bytecode
        // with synthetic null checks and suppressed exception handling
        try (var scanner = new java.util.Scanner(System.in)) {
            // bytecode includes: null check, close(), addSuppressed()
        }
    }

    // Polymorphic dispatch — invokevirtual with vtable lookup
    static void demonstrateDispatch() {
        java.util.List<String> list = new java.util.ArrayList<>();
        list.add("test"); // invokevirtual -> resolved at runtime via vtable
    }
}`,
  interviewQs: [
    {
      id: "1-3-q0",
      q:
        "Что такое байт-код и почему Java использует его вместо прямой компиляции в машинный код?\n\n---\n\n" +
        "What is bytecode and why does Java use it instead of compiling directly to machine code?",
      a:
        "Байт-код — платформо-независимый промежуточный набор инструкций, хранящийся в `.class` файлах. Java использует его для реализации «write once, run anywhere»: одни и те же `.class` запускаются на любой платформе с JVM. В рантайме JVM интерпретирует байт-код или компилирует его в нативный код через JIT.\n\n" +
        "Дополнительный плюс: JIT может использовать runtime-профилирование для оптимизаций, недоступных статическому AOT-компилятору — оптимистическая девиртуализация, спекулятивный inlining по реальным паттернам вызовов.\n\n---\n\n" +
        "Bytecode is a platform-independent intermediate instruction set stored in `.class` files. Java uses it to achieve 'write once, run anywhere' — the same `.class` files run on any platform with a JVM. At runtime the JVM interprets or JIT-compiles bytecode to native code.\n\n" +
        "An extra benefit: the JIT can use runtime profiling data for optimisations a static AOT compiler cannot do — optimistic devirtualisation, speculative inlining based on actual call patterns.",
      difficulty: "junior",
    },
    {
      id: "1-3-q1",
      q:
        "Какие бывают `invoke*` инструкции в байт-коде и когда используется каждая?\n\n---\n\n" +
        "What are the different `invoke*` bytecode instructions and when is each used?",
      a:
        "Пять штук:\n\n" +
        "- **`invokevirtual`** — обычный вызов метода экземпляра с виртуальной диспетчеризацией. Самая частая инструкция.\n" +
        "- **`invokeinterface`** — вызов через интерфейсную ссылку. Медленнее, чем `invokevirtual`, потому что не может использовать фиксированный vtable-офсет.\n" +
        "- **`invokespecial`** — конструкторы, приватные методы, `super` — виртуальная диспетчеризация не нужна.\n" +
        "- **`invokestatic`** — статические методы.\n" +
        "- **`invokedynamic`** — добавлена в Java 7 для динамических языков. С Java 8 — лямбды (`LambdaMetafactory`), с Java 9 — конкатенация строк (`StringConcatFactory`).\n\n" +
        "Понимание `invokedynamic` — ключ к тому, как лямбды реально работают на уровне байт-кода.\n\n---\n\n" +
        "There are five:\n\n" +
        "- **`invokevirtual`** — ordinary instance-method call with virtual dispatch. The most common.\n" +
        "- **`invokeinterface`** — calls through an interface reference. Slower than `invokevirtual` because it can't use a fixed vtable offset.\n" +
        "- **`invokespecial`** — constructors, private methods, `super` calls — no virtual dispatch needed.\n" +
        "- **`invokestatic`** — static methods.\n" +
        "- **`invokedynamic`** — added in Java 7 for dynamic languages. Since Java 8 used for lambdas (`LambdaMetafactory`), since Java 9 for string concatenation (`StringConcatFactory`).\n\n" +
        "Understanding `invokedynamic` is the key to how lambdas actually work at the bytecode level.",
      difficulty: "mid",
    },
    {
      id: "1-3-q2",
      q:
        "Как изменилась конкатенация строк на уровне байт-кода в Java 9 и какие у этого последствия для производительности?\n\n---\n\n" +
        "How did string concatenation change at the bytecode level in Java 9, and what are the performance implications?",
      a:
        "До Java 9 `javac` компилировал конкатенацию в явные цепочки `new StringBuilder().append().append().toString()`. Это было жёстко — JVM не могла выбрать другую стратегию.\n\n" +
        "В Java 9 (JEP 280) конкатенация компилируется в одиночный `invokedynamic` к `StringConcatFactory.makeConcatWithConstants`. В рантайме bootstrap-метод генерирует оптимальную стратегию (копирование в byte[], pre-sized буфер и т.д.) и привязывает её к call site.\n\n" +
        "Последствия:\n" +
        "- JVM выбирает наилучший подход без изменений в `javac`.\n" +
        "- Ручной `StringBuilder` для простой конкатенации теперь **антипаттерн** — автоматическая стратегия обычно быстрее, потому что предварительно вычисляет точный размер буфера.\n" +
        "- `StringBuilder` всё ещё полезен при конкатенации **в цикле** — компилятор не оптимизирует через итерации.\n\n---\n\n" +
        "Before Java 9 `javac` compiled concatenation into explicit `new StringBuilder().append().append().toString()` chains. This was rigid — the JVM couldn't pick another strategy.\n\n" +
        "In Java 9 (JEP 280) concatenation compiles to a single `invokedynamic` call to `StringConcatFactory.makeConcatWithConstants`. At runtime the bootstrap method generates an optimised strategy (byte[] copy, pre-sized buffer, etc.) and binds it to that call site.\n\n" +
        "Implications:\n" +
        "- The JVM picks the best approach without any `javac` change.\n" +
        "- Manually using `StringBuilder` for simple concatenation is now an **anti-pattern** — the auto-generated strategy is usually faster because it pre-computes the exact buffer size.\n" +
        "- `StringBuilder` still earns its keep for concatenation **inside a loop** — the compiler cannot optimise across iterations.",
      difficulty: "senior",
    },
  ],
  tip:
    "Используйте `javap -c -p YourClass` для просмотра байт-кода любого класса. Это демистифицирует autoboxing, лямбды, конкатенацию строк и даёт готовые ответы для интервью.\n\n---\n\n" +
    "Run `javap -c -p YourClass` on any code you're curious about. Seeing actual bytecode for autoboxing, lambdas, and string concatenation demystifies Java and gives you ammunition for interviews.",
  springConnection: {
    concept: "Bytecode generation",
    springFeature: "Spring AOP & CGLIB Proxies",
    explanation:
      "Spring генерирует прокси-классы в рантайме через CGLIB (генерация байт-кода) или JDK dynamic proxies.\n\n" +
      "Когда вы добавляете `@Transactional` или `@Cacheable`, Spring создаёт подкласс вашего бина (CGLIB), который переопределяет методы, добавляя поведение — это манипуляция байт-кодом прямо во время работы.\n\n" +
      "Понимание байт-кода помогает отлаживать proxy-related баги вроде **«self-invocation bypasses @Transactional»**: сгенерированный байт-код перехватывает вызовы только через прокси-ссылку, а не через прямой `this.method()` изнутри того же класса.\n\n---\n\n" +
      "Spring generates proxy classes at runtime using CGLIB (bytecode generation) or JDK dynamic proxies.\n\n" +
      "When you add `@Transactional` or `@Cacheable`, Spring creates a subclass of your bean (CGLIB) that overrides methods to add behaviour — this is bytecode manipulation happening at runtime.\n\n" +
      "Understanding bytecode helps debug proxy-related bugs like **\"self-invocation bypasses @Transactional\"** — the generated bytecode only intercepts calls through the proxy reference, not direct `this.method()` calls inside the same class.",
  },
};
