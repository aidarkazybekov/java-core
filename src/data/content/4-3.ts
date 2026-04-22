import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-3",
  blockId: 4,
  title: "equals(), hashCode(), toString()",
  summary:
    "`Object` — базовый класс всех объектов Java. Методы `equals`, `hashCode`, `toString` — для идентичности, хэширования, отладки. **Контракт**: equals рефлексивно, симметрично, транзитивно, консистентно, никогда не равен null; **равные объекты обязаны иметь одинаковый hashCode**. Нарушение ломает `HashMap`, `HashSet` и любые hash-based коллекции.\n\n---\n\n" +
    "`Object` is the base class of every Java object. `equals`, `hashCode`, `toString` handle identity, hashing, and debugging. **The contract**: equals is reflexive, symmetric, transitive, consistent, never equal to null; **equal objects must return the same hashCode**. Breaking it destroys `HashMap`, `HashSet`, and every hash-based collection.",
  deepDive:
    "## Методы, которые наследует каждый Java-объект\n\n" +
    "| Метод | Назначение | Дефолт |\n" +
    "|-------|------------|--------|\n" +
    "| `equals(Object)` | Сравнение по значению | `==` (identity) |\n" +
    "| `hashCode()` | Хэш для HashMap/Set | native (identity hash) |\n" +
    "| `toString()` | Читаемое представление | `Class@hexHash` |\n" +
    "| `getClass()` | Runtime-класс | final, нельзя override |\n" +
    "| `clone()` | Поверхностное копирование | protected, требует `Cloneable` |\n" +
    "| `wait` / `notify` / `notifyAll` | Примитивы синхронизации | final |\n" +
    "| `finalize()` | Cleanup перед GC | **deprecated с Java 9** |\n\n" +
    "## Контракт `equals()`\n\n" +
    "Из JLS / `Object` javadoc:\n\n" +
    "1. **Рефлексивность**: `x.equals(x) == true`.\n" +
    "2. **Симметричность**: `x.equals(y) == y.equals(x)`.\n" +
    "3. **Транзитивность**: `x.equals(y) && y.equals(z)` → `x.equals(z)`.\n" +
    "4. **Консистентность**: результат не должен меняться при отсутствии модификаций.\n" +
    "5. **Null-safety**: `x.equals(null) == false`.\n\n" +
    "**Стандартный рецепт**:\n\n" +
    "```java\n" +
    "@Override public boolean equals(Object obj) {\n" +
    "    if (this == obj) return true;              // identity — fast path\n" +
    "    if (!(obj instanceof Money other)) return false;  // type check + pattern (Java 16+)\n" +
    "    return amount == other.amount\n" +
    "        && Objects.equals(currency, other.currency);\n" +
    "}\n" +
    "```\n\n" +
    "- `this == obj` — **free fast path**, interviewers ожидают эту строку.\n" +
    "- `instanceof` с pattern binding (Java 16+) — заменяет два шага старого стиля (`instanceof` + cast).\n" +
    "- Для ссылочных полей — `Objects.equals(...)` (null-safe).\n" +
    "- Для `double`/`float` — `Double.compare` / `Float.compare`, корректно обрабатывают NaN.\n\n" +
    "## Контракт `hashCode()`\n\n" +
    "1. **Стабильность**: в рамках одного запуска JVM и неизменного состояния — всегда одно и то же значение.\n" +
    "2. **Консистентность с equals**: если `x.equals(y)`, то `x.hashCode() == y.hashCode()`. **Обязательное требование**.\n" +
    "3. **Обратное не требуется**: неравные объекты могут иметь одинаковый hash (коллизии допустимы).\n\n" +
    "> [!gotcha]\n" +
    "> **Переопределили `equals`, но забыли `hashCode`** → контракт нарушен. `HashMap`/`HashSet` положат объект в один bucket, а при lookup'е по равному объекту будут искать в другом (разные хэши) — объект **не найдётся**. Это самый частый production-баг Java-разработчиков.\n\n" +
    "**Стандартные реализации**:\n\n" +
    "- **Вручную (Effective Java)**: `int result = 17; result = 31 * result + field.hashCode();` — простое число 31 даёт хорошее распределение, JIT оптимизирует `31 * i` в `(i << 5) - i`.\n" +
    "- **`Objects.hash(field1, field2, ...)`** (Java 7+) — one-liner, но создаёт varargs-массив (minor GC overhead в hot paths).\n" +
    "- **IDE / Lombok `@EqualsAndHashCode`** — для production-кода.\n" +
    "- **Records** (Java 16+) — авто-генерируют equals + hashCode по всем компонентам.\n\n" +
    "## Mutable key — классическая утечка\n\n" +
    "> [!production]\n" +
    "> Положили объект в `HashSet` → изменили поле, используемое в `hashCode()` → объект «потерялся»: он есть в set'е, но `contains`/`remove` его не находят. Остаётся только итерацией. Это memory leak, который **невозможно отладить**.\n" +
    "> \n" +
    "> **Правило**: ключи `HashMap`/элементы `HashSet` должны быть **immutable** (или, как минимум, не менять hash-relevant поля, пока они в коллекции). Типовые безопасные ключи: `String`, `Integer`, `UUID`, `enum`, record.\n\n" +
    "## toString() — для отладки и логов\n\n" +
    "Дефолт `Class@hexHash` бесполезен. Переопределяйте с именем класса и значимыми полями:\n\n" +
    "```java\n" +
    "@Override public String toString() {\n" +
    "    return \"Money[amount=\" + amount + \", currency=\" + currency + \"]\";\n" +
    "}\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> **Никогда** не включайте в `toString()` чувствительные данные: пароли, токены, секреты. Они мгновенно окажутся в логах, crash-reports, stack trace'ах. Lombok `@ToString(exclude = \"password\")` / `@ToString.Exclude` — must-have в production.\n\n" +
    "## Наследование и проблема симметрии\n\n" +
    "Классическая ловушка:\n\n" +
    "```java\n" +
    "class Point { int x, y; ... }\n" +
    "class ColorPoint extends Point { Color color; ... }\n" +
    "```\n\n" +
    "Если `Point.equals` использует `instanceof Point` и сравнивает x, y — а `ColorPoint.equals` ещё и color, то:\n" +
    "- `point.equals(colorPoint)` → **true** (Point не знает про color).\n" +
    "- `colorPoint.equals(point)` → **false** (fail instanceof ColorPoint или отсутствие color).\n\n" +
    "**Симметрия нарушена**.\n\n" +
    "**Решения**:\n" +
    "1. **`getClass()` вместо `instanceof`** — но ломает Liskov Substitution и не работает с прокси/наследниками.\n" +
    "2. **Композиция вместо наследования** — `ColorPoint` содержит `Point` как поле. Рекомендация Effective Java для value types.\n" +
    "3. **`canEqual` паттерн** (Scala-style) — дополнительный метод, проверяющий взаимную совместимость. Lombok его реализует.\n" +
    "4. **Records (Java 16+)** — неявно `final`, проблема отпадает.\n\n" +
    "## Records — правильный путь для value types\n\n" +
    "```java\n" +
    "public record Money(int amount, String currency) {}\n" +
    "```\n\n" +
    "Автоматически:\n" +
    "- `equals` — сравнение всех компонентов.\n" +
    "- `hashCode` — по всем компонентам.\n" +
    "- `toString` — `Money[amount=100, currency=USD]`.\n" +
    "- Финальный класс — проблема наследования отсутствует.\n" +
    "- Shallowly immutable — компоненты `final`.\n\n" +
    "Для value types в современной Java — **records по умолчанию**.\n\n---\n\n" +
    "## Methods every Java object inherits\n\n" +
    "| Method | Purpose | Default |\n" +
    "|--------|---------|---------|\n" +
    "| `equals(Object)` | Value comparison | `==` (identity) |\n" +
    "| `hashCode()` | Hash for HashMap/Set | native (identity hash) |\n" +
    "| `toString()` | Readable representation | `Class@hexHash` |\n" +
    "| `getClass()` | Runtime class | final, can't override |\n" +
    "| `clone()` | Shallow copy | protected, requires `Cloneable` |\n" +
    "| `wait` / `notify` / `notifyAll` | Sync primitives | final |\n" +
    "| `finalize()` | Pre-GC cleanup | **deprecated since Java 9** |\n\n" +
    "## The `equals()` contract\n\n" +
    "From the JLS / `Object` javadoc:\n\n" +
    "1. **Reflexive**: `x.equals(x) == true`.\n" +
    "2. **Symmetric**: `x.equals(y) == y.equals(x)`.\n" +
    "3. **Transitive**: `x.equals(y) && y.equals(z)` → `x.equals(z)`.\n" +
    "4. **Consistent**: same result absent modifications.\n" +
    "5. **Null-safety**: `x.equals(null) == false`.\n\n" +
    "**Standard recipe**:\n\n" +
    "```java\n" +
    "@Override public boolean equals(Object obj) {\n" +
    "    if (this == obj) return true;              // identity — fast path\n" +
    "    if (!(obj instanceof Money other)) return false;  // type check + pattern (Java 16+)\n" +
    "    return amount == other.amount\n" +
    "        && Objects.equals(currency, other.currency);\n" +
    "}\n" +
    "```\n\n" +
    "- `this == obj` — **free fast path**, interviewers expect this line.\n" +
    "- `instanceof` with pattern binding (Java 16+) replaces the two-step old style (`instanceof` + cast).\n" +
    "- For reference fields — `Objects.equals(...)` (null-safe).\n" +
    "- For `double`/`float` — `Double.compare` / `Float.compare`, correctly handling NaN.\n\n" +
    "## The `hashCode()` contract\n\n" +
    "1. **Stable**: within one JVM run and unchanged state — always the same value.\n" +
    "2. **Consistent with equals**: if `x.equals(y)`, then `x.hashCode() == y.hashCode()`. **Mandatory**.\n" +
    "3. **Reverse is not required**: unequal objects may share a hash (collisions allowed).\n\n" +
    "> [!gotcha]\n" +
    "> **Overrode `equals` but forgot `hashCode`** → contract broken. `HashMap`/`HashSet` put the object in one bucket; at lookup time with an equal object, they look in a different bucket (different hashes) — object **not found**. This is the most common production bug for Java developers.\n\n" +
    "**Standard implementations**:\n\n" +
    "- **Manual (Effective Java)**: `int result = 17; result = 31 * result + field.hashCode();` — prime 31 distributes well, and the JIT optimises `31 * i` into `(i << 5) - i`.\n" +
    "- **`Objects.hash(field1, field2, ...)`** (Java 7+) — one-liner, but creates a varargs array (minor GC overhead in hot paths).\n" +
    "- **IDE / Lombok `@EqualsAndHashCode`** — for production code.\n" +
    "- **Records** (Java 16+) — auto-generate equals + hashCode over all components.\n\n" +
    "## Mutable keys — the classic leak\n\n" +
    "> [!production]\n" +
    "> Put an object in a `HashSet` → change a field used in `hashCode()` → the object \"disappears\": it's still in the set, but `contains`/`remove` can't find it. Only iteration works. This is a memory leak that's **impossible to debug** from the symptom.\n" +
    "> \n" +
    "> **Rule**: `HashMap` keys / `HashSet` elements must be **immutable** (or at minimum, their hash-relevant fields must not change while in the collection). Typical safe keys: `String`, `Integer`, `UUID`, `enum`, records.\n\n" +
    "## toString() — for debugging and logs\n\n" +
    "The default `Class@hexHash` is useless. Override with the class name and significant fields:\n\n" +
    "```java\n" +
    "@Override public String toString() {\n" +
    "    return \"Money[amount=\" + amount + \", currency=\" + currency + \"]\";\n" +
    "}\n" +
    "```\n\n" +
    "> [!gotcha]\n" +
    "> **Never** put sensitive data in `toString()`: passwords, tokens, secrets. They'll instantly end up in logs, crash reports, stack traces. Lombok `@ToString(exclude = \"password\")` / `@ToString.Exclude` is must-have in production.\n\n" +
    "## Inheritance and the symmetry problem\n\n" +
    "The classic trap:\n\n" +
    "```java\n" +
    "class Point { int x, y; ... }\n" +
    "class ColorPoint extends Point { Color color; ... }\n" +
    "```\n\n" +
    "If `Point.equals` uses `instanceof Point` and compares x, y — and `ColorPoint.equals` also compares color, then:\n" +
    "- `point.equals(colorPoint)` → **true** (Point doesn't know about color).\n" +
    "- `colorPoint.equals(point)` → **false** (fails instanceof ColorPoint or missing color).\n\n" +
    "**Symmetry is broken**.\n\n" +
    "**Solutions**:\n" +
    "1. **`getClass()` instead of `instanceof`** — but breaks Liskov Substitution and doesn't work with proxies/subclasses.\n" +
    "2. **Composition over inheritance** — `ColorPoint` holds a `Point` field. Effective Java recommendation for value types.\n" +
    "3. **`canEqual` pattern** (Scala-style) — an extra method checking mutual comparability. Lombok implements it.\n" +
    "4. **Records (Java 16+)** — implicitly `final`, the problem disappears.\n\n" +
    "## Records — the proper path for value types\n\n" +
    "```java\n" +
    "public record Money(int amount, String currency) {}\n" +
    "```\n\n" +
    "Automatically:\n" +
    "- `equals` — component-wise comparison.\n" +
    "- `hashCode` — across all components.\n" +
    "- `toString` — `Money[amount=100, currency=USD]`.\n" +
    "- Final class — no inheritance problem.\n" +
    "- Shallowly immutable — components are `final`.\n\n" +
    "For value types in modern Java — **records by default**.",
  code: `import java.util.Objects;
import java.util.HashSet;

public class Money {
    private final int amount;
    private final String currency;

    public Money(int amount, String currency) {
        this.amount = amount;
        this.currency = Objects.requireNonNull(currency);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                     // identity check
        if (!(obj instanceof Money other)) return false;  // type check (Java 16 pattern)
        return amount == other.amount
            && currency.equals(other.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount, currency);
        // equivalent to: 31 * Integer.hashCode(amount) + currency.hashCode()
    }

    @Override
    public String toString() {
        return "Money{amount=" + amount + ", currency='" + currency + "'}";
    }

    public static void main(String[] args) {
        Money a = new Money(100, "USD");
        Money b = new Money(100, "USD");
        Money c = new Money(200, "EUR");

        // equals works by value
        System.out.println(a.equals(b)); // true
        System.out.println(a.equals(c)); // false
        System.out.println(a == b);      // false (different heap objects)

        // hashCode contract: equal objects -> same hash
        System.out.println(a.hashCode() == b.hashCode()); // true

        // HashSet relies on equals + hashCode
        HashSet<Money> set = new HashSet<>();
        set.add(a);
        System.out.println(set.contains(b)); // true (works because equals+hashCode)

        // toString for debugging
        System.out.println(a); // Money{amount=100, currency='USD'}

        // --- Mutable key pitfall ---
        // (Don't do this: if key fields change, the object is lost in the set)
    }
}

// --- Modern Java: record does all this automatically ---
record MoneyRecord(int amount, String currency) {}
`,
  interviewQs: [
    {
      id: "4-3-q0",
      q:
        "Почему при переопределении `equals()` обязательно переопределять `hashCode()`?\n\n---\n\n" +
        "Why must you override `hashCode()` when you override `equals()`?",
      a:
        "Контракт: **если два объекта равны по `equals()`, они обязаны возвращать одинаковый `hashCode()`**.\n\n" +
        "`HashMap`/`HashSet` работают в две фазы:\n" +
        "1. По `hashCode()` определяют **bucket** (слот в массиве).\n" +
        "2. Внутри bucket'а через `equals()` ищут точное совпадение.\n\n" +
        "Если `equals` говорит «объекты равны», но `hashCode` возвращает разные значения — lookup ищет в **неправильном bucket'е** и не находит объект. Ломается весь механизм hash-based коллекций.\n\n" +
        "Пример бага:\n" +
        "```java\n" +
        "class Bad { int x; public boolean equals(Object o) { return ((Bad)o).x == x; } /* hashCode не переопределён */ }\n" +
        "Set<Bad> set = new HashSet<>();\n" +
        "set.add(new Bad(42));\n" +
        "set.contains(new Bad(42));  // false! (разные identity-hash)\n" +
        "```\n\n---\n\n" +
        "The contract: **if two objects are equal via `equals()`, they must return the same `hashCode()`**.\n\n" +
        "`HashMap`/`HashSet` work in two phases:\n" +
        "1. `hashCode()` determines the **bucket** (slot in the array).\n" +
        "2. Inside the bucket, `equals()` finds the exact match.\n" +
        "\n" +
        "If `equals` says \"objects are equal\" but `hashCode` returns different values, the lookup searches the **wrong bucket** and can't find the object. The entire hash-based collection mechanism breaks.\n\n" +
        "Example bug:\n" +
        "```java\n" +
        "class Bad { int x; public boolean equals(Object o) { return ((Bad)o).x == x; } /* hashCode not overridden */ }\n" +
        "Set<Bad> set = new HashSet<>();\n" +
        "set.add(new Bad(42));\n" +
        "set.contains(new Bad(42));  // false! (different identity hashes)\n" +
        "```",
      difficulty: "junior",
    },
    {
      id: "4-3-q1",
      q:
        "Что произойдёт, если использовать мутабельный объект как ключ `HashMap` и изменить поля, участвующие в `hashCode()`?\n\n---\n\n" +
        "What happens if you use a mutable object as a HashMap key and then modify fields used in `hashCode()`?",
      a:
        "Объект был помещён в bucket на основе **оригинального** `hashCode`. После мутации `hashCode()` возвращает другое значение, поэтому `get()` ищет в **другом** bucket'е и **не находит** запись.\n\n" +
        "Объект становится **ghost entry**: он физически в map, но:\n" +
        "- `get(key)` возвращает `null`.\n" +
        "- `containsKey(key)` → `false`.\n" +
        "- `remove(key)` ничего не удаляет.\n" +
        "- Найти можно только итерацией по `entrySet()`.\n\n" +
        "Это **memory leak, который невозможно отладить** — объект невидим через API, но занимает память и держит ссылку (возможно на большой object graph).\n\n" +
        "**Решения**:\n" +
        "- Используйте **immutable** объекты как ключи: `String`, `Integer`, `UUID`, `enum`, records.\n" +
        "- Если ключ с мутабельными полями неизбежен — не изменяйте hash-relevant поля, пока объект в коллекции.\n" +
        "- Для entity с auto-generated ID (JPA): используйте natural business key, UUID или реализуйте `equals`/`hashCode` consistently для transient и managed состояний.\n\n---\n\n" +
        "The object was placed in a bucket based on its **original** `hashCode`. After mutation, `hashCode()` returns a different value, so `get()` looks in a **different** bucket and can't find the entry.\n\n" +
        "The object becomes a **ghost entry**: physically in the map but:\n" +
        "- `get(key)` returns `null`.\n" +
        "- `containsKey(key)` → `false`.\n" +
        "- `remove(key)` does nothing.\n" +
        "- Only reachable by iterating `entrySet()`.\n\n" +
        "It's a **memory leak impossible to debug from symptoms** — the object is invisible via the API but still occupies memory and can pin a large object graph.\n\n" +
        "**Fixes**:\n" +
        "- Use **immutable** keys: `String`, `Integer`, `UUID`, `enum`, records.\n" +
        "- If a mutable key is unavoidable — don't modify hash-relevant fields while the object is in a collection.\n" +
        "- For entities with auto-generated IDs (JPA): use a natural business key, a UUID, or implement `equals`/`hashCode` consistently across transient and managed states.",
      difficulty: "mid",
    },
    {
      id: "4-3-q2",
      q:
        "Объясните проблему симметрии `equals()` в иерархиях наследования и как её решать.\n\n---\n\n" +
        "Explain the symmetry problem with `equals()` in inheritance hierarchies and how to solve it.",
      a:
        "Если `Point.equals()` использует `instanceof Point` и сравнивает `x, y`, а `ColorPoint.equals()` дополнительно проверяет `instanceof ColorPoint` и сравнивает `color`:\n\n" +
        "```java\n" +
        "Point p = new Point(1, 2);\n" +
        "ColorPoint cp = new ColorPoint(1, 2, RED);\n" +
        "p.equals(cp);   // true  (Point.equals игнорирует color)\n" +
        "cp.equals(p);   // false (ColorPoint fail на instanceof ColorPoint)\n" +
        "```\n\n" +
        "**Симметрия нарушена** — контракт `equals` сломан.\n\n" +
        "**Решения**:\n\n" +
        "1. **`getClass()` вместо `instanceof`**:\n" +
        "```java\n" +
        "if (getClass() != obj.getClass()) return false;\n" +
        "```\n" +
        "Работает, но **ломает Liskov Substitution** (Point и ColorPoint больше не взаимозаменяемы) и не работает с прокси/subclass'ами.\n\n" +
        "2. **Композиция вместо наследования** (рекомендация Effective Java для value types):\n" +
        "```java\n" +
        "class ColorPoint { Point point; Color color; }  // has-a, не is-a\n" +
        "```\n\n" +
        "3. **`canEqual` паттерн** (Scala-style): дополнительный метод, проверяющий взаимную совместимость. Lombok `@EqualsAndHashCode(callSuper = true)` его реализует.\n\n" +
        "4. **Records (Java 16+)** — неявно `final`, проблема отсутствует. Для value types — **рекомендованный путь в современной Java**.\n\n---\n\n" +
        "If `Point.equals()` uses `instanceof Point` and compares `x, y`, while `ColorPoint.equals()` also checks `instanceof ColorPoint` and compares `color`:\n\n" +
        "```java\n" +
        "Point p = new Point(1, 2);\n" +
        "ColorPoint cp = new ColorPoint(1, 2, RED);\n" +
        "p.equals(cp);   // true  (Point.equals ignores color)\n" +
        "cp.equals(p);   // false (ColorPoint fails the instanceof ColorPoint check)\n" +
        "```\n\n" +
        "**Symmetry is broken** — the `equals` contract is violated.\n\n" +
        "**Solutions**:\n\n" +
        "1. **`getClass()` instead of `instanceof`**:\n" +
        "```java\n" +
        "if (getClass() != obj.getClass()) return false;\n" +
        "```\n" +
        "Works, but **breaks Liskov Substitution** (Point and ColorPoint are no longer interchangeable) and doesn't work with proxies/subclasses.\n\n" +
        "2. **Composition over inheritance** (Effective Java recommendation for value types):\n" +
        "```java\n" +
        "class ColorPoint { Point point; Color color; }  // has-a, not is-a\n" +
        "```\n\n" +
        "3. **`canEqual` pattern** (Scala-style): an extra method checking mutual comparability. Lombok `@EqualsAndHashCode(callSuper = true)` implements it.\n\n" +
        "4. **Records (Java 16+)** — implicitly `final`, the problem disappears. The **recommended modern-Java approach** for value types.",
      difficulty: "senior",
    },
  ],
  tip:
    "В любой реализации `equals()` всегда начинайте с `if (this == obj) return true`. Это бесплатная fast-path оптимизация, и каждый интервьюер ожидает увидеть эту строку.\n\n---\n\n" +
    "In any `equals()` implementation, always start with `if (this == obj) return true`. It's a free fast-path optimisation and every interviewer expects to see it.",
  springConnection: {
    concept: "equals() & hashCode()",
    springFeature: "Spring Data / JPA Entity Identity",
    explanation:
      "JPA-сущности имеют **сложные** отношения с `equals`/`hashCode`.\n\n" +
      "- **Primary key** (ID) может быть `null` до persist (auto-generated). Использование ID в equals/hashCode ломает контракт, когда entity переходит из transient в managed (ID меняется с `null` на значение → `hashCode` меняется → объект «теряется» в Set'ах).\n" +
      "- **Lazy proxies Hibernate** не являются instance целевого класса напрямую — `instanceof Entity` возвращает true, но `getClass() == Entity.class` — false.\n\n" +
      "**Рекомендованный паттерн** (Vlad Mihalcea):\n" +
      "- Natural business key, если есть (email, SKU).\n" +
      "- Или **UUID**, присвоенный в конструкторе (до persist).\n" +
      "- Или только по primary key, но с защитой от `null`: если оба ID null — identity, иначе по ID.\n\n" +
      "Ошибка здесь = дубликаты в `Set<Entity>`, сломанные lookup'ы в persistence context'е Hibernate, непонятные баги с cascade.\n\n---\n\n" +
      "JPA entities have a **tricky** relationship with `equals`/`hashCode`.\n\n" +
      "- The **primary key** (ID) may be `null` before persist (auto-generated). Using the ID in equals/hashCode breaks the contract when an entity transitions from transient to managed (ID flips from `null` to a value → `hashCode` changes → the object \"vanishes\" from Sets).\n" +
      "- **Hibernate lazy proxies** aren't direct instances of the target class — `instanceof Entity` returns true, but `getClass() == Entity.class` is false.\n\n" +
      "**Recommended pattern** (Vlad Mihalcea):\n" +
      "- A natural business key if one exists (email, SKU).\n" +
      "- Or a **UUID** assigned in the constructor (before persist).\n" +
      "- Or primary-key-only but null-safe: if both IDs are null — identity, else compare IDs.\n\n" +
      "Getting this wrong → duplicates in `Set<Entity>`, broken lookups in Hibernate's persistence context, weird cascade bugs.",
  },
};
