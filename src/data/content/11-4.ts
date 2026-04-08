import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-4",
  blockId: 11,
  title: "Bean Scopes",
  summary:
    "Spring поддерживает scope бинов: singleton (один на контейнер, по умолчанию), prototype (новый при каждом запросе), request, session, application и websocket для веб-приложений.\n\n---\n\nSpring supports bean scopes: singleton (one per container, default), prototype (new instance per request), and web-aware scopes -- request, session, application, and websocket -- for web applications.",
  deepDive:
    "## Scope бинов\n\n1. **Singleton** (по умолчанию) -- Один экземпляр на контейнер. Все запросы к бину возвращают один и тот же объект.\n2. **Prototype** -- каждый запрос к контейнеру возвращает новый экземпляр бина. Контейнер не отслеживает prototype-бины после создания.\n3. **Request** -- создается на каждый HTTP-запрос и уничтожается по завершении запроса.\n4. **Session** -- создается на сессию пользователя и уничтожается при завершении сессии.\n5. **Application** -- один экземпляр на все веб-приложение (ServletContext).\n6. **WebSocket** -- один экземпляр на сессию WebSocket.\n\n---\n\nBean scope determines how many instances of a bean the container creates and how long they live:\n\n**Singleton** (default): A single instance shared across the entire ApplicationContext. All injections and `getBean()` calls return the same object. Thread safety is the developer's responsibility -- avoid mutable shared state or use synchronization.\n\n**Prototype**: A new instance is created every time the bean is requested. Spring handles creation and initialization but does NOT manage destruction -- @PreDestroy is never called. Use for stateful, short-lived objects.\n\n**Request** (web only): One instance per HTTP request. Scoped via a proxy (CGLIB or interface-based) so it can be injected into singleton beans. The bean is destroyed when the request completes.\n\n**Session** (web only): One instance per HTTP session. Lives as long as the user session. Also proxy-scoped for injection into singletons.\n\n**Application** (web only): One instance per ServletContext. Similar to singleton but specifically tied to the web application context, not the Spring ApplicationContext.\n\n**WebSocket** (web only): One instance per WebSocket session lifecycle.\n\nA common pitfall: injecting a shorter-lived scope (prototype, request) into a singleton. The singleton gets one instance at creation time and never refreshes it. Solutions:\n- `@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)` -- creates a CGLIB proxy that delegates to the current scope\n- `ObjectFactory<T>` or `Provider<T>` -- lazily resolve a new instance each time\n- `@Lookup` method injection -- Spring overrides the method to return a fresh bean",
  code: `// Singleton (default) -- one instance shared everywhere
@Service
@Scope("singleton") // optional, this is the default
public class ConfigService {
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public String getProperty(String key) {
        return cache.computeIfAbsent(key, this::loadFromDb);
    }
}

// Prototype -- new instance every time
@Component
@Scope("prototype")
public class ShoppingCart {
    private final List<Item> items = new ArrayList<>();

    public void addItem(Item item) { items.add(item); }
    public List<Item> getItems() { return Collections.unmodifiableList(items); }
}

// Injecting prototype into singleton -- THE PROBLEM
@Service
public class OrderServiceBroken {
    private final ShoppingCart cart; // WRONG: same cart instance forever!

    public OrderServiceBroken(ShoppingCart cart) {
        this.cart = cart;
    }
}

// Solution 1: Scoped proxy
@Component
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShoppingCartProxy {
    private final List<Item> items = new ArrayList<>();
}

// Solution 2: ObjectFactory / Provider
@Service
public class OrderServiceFixed {
    private final ObjectFactory<ShoppingCart> cartFactory;

    public OrderServiceFixed(ObjectFactory<ShoppingCart> cartFactory) {
        this.cartFactory = cartFactory;
    }

    public void processOrder() {
        ShoppingCart cart = cartFactory.getObject(); // fresh instance
        cart.addItem(new Item("Coffee"));
    }
}

// Request scope -- one per HTTP request
@Component
@RequestScope // shorthand for @Scope("request", proxyMode = TARGET_CLASS)
public class RequestContext {
    private String traceId;
    private Instant startTime = Instant.now();

    public void setTraceId(String id) { this.traceId = id; }
    public String getTraceId() { return traceId; }
}`,
  interviewQs: [
    {
      id: "11-4-q0",
      q: "What bean scopes does Spring support? What is the default scope?",
      a: "Spring supports singleton (default -- one instance per container), prototype (new instance per request), and web-aware scopes: request (per HTTP request), session (per HTTP session), application (per ServletContext), and websocket (per WebSocket session). The default is singleton.",
      difficulty: "junior",
    },
    {
      id: "11-4-q1",
      q: "What happens when you inject a prototype-scoped bean into a singleton? How do you fix it?",
      a: "The singleton receives one prototype instance at creation time and reuses it forever, defeating the purpose of prototype scope. Fixes: (1) Use @Scope(proxyMode = ScopedProxyMode.TARGET_CLASS) on the prototype to create a CGLIB proxy that delegates to a new instance each time. (2) Inject ObjectFactory<T> or javax.inject.Provider<T> and call getObject()/get() when needed. (3) Use @Lookup method injection so Spring overrides a method to return a fresh prototype.",
      difficulty: "mid",
    },
    {
      id: "11-4-q2",
      q: "How does Spring implement request and session scopes internally? What role do proxies play?",
      a: "Request/session-scoped beans are stored in the corresponding servlet request/session attributes. Spring creates a CGLIB proxy (or JDK proxy for interfaces) that is injected into singletons. When a method is called on the proxy, it looks up the real bean from the current request/session via RequestContextHolder (which uses ThreadLocal). This is why you need RequestContextListener or RequestContextFilter registered -- they bind the HTTP request to the current thread. Without the proxy, a singleton would hold a stale reference from the first request.",
      difficulty: "senior",
    },
  ],
  tip: "When injecting request/session-scoped beans into singletons, always use scoped proxies (`@RequestScope`, `@SessionScope`) -- they handle the lifecycle transparently.\n\n---\n\nПри внедрении request/session-scoped бинов в синглтоны всегда используйте scoped-прокси (`@RequestScope`, `@SessionScope`) -- они прозрачно управляют жизненным циклом.",
  springConnection: null,
};
