import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-3",
  blockId: 15,
  title: "Spring Cache",
  summary:
    "Spring Cache абстрагирует кэширование через аннотации: @Cacheable (кэширует результат), @CacheEvict (удаляет из кэша), @CachePut (обновляет кэш). Поддерживает различные провайдеры: ConcurrentMapCache, Caffeine, Redis, EhCache.\n\n---\n\nSpring Cache abstracts caching via annotations: @Cacheable (caches result), @CacheEvict (removes from cache), @CachePut (updates cache). Supports various providers: ConcurrentMapCache, Caffeine, Redis, EhCache.",
  deepDive:
    "## Spring Cache\n\nSpring предоставляет абстракцию кэширования, которая позволяет прозрачно добавлять кэширование к методам через аннотации, не привязываясь к конкретной реализации кэша.\n\nОсновные аннотации:\n- **@Cacheable** -- кэширует результат метода. При повторном вызове с теми же параметрами возвращает значение из кэша без выполнения метода.\n- **@CacheEvict** -- удаляет записи из кэша. Используется при обновлении или удалении данных.\n- **@CachePut** -- всегда выполняет метод и обновляет кэш результатом. Используется для обновления кэша.\n- **@Caching** -- группирует несколько аннотаций кэширования.\n- **@CacheConfig** -- настройки кэша на уровне класса.\n\nHibernate также предоставляет два уровня кэширования:\n- First-level cache -- привязан к Persistence Context (EntityManager), существует в рамках транзакции\n- Second-level cache -- общий для всего приложения, разделяется между сессиями\n\n---\n\n**Spring Cache abstraction** works through AOP proxies (similar to @Transactional). Enable with `@EnableCaching` on a configuration class.\n\n**Core annotations**:\n\n1. `@Cacheable(\"cacheName\")` -- checks cache before method execution. If the key exists, returns cached value without calling the method. Key is generated from method parameters by default.\n   - `key` -- custom SpEL key expression: `@Cacheable(key = \"#userId\")`\n   - `condition` -- only cache when: `@Cacheable(condition = \"#result != null\")`\n   - `unless` -- don't cache when: `@Cacheable(unless = \"#result.size() == 0\")`\n\n2. `@CacheEvict(\"cacheName\")` -- removes entries from cache.\n   - `key` -- specific key to evict\n   - `allEntries = true` -- clear the entire cache\n   - `beforeInvocation = true` -- evict before method runs (default is after)\n\n3. `@CachePut(\"cacheName\")` -- always executes the method and updates the cache. Use for update operations to keep cache consistent.\n\n4. `@Caching(evict = {...}, put = {...})` -- combine multiple cache operations.\n\n**Cache providers** (in order of production recommendation):\n- **Caffeine** -- high-performance in-process cache (replaces Guava Cache)\n- **Redis** -- distributed cache for multi-instance deployments\n- **EhCache** -- feature-rich, supports distributed caching\n- **ConcurrentMapCache** -- simple default (no TTL, no max size -- dev only)\n\n**Important**: Like @Transactional, @Cacheable relies on AOP proxies. Self-invocation bypasses the cache! Also, cached objects should be serializable for distributed caches.\n\n**Cache key design**: Use unique, deterministic keys. Default key generator uses all method parameters. For methods with no parameters, all calls share the same cache entry. Custom KeyGenerator can be implemented for complex scenarios.",
  code: `// Enable caching
@Configuration
@EnableCaching
public class CacheConfig {

    // Caffeine cache with TTL and max size
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(10))
                .recordStats());
        return manager;
    }
}

// Service with caching annotations
@Service
@CacheConfig(cacheNames = "users") // default cache name for class
public class UserService {

    private final UserRepository userRepository;

    // @Cacheable -- cache the result, skip method on cache hit
    @Cacheable(key = "#id")
    public User findById(Long id) {
        log.info("Loading user {} from database", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // @Cacheable with condition
    @Cacheable(key = "#email", unless = "#result == null")
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // @CachePut -- always execute, update cache
    @CachePut(key = "#user.id")
    public User update(User user) {
        log.info("Updating user {}", user.getId());
        return userRepository.save(user);
    }

    // @CacheEvict -- remove from cache
    @CacheEvict(key = "#id")
    public void delete(Long id) {
        log.info("Deleting user {}", id);
        userRepository.deleteById(id);
    }

    // Evict all entries in the cache
    @CacheEvict(allEntries = true)
    public void clearCache() {
        log.info("User cache cleared");
    }

    // Multiple cache operations
    @Caching(
        evict = {
            @CacheEvict(value = "users", key = "#user.id"),
            @CacheEvict(value = "userLists", allEntries = true)
        },
        put = @CachePut(value = "users", key = "#user.id")
    )
    public User updateWithListInvalidation(User user) {
        return userRepository.save(user);
    }
}

// Redis cache configuration (for distributed caching)
// application.properties:
// spring.cache.type=redis
// spring.data.redis.host=localhost
// spring.data.redis.port=6379
// spring.cache.redis.time-to-live=600000`,
  interviewQs: [
    {
      id: "15-3-q0",
      q: "What are the main caching annotations in Spring? How does @Cacheable work?",
      a: "@Cacheable caches the method result -- on subsequent calls with the same key, it returns the cached value without executing the method. @CacheEvict removes entries from cache (used on delete/update). @CachePut always executes the method and updates the cache. Enable with @EnableCaching. The cache key is generated from method parameters by default.",
      difficulty: "junior",
    },
    {
      id: "15-3-q1",
      q: "How do you keep the cache consistent when data is updated? What strategies exist?",
      a: "Strategy 1: Use @CacheEvict on update/delete methods to remove stale entries; next read triggers a fresh load. Strategy 2: Use @CachePut on update methods to update the cache entry with the new value. Strategy 3: Combine both with @Caching when multiple caches need updating. For distributed systems, consider eventual consistency with TTL (time-to-live). Cache-aside pattern (read: check cache -> miss -> load from DB -> store in cache) is the most common. Write-through (update cache + DB together) ensures consistency but adds latency.",
      difficulty: "mid",
    },
    {
      id: "15-3-q2",
      q: "What are the pitfalls of Spring Cache? How does it relate to AOP proxy limitations?",
      a: "Main pitfalls: (1) Self-invocation bypasses cache -- like @Transactional, @Cacheable uses AOP proxies, so calling a cached method from within the same class skips the cache. (2) Default key generation uses all parameters -- methods with no parameters share one cache entry. (3) Cached objects must be serializable for distributed caches (Redis). (4) ConcurrentMapCache (default) has no TTL or size limits -- it grows unbounded. (5) @Cacheable with mutable return values -- modifying the returned object modifies the cache entry. (6) Cache stampede -- many threads miss cache simultaneously and all hit the DB. Use sync=true on @Cacheable to prevent this.",
      difficulty: "senior",
    },
  ],
  tip: "Always configure a proper cache provider (Caffeine for single-instance, Redis for distributed) with TTL and size limits. The default ConcurrentMapCache has no eviction and will eventually cause memory issues.\n\n---\n\nВсегда настраивайте правильный провайдер кэша (Caffeine для одного экземпляра, Redis для распределенных систем) с TTL и лимитами размера. ConcurrentMapCache по умолчанию не имеет вытеснения и может вызвать проблемы с памятью.",
  springConnection: null,
};
