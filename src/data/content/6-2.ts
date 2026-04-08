import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "6-2",
  blockId: 6,
  title: "HashMap Internals",
  summary:
    "Внутри HashMap хранится массив (по умолчанию размер 16), где каждый элемент называется bucket. Каждый бакет может быть пустым, содержать связанный список или (в Java 8+) красно-черное дерево при 8 и более элементов. При превышении threshold 0.75 массив расширяется в два раза.\n\n---\n\nHashMap is the most frequently asked collection in Java interviews. It uses an array of buckets with hash-based indexing, handles collisions via linked lists that convert to red-black trees at threshold 8, and rehashes when the load factor (0.75) is exceeded.",
  deepDive:
    "Внутри HashMap хранится массив (по умолчанию размер 16), где каждый элемент называется bucket («корзина»). Каждый бакет может быть пустым, содержать связанный список или в Java 8+ красно-черное дерево при 8 и более элементах. При превышении threshold 0.75 массив расширяется в два раза.\n\nБакет может быть связанным списком (Node) или красно-черным деревом (TreeNode) (своя реализация, TreeMap не используется).\n\nNode содержит: Key, Value, Hash of key, nextNode.\nTreeNode содержит: Parent, Left, Right, Prev, Boolean red.\n\nКак работает вставка (put):\n1. Вычисляется хэш ключа.\n2. Определяется индекс бакета путем деления с остатком хэша на (длину массива - 1).\n3. Если бакет пуст -- создаем Node и кладем в бакет.\n4. Если бакет не пуст (коллизия):\n   - Сравниваем хэши ключей элементов в бакете.\n   - Если хэш ключей совпал, вызывается equals() ключа для проверки.\n   - Если equals() == true -> перезаписываем на новое значение.\n   - Если equals() == false -> продолжаем искать в этом бакете.\n5. Проверяем длину цепочки (Java 8+): если длина >= 8, связанный список превращается в красно-черное дерево. Обратное превращение дерева в список происходит при количестве узлов <= 6.\n6. Проверка необходимости расширения.\n\nПочему ключ в HashMap не обязан реализовывать Comparable, но список удается преобразовать в красно-черное дерево? Алгоритм сравнения ключей:\n1. Сначала сравниваются хэши ключей.\n2. Если хэши равны и оба ключа реализуют Comparable, вызывается compareTo().\n3. Если ключи не реализуют Comparable, используется tieBreakOrder(): сначала сравнение через названия классов, затем через System.identityHashCode().\n\nЗачем нужен HashMap, если есть HashTable?\n- Методы HashTable синхронизированы, что снижает производительность.\n- HashTable не может содержать null, тогда как HashMap допускает один null-ключ и любое количество null-значений.\n- Iterator у HashMap работает по принципу fail-fast, в отличие от Enumeration у HashTable.\n- HashTable -- устаревший класс.\n\n---\n\nHashMap stores entries in a Node<K,V>[] table (array of buckets). When you call put(key, value), it computes the bucket index as (n - 1) & hash(key), where n is the array length (always a power of 2) and hash() applies a spread function that XORs the upper 16 bits with the lower 16 bits of hashCode() to reduce collisions. If two keys map to the same bucket, they form a linked list (separate chaining).\n\nSince Java 8, when a bucket's linked list reaches 8 nodes (TREEIFY_THRESHOLD), it converts to a balanced red-black tree, improving worst-case lookup from O(n) to O(log n). When the tree shrinks below 6 nodes (UNTREEIFY_THRESHOLD), it converts back to a linked list. Treeification only occurs if the table has at least 64 buckets (MIN_TREEIFY_CAPACITY); otherwise, the table is resized instead. This is a critical interview detail.\n\nResizing (rehashing) occurs when size exceeds capacity * loadFactor (default 0.75). The new capacity doubles, and every entry is redistributed. In Java 8+, rehashing is optimized: since capacity is always a power of 2, each entry either stays in the same bucket or moves to bucket (old index + old capacity), determined by a single bit check. This avoids recalculating all hashes.\n\nThe contract between equals() and hashCode() is fundamental: if two objects are equal via equals(), they MUST have the same hashCode(). Violating this contract causes HashMap to place equal keys in different buckets, making lookups fail silently. HashMap is not thread-safe; concurrent modification can cause infinite loops (in old Java versions) or corrupted data. Use ConcurrentHashMap for thread safety.",
  code: `import java.util.*;

public class HashMapInternals {
    public static void main(String[] args) {
        // Default: capacity=16, loadFactor=0.75
        Map<String, Integer> map = new HashMap<>();

        // Preallocate to avoid resizing
        // For 100 entries: 100 / 0.75 = 134, next power of 2 = 256
        Map<String, Integer> optimized = new HashMap<>(256);

        // How put() works internally:
        // 1. hash = spread(key.hashCode()) -- XOR upper/lower 16 bits
        // 2. index = (capacity - 1) & hash
        // 3. If bucket empty: insert new Node
        // 4. If bucket occupied: traverse chain
        //    - If key found (equals): replace value
        //    - If not found: append to chain
        // 5. If chain length >= 8 AND table >= 64: treeify
        // 6. If size > capacity * 0.75: resize (double)
        map.put("name", 1);
        map.put("name", 2); // replaces, returns old value 1

        // equals/hashCode contract demo
        Map<Person, String> people = new HashMap<>();
        Person p1 = new Person("Alice", 30);
        people.put(p1, "Engineer");
        System.out.println(people.get(new Person("Alice", 30))); // "Engineer"
        // Only works because Person overrides both equals AND hashCode
    }
}

class Person {
    private final String name;
    private final int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person)) return false;
        Person p = (Person) o;
        return age == p.age && Objects.equals(name, p.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age); // MUST override with equals
    }
}`,
  interviewQs: [
    {
      id: "6-2-q0",
      q: "How does HashMap determine which bucket to place an entry in?",
      a: "HashMap computes a hash by taking the key's hashCode() and XORing its upper 16 bits with its lower 16 bits (spread function) to reduce collisions. The bucket index is calculated as (capacity - 1) & hash, which works because capacity is always a power of 2. This is a fast bitwise AND that replaces the modulo operation.",
      difficulty: "junior",
    },
    {
      id: "6-2-q1",
      q: "What happens when a HashMap bucket has too many collisions? What are the thresholds?",
      a: "When a bucket's linked list reaches 8 nodes (TREEIFY_THRESHOLD), HashMap converts the list into a red-black tree, improving worst-case lookup from O(n) to O(log n). However, treeification only occurs if the table capacity is at least 64 (MIN_TREEIFY_CAPACITY); otherwise, it resizes the table instead. When removals shrink a tree below 6 nodes (UNTREEIFY_THRESHOLD), it converts back to a linked list. The gap between 8 and 6 prevents thrashing between list and tree forms.",
      difficulty: "mid",
    },
    {
      id: "6-2-q2",
      q: "Explain the Java 8 resize optimization for HashMap. Why must capacity be a power of 2?",
      a: "Power-of-2 capacity enables the bitwise AND trick: index = (capacity - 1) & hash, which is faster than modulo. During resize (doubling), each entry's new position depends on a single bit: the bit at the position of the old capacity. If that bit is 0, the entry stays at the same index; if 1, it moves to oldIndex + oldCapacity. This allows splitting each bucket into two using simple bit checks without recalculating hashes. Entries are split into 'lo' and 'hi' lists, maintaining order. This optimization, introduced in Java 8, also eliminated the possibility of infinite loops during concurrent resize that plagued Java 7's head-insertion rehashing.",
      difficulty: "senior",
    },
  ],
  tip: "When asked about HashMap, always mention the three key numbers: initial capacity 16, load factor 0.75, treeify threshold 8. Then explain the equals/hashCode contract. This covers 90% of HashMap interview questions.",
  springConnection: {
    concept: "HashMap Internals",
    springFeature: "Spring bean container and dependency resolution",
    explanation:
      "The Spring IoC container internally uses multiple HashMaps to store bean definitions, singleton instances, and dependency mappings. Understanding HashMap performance characteristics helps explain why bean lookup is O(1) and why poorly implemented hashCode() in custom beans used as map keys can degrade application performance.",
  },
};
