import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "12-1",
  blockId: 12,
  title: "@SpringBootApplication",
  summary:
    "@SpringBootApplication -- это мета-аннотация, объединяющая @ComponentScan (сканирование пакетов), @EnableAutoConfiguration (автоконфигурация бинов) и @SpringBootConfiguration (маркер конфигурации).\n\n---\n\n@SpringBootApplication is a meta-annotation combining @ComponentScan (package scanning), @EnableAutoConfiguration (auto-configuring beans from classpath), and @SpringBootConfiguration (configuration marker).",
  deepDive:
    "## Аннотация @SpringBootApplication\n\nОбъединяет в себе:\n- **@ComponentScan** -- разрешает автоматическое сканирование пакетов на предмет компонентов. По умолчанию сканируется только корневой каталог и его поддиректории. Корневым каталогом является пакет класса, содержащего метод public static void main.\n- **@EnableAutoConfiguration** -- включает автоконфигурацию бинов, основываясь на зависимостях в classpath и подключенных библиотеках.\n- **@SpringBootConfiguration** -- маркерная аннотация (специализация @Configuration), указывающая что класс является источником конфигурации.\n\nSpring Boot -- это надстройка над Spring, упрощающая настройку и запуск приложений. Основная идея:\n- Упрощенная конфигурация: принцип convention over configuration\n- Встроенный сервер: запуск веб-приложения без внешнего контейнера\n- Автоконфигурация: Spring Boot автоматически определяет, какие бины и настройки нужно создать\n\n---\n\n`@SpringBootApplication` is the entry point annotation that bootstraps a Spring Boot application. It is a composed annotation that bundles three core annotations:\n\n**@ComponentScan**: Scans for Spring components (@Component, @Service, @Repository, @Controller) in the annotated class's package and all sub-packages. You can customize the base packages, include/exclude filters.\n\n**@EnableAutoConfiguration**: The heart of Spring Boot's magic. It reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (or the legacy `spring.factories`) to discover auto-configuration classes. Each class is a @Configuration guarded by @Conditional annotations (e.g., @ConditionalOnClass, @ConditionalOnMissingBean). For example, if HikariCP is on the classpath, DataSourceAutoConfiguration creates a DataSource bean -- unless you define your own.\n\n**@SpringBootConfiguration**: A specialization of @Configuration marking the class as the primary configuration source. Spring Boot expects exactly one @SpringBootConfiguration per application context.\n\nThe `SpringApplication.run()` method performs these steps:\n1. Determines the application type (servlet, reactive, or none)\n2. Creates the appropriate ApplicationContext\n3. Loads bean definitions from the annotated class and auto-configurations\n4. Refreshes the context (instantiates beans, starts embedded server)\n5. Publishes ApplicationReadyEvent\n\nYou can exclude specific auto-configurations: `@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)` -- useful when you need to customize or disable built-in behavior.",
  code: `// Standard Spring Boot entry point
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(MyApplication.class, args);
        // Context is ready, all beans initialized
    }
}

// Customizing component scan
@SpringBootApplication(
    scanBasePackages = {"com.example.app", "com.example.shared"},
    exclude = {DataSourceAutoConfiguration.class}
)
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

// Programmatic startup customization
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.setAdditionalProfiles("dev");
        app.run(args);
    }
}

// Using CommandLineRunner for startup tasks
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository repo) {
        return args -> {
            repo.save(new User("admin", "admin@example.com"));
            System.out.println("Database initialized");
        };
    }
}`,
  interviewQs: [
    {
      id: "12-1-q0",
      q: "What does @SpringBootApplication do? What annotations does it combine?",
      a: "@SpringBootApplication is a meta-annotation combining @ComponentScan (scans for components in the current package and sub-packages), @EnableAutoConfiguration (auto-configures beans based on classpath dependencies), and @SpringBootConfiguration (marks the class as a configuration source). It serves as the entry point for Spring Boot applications.",
      difficulty: "junior",
    },
    {
      id: "12-1-q1",
      q: "How does @EnableAutoConfiguration work under the hood? How does Spring Boot know which beans to create?",
      a: "Spring Boot reads auto-configuration class names from META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (or spring.factories in older versions). Each auto-configuration class is a @Configuration guarded by @Conditional annotations like @ConditionalOnClass, @ConditionalOnMissingBean. For example, if spring-boot-starter-web is on the classpath, DispatcherServletAutoConfiguration creates the DispatcherServlet -- but only if you haven't defined your own. This 'opinionated defaults with easy overrides' is the core Spring Boot philosophy.",
      difficulty: "mid",
    },
    {
      id: "12-1-q2",
      q: "What happens step-by-step when SpringApplication.run() is called? How is the application context built?",
      a: "SpringApplication.run() first detects the application type (SERVLET, REACTIVE, NONE) by checking for classes on the classpath. It creates the appropriate ApplicationContext type, locates and runs SpringApplicationRunListeners, prepares the Environment with properties and profiles, creates the context, loads bean definitions from the @SpringBootApplication class, triggers auto-configuration via @EnableAutoConfiguration, refreshes the context (BFPPs run, beans instantiate, BPPs process, embedded server starts), calls ApplicationRunner/CommandLineRunner beans, and finally publishes ApplicationReadyEvent. If anything fails, a FailureAnalyzer provides user-friendly error messages.",
      difficulty: "senior",
    },
  ],
  tip: "Place your `@SpringBootApplication` class in the root package so that `@ComponentScan` covers all sub-packages automatically.\n\n---\n\nРазмещайте класс с `@SpringBootApplication` в корневом пакете, чтобы `@ComponentScan` автоматически охватывал все подпакеты.",
  springConnection: null,
};
