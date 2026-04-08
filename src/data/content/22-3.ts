import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-3",
  blockId: 22,
  title: "Why Spring Uses Java EE",
  summary:
    "Spring Framework builds on Java EE specifications because they are industry standards that ensure interoperability. Spring simplifies Java EE by providing wrappers, autoconfiguration, and a more flexible dependency injection model, reducing boilerplate while leveraging proven APIs.",
  deepDive:
    "## Почему Spring использует спецификации Java EE?\n\nSpring Framework широко использует многие спецификации Java EE, предоставляя более гибкие, упрощённые и расширяемые механизмы их реализации.\n\nSpring значительно упрощает использование спецификаций Java EE, предоставляя мощные обёртки, гибкую конфигурацию и интеграцию, что делает Spring одной из самых популярных альтернатив для разработки корпоративных приложений на Java.\n\n### Причины:\n\n1. **Java EE -- это стандарт** в экосистеме Java, что упрощает интеграцию Spring с другими технологиями\n2. **Знакомство разработчиков** -- многие разработчики уже знакомы с Java EE, что снижает порог входа\n3. **Переносимость** -- приложения могут мигрировать между различными реализациями (Hibernate -> EclipseLink)\n4. **Экосистема** -- огромное количество библиотек и инструментов совместимых с Java EE спецификациями\n\n### Как Spring улучшает Java EE:\n\n| Java EE | Проблема | Решение Spring |\n|---|---|---|\n| Servlet API | Много boilerplate кода | DispatcherServlet + @Controller |\n| JPA | Сложная конфигурация | Spring Data JPA (автоматические репозитории) |\n| JTA | Сложные распределённые транзакции | @Transactional с простой настройкой |\n| CDI | Ограниченная функциональность DI | Spring IoC (профили, условия, SpEL) |\n| Bean Validation | Ручная интеграция | Автоматическая валидация через @Valid |\n| JMS | Много boilerplate | JmsTemplate + @JmsListener |\n| JAX-RS | Отдельная конфигурация | @RestController (встроен в Spring MVC) |\n\n---\n\n## Why Spring Uses Java EE Specifications\n\nSpring Framework was created by Rod Johnson in 2003 as a response to the complexity of J2EE (Java 2 Enterprise Edition). Rather than replacing Java EE entirely, Spring embraced its specifications while dramatically simplifying their use.\n\n### Reasons Spring Builds on Java EE:\n\n**1. Standards-Based Interoperability**\nJava EE specs are industry standards governed by the JCP (Java Community Process). By building on these standards, Spring applications can:\n- Swap implementations (Hibernate for EclipseLink, Tomcat for Jetty)\n- Interoperate with non-Spring Java EE applications\n- Use standard annotations (@Entity, @Inject, @Valid) recognized by all Java developers\n\n**2. Lower Barrier to Entry**\nDevelopers familiar with Servlet API, JPA, or Bean Validation can immediately understand Spring code because it uses the same annotations and concepts.\n\n**3. Proven, Battle-Tested APIs**\nSpecifications like JPA, JDBC, and Servlet API have been refined over decades. Spring leverages this maturity rather than reinventing these complex protocols.\n\n**4. Ecosystem Leverage**\nThousands of libraries, tools (Hibernate, Flyway, Liquibase), and monitoring solutions are built against Java EE specs and work seamlessly with Spring.\n\n### How Spring Improves Upon Java EE:\n\n- **Convention over configuration** -- Spring Boot auto-configures sensible defaults\n- **Simpler dependency injection** -- Constructor injection without XML, @Conditional beans, profiles\n- **Template classes** -- JdbcTemplate, JmsTemplate, RestTemplate reduce boilerplate\n- **Spring Data** -- Auto-generated repository implementations from interfaces\n- **Embedded servers** -- No need for external application servers (WAR deployment)\n- **Opinionated starters** -- One dependency pulls in all related libraries with compatible versions\n\n### Spring Boot vs Traditional Java EE Deployment:\n\n**Traditional Java EE:**\n- Write code -> Package as WAR -> Deploy to Application Server (WildFly, GlassFish) -> Server manages lifecycle\n- Heavy, slow startup, complex configuration\n\n**Spring Boot:**\n- Write code -> Package as executable JAR with embedded Tomcat -> `java -jar app.jar`\n- Lightweight, fast startup, cloud-native friendly, ideal for microservices",
  code: `// ─── Java EE Spec vs Spring Simplification ───

// ── JPA: Manual EntityManager (Java EE style) ──
@Stateless
public class UserDao {
    @PersistenceContext
    private EntityManager em;

    public User findById(Long id) {
        return em.find(User.class, id);
    }

    public List<User> findByName(String name) {
        return em.createQuery(
            "SELECT u FROM User u WHERE u.name = :name", User.class)
            .setParameter("name", name)
            .getResultList();
    }

    public void save(User user) {
        em.persist(user);
    }
}

// ── Spring Data JPA: Zero boilerplate ──
public interface UserRepository extends JpaRepository<User, Long> {
    // Auto-generated: findById, findAll, save, delete, etc.

    // Derived query — Spring generates the JPQL automatically
    List<User> findByName(String name);

    // Custom query
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findByEmailDomain(@Param("domain") String domain);
}

// ── Transactions: JTA (Java EE) vs Spring ──
// Java EE — manual transaction management
@Resource
UserTransaction utx;

public void transfer(Long fromId, Long toId, double amount) {
    utx.begin();
    try {
        // business logic
        utx.commit();
    } catch (Exception e) {
        utx.rollback();
        throw e;
    }
}

// Spring — declarative transaction
@Transactional
public void transfer(Long fromId, Long toId, double amount) {
    Account from = accountRepo.findById(fromId).orElseThrow();
    Account to = accountRepo.findById(toId).orElseThrow();
    from.debit(amount);
    to.credit(amount);
    // Spring handles commit/rollback automatically
}

// ── Validation: integrated automatically ──
@RestController
@RequestMapping("/api/users")
public class UserController {
    @PostMapping
    public ResponseEntity<User> create(
            @Valid @RequestBody UserDTO dto) {  // @Valid triggers Bean Validation
        // If validation fails, Spring returns 400 automatically
        return ResponseEntity.ok(userService.create(dto));
    }
}`,
  interviewQs: [
    {
      id: "22-3-q0",
      q: "Why does Spring use Java EE specifications instead of creating its own APIs from scratch?",
      a: "Spring uses Java EE specs because they are industry standards familiar to most Java developers, ensuring interoperability with other Java EE tools and libraries. By building on JPA, Servlet API, Bean Validation, etc., Spring applications can swap implementations (Hibernate to EclipseLink) and leverage the vast ecosystem. Spring's value is not replacing these specs but simplifying their use with auto-configuration, templates, and convention over configuration.",
      difficulty: "junior",
    },
    {
      id: "22-3-q1",
      q: "How does Spring Data JPA simplify the standard JPA specification?",
      a: "Standard JPA requires manual EntityManager injection, explicit JPQL queries, and boilerplate transaction handling. Spring Data JPA auto-generates repository implementations from interface definitions: just extend JpaRepository<Entity, ID> and get findById, findAll, save, delete for free. Derived query methods (findByNameAndAge) generate JPQL automatically. @Query annotation handles custom queries. Paging and sorting come built-in via Pageable parameter. The developer writes only the interface -- Spring creates the implementation at runtime.",
      difficulty: "mid",
    },
    {
      id: "22-3-q2",
      q: "Compare the traditional Java EE application server deployment model with Spring Boot's embedded server approach. What are the trade-offs?",
      a: "Java EE deploys WAR files to external servers (WildFly, GlassFish) that manage the servlet container, JPA provider, JMS broker, etc. Benefits: centralized management, shared resources across apps. Drawbacks: heavyweight, slow startup, version coupling between app and server. Spring Boot embeds Tomcat/Jetty in an executable JAR, making each app self-contained. Benefits: fast startup, easy containerization (Docker), independent versioning, cloud-native. Trade-offs: each app carries its own server (more memory), no centralized management, requires external solutions for JMS/JTA that app servers provided out-of-the-box. Spring Boot's approach won for microservices; traditional app servers still exist in legacy enterprise environments.",
      difficulty: "senior",
    },
  ],
  tip: "Knowing both the Java EE spec and its Spring simplification makes you a stronger developer -- you understand the 'why' behind Spring's design decisions and can troubleshoot deeper issues.",
  springConnection: null,
};
