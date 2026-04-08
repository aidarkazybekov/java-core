import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-2",
  blockId: 14,
  title: "Repository Pattern",
  summary:
    "Spring Data JPA предоставляет интерфейсы репозиториев: Repository (базовый), CrudRepository (CRUD), PagingAndSortingRepository (пагинация), JpaRepository (полный набор). Запросы можно писать через имена методов, @Query (JPQL/Native) или CriteriaAPI.\n\n---\n\nSpring Data JPA provides repository interfaces: Repository (base), CrudRepository (CRUD ops), PagingAndSortingRepository (paging), JpaRepository (full JPA features). Queries via method names, @Query (JPQL/Native), or CriteriaAPI.",
  deepDive:
    "## Repository\n\nИнтерфейсы, которые предоставляют удобные механизмы для взаимодействия с базой данных.\n\n### Основные типы\n- **Repository** -- базовый интерфейс (маркер)\n- **CrudRepository** -- предоставляет CRUD операции (save, findById, findAll, deleteById)\n- **PagingAndSortingRepository** -- постраничный вывод и сортировка\n- **JpaRepository** -- расширяет все выше + flush, saveAndFlush, deleteInBatch, getOne\n\n### Способы написания запросов\n- **Method Name** -- на основе названия метода (PartTreeJpaQuery)\n- **JPQL (HQL)** -- похожий на SQL, но на основе сущностей. Аннотация @Query\n- **Native Query** -- обычный SQL. @Query с nativeQuery=true. Идет в обход Persistence Context.\n- **CriteriaAPI** -- программное построение запросов с предикатами\n- **QueryDSL** -- инструмент для типобезопасного построения запросов\n\n### Аннотация @Modifying\nЕсли метод выполняет запрос на удаление или обновление, он должен быть помечен @Modifying, чтобы Spring Data поняла, что запрос возвращает количество затронутых строк, а не выборку.\n\n---\n\n**Repository hierarchy** in Spring Data JPA:\n\n1. `Repository<T, ID>` -- marker interface, no methods\n2. `CrudRepository<T, ID>` -- save(), findById(), findAll(), count(), deleteById(), existsById()\n3. `ListCrudRepository<T, ID>` (Spring Data 3+) -- returns List instead of Iterable\n4. `PagingAndSortingRepository<T, ID>` -- findAll(Sort), findAll(Pageable)\n5. `JpaRepository<T, ID>` -- extends all above + flush(), saveAndFlush(), deleteAllInBatch(), getReferenceById()\n\n**Query derivation from method names**: Spring parses the method name and generates SQL. Examples:\n- `findByEmailAndStatus(String email, Status status)`\n- `findByNameContainingIgnoreCase(String name)`\n- `findByCreatedAtBetween(LocalDateTime from, LocalDateTime to)`\n- `findTop5ByOrderByCreatedAtDesc()`\n- `countByStatus(Status status)`\n- `existsByEmail(String email)`\n\n**@Query annotation**: For complex queries that cannot be expressed by method names. JPQL operates on entities and fields, not tables and columns. Native SQL is needed for database-specific features.\n\n**@Modifying**: Required for UPDATE/DELETE queries. Add `@Modifying(clearAutomatically = true)` to sync the persistence context after bulk operations, since they bypass the first-level cache.\n\n**Locking**: @Lock(LockModeType.PESSIMISTIC_WRITE) for pessimistic locking. @Version field on the entity for optimistic locking.",
  code: `// Repository interface -- just extend, no implementation needed
public interface UserRepository extends JpaRepository<User, Long> {

    // Query derivation from method name
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
    List<User> findByCreatedAtAfter(LocalDateTime date);
    boolean existsByEmail(String email);
    long countByStatus(UserStatus status);

    // JPQL query
    @Query("SELECT u FROM User u WHERE u.status = :status ORDER BY u.name")
    List<User> findActiveUsers(@Param("status") UserStatus status);

    // JPQL with JOIN FETCH (solves N+1)
    @Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE email LIKE %:domain",
           nativeQuery = true)
    List<User> findByEmailDomain(@Param("domain") String domain);

    // Pagination
    Page<User> findByStatus(UserStatus status, Pageable pageable);

    // Update query (requires @Modifying)
    @Modifying(clearAutomatically = true)
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("status") UserStatus status,
                                @Param("date") LocalDateTime date);

    // Delete query
    @Modifying
    @Query("DELETE FROM User u WHERE u.status = 'DELETED'")
    int purgeDeletedUsers();

    // Optimistic locking
    @Lock(LockModeType.OPTIMISTIC)
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdWithLock(@Param("id") Long id);
}

// Service using the repository
@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }
        return userRepository.save(new User(request));
    }
}`,
  interviewQs: [
    {
      id: "14-2-q0",
      q: "What is the difference between CrudRepository and JpaRepository?",
      a: "CrudRepository provides basic CRUD: save(), findById(), findAll(), deleteById(), count(). JpaRepository extends CrudRepository and PagingAndSortingRepository, adding JPA-specific methods: flush(), saveAndFlush(), deleteAllInBatch(), getReferenceById(). JpaRepository also returns List instead of Iterable from findAll(). Use JpaRepository for full JPA capabilities.",
      difficulty: "junior",
    },
    {
      id: "14-2-q1",
      q: "What are the different ways to write queries in Spring Data JPA?",
      a: "1) Method name derivation -- Spring generates SQL from method name (findByEmailAndStatus). 2) @Query with JPQL -- entity-based query language. 3) @Query with nativeQuery=true -- raw SQL for DB-specific features. 4) CriteriaAPI -- programmatic type-safe queries using CriteriaBuilder. 5) QueryDSL -- fluent type-safe queries using generated Q-classes. 6) Specification -- dynamic queries implementing Specification<T> interface. Method names are best for simple queries; @Query for complex ones; CriteriaAPI/Specification for dynamic conditions.",
      difficulty: "mid",
    },
    {
      id: "14-2-q2",
      q: "Explain the difference between optimistic and pessimistic locking in JPA. When would you use each?",
      a: "Optimistic locking uses a @Version field. Before updating, JPA checks that the version hasn't changed since read. If it has, OptimisticLockException is thrown. Best for low-contention scenarios (most web apps). Pessimistic locking acquires a database-level lock on read with @Lock annotation -- PESSIMISTIC_READ allows concurrent reads but blocks writes, PESSIMISTIC_WRITE blocks both. Best for high-contention scenarios like financial transactions. Optimistic has better throughput but requires retry logic; pessimistic guarantees exclusive access but can cause deadlocks and reduced concurrency.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@Transactional(readOnly = true)` at the service class level and override with `@Transactional` on write methods -- this optimizes read queries and prevents accidental modifications.\n\n---\n\nИспользуйте `@Transactional(readOnly = true)` на уровне сервис-класса и переопределяйте `@Transactional` на методах записи -- это оптимизирует чтение и предотвращает случайные модификации.",
  springConnection: null,
};
