import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-3",
  blockId: 14,
  title: "Persistence Context & Entity Lifecycle",
  summary:
    "Persistence Context -- кэш первого уровня, управляемый EntityManager. Сущности проходят через состояния: Transient (не связана с PC), Persistent/Managed (связана, имеет ID), Detached (отсоединена от PC), Removed (запланирована к удалению).\n\n---\n\nPersistence Context is a first-level cache managed by EntityManager. Entities pass through states: Transient (not associated with PC), Persistent/Managed (associated, has ID), Detached (disconnected from PC), Removed (scheduled for deletion).",
  deepDive:
    "## Persistence Context\n\n" +
    "- **DataSource** -- интерфейс настроек подключения к БД\n" +
    "- **EntityManager** -- основной интерфейс для управления сущностями (Entity)\n\n" +
    "Persistence Context -- кэш первого уровня Hibernate. Все сущности в рамках транзакции хранятся в нём. Повторный запрос возвращает объект из кэша.\n\n" +
    "## Entity Lifecycle\n\n" +
    "- **Transient** -- экземпляр создан, не связан с PC\n" +
    "- **Persistent (Managed)** -- связан с PC, имеет ID, соответствует строке в БД\n" +
    "- **Detached** -- имеет ID, но не связан с PC\n" +
    "- **Removed** -- имеет ID, связан с PC, запланирован к удалению\n\n" +
    "## Кэширование Hibernate\n\n" +
    "- **First Level Cache** -- Persistence Context (привязан к сессии/транзакции)\n" +
    "- **Second Level Cache** -- общий для приложения (EhCache, Infinispan)\n\n---\n\n" +
    "## Persistence Context (First-Level Cache)\n\n" +
    "Key behaviors:\n" +
    "- **Identity guarantee:** One Java object per DB row within a PC.\n" +
    "- **Dirty checking:** Hibernate compares entity state with snapshot at flush time.\n" +
    "- **Write-behind:** SQL batched and executed at flush (before commit, before queries, or on explicit flush()).\n\n" +
    "## Entity Lifecycle States\n\n" +
    "- **Transient:** `new User()` -- not in PC. persist() moves to Managed.\n" +
    "- **Managed:** Tracked by Hibernate. Changes auto-detected and flushed.\n" +
    "- **Detached:** PC was closed. merge() re-attaches.\n" +
    "- **Removed:** remove() called -- DELETE scheduled at flush.\n\n" +
    "**EntityManager methods:** persist(), merge(), remove(), find(), detach(), flush(), clear().\n\n" +
    "## Second-Level Cache\n\n" +
    "Shared across sessions. Per-entity with @Cacheable. Useful for read-heavy, rarely-changing data.",
  code: `// ===== Entity Lifecycle in action =====
@Service
@Transactional
public class UserService {

    @PersistenceContext
    private EntityManager em;

    public void demonstrateLifecycle() {
        // 1. Transient: new object, not in Persistence Context
        User user = new User();
        user.setName("John");

        // 2. Managed: after persist(), user is tracked
        em.persist(user);  // INSERT queued

        // 3. Dirty checking: changes auto-detected
        user.setName("Jane");  // No explicit save needed!

        // 4. Flush: sync PC with database
        em.flush();  // INSERT + UPDATE executed

        // 5. Detach: remove from PC
        em.detach(user);
        user.setName("Bob");  // NOT tracked, change lost

        // 6. Merge: re-attach detached entity
        User managed = em.merge(user);
        // 'managed' is the PC copy, 'user' is still detached

        // 7. Remove: schedule for deletion
        em.remove(managed);  // DELETE queued
    }

    // Identity guarantee
    public void identityDemo() {
        User u1 = em.find(User.class, 1L);  // SQL SELECT
        User u2 = em.find(User.class, 1L);  // No SQL, from PC cache
        assert u1 == u2;  // true! Same reference
    }
}

// ===== Second-Level Cache =====
@Entity
@Cacheable
@org.hibernate.annotations.Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class Country {
    @Id
    private String code;
    private String name;
}

// application.yml:
// spring.jpa.properties.hibernate.cache.use_second_level_cache=true`,
  interviewQs: [
    {
      id: "14-3-q0",
      q: "What is the Persistence Context in JPA?",
      a: "The Persistence Context is a first-level cache storing managed entities within a transaction. EntityManager is the API for it. Every entity loaded is cached in the PC. Repeated lookups by ID return the same object (identity guarantee). Changes to managed entities are auto-detected (dirty checking) and synced with DB at flush/commit.",
      difficulty: "junior",
    },
    {
      id: "14-3-q1",
      q: "Describe the four JPA Entity lifecycle states and transitions between them.",
      a: "1) Transient: created with 'new', not in PC. persist() -> Managed. 2) Managed: in PC, tracked. Changes auto-synced via dirty checking. 3) Detached: was managed but PC closed or detach() called. merge() re-attaches. 4) Removed: remove() called, DELETE scheduled. Key: only Managed entities are tracked. After detach, changes are lost unless merge() is called.",
      difficulty: "mid",
    },
    {
      id: "14-3-q2",
      q: "How does Hibernate dirty checking work? How can you optimize it?",
      a: "When loaded, Hibernate stores a field snapshot. At flush, it compares every managed entity's current state with its snapshot. O(N*M) comparisons can be expensive. Optimizations: (1) @Transactional(readOnly=true) skips dirty checking. (2) Use DTO projections for reads. (3) Detach unneeded entities. (4) StatelessSession for bulk ops. (5) @DynamicUpdate generates UPDATE only for changed columns.",
      difficulty: "senior",
    },
  ],
  tip: "Для read-only операций используйте `@Transactional(readOnly = true)` -- Hibernate пропускает dirty checking.\n\n---\n\nFor read-only operations use `@Transactional(readOnly = true)` -- Hibernate skips dirty checking.",
  springConnection: null,
};
