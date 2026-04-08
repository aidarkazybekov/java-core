import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-1",
  blockId: 22,
  title: "Java EE Specifications",
  summary:
    "Java EE (Jakarta EE) -- набор спецификаций для корпоративных Java-приложений. Основные спецификации: Servlet API, JPA, JDBC, Bean Validation (JSR 380), JMS. Spring Framework широко использует эти спецификации, предоставляя упрощённые обёртки и гибкую конфигурацию.\n\n---\n\nJava EE (Jakarta EE) is a set of specifications for enterprise Java applications. Key specs: Servlet API, JPA, JDBC, Bean Validation (JSR 380), JMS. Spring Framework extensively uses these specs, providing simplified wrappers and flexible configuration.",
  deepDive:
    "## Java EE\n\n" +
    "Java EE (Java Platform, Enterprise Edition), сейчас известная как **Jakarta EE** -- набор спецификаций для создания корпоративных приложений на Java. Предоставляет стандартизированные API для работы с БД, транзакциями, безопасностью и веб-сервисами.\n\n" +
    "Spring Framework широко использует многие спецификации Java EE, предоставляя более гибкие и упрощённые механизмы.\n\n" +
    "## Основные спецификации\n\n" +
    "1. **Servlet API** -- базовая спецификация для HTTP-запросов/ответов. Spring MVC основан на Servlet API (DispatcherServlet наследует HttpServlet).\n\n" +
    "2. **JPA (Java Persistence API)** -- стандарт ORM для работы с БД. Spring Data JPA -- обёртка над JPA/Hibernate.\n\n" +
    "3. **JDBC** -- низкоуровневое API для БД. Spring предоставляет JdbcTemplate.\n\n" +
    "4. **Bean Validation (JSR 380)** -- валидация через аннотации (@NotNull, @Size). Spring интегрирует через @Valid/@Validated.\n\n" +
    "5. **JMS (Java Message Service)** -- API для обмена сообщениями. Spring JMS предоставляет удобный интерфейс.\n\n---\n\n" +
    "## Java EE to Jakarta EE\n\n" +
    "In 2017, Oracle transferred Java EE to the Eclipse Foundation, which renamed it **Jakarta EE**. Key change: the `javax.*` package namespace was migrated to `jakarta.*` starting with Jakarta EE 9. Spring Framework 6 and Spring Boot 3 use the `jakarta.*` namespace.\n\n" +
    "## Key Specifications\n\n" +
    "**Servlet API (jakarta.servlet):** Foundation for web applications. Defines HttpServlet, HttpServletRequest/Response, Filter, Listener. Spring MVC's DispatcherServlet extends HttpServlet.\n\n" +
    "**JPA (jakarta.persistence):** Defines EntityManager, Entity annotations, JPQL, Criteria API. Implementations: Hibernate (default in Spring), EclipseLink, OpenJPA.\n\n" +
    "**JDBC (java.sql):** Low-level database access. Spring's JdbcTemplate reduces boilerplate (connection management, exception translation, result set mapping).\n\n" +
    "**Bean Validation (jakarta.validation):** Constraint annotations validated at runtime. Hibernate Validator is the reference implementation.\n\n" +
    "**JMS (jakarta.jms):** Asynchronous messaging. Point-to-point (queues) and pub/sub (topics). Spring JMS provides JmsTemplate and @JmsListener.\n\n" +
    "**CDI (Contexts and Dependency Injection):** Java EE's DI framework. Spring has its own more mature DI container but supports CDI annotations (@Inject, @Named).",
  code: `// ===== Servlet API usage in Spring =====
// DispatcherServlet extends HttpServlet (Servlet API)
// Spring Boot auto-registers DispatcherServlet

// Direct Servlet API access in Spring controllers
@GetMapping("/info")
public void directServletAccess(
        HttpServletRequest request,
        HttpServletResponse response) throws IOException {

    String clientIp = request.getRemoteAddr();
    String userAgent = request.getHeader("User-Agent");

    response.setContentType("application/json");
    response.getWriter().write(
        "{\\"ip\\": \\"" + clientIp + "\\"}");
}

// ===== JPA annotations (jakarta.persistence) =====
@Entity                        // jakarta.persistence.Entity
@Table(name = "users")         // jakarta.persistence.Table
public class User {
    @Id                        // jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)  // jakarta.persistence.Column
    private String name;
}

// ===== Bean Validation (jakarta.validation) =====
public class CreateUserRequest {
    @NotBlank           // jakarta.validation.constraints
    private String name;

    @Email
    private String email;
}

// ===== JDBC via JdbcTemplate =====
@Repository
public class UserJdbcRepository {
    private final JdbcTemplate jdbc;

    public List<User> findAll() {
        return jdbc.query("SELECT * FROM users",
            (rs, row) -> new User(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("email")));
    }
}

// ===== JMS (jakarta.jms) =====
// Producer
@Service
public class NotificationSender {
    private final JmsTemplate jmsTemplate;

    public void sendNotification(String message) {
        jmsTemplate.convertAndSend("notifications", message);
    }
}

// Consumer
@Component
public class NotificationReceiver {
    @JmsListener(destination = "notifications")
    public void receive(String message) {
        log.info("Received: {}", message);
    }
}`,
  interviewQs: [
    {
      id: "22-1-q0",
      q: "What is Java EE (Jakarta EE)? Name three key specifications.",
      a: "Java EE (now Jakarta EE) is a set of standardized specifications for building enterprise Java applications. Key specs: (1) Servlet API -- foundation for web request/response handling; (2) JPA -- ORM standard for database access; (3) Bean Validation -- constraint annotations for data validation. Others include JDBC, JMS, CDI, JTA. Spring uses these specs extensively.",
      difficulty: "junior",
    },
    {
      id: "22-1-q1",
      q: "What changed when Java EE became Jakarta EE? How does it affect Spring?",
      a: "Oracle transferred Java EE to Eclipse Foundation in 2017, renamed to Jakarta EE. The major breaking change: package namespace migrated from javax.* to jakarta.* in Jakarta EE 9. Spring Framework 6 and Spring Boot 3 use jakarta.* namespace. This means upgrading from Spring Boot 2 to 3 requires updating all javax imports to jakarta (javax.persistence -> jakarta.persistence, javax.servlet -> jakarta.servlet, etc.).",
      difficulty: "mid",
    },
    {
      id: "22-1-q2",
      q: "How does Spring's DI compare to CDI (Jakarta EE's native DI)? Why does Spring use its own DI container?",
      a: "CDI (Contexts and Dependency Injection) is Jakarta EE's standard DI. Spring's DI is older, more mature, and more feature-rich. Key differences: (1) Spring supports constructor, setter, and field injection; CDI added constructor injection later. (2) Spring has more scope types and custom scope support. (3) Spring's @Conditional, @Profile, and auto-configuration have no CDI equivalent. (4) Spring AOP integration is deeper. Spring does support CDI annotations (@Inject, @Named) for compatibility but uses its own container because it predates CDI and offers more flexibility.",
      difficulty: "senior",
    },
  ],
  tip: "При переходе на Spring Boot 3, замените все `javax.*` импорты на `jakarta.*` -- это самое важное изменение.\n\n---\n\nWhen migrating to Spring Boot 3, replace all `javax.*` imports with `jakarta.*` -- this is the most important change.",
  springConnection: null,
};
