import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-1",
  blockId: 22,
  title: "Java EE Specifications",
  summary:
    "Java EE (now Jakarta EE) is a set of specifications for enterprise Java applications. Key specs include Servlet API, JPA, JDBC, Bean Validation, JMS, JTA, CDI, and JAX-RS. Spring Framework builds on top of these specifications, providing simpler and more flexible implementations.",
  deepDive:
    "## Java EE\n\nJava EE (Java Platform, Enterprise Edition), сейчас известная как **Jakarta EE** -- это набор спецификаций для создания корпоративных приложений на Java. Она предоставляет набор стандартизированных API для решения типичных задач: работа с базами данных, управление транзакциями, безопасность и веб-сервисы.\n\n### Основные спецификации Java EE:\n\n| Спецификация | Назначение | Использование в Spring |\n|---|---|---|\n| **Servlet API** | Обработка HTTP-запросов и ответов | DispatcherServlet наследует HttpServlet |\n| **JPA** | ORM, работа с БД через объекты | Spring Data JPA, поддержка Hibernate |\n| **JDBC** | Низкоуровневое API для БД | JdbcTemplate |\n| **Bean Validation (JSR 380)** | Валидация данных через аннотации | @NotNull, @Size, @Valid |\n| **JMS** | Обмен сообщениями между приложениями | Spring JMS |\n| **JTA** | Управление распределёнными транзакциями | @Transactional |\n| **CDI** | Внедрение зависимостей | Spring IoC контейнер |\n| **JAX-RS** | REST веб-сервисы | Spring MVC @RestController |\n\nSpring Framework широко использует многие спецификации Java EE, предоставляя более гибкие, упрощённые и расширяемые механизмы их реализации.\n\n---\n\n## Java EE (Jakarta EE) Specifications\n\nJava EE, now known as **Jakarta EE** (after Oracle transferred governance to the Eclipse Foundation in 2017), is a collection of specifications that define standard APIs for building enterprise Java applications.\n\n### Core Specifications:\n\n**1. Servlet API (jakarta.servlet)**\n- Foundation for handling HTTP requests and responses\n- Defines the lifecycle of web components (init, service, destroy)\n- Spring MVC's DispatcherServlet extends HttpServlet\n\n**2. JPA -- Java Persistence API (jakarta.persistence)**\n- Standard for Object-Relational Mapping (ORM)\n- Defines annotations: @Entity, @Table, @Id, @OneToMany, etc.\n- Implementations: Hibernate (most popular), EclipseLink, OpenJPA\n- Spring Data JPA provides repository abstraction on top of JPA\n\n**3. JDBC -- Java Database Connectivity (java.sql)**\n- Low-level API for direct database access\n- Manages connections, statements, result sets\n- Spring provides JdbcTemplate as a simpler wrapper\n\n**4. Bean Validation (jakarta.validation, JSR 380)**\n- Declarative validation using annotations: @NotNull, @Size, @Email, @Min, @Max, @Pattern\n- Implementations: Hibernate Validator\n- Spring integrates with @Valid / @Validated annotations\n\n**5. JMS -- Java Message Service (jakarta.jms)**\n- API for asynchronous messaging between applications\n- Supports point-to-point (queues) and publish-subscribe (topics)\n- Spring JMS simplifies listener configuration\n\n**6. JTA -- Java Transaction API (jakarta.transaction)**\n- Manages distributed transactions across multiple resources\n- Spring's @Transactional annotation abstracts JTA complexity\n\n**7. CDI -- Contexts and Dependency Injection (jakarta.inject)**\n- Standard for dependency injection in Java EE\n- Defines @Inject, @Named, @Singleton scopes\n- Spring's IoC container predates CDI and offers a superset of functionality\n\n**8. JAX-RS (jakarta.ws.rs)**\n- Standard for building RESTful web services\n- Annotations: @Path, @GET, @POST, @Produces, @Consumes\n- Implementations: Jersey, RESTEasy\n- Spring MVC's @RestController is the Spring alternative\n\nThe transition from `javax.*` to `jakarta.*` package namespace happened with Jakarta EE 9, requiring code changes when migrating from Java EE 8.",
  code: `// ─── Java EE Specifications in Action ───

// 1. Servlet API — foundation of web handling
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp) throws IOException {
        resp.getWriter().write("Hello from Servlet!");
    }
}

// 2. JPA — ORM annotations
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}

// 3. Bean Validation — declarative constraints
public class UserDTO {
    @NotNull(message = "Name is required")
    @Size(min = 2, max = 50)
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @Min(18) @Max(120)
    private int age;
}

// 4. CDI / Dependency Injection
// Java EE style:
@Named
@RequestScoped
public class OrderService {
    @Inject
    private OrderRepository repository;
}

// Spring equivalent:
@Service
public class OrderService {
    private final OrderRepository repository;

    @Autowired // or constructor injection (preferred)
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }
}

// 5. JAX-RS vs Spring MVC
// JAX-RS style:
@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {
    @GET
    public List<User> getAll() { /* ... */ }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(User user) { /* ... */ }
}

// Spring MVC equivalent:
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public List<User> getAll() { /* ... */ }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        /* ... */
    }
}`,
  interviewQs: [
    {
      id: "22-1-q0",
      q: "What is Java EE (Jakarta EE) and how does it relate to Spring Framework?",
      a: "Java EE is a set of specifications (APIs) that define standards for building enterprise Java applications -- things like Servlet API for web handling, JPA for database access, JMS for messaging. Spring Framework builds on top of many Java EE specifications, providing simpler configuration, more flexible dependency injection, and additional features. For example, Spring MVC uses Servlet API, Spring Data JPA uses JPA, and @Transactional uses JTA concepts.",
      difficulty: "junior",
    },
    {
      id: "22-1-q1",
      q: "Compare CDI (Java EE) dependency injection with Spring's IoC container.",
      a: "CDI uses @Inject (JSR 330) for injection, @Named for component discovery, and standard scopes (@RequestScoped, @SessionScoped, @ApplicationScoped). Spring uses @Autowired (or @Inject), @Component/@Service/@Repository for discovery, and its own scopes (singleton, prototype, request, session). Spring's container predates CDI, offers more features (profiles, conditional beans, SpEL), and has a richer ecosystem. CDI is the Java EE standard; Spring is the de facto industry standard.",
      difficulty: "mid",
    },
    {
      id: "22-1-q2",
      q: "What changed in the transition from Java EE to Jakarta EE, and how does it affect existing applications?",
      a: "Oracle transferred Java EE to the Eclipse Foundation in 2017, but could not transfer the 'javax' trademark. Starting with Jakarta EE 9, all packages were renamed from javax.* to jakarta.* (e.g., javax.servlet.http.HttpServlet became jakarta.servlet.http.HttpServlet). This is a breaking change requiring code modifications, dependency updates, and build adjustments. Spring Boot 3.x requires Jakarta EE 9+ (jakarta.* namespace), so upgrading from Spring Boot 2.x requires updating all Java EE imports. Tools like Eclipse Transformer can automate the migration.",
      difficulty: "senior",
    },
  ],
  tip: "When learning Spring, understand the underlying Java EE spec it implements -- it helps you grasp why Spring designed its API a certain way and makes you more versatile as a developer.",
  springConnection: null,
};
