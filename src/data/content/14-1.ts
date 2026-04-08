import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-1",
  blockId: 14,
  title: "Entity & Relationships",
  summary:
    "Entity -- класс-представление таблицы в БД. Аннотируется @Entity, @Table, @Id, @GeneratedValue, @Column. Связи между сущностями: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany. Атрибуты связей: mappedBy, fetch (LAZY/EAGER), cascade, orphanRemoval.\n\n---\n\nAn Entity is a class that maps to a database table. Annotated with @Entity, @Table, @Id, @GeneratedValue, @Column. Relationships: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany. Key attributes: mappedBy, fetch (LAZY/EAGER), cascade, orphanRemoval.",
  deepDive:
    "## Entity\n\n" +
    "Entity -- это класс, который является представлением таблицы или представления из БД. Правила создания:\n" +
    "- **@Entity** -- класс является сущностью\n" +
    "- **@Table** -- указывает для какой таблицы в БД эта сущность\n" +
    "- **@Id** -- поле является идентификатором\n" +
    "- **@GeneratedValue** -- стратегия автоматического формирования идентификатора (AUTO, IDENTITY, SEQUENCE, TABLE)\n" +
    "- **@Column** -- настройки столбца (name, nullable, unique, length)\n\n" +
    "## Отношения между Entity\n\n" +
    "- **@OneToOne** -- fetch по умолчанию: EAGER\n" +
    "- **@OneToMany / @ManyToOne** -- @OneToMany fetch: LAZY; @ManyToOne: EAGER\n" +
    "- **@ManyToMany** -- fetch по умолчанию: LAZY\n\n" +
    "**Атрибуты связей:**\n" +
    "- `mappedBy` -- указывает поле владельца связи на не-владеющей стороне\n" +
    "- `fetch` -- стратегия загрузки: LAZY или EAGER\n" +
    "- `cascade` -- операции каскадно (ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH)\n" +
    "- `orphanRemoval` -- удалять сиротские сущности\n\n" +
    "**@JoinColumn** -- указывает столбец внешнего ключа\n" +
    "**@JoinTable** -- создаёт промежуточную таблицу связей (для @ManyToMany)\n\n---\n\n" +
    "## JPA Entity\n\n" +
    "A JPA Entity is a POJO that maps to a relational database table. Requirements: must have `@Entity`, a no-arg constructor, must not be final, and must have an `@Id` field.\n\n" +
    "**ID Generation strategies** (`@GeneratedValue(strategy = ...)`):\n" +
    "- `IDENTITY` -- database auto-increment. Prevents batch inserts.\n" +
    "- `SEQUENCE` -- database sequence. Supports batch inserts via allocationSize.\n" +
    "- `TABLE` -- simulates sequence using a table. Portable but slower.\n" +
    "- `AUTO` -- provider chooses the best strategy.\n\n" +
    "## Entity Relationships\n\n" +
    "**Owning side vs Inverse side:** The owning side holds the FK. The inverse side uses `mappedBy`. Only changes from the owning side are persisted.\n\n" +
    "**Cascade types:** PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL.\n\n" +
    "**Fetch strategies:** EAGER loads immediately. LAZY loads on first access (proxy). Best practice: LAZY everywhere, eagerly fetch only when needed.\n\n" +
    "**orphanRemoval=true:** Removing a child from the parent's collection deletes it from the DB.",
  code: `@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // One-to-One: User has one Profile
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    // One-to-Many: User has many Orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    // Many-to-Many: User has many Roles
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // Helper methods for bidirectional sync
    public void addOrder(Order order) {
        orders.add(order);
        order.setUser(this);
    }

    public void removeOrder(Order order) {
        orders.remove(order);
        order.setUser(null);
    }
}

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    // Many-to-One: owning side (holds FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}`,
  interviewQs: [
    {
      id: "14-1-q0",
      q: "What is a JPA Entity and what annotations are required to map it to a database table?",
      a: "A JPA Entity is a Java class that represents a database table. Required annotations: @Entity on the class, @Id on the primary key field. Common: @Table(name) for table name, @GeneratedValue for auto-generated IDs, @Column for column settings. The class must have a no-arg constructor and must not be final.",
      difficulty: "junior",
    },
    {
      id: "14-1-q1",
      q: "Explain the difference between owning side and inverse side in JPA relationships. Why does it matter?",
      a: "The owning side has the foreign key column and controls persistence. The inverse side uses mappedBy. Only changes on the owning side are saved -- adding a child only to the inverse side's collection without setting the owning side means the relationship is not persisted. For @OneToMany, the @ManyToOne side is the owner. Always sync both sides using helper methods.",
      difficulty: "mid",
    },
    {
      id: "14-1-q2",
      q: "What are the trade-offs between CascadeType.REMOVE and orphanRemoval? When would you use each?",
      a: "CascadeType.REMOVE cascades delete when the parent is deleted. orphanRemoval=true also deletes a child when removed from the parent's collection, even if the parent is not deleted. Example: removing an item from order.getItems() with orphanRemoval=true DELETEs it from DB. With only CASCADE.REMOVE, removing from collection just breaks the relationship. Use orphanRemoval for composition relationships. Be cautious with CascadeType.ALL on @ManyToMany.",
      difficulty: "senior",
    },
  ],
  tip: "Всегда используйте LAZY загрузку по умолчанию и подтягивайте данные через JOIN FETCH или @EntityGraph только когда нужно.\n\n---\n\nAlways default to LAZY fetching and eagerly load data via JOIN FETCH or @EntityGraph only when actually needed.",
  springConnection: null,
};
