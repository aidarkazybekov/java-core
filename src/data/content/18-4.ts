import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-4",
  blockId: 18,
  title: "Redis Data Structures",
  summary:
    "Redis поддерживает множество структур данных: Strings, Lists, Sets, Sorted Sets (ZSets), Hashes, Streams, Bitmaps, HyperLogLog. Каждая структура оптимизирована для конкретных задач: строки для кэша, списки для очередей, сортированные множества для рейтингов.\n\n---\n\nRedis supports multiple data structures: Strings, Lists, Sets, Sorted Sets (ZSets), Hashes, Streams, Bitmaps, HyperLogLog. Each is optimized for specific tasks: strings for cache, lists for queues, sorted sets for leaderboards.",
  deepDive:
    "## Структуры данных Redis\n\n" +
    "Redis -- это не просто key-value хранилище, а сервер структур данных:\n" +
    "- **Strings** -- базовый тип, строки до 512MB\n" +
    "- **Lists** -- упорядоченные списки строк (FIFO/LIFO)\n" +
    "- **Sets** -- неупорядоченные уникальные элементы\n" +
    "- **Sorted Sets (ZSets)** -- множества с весом (score) для сортировки\n" +
    "- **Hashes** -- пары поле-значение (как Map)\n\n---\n\n" +
    "## Data Structures Deep Dive\n\n" +
    "**Strings:** Most basic type. Use for caching, counters (INCR/DECR), distributed locks (SETNX). Commands: SET, GET, INCR, EXPIRE, SETNX.\n\n" +
    "**Lists:** Doubly-linked lists. O(1) push/pop at both ends. Use for queues (LPUSH + RPOP), activity feeds, recent items. Commands: LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN.\n\n" +
    "**Sets:** Unordered unique strings. O(1) add/remove/membership check. Use for tags, unique visitors, social graphs. Commands: SADD, SREM, SMEMBERS, SISMEMBER, SUNION, SINTER.\n\n" +
    "**Sorted Sets (ZSets):** Like Sets but each element has a score for ordering. O(log N) insert. Use for leaderboards, priority queues, time-series. Commands: ZADD, ZRANGE, ZRANGEBYSCORE, ZRANK, ZREM.\n\n" +
    "**Hashes:** Field-value pairs under one key (like a Map). Memory-efficient for objects. Use for user profiles, product details. Commands: HSET, HGET, HGETALL, HDEL, HINCRBY.\n\n" +
    "**Streams:** Append-only log (like Kafka). Consumer groups, acknowledgment. Use for event sourcing, message queues.\n\n" +
    "**Bitmaps:** Bit-level operations on strings. Use for feature flags, daily active users.\n\n" +
    "**HyperLogLog:** Probabilistic cardinality estimation. Use for counting unique elements with minimal memory (~12KB for billions).",
  code: `// ===== Redis Data Structures with Spring =====
@Service
public class RedisDataStructureService {

    private final RedisTemplate<String, String> redis;

    // ===== Strings (caching, counters) =====
    public void cacheUser(String userId, String json) {
        redis.opsForValue().set("user:" + userId, json,
            Duration.ofMinutes(30));
    }

    public Long incrementCounter(String name) {
        return redis.opsForValue().increment("counter:" + name);
    }

    // ===== Lists (queues, recent items) =====
    public void addToQueue(String queue, String message) {
        redis.opsForList().leftPush("queue:" + queue, message);
    }

    public String pollFromQueue(String queue) {
        return redis.opsForList().rightPop("queue:" + queue);
    }

    public List<String> getRecentItems(String key, int count) {
        return redis.opsForList().range("recent:" + key, 0, count - 1);
    }

    // ===== Sets (unique items, tags) =====
    public void addTag(String articleId, String tag) {
        redis.opsForSet().add("tags:" + articleId, tag);
    }

    public Set<String> getTags(String articleId) {
        return redis.opsForSet().members("tags:" + articleId);
    }

    public Set<String> commonTags(String id1, String id2) {
        return redis.opsForSet().intersect("tags:" + id1, "tags:" + id2);
    }

    // ===== Sorted Sets (leaderboards, ranking) =====
    public void updateScore(String board, String player, double score) {
        redis.opsForZSet().add("leaderboard:" + board, player, score);
    }

    public Set<String> getTopPlayers(String board, int count) {
        return redis.opsForZSet()
            .reverseRange("leaderboard:" + board, 0, count - 1);
    }

    public Long getPlayerRank(String board, String player) {
        return redis.opsForZSet()
            .reverseRank("leaderboard:" + board, player);
    }

    // ===== Hashes (objects, profiles) =====
    public void saveProfile(String userId, Map<String, String> fields) {
        redis.opsForHash().putAll("profile:" + userId, fields);
    }

    public String getProfileField(String userId, String field) {
        return (String) redis.opsForHash()
            .get("profile:" + userId, field);
    }
}`,
  interviewQs: [
    {
      id: "18-4-q0",
      q: "What data structures does Redis support? Name three and their typical use cases.",
      a: "Strings -- caching, counters, distributed locks (SETNX). Lists -- message queues (LPUSH+RPOP), recent activity feeds. Sorted Sets -- leaderboards and rankings (each element has a score for ordering). Also: Sets (unique tags, social graph), Hashes (user profiles as field-value pairs), Streams (event log like Kafka).",
      difficulty: "junior",
    },
    {
      id: "18-4-q1",
      q: "How would you implement a leaderboard with Redis? What operations would you use?",
      a: "Use a Sorted Set (ZSet). ZADD leaderboard player score -- adds/updates player with score. ZREVRANGE leaderboard 0 9 -- gets top 10 (descending). ZREVRANK leaderboard player -- gets player's rank. ZINCRBY leaderboard increment player -- atomically increments score. All operations are O(log N), supporting millions of players efficiently. For per-period leaderboards, use separate keys (leaderboard:2024-01) with TTL.",
      difficulty: "mid",
    },
    {
      id: "18-4-q2",
      q: "When would you use Redis Hashes vs storing serialized JSON strings? What are the trade-offs?",
      a: "Hashes: store individual fields (HSET user:1 name John). Advantages -- partial updates without reading/writing the entire object, individual field TTL not possible but field-level HINCRBY for counters, memory-efficient for small objects (ziplist encoding). Strings with JSON: simpler code, one SET/GET, works with any serialization. Advantages -- easier caching with @Cacheable, complex nested structures, easier migration. Choose Hashes when you need partial reads/updates (e.g., only read user.email, increment user.loginCount). Choose Strings when you read/write entire objects atomically.",
      difficulty: "senior",
    },
  ],
  tip: "Используйте Sorted Sets для рейтингов и таблиц лидеров -- операции O(log N) даже при миллионах элементов.\n\n---\n\nUse Sorted Sets for rankings and leaderboards -- O(log N) operations even with millions of elements.",
  springConnection: null,
};
