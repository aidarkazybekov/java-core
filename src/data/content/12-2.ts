import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "12-2",
  blockId: 12,
  title: "Starters & Auto-configuration",
  summary:
    "Стартеры -- предварительно упакованные наборы зависимостей для обеспечения определенной функциональности. Автоконфигурация определяет, какие бины создать, основываясь на classpath и @Conditional аннотациях.\n\n---\n\nStarters are pre-packaged dependency sets that provide specific functionality. Auto-configuration uses @Conditional annotations to determine which beans to create based on classpath contents and existing bean definitions.",
  deepDive:
    "## Что такое стартер?\n\nСтартер -- предварительно упакованные наборы зависимостей и сконфигурированных бинов для обеспечения определенной функциональности, например, доступа к базе данных или безопасности.\n\nClasspath -- это путь, где среда выполнения JVM или инструменты сборки ищут нужные классы и библиотеки во время работы приложения. Когда запускается Java-приложение, JVM должна знать, где искать файлы .class или архивы .jar. Именно эти директории и jar-файлы называются classpath.\n\nАвтоконфигурация: Spring Boot автоматически определяет, какие бины и настройки нужно создать, ориентируясь на зависимости (стартеры) и наличие классов в classpath.\n\n---\n\n**Starters** are curated dependency descriptors. Adding a single starter dependency to your pom.xml/build.gradle pulls in all necessary libraries with compatible versions. Examples:\n\n- `spring-boot-starter-web` -- embedded Tomcat, Spring MVC, Jackson JSON\n- `spring-boot-starter-data-jpa` -- Hibernate, HikariCP, Spring Data JPA\n- `spring-boot-starter-security` -- Spring Security with defaults\n- `spring-boot-starter-test` -- JUnit 5, Mockito, AssertJ, MockMvc\n\nStarters follow the naming convention `spring-boot-starter-{module}`. They don't contain code -- only dependency declarations in their POM.\n\n**Auto-configuration** is the mechanism that reads the classpath and configures beans automatically. Each auto-configuration class uses conditional annotations:\n\n- `@ConditionalOnClass` -- activate only if a class is on the classpath\n- `@ConditionalOnMissingBean` -- activate only if the user hasn't defined this bean\n- `@ConditionalOnProperty` -- activate based on application.properties values\n- `@ConditionalOnBean` -- activate if a specific bean exists\n- `@ConditionalOnJava` -- activate for specific Java versions\n- `@ConditionalOnResource` -- activate if a specific resource exists\n\nThe key principle is **opinionated defaults with easy overrides**: auto-configuration provides sensible defaults, but defining your own bean always takes precedence (via @ConditionalOnMissingBean). You can exclude auto-configurations with `@SpringBootApplication(exclude = ...)` or `spring.autoconfigure.exclude` in properties.\n\nTo create a custom starter, provide a `-autoconfigure` artifact with @Configuration classes and register them in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.",
  code: `// Spring Boot starters in build.gradle
// dependencies {
//     implementation 'org.springframework.boot:spring-boot-starter-web'
//     implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
//     implementation 'org.springframework.boot:spring-boot-starter-security'
//     testImplementation 'org.springframework.boot:spring-boot-starter-test'
// }

// Auto-configuration in action:
// Just add starter-data-jpa + H2 driver, and you get:
// - DataSource (HikariCP pool pointing to H2)
// - EntityManagerFactory (Hibernate)
// - TransactionManager
// ALL configured automatically without a single @Bean!

// Override auto-configuration by defining your own bean
@Configuration
public class DataSourceConfig {

    @Bean  // This takes precedence over auto-configured DataSource
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost/mydb");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        return new HikariDataSource(config);
    }
}

// Custom auto-configuration class
@AutoConfiguration
@ConditionalOnClass(RedisTemplate.class)
@ConditionalOnProperty(name = "app.cache.enabled", havingValue = "true")
public class AppCacheAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public CacheService cacheService(RedisTemplate<String, Object> redis) {
        return new RedisCacheService(redis);
    }
}

// Excluding unwanted auto-configuration
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    SecurityAutoConfiguration.class
})
public class LightweightApp {
    public static void main(String[] args) {
        SpringApplication.run(LightweightApp.class, args);
    }
}`,
  interviewQs: [
    {
      id: "12-2-q0",
      q: "What is a Spring Boot starter? Give examples of commonly used starters.",
      a: "A starter is a pre-packaged set of compatible dependencies for specific functionality. Examples: spring-boot-starter-web (embedded Tomcat + Spring MVC + Jackson), spring-boot-starter-data-jpa (Hibernate + HikariCP + Spring Data JPA), spring-boot-starter-security (Spring Security defaults), spring-boot-starter-test (JUnit 5 + Mockito + AssertJ). Starters contain no code, only dependency declarations.",
      difficulty: "junior",
    },
    {
      id: "12-2-q1",
      q: "How does Spring Boot auto-configuration decide which beans to create? How can you override it?",
      a: "Auto-configuration classes use @Conditional annotations: @ConditionalOnClass checks if classes are on the classpath, @ConditionalOnMissingBean checks if the user already defined a bean, @ConditionalOnProperty checks application properties. To override: define your own @Bean (takes precedence via @ConditionalOnMissingBean), exclude auto-configurations via @SpringBootApplication(exclude=...), or set properties to disable features (e.g., spring.autoconfigure.exclude).",
      difficulty: "mid",
    },
    {
      id: "12-2-q2",
      q: "How would you create a custom Spring Boot starter for a company-internal library?",
      a: "Create two modules: (1) an autoconfigure module with @AutoConfiguration classes using @Conditional annotations, registered in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports; (2) a starter module that depends on the autoconfigure module plus the library itself. The auto-configuration should use @ConditionalOnMissingBean so users can override defaults, @ConditionalOnClass for optional features, and @ConfigurationProperties for externalized configuration. Include spring-boot-configuration-processor for IDE support of properties.",
      difficulty: "senior",
    },
  ],
  tip: "Run your app with `--debug` flag or set `debug=true` in properties to see the auto-configuration report -- it shows which configurations were applied and which were skipped, and why.\n\n---\n\nЗапустите приложение с флагом `--debug` или `debug=true` в properties, чтобы увидеть отчет автоконфигурации -- какие конфигурации применены, какие пропущены и почему.",
  springConnection: null,
};
