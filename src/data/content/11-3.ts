import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-3",
  blockId: 11,
  title: "Bean Lifecycle",
  summary:
    "Жизненный цикл бина: создание экземпляра, внедрение зависимостей, вызов @PostConstruct, использование, вызов @PreDestroy при остановке контейнера. Spring предоставляет хуки на каждом этапе для кастомизации поведения.\n\n---\n\nThe bean lifecycle follows: instantiation, dependency injection, @PostConstruct callback, active use, and @PreDestroy on container shutdown. Spring provides hooks at each stage for custom initialization and cleanup logic.",
  deepDive:
    "## Жизненный цикл бина\n\n1. **Создание**: Контейнер создает экземпляр класса\n2. **Внедрение зависимостей**: заполняются поля, вызываются конструкторы и сеттеры\n3. **Инициализация**:\n   - BeanPostProcessor.postProcessBeforeInitialization()\n   - При наличии методов помеченных аннотацией @PostConstruct, они вызываются\n   - InitializingBean.afterPropertiesSet()\n   - Метод init-method (из XML или @Bean(initMethod))\n   - BeanPostProcessor.postProcessAfterInitialization()\n4. **Использование**: бин находится в контейнере, готов к работе\n5. **Завершение**: при остановке контейнера или завершении жизненного цикла\n   - Вызываются методы помеченные @PreDestroy\n   - DisposableBean.destroy()\n   - Метод destroy-method (из XML или @Bean(destroyMethod))\n\n---\n\nSpring beans go through a well-defined lifecycle managed by the container:\n\n**Phase 1 -- Instantiation**: The container creates the bean instance using the constructor. At this point, dependencies are not yet injected (unless using constructor injection, which happens simultaneously).\n\n**Phase 2 -- Populate Properties**: Dependencies are injected via setters or field injection. @Autowired, @Value, and @Resource annotations are processed.\n\n**Phase 3 -- BeanPostProcessor (before init)**: All registered BeanPostProcessors get a chance to modify the bean before initialization. This is where Spring processes annotations like @Autowired and @Value.\n\n**Phase 4 -- Initialization callbacks** (in order):\n1. `@PostConstruct` annotated method\n2. `InitializingBean.afterPropertiesSet()`\n3. Custom init-method (specified in @Bean or XML)\n\n**Phase 5 -- BeanPostProcessor (after init)**: Post-processors run again after initialization. This is where AOP proxies are typically created (e.g., for @Transactional).\n\n**Phase 6 -- Ready for use**: The bean is fully initialized and available in the container.\n\n**Phase 7 -- Destruction callbacks** (in order, on container shutdown):\n1. `@PreDestroy` annotated method\n2. `DisposableBean.destroy()`\n3. Custom destroy-method\n\nNote: Destruction callbacks only apply to singleton beans. Prototype beans are not tracked after creation -- the container does not manage their destruction.\n\nThe lifecycle is crucial for understanding when AOP proxies wrap your beans and why certain operations must happen in @PostConstruct rather than in the constructor.",
  code: `@Component
public class DatabaseConnectionPool implements InitializingBean, DisposableBean {

    private final DataSourceProperties properties;
    private HikariDataSource dataSource;

    // Phase 1: Instantiation + dependency injection (constructor)
    public DatabaseConnectionPool(DataSourceProperties properties) {
        this.properties = properties;
        System.out.println("1. Constructor called");
    }

    // Phase 4a: @PostConstruct
    @PostConstruct
    public void postConstruct() {
        System.out.println("2. @PostConstruct -- validating config");
        Objects.requireNonNull(properties.getUrl(), "DB URL required");
    }

    // Phase 4b: InitializingBean
    @Override
    public void afterPropertiesSet() {
        System.out.println("3. afterPropertiesSet -- creating pool");
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(properties.getUrl());
        config.setUsername(properties.getUsername());
        config.setPassword(properties.getPassword());
        this.dataSource = new HikariDataSource(config);
    }

    // Phase 7a: @PreDestroy
    @PreDestroy
    public void preDestroy() {
        System.out.println("4. @PreDestroy -- preparing shutdown");
    }

    // Phase 7b: DisposableBean
    @Override
    public void destroy() {
        System.out.println("5. destroy -- closing pool");
        if (dataSource != null) {
            dataSource.close();
        }
    }
}

// Using @Bean with init/destroy methods
@Configuration
public class AppConfig {

    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public CacheManager cacheManager() {
        return new CacheManager();
    }
}

public class CacheManager {
    public void init() {
        System.out.println("Custom init-method: warming cache");
    }
    public void cleanup() {
        System.out.println("Custom destroy-method: flushing cache");
    }
}`,
  interviewQs: [
    {
      id: "11-3-q0",
      q: "Describe the Spring bean lifecycle. In what order are initialization callbacks invoked?",
      a: "The lifecycle is: instantiation, dependency injection, @PostConstruct, InitializingBean.afterPropertiesSet(), custom init-method, then the bean is ready. On shutdown: @PreDestroy, DisposableBean.destroy(), custom destroy-method. BeanPostProcessors wrap before and after the initialization phase.",
      difficulty: "junior",
    },
    {
      id: "11-3-q1",
      q: "Why should you use @PostConstruct instead of putting initialization logic in the constructor?",
      a: "In the constructor, dependencies injected via setter or field injection are not yet available -- only constructor-injected dependencies are. @PostConstruct runs after all dependencies are injected, so you can safely reference any autowired field. Additionally, @PostConstruct runs before BeanPostProcessor.postProcessAfterInitialization(), meaning the bean is not yet proxied, which can matter for self-invocation scenarios. Constructor logic also cannot benefit from Spring's exception handling for initialization failures.",
      difficulty: "mid",
    },
    {
      id: "11-3-q2",
      q: "How does the bean lifecycle differ for prototype-scoped beans? What are the implications for resource management?",
      a: "Spring does not manage the full lifecycle of prototype beans. After creation and initialization (including @PostConstruct), the container hands off the bean and does not track it. @PreDestroy and DisposableBean.destroy() are never called for prototypes. This means you must manage cleanup manually -- close connections, release resources. If a singleton depends on a prototype, the prototype is injected once and never refreshed. To get a new prototype each time, use ObjectFactory<T>, Provider<T>, or @Lookup method injection.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@PostConstruct` for initialization logic that depends on injected fields, and `@PreDestroy` for cleanup like closing connections. Avoid heavy logic in constructors.\n\n---\n\nИспользуйте `@PostConstruct` для логики инициализации, зависящей от внедренных полей, и `@PreDestroy` для очистки ресурсов. Избегайте тяжелой логики в конструкторах.",
  springConnection: null,
};
