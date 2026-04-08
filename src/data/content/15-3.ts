import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-3",
  blockId: 15,
  title: "Spring Cache",
  summary:
    "Spring Cache предоставляет абстракцию кэширования через аннотации: @Cacheable (кэширование результата), @CachePut (обновление кэша), @CacheEvict (удаление из кэша). Поддерживает ConcurrentMapCache, EhCache, Redis, Caffeine и другие провайдеры.\n\n---\n\nSpring Cache provides a caching abstraction via annotations: @Cacheable (cache results), @CachePut (update cache), @CacheEvict (remove from cache). Supports ConcurrentMapCache, EhCache, Redis, Caffeine and other providers.",
  deepDive:
    "## Spring Cache\n\n" +
    "Spring предоставляет абстракцию кэширования, позволяющую прозрачно добавлять кэширование к методам через аннотации.\n\n" +
    "Основные аннотации:\n" +
    "- **@EnableCaching** -- включает поддержку кэширования\n" +
    "- **@Cacheable** -- кэширует результат метода\n" +
    "- **@CachePut** -- обновляет кэш (метод всегда выполняется)\n" +
    "- **@CacheEvict** -- удаляет записи из кэша\n" +
    "- **@Caching** -- комбинирование нескольких аннотаций\n\n---\n\n" +
    "## How Spring Cache Works\n\n" +
    "Spring Cache is an AOP-based abstraction. `@Cacheable` creates a proxy that intercepts calls: if the result for the given key is in cache, it returns the cached value without executing the method. If not, it executes the method and stores the result.\n\n" +
    "**Key concepts:**\n" +
    "- **Cache name** -- logical name for a cache region\n" +
    "- **Key** -- determines which cached entry to use (default: method parameters via SimpleKeyGenerator)\n" +
    "- **CacheManager** -- manages Cache instances\n\n" +
    "**Annotations:**\n" +
    "- `@Cacheable(\"users\")` -- cache the result. Next call with same args returns from cache.\n" +
    "- `@CachePut(\"users\")` -- always executes the method and updates the cache. Use for update operations.\n" +
    "- `@CacheEvict(\"users\")` -- removes entries. `allEntries=true` clears entire cache.\n" +
    "- `@CacheEvict(beforeInvocation=true)` -- evicts before method runs (useful if method might fail).\n\n" +
    "**Cache providers:** ConcurrentMapCache (default, in-memory), Caffeine (high-performance in-memory), Redis (distributed), EhCache (feature-rich). Production typically uses Redis for distributed caching or Caffeine for local caching.\n\n" +
    "**SpEL for keys:** `@Cacheable(value=\"users\", key=\"#id\")` or `key=\"#user.email\"`.\n\n" +
    "**Conditional caching:** `condition=\"#result != null\"`, `unless=\"#result.age < 18\"`.",
  code: `// ===== Enable Caching =====
@Configuration
@EnableCaching
public class CacheConfig {

    // Using Caffeine as cache provider
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

// ===== Caching in Service =====
@Service
public class UserService {

    private final UserRepository userRepository;

    // Cache the result -- next call with same id returns from cache
    @Cacheable(value = "users", key = "#id")
    public UserDto findById(Long id) {
        log.info("Loading user from DB: {}", id);
        return userRepository.findById(id)
            .map(userMapper::toDto)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    // Always execute and update cache
    @CachePut(value = "users", key = "#result.id")
    public UserDto update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found"));
        user.setName(request.getName());
        return userMapper.toDto(userRepository.save(user));
    }

    // Remove from cache
    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    // Clear entire cache
    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        log.info("User cache cleared");
    }

    // Conditional caching
    @Cacheable(value = "users", key = "#email",
               unless = "#result == null")
    public UserDto findByEmail(String email) {
        return userRepository.findByEmail(email)
            .map(userMapper::toDto)
            .orElse(null);
    }
}

// ===== Redis Cache Configuration =====
// application.yml:
// spring.cache.type: redis
// spring.cache.redis.time-to-live: 600000  # 10 min
// spring.data.redis.host: localhost
// spring.data.redis.port: 6379`,
  interviewQs: [
    {
      id: "15-3-q0",
      q: "What are the main Spring Cache annotations and what does each do?",
      a: "@Cacheable caches the method result -- subsequent calls with same parameters return from cache without executing the method. @CachePut always executes the method and updates the cache (use for updates). @CacheEvict removes entries from cache (use for deletes). @EnableCaching on a configuration class activates caching support.",
      difficulty: "junior",
    },
    {
      id: "15-3-q1",
      q: "How does @Cacheable determine the cache key? How can you customize it?",
      a: "By default, SimpleKeyGenerator creates the key from all method parameters. Customize with: (1) key attribute using SpEL: @Cacheable(key=\"#id\") or @Cacheable(key=\"#user.email\"). (2) Custom KeyGenerator bean. (3) condition/unless for conditional caching: condition=\"#id > 0\" (don't cache if false), unless=\"#result == null\" (don't cache null results). For complex keys: @Cacheable(key=\"{#name, #age}\").",
      difficulty: "mid",
    },
    {
      id: "15-3-q2",
      q: "What are the challenges of distributed caching and how do you handle cache invalidation?",
      a: "Challenges: (1) Cache consistency -- stale data when DB is updated by another service. (2) Cache stampede -- many concurrent requests on cache miss all hit DB. (3) Serialization overhead -- objects must be serializable for Redis. Solutions: (1) TTL-based expiration as safety net + explicit eviction on writes. (2) Cache stampede: use @Cacheable with sync=true (only one thread computes). (3) For multi-service: use Redis pub/sub for cross-service cache invalidation, or accept eventual consistency with short TTLs. (4) Cache-aside pattern: check cache, on miss load from DB and populate cache.",
      difficulty: "senior",
    },
  ],
  tip: "Всегда устанавливайте TTL (время жизни) для кэша -- бесконечный кэш ведёт к устаревшим данным и утечкам памяти.\n\n---\n\nAlways set TTL (time-to-live) for caches -- infinite cache leads to stale data and memory leaks.",
  springConnection: null,
};
