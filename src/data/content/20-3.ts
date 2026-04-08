import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "20-3",
  blockId: 20,
  title: "Maven",
  summary:
    "Apache Maven is a build automation and dependency management tool. It uses a POM (Project Object Model) XML file to define project structure, dependencies, and build lifecycle phases: clean, compile, test, package, install, deploy.",
  deepDive:
    "## Maven\n\nApache Maven -- инструмент для управления проектом, его зависимостями и сборкой.\n\n### Используется для:\n\n- Автоматизации сборки\n- Управления зависимостями\n- Стандартизации структуры кода\n- Повторяемости и воспроизводимости сборки\n\n### Основные команды (фазы жизненного цикла):\n\n- **clean** -- очистка проекта (удаление папки target)\n- **compile** -- компиляция исходного кода\n- **test** -- запуск модульных тестов\n- **package** -- собирает и упаковывает проект в JAR, WAR или другой формат артефакта\n- **install** -- устанавливает собранный артефакт в локальный репозиторий Maven для использования в других проектах\n- **clean install** -- выполняет очистку, компиляцию, тестирование и установку в локальный репозиторий\n\n### POM (Project Object Model):\n\nФайл pom.xml -- центральный конфигурационный файл Maven, определяющий:\n\n- **groupId** -- идентификатор организации (com.example)\n- **artifactId** -- имя проекта\n- **version** -- версия проекта\n- **dependencies** -- внешние зависимости\n- **plugins** -- плагины для сборки\n- **parent** -- родительский POM для наследования конфигурации\n\n---\n\n## Apache Maven\n\nMaven is a build automation and project management tool widely used in the Java ecosystem. It follows the principle of \"convention over configuration\" with a standard project structure.\n\n### Standard Project Structure:\n\n```\nproject/\n├── pom.xml\n├── src/\n│   ├── main/\n│   │   ├── java/        ← Source code\n│   │   └── resources/   ← Config files\n│   └── test/\n│       ├── java/        ← Test code\n│       └── resources/   ← Test config\n└── target/              ← Build output\n```\n\n### Build Lifecycle Phases:\n\nMaven's default lifecycle runs phases in order -- executing a later phase automatically runs all earlier ones:\n\n1. **validate** -- check project is correct and all info is available\n2. **compile** -- compile the source code\n3. **test** -- run unit tests using a framework like JUnit\n4. **package** -- package compiled code into a JAR/WAR\n5. **verify** -- run integration tests and quality checks\n6. **install** -- install the package into the local Maven repository (~/.m2/repository)\n7. **deploy** -- copy the final package to a remote repository for sharing\n\nThe **clean** lifecycle (`mvn clean`) removes the target/ directory.\n\n### POM (Project Object Model):\n\nThe pom.xml file is the core of a Maven project, defining:\n\n- **GAV coordinates** (groupId, artifactId, version) -- unique project identifier\n- **Dependencies** -- external libraries with their versions and scopes (compile, test, runtime, provided)\n- **Plugins** -- extend Maven's behavior (compiler, surefire, shade, etc.)\n- **Parent POM** -- inheritance mechanism (Spring Boot Starter Parent sets defaults)\n- **Properties** -- variables like Java version, encoding\n- **Profiles** -- environment-specific configurations (dev, prod)\n\n### Dependency Scopes:\n\n- **compile** (default) -- available everywhere\n- **test** -- only for test compilation and execution (JUnit, Mockito)\n- **runtime** -- not needed for compilation, needed at runtime (JDBC drivers)\n- **provided** -- needed at compile time but supplied by the container at runtime (Servlet API)",
  code: `<!-- ─── pom.xml Example ─── -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <!-- Parent POM (Spring Boot) -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <!-- Project coordinates (GAV) -->
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <!-- Properties -->
    <properties>
        <java.version>17</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <!-- Dependencies -->
    <dependencies>
        <!-- compile scope (default) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- runtime scope -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- test scope -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- Build plugins -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

<!-- ─── Common Maven Commands ─── -->
<!-- mvn clean              — Delete target/ directory       -->
<!-- mvn compile            — Compile source code            -->
<!-- mvn test               — Run unit tests                 -->
<!-- mvn package            — Create JAR/WAR                 -->
<!-- mvn install            — Install to local ~/.m2 repo    -->
<!-- mvn clean install      — Clean + full build + install   -->
<!-- mvn dependency:tree    — Show dependency tree           -->`,
  interviewQs: [
    {
      id: "20-3-q0",
      q: "What are the main phases of the Maven build lifecycle?",
      a: "The default lifecycle phases in order are: validate, compile, test, package, verify, install, deploy. Running a later phase automatically executes all earlier phases. For example, 'mvn package' runs validate, compile, test, then package. The clean lifecycle ('mvn clean') has its own phase that deletes the target directory. The most common command is 'mvn clean install' which cleans, compiles, tests, packages, and installs the artifact to the local repository.",
      difficulty: "junior",
    },
    {
      id: "20-3-q1",
      q: "Explain the difference between Maven dependency scopes: compile, test, runtime, and provided.",
      a: "compile (default): available on all classpaths -- compilation, testing, and runtime. test: only available during test compilation and execution (e.g., JUnit, Mockito). runtime: not needed for compilation but required at runtime (e.g., JDBC drivers -- you code against javax.sql interfaces). provided: needed at compile time but expected to be supplied by the runtime environment (e.g., Servlet API is provided by Tomcat). Understanding scopes prevents bloated deployments and classpath conflicts.",
      difficulty: "mid",
    },
    {
      id: "20-3-q2",
      q: "How does Maven resolve dependency conflicts when two libraries require different versions of the same transitive dependency?",
      a: "Maven uses two rules: (1) Nearest definition wins -- the version declared closest to the root of the dependency tree is selected. (2) First declaration wins -- if two dependencies are at the same depth, the one declared first in the POM is used. You can control this with <dependencyManagement> to enforce specific versions across the project, <exclusions> to remove unwanted transitive dependencies, and 'mvn dependency:tree' to diagnose conflicts. The BOM (Bill of Materials) pattern, used by Spring Boot's starter-parent, centralizes version management.",
      difficulty: "senior",
    },
  ],
  tip: "Run 'mvn dependency:tree' regularly to understand your transitive dependencies and catch version conflicts early, before they cause runtime ClassNotFoundException.",
  springConnection: null,
};
