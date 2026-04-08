import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-3",
  blockId: 18,
  title: "Redis Fundamentals",
  summary:
    "Redis -- сверхбыстрая in-memory NoSQL база данных (key-value хранилище). Хранит данные в оперативной памяти, обеспечивая операции за микросекунды. Многоцелевая структура данных: строки, списки, множества, хэши. Применения: кэширование, Pub/Sub, очереди сообщений, хранение сессий, rate limiting, геопространственные данные.\n\n---\n\n" +
    "Redis is an ultra-fast, in-memory NoSQL database (key-value store). It stores data in RAM, providing sub-millisecond operations. Multi-purpose data structures: strings, lists, sets, hashes. Use cases: caching, Pub/Sub, message queues, session storage, rate limiting, geospatial data.",
  deepDive:
    "## Что такое Redis?\n\n" +
    "Redis (Remote Dictionary Server) -- in-memory NoSQL база данных. Одна из самых популярных и любимых технологий среди разработчиков.\n\n" +
    "**Ключевые характеристики:**\n" +
    "- Сверхбыстрый (amazingly fast) -- данные хранятся в оперативной памяти\n" +
    "- Многоцелевые структуры данных (multi-purpose data structures)\n" +
    "- Simple key-value store -- ключи и значения могут быть любой бинарной строкой\n" +
    "- Поддерживает до 2^32 ключей (более 4 миллиардов)\n" +
    "- Максимальный размер значения -- 512 МБ\n\n" +
    "**Основные сценарии использования:**\n" +
    "- Кэширование (caching) -- ускорение доступа к часто запрашиваемым данным\n" +
    "- Pub/Sub -- система публикации и подписки на события\n" +
    "- Очереди сообщений (message queue)\n" +
    "- Streaming -- обработка потоков данных\n" +
    "- Геопространственные данные (GeoSpatial)\n" +
    "- Хранение сессий (session store)\n" +
    "- Rate limiting -- ограничение частоты запросов\n\n---\n\n" +
    "## What is Redis?\n\n" +
    "Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine. It keeps the entire dataset in memory, achieving sub-millisecond read/write latency.\n\n" +
    "**Key characteristics:**\n" +
    "- **In-memory:** All data lives in RAM. Reads/writes take microseconds instead of milliseconds. Redis achieves 100K+ operations per second on a single node.\n" +
    "- **Persistence options:** Despite being in-memory, Redis can persist data to disk via RDB snapshots (periodic point-in-time saves) or AOF (Append-Only File, logs every write command). You can use both for maximum durability.\n" +
    "- **Single-threaded core:** Redis processes commands sequentially on a single thread, eliminating lock contention and race conditions. I/O multiplexing (epoll/kqueue) handles thousands of connections. Since Redis 6, I/O threads handle network read/write, but command execution remains single-threaded.\n" +
    "- **Rich data structures:** Not just key-value. Supports Strings, Lists, Sets, Sorted Sets, Hashes, Streams, Bitmaps, HyperLogLog, Geospatial indexes.\n\n" +
    "**Common use cases:**\n" +
    "- **Caching:** Store frequently accessed data (user profiles, API responses) to reduce database load. TTL (Time-To-Live) auto-expires stale entries.\n" +
    "- **Session store:** Store HTTP sessions in Redis instead of application memory. Enables stateless app servers and session sharing across instances.\n" +
    "- **Rate limiting:** Use INCR and EXPIRE to count requests per time window. Simple and atomic.\n" +
    "- **Pub/Sub:** Real-time messaging between services without polling.\n" +
    "- **Distributed locks:** SETNX (SET if Not eXists) with TTL for distributed lock implementation (Redisson provides higher-level abstractions).\n" +
    "- **Leaderboards/Counters:** Sorted Sets with ZINCRBY for real-time rankings.",
  code: `// ===== Spring Boot Redis Configuration =====
// build.gradle: implementation 'org.springframework.boot:spring-boot-starter-data-redis'

// application.yml
/*
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: secret
      timeout: 2000
*/

// ===== Redis as Cache (Spring Cache abstraction) =====
@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair
                    .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}

@Service
public class UserService {

    // Cached: first call hits DB, subsequent calls return from Redis
    @Cacheable(value = "users", key = "#id")
    public UserDto findById(Long id) {
        log.info("Cache miss, querying database for user {}", id);
        return userRepository.findById(id)
            .map(this::toDto)
            .orElseThrow();
    }

    // Evict cache when data changes
    @CacheEvict(value = "users", key = "#id")
    public void updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setName(request.name());
        userRepository.save(user);
    }

    // Update cache with new value
    @CachePut(value = "users", key = "#result.id")
    public UserDto createUser(CreateUserRequest request) {
        User user = userRepository.save(new User(request.name()));
        return toDto(user);
    }
}

// ===== RedisTemplate for direct operations =====
@Service
public class SessionService {

    private final RedisTemplate<String, String> redisTemplate;

    // Simple key-value operations
    public void saveSession(String sessionId, String userData) {
        redisTemplate.opsForValue()
            .set("session:" + sessionId, userData, Duration.ofHours(1));
    }

    public String getSession(String sessionId) {
        return redisTemplate.opsForValue().get("session:" + sessionId);
    }

    // Rate limiting with INCR + EXPIRE
    public boolean isRateLimited(String userId, int maxRequests) {
        String key = "rate:" + userId + ":" + Instant.now().getEpochSecond() / 60;
        Long count = redisTemplate.opsForValue().increment(key);
        if (count == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }
        return count > maxRequests;
    }
}`,
  interviewQs: [
    {
      id: "18-3-q0",
      q: "Что такое Redis и для чего он используется? / What is Redis and what is it used for?",
      a: "Redis -- in-memory NoSQL база данных (key-value хранилище). Данные хранятся в оперативной памяти, обеспечивая операции за микросекунды. Основные применения: кэширование (снижение нагрузки на БД), хранение сессий, Pub/Sub, очереди сообщений, rate limiting, геопространственные данные, распределённые блокировки. // Redis is an in-memory NoSQL key-value store. Data lives in RAM, providing sub-millisecond operations. Used for: caching, session storage, Pub/Sub, message queues, rate limiting, distributed locks.",
      difficulty: "junior",
    },
    {
      id: "18-3-q1",
      q: "How does Redis persist data if it is an in-memory database?",
      a: "Redis offers two persistence mechanisms: (1) RDB (Redis Database) snapshots -- periodic point-in-time snapshots saved to disk (e.g., every 5 minutes if 100+ keys changed). Fast recovery but can lose data between snapshots. (2) AOF (Append-Only File) -- logs every write command to a file. On restart, Redis replays the log. Options: fsync every second (default, at most 1 second of data loss), fsync every command (safest but slowest), never fsync (OS decides). You can use both: AOF for durability, RDB for faster backup/restore. Redis 7 uses multi-part AOF for better rewrite performance.",
      difficulty: "mid",
    },
    {
      id: "18-3-q2",
      q: "Why is Redis single-threaded, and how does it still achieve high throughput?",
      a: "Redis processes commands on a single thread to avoid locking overhead, context switching, and race conditions. All operations are atomic by nature of single-threaded execution. Despite being single-threaded, Redis achieves 100K+ ops/sec because: (1) all data is in memory -- no disk I/O latency; (2) I/O multiplexing (epoll/kqueue) handles thousands of connections on one thread; (3) operations are O(1) or O(log n) -- no long-running commands block others; (4) since Redis 6, I/O threads handle network read/write in parallel while command execution remains single-threaded. The bottleneck is usually network bandwidth, not CPU. For CPU-bound workloads (Lua scripts, big key operations), Redis Cluster distributes load across multiple nodes.",
      difficulty: "senior",
    },
  ],
  tip: "Всегда устанавливайте TTL (время жизни) для кэшированных ключей. Без TTL Redis будет накапливать данные, пока не закончится память -- тогда начнёт работать политика вытеснения (eviction).",
  springConnection: null,
};
