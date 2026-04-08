import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "6-7",
  blockId: 6,
  title: "Comparable vs Comparator",
  summary:
    "Оба интерфейса используются для сравнения объектов. Comparable<T> определяет естественный порядок сортировки -- класс реализует метод compareTo(T o). Comparator<T> определяет альтернативный порядок сортировки -- имеет метод compare(T o1, T o2).\n\n---\n\nComparable defines a class's natural ordering via compareTo(), while Comparator provides external, reusable sorting strategies. Java 8 added powerful Comparator factory methods that eliminate boilerplate and enable clean, chainable sort expressions.",
  deepDive:
    "В чем разница между Comparator и Comparable?\n\nОба интерфейса используются для сравнения объектов.\n\n- Comparable<T> определяет естественный порядок сортировки для объектов. Класс, реализующий Comparable<T>, определяет метод compareTo(T o).\n- Comparator<T> определяет альтернативный порядок сортировки для объектов. Имеет метод compare(T o1, T o2).\n\nНотация Big O используется для описания временной и пространственной сложности алгоритма:\n- O(1) -- константная сложность.\n- O(log n) -- логарифмическая сложность.\n- O(n) -- линейная сложность.\n- O(n log n) -- линейно-логарифмическая сложность, часто встречается в алгоритмах сортировки.\n- O(n^2) -- квадратичная сложность.\n\n---\n\nComparable<T> is implemented by the class itself, defining its natural ordering. It has a single method: int compareTo(T other). The contract: return negative if this < other, zero if equal, positive if this > other. Consistency with equals is strongly recommended: if compareTo returns 0, equals should return true. Violating this breaks TreeSet and TreeMap, which use compareTo for equality. String, Integer, LocalDate, and most JDK value types implement Comparable.\n\nComparator<T> is a separate object that defines an external ordering strategy. It decouples sorting logic from the class being sorted, enabling multiple sort orders for the same type. Before Java 8, Comparators required verbose anonymous classes. Java 8 transformed this with static factory methods: Comparator.comparing(keyExtractor), thenComparing() for chaining, reversed() for descending order, and nullsFirst()/nullsLast() for null handling.\n\nKey differences: a class can have only one natural ordering (Comparable), but unlimited Comparator instances. Comparable is defined at class design time; Comparator can be created by anyone at any time. Use Comparable for the obvious, default ordering (e.g., String alphabetical, Integer numerical). Use Comparator for alternative orderings (sort by name, then by age, then by salary).\n\nCommon interview traps: (1) Integer overflow in comparisons -- never return a - b for compareTo, use Integer.compare(a, b) instead, because subtraction can overflow. (2) Inconsistency between compareTo and equals causing TreeSet/HashMap behavior differences. (3) Understanding that Collections.sort uses TimSort, which is stable and O(n log n). Arrays.sort uses dual-pivot quicksort for primitives (not stable) and TimSort for objects (stable).",
  code: `import java.util.*;

// Natural ordering with Comparable
public class Employee implements Comparable<Employee> {
    private String name;
    private int age;
    private double salary;

    public Employee(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    // Natural ordering: by name alphabetically
    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);
    }

    // Getters
    public String getName() { return name; }
    public int getAge() { return age; }
    public double getSalary() { return salary; }

    @Override
    public String toString() {
        return name + "(" + age + ", $" + salary + ")";
    }

    public static void main(String[] args) {
        List<Employee> team = new ArrayList<>(List.of(
            new Employee("Charlie", 30, 80000),
            new Employee("Alice", 25, 90000),
            new Employee("Bob", 35, 75000),
            new Employee("Alice", 28, 85000)
        ));

        // Natural ordering (Comparable): by name
        Collections.sort(team);
        System.out.println("By name: " + team);

        // Comparator: by age
        team.sort(Comparator.comparingInt(Employee::getAge));
        System.out.println("By age: " + team);

        // Chained: by name, then by age, then by salary descending
        Comparator<Employee> complex = Comparator
            .comparing(Employee::getName)
            .thenComparingInt(Employee::getAge)
            .thenComparingDouble(Employee::getSalary).reversed();
        team.sort(complex);
        System.out.println("Complex: " + team);

        // Null-safe comparator
        Comparator<Employee> nullSafe = Comparator.nullsLast(
            Comparator.comparing(Employee::getName)
        );

        // WRONG: integer overflow risk!
        // Comparator<Employee> bad = (a, b) -> a.getAge() - b.getAge();
        // CORRECT: use Integer.compare
        Comparator<Employee> safe = (a, b) -> Integer.compare(a.getAge(), b.getAge());

        // TreeSet with custom Comparator
        TreeSet<Employee> bySalary = new TreeSet<>(
            Comparator.comparingDouble(Employee::getSalary)
        );
        bySalary.addAll(team);
    }
}`,
  interviewQs: [
    {
      id: "6-7-q0",
      q: "What is the difference between Comparable and Comparator?",
      a: "Comparable is implemented by the class itself to define its natural ordering via compareTo(). A class can have only one natural ordering. Comparator is a separate functional interface that defines an external sorting strategy via compare(). You can create multiple Comparators for different sort orders. Use Comparable for the default sort order (String alphabetical), and Comparator when you need alternative orderings or can't modify the class.",
      difficulty: "junior",
    },
    {
      id: "6-7-q1",
      q: "Why should you never use subtraction (a - b) to implement compareTo?",
      a: "Integer overflow. If a = Integer.MAX_VALUE and b = -1, then a - b overflows to a negative number, giving the wrong comparison result. This can cause incorrect sorting, TreeMap corruption, and subtle bugs that only appear with extreme values. Always use Integer.compare(a, b), Long.compare(a, b), or Double.compare(a, b), which handle all edge cases correctly including overflow and special floating-point values like NaN.",
      difficulty: "mid",
    },
    {
      id: "6-7-q2",
      q: "What does it mean for compareTo to be 'consistent with equals,' and what breaks if it is not?",
      a: "Consistent with equals means: (a.compareTo(b) == 0) should imply a.equals(b) and vice versa. If violated, collections using compareTo for equality (TreeSet, TreeMap) behave differently from those using equals (HashSet, HashMap). Example: BigDecimal('1.0') and BigDecimal('1.00') are equal via compareTo but not via equals. A TreeSet treats them as duplicates (size 1), while a HashSet stores both (size 2). This inconsistency causes bugs when switching collection implementations. The Comparable contract states this is 'strongly recommended but not required,' and classes violating it should document the inconsistency.",
      difficulty: "senior",
    },
  ],
  tip: "Always use Comparator.comparing() with method references in modern Java. Writing Comparator.comparing(Employee::getName).thenComparingInt(Employee::getAge) in an interview immediately signals you write modern, clean Java.",
  springConnection: {
    concept: "Comparable vs Comparator",
    springFeature: "Spring Data sorting with Sort and @OrderBy",
    explanation:
      "Spring Data's Sort.by('name').ascending() mirrors the Comparator.comparing() pattern but translates to SQL ORDER BY clauses. The @OrderBy JPA annotation defines default ordering on entity collections. Understanding Comparable/Comparator helps grasp how Spring Data translates programmatic sort expressions into database queries.",
  },
};
