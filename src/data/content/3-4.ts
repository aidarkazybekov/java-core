import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-4",
  blockId: 3,
  title: "Polymorphism",
  summary:
    "Полиморфизм — возможность одной сущности принимать разные формы. Три вида в Java: **ad-hoc (статический)** — перегрузка методов; **параметрический** — дженерики; **динамический (субтиповой)** — переопределение методов с виртуальной диспетчеризацией через vtable.\n\n---\n\n" +
    "Polymorphism is the ability of one entity to take many forms. Three kinds in Java: **ad-hoc (static)** — method overloading; **parametric** — generics; **dynamic (subtype)** — method overriding via virtual dispatch through the vtable.",
  deepDive:
    "## Три вида полиморфизма\n\n" +
    "- **Ad-hoc (compile-time)** — **перегрузка** методов. Несколько методов с одним именем, разные параметры. Компилятор выбирает нужный по типам аргументов.\n" +
    "- **Параметрический** — дженерики. `List<T>` один и тот же класс, но специализирован под разные типы в compile time.\n" +
    "- **Subtype / Dynamic** — **переопределение**. Код работает против parent-ссылки, JVM выбирает реализацию по runtime-типу объекта.\n\n" +
    "## Перегрузка vs Переопределение\n\n" +
    "| | Overload | Override |\n" +
    "|--|----------|----------|\n" +
    "| Когда | Compile-time | Runtime |\n" +
    "| Где | В одном классе (или наследуется) | В подклассе |\n" +
    "| Что меняется | Параметры | Реализация (та же сигнатура) |\n" +
    "| Диспетчеризация | Статическая | Динамическая (vtable) |\n" +
    "| `@Override` | Нет | Да |\n\n" +
    "**Сигнатура метода** = имя + список параметров (типы, порядок). **Не** входят в сигнатуру: возвращаемый тип, checked-исключения, модификаторы.\n\n" +
    "## Virtual method dispatch — как JVM это делает\n\n" +
    "Каждый класс имеет **vtable** (virtual method table), построенную при загрузке класса. Это массив указателей на реализации методов. Override меняет запись в vtable на реализацию потомка.\n\n" +
    "На call-site:\n" +
    "1. JVM читает klass pointer из заголовка объекта.\n" +
    "2. Находит vtable через метаданные класса в Metaspace.\n" +
    "3. Прыгает на метод по фиксированному индексу.\n\n" +
    "HotSpot оптимизирует дальше:\n" +
    "- **Monomorphic inline cache** — вызов всегда видит один тип → метод инлайнится напрямую.\n" +
    "- **Bimorphic** — два типа → ветка-if.\n" +
    "- **Megamorphic** — три+ типов → полный vtable lookup.\n\n" +
    "Deoptimization случается, если загрузился новый подкласс, ломающий monomorphic-предположение.\n\n" +
    "## Правила разрешения перегрузки\n\n" +
    "Компилятор ищет **наиболее специфичный** применимый метод. Приоритет (для Java 5+ с autoboxing):\n\n" +
    "1. **Exact match / widening** (без boxing, без varargs).\n" +
    "2. **Autoboxing** (если widening не подошёл).\n" +
    "3. **Varargs** (в последнюю очередь).\n\n" +
    "```java\n" +
    "static void f(long x)     {}\n" +
    "static void f(Integer x)  {}\n" +
    "static void f(Object... x) {}\n\n" +
    "int i = 42;\n" +
    "f(i);  // вызывается f(long) — widening побеждает boxing\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> Добавление перегрузки может скрытно изменить диспетчеризацию существующих вызовов. Если между `Integer` и `long` появится `Object...` — поведение не поменяется, но появление `Object` перегрузки может поменять resolution для некоторых типов.\n\n" +
    "## Ковариантные возвращаемые типы (Java 5+)\n\n" +
    "Override может возвращать **более узкий** тип, чем родитель:\n\n" +
    "```java\n" +
    "class Shape { Shape copy() { ... } }\n" +
    "class Circle extends Shape {\n" +
    "    @Override Circle copy() { ... }  // OK, covariant return\n" +
    "}\n" +
    "```\n\n" +
    "**Контравариантных параметров** Java **не** поддерживает: изменение типа параметра создаст перегрузку, не override — типичная ошибка.\n\n" +
    "## Bridge-методы\n\n" +
    "Компилятор генерирует **синтетические bridge-методы** для сохранения полиморфизма после **type erasure** дженериков и для covariant return types.\n\n" +
    "Пример:\n" +
    "```java\n" +
    "class StringList extends ArrayList<String> {\n" +
    "    @Override public String get(int i) { ... }  // возвращает String\n" +
    "}\n" +
    "```\n\n" +
    "После erasure родительский `get` возвращает `Object`. Компилятор создаёт bridge-метод `Object get(int)`, который делегирует в `String get(int)` — сохраняя vtable-контракт.\n\n" +
    "Bridge-методы видны в рефлексии: `Method.isBridge()`. Frameworks, обходящие declared methods, должны их учитывать.\n\n" +
    "## Liskov Substitution Principle\n\n" +
    "LSP: любой код, работающий с `Parent`, должен продолжать работать, если подставить `Child`. Подкласс **не может**:\n" +
    "- Усиливать precondition (принимать меньше входов).\n" +
    "- Ослаблять postcondition (гарантировать меньше на выходе).\n" +
    "- Бросать неожиданные исключения.\n\n" +
    "Нарушение LSP — частый баг в иерархиях наследования (`Square extends Rectangle` классический пример).\n\n---\n\n" +
    "## Three kinds of polymorphism\n\n" +
    "- **Ad-hoc (compile-time)** — method **overloading**. Several methods with the same name, different parameters. The compiler picks the right one by argument types.\n" +
    "- **Parametric** — generics. `List<T>` is a single class specialised per type at compile time.\n" +
    "- **Subtype / Dynamic** — **overriding**. Code works against a parent reference, the JVM picks the implementation by the object's runtime type.\n\n" +
    "## Overloading vs Overriding\n\n" +
    "| | Overload | Override |\n" +
    "|--|----------|----------|\n" +
    "| When | Compile-time | Runtime |\n" +
    "| Where | Same class (or inherited) | In the subclass |\n" +
    "| What changes | Parameters | Implementation (same signature) |\n" +
    "| Dispatch | Static | Dynamic (vtable) |\n" +
    "| `@Override` | No | Yes |\n\n" +
    "**Method signature** = name + parameter list (types, order). **Not** in the signature: return type, checked exceptions, modifiers.\n\n" +
    "## Virtual method dispatch — how the JVM does it\n\n" +
    "Every class has a **vtable** built at class load. It's an array of pointers to method implementations. An override replaces the vtable entry with the subclass's implementation.\n\n" +
    "At the call site:\n" +
    "1. The JVM reads the klass pointer from the object header.\n" +
    "2. Locates the vtable via the class metadata in Metaspace.\n" +
    "3. Jumps to the method at a fixed index.\n\n" +
    "HotSpot optimises further:\n" +
    "- **Monomorphic inline cache** — call always sees one type → method inlined directly.\n" +
    "- **Bimorphic** — two types → an if-branch.\n" +
    "- **Megamorphic** — three or more → full vtable lookup.\n\n" +
    "Deoptimization happens if a new subclass loads that breaks the monomorphic assumption.\n\n" +
    "## Overload resolution rules\n\n" +
    "The compiler picks the **most specific** applicable method. Priority (Java 5+ with autoboxing):\n\n" +
    "1. **Exact match / widening** (no boxing, no varargs).\n" +
    "2. **Autoboxing** (if widening didn't apply).\n" +
    "3. **Varargs** (last resort).\n\n" +
    "```java\n" +
    "static void f(long x)     {}\n" +
    "static void f(Integer x)  {}\n" +
    "static void f(Object... x) {}\n\n" +
    "int i = 42;\n" +
    "f(i);  // calls f(long) — widening beats boxing\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> Adding an overload can silently change dispatch for existing call sites. Ask whether you're introducing a more-specific signature that may win over the one you used to rely on.\n\n" +
    "## Covariant return types (Java 5+)\n\n" +
    "An override can return a **narrower** type than the parent:\n\n" +
    "```java\n" +
    "class Shape { Shape copy() { ... } }\n" +
    "class Circle extends Shape {\n" +
    "    @Override Circle copy() { ... }  // OK, covariant return\n" +
    "}\n" +
    "```\n\n" +
    "**Contravariant parameters** aren't supported: changing a parameter type creates an overload, not an override — a common mistake.\n\n" +
    "## Bridge methods\n\n" +
    "The compiler generates **synthetic bridge methods** to preserve polymorphism after generic **type erasure** and for covariant returns.\n\n" +
    "Example:\n" +
    "```java\n" +
    "class StringList extends ArrayList<String> {\n" +
    "    @Override public String get(int i) { ... }  // returns String\n" +
    "}\n" +
    "```\n\n" +
    "After erasure the parent's `get` returns `Object`. The compiler emits a bridge method `Object get(int)` that delegates to `String get(int)` — preserving the vtable contract.\n\n" +
    "Bridge methods are visible to reflection: `Method.isBridge()`. Frameworks that enumerate declared methods must handle them.\n\n" +
    "## Liskov Substitution Principle\n\n" +
    "LSP: any code that works with `Parent` must keep working if you substitute a `Child`. A subclass **cannot**:\n" +
    "- Strengthen preconditions (accept fewer inputs).\n" +
    "- Weaken postconditions (guarantee less output).\n" +
    "- Throw unexpected exceptions.\n\n" +
    "LSP violations are a frequent bug in inheritance hierarchies (`Square extends Rectangle` is the canonical example).",
  code: `public abstract class Shape {
    public abstract double area();

    @Override
    public String toString() {
        return getClass().getSimpleName() + " area=" + area();
    }
}

public class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() { return Math.PI * radius * radius; }
}

public class Rectangle extends Shape {
    private final double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }

    @Override
    public double area() { return w * h; }
}

// --- Overloading resolution demo ---
public class OverloadDemo {
    static String describe(Object o)  { return "Object";  }
    static String describe(String s)  { return "String";  }
    static String describe(long l)    { return "long";    }
    static String describe(Integer i) { return "Integer"; }

    public static void main(String[] args) {
        // Runtime polymorphism
        Shape s = new Circle(5);
        System.out.println(s);         // "Circle area=78.539..."
        s = new Rectangle(3, 4);
        System.out.println(s);         // "Rectangle area=12.0"

        // Overloading resolution
        int x = 42;
        System.out.println(describe(x));          // "long" (widening beats boxing)
        System.out.println(describe("hello"));    // "String" (most specific)
        System.out.println(describe((Object)"a"));// "Object" (explicit cast)
    }
}`,
  interviewQs: [
    {
      id: "3-4-q0",
      q:
        "В чём разница между overloading и overriding?\n\n---\n\n" +
        "What's the difference between method overloading and method overriding?",
      a:
        "- **Overloading (перегрузка)** — compile-time полиморфизм. Одно имя метода, разные параметры. Компилятор разрешает вызов по типам аргументов.\n" +
        "- **Overriding (переопределение)** — runtime полиморфизм. Подкласс переопределяет метод родителя с **той же сигнатурой**. JVM разрешает вызов по runtime-типу объекта через vtable.\n\n" +
        "Overloading — в одном классе (или наследуется). Overriding — между родителем и потомком.\n\n" +
        "В сигнатуру метода входят имя и параметры; возвращаемый тип, исключения и модификаторы — **не** входят. Поэтому нельзя перегрузить по возвращаемому типу или списку исключений.\n\n---\n\n" +
        "- **Overloading** — compile-time polymorphism. Same method name, different parameter lists. The compiler resolves the call by argument types.\n" +
        "- **Overriding** — runtime polymorphism. A subclass redefines a parent's method with the **same signature**. The JVM resolves the call by the object's runtime type via the vtable.\n\n" +
        "Overloading — within one class (or inherited). Overriding — between parent and child.\n\n" +
        "A method signature includes name and parameters; return type, exceptions, and modifiers are **not** part of it. So you can't overload by return type or exception list.",
      difficulty: "junior",
    },
    {
      id: "3-4-q1",
      q:
        "Как JVM внутри выполняет dynamic method dispatch?\n\n---\n\n" +
        "How does the JVM internally perform dynamic method dispatch?",
      a:
        "У каждого класса при загрузке строится **vtable** (virtual method table) — массив указателей на реализации методов. Когда подкласс переопределяет метод, его запись в vtable указывает на реализацию потомка.\n\n" +
        "На call-site:\n" +
        "1. JVM читает **klass pointer** из заголовка объекта.\n" +
        "2. Находит vtable через метаданные класса (Metaspace).\n" +
        "3. Прыгает на метод по фиксированному индексу.\n\n" +
        "**HotSpot оптимизирует**:\n" +
        "- **Monomorphic inline cache** — call-site всегда видит один тип → метод инлайнится напрямую.\n" +
        "- **Bimorphic** — два типа → `if`-ветка.\n" +
        "- **Megamorphic** — 3+ типов → полный vtable lookup.\n\n" +
        "Если загрузится новый подкласс, нарушающий monomorphic-предположение, происходит **deoptimization** — откат к интерпретатору и перекомпиляция без этой оптимизации. В графиках это видно как spike latency.\n\n---\n\n" +
        "Each class has a **vtable** (virtual method table) built at class load — an array of pointers to method implementations. When a subclass overrides a method, its vtable entry points to the subclass's implementation.\n\n" +
        "At the call site:\n" +
        "1. The JVM reads the **klass pointer** from the object header.\n" +
        "2. Finds the vtable via class metadata (Metaspace).\n" +
        "3. Jumps to the method at a fixed index.\n\n" +
        "**HotSpot optimisations**:\n" +
        "- **Monomorphic inline cache** — call site always sees one type → the method is inlined directly.\n" +
        "- **Bimorphic** — two types → an `if` branch.\n" +
        "- **Megamorphic** — 3+ types → full vtable lookup.\n\n" +
        "If a new subclass loads that breaks the monomorphic assumption, **deoptimization** triggers — fallback to the interpreter and recompilation without that optimisation. Shows up as a latency spike in dashboards.",
      difficulty: "mid",
    },
    {
      id: "3-4-q2",
      q:
        "Что такое bridge-методы и как они связаны с полиморфизмом?\n\n---\n\n" +
        "What are bridge methods and how do they relate to polymorphism?",
      a:
        "Bridge-методы — **синтетические** методы, которые компилятор генерирует для сохранения полиморфизма после **type erasure** дженериков и для **covariant return types**.\n\n" +
        "Пример с erasure:\n" +
        "```java\n" +
        "class StringList extends ArrayList<String> {\n" +
        "    @Override public String get(int i) { ... }\n" +
        "}\n" +
        "```\n\n" +
        "После erasure родительский `get` возвращает `Object`. Чтобы vtable-контракт работал, компилятор создаёт bridge:\n" +
        "```java\n" +
        "// синтетический, добавлен компилятором\n" +
        "public Object get(int i) { return this.<real>get(i); }\n" +
        "```\n\n" +
        "Bridge-методы можно обнаружить через `Method.isBridge()`. Frameworks, итерирующие `Class.getDeclaredMethods()`, должны их пропускать — иначе при построении прокси или сериализации получается дубликат.\n\n" +
        "Также генерируются при covariant return (подкласс возвращает более узкий тип).\n\n---\n\n" +
        "Bridge methods are **synthetic** methods the compiler generates to preserve polymorphism after generic **type erasure** and for **covariant return types**.\n\n" +
        "Erasure example:\n" +
        "```java\n" +
        "class StringList extends ArrayList<String> {\n" +
        "    @Override public String get(int i) { ... }\n" +
        "}\n" +
        "```\n\n" +
        "After erasure the parent's `get` returns `Object`. To maintain the vtable contract the compiler synthesises:\n" +
        "```java\n" +
        "// synthetic, added by the compiler\n" +
        "public Object get(int i) { return this.<real>get(i); }\n" +
        "```\n\n" +
        "Detect them with `Method.isBridge()`. Frameworks that iterate `Class.getDeclaredMethods()` must skip them — otherwise you get duplicates when building proxies or serialisers.\n\n" +
        "They also appear with covariant returns (a subclass narrows the return type).",
      difficulty: "senior",
    },
    {
      id: "3-4-q3",
      q:
        "Что такое Liskov Substitution Principle и приведите пример его нарушения.\n\n---\n\n" +
        "What is the Liskov Substitution Principle — give an example of a violation.",
      a:
        "LSP: любой код, работающий с `Parent`, должен корректно работать, если подставить `Child`.\n\n" +
        "Подкласс **не должен**:\n" +
        "- Усиливать precondition (требовать больше от входа).\n" +
        "- Ослаблять postcondition (гарантировать меньше на выходе).\n" +
        "- Бросать неожиданные исключения.\n\n" +
        "**Классический пример — Square extends Rectangle:**\n" +
        "```java\n" +
        "class Rectangle { int w, h; void setW(int w){this.w=w;} void setH(int h){this.h=h;} }\n" +
        "class Square extends Rectangle { void setW(int w){this.w=w; this.h=w;} void setH(int h){this.h=h; this.w=h;} }\n\n" +
        "void test(Rectangle r) { r.setW(5); r.setH(10); assert r.area() == 50; }\n" +
        "test(new Square());  // FAIL: area == 100, не 50\n" +
        "```\n\n" +
        "Код, полагающийся на независимость `setW` и `setH` (естественное предположение для Rectangle), ломается, когда передают Square.\n\n" +
        "**Правильно**: Rectangle и Square — параллельные классы с общим интерфейсом `Shape`, а не наследование. IS-A геометрически есть, но IS-A **поведения** — нет.\n\n---\n\n" +
        "LSP: any code that works with `Parent` must work correctly when a `Child` is substituted.\n\n" +
        "A subclass must not:\n" +
        "- Strengthen a precondition (require more from input).\n" +
        "- Weaken a postcondition (guarantee less in output).\n" +
        "- Throw unexpected exceptions.\n\n" +
        "**The canonical example — Square extends Rectangle:**\n" +
        "```java\n" +
        "class Rectangle { int w, h; void setW(int w){this.w=w;} void setH(int h){this.h=h;} }\n" +
        "class Square extends Rectangle { void setW(int w){this.w=w; this.h=w;} void setH(int h){this.h=h; this.w=h;} }\n\n" +
        "void test(Rectangle r) { r.setW(5); r.setH(10); assert r.area() == 50; }\n" +
        "test(new Square());  // FAIL: area == 100, not 50\n" +
        "```\n\n" +
        "Code assuming `setW` and `setH` are independent (natural for Rectangle) breaks when a Square is passed.\n\n" +
        "**Correct**: Rectangle and Square are parallel classes sharing a `Shape` interface, not inheritance. The geometric IS-A exists, but **behavioural** IS-A does not.",
      difficulty: "senior",
    },
  ],
  tip:
    "При объяснении полиморфизма на интервью всегда дайте конкретный пример: переменная объявлена parent-типом, хранит child-инстанс, вызываем переопределённый метод. Потом объясните, какая версия вызывается и почему.\n\n---\n\n" +
    "When explaining polymorphism in an interview, always give a concrete example: declare a variable with a parent type, assign a child instance, call an overridden method. Then explain which version runs and why.",
  springConnection: {
    concept: "Polymorphism",
    springFeature: "Spring Interface-Based Design",
    explanation:
      "Spring активно использует полиморфизм. Вы программируете против **интерфейсов** (`UserService`, `UserRepository`), а Spring инжектит конкретную реализацию в рантайме.\n\n" +
      "Это runtime-полиморфизм в чистом виде. Следствия:\n" +
      "- Реализации можно заменять (`JpaUserRepository` vs `MongoUserRepository`) без изменения потребителей.\n" +
      "- Моки в тестах работают благодаря тому, что потребители зависят от интерфейса, не от реализации.\n" +
      "- JDK dynamic proxy AOP работает только для бинов, реализующих интерфейс (для остальных — CGLIB, наследование).\n\n---\n\n" +
      "Spring leans heavily on polymorphism. You code against **interfaces** (`UserService`, `UserRepository`) and Spring injects the concrete implementation at runtime.\n\n" +
      "Pure runtime polymorphism. Consequences:\n" +
      "- Implementations are swappable (`JpaUserRepository` vs `MongoUserRepository`) without changing consumers.\n" +
      "- Mocks in tests work because consumers depend on the interface, not the implementation.\n" +
      "- JDK dynamic proxy AOP only works for beans that implement an interface (the rest use CGLIB subclassing).",
  },
};
