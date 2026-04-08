import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-6",
  blockId: 11,
  title: "Configuration Methods",
  summary:
    "Три способа конфигурации бинов в Spring: XML конфигурация (тег <bean>), аннотации (@Component, @Service, @Repository, @Controller с component scanning), Java конфигурация (@Configuration + @Bean).\n\n---\n\nThree ways to configure beans in Spring: XML configuration (<bean> tags), annotation-based (@Component, @Service, @Repository with component scanning), and Java configuration (@Configuration classes with @Bean methods).",
  deepDive:
    "## Способы конфигурации\n\n**Через XML конфигурацию**\nBean определяется в XML файле с использованием тега <bean>. Это был первоначальный способ конфигурации в Spring. Позволяет полностью отделить конфигурацию от кода, но является многословным.\n\n**Через аннотации**\nС помощью аннотаций: @Component, @Service, @Repository, @Controller, @RestController. Эти аннотации автоматически обнаруживаются с помощью сканирования пакетов (component scanning через @ComponentScan). @Service, @Repository и @Controller -- специализации @Component с дополнительной семантикой.\n\n**Через Java конфигурацию**\nС помощью аннотации @Bean в классе с аннотацией @Configuration. Обеспечивает type-safe конфигурацию и полный контроль над созданием бинов. Позволяет конфигурировать сторонние классы, которые нельзя аннотировать.\n\n---\n\n**XML Configuration** (legacy but still supported)\nBeans are defined in XML files using `<bean>` tags with id, class, and property elements. Constructor and setter injection are configured declaratively. While verbose, XML provides complete separation of configuration from code and is still found in legacy projects.\n\n**Annotation-based Configuration** (most common for your own classes)\nStereotype annotations mark classes for auto-detection:\n- `@Component` -- generic Spring-managed component\n- `@Service` -- business logic layer (no extra behavior, just semantic)\n- `@Repository` -- data access layer (adds automatic exception translation from JDBC/JPA exceptions to Spring's DataAccessException)\n- `@Controller` / `@RestController` -- web layer\n\n`@ComponentScan` (included in `@SpringBootApplication`) tells Spring which packages to scan. By default, it scans the package of the annotated class and all sub-packages.\n\n**Java Configuration** (preferred for third-party beans and explicit wiring)\n`@Configuration` classes contain `@Bean` methods that return bean instances. This approach offers:\n- Type safety and IDE support\n- Ability to configure classes you don't own (third-party libraries)\n- Full programmatic control over bean creation\n- `@Configuration` classes are proxied via CGLIB, ensuring @Bean methods called internally return the same singleton\n\n**Modern best practice**: Use annotation scanning for your own application classes and Java configuration for infrastructure beans (DataSource, RestTemplate, ObjectMapper). Avoid XML in new projects.",
  code: `// ---- 1. XML Configuration (legacy) ----
// beans.xml
// <beans>
//   <bean id="userService" class="com.example.UserService">
//     <constructor-arg ref="userRepository"/>
//   </bean>
//   <bean id="userRepository" class="com.example.UserRepositoryImpl"/>
// </beans>

// Loading XML config:
// ApplicationContext ctx =
//     new ClassPathXmlApplicationContext("beans.xml");

// ---- 2. Annotation-based (component scanning) ----
@Repository
public class UserRepositoryImpl implements UserRepository {
    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(em.find(User.class, id));
    }
}

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
}

// ---- 3. Java Configuration ----
@Configuration
public class AppConfig {

    // Third-party bean you can't annotate with @Component
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    // @Configuration ensures this returns the SAME singleton
    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost/mydb");
        config.setMaximumPoolSize(10);
        return new HikariDataSource(config);
    }
}`,
  interviewQs: [
    {
      id: "11-6-q0",
      q: "What are the three ways to configure beans in Spring? Which is recommended for new projects?",
      a: "XML configuration (using <bean> tags), annotation-based (@Component family with @ComponentScan), and Java configuration (@Configuration with @Bean methods). For new projects, use annotation-based for your own classes and Java configuration for third-party beans. XML is legacy and should be avoided in new code.",
      difficulty: "junior",
    },
    {
      id: "11-6-q1",
      q: "What is the difference between @Component, @Service, @Repository, and @Controller?",
      a: "@Component is the generic stereotype. @Service, @Repository, and @Controller are specializations. @Service is semantic only -- it marks business logic with no additional behavior. @Repository enables automatic exception translation from persistence exceptions to Spring's DataAccessException hierarchy. @Controller marks a web controller eligible for request mapping. @RestController combines @Controller and @ResponseBody. All four trigger component scanning equally.",
      difficulty: "mid",
    },
    {
      id: "11-6-q2",
      q: "Why does Spring proxy @Configuration classes with CGLIB? What happens if you use @Bean methods in a non-@Configuration class?",
      a: "@Configuration classes are CGLIB-proxied to intercept @Bean method calls. When one @Bean method calls another, the proxy returns the existing singleton instead of creating a new instance -- this is called 'full mode'. Without @Configuration (using just @Component with @Bean methods, known as 'lite mode'), inter-@Bean calls are regular Java calls creating new instances each time, breaking singleton semantics. This is why DataSource created in one @Bean method won't be the same instance if called from another @Bean method in lite mode. Always use @Configuration for classes that have interdependent @Bean methods.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@Component` scanning for your own classes and `@Configuration` + `@Bean` for third-party libraries. Never mix the two patterns for the same bean.\n\n---\n\nИспользуйте `@Component` scanning для своих классов и `@Configuration` + `@Bean` для сторонних библиотек. Никогда не смешивайте два подхода для одного бина.",
  springConnection: null,
};
