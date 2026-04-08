import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "16-3",
  blockId: 16,
  title: "Request / Response Structure",
  summary:
    "HTTP-сообщение состоит из трех частей: стартовая строка (Request Line / Status Line), заголовки (Headers) и тело (Body). Запрос содержит метод, URL и версию протокола. Ответ содержит статус-код. Параметры передаются через query params, path variables, заголовки и тело запроса.\n\n---\n\n" +
    "An HTTP message has three parts: start line (request line or status line), headers, and body. The request carries the method, URL, and protocol version. The response carries the status code. Data can be passed via query parameters, path variables, headers, and the request body.",
  deepDive:
    "## Структура HTTP-запроса\n\n" +
    "**1. Стартовая строка (Request Line)**\nСодержит три элемента: метод (GET, POST...), URL ресурса, версию протокола (HTTP/1.1). Пример: `GET /api/users?page=1 HTTP/1.1`\n\n" +
    "**2. Заголовки (Headers)**\nМета-информация о запросе/ответе. Ключевые заголовки:\n" +
    "- `Content-Type` -- формат тела (application/json, multipart/form-data)\n" +
    "- `Accept` -- какой формат ответа ожидает клиент\n" +
    "- `Authorization` -- токен аутентификации (Bearer JWT)\n" +
    "- `Cache-Control` -- правила кэширования\n" +
    "- `Content-Length` -- размер тела в байтах\n\n" +
    "**3. Тело сообщения (Body)**\nДанные, передаваемые с запросом. Обычно используется с POST, PUT, PATCH. GET и DELETE обычно не имеют тела.\n\n" +
    "## Способы передачи параметров\n\n" +
    "- **Path Variables** -- часть URL: `/api/users/{id}` -> `/api/users/42`\n" +
    "- **Query Parameters** -- после `?` в URL: `/api/users?role=admin&page=1`\n" +
    "- **Request Body** -- данные в формате JSON/XML в теле запроса\n" +
    "- **Headers** -- метаданные: Authorization, Accept-Language\n\n" +
    "## Структура HTTP-ответа\n\n" +
    "**1. Строка статуса (Status Line):** `HTTP/1.1 200 OK`\n" +
    "**2. Заголовки ответа:** Content-Type, Set-Cookie, Location (для 201/301)\n" +
    "**3. Тело ответа:** данные в JSON/XML/HTML\n\n---\n\n" +
    "## HTTP Request Structure\n\n" +
    "An HTTP request consists of three parts:\n\n" +
    "**1. Request Line** -- Contains the HTTP method, request target (URI), and HTTP version. Example: `POST /api/v1/orders HTTP/1.1`. The URI can include a path, query string, and fragment.\n\n" +
    "**2. Headers** -- Key-value pairs providing metadata. Common request headers:\n" +
    "- `Content-Type: application/json` -- tells the server the format of the body\n" +
    "- `Accept: application/json` -- tells the server what format the client expects\n" +
    "- `Authorization: Bearer <token>` -- authentication credentials\n" +
    "- `Cache-Control: no-cache` -- caching directives\n" +
    "- `User-Agent` -- client identification\n" +
    "- `Cookie` -- session data from previous responses\n\n" +
    "**3. Body** -- The payload, typically JSON for REST APIs. Used with POST, PUT, PATCH. GET and DELETE usually have no body (though HTTP spec technically allows it).\n\n" +
    "## Ways to Pass Data\n\n" +
    "- **Path Variables** (`@PathVariable`) -- embedded in the URL path: `/users/42`. Used for identifying specific resources.\n" +
    "- **Query Parameters** (`@RequestParam`) -- appended after `?`: `/users?role=admin&page=1`. Used for filtering, sorting, pagination.\n" +
    "- **Request Body** (`@RequestBody`) -- JSON/XML in the message body. Used for creating/updating resources.\n" +
    "- **Headers** (`@RequestHeader`) -- metadata like authorization tokens, content negotiation, custom headers.\n" +
    "- **Cookies** (`@CookieValue`) -- small data stored by the browser, sent automatically with requests to the same domain.\n\n" +
    "## HTTP Response Structure\n\n" +
    "**1. Status Line** -- HTTP version + status code + reason phrase: `HTTP/1.1 201 Created`\n" +
    "**2. Response Headers** -- Content-Type, Content-Length, Set-Cookie, Location (URI of newly created resource with 201), ETag, Cache-Control.\n" +
    "**3. Response Body** -- The resource representation, typically JSON.",
  code: `// Spring MVC: all parameter types demonstrated
@RestController
@RequestMapping("/api/v1")
public class RequestDemoController {

    // Path Variable: /api/v1/users/42
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // Query Parameters: /api/v1/users?role=admin&page=0&size=20
    @GetMapping("/users")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.findByRole(role, pageable));
    }

    // Request Body: JSON in POST body
    @PostMapping("/users")
    public ResponseEntity<User> createUser(
            @RequestBody @Valid CreateUserRequest body) {
        User user = userService.create(body);
        return ResponseEntity
            .created(URI.create("/api/v1/users/" + user.getId()))
            .header("X-Custom-Header", "user-created")
            .body(user);
    }

    // Headers: reading Authorization and custom headers
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader(value = "X-Request-Id",
                           required = false) String requestId) {
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(profileService.getByToken(token));
    }

    // Cookie: reading session cookie
    @GetMapping("/preferences")
    public ResponseEntity<Preferences> getPrefs(
            @CookieValue(value = "session_id",
                         required = false) String sessionId) {
        return ResponseEntity.ok(prefService.getBySession(sessionId));
    }

    // Combined: path var + query param + header + body
    @PutMapping("/users/{id}/settings")
    public ResponseEntity<Settings> updateSettings(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean notify,
            @RequestHeader("Authorization") String auth,
            @RequestBody SettingsRequest body) {
        Settings updated = settingsService.update(id, body, notify);
        return ResponseEntity.ok(updated);
    }
}

// DTO classes
record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @NotNull String role
) {}

record SettingsRequest(
    String theme,
    String language,
    boolean notifications
) {}`,
  interviewQs: [
    {
      id: "16-3-q0",
      q: "Из каких частей состоит HTTP-запрос? / What are the parts of an HTTP request?",
      a: "HTTP-запрос состоит из трех частей: (1) Стартовая строка (Request Line) -- содержит метод, URL и версию протокола; (2) Заголовки (Headers) -- мета-информация (Content-Type, Authorization, Accept); (3) Тело (Body) -- данные запроса, обычно JSON. // An HTTP request has three parts: (1) Request Line with method, URL, and HTTP version; (2) Headers with metadata like Content-Type, Authorization, Accept; (3) Body containing the payload, typically JSON for REST APIs.",
      difficulty: "junior",
    },
    {
      id: "16-3-q1",
      q: "When should you use path variables vs query parameters vs request body?",
      a: "Path variables identify a specific resource: /users/42 -- the 42 is the user ID. They are mandatory and part of the resource URI. Query parameters are for optional filtering, sorting, pagination: /users?role=admin&sort=name. They do not identify the resource. Request body is for sending complex data when creating or updating resources (POST, PUT, PATCH). Rule of thumb: path vars for resource identification, query params for collection modifiers, body for resource representation.",
      difficulty: "mid",
    },
    {
      id: "16-3-q2",
      q: "Explain Content-Type and Accept header negotiation. What happens if they conflict?",
      a: "Content-Type tells the server the format of the request body (e.g., application/json). Accept tells the server what response format the client prefers (e.g., Accept: application/xml). The server checks Accept and returns 406 Not Acceptable if it cannot produce that format. In Spring MVC, @RequestMapping(produces = 'application/json') restricts what the endpoint can produce. If the client sends Content-Type: application/xml but the endpoint expects JSON, Spring returns 415 Unsupported Media Type. Content negotiation can also be done via URL suffix (/users.json) or query param (?format=json).",
      difficulty: "senior",
    },
  ],
  tip: "В Spring используйте @RequestParam(defaultValue = ...) вместо required = false с ручными проверками на null. Это упрощает код и делает API предсказуемым.",
  springConnection: null,
};
