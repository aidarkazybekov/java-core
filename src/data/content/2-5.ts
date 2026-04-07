import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "2-5",
  blockId: 2,
  title: "Arrays",
  summary:
    "Arrays are Java's most fundamental data structure — fixed-size, type-safe, and stored contiguously in heap memory. Understanding how arrays work at the memory level, their covariance problem, and their relationship to generics explains many design decisions in the Collections framework.",
  deepDive:
    "Arrays in Java are objects that live on the heap, even arrays of primitives. An `int[100]` is a single contiguous block of 400 bytes (plus object header) on the heap — no boxing, no pointer chasing. This is why primitive arrays vastly outperform `List<Integer>` for number crunching. Array length is fixed at creation and stored in the object header. Accessing `.length` is an O(1) field read, not a method call.\n\n" +
    "Array covariance is a well-known design mistake in Java. `String[]` is a subtype of `Object[]`, which seems logical but breaks type safety at runtime. You can assign a `String[]` to an `Object[]` reference and then store an `Integer` in it — this compiles fine but throws `ArrayStoreException` at runtime. Generics were designed to avoid this mistake: `List<String>` is NOT a subtype of `List<Object>`. This is why Java generics use wildcards (`List<? extends Object>`) instead of covariance.\n\n" +
    "Multi-dimensional arrays in Java are actually arrays of arrays (jagged arrays), not true rectangular matrices. `int[][] matrix = new int[3][4]` creates 4 objects: one `int[][]` of length 3, and three `int[]` of length 4 each. Each row can have a different length: `matrix[0] = new int[10]` is valid. This has performance implications — accessing `matrix[i][j]` involves two pointer dereferences and poor cache locality compared to a flat `int[rows * cols]` array.\n\n" +
    "Arrays and generics do not mix well. You cannot create a generic array: `new T[10]` does not compile because of type erasure — at runtime, the JVM does not know what T is and cannot perform the array store check. The workaround is `(T[]) new Object[10]` which produces an unchecked cast warning. This is why `ArrayList<T>` internally uses `Object[]` and casts on retrieval. `Arrays.copyOf()` uses reflection (`Array.newInstance()`) to create a properly typed array.\n\n" +
    "The `Arrays` utility class provides essential operations: `Arrays.sort()` uses dual-pivot quicksort for primitives (O(n log n) average, not stable) and TimSort for objects (O(n log n), stable, based on natural runs). `Arrays.asList()` returns a fixed-size list backed by the array — changes to the list reflect in the array and vice versa, but you cannot add/remove elements. `List.of()` (Java 9+) creates a truly immutable list. `Arrays.stream()` bridges arrays to the Stream API. For equality, use `Arrays.equals()` (not `==`) for 1D arrays and `Arrays.deepEquals()` for multi-dimensional arrays.",
  code:
    `import java.util.Arrays;
import java.util.List;

public class ArraysDemo {
    public static void main(String[] args) {
        // === Array Covariance Problem ===
        String[] strings = {"hello", "world"};
        Object[] objects = strings; // compiles! String[] is a subtype of Object[]
        try {
            objects[0] = 42; // compiles! but throws at runtime
        } catch (ArrayStoreException e) {
            System.out.println("ArrayStoreException: " + e.getMessage());
        }

        // Generics fixed this: List<String> is NOT a subtype of List<Object>
        // List<Object> list = new ArrayList<String>(); // COMPILE ERROR

        // === Arrays.asList() gotchas ===
        // Returns a fixed-size list backed by the array
        String[] arr = {"a", "b", "c"};
        List<String> fixedList = Arrays.asList(arr);
        fixedList.set(0, "x"); // OK — modifies the original array too!
        System.out.println("\\nArray after list.set: " + Arrays.toString(arr)); // [x, b, c]

        try {
            fixedList.add("d"); // UnsupportedOperationException!
        } catch (UnsupportedOperationException e) {
            System.out.println("Cannot add to Arrays.asList result");
        }

        // Primitive array trap: asList treats int[] as a single element
        int[] primitives = {1, 2, 3};
        var badList = Arrays.asList(primitives); // List<int[]>, NOT List<Integer>!
        System.out.println("\\nasList(int[]) size: " + badList.size()); // 1, not 3!

        // Correct: use Integer[] or IntStream
        Integer[] boxed = {1, 2, 3};
        List<Integer> goodList = Arrays.asList(boxed); // size = 3

        // === Jagged arrays (arrays of arrays) ===
        int[][] jagged = new int[3][];
        jagged[0] = new int[]{1, 2};
        jagged[1] = new int[]{3, 4, 5, 6};
        jagged[2] = new int[]{7};
        System.out.println("\\nJagged array row lengths: " +
            jagged[0].length + ", " + jagged[1].length + ", " + jagged[2].length);

        // === Array equality ===
        int[] a = {1, 2, 3};
        int[] b = {1, 2, 3};
        System.out.println("\\na == b: " + (a == b));                 // false (different objects)
        System.out.println("Arrays.equals: " + Arrays.equals(a, b)); // true (content)

        int[][] nested1 = {{1, 2}, {3, 4}};
        int[][] nested2 = {{1, 2}, {3, 4}};
        System.out.println("Arrays.equals (2D): " +
            Arrays.equals(nested1, nested2));                          // false!
        System.out.println("Arrays.deepEquals (2D): " +
            Arrays.deepEquals(nested1, nested2));                      // true

        // === System.arraycopy — fastest bulk copy ===
        int[] src = {10, 20, 30, 40, 50};
        int[] dest = new int[5];
        System.arraycopy(src, 1, dest, 0, 3); // copy 3 elements starting from index 1
        System.out.println("\\narraycopy result: " + Arrays.toString(dest)); // [20, 30, 40, 0, 0]

        // === Sorting: primitives vs objects ===
        int[] nums = {5, 2, 8, 1, 9};
        Arrays.sort(nums); // dual-pivot quicksort (not stable, O(n log n))
        System.out.println("\\nSorted: " + Arrays.toString(nums));

        // Object sort uses TimSort (stable)
        String[] words = {"banana", "apple", "cherry"};
        Arrays.sort(words); // TimSort, stable, O(n log n)
        System.out.println("Sorted: " + Arrays.toString(words));
    }
}`,
  interviewQs: [
    {
      id: "2-5-q0",
      q: "What is the difference between Arrays.asList() and List.of()?",
      a: "Arrays.asList() returns a fixed-size list backed by the original array. You can modify elements (set) but cannot add or remove (throws UnsupportedOperationException). Changes through the list reflect in the array and vice versa. It allows null elements. List.of() (Java 9+) returns a truly immutable list — no set, add, or remove operations are allowed, and it does not permit null elements. Also, Arrays.asList(primitiveArray) treats the entire array as a single element (producing List<int[]>), while there is no such trap with List.of().",
      difficulty: "junior",
    },
    {
      id: "2-5-q1",
      q: "What is array covariance in Java and why is it considered a design mistake?",
      a: "Array covariance means String[] is a subtype of Object[], so you can assign a String[] to an Object[] reference. This breaks type safety: you can then store any Object in the array, and the JVM must check every store operation at runtime (ArrayStoreException if the type is wrong). This was a design decision from Java 1.0 to allow generic-like programming before generics existed. When generics were added in Java 5, they were deliberately made invariant (List<String> is not a subtype of List<Object>) to avoid this problem. Wildcards (List<? extends Object>) provide a type-safe alternative to covariance. The array store check also has a performance cost on every write operation.",
      difficulty: "mid",
    },
    {
      id: "2-5-q2",
      q: "Why can you not create a generic array (new T[]) in Java, and how do collection classes work around this?",
      a: "Generic types are erased at runtime — T becomes Object, so `new T[10]` would actually be `new Object[10]`, which cannot perform the correct ArrayStoreException checks. If you could create a `T[]` and assign it to an `Object[]` reference via covariance, you could store the wrong type without any runtime check catching it, violating type safety entirely. ArrayList works around this by using an internal `Object[]` array and casting to `T` on retrieval — the cast is unchecked but safe because only properly-typed elements are added through the typed API. `Arrays.copyOf()` and `Array.newInstance()` use reflection to create properly typed arrays when the Class<T> token is available. In practice, `@SuppressWarnings(\"unchecked\") T[] arr = (T[]) new Object[size]` is the standard pattern, used even within the JDK itself.",
      difficulty: "senior",
    },
  ],
  tip: "Arrays.asList(int[]) creates a List<int[]> with one element, not a List<Integer>. For primitives, use Arrays.stream(intArray).boxed().toList() or IntStream.of(intArray).boxed().toList().",
  springConnection: null,
};
