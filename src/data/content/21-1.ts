import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "21-1",
  blockId: 21,
  title: "Arrays & Linked Lists",
  summary:
    "Arrays store elements contiguously in memory with O(1) index access but fixed size. Linked lists use node pointers for flexible insertion/deletion but sacrifice random access (O(n)). Understanding their trade-offs is fundamental to algorithm design.",
  deepDive:
    "## Массив\n\nУпорядоченная коллекция элементов, каждый из которых имеет уникальный индекс. Элементы в массиве располагаются последовательно в памяти, что обеспечивает быстрый доступ к данным по индексу. Однако размер фиксирован, и это ограничивает возможность добавления или удаления элементов.\n\n- **Преимущества:** быстрый доступ по индексу O(1), эффективное использование памяти для элементов фиксированного размера\n- **Недостатки:** фиксированный размер, добавление или удаление элементов может потребовать перераспределения памяти\n\n## Связанный список\n\nПредставляет упорядоченную коллекцию элементов, связанных между собой через ссылки (указатели). Элементы могут быть не связаны физически в памяти, что делает их более гибкими, чем массивы.\n\n- **Преимущества:** гибкость в управлении размером и добавлении/удалении элементов O(1) в начале/середине, эффективные операции вставки\n- **Недостатки:** дополнительные затраты памяти на хранение ссылок, нет быстрого доступа по индексу O(n)\n\n### Виды связанных списков:\n\n- **Однонаправленный (Singly Linked)** -- каждый узел хранит данные и ссылку на следующий узел\n- **Двунаправленный (Doubly Linked)** -- каждый узел хранит ссылки на предыдущий и следующий узлы\n- **Кольцевой (Circular)** -- последний узел ссылается на первый\n\n---\n\n## Arrays\n\nAn array is an ordered, fixed-size collection of elements stored in contiguous memory locations. Each element is accessible by its numerical index.\n\n**Time Complexity:**\n- Access by index: O(1)\n- Search (unsorted): O(n)\n- Search (sorted, binary): O(log n)\n- Insert at end (if space): O(1)\n- Insert at position / Delete: O(n) -- requires shifting elements\n\n**In Java:**\n- Primitive arrays (`int[]`) are the most memory-efficient\n- `ArrayList` is a dynamic array that resizes (grows by 50%) when full\n- Arrays are covariant (`String[]` is a subtype of `Object[]`), which can cause `ArrayStoreException` at runtime\n\n## Linked Lists\n\nA linked list stores elements in nodes scattered across memory, where each node holds data and a reference to the next (and optionally previous) node.\n\n**Types:**\n- **Singly Linked List** -- each node points to the next; traversal is one-directional\n- **Doubly Linked List** -- each node points to both previous and next; allows bidirectional traversal\n- **Circular Linked List** -- the tail node points back to the head\n\n**Time Complexity:**\n- Access by index: O(n)\n- Insert/Delete at head: O(1)\n- Insert/Delete at tail: O(1) with tail pointer (doubly linked), O(n) for singly linked\n- Insert/Delete at middle: O(n) to find position, O(1) for the actual operation\n- Search: O(n)\n\n**In Java:**\n- `LinkedList<E>` implements both `List` and `Deque`, making it a doubly linked list\n- Prefer `ArrayList` for most use cases due to better cache locality\n- Use `LinkedList` when you frequently insert/remove at the beginning or need a Deque\n\n### Array vs Linked List Comparison:\n\n| Operation | Array | Linked List |\n|-----------|-------|------------|\n| Access by index | O(1) | O(n) |\n| Insert at start | O(n) | O(1) |\n| Insert at end | O(1)* | O(1)** |\n| Delete from middle | O(n) | O(1)*** |\n| Memory | Compact, contiguous | Extra pointer overhead |\n| Cache friendliness | Excellent | Poor |\n\n\\* Amortized for dynamic arrays  \\*\\* With tail pointer  \\*\\*\\* After finding the node",
  code: `// ─── Array Operations ───
public class ArrayDemo {
    public static void main(String[] args) {
        // Fixed-size array
        int[] nums = new int[5];
        nums[0] = 10;  // O(1) access

        // Dynamic array (ArrayList)
        List<String> list = new ArrayList<>();
        list.add("A");         // O(1) amortized
        list.add(0, "B");     // O(n) — shifts elements
        list.get(0);           // O(1) random access
        list.remove(0);        // O(n) — shifts elements
    }
}

// ─── Singly Linked List Implementation ───
public class SinglyLinkedList<T> {
    private Node<T> head;
    private int size;

    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) { this.data = data; }
    }

    // O(1) — insert at head
    public void addFirst(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // O(n) — insert at tail
    public void addLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) { head = newNode; }
        else {
            Node<T> current = head;
            while (current.next != null)
                current = current.next;
            current.next = newNode;
        }
        size++;
    }

    // O(1) — remove from head
    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T data = head.data;
        head = head.next;
        size--;
        return data;
    }

    // O(n) — search
    public boolean contains(T data) {
        Node<T> current = head;
        while (current != null) {
            if (current.data.equals(data)) return true;
            current = current.next;
        }
        return false;
    }

    // O(n) — reverse the list
    public void reverse() {
        Node<T> prev = null, current = head, next;
        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        head = prev;
    }
}`,
  interviewQs: [
    {
      id: "21-1-q0",
      q: "When would you choose an ArrayList over a LinkedList in Java?",
      a: "Choose ArrayList for most cases because it offers O(1) random access by index, better cache locality due to contiguous memory, and lower memory overhead. Choose LinkedList only when you frequently insert/remove elements at the beginning of the list or need Deque functionality (double-ended queue). In practice, ArrayList outperforms LinkedList even for middle insertions in many cases due to CPU cache effects.",
      difficulty: "junior",
    },
    {
      id: "21-1-q1",
      q: "How would you detect a cycle in a linked list?",
      a: "Use Floyd's Cycle Detection (tortoise and hare) algorithm: use two pointers, slow (moves 1 step) and fast (moves 2 steps). If there's a cycle, they will eventually meet. If fast reaches null, there's no cycle. To find the cycle start, reset one pointer to head and move both one step at a time -- they meet at the cycle entry. Time: O(n), Space: O(1). This is better than using a HashSet which would be O(n) space.",
      difficulty: "mid",
    },
    {
      id: "21-1-q2",
      q: "Explain why ArrayList uses an Object[] internally and what implications this has for primitive types and memory layout.",
      a: "ArrayList stores elements in an Object[] array, meaning primitive types (int, long) must be autoboxed to wrapper types (Integer, Long), incurring memory overhead (Integer takes ~16 bytes vs 4 bytes for int). Each array slot holds a reference (8 bytes on 64-bit JVM) that points to the heap-allocated wrapper object, destroying data locality. For primitive-heavy workloads, specialized collections like IntArrayList (Eclipse Collections) or arrays avoid autoboxing. Java's Project Valhalla aims to solve this with value types that can be stored inline.",
      difficulty: "senior",
    },
  ],
  tip: "In interview coding problems, always clarify whether the array is sorted -- it determines whether you can use binary search (O(log n)) or must scan linearly (O(n)).",
  springConnection: null,
};
