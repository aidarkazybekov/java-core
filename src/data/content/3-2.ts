import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "3-2",
  blockId: 3,
  title: "Constructors & this",
  summary:
    "Конструктор — специальный метод без возвращаемого типа с именем класса. Вызывается при создании нового объекта и инициализирует его. `this` — ссылка на текущий экземпляр: устраняет неоднозначность полей и параметров, делегирует другому конструктору (`this(...)`), передаёт текущий объект как аргумент. Конструкторы не наследуются.\n\n---\n\n" +
    "A constructor is a special method with no return type whose name matches the class. It's invoked on `new` and initialises the object. `this` is a reference to the current instance: disambiguates fields from parameters, delegates to another constructor (`this(...)`), passes the current object as an argument. Constructors are not inherited.",
  deepDive:
    "## Что такое конструктор\n\n" +
    "- Имя совпадает с именем класса.\n" +
    "- **Нет** возвращаемого типа (даже `void`).\n" +
    "- Вызывается ровно один раз на `new`.\n" +
    "- Не наследуется.\n" +
    "- Может быть перегружен по параметрам.\n\n" +
    "Если вы не объявили конструктор — компилятор генерирует **default no-arg** конструктор, вызывающий `super()`. **Как только** вы объявили любой конструктор, default исчезает.\n\n" +
    "> [!gotcha]\n" +
    "> Распространённая ошибка: объявили параметризованный конструктор и забыли про no-arg. Если фреймворк (JPA, Jackson) требует no-arg конструктор — код компилируется, но падает в рантайме. Поэтому JPA-сущностям нужен явный `protected` / `public` no-arg конструктор.\n\n" +
    "## Constructor chaining — `this(...)` и `super(...)`\n\n" +
    "```java\n" +
    "public Account(String owner, double balance) {\n" +
    "    this.owner = owner;\n" +
    "    this.balance = balance;\n" +
    "}\n" +
    "public Account(String owner) {\n" +
    "    this(owner, 0.0);  // делегирование — ДОЛЖНО быть первым оператором\n" +
    "}\n" +
    "```\n\n" +
    "**Правило**: `this(...)` и `super(...)` должны быть **первым оператором** конструктора. Нельзя вызвать оба в одном конструкторе. (Ограничение немного ослаблено preview-фичей в Java 22.)\n\n" +
    "## Порядок инициализации\n\n" +
    "При **первой** загрузке класса:\n" +
    "1. Static-поля и static-блоки родителя (в порядке объявления).\n" +
    "2. Static-поля и static-блоки потомка.\n\n" +
    "При **каждом** `new`:\n" +
    "1. Неявный / явный `super(...)` — рекурсивно создаётся parent-часть.\n" +
    "2. Инициализаторы полей и instance-init блоки родителя.\n" +
    "3. Тело конструктора родителя.\n" +
    "4. Инициализаторы полей и instance-init блоки потомка.\n" +
    "5. Тело конструктора потомка.\n\n" +
    "**Instance initializer block** (`{ ... }` в теле класса) копируется компилятором в каждый конструктор — удобно, когда несколько конструкторов делят общую инициализацию.\n\n" +
    "## Три роли `this`\n\n" +
    "1. **Устранение тени** — `this.name = name` когда имя поля совпадает с параметром.\n" +
    "2. **Делегирование** — `this(...)` вызов другого конструктора того же класса.\n" +
    "3. **Передача текущего объекта** — `listener.register(this)`, `someMethod(this)`.\n\n" +
    "`this` недоступен в static-методах — static принадлежит классу, а не экземпляру.\n\n" +
    "## Leaking `this`\n\n" +
    "> [!gotcha]\n" +
    "> Передача `this` из конструктора наружу — **частая ошибка**, особенно в concurrent-коде. Другой поток может увидеть объект в полу-сконструированном состоянии: часть полей уже присвоена, часть — ещё нет. Java Memory Model не гарантирует безопасную публикацию `this` во время конструирования, **кроме** `final` полей.\n\n" +
    "Анти-паттерны:\n" +
    "- Регистрация `this` как listener внутри конструктора.\n" +
    "- Запуск фонового потока из конструктора.\n" +
    "- Передача `this` в конструкторы других объектов, которые могут её «утечь».\n\n" +
    "**Решение**: статический factory-метод, который сначала полностью сконструирует объект, а потом регистрирует его.\n\n" +
    "## Copy constructor vs `clone()`\n\n" +
    "Copy-конструктор принимает экземпляр своего же класса:\n\n" +
    "```java\n" +
    "public Account(Account other) {\n" +
    "    this(other.owner, other.balance);\n" +
    "}\n" +
    "```\n\n" +
    "**Преимущества перед `clone()`**:\n" +
    "- Типобезопасен — не нужен каст после `clone()`.\n" +
    "- Не требует `Cloneable`.\n" +
    "- Полный контроль над deep vs shallow копированием.\n" +
    "- Может быть `final` и переопределён в subclass через свой copy-конструктор.\n\n" +
    "Josh Bloch рекомендует избегать `Cloneable`/`clone()` в пользу copy-конструкторов или static factory methods.\n\n" +
    "## Records — компактный синтаксис\n\n" +
    "С Java 16+ **рекорды** генерируют canonical-конструктор автоматически:\n\n" +
    "```java\n" +
    "public record Point(int x, int y) {\n" +
    "    // Compact constructor — для валидации до присвоения полей\n" +
    "    public Point {\n" +
    "        if (x < 0 || y < 0) throw new IllegalArgumentException();\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "Компактный конструктор позволяет валидацию без boilerplate. Поля присваиваются автоматически после его тела.\n\n---\n\n" +
    "## What a constructor is\n\n" +
    "- Name matches the class name.\n" +
    "- **No** return type (not even `void`).\n" +
    "- Invoked exactly once per `new`.\n" +
    "- Not inherited.\n" +
    "- Can be overloaded by parameters.\n\n" +
    "If you declare no constructor, the compiler generates a **default no-arg** constructor that calls `super()`. **As soon as** you declare any constructor, the default is gone.\n\n" +
    "> [!gotcha]\n" +
    "> A common mistake: you declared a parameterised constructor and forgot the no-arg one. If a framework (JPA, Jackson) requires a no-arg constructor, code compiles but fails at runtime. That's why JPA entities need an explicit `protected` / `public` no-arg constructor.\n\n" +
    "## Constructor chaining — `this(...)` and `super(...)`\n\n" +
    "```java\n" +
    "public Account(String owner, double balance) {\n" +
    "    this.owner = owner;\n" +
    "    this.balance = balance;\n" +
    "}\n" +
    "public Account(String owner) {\n" +
    "    this(owner, 0.0);  // delegation — MUST be the first statement\n" +
    "}\n" +
    "```\n\n" +
    "**Rule**: `this(...)` and `super(...)` must be the **first statement** of the constructor. You can't use both in one constructor. (Loosened slightly in a Java 22 preview feature.)\n\n" +
    "## Initialisation order\n\n" +
    "On **first** class load:\n" +
    "1. Parent static fields and static blocks (declaration order).\n" +
    "2. Child static fields and static blocks.\n\n" +
    "On **every** `new`:\n" +
    "1. Implicit / explicit `super(...)` — the parent part is constructed recursively.\n" +
    "2. Parent field initialisers and instance-init blocks.\n" +
    "3. Parent constructor body.\n" +
    "4. Child field initialisers and instance-init blocks.\n" +
    "5. Child constructor body.\n\n" +
    "**Instance initializer block** (`{ ... }` in class body) is copied by the compiler into every constructor — handy when multiple constructors share initialisation.\n\n" +
    "## Three roles of `this`\n\n" +
    "1. **Disambiguate shadowing** — `this.name = name` when the parameter name matches the field.\n" +
    "2. **Delegate** — `this(...)` calls another constructor in the same class.\n" +
    "3. **Pass the current object** — `listener.register(this)`, `someMethod(this)`.\n\n" +
    "`this` is not available in static methods — static belongs to the class, not any instance.\n\n" +
    "## Leaking `this`\n\n" +
    "> [!gotcha]\n" +
    "> Passing `this` out of a constructor is a **frequent bug**, especially in concurrent code. Another thread may see the object half-constructed: some fields assigned, some not. The Java Memory Model does not guarantee safe publication of `this` during construction **except** for `final` fields.\n\n" +
    "Anti-patterns:\n" +
    "- Registering `this` as a listener inside the constructor.\n" +
    "- Starting a background thread from the constructor.\n" +
    "- Passing `this` to constructors of other objects that may leak it.\n\n" +
    "**Fix**: a static factory method that constructs the object fully, then registers it.\n\n" +
    "## Copy constructor vs `clone()`\n\n" +
    "A copy constructor takes an instance of its own class:\n\n" +
    "```java\n" +
    "public Account(Account other) {\n" +
    "    this(other.owner, other.balance);\n" +
    "}\n" +
    "```\n\n" +
    "**Advantages over `clone()`**:\n" +
    "- Type-safe — no cast required.\n" +
    "- No `Cloneable` needed.\n" +
    "- Full control over deep vs shallow copying.\n" +
    "- Can be `final` and overridden in a subclass with its own copy constructor.\n\n" +
    "Josh Bloch recommends avoiding `Cloneable`/`clone()` in favour of copy constructors or static factory methods.\n\n" +
    "## Records — compact syntax\n\n" +
    "Since Java 16+ **records** auto-generate the canonical constructor:\n\n" +
    "```java\n" +
    "public record Point(int x, int y) {\n" +
    "    // Compact constructor — validation before fields are assigned\n" +
    "    public Point {\n" +
    "        if (x < 0 || y < 0) throw new IllegalArgumentException();\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "The compact form allows validation without boilerplate. Fields are assigned automatically after its body.",
  code: `public class Account {
    private final String owner;
    private double balance;
    private final long createdAt;

    // Primary constructor
    public Account(String owner, double balance) {
        if (balance < 0) throw new IllegalArgumentException("Negative balance");
        this.owner = owner;       // 'this' disambiguates field from param
        this.balance = balance;
        this.createdAt = System.currentTimeMillis();
    }

    // Chained constructor -- delegates to the primary one
    public Account(String owner) {
        this(owner, 0.0);         // must be the first statement
    }

    // Copy constructor -- safer alternative to clone()
    public Account(Account other) {
        this(other.owner, other.balance);
    }

    // Instance initializer block -- runs before every constructor body
    {
        System.out.println("Instance initializer: object being created");
    }

    public void deposit(double amount) {
        this.balance += amount;   // 'this' is optional here but adds clarity
    }

    public Account transferTo(Account target, double amount) {
        this.balance -= amount;
        target.deposit(amount);
        return this;              // returning 'this' enables method chaining
    }

    public static void main(String[] args) {
        Account a = new Account("Alice", 1000);
        Account b = new Account("Bob");
        a.transferTo(b, 200).deposit(50); // chained via 'return this'
        System.out.println(a.balance);    // 850.0
        System.out.println(b.balance);    // 200.0
    }
}`,
  interviewQs: [
    {
      id: "3-2-q0",
      q:
        "Что произойдёт, если не объявить ни одного конструктора в классе?\n\n---\n\n" +
        "What happens if you don't define any constructor in a class?",
      a:
        "Компилятор сгенерирует **default no-arg** конструктор, который вызывает `super()` (no-arg конструктор родителя). Если у родителя нет доступного no-arg конструктора — код не скомпилируется.\n\n" +
        "Как только вы объявите **любой** свой конструктор, компилятор перестаёт генерировать default. Частая ошибка: параметризованный конструктор без явного no-arg ломает JPA/Jackson/сериализаторы, которым нужен no-arg.\n\n---\n\n" +
        "The compiler generates a **default no-arg** constructor that calls `super()` (the parent's no-arg). If the parent has no accessible no-arg constructor, the code won't compile.\n\n" +
        "As soon as you declare **any** constructor, the compiler stops generating the default. A common bug: a parameterised constructor without an explicit no-arg breaks JPA/Jackson/serialisers that require one.",
      difficulty: "junior",
    },
    {
      id: "3-2-q1",
      q:
        "Каков порядок инициализации static-блоков, instance-инициализаторов и конструкторов с учётом наследования?\n\n---\n\n" +
        "In what order are static blocks, instance initialisers, and constructors executed? What about inheritance?",
      a:
        "**При первой загрузке класса** (по одному разу):\n" +
        "1. Static-инициализаторы и блоки родителя.\n" +
        "2. Static-инициализаторы и блоки потомка.\n\n" +
        "**При каждом `new`**:\n" +
        "1. `super(...)` — рекурсивно создаётся parent-часть.\n" +
        "2. Инициализаторы полей + instance-init блоки родителя.\n" +
        "3. Тело конструктора родителя.\n" +
        "4. Инициализаторы полей + instance-init блоки потомка.\n" +
        "5. Тело конструктора потомка.\n\n" +
        "Компилятор **копирует** instance-init блоки в каждый конструктор перед его телом, после `super()`.\n\n---\n\n" +
        "**On first class load** (once):\n" +
        "1. Parent static initialisers and blocks.\n" +
        "2. Child static initialisers and blocks.\n\n" +
        "**On every `new`**:\n" +
        "1. `super(...)` — the parent part is constructed recursively.\n" +
        "2. Parent field initialisers + instance-init blocks.\n" +
        "3. Parent constructor body.\n" +
        "4. Child field initialisers + instance-init blocks.\n" +
        "5. Child constructor body.\n\n" +
        "The compiler **copies** instance-init blocks into every constructor, placed before the body and after `super()`.",
      difficulty: "mid",
    },
    {
      id: "3-2-q2",
      q:
        "Что такое «leaking this» и почему это опасно в многопоточном коде?\n\n---\n\n" +
        "What is the 'leaking this' problem and why is it dangerous in concurrent code?",
      a:
        "Leaking `this` — передача текущего экземпляра наружу до того, как конструктор завершился. В многопоточной среде другой поток может увидеть объект в **полу-сконструированном** состоянии: часть полей уже присвоена, часть — ещё нет.\n\n" +
        "Java Memory Model **не** гарантирует безопасную публикацию `this` во время конструирования — кроме `final` полей (для них есть специальные правила freeze).\n\n" +
        "**Примеры утечки**:\n" +
        "- Регистрация `this` как listener: `this.bus.subscribe(this)`.\n" +
        "- Запуск фонового потока: `new Thread(this).start()`.\n" +
        "- Передача `this` во внутренние классы, которые выходят за пределы конструктора.\n\n" +
        "**Решение**: статический factory-метод:\n\n" +
        "```java\n" +
        "public static MyClass create(...) {\n" +
        "    MyClass obj = new MyClass(...);   // полностью сконструирован\n" +
        "    obj.register(bus);                 // потом регистрируется\n" +
        "    return obj;\n" +
        "}\n" +
        "```\n\n---\n\n" +
        "Leaking `this` means passing the current instance out before the constructor finishes. In a multithreaded environment, another thread may see the object **half-constructed** — some fields assigned, some not.\n\n" +
        "The Java Memory Model does **not** guarantee safe publication of `this` during construction — except for `final` fields (which have special freeze rules).\n\n" +
        "**Examples of leakage**:\n" +
        "- Registering `this` as a listener: `this.bus.subscribe(this)`.\n" +
        "- Starting a background thread: `new Thread(this).start()`.\n" +
        "- Passing `this` into inner classes that escape the constructor scope.\n\n" +
        "**Fix**: a static factory method:\n\n" +
        "```java\n" +
        "public static MyClass create(...) {\n" +
        "    MyClass obj = new MyClass(...);   // fully constructed\n" +
        "    obj.register(bus);                 // register afterwards\n" +
        "    return obj;\n" +
        "}\n" +
        "```",
      difficulty: "senior",
    },
    {
      id: "3-2-q3",
      q:
        "Почему copy-конструктор предпочтительнее `clone()`?\n\n---\n\n" +
        "Why is a copy constructor preferable to `clone()`?",
      a:
        "**`clone()`** унаследован от `Object`, возвращает `Object`, требует implements `Cloneable` (маркер-интерфейс без методов), и делает shallow-копию по умолчанию. Если вы забудете вызвать `super.clone()` — бросит `CloneNotSupportedException`.\n\n" +
        "**Copy-конструктор** принимает экземпляр своего же класса:\n\n" +
        "```java\n" +
        "public Account(Account other) {\n" +
        "    this(other.owner, new ArrayList<>(other.history));  // контроль deep/shallow\n" +
        "}\n" +
        "```\n\n" +
        "**Преимущества**:\n" +
        "- Типобезопасно (никакого cast).\n" +
        "- Не нужен `Cloneable`.\n" +
        "- Полный контроль над deep vs shallow копированием.\n" +
        "- Может быть `final`.\n" +
        "- Subclass создаёт свой copy-конструктор.\n\n" +
        "Рекомендация Josh Bloch (Effective Java): **избегать `Cloneable` в пользу copy-конструкторов** или static factory-методов.\n\n---\n\n" +
        "**`clone()`** is inherited from `Object`, returns `Object`, requires `Cloneable` (a marker interface without methods), and does a shallow copy by default. Forget `super.clone()` and it throws `CloneNotSupportedException`.\n\n" +
        "**A copy constructor** takes an instance of its own class:\n\n" +
        "```java\n" +
        "public Account(Account other) {\n" +
        "    this(other.owner, new ArrayList<>(other.history));  // control over deep/shallow\n" +
        "}\n" +
        "```\n\n" +
        "**Advantages**:\n" +
        "- Type-safe (no cast).\n" +
        "- No `Cloneable`.\n" +
        "- Full control over deep vs shallow.\n" +
        "- Can be `final`.\n" +
        "- Subclasses write their own copy constructor.\n\n" +
        "Josh Bloch (Effective Java): **avoid `Cloneable` in favour of copy constructors** or static factory methods.",
      difficulty: "mid",
    },
  ],
  tip:
    "Если у класса несколько конструкторов — заведите один «первичный» с полным набором параметров и делегируйте к нему через `this(...)`. Это гарантирует, что вся валидация выполнится в одном месте.\n\n---\n\n" +
    "With multiple constructors, define a single 'primary' one with all parameters and chain others to it via `this(...)`. This ensures all validation runs in one place.",
  springConnection: {
    concept: "Constructors",
    springFeature: "Constructor Injection",
    explanation:
      "Предпочтительный стиль DI в Spring — **constructor injection**: контейнер вызывает конструктор с уже разрешёнными зависимостями.\n\n" +
      "С Spring 4.3+ класс с одним конструктором даже не требует `@Autowired`. Constructor injection:\n" +
      "- Гарантирует, что обязательные зависимости — **non-null** (в отличие от field/setter injection).\n" +
      "- Делает бин immutable-friendly (поля можно объявить `final`).\n" +
      "- Облегчает unit-тестирование — видны все зависимости по сигнатуре.\n" +
      "- Избегает циклических зависимостей на этапе запуска — Spring бросит понятную ошибку, а не `NullPointerException` при первом вызове.\n\n---\n\n" +
      "Spring's preferred DI style is **constructor injection**: the container calls the constructor with already-resolved dependencies.\n\n" +
      "Since Spring 4.3, a single-constructor class doesn't even need `@Autowired`. Constructor injection:\n" +
      "- Guarantees required dependencies are **non-null** (unlike field/setter injection).\n" +
      "- Makes the bean immutable-friendly (fields can be `final`).\n" +
      "- Eases unit testing — every dependency is visible in the signature.\n" +
      "- Avoids cyclic-dependency traps at startup — Spring raises a clear error rather than letting you hit NPE on first call.",
  },
};
