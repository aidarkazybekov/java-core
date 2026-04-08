import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "16-1",
  blockId: 16,
  title: "REST Principles",
  summary:
    "REST (Representational State Transfer) -- архитектурный стиль взаимодействия распределенных систем, определяющий набор принципов для создания удобных API. Основывается на HTTP. Если API соответствует всем принципам REST, она называется RESTful API. API (Application Programming Interface) -- программный интерфейс, описание способов взаимодействия программ друг с другом.\n\n---\n\n" +
    "REST (Representational State Transfer) is an architectural style for distributed systems that defines a set of constraints for building scalable and maintainable web APIs. It operates over HTTP and emphasizes stateless communication, resource-based URIs, and standard HTTP methods. An API that follows all REST constraints is called a RESTful API.",
  deepDive:
    "## Принципы REST\n\n" +
    "REST определяет шесть архитектурных принципов:\n\n" +
    "**1. Клиент-серверная архитектура (Client-Server)**\nКлиент инициирует запрос, сервер принимает, обрабатывает и отправляет данные (ресурсы). Ресурсы имеют уникальный идентификатор в виде URL (Uniform Resource Locator). Клиент может выполнять различные действия с ресурсами -- CRUD операции. Клиент и сервер независимы друг от друга, каждый разрабатывается отдельно.\n\n" +
    "**2. Отсутствие состояния (Stateless)**\nВ период между запросами никакая информация о состоянии клиента на сервере не должна храниться. Запросы от клиента должны содержать всю необходимую информацию для обработки.\n\n" +
    "**3. Кэширование (Cacheable)**\nПромежуточные узлы и клиент могут выполнять кэширование ответов сервера. Ответ должен явно или неявно указывать, можно ли его кэшировать.\n\n" +
    "**4. Единство интерфейса (Uniform Interface)**\n- Ресурсы доступны по уникальному URI\n- Самоописываемые сообщения: запросы и ответы содержат всю информацию для обработки\n- HATEOAS: клиент может получить информацию о связанных ресурсах через гиперссылки в ответе\n\n" +
    "**5. Многоуровневость системы (Layered System)**\nКлиент может взаимодействовать с сервером напрямую или через промежуточные слои (прокси-серверы, балансировщики нагрузки, шлюзы). Клиент не обязан знать о промежуточных слоях.\n\n" +
    "**6. Код по запросу (Code on Demand) -- необязательный**\nСервер может передавать клиенту исполняемый код (JavaScript), расширяя функциональность клиента.\n\n---\n\n" +
    "## REST Principles\n\n" +
    "REST defines six architectural constraints that guide the design of web APIs:\n\n" +
    "**1. Client-Server** -- The client and server are separated. The client sends requests, the server processes them and returns responses (resources). Resources are identified by unique URIs. This separation allows each to evolve independently.\n\n" +
    "**2. Stateless** -- Each request from client to server must contain all information needed to understand and process the request. The server stores no client session state between requests. Authentication tokens, pagination cursors, and filter criteria must be sent with every request.\n\n" +
    "**3. Cacheable** -- Responses must define themselves as cacheable or non-cacheable. Caching can be applied at the client, CDN, or reverse proxy level. HTTP headers like Cache-Control, ETag, and Last-Modified enable this. Proper caching reduces server load and improves latency.\n\n" +
    "**4. Uniform Interface** -- This is the most fundamental REST constraint. It consists of: (a) resource identification via URIs, (b) resource manipulation through representations (JSON, XML), (c) self-descriptive messages with enough metadata, and (d) HATEOAS -- hypermedia as the engine of application state, where responses include links to related resources.\n\n" +
    "**5. Layered System** -- The architecture can include intermediary layers (load balancers, API gateways, caches, security layers) between client and server. The client cannot tell whether it is connected directly to the end server. This enables scalability and security.\n\n" +
    "**6. Code on Demand (optional)** -- Servers can extend client functionality by sending executable code (e.g., JavaScript). This is the only optional constraint. In practice, modern SPAs heavily use this principle.",
  code: `// Spring Boot REST Controller example
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Resource identified by URI: /api/v1/users
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // Resource identified by URI: /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Stateless: all info in the request (JWT token in header)
    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestBody @Valid CreateUserRequest request) {
        UserDto created = userService.create(request);
        URI location = URI.create("/api/v1/users/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    // Cacheable: using ETags
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long id) {
        UserProfile profile = userService.getProfile(id);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
            .eTag(String.valueOf(profile.hashCode()))
            .body(profile);
    }

    // HATEOAS example
    @GetMapping("/{id}/details")
    public EntityModel<UserDto> getUserWithLinks(@PathVariable Long id) {
        UserDto user = userService.findById(id).orElseThrow();
        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).getUser(id)).withSelfRel(),
            linkTo(methodOn(OrderController.class).getOrdersByUser(id))
                .withRel("orders"));
    }
}`,
  interviewQs: [
    {
      id: "16-1-q0",
      q: "Перечислите и кратко опишите принципы REST. / List and briefly describe the REST constraints.",
      a: "REST определяет 6 принципов: (1) Клиент-сервер -- разделение ответственности между клиентом и сервером; (2) Stateless -- сервер не хранит состояние клиента между запросами; (3) Cacheable -- ответы могут кэшироваться; (4) Uniform Interface -- единый интерфейс через URI, самоописательные сообщения и HATEOAS; (5) Layered System -- клиент не знает о промежуточных слоях; (6) Code on Demand (опционально) -- сервер может передавать исполняемый код. // REST defines 6 constraints: (1) Client-Server separation; (2) Stateless -- no server-side session; (3) Cacheable responses; (4) Uniform Interface via URIs, self-descriptive messages, HATEOAS; (5) Layered System with transparent intermediaries; (6) Code on Demand (optional) -- server can send executable code.",
      difficulty: "junior",
    },
    {
      id: "16-1-q1",
      q: "What does Stateless mean in REST, and how does it affect authentication?",
      a: "Stateless means the server does not store any client context (session) between requests. Every request must carry all necessary information. For authentication, this means the server cannot rely on server-side sessions. Instead, each request must include credentials -- typically a JWT token in the Authorization header. The token is self-contained, carrying user identity, roles, and expiration. This is why JWT became the dominant authentication mechanism in RESTful APIs: it allows stateless verification without database lookups on every request.",
      difficulty: "mid",
    },
    {
      id: "16-1-q2",
      q: "Explain HATEOAS and why it is rarely implemented in practice.",
      a: "HATEOAS (Hypermedia As The Engine Of Application State) means API responses include hyperlinks to related resources and available actions. For example, a GET /orders/123 response would include links to /orders/123/items, /orders/123/cancel, etc. The client discovers the API dynamically rather than hardcoding URLs. In practice, HATEOAS is rarely implemented because: (1) it adds complexity and payload size, (2) frontend developers prefer documented endpoints over dynamic discovery, (3) OpenAPI/Swagger provides better tooling for API exploration, (4) clients typically know the API structure at build time. Spring HATEOAS provides EntityModel and CollectionModel to implement it when needed.",
      difficulty: "senior",
    },
  ],
  tip: "REST -- это архитектурный стиль, а не протокол. Не каждый HTTP API является RESTful -- для этого нужно соблюдать все принципы, включая правильные HTTP-методы, статус-коды и URI-дизайн.",
  springConnection: null,
};
