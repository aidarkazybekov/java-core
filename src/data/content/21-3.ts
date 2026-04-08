import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "21-3",
  blockId: 21,
  title: "Trees & Graphs",
  summary:
    "Trees are hierarchical structures with parent-child relationships. Binary Search Trees enable O(log n) lookups. Self-balancing trees (Red-Black, B-Tree) prevent worst-case degradation. Graphs model relationships with BFS and DFS traversals.",
  deepDive:
    "## Деревья\n\nПредставляют собой иерархические структуры с узлами и связями между ними. Каждый узел имеет «родителя» и «детей». Используется для эффективного поиска и сортировки данных.\n\n### Виды деревьев:\n\n- **Двоичное дерево (Binary Tree)** -- иерархическая структура, где каждый узел имеет не более двух потомков. Есть корневой узел и листья (узлы без потомков).\n\n- **Двоичное дерево поиска (BST)** -- двоичное дерево, где левый подузел меньше корня, правый больше. Обеспечивает эффективный поиск O(log n) в сбалансированном случае.\n\n- **Красно-чёрное дерево (Red-Black Tree)** -- самобалансирующееся двоичное дерево поиска, где каждый узел является либо красным, либо чёрным. Правила:\n  - Корневой узел и листья (nil) всегда чёрные\n  - Если узел красный, то оба потомка чёрные\n  - Пути от каждого узла до листьев содержат одинаковое количество чёрных узлов\n  - Гарантирует O(log n) для всех операций\n\n- **B-дерево (B-Tree)** -- сбалансированное дерево для работы с дисковой памятью. Каждый узел может содержать несколько ключей и потомков. Используется в базах данных (индексы) и файловых системах.\n\n- **Куча (Heap)** -- полное двоичное дерево, где родитель всегда больше (max-heap) или меньше (min-heap) потомков.\n\n### Обходы деревьев:\n\n- **Preorder (прямой):** корень -> левый -> правый\n- **Inorder (симметричный):** левый -> корень -> правый (для BST даёт отсортированный порядок)\n- **Postorder (обратный):** левый -> правый -> корень\n- **Level-order (по уровням):** обход в ширину (BFS)\n\n## Графы\n\nГраф -- структура данных, состоящая из вершин (узлов) и рёбер (связей между ними).\n\n### Алгоритмы обхода:\n\n- **Поиск в ширину (BFS)** -- использует очередь, обходит по уровням\n- **Поиск в глубину (DFS)** -- использует стек (или рекурсию), идёт вглубь\n\n---\n\n## Trees\n\nTrees are hierarchical, non-linear data structures consisting of nodes connected by edges, with a single root node and no cycles.\n\n### Binary Tree:\nEach node has at most two children (left, right). A full binary tree has every node with 0 or 2 children. A complete binary tree fills all levels except possibly the last (filled left to right). A perfect binary tree has all levels completely filled.\n\n### Binary Search Tree (BST):\nA binary tree where for every node: left subtree values < node value < right subtree values.\n- **Balanced BST:** O(log n) for search, insert, delete\n- **Degenerate (skewed) BST:** O(n) -- behaves like a linked list\n\n### Red-Black Tree:\nA self-balancing BST used internally by Java's `TreeMap` and `TreeSet`. Guarantees O(log n) worst-case for all operations by enforcing:\n1. Every node is red or black\n2. Root is always black\n3. No two consecutive red nodes (red parent cannot have red child)\n4. Every path from a node to its null leaves has the same black count\n\nRotations and recoloring maintain these properties after insertions/deletions.\n\n### B-Tree:\nA balanced multi-way tree optimized for disk I/O. Each node can contain multiple keys and have many children. Used for database indexes (PostgreSQL, MySQL InnoDB). B+ Tree variant stores all data in leaf nodes, linked for efficient range queries.\n\n### Heap:\nA complete binary tree satisfying the heap property: parent >= children (max-heap) or parent <= children (min-heap). Backed by an array. Used for priority queues and heap sort.\n\n## Graphs\n\nA graph G = (V, E) consists of vertices (V) and edges (E). Edges can be directed or undirected, weighted or unweighted.\n\n### Traversal Algorithms:\n- **BFS (Breadth-First Search)** -- uses a Queue, explores level by level. Finds shortest path in unweighted graphs. O(V + E).\n- **DFS (Depth-First Search)** -- uses a Stack (or recursion), explores as deep as possible before backtracking. Used for cycle detection, topological sort. O(V + E).\n\n### Representations:\n- **Adjacency Matrix** -- O(V^2) space, O(1) edge lookup\n- **Adjacency List** -- O(V + E) space, more memory-efficient for sparse graphs",
  code: `// ─── Binary Search Tree Implementation ───
public class BST<T extends Comparable<T>> {
    private Node<T> root;

    private static class Node<T> {
        T data;
        Node<T> left, right;
        Node(T data) { this.data = data; }
    }

    // O(log n) average — insert
    public void insert(T value) {
        root = insertRec(root, value);
    }

    private Node<T> insertRec(Node<T> node, T value) {
        if (node == null) return new Node<>(value);
        int cmp = value.compareTo(node.data);
        if (cmp < 0) node.left = insertRec(node.left, value);
        else if (cmp > 0) node.right = insertRec(node.right, value);
        return node;
    }

    // O(log n) average — search
    public boolean contains(T value) {
        Node<T> current = root;
        while (current != null) {
            int cmp = value.compareTo(current.data);
            if (cmp == 0) return true;
            current = cmp < 0 ? current.left : current.right;
        }
        return false;
    }

    // Inorder traversal → sorted output
    public void inorder(Node<T> node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.data + " ");
        inorder(node.right);
    }
}

// ─── BFS & DFS on a Graph (Adjacency List) ───
public class GraphTraversal {
    private Map<Integer, List<Integer>> adj = new HashMap<>();

    public void addEdge(int u, int v) {
        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    // BFS — uses Queue, finds shortest path
    public void bfs(int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new ArrayDeque<>();
        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            for (int neighbor : adj.getOrDefault(node, List.of())) {
                if (visited.add(neighbor)) {
                    queue.offer(neighbor);
                }
            }
        }
    }

    // DFS — uses Stack (or recursion)
    public void dfs(int start) {
        Set<Integer> visited = new HashSet<>();
        dfsHelper(start, visited);
    }

    private void dfsHelper(int node, Set<Integer> visited) {
        visited.add(node);
        System.out.print(node + " ");
        for (int neighbor : adj.getOrDefault(node, List.of())) {
            if (!visited.contains(neighbor)) {
                dfsHelper(neighbor, visited);
            }
        }
    }
}`,
  interviewQs: [
    {
      id: "21-3-q0",
      q: "What is the difference between BFS and DFS, and when would you use each?",
      a: "BFS (Breadth-First Search) uses a queue and explores nodes level by level -- it finds the shortest path in unweighted graphs and is used for level-order tree traversal. DFS (Depth-First Search) uses a stack or recursion and explores as deep as possible before backtracking -- it is used for cycle detection, topological sorting, and path finding in mazes. Both are O(V + E). Use BFS for shortest path, DFS for exhaustive search.",
      difficulty: "junior",
    },
    {
      id: "21-3-q1",
      q: "Why does Java's TreeMap use a Red-Black Tree instead of a simple BST or AVL tree?",
      a: "A simple BST can degrade to O(n) if elements are inserted in sorted order (becomes a linked list). Red-Black Trees guarantee O(log n) worst-case for search, insert, and delete. Compared to AVL trees (which are more strictly balanced), Red-Black Trees require fewer rotations on insert/delete operations, making them faster for write-heavy workloads. AVL trees provide faster lookups (shorter height) but are more expensive to maintain. TreeMap chose Red-Black as a good balance between read and write performance.",
      difficulty: "mid",
    },
    {
      id: "21-3-q2",
      q: "Explain how a B-Tree works and why databases use B+ Trees for indexing instead of binary trees.",
      a: "A B-Tree of order m allows each node to have up to m children and m-1 keys. It stays balanced by splitting and merging nodes. Databases prefer B+ Trees because: (1) they minimize disk I/O -- each node maps to a disk page, and high branching factor means fewer levels (a 3-level B+ Tree with order 1000 can index billions of rows). (2) All data lives in leaf nodes, which are linked, enabling efficient range scans. (3) Internal nodes store only keys, fitting more per page. Binary trees would be too deep (log2 vs logM) causing too many disk seeks for large datasets.",
      difficulty: "senior",
    },
  ],
  tip: "For interview tree problems, always consider edge cases: empty tree (null root), single node, skewed tree (all left or all right children), and duplicate values.",
  springConnection: null,
};
