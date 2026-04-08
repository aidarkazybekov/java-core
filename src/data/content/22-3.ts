import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-3",
  blockId: 22,
  title: "Why Spring Uses Java EE",
  summary:
    "Spring использует спецификации Java EE потому что: (1) Java EE -- стандарт в экосистеме Java, упрощающий интеграцию; (2) разработчики знакомы с Java EE, что снижает порог входа; (3) Spring значительно упрощает использование спецификаций, добавляя обёртки и автоконфигурацию.\n\n---\n\nSpring uses Java EE specifications because: (1) Java EE is the standard in the Java ecosystem, simplifying integration; (2) developers are already familiar with Java EE, lowering the learning curve; (3) Spring greatly simplifies spec usage by adding wrappers and auto-configuration.",
  deepDive:
    "## Почему Spring использует Java EE спецификации?\n\n" +
    "- Java EE -- это стандарт в экосистеме Java, что упрощает интеграцию Spring с другими технологиями\n" +
    "- Многие разработчики уже знакомы с Java EE, что снижает порог входа\n" +
    "- Spring значительно упрощает использование спецификаций Java EE, предоставляя мощные обёртки, гибкую конфигурацию и интеграцию\n\n---\n\n" +
    "## Spring vs Java EE: Philosophy\n\n" +
    "**Java EE approach:** Full application server (WildFly, WebLogic, WebSphere) provides all implementations. Deploy WAR/EAR to the server. Heavy, monolithic, slow startup.\n\n" +
    "**Spring approach:** Lightweight container with embedded server (Tomcat). Pick and choose only the specs you need. Fast startup, easy testing, executable JARs.\n\n" +
    "## How Spring Simplifies Java EE\n\n" +
    "**Servlet API -> Spring MVC:** Instead of writing raw servlets, use @Controller/@RestController with automatic parameter binding, content negotiation, and exception handling.\n\n" +
    "**JPA -> Spring Data JPA:** Instead of managing EntityManager directly, define repository interfaces and let Spring generate implementations. Query methods from method names.\n\n" +
    "**JDBC -> JdbcTemplate/Spring Data JDBC:** Instead of manual connection/statement/resultset management, use templates that handle resources, exceptions, and mapping.\n\n" +
    "**Bean Validation -> Automatic validation:** Instead of manual validator invocation, add @Valid to controller parameters for automatic validation with error handling.\n\n" +
    "**JMS -> Spring JMS:** Instead of manual connection factory setup, use JmsTemplate and @JmsListener.\n\n" +
    "## Why Not Pure Jakarta EE?\n\n" +
    "Spring provides: (1) Auto-configuration -- sensible defaults out of the box. (2) Opinionated starters -- curated dependency sets. (3) Embedded servers -- no external app server needed. (4) Spring Boot Actuator -- production-ready monitoring. (5) Ecosystem -- Spring Security, Spring Cloud, Spring Batch. Jakarta EE is catching up with MicroProfile, but Spring's ecosystem and community remain larger.",
  code: `// ===== Java EE style (verbose) vs Spring style (concise) =====

// --- JPA: Pure Java EE ---
public class UserDaoJavaEE {
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
        if (user.getId() == null) {
            em.persist(user);
        } else {
            em.merge(user);
        }
    }
}

// --- Spring Data JPA (same functionality, zero boilerplate) ---
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    // save(), findById() -- inherited automatically
}

// --- JDBC: Pure Java EE ---
public List<User> findAllJdbc() throws SQLException {
    List<User> users = new ArrayList<>();
    try (Connection conn = dataSource.getConnection();
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
        while (rs.next()) {
            users.add(new User(rs.getLong("id"), rs.getString("name")));
        }
    }  // must handle connection, statement, result set closing
    return users;
}

// --- Spring JdbcTemplate (handles resources automatically) ---
public List<User> findAllSpring() {
    return jdbcTemplate.query("SELECT * FROM users",
        (rs, row) -> new User(rs.getLong("id"), rs.getString("name")));
}

// --- Servlet: Pure Java EE ---
@WebServlet("/api/users")
public class UserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.getWriter().write(objectMapper.writeValueAsString(users));
    }
}

// --- Spring MVC (same functionality, much cleaner) ---
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public List<UserDto> getAll() {
        return userService.findAll();  // auto JSON serialization
    }
}`,
  interviewQs: [
    {
      id: "22-3-q0",
      q: "Why does Spring use Java EE specifications instead of creating everything from scratch?",
      a: "Spring builds on Java EE standards for three reasons: (1) Standards ensure interoperability -- code using JPA works with Hibernate, EclipseLink, or any JPA provider. (2) Developers already know Java EE APIs, reducing learning curve. (3) Spring adds value by simplifying these APIs with auto-configuration, templates, and wrappers rather than replacing them.",
      difficulty: "junior",
    },
    {
      id: "22-3-q1",
      q: "How does Spring simplify JPA compared to using it directly? Give specific examples.",
      a: "Direct JPA: manually inject EntityManager, write JPQL queries, handle transactions, implement pagination. Spring Data JPA: (1) Define an interface extending JpaRepository -- get save, findById, findAll, delete for free. (2) Query derivation from method names (findByNameAndEmail). (3) @Transactional is auto-configured for repositories. (4) Page/Sort support built-in. (5) Auditing with @CreatedDate/@LastModifiedDate. Essentially, Spring Data JPA eliminates 80%+ of boilerplate while still using standard JPA under the hood.",
      difficulty: "mid",
    },
    {
      id: "22-3-q2",
      q: "Compare Spring Boot with Jakarta EE for building microservices. What are the advantages of each?",
      a: "Spring Boot advantages: (1) Mature ecosystem (Spring Cloud for service discovery, config, circuit breakers). (2) Embedded server, executable JARs, fast startup. (3) Huge community, extensive documentation. (4) Auto-configuration reduces boilerplate. Jakarta EE (with MicroProfile) advantages: (1) Standards-based -- no vendor lock-in. (2) Application servers optimized for Jakarta EE. (3) MicroProfile adds microservice features (health, metrics, fault tolerance). (4) Lighter memory footprint with newer runtimes (Quarkus, Open Liberty). In practice, Spring Boot dominates due to ecosystem maturity, but Jakarta EE/MicroProfile is a viable standards-based alternative.",
      difficulty: "senior",
    },
  ],
  tip: "Spring не заменяет Java EE -- он упрощает его использование. Знание обоих уровней (JPA + Spring Data JPA) ценно на собеседованиях.\n\n---\n\nSpring does not replace Java EE -- it simplifies its usage. Knowing both levels (JPA + Spring Data JPA) is valuable in interviews.",
  springConnection: null,
};
