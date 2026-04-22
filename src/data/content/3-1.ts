import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-1",
  blockId: 3,
  title: "Classes & Objects",
  summary:
    "Класс — шаблон (контракт) с полями и методами; объект — экземпляр класса, выделенный в куче во время исполнения. Ссылочная переменная лежит на стеке, сам объект — в куче. Java **всегда** передаёт параметры по значению — для объектов копируется ссылка, не сам объект. Четыре принципа ООП: абстракция, инкапсуляция, наследование, полиморфизм.\n\n---\n\n" +
    "A class is a compile-time blueprint with fields and methods; an object is a runtime instance allocated on the heap. The reference variable lives on the stack; the object lives on the heap. Java **always** passes by value — for objects, the reference is copied, not the object itself. The four OOP pillars: abstraction, encapsulation, inheritance, polymorphism.",
  deepDive:
    "## Класс vs объект vs экземпляр\n\n" +
    "- **Класс** — compile-time конструкция. `.class`-файл содержит constant pool, дескрипторы полей, байт-код методов, access flags. JVM загружает класс через ClassLoader, верифицирует и связывает его **один раз**.\n" +
    "- **Объект** — runtime-инстанс. При `new MyClass()` JVM выделяет память на куче под поля экземпляра плюс заголовок объекта.\n" +
    "- **Экземпляр** — то же, что объект. Ссылка на экземпляр живёт на стеке (или внутри другого объекта, если это поле).\n\n" +
    "## Layout объекта на HotSpot (64-bit, compressed oops)\n\n" +
    "| Часть | Размер | Описание |\n" +
    "|-------|--------|----------|\n" +
    "| Mark word | 8 байт | hashCode, GC age, lock state, biased locking |\n" +
    "| Klass pointer | 4 байта | compressed, указывает на метаданные в Metaspace |\n" +
    "| Instance fields | N байт | поля экземпляра с field reordering и padding |\n" +
    "| Array length | 4 байта | только для массивов, после заголовка |\n" +
    "| Padding | 0-7 байт | выравнивание до 8-байтной границы |\n\n" +
    "Даже пустой `new Object()` занимает **16 байт** (12 заголовок + 4 padding).\n\n" +
    "Отключение compressed oops (`-XX:-UseCompressedOops`) делает klass pointer 8 байт → overhead растёт.\n\n" +
    "## Четыре принципа ООП\n\n" +
    "- **Абстракция** — выделение ключевых характеристик, скрытие деталей реализации. Через `abstract` классы и интерфейсы.\n" +
    "- **Инкапсуляция** — объединение данных и методов, защита состояния через модификаторы доступа. Поля `private`, доступ через getter/setter (или вообще без них — для immutable).\n" +
    "- **Наследование** — новые классы на основе существующих. Java поддерживает только **одиночное** наследование классов (но множественную реализацию интерфейсов).\n" +
    "- **Полиморфизм** — одна сущность в разных формах: overload (compile-time, по сигнатуре) и override (runtime, виртуальная диспетчеризация).\n\n" +
    "## Identity vs equality\n\n" +
    "- `==` — сравнение **ссылок** (указатели).\n" +
    "- `.equals()` — сравнение **значения** (если переопределено).\n\n" +
    "Дефолтный `Object.equals()` эквивалентен `==` — проверяет identity. Это **почти никогда** не то, чего хочет доменный код.\n\n" +
    "> [!gotcha]\n" +
    "> Контракт `equals()` / `hashCode()`: равные объекты **обязаны** иметь одинаковый `hashCode`. Нарушение приводит к тому, что объект «теряется» в HashMap — положили по ключу, а `get` возвращает null. Всегда переопределяйте обе вместе.\n\n" +
    "## Передача по значению — всегда\n\n" +
    "Java **не имеет** pass-by-reference. Для ссылочных типов **копируется указатель** (сам указатель — значение):\n\n" +
    "```java\n" +
    "void tryReassign(Employee e) {\n" +
    "    e = new Employee(\"Ghost\", 0);   // меняем локальную копию — вызывающий не видит\n" +
    "}\n\n" +
    "void mutate(Employee e) {\n" +
    "    e.salary = 999_999;              // мутируем объект — вызывающий видит\n" +
    "}\n" +
    "```\n\n" +
    "**Переприсвоение параметра** не влияет на вызывающего. **Мутация объекта** через скопированную ссылку видна всем, у кого есть ссылка на тот же объект.\n\n" +
    "## Жизненный цикл объекта\n\n" +
    "1. **Аллокация** на куче (обычно Eden в Young Gen).\n" +
    "2. **Инициализация**: поля → init-блоки → конструктор, от предка к потомку.\n" +
    "3. **Использование** — через достижимые ссылки.\n" +
    "4. **Unreachable** — когда сильных ссылок не осталось, объект становится eligible for GC.\n" +
    "5. **Reclaim** — GC освобождает память (в будущем цикле).\n\n" +
    "Между «unreachable» и «reclaim» объект может быть soft/weak/phantom-reachable:\n\n" +
    "- **SoftReference** — GC собирает, только если нужна память (кэш).\n" +
    "- **WeakReference** — GC собирает при следующем цикле (WeakHashMap).\n" +
    "- **PhantomReference** — объект уже собран, но не освобождён; используется для cleanup actions.\n\n" +
    "> [!production]\n" +
    "> `finalize()` **deprecated с Java 9**. Используйте `try-with-resources` и `java.lang.ref.Cleaner`. Finalizer выполняется в недетерминированном порядке, может «воскресить» объект (вернуть ссылку в поле), запускается отдельным потоком — источник утечек и непредсказуемого поведения.\n\n" +
    "## Nested и inner classes\n\n" +
    "- **Static nested class** — не держит ссылку на enclosing instance. Предпочтительный вариант.\n" +
    "- **Inner class** (non-static) — **неявно хранит** ссылку на enclosing instance. Если inner class переживёт outer (листенер, колбек в другом потоке) — **memory leak**.\n" +
    "- **Local class** — объявлен внутри метода. Может захватывать effectively-final локальные переменные.\n" +
    "- **Anonymous class** — локальный с одноразовой реализацией. До Java 8 — де-факто реализация лямбд; сейчас их вытеснили лямбды для функциональных интерфейсов.\n\n---\n\n" +
    "## Class vs object vs instance\n\n" +
    "- **Class** — a compile-time construct. The `.class` file contains the constant pool, field descriptors, method bytecode, access flags. The JVM loads a class via a ClassLoader, verifies and links it **once**.\n" +
    "- **Object** — a runtime instance. On `new MyClass()` the JVM allocates heap memory for instance fields plus the object header.\n" +
    "- **Instance** — same as object. The reference to the instance lives on the stack (or inside another object, if it is a field).\n\n" +
    "## Object layout on HotSpot (64-bit, compressed oops)\n\n" +
    "| Part | Size | Description |\n" +
    "|------|------|-------------|\n" +
    "| Mark word | 8 bytes | hashCode, GC age, lock state, biased locking |\n" +
    "| Klass pointer | 4 bytes | compressed, points to Metaspace metadata |\n" +
    "| Instance fields | N bytes | fields with reordering and padding |\n" +
    "| Array length | 4 bytes | arrays only, after the header |\n" +
    "| Padding | 0-7 bytes | aligned to 8-byte boundaries |\n\n" +
    "Even an empty `new Object()` consumes **16 bytes** (12 header + 4 padding).\n\n" +
    "Turning off compressed oops (`-XX:-UseCompressedOops`) makes the klass pointer 8 bytes → overhead grows.\n\n" +
    "## The four OOP pillars\n\n" +
    "- **Abstraction** — identify the essentials, hide implementation details. Through `abstract` classes and interfaces.\n" +
    "- **Encapsulation** — bundle data with methods and protect state through access modifiers. `private` fields, access via getters/setters (or none at all, for immutables).\n" +
    "- **Inheritance** — new classes built on existing ones. Java supports only **single** class inheritance (but multiple interface implementation).\n" +
    "- **Polymorphism** — one entity, many forms: overloading (compile-time, by signature) and overriding (runtime, virtual dispatch).\n\n" +
    "## Identity vs equality\n\n" +
    "- `==` — compares **references** (pointers).\n" +
    "- `.equals()` — compares **value** (if overridden).\n\n" +
    "The default `Object.equals()` is equivalent to `==` — it checks identity. That is **almost never** what domain code wants.\n\n" +
    "> [!gotcha]\n" +
    "> The `equals()` / `hashCode()` contract: equal objects **must** have the same `hashCode`. Violating this causes the object to be \"lost\" inside a HashMap — you put it under a key, and `get` returns null. Always override both together.\n\n" +
    "## Pass-by-value — always\n\n" +
    "Java **does not have** pass-by-reference. For reference types, the **pointer is copied** (the pointer itself is a value):\n\n" +
    "```java\n" +
    "void tryReassign(Employee e) {\n" +
    "    e = new Employee(\"Ghost\", 0);   // rebinding the local copy — caller doesn't see\n" +
    "}\n\n" +
    "void mutate(Employee e) {\n" +
    "    e.salary = 999_999;              // mutating the object — caller sees\n" +
    "}\n" +
    "```\n\n" +
    "**Reassigning the parameter** has no effect on the caller. **Mutating the object** through the copied reference is visible to everyone holding a reference to the same object.\n\n" +
    "## Object lifecycle\n\n" +
    "1. **Allocation** on the heap (typically Eden in Young Gen).\n" +
    "2. **Initialisation**: fields → init blocks → constructor, parent to child.\n" +
    "3. **Use** — through reachable references.\n" +
    "4. **Unreachable** — when no strong references remain, the object is eligible for GC.\n" +
    "5. **Reclaim** — GC frees the memory (in a future cycle).\n\n" +
    "Between \"unreachable\" and \"reclaim\" an object can be soft/weak/phantom-reachable:\n\n" +
    "- **SoftReference** — GC reclaims only under memory pressure (caches).\n" +
    "- **WeakReference** — GC reclaims at the next cycle (WeakHashMap).\n" +
    "- **PhantomReference** — the object is already collected but not yet freed; used for cleanup actions.\n\n" +
    "> [!production]\n" +
    "> `finalize()` is **deprecated since Java 9**. Use `try-with-resources` and `java.lang.ref.Cleaner`. Finalizers run in non-deterministic order, can \"resurrect\" an object (re-stash its reference into a field), and run on a separate thread — a source of leaks and unpredictable behaviour.\n\n" +
    "## Nested and inner classes\n\n" +
    "- **Static nested class** — holds no reference to the enclosing instance. The preferred form.\n" +
    "- **Inner class** (non-static) — **implicitly holds** a reference to the enclosing instance. If it outlives the outer (listener, callback on another thread) → **memory leak**.\n" +
    "- **Local class** — declared inside a method. Can capture effectively-final locals.\n" +
    "- **Anonymous class** — a local with a one-off implementation. Pre-Java-8 it was the de-facto lambda; nowadays lambdas win for functional interfaces.",
  code: `// Demonstrates class structure, object creation, and reference semantics
public class Employee {
    // Instance fields (stored on the heap per object)
    private final String name;
    private double salary;

    // Static field (stored in metaspace, shared across all instances)
    private static int headcount = 0;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
        headcount++;
    }

    // Passing references by value demo
    public static void tryReassign(Employee e) {
        e = new Employee("Ghost", 0); // caller's reference is unchanged
    }

    public static void mutate(Employee e) {
        e.salary = 999_999;           // caller sees the mutation
    }

    public static void main(String[] args) {
        Employee a = new Employee("Alice", 80_000);
        Employee b = a;               // both point to the same heap object

        System.out.println(a == b);   // true  (same reference)

        tryReassign(a);
        System.out.println(a.name);   // "Alice" (unchanged)

        mutate(a);
        System.out.println(a.salary); // 999999.0 (mutated via copied ref)
        System.out.println(b.salary); // 999999.0 (b points to same object)
    }
}`,
  interviewQs: [
    {
      id: "3-1-q0",
      q:
        "В чём разница между классом и объектом в Java?\n\n---\n\n" +
        "What's the difference between a class and an object in Java?",
      a:
        "- **Класс** — compile-time шаблон, `.class`-файл с определениями полей, байт-кодом методов и метаданными. Загружается ClassLoader'ом один раз.\n" +
        "- **Объект** — runtime инстанс, выделенный в куче при `new`. Из одного класса можно создать много объектов.\n" +
        "- Ссылочная переменная (стек) указывает на объект (куча).\n\n" +
        "Класс живёт в Metaspace; объект — в Heap; ссылка на объект — в стеке или внутри другого объекта.\n\n---\n\n" +
        "- **Class** — a compile-time template, a `.class` file with field definitions, method bytecode, and metadata. Loaded once by a ClassLoader.\n" +
        "- **Object** — a runtime instance allocated on the heap at `new`. Many objects can come from one class.\n" +
        "- The reference variable (stack) points to the object (heap).\n\n" +
        "The class lives in Metaspace; the object lives in the Heap; the reference lives on the stack or inside another object.",
      difficulty: "junior",
    },
    {
      id: "3-1-q1",
      q:
        "Какие четыре принципа ООП? Объясните каждый.\n\n---\n\n" +
        "What are the four pillars of OOP? Explain each.",
      a:
        "- **Абстракция** — выделяем существенное, скрываем детали. Интерфейсы и `abstract` классы позволяют работать через контракт, не зная реализации.\n" +
        "- **Инкапсуляция** — объединяем данные и методы, защищаем состояние. Поля `private`, доступ через методы. Доводим до крайности — immutable объекты без сеттеров вообще.\n" +
        "- **Наследование** — новый класс использует функциональность существующего. Java — **одиночное** наследование классов, множественная реализация интерфейсов.\n" +
        "- **Полиморфизм** — одна сущность в разных формах: overload (по сигнатуре, compile-time) и override (виртуальная диспетчеризация, runtime).\n\n---\n\n" +
        "- **Abstraction** — pick the essentials, hide the details. Interfaces and `abstract` classes let you code against a contract without knowing the implementation.\n" +
        "- **Encapsulation** — bundle data with methods and protect state. `private` fields, access via methods. Taken to its extreme — immutable objects with no setters at all.\n" +
        "- **Inheritance** — a new class reuses an existing one. Java supports **single** class inheritance, multiple interface implementation.\n" +
        "- **Polymorphism** — one entity in many forms: overloading (by signature, compile-time) and overriding (virtual dispatch, runtime).",
      difficulty: "junior",
    },
    {
      id: "3-1-q2",
      q:
        "Java передаёт параметры по ссылке или по значению? Объясните на примере.\n\n---\n\n" +
        "Is Java pass-by-reference or pass-by-value? Explain with an example.",
      a:
        "Java **всегда pass-by-value**. Для примитивов копируется значение. Для объектов копируется **ссылка** (указатель — тоже значение).\n\n" +
        "Внутри метода переприсвоение параметра (`e = new Employee(...)`) не влияет на вызывающего. Но мутация объекта через скопированную ссылку (`e.salary = 999_999`) видна всем, у кого есть ссылка на тот же объект.\n\n" +
        "```java\n" +
        "Employee a = new Employee(\"Alice\", 80_000);\n" +
        "tryReassign(a);      // внутри e = new Employee(...) — a не меняется\n" +
        "mutate(a);           // внутри e.salary = ... — a.salary меняется\n" +
        "```\n\n" +
        "Распространённое заблуждение: «передача ссылки» ≠ pass-by-reference. Java передаёт значение ссылки, а не саму переменную.\n\n---\n\n" +
        "Java is **always pass-by-value**. For primitives, the value is copied. For objects, the **reference** is copied (a pointer is also a value).\n\n" +
        "Inside a method, reassigning the parameter (`e = new Employee(...)`) has no effect on the caller. But mutating the object through the copied reference (`e.salary = 999_999`) is visible to everyone holding a reference to the same object.\n\n" +
        "```java\n" +
        "Employee a = new Employee(\"Alice\", 80_000);\n" +
        "tryReassign(a);      // inside: e = new Employee(...) — a unchanged\n" +
        "mutate(a);           // inside: e.salary = ... — a.salary changes\n" +
        "```\n\n" +
        "A common confusion: \"passing a reference\" ≠ pass-by-reference. Java passes the reference's value, not the variable itself.",
      difficulty: "mid",
    },
    {
      id: "3-1-q3",
      q:
        "Объясните layout Java-объекта на HotSpot и почему пустой `new Object()` занимает 16 байт.\n\n---\n\n" +
        "Explain the layout of a Java object on HotSpot and why an empty `new Object()` takes 16 bytes.",
      a:
        "На HotSpot 64-bit с compressed oops объект имеет:\n\n" +
        "- **Mark word** — 8 байт (hashCode, GC age, lock state, biased locking).\n" +
        "- **Klass pointer** — 4 байта (compressed; указывает на метаданные в Metaspace).\n" +
        "- **Instance fields** — N байт с field reordering и padding.\n" +
        "- **Array length** — 4 байта, только для массивов.\n" +
        "- **Padding** — выравнивание до 8-байтной границы.\n\n" +
        "Заголовок: 8 + 4 = **12 байт**. `new Object()` полей не имеет, но дополняется до 16 (8-byte alignment). Отключение compressed oops (`-XX:-UseCompressedOops`) делает klass pointer 8 байт — объект становится ~24 байта.\n\n" +
        "Для массива добавьте ещё 4 байта на `length`, плюс содержимое.\n\n" +
        "Это и причина, почему `List<Integer>` такой жирный по сравнению с `int[]` — каждый `Integer` — 16-байтный объект ради 4 байт данных.\n\n---\n\n" +
        "On HotSpot 64-bit with compressed oops an object has:\n\n" +
        "- **Mark word** — 8 bytes (hashCode, GC age, lock state, biased locking).\n" +
        "- **Klass pointer** — 4 bytes (compressed; points to Metaspace metadata).\n" +
        "- **Instance fields** — N bytes with reordering and padding.\n" +
        "- **Array length** — 4 bytes, arrays only.\n" +
        "- **Padding** — aligned to 8-byte boundaries.\n\n" +
        "The header is 8 + 4 = **12 bytes**. `new Object()` has no fields but is padded up to 16 (8-byte alignment). With compressed oops off (`-XX:-UseCompressedOops`) the klass pointer is 8 bytes — the object becomes ~24 bytes.\n\n" +
        "For an array, add 4 more bytes for `length`, plus content.\n\n" +
        "This is why `List<Integer>` is so fat compared to `int[]` — every `Integer` is a 16-byte object for 4 bytes of data.",
      difficulty: "senior",
    },
    {
      id: "3-1-q4",
      q:
        "Какая разница между static nested и inner class, и в чём риск inner-классов?\n\n---\n\n" +
        "What's the difference between a static nested class and an inner class, and what's the risk of inner classes?",
      a:
        "- **Static nested class** — обычный класс, вложенный в другой. **Не** хранит ссылку на enclosing instance. Может быть инстанцирован без объекта outer-класса.\n" +
        "- **Inner (non-static) class** — неявно держит ссылку на enclosing instance через скрытое поле `this$0`. Инстанцируется только через объект outer-класса.\n\n" +
        "**Риск inner-класса** — memory leak. Если inner class передан как listener/callback и переживёт outer, ссылка `this$0` не даёт GC собрать outer → утекает всё содержимое outer-класса.\n\n" +
        "Классика: inner-`Runnable`, отправленный в `ExecutorService` с длинным временем жизни. Outer-класс может быть Activity / ApplicationContext / service — и вся графы объектов за ним держится живой.\n\n" +
        "**Правило**: используйте `static nested class` по умолчанию. Делайте inner, только если реально нужен доступ к полям enclosing instance.\n\n---\n\n" +
        "- **Static nested class** — a regular class nested inside another. Does **not** hold a reference to the enclosing instance. Can be instantiated without an outer-class object.\n" +
        "- **Inner (non-static) class** — implicitly holds a reference to the enclosing instance through a hidden `this$0` field. Can only be instantiated via an outer-class object.\n\n" +
        "**The risk of an inner class** is a memory leak. If the inner class is passed as a listener/callback and outlives the outer, the `this$0` reference keeps GC from reclaiming the outer → everything the outer transitively holds leaks with it.\n\n" +
        "Classic: an inner `Runnable` submitted to a long-lived `ExecutorService`. The outer might be an Activity / ApplicationContext / service — and the entire object graph it holds stays alive.\n\n" +
        "**Rule**: default to `static nested class`. Make it inner only when you genuinely need access to enclosing-instance state.",
      difficulty: "senior",
    },
  ],
  tip:
    "Когда интервьюер спрашивает «передаётся ли в Java по ссылке» — нарисуйте стек-кучу диаграмму с двумя переменными-ссылками на один и тот же heap-объект. Это сразу показывает, что вы понимаете механику.\n\n---\n\n" +
    "When an interviewer asks about pass-by-value, draw a stack/heap diagram with two reference variables pointing to the same heap object — it instantly proves you understand the mechanics.",
  springConnection: {
    concept: "Classes & Objects",
    springFeature: "Spring Bean Lifecycle",
    explanation:
      "Spring управляет созданием объектов через IoC-контейнер. Вместо `new` вы объявляете бины (классы), а Spring инстанцирует, конфигурирует и связывает их.\n\n" +
      "Понимание того, как создаются и ссылаются объекты, критично для scope'ов:\n" +
      "- **singleton** — один инстанс на ApplicationContext; все инъекции получают ту же ссылку.\n" +
      "- **prototype** — новый heap-объект на каждую инъекцию; GC соберёт, когда ссылки отпустят.\n" +
      "- **request / session** — привязка жизненного цикла к HTTP-границам.\n\n" +
      "Типичный баг: singleton зависит от request-scope бина напрямую — захватывает одну копию навсегда. Решается scoped proxy.\n\n---\n\n" +
      "Spring manages object creation through an IoC container. Instead of calling `new`, you declare beans (classes) and Spring instantiates, configures and wires them.\n\n" +
      "Understanding how objects are created and referenced is essential to scopes:\n" +
      "- **singleton** — one instance per ApplicationContext; every injection gets the same reference.\n" +
      "- **prototype** — a new heap object per injection; GC reclaims once references drop.\n" +
      "- **request / session** — lifecycle tied to HTTP boundaries.\n\n" +
      "A classic bug: a singleton depends directly on a request-scoped bean — it captures one copy forever. Fixed with a scoped proxy.",
  },
};
