import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "13-2",
  blockId: 13,
  title: "Controllers & Annotations",
  summary:
    "@Controller -- обработчик веб-запросов с возвратом представления. @RestController объединяет @Controller и @ResponseBody для возврата данных в JSON/XML. @RequestMapping и производные (@GetMapping, @PostMapping и т.д.) определяют маршруты URL.\n\n---\n\n@Controller handles web requests returning views. @RestController combines @Controller + @ResponseBody for JSON/XML data responses. @RequestMapping and its shortcuts (@GetMapping, @PostMapping, etc.) define URL routes.",
  deepDive:
    "## Контроллеры в Spring MVC\n\nКлассы контроллеров помечаются аннотациями:\n- **@Controller** -- регистрирует класс как контроллер, обработчик веб-запросов. Возвращаемое значение интерпретируется как имя представления (view name).\n- **@RestController** -- объединяет @Controller и @ResponseBody. Используется для RESTful контроллеров, методы которых по умолчанию возвращают данные в виде JSON или XML.\n- **@RequestMapping** -- определяет общий маршрут URL.\n\nМетоды-обработчики помечаются аннотациями:\n- @RequestMapping и производные: @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping\n- @RequestParam -- для связывания параметров запроса с параметрами метода\n- @PathVariable -- встраивает значения из URL в параметры метода\n- @RequestBody -- связывает тело запроса с параметром метода (десериализация JSON)\n- @ResponseBody -- возвращаемое значение метода записывается в тело ответа\n\n---\n\n**@Controller vs @RestController**: @Controller is for traditional MVC where methods return view names resolved by ViewResolver (Thymeleaf, JSP). @RestController is a convenience annotation that adds @ResponseBody to every method, so return values are serialized directly to the response body via HttpMessageConverter (Jackson for JSON).\n\n**Request mapping annotations**:\n- `@RequestMapping(value = \"/api\", method = RequestMethod.GET)` -- base annotation\n- `@GetMapping(\"/users\")` -- shorthand for GET requests\n- `@PostMapping(\"/users\")` -- shorthand for POST requests\n- `@PutMapping(\"/users/{id}\")` -- full resource update\n- `@PatchMapping(\"/users/{id}\")` -- partial resource update\n- `@DeleteMapping(\"/users/{id}\")` -- resource deletion\n\n**Parameter binding annotations**:\n- `@PathVariable` -- extracts from URL path: `/users/{id}`\n- `@RequestParam` -- extracts from query string: `?name=John&age=30`\n- `@RequestBody` -- deserializes the HTTP body (typically JSON) into a Java object\n- `@RequestHeader` -- extracts HTTP header values\n- `@CookieValue` -- extracts cookie values\n- `@ModelAttribute` -- binds form data to an object\n\n**ResponseEntity** gives full control over the HTTP response: status code, headers, and body. It's preferred over @ResponseStatus for dynamic responses.",
  code: `// @RestController for RESTful API
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/v1/users?page=0&size=20
    @GetMapping
    public Page<UserDto> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userService.findAll(PageRequest.of(page, size));
    }

    // GET /api/v1/users/42
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/v1/users (JSON body)
    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        UserDto created = userService.create(request);
        URI location = URI.create("/api/v1/users/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    // PUT /api/v1/users/42
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDto updated = userService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/v1/users/42
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Using @RequestHeader and @CookieValue
    @GetMapping("/profile")
    public UserDto getProfile(
            @RequestHeader("Authorization") String authHeader,
            @CookieValue(value = "session", required = false) String session) {
        String token = authHeader.replace("Bearer ", "");
        return userService.getByToken(token);
    }
}`,
  interviewQs: [
    {
      id: "13-2-q0",
      q: "What is the difference between @Controller and @RestController?",
      a: "@Controller marks a class as a web controller where method return values are interpreted as view names. @RestController is @Controller + @ResponseBody combined -- method return values are automatically serialized to JSON/XML and written to the response body. Use @Controller for server-rendered pages (Thymeleaf), @RestController for REST APIs.",
      difficulty: "junior",
    },
    {
      id: "13-2-q1",
      q: "Explain the difference between @RequestParam, @PathVariable, and @RequestBody. When do you use each?",
      a: "@PathVariable extracts values from the URL path (/users/{id}) -- used for resource identifiers. @RequestParam extracts query string parameters (?page=0&size=20) -- used for filtering, sorting, pagination. @RequestBody deserializes the entire HTTP body (JSON/XML) into a Java object -- used for POST/PUT payloads. @PathVariable and @RequestParam handle simple values; @RequestBody handles complex objects. All three can be combined in one method.",
      difficulty: "mid",
    },
    {
      id: "13-2-q2",
      q: "How does Spring MVC content negotiation work? How does it decide between JSON and XML responses?",
      a: "Spring uses ContentNegotiationManager which checks (in order): URL path extension (.json/.xml, disabled by default in newer versions), query parameter (?format=json), Accept header (application/json vs application/xml). The matching HttpMessageConverter handles serialization -- MappingJackson2HttpMessageConverter for JSON, Jaxb2RootElementHttpMessageConverter for XML. You can configure preferred media types, default content type, and strategy precedence via WebMvcConfigurer.configureContentNegotiation(). @RequestMapping(produces = \"application/json\") narrows a handler to specific media types.",
      difficulty: "senior",
    },
  ],
  tip: "Use `ResponseEntity` for full control over HTTP status codes, headers, and body in REST APIs instead of just returning objects directly.\n\n---\n\nИспользуйте `ResponseEntity` для полного контроля над HTTP статус-кодами, заголовками и телом ответа в REST API вместо простого возврата объектов.",
  springConnection: null,
};
