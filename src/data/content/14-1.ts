import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-1",
  blockId: 14,
  title: "Entity & Relationships",
  summary:
    "Entity -- класс-представление таблицы БД, помечается @Entity. Связи между сущностями: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany с параметрами fetch, cascade, mappedBy. @JoinColumn для внешних ключей, @JoinTable для связующих таблиц.\n\n---\n\nAn Entity is a class representing a database table, annotated with @Entity. Relationships: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany with fetch, cascade, mappedBy parameters. @JoinColumn for foreign keys, @JoinTable for join tables.",
  deepDive:
    "## Entity\n\nEntity -- это класс, который является представлением таблицы или представления из БД. Основные аннотации:\n- **@Entity** -- класс является сущностью\n- **@Table** -- указывает таблицу в БД\n- **@Id** -- поле является идентификатором\n- **@GeneratedValue** -- стратегия генерации ID\n- **@Column** -- настройки столбца\n\n## Отношения между Entity\n\n- **@OneToOne**: mappedBy (не-владеющая сторона), fetch (EAGER по умолчанию), optional, cascade, orphanRemoval\n- **@OneToMany**: cascade, fetch (LAZY по умолчанию), mappedBy, orphanRemoval\n- **@ManyToMany**: cascade, fetch (LAZY по умолчанию), mappedBy\n- **@JoinColumn** -- столбец внешнего ключа (для O2O и M2O)\n- **@JoinTable** -- связующая таблица (для M2M)\n\n**Cascade** (CascadeType): ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH -- операции, распространяемые каскадно на связанные сущности.\n\n---\n\n**JPA Entity requirements**: The class must have @Entity, a no-arg constructor (public or protected), and an @Id field. It should not be final (Hibernate uses proxies via CGLIB).\n\n**@GeneratedValue strategies**:\n- `IDENTITY` -- database auto-increment (MySQL)\n- `SEQUENCE` -- database sequence (PostgreSQL, Oracle)\n- `TABLE` -- separate table for ID generation\n- `AUTO` -- provider chooses the best strategy\n\n**Relationship mapping rules**:\n- The **owning side** has the foreign key column (@JoinColumn). For @OneToMany, the @ManyToOne side is typically the owner.\n- The **inverse side** uses `mappedBy` to point to the owning field name.\n- **Fetch types**: EAGER loads immediately (default for @OneToOne, @ManyToOne); LAZY loads on first access (default for @OneToMany, @ManyToMany). Always prefer LAZY to avoid N+1 problems.\n- **Cascade operations** propagate entity state changes to related entities. PERSIST saves children with parent; REMOVE deletes children with parent; MERGE updates children.\n- **orphanRemoval = true** deletes child entities when removed from the parent's collection, even without CascadeType.REMOVE.\n\nBest practices: Always define the owning side explicitly, use LAZY fetch by default, be careful with CascadeType.ALL (can accidentally cascade removes), and avoid bidirectional @ManyToMany when possible (use an explicit join entity instead).",
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

    // One user has one profile (owning side)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private UserProfile profile;

    // One user has many orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    // Many users belong to many roles
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

    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // Many orders belong to one user (owning side -- has FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}`,
  interviewQs: [
    {
      id: "14-1-q0",
      q: "What annotations define a JPA entity and its relationships? What is the owning side?",
      a: "@Entity marks a class as a JPA entity, @Table specifies the table, @Id marks the primary key. Relationships: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany. The owning side is the entity that holds the foreign key (@JoinColumn). The inverse side uses mappedBy. For @OneToMany, the @ManyToOne side is the owner.",
      difficulty: "junior",
    },
    {
      id: "14-1-q1",
      q: "Explain the different CascadeTypes. When should you use CascadeType.ALL vs specific types?",
      a: "PERSIST cascades save, MERGE cascades update, REMOVE cascades delete, REFRESH reloads from DB, DETACH detaches from persistence context. ALL enables all. Use ALL cautiously -- it includes REMOVE, which can accidentally delete related entities. Prefer explicit types: PERSIST + MERGE for parent-child (create/update but not delete children automatically). Only add REMOVE when child entities have no meaning without the parent. orphanRemoval=true is safer than CascadeType.REMOVE for collection relationships.",
      difficulty: "mid",
    },
    {
      id: "14-1-q2",
      q: "Why should you avoid bidirectional @ManyToMany and use a join entity instead? What are the trade-offs?",
      a: "Bidirectional @ManyToMany has limitations: you cannot store additional columns on the join table (like 'assignedDate'), CascadeType.REMOVE is dangerous (removing one side deletes the other), and Hibernate generates inefficient SQL for collection modifications (deletes all + re-inserts). An explicit join entity (e.g., UserRole with @ManyToOne to both User and Role) gives full control: extra columns, individual CRUD, optimized queries, and auditing. The trade-off is more code and explicit management, but it's worth it for anything beyond trivial lookups.",
      difficulty: "senior",
    },
  ],
  tip: "Always use `FetchType.LAZY` for collections (@OneToMany, @ManyToMany) and load related data explicitly with JOIN FETCH or @EntityGraph when needed.\n\n---\n\nВсегда используйте `FetchType.LAZY` для коллекций (@OneToMany, @ManyToMany) и загружайте связанные данные явно через JOIN FETCH или @EntityGraph при необходимости.",
  springConnection: null,
};
