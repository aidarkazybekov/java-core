import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-2",
  blockId: 14,
  title: "Repository Pattern",
  summary:
    "Spring Data JPA предоставляет интерфейсы-репозитории: Repository, CrudRepository, PagingAndSortingRepository, JpaRepository. Запросы создаются через имя метода, @Query (JPQL/Native), CriteriaAPI или QueryDSL. @Modifying помечает UPDATE/DELETE запросы.\n\n---\n\nSpring Data JPA provides repository interfaces: Repository, CrudRepository, PagingAndSortingRepository, JpaRepository. Queries via method names, @Query (JPQL/Native), CriteriaAPI, or QueryDSL. @Modifying marks UPDATE/DELETE queries.",
  deepDive:
    "## Repository\n\n" +
    "Интерфейсы для взаимодействия с базой данных.\n\n" +
    "**Основные типы:**\n" +
    "- **Repository** -- базовый маркерный интерфейс\n" +
    "- **CrudRepository** -- CRUD операции (save, findById, findAll, delete)\n" +
    "- **PagingAndSortingRepository** -- постраничный вывод и сортировка\n" +
    "- **JpaRepository** -- расширяет все + flush, batch операции\n\n" +
    "**@Modifying** -- для UPDATE/DELETE запросов, чтобы Spring Data понял, что возвращается количество строк.\n\n" +
    "**Блокировки:**\n" +
    "- **Оптимистическая** (@Version) -- проверка при обновлении. OptimisticLockException.\n" +
    "- **Пессимистическая** (@Lock) -- блокировка на уровне БД.\n\n" +
    "**Способы запросов:** Method Name, @Query (JPQL/Native), CriteriaAPI, QueryDSL.\n\n---\n\n" +
    "## Spring Data Repository Hierarchy\n\n" +
    "`JpaRepository<T, ID>` extends `PagingAndSortingRepository` extends `CrudRepository` extends `Repository`.\n\n" +
    "## Query Methods\n\n" +
    "**Method Name derivation:** `findByNameAndEmail(String, String)` becomes `WHERE name=? AND email=?`.\n\n" +
    "**@Query (JPQL):** `@Query(\"SELECT u FROM User u WHERE u.email = :email\")` -- entity model.\n\n" +
    "**@Query (Native):** `nativeQuery = true` -- raw SQL, bypasses Persistence Context.\n\n" +
    "**@Modifying:** Required for UPDATE/DELETE. Add `clearAutomatically = true` to sync PC.\n\n" +
    "**CriteriaAPI:** Type-safe programmatic queries via CriteriaBuilder, CriteriaQuery, Root, Predicate.\n\n" +
    "**QueryDSL:** Simpler syntax via generated Q-classes and BooleanBuilder.",
  code: `// ===== Basic Repository =====
public interface UserRepository extends JpaRepository<User, Long> {

    // Method name query
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
    List<User> findByAgeGreaterThanOrderByNameAsc(int age);

    // JPQL query
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveByEmail(@Param("email") String email);

    // Native query
    @Query(value = "SELECT * FROM users WHERE created_at > :date",
           nativeQuery = true)
    List<User> findRecentUsers(@Param("date") LocalDate date);

    // Modifying query (UPDATE/DELETE)
    @Modifying(clearAutomatically = true)
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDate date);

    // Pagination
    Page<User> findByActive(boolean active, Pageable pageable);
}

// ===== Optimistic Locking =====
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;

    @Version  // optimistic lock field
    private Long version;
}

// ===== Pessimistic Locking =====
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);
}

// ===== Pagination in Controller =====
@GetMapping("/users")
public Page<UserDto> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "name") String sortBy) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    return userRepository.findByActive(true, pageable).map(userMapper::toDto);
}`,
  interviewQs: [
    {
      id: "14-2-q0",
      q: "What is the difference between CrudRepository, JpaRepository, and PagingAndSortingRepository?",
      a: "CrudRepository provides basic CRUD (save, findById, delete, findAll). PagingAndSortingRepository adds pagination and sorting. JpaRepository extends both with JPA-specific methods like flush(), saveAndFlush(), deleteInBatch(). In practice, extend JpaRepository to get all features.",
      difficulty: "junior",
    },
    {
      id: "14-2-q1",
      q: "What are the different ways to write queries in Spring Data JPA?",
      a: "1) Method name derivation (findByNameAndEmail) -- simple, auto-generated. 2) @Query with JPQL -- entity model, portable. 3) @Query nativeQuery=true -- raw SQL for DB-specific features. 4) CriteriaAPI -- programmatic, type-safe, dynamic. 5) QueryDSL -- like CriteriaAPI but simpler via Q-classes. Use method names for simple lookups, JPQL for custom queries, native for performance-critical, CriteriaAPI/QueryDSL for dynamic filters.",
      difficulty: "mid",
    },
    {
      id: "14-2-q2",
      q: "Explain optimistic vs pessimistic locking in JPA. When would you choose each?",
      a: "Optimistic: @Version field, checks version on update. OptimisticLockException on conflict. Best for low-contention. Pessimistic: @Lock acquires DB lock at read time -- PESSIMISTIC_READ allows reads, PESSIMISTIC_WRITE blocks both. Choose pessimistic for frequent conflicts or critical data (financial). Optimistic has better throughput; pessimistic provides stronger guarantees.",
      difficulty: "senior",
    },
  ],
  tip: "Используйте `@Modifying(clearAutomatically = true)` для UPDATE/DELETE запросов, чтобы Persistence Context синхронизировался.\n\n---\n\nUse `@Modifying(clearAutomatically = true)` for UPDATE/DELETE queries to auto-sync the Persistence Context.",
  springConnection: null,
};
