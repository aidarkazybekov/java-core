import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "12-3",
  blockId: 12,
  title: "Profiles",
  summary:
    "Профили позволяют активировать различные конфигурации бинов в зависимости от окружения (dev, test, prod). Активный профиль задается через spring.profiles.active, а бины помечаются аннотацией @Profile.\n\n---\n\nProfiles allow activating different bean configurations per environment (dev, test, prod). The active profile is set via spring.profiles.active, and beans are annotated with @Profile to be conditionally loaded.",
  deepDive:
    "## Профилирование\n\nОдним из решений множественного внедрения является профилирование. У запускаемого приложения всегда есть атрибут профилирования -- это список активных профилей, под которым запускается приложение.\n\nПо умолчанию активный профиль только один -- default. Но мы можем кастомизировать, указав при помощи properties файла: spring.profiles.active=\"профиль\"\n\nАннотация @Profile, принимающая строковое значение, позволяет конфигурировать компонент только при определенном профиле приложения.\n\nТакже есть возможность создавать бины в зависимости от какого-либо условия. Для этого используется аннотация @Conditional и ее производные:\n- @ConditionalOnBean -- true при наличии заданного Bean\n- @ConditionalOnClass -- true при наличии заданного класса\n- @ConditionalOnJava -- true при верной версии Java\n- @ConditionalOnProperty -- true при выполнении условия в файле свойств\n- @ConditionalOnResource -- true при наличии заданного resource\n\n---\n\nSpring Profiles provide a way to segregate parts of your application configuration and make it available only in certain environments.\n\n**Activating profiles** can be done via:\n- `spring.profiles.active=dev,metrics` in application.properties\n- JVM argument: `-Dspring.profiles.active=prod`\n- Environment variable: `SPRING_PROFILES_ACTIVE=prod`\n- Programmatically: `SpringApplication.setAdditionalProfiles(\"dev\")`\n\n**Profile-specific properties files** follow the pattern `application-{profile}.properties` (or .yml). When a profile is active, its properties file is loaded and overrides values from the base `application.properties`. For example, application-dev.yml might set a local H2 database while application-prod.yml points to PostgreSQL.\n\n**@Profile annotation** can be placed on @Component, @Configuration, or @Bean methods:\n- `@Profile(\"dev\")` -- active only when \"dev\" profile is active\n- `@Profile(\"!prod\")` -- active when \"prod\" is NOT active\n- `@Profile({\"dev\", \"test\"})` -- active when either profile is active\n\n**@Conditional** annotations provide even finer control beyond profiles. `@Conditional` takes a Condition interface with a `boolean matches(ConditionContext, AnnotatedTypeMetadata)` method. ConditionContext provides access to BeanDefinitionRegistry, BeanFactory, Environment, ResourceLoader, and ClassLoader.\n\nBest practice: Use profiles for environment-specific configuration (database URLs, API keys, feature flags) and @Conditional for capability-based configuration (class availability, bean presence).",
  code: `// Profile-specific configuration
@Configuration
@Profile("dev")
public class DevConfig {

    @Bean
    public DataSource dataSource() {
        // Embedded H2 for development
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .addScript("schema.sql")
                .addScript("test-data.sql")
                .build();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {

    @Bean
    public DataSource dataSource(
            @Value("\${db.url}") String url,
            @Value("\${db.username}") String user,
            @Value("\${db.password}") String pass) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(user);
        config.setPassword(pass);
        config.setMaximumPoolSize(20);
        return new HikariDataSource(config);
    }
}

// Profile on a bean method
@Configuration
public class NotificationConfig {

    @Bean
    @Profile("dev")
    public NotificationService devNotifications() {
        return new ConsoleNotificationService(); // just logs
    }

    @Bean
    @Profile("prod")
    public NotificationService prodNotifications() {
        return new EmailNotificationService(); // sends real emails
    }
}

// application.properties (base)
// app.name=MyApp
// spring.profiles.active=dev

// application-dev.properties
// server.port=8080
// spring.h2.console.enabled=true
// logging.level.root=DEBUG

// application-prod.properties
// server.port=443
// spring.h2.console.enabled=false
// logging.level.root=WARN

// Negation and multi-profile expressions
@Component
@Profile("!prod") // active in ALL profiles except prod
public class DebugInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req,
                             HttpServletResponse res, Object handler) {
        System.out.println("Request: " + req.getRequestURI());
        return true;
    }
}`,
  interviewQs: [
    {
      id: "12-3-q0",
      q: "What are Spring profiles and how do you activate them?",
      a: "Profiles allow environment-specific bean configuration. Activate via: spring.profiles.active in application.properties, JVM argument -Dspring.profiles.active=prod, environment variable SPRING_PROFILES_ACTIVE, or programmatically. Profile-specific properties files (application-{profile}.properties) override base properties. @Profile annotation restricts beans to specific profiles.",
      difficulty: "junior",
    },
    {
      id: "12-3-q1",
      q: "How do profile-specific properties files work? What is the loading order?",
      a: "Spring loads application.properties first (base), then application-{activeProfile}.properties which overrides matching keys. For multiple active profiles (e.g., dev,metrics), later profiles take precedence. application-default.properties is loaded only when no explicit profile is active. External property sources (environment variables, command-line args) override all file-based properties. Spring Boot also supports application.yml with multi-document blocks separated by ---.",
      difficulty: "mid",
    },
    {
      id: "12-3-q2",
      q: "Explain the @Conditional mechanism. How would you create a custom condition?",
      a: "Implement the Condition interface with matches(ConditionContext, AnnotatedTypeMetadata). ConditionContext gives access to the BeanDefinitionRegistry, BeanFactory, Environment, ResourceLoader, and ClassLoader. AnnotatedTypeMetadata provides annotation information on the target. Create a custom annotation meta-annotated with @Conditional(YourCondition.class). Spring evaluates conditions during bean definition registration, before instantiation. Conditions can check classpath, properties, OS, existing beans, or any runtime state. Spring Boot's @ConditionalOn* annotations are all built on this mechanism.",
      difficulty: "senior",
    },
  ],
  tip: "Use `application-{profile}.properties` files for environment-specific values and `@Profile` on beans that need completely different implementations per environment.\n\n---\n\nИспользуйте файлы `application-{profile}.properties` для значений, специфичных для окружения, и `@Profile` на бинах, которым нужны полностью разные реализации для каждого окружения.",
  springConnection: null,
};
