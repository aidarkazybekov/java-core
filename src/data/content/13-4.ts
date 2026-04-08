import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "13-4",
  blockId: 13,
  title: "File Upload & Properties",
  summary:
    "Загрузка файлов в Spring MVC реализуется через MultipartFile. Spring автоматически разбирает multipart/form-data запросы. Размер файлов настраивается через spring.servlet.multipart.*. Properties файлы (.properties / .yml) хранят конфигурацию в формате ключ-значение; значения внедряются через @Value или Environment.\n\n---\n\nFile upload in Spring MVC uses MultipartFile. Spring automatically parses multipart/form-data requests. File size limits are configured via spring.servlet.multipart.*. Properties files (.properties / .yml) store key-value configuration; values are injected via @Value or the Environment interface.",
  deepDive:
    "## Загрузка файлов (MultiPart Request)\n\n" +
    "Это механизм, позволяющий клиентам отправлять файлы. Spring автоматически разбирает такие запросы и предоставляет объект MultipartFile, с которым можно работать.\n\n" +
    "**Настройка размера файлов:**\n" +
    "- `spring.servlet.multipart.max-file-size: 10MB` -- ограничение на одиночный файл\n" +
    "- `spring.servlet.multipart.max-request-size: 10MB` -- ограничение на все файлы в запросе\n\n" +
    "Для отправки frontend должен устанавливать Content-Type: `multipart/form-data`.\n\n" +
    "## Свойства проекта. Properties файлы\n\n" +
    "**Properties file** -- текстовый файл для хранения конфигурационных параметров в формате ключ-значение.\n\n" +
    "Виды: `*.properties` и `*.yml` (отличаются синтаксисом).\n\n" +
    "- **@PropertySource** -- добавляет источник пар свойств ключ-значение в среду Spring (используется вместе с @Configuration)\n" +
    "- **@Value** -- внедрение значений из properties файла\n" +
    "- **Environment** -- интерфейс, предоставляющий доступ к профилям и свойствам приложения. Является компонентом контекста, поэтому можно внедрять в другие компоненты.\n\n---\n\n" +
    "## File Upload (MultiPart Request)\n\n" +
    "Spring MVC handles file uploads via `MultipartFile` interface. The embedded server (Tomcat) parses the multipart request automatically. Key configuration properties:\n" +
    "- `spring.servlet.multipart.enabled=true` (default)\n" +
    "- `spring.servlet.multipart.max-file-size=10MB`\n" +
    "- `spring.servlet.multipart.max-request-size=10MB`\n" +
    "- `spring.servlet.multipart.file-size-threshold=2KB` (threshold after which files are written to disk)\n\n" +
    "The client must send the request with `Content-Type: multipart/form-data`. Multiple files can be uploaded using `MultipartFile[]` or `List<MultipartFile>`.\n\n" +
    "## Properties Files\n\n" +
    "Spring Boot supports two configuration formats: `.properties` (flat key=value) and `.yml` (hierarchical YAML). Both are loaded from `application.properties` / `application.yml` in the classpath.\n\n" +
    "**Property injection mechanisms:**\n" +
    "- `@Value(\"${property.key}\")` -- inject a single property into a field\n" +
    "- `@ConfigurationProperties(prefix)` -- bind a group of properties to a POJO (type-safe configuration)\n" +
    "- `Environment.getProperty(\"key\")` -- programmatic access\n" +
    "- `@PropertySource(\"classpath:custom.properties\")` -- load additional property files\n\n" +
    "**Profile-specific properties:** `application-{profile}.yml` is loaded when the profile is active. Set via `spring.profiles.active=dev`.\n\n" +
    "**Property precedence (highest to lowest):** command-line args > environment variables > application-{profile}.yml > application.yml > defaults.",
  code: `// ===== File Upload =====
@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        String filename = file.getOriginalFilename();
        long size = file.getSize();
        String contentType = file.getContentType();

        // Save to disk
        Path target = Path.of("/uploads", filename);
        Files.copy(file.getInputStream(), target,
                   StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok("Uploaded: " + filename + " (" + size + " bytes)");
    }

    // Multiple file upload
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadMultiple(
            @RequestParam("files") List<MultipartFile> files) {
        List<String> names = files.stream()
            .map(MultipartFile::getOriginalFilename)
            .toList();
        // process files...
        return ResponseEntity.ok(names);
    }
}

// ===== Properties & Configuration =====
// application.yml
/*
app:
  name: MyService
  upload:
    max-size: 10MB
    allowed-types: jpg,png,pdf
  api:
    base-url: https://api.example.com
    timeout: 5000
*/

// @Value injection
@Service
public class ApiClient {
    @Value("\${app.api.base-url}")
    private String baseUrl;

    @Value("\${app.api.timeout:3000}")  // default value 3000
    private int timeout;
}

// @ConfigurationProperties (type-safe)
@Configuration
@ConfigurationProperties(prefix = "app.upload")
public class UploadProperties {
    private String maxSize;
    private List<String> allowedTypes;
    // getters + setters
}

// Using Environment
@Service
public class ConfigService {
    private final Environment env;

    public ConfigService(Environment env) {
        this.env = env;
    }

    public String getAppName() {
        return env.getProperty("app.name", "DefaultApp");
    }

    public boolean isDevProfile() {
        return Arrays.asList(env.getActiveProfiles()).contains("dev");
    }
}`,
  interviewQs: [
    {
      id: "13-4-q0",
      q: "How do you handle file uploads in Spring Boot? What is MultipartFile?",
      a: "Add @RequestParam(\"file\") MultipartFile to a controller method. MultipartFile provides getOriginalFilename(), getSize(), getContentType(), getInputStream(), and transferTo() for saving. The client sends multipart/form-data. Configure max sizes via spring.servlet.multipart.max-file-size and max-request-size in application.yml. Spring auto-configures a MultipartResolver (StandardServletMultipartResolver) with Spring Boot.",
      difficulty: "junior",
    },
    {
      id: "13-4-q1",
      q: "What is the difference between @Value, @ConfigurationProperties, and Environment for reading properties?",
      a: "@Value(\"${key}\") injects a single property -- simple but scattered across classes. @ConfigurationProperties(prefix) binds a group of properties to a POJO -- type-safe, supports validation with @Validated, and centralizes related config. Environment is a programmatic API for dynamic property access at runtime. Best practice: use @ConfigurationProperties for structured config groups, @Value for one-off values, and Environment when properties are determined at runtime.",
      difficulty: "mid",
    },
    {
      id: "13-4-q2",
      q: "Explain Spring Boot's property resolution order and how profile-specific configuration works.",
      a: "Spring Boot loads properties in a defined precedence order (higher overrides lower): (1) command-line arguments, (2) JNDI attributes, (3) Java system properties, (4) OS environment variables, (5) application-{profile}.properties/yml, (6) application.properties/yml, (7) @PropertySource annotations, (8) default properties. Profile-specific files (application-dev.yml) activate when spring.profiles.active=dev is set. You can also use @Profile on beans for conditional registration. Multiple profiles can be active simultaneously, and properties from all active profiles are merged.",
      difficulty: "senior",
    },
  ],
  tip: "Используйте `@ConfigurationProperties` вместо множества `@Value` -- это безопаснее по типам и удобнее для группировки связанных настроек.\n\n---\n\nUse `@ConfigurationProperties` instead of many `@Value` annotations -- it is type-safe and better for grouping related settings.",
  springConnection: null,
};
