import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "21-2",
  blockId: 21,
  title: "Stacks & Queues",
  summary:
    "A Stack follows LIFO (Last-In-First-Out) -- elements are added and removed from the top. A Queue follows FIFO (First-In-First-Out) -- elements are added at the back and removed from the front. Deque supports both patterns.",
  deepDive:
    "## Стек (Stack)\n\nСтруктура данных, работающая по принципу LIFO (Last In, First Out). Элементы добавляются и удаляются только с вершины (конца).\n\n### Операции:\n- **push** -- добавить элемент на вершину\n- **pop** -- удалить и вернуть элемент с вершины\n- **peek** -- посмотреть элемент на вершине без удаления\n- **isEmpty** -- проверка на пустоту\n\n### Применение:\n- Обратная польская нотация (вычисление выражений)\n- Обход в глубину (DFS)\n- Отмена действий (undo/redo)\n- Проверка скобок\n- Call stack в JVM\n\n## Очередь (Queue)\n\nСтруктура данных, работающая по принципу FIFO (First In, First Out). Элементы добавляются в конец очереди и удаляются с начала.\n\n### Операции:\n- **offer/add** -- добавить элемент в конец\n- **poll/remove** -- удалить и вернуть элемент из начала\n- **peek** -- посмотреть первый элемент без удаления\n\n### Применение:\n- Обход в ширину (BFS)\n- Планировщик задач\n- Буферизация данных\n- Обработка сообщений\n\n## Deque (Double-Ended Queue)\n\nОчередь с двумя концами -- поддерживает добавление и удаление с обоих концов. Может использоваться как стек и как очередь.\n\n---\n\n## Stack (LIFO)\n\nA stack is a linear data structure that follows the Last-In-First-Out principle. Only the top element is accessible.\n\n**Operations (all O(1)):**\n- `push(e)` -- add to top\n- `pop()` -- remove from top\n- `peek()` -- view top without removing\n- `isEmpty()` -- check if empty\n\n**Common Use Cases:**\n- Expression evaluation (postfix notation)\n- Depth-First Search (DFS)\n- Undo/Redo functionality\n- Balanced parentheses checking\n- JVM call stack (method invocation tracking)\n- Backtracking algorithms\n\n**In Java:**\n- Avoid `java.util.Stack` (legacy, synchronized, extends Vector)\n- Use `ArrayDeque<E>` as a stack instead (faster, not synchronized)\n\n## Queue (FIFO)\n\nA queue is a linear data structure that follows First-In-First-Out. Elements enter at the back and leave from the front.\n\n**Operations (all O(1)):**\n- `offer(e)` / `add(e)` -- enqueue at back\n- `poll()` / `remove()` -- dequeue from front\n- `peek()` / `element()` -- view front without removing\n\n**Common Use Cases:**\n- Breadth-First Search (BFS)\n- Task scheduling (thread pools)\n- Message queues (Kafka, RabbitMQ)\n- Print job management\n- Buffer for producer-consumer patterns\n\n**In Java:**\n- `LinkedList<E>` implements Queue\n- `ArrayDeque<E>` -- preferred general-purpose Queue implementation\n- `PriorityQueue<E>` -- elements ordered by natural order or Comparator (min-heap)\n- `BlockingQueue<E>` -- thread-safe, used in concurrent programming (ArrayBlockingQueue, LinkedBlockingQueue)\n\n## Deque (Double-Ended Queue)\n\nA deque supports insertion and removal at both ends, making it usable as both a stack and a queue.\n\n**In Java:** `ArrayDeque<E>` is the recommended implementation -- faster than Stack for LIFO and faster than LinkedList for FIFO, due to contiguous memory allocation and no node overhead.",
  code: `// ─── Stack using ArrayDeque (recommended) ───
import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();

        // Push (add to top)
        stack.push("A");
        stack.push("B");
        stack.push("C");
        // Stack: [C, B, A]  (C is on top)

        System.out.println(stack.peek());  // C (view top)
        System.out.println(stack.pop());   // C (remove top)
        System.out.println(stack.pop());   // B
        System.out.println(stack.size());  // 1
    }

    // Classic interview: check balanced parentheses
    public static boolean isBalanced(String expr) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : expr.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((c == ')' && open != '(') ||
                    (c == '}' && open != '{') ||
                    (c == ']' && open != '['))
                    return false;
            }
        }
        return stack.isEmpty();
    }
}

// ─── Queue using ArrayDeque ───
public class QueueDemo {
    public static void main(String[] args) {
        Deque<String> queue = new ArrayDeque<>();

        // Enqueue (add to back)
        queue.offer("A");
        queue.offer("B");
        queue.offer("C");
        // Queue: [A, B, C]  (A is at front)

        System.out.println(queue.peek());  // A (view front)
        System.out.println(queue.poll());  // A (remove front)
        System.out.println(queue.poll());  // B
    }
}

// ─── PriorityQueue (min-heap) ───
public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(30);
        minHeap.offer(10);
        minHeap.offer(20);

        // Always returns the smallest element
        System.out.println(minHeap.poll());  // 10
        System.out.println(minHeap.poll());  // 20
        System.out.println(minHeap.poll());  // 30

        // Max-heap using reverse comparator
        PriorityQueue<Integer> maxHeap =
            new PriorityQueue<>(Comparator.reverseOrder());
    }
}`,
  interviewQs: [
    {
      id: "21-2-q0",
      q: "Why should you prefer ArrayDeque over java.util.Stack?",
      a: "java.util.Stack extends Vector and is synchronized, adding unnecessary overhead for single-threaded use. It also inherits Vector's methods (like get(index)), which break the stack abstraction. ArrayDeque is faster because it uses a resizable array without synchronization, and its API is restricted to stack/queue operations (push, pop, peek). The Java documentation itself recommends ArrayDeque over Stack.",
      difficulty: "junior",
    },
    {
      id: "21-2-q1",
      q: "How would you implement a queue using two stacks?",
      a: "Use an 'inbox' stack for enqueue and an 'outbox' stack for dequeue. To enqueue, push onto inbox. To dequeue, if outbox is empty, pop all elements from inbox and push them onto outbox (reversing the order), then pop from outbox. This gives amortized O(1) per operation because each element is moved between stacks at most once. If outbox is not empty, just pop from it directly.",
      difficulty: "mid",
    },
    {
      id: "21-2-q2",
      q: "Explain the internal structure of PriorityQueue and its time complexity for offer, poll, and peek operations.",
      a: "PriorityQueue is backed by a binary min-heap stored in an array. The heap property ensures the smallest element (or highest priority per Comparator) is always at index 0. offer() inserts at the end and sifts up: O(log n). poll() removes the root, replaces it with the last element, and sifts down: O(log n). peek() returns the root without modification: O(1). Building a PriorityQueue from a collection uses heapify which is O(n). Note: PriorityQueue does not guarantee order of iteration -- only poll/peek respect the ordering.",
      difficulty: "senior",
    },
  ],
  tip: "In interviews, always use ArrayDeque for both stack and queue implementations -- it is more efficient than Stack and LinkedList, and interviewers will notice you know the modern best practice.",
  springConnection: null,
};
