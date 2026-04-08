import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-3",
  blockId: 14,
  title: "Persistence Context & Entity Lifecycle",
  summary:
    "Persistence Context (контекст персистентности) управляет сущностями через EntityManager. Состояния сущности: Transient (новый, не связан с PC), Persistent/Managed (связан с PC), Detached (отсоединен от PC), Removed (запланирован к удалению).\n\n---\n\nThe Persistence Context manages entities via EntityManager. Entity states: Transient (new, not in PC), Persistent/Managed (attached to PC), Detached (disconnected from PC), Removed (scheduled for deletion).",
  deepDive:
    "## Persistence Context\n\n- **DataSource** -- интерфейс, описывающий настройки подключения к БД. Из него можно взять созданный Connection.\n- **EntityManager** -- основной интерфейс для управления сущностями (Entity). С его помощью можно создавать запросы, управлять состоянием сущностей и формировать запросы.\n\nPersistence Context -- это кэш первого уровня (first-level cache), который существует в рамках одной транзакции.\n\n## Entity Lifecycle\n\n- **Transient** -- экземпляр сущности создан, но не связан с PC. Нет ID, нет соответствующей строки в БД.\n- **Persistent (Managed)** -- сущность связана с PC, имеет ID и соответствует строке в БД. Все изменения автоматически синхронизируются с БД (dirty checking).\n- **Detached** -- сущность имеет идентификатор, но больше не связана с PC. Изменения не отслеживаются.\n- **Removed** -- сущность имеет ID и связана с PC, но запланирована к удалению.\n\n---\n\nThe **Persistence Context** is JPA's first-level cache and unit of work. It's typically scoped to a single transaction (transaction-scoped) in Spring applications.\n\nKey behaviors:\n1. **Identity guarantee**: Within a PC, there is only ONE Java object per database row. `em.find(User.class, 1L)` called twice returns the same object reference.\n2. **Dirty checking**: The PC tracks managed entities. At flush time (usually before commit), Hibernate compares the current state against the snapshot taken at load time and generates UPDATE SQL for changed entities automatically.\n3. **Write-behind**: SQL is not executed immediately. It accumulates and is flushed in batches before the transaction commits.\n\n**Entity state transitions**:\n- `new User()` -> **Transient** (not in PC, no ID)\n- `em.persist(user)` -> **Managed** (in PC, ID assigned, tracked)\n- `em.find()` / query -> **Managed** (loaded from DB into PC)\n- Transaction ends / `em.detach()` / `em.clear()` -> **Detached** (has ID but not tracked)\n- `em.merge(detachedUser)` -> returns a new **Managed** copy (the original stays detached!)\n- `em.remove(managedUser)` -> **Removed** (scheduled for DELETE at flush)\n\n**Common pitfalls**:\n- Modifying a detached entity without merge() -- changes are silently lost\n- merge() returns a NEW managed instance -- always use the returned object\n- Native queries bypass the PC -- the cache may become stale\n- LazyInitializationException occurs when accessing a lazy collection after the PC is closed",
  code: `// Entity lifecycle transitions
@Service
public class UserLifecycleDemo {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void demonstrateLifecycle() {

        // 1. TRANSIENT -- new object, not in persistence context
        User user = new User();
        user.setName("Alice");
        user.setEmail("alice@example.com");
        // user.getId() == null

        // 2. MANAGED -- persist attaches to PC, ID generated
        em.persist(user);
        // user.getId() != null, tracked by PC

        // 3. Dirty checking -- changes auto-synced at flush
        user.setName("Alice Updated");
        // No explicit save needed! PC detects the change

        // 4. Flush -- forces SQL execution (happens before commit)
        em.flush();
        // INSERT + UPDATE SQL executed

        // 5. DETACHED -- clear removes all entities from PC
        em.clear();
        // user is now detached, changes no longer tracked
        user.setName("Won't be saved"); // this change is LOST

        // 6. Merge -- reattaches by copying state to a new managed entity
        User managedUser = em.merge(user);
        // managedUser is MANAGED, user is still DETACHED!
        // Always use the returned object:
        managedUser.setName("Properly Updated");

        // 7. Find -- loads as MANAGED
        User found = em.find(User.class, user.getId());
        // Same PC -> found == managedUser (identity guarantee)

        // 8. REMOVED -- scheduled for deletion
        em.remove(managedUser);
        // DELETE SQL will execute at flush/commit
    }
}

// Spring Data JPA handles transitions automatically
@Service
@Transactional
public class UserService {

    private final UserRepository repo;

    // save() on new entity: persist() -> MANAGED
    public User create(String name) {
        User user = new User(name);     // Transient
        return repo.save(user);          // Managed (persisted)
    }

    // save() on existing entity: merge() -> MANAGED
    public User update(Long id, String name) {
        User user = repo.findById(id).orElseThrow(); // Managed
        user.setName(name);
        // No save() needed -- dirty checking handles it!
        return user;
    }

    // findById returns MANAGED entity within transaction
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return repo.findById(id).orElseThrow(); // Managed
    } // after method: entity becomes Detached
}`,
  interviewQs: [
    {
      id: "14-3-q0",
      q: "What are the four entity states in JPA? How do transitions between them work?",
      a: "Transient -- newly created, not in persistence context, no ID. Managed/Persistent -- attached to PC, tracked, changes auto-synced. Detached -- has ID but disconnected from PC (after transaction ends or em.detach()). Removed -- scheduled for deletion. Transitions: persist() makes Transient -> Managed; find()/query loads as Managed; transaction end -> Detached; merge() copies Detached -> new Managed; remove() -> Removed.",
      difficulty: "junior",
    },
    {
      id: "14-3-q1",
      q: "What is dirty checking in JPA? Why don't you need to call save() on an already-managed entity?",
      a: "Dirty checking is the mechanism where the persistence context automatically detects changes to managed entities. When an entity is loaded, Hibernate takes a snapshot of its state. At flush time (before commit), it compares the current state to the snapshot and generates UPDATE SQL for any differences. That's why modifying a managed entity's fields is enough -- no explicit save()/merge() call is needed. This only works for managed entities within an active transaction.",
      difficulty: "mid",
    },
    {
      id: "14-3-q2",
      q: "What is the difference between persist() and merge()? Why does merge() return a new object?",
      a: "persist() takes a transient entity and makes it managed -- the same Java object becomes tracked. It throws if the entity already has an ID (is detached). merge() takes a detached (or transient) entity, copies its state into a NEW managed instance, and returns that managed copy. The original object remains detached. This is because the PC might already have a managed instance with the same ID. merge() must reconcile: it loads/creates the managed copy and applies the detached state to it. Always use the returned object from merge(), as changes to the original are not tracked.",
      difficulty: "senior",
    },
  ],
  tip: "Within a `@Transactional` method, entities from `findById()` are managed -- just modify their fields directly and dirty checking saves them. No explicit `save()` needed.\n\n---\n\nВнутри `@Transactional` метода сущности из `findById()` являются managed -- просто изменяйте их поля, и dirty checking сохранит изменения. Явный `save()` не нужен.",
  springConnection: null,
};
