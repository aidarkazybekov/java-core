import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "4-3",
  blockId: 4,
  title: "equals(), hashCode(), toString()",
  summary:
    "Object -- базовый класс для всех объектов в Java. Методы: equals, hashCode, toString, getClass, clone, notify, wait, finalize (deprecated с Java 9). Контракт equals: рефлексивность, симметричность, транзитивность, согласованность, сравнение с null. Контракт hashCode: повторный вызов возвращает одинаковое значение; равные по equals объекты должны иметь одинаковый hashCode.\n\n---\n\nEvery Java object inherits equals(), hashCode(), and toString() from Object. Correctly overriding them is critical for collections, debugging, and domain logic. The equals-hashCode contract is one of the most tested topics in Java interviews.",
  deepDive:
    "Object -- это базовый класс для всех объектов в Java. Любой класс наследует от Object его методы: equals, hashCode, toString, getClass, clone, notify, wait, finalize (вызывается GC перед удалением объекта; deprecated с Java 9, альтернатива -- AutoCloseable).\n\nКонтракты equals:\n- Рефлексивность: x.equals(x) == true\n- Симметричность: x.equals(y) == y.equals(x)\n- Транзитивность: x.equals(y) && y.equals(z) => x.equals(z)\n- Согласованность: если состояние не изменилось, equals возвращает тот же результат\n- Сравнение с null: x.equals(null) == false\n\nКонтракты hashCode:\n- Повторный вызов для одного объекта возвращает одинаковое хеш-значение (если поля не изменились)\n- Если equals() двух объектов возвращает true, hashCode() должен возвращать одно и то же число\n- Неравные объекты (по equals) могут иметь одинаковый хеш-код\n\nРеализация Object.equals() -- проверка равенства ссылок. Object.hashCode() -- native, в HotSpot вычисляется алгоритмом Xorshift.\n\nРавные объекты должны возвращать одинаковые хэш-коды. При переопределении equals() обязательно переопределять hashCode(). hashCode() используется в коллекциях с хэш-функцией; при коллизии объекты сравниваются по equals().\n\n---\n\nThe `equals()` method from `Object` checks reference identity (`==`). For domain objects, you almost always need to override it to compare state. The contract requires: reflexive (x.equals(x)), symmetric (x.equals(y) iff y.equals(x)), transitive, consistent, and x.equals(null) returns false. A correct implementation checks `this == obj` first (fast path), then `instanceof` with the target type, then compares all significant fields. Use `Objects.equals()` for null-safe field comparison and `Double.compare()` / `Float.compare()` for floating-point fields to handle NaN correctly.\n\nThe `hashCode()` contract states: if two objects are equal via `equals()`, they must return the same `hashCode()`. The reverse is not required (unequal objects may share a hash code -- collisions). Violating this contract breaks HashMap, HashSet, and any hash-based collection: an object stored under one hash code will not be found when looked up with a different one. The standard recipe is to combine field hashes: `result = 31 * result + field.hashCode()`. The prime 31 distributes values well and the JIT can optimize `31 * i` to `(i << 5) - i`. Since Java 7, `Objects.hash(field1, field2, ...)` provides a one-liner, though it creates a varargs array (minor GC overhead in hot paths).\n\nA critical pitfall: using mutable fields in `equals()` and `hashCode()`. If a field used in `hashCode()` changes after the object is placed in a HashSet, the object becomes unfindable because it now lives in the wrong bucket. This is why keys in HashMaps should be immutable or, at minimum, their hash-relevant fields should not change while the object is in the collection. Records (Java 16) solve this by auto-generating `equals()` and `hashCode()` based on all components, and records are shallowly immutable by convention.\n\nThe `toString()` method returns a human-readable representation. The default (`ClassName@hexHashCode`) is useless for debugging. Override it to include the class name and significant fields. Keep it concise to avoid log bloat. Never include sensitive data (passwords, tokens) in toString(). IDEs and libraries like Lombok (@ToString) can generate these, but understanding the manual implementation matters for interviews.\n\nInheritance complicates equals(). If `Point.equals()` compares x and y, and `ColorPoint extends Point` adds color, symmetry can break: a Point may equal a ColorPoint by ignoring color, but the ColorPoint may reject a plain Point. Effective Java recommends preferring composition over inheritance for value types, or using a canEqual pattern (as Scala does) to maintain the contract across hierarchies.",
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
}`,
  interviewQs: [
    {
      id: "4-3-q0",
      q: "Why must you override hashCode() when you override equals()?",
      a: "The contract states: if two objects are equal according to equals(), they must have the same hashCode(). HashMap and HashSet use hashCode() to determine which bucket to place an object in, then use equals() to find the exact match within that bucket. If equals() says two objects are equal but they return different hash codes, the lookup will search the wrong bucket and never find the object. This breaks all hash-based collections.",
      difficulty: "junior",
    },
    {
      id: "4-3-q1",
      q: "What happens if you use a mutable object as a HashMap key and then modify the fields used in hashCode()?",
      a: "The object was placed in a bucket based on its original hashCode. After mutation, hashCode() returns a different value, so get() looks in a different bucket and cannot find the entry. The object becomes a ghost entry: it exists in the map but is unreachable via get(), contains(), or remove(). It can only be found by iterating all entries. This is a memory leak that is extremely hard to debug. Solution: use immutable objects as keys, or never modify hash-relevant fields while the object is in a hash-based collection.",
      difficulty: "mid",
    },
    {
      id: "4-3-q2",
      q: "Explain the symmetry problem with equals() in inheritance hierarchies and how to solve it.",
      a: "If Point.equals() uses `instanceof Point` and compares x,y, and ColorPoint.equals() uses `instanceof ColorPoint` and also compares color, then `point.equals(colorPoint)` can return true (ignoring color) while `colorPoint.equals(point)` returns false (point fails instanceof ColorPoint), violating symmetry. Solutions: (1) Use `getClass()` instead of `instanceof` -- but this breaks Liskov Substitution and doesn't work with proxies/subclasses. (2) Favor composition: make ColorPoint contain a Point field rather than extending it. (3) Use the canEqual pattern: ColorPoint.equals() checks `other.canEqual(this)` where canEqual is overridden to return `other instanceof ColorPoint`, ensuring both sides agree on comparability. Records avoid this entirely because they are implicitly final.",
      difficulty: "senior",
    },
  ],
  tip: "In any equals() implementation, always start with `if (this == obj) return true` as the first line. It is a free fast-path optimization and every interviewer expects to see it.",
  springConnection: {
    concept: "equals() & hashCode()",
    springFeature: "Spring Data / JPA Entity Identity",
    explanation:
      "JPA entities have a tricky relationship with equals/hashCode. The primary key (ID) may be null before persistence (auto-generated). Using the ID in equals/hashCode breaks the contract when an entity transitions from transient to managed. The recommended pattern is to use a natural business key or, if none exists, to use a stable surrogate (e.g., a UUID assigned at construction). Getting this wrong causes duplicate entries in Sets and broken HashMap lookups in Hibernate's persistence context.",
  },
};
