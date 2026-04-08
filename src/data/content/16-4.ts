import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "16-4",
  blockId: 16,
  title: "RestTemplate & WebClient",
  summary:
    "RestTemplate -- синхронный HTTP-клиент Spring для выполнения запросов к RESTful сервисам. Предоставляет методы для GET, POST, PUT, DELETE. WebClient -- реактивный неблокирующий HTTP-клиент на основе Project Reactor, пришедший на замену RestTemplate начиная со Spring 5.\n\n---\n\n" +
    "RestTemplate is Spring's synchronous HTTP client for making REST API calls, providing convenience methods for GET, POST, PUT, DELETE. WebClient is the reactive, non-blocking replacement introduced in Spring 5, built on Project Reactor and Netty. WebClient is now the recommended choice for new applications.",
  deepDive:
    "## RestTemplate\n\n" +
    "RestTemplate -- синхронный клиент для HTTP-запросов к RESTful сервисам. Предоставляет упрощенные методы:\n" +
    "- `getForObject()` / `getForEntity()` -- GET-запрос\n" +
    "- `postForObject()` / `postForEntity()` -- POST-запрос\n" +
    "- `put()` -- PUT-запрос\n" +
    "- `delete()` -- DELETE-запрос\n" +
    "- `exchange()` -- универсальный метод для любого HTTP-метода\n\n" +
    "RestTemplate блокирует поток до получения ответа. В микросервисной архитектуре это может быть проблемой -- один медленный сервис блокирует весь поток.\n\n" +
    "С Spring 5 RestTemplate переведен в режим поддержки (maintenance mode). Новый код рекомендуется писать на WebClient.\n\n" +
    "## WebClient\n\n" +
    "WebClient -- реактивный HTTP-клиент на основе reactor-netty:\n" +
    "- Неблокирующий -- использует 1 поток на CPU-ядро\n" +
    "- Fluent API с цепочкой вызовов\n" +
    "- Иммутабельный и потокобезопасный\n" +
    "- Поддерживает как реактивные (Mono/Flux), так и синхронные (block()) вызовы\n" +
    "- Встроенная поддержка streaming, SSE, backpressure\n\n---\n\n" +
    "## RestTemplate\n\n" +
    "RestTemplate is a synchronous, blocking HTTP client that has been part of Spring since version 3.0. It wraps Java's HttpURLConnection (by default) or Apache HttpClient. Key methods:\n" +
    "- `getForObject(url, ResponseType.class)` -- GET, returns the deserialized body directly\n" +
    "- `getForEntity(url, ResponseType.class)` -- GET, returns ResponseEntity with headers and status\n" +
    "- `postForEntity(url, request, ResponseType.class)` -- POST with body\n" +
    "- `exchange(url, method, entity, ResponseType.class)` -- flexible method for any HTTP method with full control\n\n" +
    "RestTemplate blocks the calling thread until the response arrives. In a microservices environment, if Service A calls Service B synchronously and B is slow, A's thread pool gets exhausted. This is why RestTemplate was deprecated in favor of WebClient.\n\n" +
    "## WebClient\n\n" +
    "WebClient is the modern, non-blocking HTTP client introduced in Spring WebFlux (Spring 5). Built on Reactor Netty, it uses an event loop model with 1 thread per CPU core handling thousands of concurrent connections.\n\n" +
    "Key characteristics:\n" +
    "- **Non-blocking:** returns Mono<T> or Flux<T>, the actual HTTP call happens when someone subscribes\n" +
    "- **Fluent API:** method chaining for building requests: .uri().header().body().retrieve()\n" +
    "- **Immutable:** WebClient instances are immutable and thread-safe, create once and reuse\n" +
    "- **Connection pooling:** built-in connection pool management via Reactor Netty\n" +
    "- **Can be used in blocking apps:** call .block() to get a synchronous result (but loses non-blocking benefits)\n\n" +
    "WebClient supports streaming responses, Server-Sent Events, and backpressure. For service-to-service communication, use APPLICATION_NDJSON; for browser streaming, use TEXT_EVENT_STREAM.",
  code: `// ===== RestTemplate Examples =====
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}

@Service
public class UserServiceClient {
    private final RestTemplate restTemplate;
    private static final String BASE_URL = "http://user-service/api/v1";

    // GET request
    public UserDto getUser(Long id) {
        return restTemplate.getForObject(
            BASE_URL + "/users/{id}", UserDto.class, id);
    }

    // GET with ResponseEntity (access headers, status)
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return restTemplate.exchange(
            BASE_URL + "/users",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<UserDto>>() {});
    }

    // POST request
    public UserDto createUser(CreateUserRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CreateUserRequest> entity = new HttpEntity<>(request, headers);
        return restTemplate.postForObject(
            BASE_URL + "/users", entity, UserDto.class);
    }

    // PUT request
    public void updateUser(Long id, UserDto user) {
        restTemplate.put(BASE_URL + "/users/{id}", user, id);
    }

    // DELETE request
    public void deleteUser(Long id) {
        restTemplate.delete(BASE_URL + "/users/{id}", id);
    }
}

// ===== WebClient Examples =====
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            .baseUrl("http://user-service/api/v1")
            .defaultHeader(HttpHeaders.CONTENT_TYPE,
                MediaType.APPLICATION_JSON_VALUE)
            .filter(ExchangeFilterFunctions
                .basicAuthentication("user", "password"))
            .build();
    }
}

@Service
public class ReactiveUserClient {
    private final WebClient webClient;

    // GET - returns Mono (single value)
    public Mono<UserDto> getUser(Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(UserDto.class);
    }

    // GET - returns Flux (collection/stream)
    public Flux<UserDto> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(UserDto.class);
    }

    // POST with body
    public Mono<UserDto> createUser(CreateUserRequest request) {
        return webClient.post()
            .uri("/users")
            .bodyValue(request)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError,
                resp -> resp.bodyToMono(String.class)
                    .map(body -> new RuntimeException("Client error: " + body)))
            .bodyToMono(UserDto.class);
    }

    // Using WebClient in blocking (non-reactive) application
    public UserDto getUserBlocking(Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(UserDto.class)
            .block(); // blocks the thread -- use only in non-reactive apps
    }
}`,
  interviewQs: [
    {
      id: "16-4-q0",
      q: "Что такое RestTemplate и чем он отличается от WebClient? / What is RestTemplate and how does it differ from WebClient?",
      a: "RestTemplate -- синхронный (блокирующий) HTTP-клиент Spring. Он блокирует поток до получения ответа. WebClient -- реактивный неблокирующий клиент на основе Reactor Netty, использующий Mono/Flux. WebClient использует event loop с малым числом потоков для тысяч соединений. С Spring 5 RestTemplate в режиме поддержки, WebClient -- рекомендуемый выбор. // RestTemplate is synchronous and blocks the thread. WebClient is reactive, non-blocking, uses Mono/Flux, and handles thousands of connections with few threads. RestTemplate is in maintenance mode since Spring 5.",
      difficulty: "junior",
    },
    {
      id: "16-4-q1",
      q: "How do you handle errors with WebClient?",
      a: "WebClient provides onStatus() for declarative error handling. Use retrieve().onStatus(HttpStatusCode::is4xxClientError, response -> ...) to transform error responses into exceptions. You can also use exchangeToMono() for full control over the response, including status, headers, and body. For retries, chain .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))). For timeouts, use .timeout(Duration.ofSeconds(5)). For circuit breaking, combine with Resilience4j: the WebClient call wrapped in CircuitBreaker.decorateSupplier().",
      difficulty: "mid",
    },
    {
      id: "16-4-q2",
      q: "Why was RestTemplate deprecated, and what problems does WebClient solve?",
      a: "RestTemplate was deprecated because it blocks a thread per request. In microservices, if Service A has a 200-thread pool and calls Service B which is slow (2s per response), only 200 concurrent requests are possible -- thread pool exhaustion. WebClient uses Reactor Netty's event loop: a small number of threads (typically 1 per CPU core) handles thousands of concurrent connections via non-blocking I/O. Threads are never idle waiting for a response. However, WebClient adds complexity: reactive programming requires understanding Mono/Flux, subscription semantics, and backpressure. For simple apps with low concurrency, the new RestClient (Spring 6.1) provides a synchronous fluent API without reactive complexity.",
      difficulty: "senior",
    },
  ],
  tip: "Если вы не используете реактивный стек, рассмотрите RestClient (Spring 6.1+) -- он предоставляет fluent API как у WebClient, но синхронный и без зависимости от WebFlux.",
  springConnection: null,
};
