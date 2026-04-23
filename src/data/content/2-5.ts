import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-5",
  blockId: 2,
  title: "Arrays",
  summary:
    "Массивы — базовая структура данных Java: фиксированный размер, типобезопасность при создании, непрерывное размещение в куче. Массивы примитивов хранят значения без boxing — значительный выигрыш по памяти и кэш-локальности. **Ковариантность массивов** — известная ошибка дизайна, которую генерики позже исправили.\n\n---\n\n" +
    "Arrays are Java's most fundamental data structure — fixed-size, type-safe at creation, stored contiguously on the heap. Primitive arrays hold values without boxing — a big win in memory and cache locality. **Array covariance** is a known design mistake that generics later corrected.",
  deepDive:
    "## Массивы — это объекты на куче\n\n" +
    "Даже массив примитивов — объект на куче. `int[100]` — это один непрерывный блок 400 байт (плюс заголовок объекта), **без boxing и pointer chasing**. Именно поэтому примитивные массивы обходят `List<Integer>` в разы на числовых задачах.\n\n" +
    "Длина массива фиксируется при создании и хранится в заголовке объекта. `.length` — O(1) чтение поля, не метод.\n\n" +
    "## Ковариантность массивов — design mistake\n\n" +
    "`String[]` — подтип `Object[]`. Это логично, но ломает типобезопасность в рантайме:\n\n" +
    "```java\n" +
    "String[] strings = {\"hello\", \"world\"};\n" +
    "Object[] objects = strings;  // OK, covariance\n" +
    "objects[0] = 42;             // compiles! бросает ArrayStoreException в runtime\n" +
    "```\n\n" +
    "JVM вынуждена проверять тип **на каждой записи** в массив объектов. Это и небезопасно, и медленно.\n\n" +
    "> [!info]\n" +
    "> Когда в Java 5 добавили генерики, их сделали **инвариантными**: `List<String>` НЕ подтип `List<Object>`. Ковариантность достигается через wildcards (`List<? extends Object>`) — безопасно во время компиляции.\n\n" +
    "## Многомерные массивы — jagged, не rectangular\n\n" +
    "`int[][] matrix = new int[3][4]` создаёт **4 объекта**: один `int[][]` длины 3 и три `int[]` длины 4. Каждая строка может иметь свою длину:\n\n" +
    "```java\n" +
    "int[][] jagged = new int[3][];\n" +
    "jagged[0] = new int[]{1, 2};\n" +
    "jagged[1] = new int[]{3, 4, 5, 6};\n" +
    "jagged[2] = new int[]{7};\n" +
    "```\n\n" +
    "> [!production]\n" +
    "> Доступ `matrix[i][j]` — две разыменования указателей и плохая кэш-локальность. Для числового кода flat `int[rows * cols]` с индексацией `i * cols + j` может быть в разы быстрее.\n\n" +
    "## Массивы + генерики = конфликт\n\n" +
    "`new T[10]` **не компилируется** из-за type erasure: в рантайме JVM не знает, что такое `T`, и не может выполнить array-store check.\n\n" +
    "Обходной путь — `(T[]) new Object[10]` с unchecked cast warning. Поэтому `ArrayList<T>` внутри хранит `Object[]` и кастует при чтении. `Arrays.copyOf()` использует reflection (`Array.newInstance()`) для создания правильно типизированного массива.\n\n" +
    "## Arrays.asList() — ловушки\n\n" +
    "> [!gotcha]\n" +
    "> 1. `Arrays.asList(arr)` возвращает **fixed-size** список. `set()` работает и меняет оригинальный массив; `add()` / `remove()` — `UnsupportedOperationException`.\n" +
    "> 2. `Arrays.asList(int[])` создаёт `List<int[]>` с **одним** элементом-массивом, не `List<Integer>`! Для примитивов: `IntStream.of(arr).boxed().toList()`.\n\n" +
    "`List.of(...)` (Java 9+) — настоящий immutable, не позволяет null, все модификации — `UnsupportedOperationException`.\n\n" +
    "## Сортировка\n\n" +
    "- `Arrays.sort(int[])` — dual-pivot quicksort, O(n log n) в среднем, **нестабильная**.\n" +
    "- `Arrays.sort(Object[])` — **TimSort**, O(n log n), **стабильная**, использует естественные runs. Java портировала TimSort из Python.\n\n" +
    "## Равенство и копирование\n\n" +
    "- `a == b` — сравнение ссылок, почти всегда `false`.\n" +
    "- `Arrays.equals(a, b)` — поэлементно, для 1D.\n" +
    "- `Arrays.deepEquals(a, b)` — рекурсивно для многомерных (1D `Arrays.equals` на `int[][]` даст `false` даже при идентичном содержимом).\n" +
    "- `System.arraycopy(src, srcPos, dest, destPos, len)` — самая быстрая bulk-копия, intrinsic-оптимизация в HotSpot.\n" +
    "- `Arrays.copyOf(arr, newLength)` — удобная обёртка над `arraycopy`.\n\n---\n\n" +
    "## Arrays are heap objects\n\n" +
    "Even a primitive array is a heap object. `int[100]` is a single contiguous block of 400 bytes (plus object header), **with no boxing and no pointer chasing**. That's why primitive arrays beat `List<Integer>` by multiples for numeric work.\n\n" +
    "Array length is fixed at creation and stored in the object header. `.length` is an O(1) field read, not a method call.\n\n" +
    "## Array covariance — a design mistake\n\n" +
    "`String[]` is a subtype of `Object[]`. It looks logical but breaks runtime type safety:\n\n" +
    "```java\n" +
    "String[] strings = {\"hello\", \"world\"};\n" +
    "Object[] objects = strings;  // OK, covariance\n" +
    "objects[0] = 42;             // compiles! throws ArrayStoreException at runtime\n" +
    "```\n\n" +
    "The JVM has to type-check **every store** into an object array. Both unsafe and slow.\n\n" +
    "> [!info]\n" +
    "> When generics landed in Java 5 they were made **invariant**: `List<String>` is NOT a subtype of `List<Object>`. Covariance is expressed via wildcards (`List<? extends Object>`) — safe at compile time.\n\n" +
    "## Multi-dimensional arrays — jagged, not rectangular\n\n" +
    "`int[][] matrix = new int[3][4]` creates **4 objects**: one `int[][]` of length 3, plus three `int[]` of length 4. Each row can have its own length:\n\n" +
    "```java\n" +
    "int[][] jagged = new int[3][];\n" +
    "jagged[0] = new int[]{1, 2};\n" +
    "jagged[1] = new int[]{3, 4, 5, 6};\n" +
    "jagged[2] = new int[]{7};\n" +
    "```\n\n" +
    "> [!production]\n" +
    "> `matrix[i][j]` is two pointer dereferences and poor cache locality. For numeric code, a flat `int[rows * cols]` with index `i * cols + j` can be multiple times faster.\n\n" +
    "## Arrays + generics = conflict\n\n" +
    "`new T[10]` **does not compile** because of type erasure: at runtime the JVM doesn't know what `T` is and can't perform the array-store check.\n\n" +
    "The workaround is `(T[]) new Object[10]` with an unchecked cast warning. That's why `ArrayList<T>` stores an `Object[]` internally and casts on read. `Arrays.copyOf()` uses reflection (`Array.newInstance()`) to produce a properly typed array.\n\n" +
    "## Arrays.asList() — traps\n\n" +
    "> [!gotcha]\n" +
    "> 1. `Arrays.asList(arr)` returns a **fixed-size** list. `set()` works and mutates the underlying array; `add()` / `remove()` throw `UnsupportedOperationException`.\n" +
    "> 2. `Arrays.asList(int[])` returns `List<int[]>` with **one** array-element, not `List<Integer>`! For primitives use `IntStream.of(arr).boxed().toList()`.\n\n" +
    "`List.of(...)` (Java 9+) is a true immutable, rejects null, and throws `UnsupportedOperationException` on any mutation.\n\n" +
    "## Sorting\n\n" +
    "- `Arrays.sort(int[])` — dual-pivot quicksort, O(n log n) average, **not stable**.\n" +
    "- `Arrays.sort(Object[])` — **TimSort**, O(n log n), **stable**, uses natural runs. Java ported TimSort from Python.\n\n" +
    "## Equality and copying\n\n" +
    "- `a == b` — reference comparison, almost always `false`.\n" +
    "- `Arrays.equals(a, b)` — element-wise, for 1D.\n" +
    "- `Arrays.deepEquals(a, b)` — recursively for multi-dim (`Arrays.equals` on `int[][]` returns `false` even for identical contents).\n" +
    "- `System.arraycopy(src, srcPos, dest, destPos, len)` — fastest bulk copy, intrinsic-optimised in HotSpot.\n" +
    "- `Arrays.copyOf(arr, newLength)` — convenient wrapper over `arraycopy`.",
  code:
    `import java.util.Arrays;
import java.util.List;

public class ArraysDemo {
    public static void main(String[] args) {
        // === Array Covariance Problem ===
        String[] strings = {"hello", "world"};
        Object[] objects = strings; // compiles! String[] is a subtype of Object[]
        try {
            objects[0] = 42; // compiles! but throws at runtime
        } catch (ArrayStoreException e) {
            System.out.println("ArrayStoreException: " + e.getMessage());
        }

        // Generics fixed this: List<String> is NOT a subtype of List<Object>
        // List<Object> list = new ArrayList<String>(); // COMPILE ERROR

        // === Arrays.asList() gotchas ===
        String[] arr = {"a", "b", "c"};
        List<String> fixedList = Arrays.asList(arr);
        fixedList.set(0, "x"); // OK — modifies the original array too!
        System.out.println("\\nArray after list.set: " + Arrays.toString(arr)); // [x, b, c]

        try {
            fixedList.add("d"); // UnsupportedOperationException!
        } catch (UnsupportedOperationException e) {
            System.out.println("Cannot add to Arrays.asList result");
        }

        // Primitive array trap: asList treats int[] as a single element
        int[] primitives = {1, 2, 3};
        var badList = Arrays.asList(primitives); // List<int[]>, NOT List<Integer>!
        System.out.println("\\nasList(int[]) size: " + badList.size()); // 1, not 3!

        Integer[] boxed = {1, 2, 3};
        List<Integer> goodList = Arrays.asList(boxed); // size = 3

        // === Jagged arrays (arrays of arrays) ===
        int[][] jagged = new int[3][];
        jagged[0] = new int[]{1, 2};
        jagged[1] = new int[]{3, 4, 5, 6};
        jagged[2] = new int[]{7};
        System.out.println("\\nJagged array row lengths: " +
            jagged[0].length + ", " + jagged[1].length + ", " + jagged[2].length);

        // === Array equality ===
        int[] a = {1, 2, 3};
        int[] b = {1, 2, 3};
        System.out.println("\\na == b: " + (a == b));                 // false
        System.out.println("Arrays.equals: " + Arrays.equals(a, b)); // true

        int[][] nested1 = {{1, 2}, {3, 4}};
        int[][] nested2 = {{1, 2}, {3, 4}};
        System.out.println("Arrays.equals (2D): " +
            Arrays.equals(nested1, nested2));                          // false!
        System.out.println("Arrays.deepEquals (2D): " +
            Arrays.deepEquals(nested1, nested2));                      // true

        // === System.arraycopy — fastest bulk copy ===
        int[] src = {10, 20, 30, 40, 50};
        int[] dest = new int[5];
        System.arraycopy(src, 1, dest, 0, 3);
        System.out.println("\\narraycopy result: " + Arrays.toString(dest)); // [20, 30, 40, 0, 0]

        // === Sorting: primitives vs objects ===
        int[] nums = {5, 2, 8, 1, 9};
        Arrays.sort(nums); // dual-pivot quicksort, not stable
        System.out.println("\\nSorted ints: " + Arrays.toString(nums));

        String[] words = {"banana", "apple", "cherry"};
        Arrays.sort(words); // TimSort, stable
        System.out.println("Sorted words: " + Arrays.toString(words));
    }
}`,
  interviewQs: [
    {
      id: "2-5-q0",
      q:
        "В чём разница между `Arrays.asList()` и `List.of()`?\n\n---\n\n" +
        "What's the difference between `Arrays.asList()` and `List.of()`?",
      a:
        "- **`Arrays.asList(arr)`** — возвращает **fixed-size** список, «обёрнутый» поверх массива. `set()` работает и меняет оригинальный массив. `add()` / `remove()` — `UnsupportedOperationException`. Допускает null. Ловушка: `Arrays.asList(int[])` возвращает `List<int[]>` с **одним** элементом.\n" +
        "- **`List.of(...)`** (Java 9+) — настоящий **immutable**. Ни `set`, ни `add`, ни `remove` не работают. null запрещён — бросает `NullPointerException`. Более компактное представление внутри (для 0..2 элементов есть специальные классы).\n\n---\n\n" +
        "- **`Arrays.asList(arr)`** — returns a **fixed-size** list wrapping the array. `set()` works and mutates the underlying array. `add()` / `remove()` throw `UnsupportedOperationException`. Allows null. Trap: `Arrays.asList(int[])` gives `List<int[]>` with **one** element.\n" +
        "- **`List.of(...)`** (Java 9+) is a real **immutable** list. None of `set`, `add`, `remove` works. null is forbidden — throws `NullPointerException`. More compact internal representation (specialised classes for 0..2 elements).",
      difficulty: "junior",
    },
    {
      id: "2-5-q1",
      q:
        "Что такое ковариантность массивов и почему это считают ошибкой дизайна?\n\n---\n\n" +
        "What is array covariance and why is it considered a design mistake?",
      a:
        "Ковариантность — `String[]` является подтипом `Object[]`. Можно присвоить `String[]` в переменную типа `Object[]`, а потом записать туда любой `Object`. JVM обязана проверять тип **на каждой записи** в массив объектов — иначе бросает `ArrayStoreException` в рантайме:\n\n" +
        "```java\n" +
        "String[] strings = {\"a\"};\n" +
        "Object[] objects = strings;\n" +
        "objects[0] = 42;  // compiles, ArrayStoreException в рантайме\n" +
        "```\n\n" +
        "Ковариантность была в Java 1.0 как костыль для обобщённого программирования до появления генериков. Когда генерики добавили в Java 5, их сделали **инвариантными** (`List<String>` не подтип `List<Object>`), а для вариантности ввели wildcards. Плюс проверка типа на каждой записи — это не только риск, но и реальный performance-overhead.\n\n---\n\n" +
        "Covariance — `String[]` is a subtype of `Object[]`. You can assign `String[]` to a variable of type `Object[]` and then store any `Object` in it. The JVM must type-check **every store** into an object array — else it throws `ArrayStoreException` at runtime:\n\n" +
        "```java\n" +
        "String[] strings = {\"a\"};\n" +
        "Object[] objects = strings;\n" +
        "objects[0] = 42;  // compiles, ArrayStoreException at runtime\n" +
        "```\n\n" +
        "Covariance existed in Java 1.0 as a workaround for generic programming before generics existed. When generics landed in Java 5 they were made **invariant** (`List<String>` is not a subtype of `List<Object>`) and wildcards were introduced for variance. Plus, the per-store type check is not just a risk but a real performance overhead.",
      difficulty: "mid",
    },
    {
      id: "2-5-q2",
      q:
        "Почему нельзя создать дженерик-массив (`new T[]`) в Java и как коллекции обходят это ограничение?\n\n---\n\n" +
        "Why can't you create a generic array (`new T[]`) in Java, and how do collections work around it?",
      a:
        "Дженерики стираются в рантайме — `T` превращается в `Object`. Поэтому `new T[10]` фактически стал бы `new Object[10]`, и корректную проверку `ArrayStoreException` выполнить нельзя. Если бы такое было разрешено, через ковариантность массивов можно было бы поместить не тот тип — типобезопасность сломалась бы.\n\n" +
        "**`ArrayList` обходит** это хранением внутреннего `Object[]` и cast к `T` при чтении. Cast unchecked, но безопасен, потому что через типизированное API в массив попадает только правильный тип.\n\n" +
        "`Arrays.copyOf()` и `Array.newInstance()` используют reflection для создания правильно типизированного массива — если доступен `Class<T>`-токен.\n\n" +
        "Стандартный паттерн в самом JDK:\n\n" +
        "```java\n" +
        "@SuppressWarnings(\"unchecked\")\n" +
        "T[] arr = (T[]) new Object[size];\n" +
        "```\n\n---\n\n" +
        "Generics are erased at runtime — `T` becomes `Object`. So `new T[10]` would really be `new Object[10]`, and the proper `ArrayStoreException` check can't be performed. If it were allowed, array covariance would let you store the wrong type with no runtime check — type safety would collapse.\n\n" +
        "**`ArrayList` works around this** by holding an internal `Object[]` and casting to `T` on read. The cast is unchecked but safe because only correctly-typed elements enter through the typed API.\n\n" +
        "`Arrays.copyOf()` and `Array.newInstance()` use reflection to create a properly typed array — if a `Class<T>` token is available.\n\n" +
        "The standard pattern, used inside the JDK itself:\n\n" +
        "```java\n" +
        "@SuppressWarnings(\"unchecked\")\n" +
        "T[] arr = (T[]) new Object[size];\n" +
        "```",
      difficulty: "senior",
    },
  ],
  tip:
    "`Arrays.asList(int[])` создаёт `List<int[]>` с одним элементом, а не `List<Integer>`. Для примитивов используйте `Arrays.stream(intArray).boxed().toList()` или `IntStream.of(intArray).boxed().toList()`.\n\n---\n\n" +
    "`Arrays.asList(int[])` returns a `List<int[]>` with one element, not a `List<Integer>`. For primitives use `Arrays.stream(intArray).boxed().toList()` or `IntStream.of(intArray).boxed().toList()`.",
  springConnection: null,
};
