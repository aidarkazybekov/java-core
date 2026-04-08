import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-5",
  blockId: 14,
  title: "N+1 Problem & Optimization",
  summary:
    "Проблема N+1: один запрос для основной коллекции (N), затем N дополнительных запросов для связанных данных. Решения: JOIN FETCH (JPQL), @EntityGraph, @BatchSize для пакетной загрузки. Пул соединений (HikariCP) переиспользует соединения.\n\n---\n\nN+1 problem: one query for the main collection (N), then N extra queries for related data. Solutions: JOIN FETCH (JPQL), @EntityGraph, @BatchSize for batch loading. Connection pooling (HikariCP) reuses database connections.",
  deepDive:
    "## Проблема N+1\n\nВозникает когда:\n- Выполняется один запрос для выборки основной коллекции (N штук)\n- Для каждой из N сущностей лениво загружаются связанные данные, генерируя N дополнительных запросов\n\nСпособы решения:\n- **JOIN FETCH** -- заранее подтянет дочерние записи в одном запросе\n- **@EntityGraph** -- можно указать какие связи подтянуть\n- **Batch Fetch** -- пакетная загрузка:\n  - Глобальная: spring.jpa.properties.hibernate.default_batch_fetch_size=10\n  - Для поля: @BatchSize(size = 5)\n  - Как работает: загружаем родителей, при обращении к ленивой коллекции Hibernate формирует запрос SELECT * FROM child WHERE parent_id IN (?, ?, ...) для группы родителей\n\n## Пул соединений\n\nМеханизм переиспользования установленных соединений с БД. Spring Boot по умолчанию использует HikariCP.\n- maximumPoolSize -- максимальное количество соединений\n- minimumIdle -- минимальное количество простаивающих соединений\n- connectionTimeout -- время ожидания соединения\n- idleTimeout -- время бездействия до закрытия\n- maxLifetime -- максимальное время существования соединения\n\n---\n\n**The N+1 problem** is the most common JPA performance issue. Example: loading 100 users, each with lazy-loaded orders. First query fetches 100 users (1 query). Then accessing each user's orders triggers a separate query (100 queries). Total: 101 queries instead of 1-2.\n\n**Solution 1 -- JOIN FETCH (JPQL)**:\n```\nSELECT u FROM User u JOIN FETCH u.orders\n```\nLoads users and orders in a single query with a SQL JOIN. Limitation: only one collection can be JOIN FETCHed per query (multiple bags cause MultipleBagFetchException).\n\n**Solution 2 -- @EntityGraph**:\nDeclare on the repository method which associations to fetch eagerly. More flexible than JOIN FETCH -- can be applied to derived query methods. Two types: LOAD (specified = eager, rest use defaults) and FETCH (specified = eager, rest = lazy).\n\n**Solution 3 -- @BatchSize / batch_fetch_size**:\nInstead of 100 individual queries, Hibernate batches: `SELECT * FROM orders WHERE user_id IN (?, ?, ?, ...)`. With batch_size=25, 100 users need only 4 additional queries (100/25). Set globally via properties or per-association with @BatchSize.\n\n**Solution 4 -- DTO Projections**:\nInstead of fetching entities, use `SELECT new com.example.UserOrderDto(u.name, o.total) FROM User u JOIN u.orders o`. Avoids entity management overhead entirely.\n\n**Connection pooling** (HikariCP): Acquiring a database connection is expensive (TCP handshake, authentication). HikariCP maintains a pool of reusable connections. Key tuning: `maximumPoolSize` should be small (10-20 for most apps) -- more connections mean more context switching on the DB side.",
  code: `// THE N+1 PROBLEM
@Entity
public class User {
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}

// This triggers N+1:
List<User> users = userRepo.findAll();    // 1 query: SELECT * FROM users
for (User user : users) {
    user.getOrders().size();               // N queries: one per user!
}

// SOLUTION 1: JOIN FETCH
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u JOIN FETCH u.orders")
    List<User> findAllWithOrders();
    // Single query: SELECT u.*, o.* FROM users u JOIN orders o ON ...
}

// SOLUTION 2: @EntityGraph
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"orders", "orders.items"})
    List<User> findAll();
    // Eagerly fetches orders and their items

    // Named EntityGraph (defined on entity)
    @EntityGraph(value = "User.withOrdersAndRoles", type = EntityGraphType.LOAD)
    Optional<User> findById(Long id);
}

@Entity
@NamedEntityGraph(name = "User.withOrdersAndRoles",
    attributeNodes = {
        @NamedAttributeNode("orders"),
        @NamedAttributeNode("roles")
    })
public class User { ... }

// SOLUTION 3: Batch fetching
// application.properties:
// spring.jpa.properties.hibernate.default_batch_fetch_size=25

// Or per-association:
@Entity
public class User {
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @BatchSize(size = 25)
    private List<Order> orders;
}
// Now: 1 query for users + ceil(N/25) queries for orders

// SOLUTION 4: DTO Projection
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT new com.example.dto.UserSummary(u.name, COUNT(o)) " +
           "FROM User u LEFT JOIN u.orders o GROUP BY u.name")
    List<UserSummary> findUserSummaries();
}

// HikariCP configuration (application.properties)
// spring.datasource.hikari.maximum-pool-size=10
// spring.datasource.hikari.minimum-idle=5
// spring.datasource.hikari.connection-timeout=30000
// spring.datasource.hikari.idle-timeout=600000
// spring.datasource.hikari.max-lifetime=1800000`,
  interviewQs: [
    {
      id: "14-5-q0",
      q: "What is the N+1 problem in JPA? How do you detect it?",
      a: "N+1 occurs when loading N entities triggers N additional queries to load their lazy associations. For 100 users with orders, you get 1 query for users + 100 queries for each user's orders = 101 queries total. Detect by enabling Hibernate SQL logging (spring.jpa.show-sql=true) or using tools like p6spy. Look for repetitive queries in logs.",
      difficulty: "junior",
    },
    {
      id: "14-5-q1",
      q: "Compare JOIN FETCH, @EntityGraph, and @BatchSize for solving N+1. When would you use each?",
      a: "JOIN FETCH: single SQL JOIN, most efficient for one association. Limitation: can't fetch multiple collections (MultipleBagFetchException). @EntityGraph: declarative, works with derived query methods, supports multiple attributes but generates a LEFT JOIN that may return duplicate results. @BatchSize: reduces N queries to N/batchSize queries. Best for multiple lazy collections on the same entity. Use JOIN FETCH for critical queries, @EntityGraph for flexible repository methods, @BatchSize as a global safety net with default_batch_fetch_size in properties.",
      difficulty: "mid",
    },
    {
      id: "14-5-q2",
      q: "How do you tune HikariCP connection pool size? What is the formula and why should the pool be small?",
      a: "The PostgreSQL team recommends: connections = (core_count * 2) + effective_spindle_count. For SSDs, typically 10-20 connections suffice. A larger pool causes problems: more connections mean more memory on the DB server, more context switching, and lock contention. The database can only parallelize up to the number of CPU cores -- excess connections just queue. In Spring Boot, set spring.datasource.hikari.maximum-pool-size. Also configure minimum-idle (typically = max for stable workloads), connection-timeout (time to wait for a connection from the pool), and max-lifetime (must be less than DB's wait_timeout).",
      difficulty: "senior",
    },
  ],
  tip: "Set `spring.jpa.properties.hibernate.default_batch_fetch_size=25` as a global safety net against N+1 -- it dramatically reduces queries even without explicit JOIN FETCH.\n\n---\n\nУстановите `spring.jpa.properties.hibernate.default_batch_fetch_size=25` как глобальную защиту от N+1 -- это значительно уменьшает количество запросов даже без явного JOIN FETCH.",
  springConnection: null,
};
