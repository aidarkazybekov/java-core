import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-4",
  blockId: 18,
  title: "Redis Data Structures",
  summary:
    "Redis поддерживает богатый набор структур данных: String (строки, числа, бинарные данные), List (списки -- двусвязные списки), Set (множества -- уникальные элементы), Sorted Set (упорядоченные множества с весом/score), Hash (хэши -- поля и значения внутри ключа). Каждая структура оптимизирована для конкретных сценариев использования.\n\n---\n\n" +
    "Redis supports rich data structures: String (text, numbers, binary data), List (doubly linked lists), Set (unique unordered elements), Sorted Set (unique elements ordered by score), Hash (field-value pairs inside a key). Each structure is optimized for specific use cases.",
  deepDive:
    "## Структуры данных Redis\n\n" +
    "Redis -- не просто key-value хранилище. Значения могут быть различными структурами данных, каждая со своими командами и оптимизациями.\n\n" +
    "**String** -- базовый тип. Может хранить строки, числа, бинарные данные (до 512 МБ). Команды: SET, GET, INCR, DECR, APPEND, STRLEN. Используется для кэширования, счётчиков, хранения сериализованных объектов.\n\n" +
    "**List** -- упорядоченная последовательность строк (двусвязный список). Команды: LPUSH/RPUSH (добавление), LPOP/RPOP (извлечение), LRANGE (диапазон), LLEN (длина). Используется для очередей (FIFO: LPUSH + RPOP), стеков (LIFO: LPUSH + LPOP), лент новостей.\n\n" +
    "**Set** -- неупорядоченная коллекция уникальных строк. Команды: SADD, SREM, SMEMBERS, SISMEMBER, SINTER/SUNION/SDIFF. Используется для тегов, уникальных посетителей, общих друзей (пересечение множеств).\n\n" +
    "**Sorted Set (ZSet)** -- множество с оценкой (score) для каждого элемента. Элементы уникальны, упорядочены по score. Команды: ZADD, ZRANGE, ZRANGEBYSCORE, ZINCRBY, ZRANK. Используется для рейтингов, лидербордов, приоритетных очередей.\n\n" +
    "**Hash** -- набор пар поле-значение внутри одного ключа. Как маленький объект. Команды: HSET, HGET, HMSET, HGETALL, HDEL, HINCRBY. Используется для хранения объектов (пользователь с полями name, email, age), когда нужен доступ к отдельным полям.\n\n---\n\n" +
    "## Redis Data Structures\n\n" +
    "Redis is a data structure server -- values are not just strings but rich structures with dedicated commands.\n\n" +
    "**String:** The most basic type. Stores text, integers, floating-point numbers, or binary data (up to 512 MB). Commands: SET/GET, INCR/DECR (atomic increment/decrement), SETNX (set if not exists -- used for distributed locks), SETEX (set with expiry). Internally uses SDS (Simple Dynamic String) with O(1) length access.\n\n" +
    "**List:** Ordered sequence of strings implemented as a linked list (actually a quicklist -- a linked list of ziplists for memory efficiency). O(1) push/pop at both ends, O(n) access by index. Use LPUSH+RPOP for FIFO queue, LPUSH+LPOP for LIFO stack. BRPOP provides blocking pop -- consumer blocks until an element is available (useful for job queues).\n\n" +
    "**Set:** Unordered collection of unique strings. O(1) add, remove, and membership check. Supports set operations: SINTER (intersection), SUNION (union), SDIFF (difference). Great for: tags, unique visitors, mutual friends (intersection of two users' friend sets).\n\n" +
    "**Sorted Set (ZSet):** Like Set but each element has a floating-point score. Elements are unique; scores can repeat. Sorted by score (ascending). O(log n) add and remove. ZRANGEBYSCORE retrieves elements within a score range. ZINCRBY atomically increments a score (perfect for leaderboards). ZRANGEBYLEX supports lexicographic range queries when all scores are equal.\n\n" +
    "**Hash:** A map of field-value pairs stored under a single key. Like a mini-object. O(1) per field operation. HSET user:1 name \"John\" email \"john@mail.com\" stores two fields. HINCRBY for atomic field increment. More memory-efficient than storing each field as a separate key. Ideal for storing objects when you need access to individual fields without deserializing the whole value.",
  code: `// ===== Redis Data Structures with Spring RedisTemplate =====

@Service
public class RedisDataStructureDemo {

    private final RedisTemplate<String, String> redis;

    // ===== STRING =====
    public void stringExamples() {
        // Basic set/get
        redis.opsForValue().set("user:1:name", "John");
        String name = redis.opsForValue().get("user:1:name");

        // Set with TTL (auto-expire in 1 hour)
        redis.opsForValue().set("session:abc123", "userData",
            Duration.ofHours(1));

        // Atomic counter (views, likes, rate limiting)
        redis.opsForValue().increment("page:home:views");
        redis.opsForValue().increment("user:1:balance", 100);  // +100

        // SETNX: set only if key doesn't exist (distributed lock)
        Boolean locked = redis.opsForValue()
            .setIfAbsent("lock:order:42", "owner-1", Duration.ofSeconds(30));
    }

    // ===== LIST =====
    public void listExamples() {
        // Queue (FIFO): push left, pop right
        redis.opsForList().leftPush("queue:emails", "email-1");
        redis.opsForList().leftPush("queue:emails", "email-2");
        String next = redis.opsForList().rightPop("queue:emails"); // "email-1"

        // Stack (LIFO): push left, pop left
        redis.opsForList().leftPush("stack:undo", "action-1");
        String last = redis.opsForList().leftPop("stack:undo");

        // Recent items (keep last 100)
        redis.opsForList().leftPush("user:1:recent", "product-42");
        redis.opsForList().trim("user:1:recent", 0, 99);

        // Get range
        List<String> recent = redis.opsForList()
            .range("user:1:recent", 0, 9); // first 10
    }

    // ===== SET =====
    public void setExamples() {
        // Add unique tags
        redis.opsForSet().add("article:1:tags", "java", "spring", "redis");
        redis.opsForSet().add("article:2:tags", "java", "kafka", "docker");

        // Check membership
        Boolean hasTag = redis.opsForSet()
            .isMember("article:1:tags", "java"); // true

        // Intersection: common tags between articles
        Set<String> common = redis.opsForSet()
            .intersect("article:1:tags", "article:2:tags"); // ["java"]

        // Union: all unique tags
        Set<String> all = redis.opsForSet()
            .union("article:1:tags", "article:2:tags");

        // Unique visitors tracking
        redis.opsForSet().add("visitors:2024-01-15", "user:42");
        Long uniqueCount = redis.opsForSet().size("visitors:2024-01-15");
    }

    // ===== SORTED SET (ZSET) =====
    public void sortedSetExamples() {
        // Leaderboard: player scores
        redis.opsForZSet().add("leaderboard:game1", "player-a", 1500);
        redis.opsForZSet().add("leaderboard:game1", "player-b", 2200);
        redis.opsForZSet().add("leaderboard:game1", "player-c", 1800);

        // Increment score (player wins a round)
        redis.opsForZSet().incrementScore("leaderboard:game1", "player-a", 300);

        // Top 3 players (highest scores)
        Set<String> top3 = redis.opsForZSet()
            .reverseRange("leaderboard:game1", 0, 2);

        // Player rank (0-based)
        Long rank = redis.opsForZSet()
            .reverseRank("leaderboard:game1", "player-b"); // 0 = first place

        // Players with score between 1000 and 2000
        Set<String> midTier = redis.opsForZSet()
            .rangeByScore("leaderboard:game1", 1000, 2000);
    }

    // ===== HASH =====
    public void hashExamples() {
        // Store user object as hash
        Map<String, String> user = Map.of(
            "name", "John",
            "email", "john@mail.com",
            "age", "30",
            "role", "ADMIN"
        );
        redis.opsForHash().putAll("user:1", user);

        // Get single field
        Object name2 = redis.opsForHash().get("user:1", "name"); // "John"

        // Get all fields
        Map<Object, Object> allFields = redis.opsForHash().entries("user:1");

        // Update single field (no need to rewrite entire object)
        redis.opsForHash().put("user:1", "email", "john.new@mail.com");

        // Atomic increment of a numeric field
        redis.opsForHash().increment("user:1", "login_count", 1);

        // Delete specific field
        redis.opsForHash().delete("user:1", "role");
    }
}`,
  interviewQs: [
    {
      id: "18-4-q0",
      q: "Какие структуры данных поддерживает Redis? / What data structures does Redis support?",
      a: "Redis поддерживает: String -- строки, числа, бинарные данные; List -- упорядоченные списки (очереди, стеки); Set -- неупорядоченные множества уникальных элементов; Sorted Set -- множества с score для рейтингов; Hash -- пары поле-значение внутри ключа (мини-объекты). Также Streams, Bitmaps, HyperLogLog, Geo. // Redis supports: String (text/numbers/binary), List (ordered, queues/stacks), Set (unique unordered), Sorted Set (unique with score, leaderboards), Hash (field-value pairs, mini-objects). Also Streams, Bitmaps, HyperLogLog, Geo.",
      difficulty: "junior",
    },
    {
      id: "18-4-q1",
      q: "When would you use a Hash vs storing each field as a separate String key?",
      a: "Use Hash when you have an object with multiple fields (user with name, email, age). Advantages: (1) Memory efficiency -- Redis internally uses ziplist encoding for small hashes, which is much more compact than separate keys; (2) Atomic operations on individual fields (HINCRBY for counters); (3) HGETALL retrieves the entire object in one command; (4) Logically groups related data under one key. Use separate String keys when: (1) you need different TTLs for different fields; (2) fields are accessed independently and rarely together; (3) values are large (>64 entries default threshold causes Hash to switch from ziplist to hashtable, losing compression).",
      difficulty: "mid",
    },
    {
      id: "18-4-q2",
      q: "How would you implement a distributed rate limiter using Redis?",
      a: "The simplest approach uses a sliding window with INCR and EXPIRE: key = 'rate:{userId}:{currentMinute}', INCR the key on each request, set EXPIRE 60s on first increment, reject if count > limit. For more precision, use a sliding window log with Sorted Sets: ZADD with timestamp as score, ZRANGEBYSCORE to count requests in the last N seconds, ZREMRANGEBYSCORE to clean old entries. For high throughput, use a token bucket with Lua scripts (atomic operations): store tokens as a String, atomically check-and-decrement. Redis Lua scripts are atomic because Redis is single-threaded. Redisson provides a built-in RRateLimiter that implements the token bucket algorithm.",
      difficulty: "senior",
    },
  ],
  tip: "Для хранения объектов в Redis используйте Hash вместо сериализации в JSON String -- это позволяет обновлять отдельные поля без перезаписи всего объекта и экономит память.",
  springConnection: null,
};
