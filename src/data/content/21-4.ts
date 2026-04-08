import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "21-4",
  blockId: 21,
  title: "Hash Tables",
  summary:
    "A hash table maps keys to values using a hash function for O(1) average-case lookups. Java's HashMap uses an array of buckets with separate chaining (linked lists that convert to red-black trees at threshold 8). Key concepts: collision resolution, load factor, and rehashing.",
  deepDive:
    "## Хеш-таблица (Hash Table)\n\nСтруктура данных, которая хранит пары ключ-значение и обеспечивает быстрый доступ по ключу за O(1) в среднем случае.\n\n### Принцип работы:\n\n1. Вычисляется хеш-код ключа (hashCode())\n2. Хеш-код преобразуется в индекс массива (bucket)\n3. Значение сохраняется в соответствующем bucket\n\n### Коллизии:\n\nКоллизия -- ситуация, когда два разных ключа дают одинаковый индекс.\n\n**Методы разрешения коллизий:**\n\n- **Метод цепочек (Separate Chaining)** -- каждый bucket содержит связанный список (или дерево) элементов с одинаковым хешем. Используется в Java HashMap.\n- **Открытая адресация (Open Addressing)** -- при коллизии ищется следующая свободная ячейка (линейное или квадратичное зондирование, двойное хеширование).\n\n### Load Factor (коэффициент загрузки):\n\n- Отношение количества элементов к размеру массива: `loadFactor = size / capacity`\n- В Java HashMap по умолчанию: capacity = 16, loadFactor = 0.75\n- При превышении loadFactor происходит **rehashing** -- создаётся новый массив удвоенного размера и все элементы перехешируются\n\n### Контракт hashCode() и equals():\n\n- Если `a.equals(b)`, то `a.hashCode() == b.hashCode()` (обязательно)\n- Обратное не верно: одинаковый hashCode не гарантирует equals\n- При переопределении equals() обязательно переопределять hashCode()\n\n---\n\n## Hash Tables\n\nA hash table (also called hash map) is a data structure that implements an associative array -- it maps keys to values using a hash function for O(1) average-case operations.\n\n### How It Works:\n\n1. **Hash function** computes an integer hash code from the key\n2. **Index calculation:** `index = hash(key) & (capacity - 1)` (bitwise AND for power-of-2 sizes)\n3. **Store** the key-value pair in the bucket at that index\n\n### Collision Resolution:\n\nCollisions occur when two different keys map to the same bucket index.\n\n**Separate Chaining (Java HashMap approach):**\n- Each bucket holds a linked list of entries\n- On collision, the new entry is appended to the list\n- Since Java 8: when a bucket exceeds 8 entries (TREEIFY_THRESHOLD), the linked list converts to a red-black tree for O(log n) worst-case lookup instead of O(n)\n- When bucket shrinks below 6 entries (UNTREEIFY_THRESHOLD), it converts back to a linked list\n\n**Open Addressing:**\n- All entries stored in the array itself\n- On collision, probe for the next empty slot using:\n  - Linear probing: `index = (hash + i) % capacity`\n  - Quadratic probing: `index = (hash + i^2) % capacity`\n  - Double hashing: `index = (hash + i * hash2) % capacity`\n\n### Load Factor & Rehashing:\n\n- **Load factor** = number of entries / number of buckets\n- Default in HashMap: initial capacity = 16, load factor threshold = 0.75\n- When load factor is exceeded, HashMap doubles its capacity and rehashes all entries\n- Rehashing is O(n) but happens infrequently, so amortized insertion is still O(1)\n\n### hashCode() / equals() Contract:\n\n- If `a.equals(b)` then `a.hashCode() == b.hashCode()` (mandatory)\n- The reverse is not required: same hashCode does not imply equals\n- Violating this contract causes HashMap to malfunction -- objects may be \"lost\" because they are placed in the wrong bucket during lookup",
  code: `// ─── HashMap Internal Mechanics ───
public class HashTableDemo {
    public static void main(String[] args) {
        // Default: capacity=16, loadFactor=0.75
        Map<String, Integer> map = new HashMap<>();
        map.put("Alice", 90);   // hash("Alice") → bucket index
        map.put("Bob", 85);
        map.put("Charlie", 92);

        // O(1) average lookup
        int score = map.get("Alice"); // 90

        // Iteration
        for (Map.Entry<String, Integer> e : map.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}

// ─── Correct hashCode()/equals() Contract ───
public class Student {
    private final String name;
    private final int id;

    public Student(String name, int id) {
        this.name = name;
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student s = (Student) o;
        return id == s.id && Objects.equals(name, s.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, id); // Must override both!
    }
}

// ─── Simple Hash Table Implementation ───
public class SimpleHashTable<K, V> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    private Node<K, V>[] buckets;
    private int size;

    static class Node<K, V> {
        final K key;
        V value;
        Node<K, V> next;  // Separate chaining

        Node(K key, V value, Node<K, V> next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    @SuppressWarnings("unchecked")
    public SimpleHashTable() {
        buckets = new Node[INITIAL_CAPACITY];
    }

    private int getBucketIndex(K key) {
        return Math.abs(key.hashCode()) % buckets.length;
    }

    public void put(K key, V value) {
        if ((float) size / buckets.length >= LOAD_FACTOR) {
            resize();
        }
        int index = getBucketIndex(key);
        // Check if key already exists
        for (Node<K, V> n = buckets[index]; n != null; n = n.next) {
            if (n.key.equals(key)) {
                n.value = value; // Update
                return;
            }
        }
        // Prepend new node (separate chaining)
        buckets[index] = new Node<>(key, value, buckets[index]);
        size++;
    }

    public V get(K key) {
        int index = getBucketIndex(key);
        for (Node<K, V> n = buckets[index]; n != null; n = n.next) {
            if (n.key.equals(key)) return n.value;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        Node<K, V>[] oldBuckets = buckets;
        buckets = new Node[oldBuckets.length * 2];
        size = 0;
        for (Node<K, V> head : oldBuckets) {
            for (Node<K, V> n = head; n != null; n = n.next) {
                put(n.key, n.value); // Rehash
            }
        }
    }
}`,
  interviewQs: [
    {
      id: "21-4-q0",
      q: "Why must you override hashCode() when you override equals() in Java?",
      a: "HashMap uses hashCode() to determine which bucket to place an entry in, and equals() to find the exact key within that bucket. If two objects are equal by equals() but have different hashCode() values, HashMap will look in the wrong bucket during get() and never find the entry. This violates the contract: equal objects must have equal hash codes. Always override both together, and use Objects.hash() for consistent implementation.",
      difficulty: "junior",
    },
    {
      id: "21-4-q1",
      q: "Explain how Java HashMap handles collisions and what changed in Java 8.",
      a: "HashMap uses separate chaining: each bucket contains a linked list of entries that hash to the same index. On collision, new entries are appended. In Java 8, when a bucket exceeds TREEIFY_THRESHOLD (8 entries), the linked list is converted to a red-black tree, improving worst-case lookup from O(n) to O(log n). When the bucket shrinks below UNTREEIFY_THRESHOLD (6), it reverts to a linked list. This protects against hash collision attacks that could cause O(n) degradation.",
      difficulty: "mid",
    },
    {
      id: "21-4-q2",
      q: "What is the impact of a poor hash function on HashMap performance, and how does HashMap's internal hash spreading help?",
      a: "A poor hash function that produces many collisions degrades HashMap from O(1) to O(n) (or O(log n) with treeification in Java 8). HashMap internally applies a secondary hash: it XORs the upper 16 bits with the lower 16 bits of hashCode() (hash ^ (hash >>> 16)) to spread bits and reduce collisions when capacity is small. The capacity is always a power of 2, so bucket index is computed as (capacity - 1) & hash, using only the lower bits. Without spreading, keys with hash codes that differ only in upper bits would all collide. Immutable keys with good distribution (like String) are ideal for HashMap performance.",
      difficulty: "senior",
    },
  ],
  tip: "Use immutable objects as HashMap keys (String, Integer, enums) -- mutable keys can change their hashCode() after insertion, making them unretrievable from the map.",
  springConnection: null,
};
