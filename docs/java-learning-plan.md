# Java + Spring Boot: реальный план с нуля

Это практический маршрут «от нуля до нанимаемого Java/Spring Boot разработчика».
Время указано приблизительно при **2-3 часах в день**; делите/умножайте на свой график.

---

## Фаза 0 · Пререквизиты (1-2 недели)

Без этого всё остальное бессмысленно.

- **Терминал + Linux-основы**: `cd`, `ls`, `grep`, `find`, pipe, права доступа, процессы. Это 90% того, что реально нужно.
- **Git**: commit, branch, merge, rebase, reset (и чем отличается `reset --hard` от `reset --soft`), конфликт-резолюшн, работа с удалёнкой.
- **IDE**: IntelliJ IDEA Community достаточно. Выучите 15 горячих клавиш (navigate-to-class, find-usages, refactor-rename, extract-method).
- **Build-tool**: Maven или Gradle — любой один. Поймите что такое `pom.xml`/`build.gradle`, что такое транзитивные зависимости, scope'ы `compile`/`test`/`provided`.

**Проверка**: клонирую чужой Java-проект, собираю, запускаю, делаю изменение и коммичу.

---

## Фаза 1 · Ядро Java (4-6 недель)

Цель — уверенно писать код без фреймворков.

- Синтаксис, типы, примитивы vs обёртки, строки.
- ООП: классы, конструкторы, наследование, интерфейсы, абстрактные классы, `final`/`static`.
- **Коллекции наизусть**: `ArrayList`, `LinkedList`, `HashMap`, `HashSet`, `LinkedHashMap`, `TreeMap` — когда какая, сложность операций.
- Исключения: checked vs unchecked, `try-with-resources`, когда бросать, когда ловить.
- I/O: `Files`, `Path`, чтение/запись.
- Enum'ы, records (Java 16+).
- Generics — базово (`List<T>`, bounded wildcards позже).

> **Пет-проект этой фазы**: CLI-приложение на 500-1000 строк, без фреймворков. Варианты: персональный ledger (учёт расходов в CSV), парсер логов, простой chat в консоли. Главное — **свой код**, не туториал.

**Чекпоинт**: понимаешь разницу между `HashMap` и `TreeMap`, умеешь объяснить, что такое `equals`/`hashCode` контракт, можешь написать рекурсивный обход дерева без подсказки.

---

## Фаза 2 · Продвинутая Java (4-6 недель)

- **Streams и лямбды** — это уже не «продвинуто», это базовый инструментарий. `map`, `filter`, `reduce`, `collect(toMap/groupingBy)`.
- **Optional** — как правильно, не как `if (opt.isPresent()) opt.get()`.
- **Concurrency основы**: `Thread`, `Runnable`, `synchronized`, `volatile`, `ExecutorService`, `CompletableFuture`. Не идите сразу в JMM — это позже.
- **NIO.2**: `Files`, `Path`, `WatchService`.
- **Date/Time API**: `LocalDate`, `Instant`, `Duration`, `ZoneId`. **Забудьте `java.util.Date`**.
- **JVM базово**: heap vs stack, класслоадеры, GC высокоуровнево (детали — фаза 7).

> **Пет-проект**: что-то с параллелизмом. Варианты: веб-скрейпер с пулом потоков, параллельная обработка CSV-файлов, простой chat-сервер на сокетах.

**Чекпоинт**: пишешь простую многопоточную программу без deadlock; объясняешь, почему стрим нельзя переиспользовать; знаешь разницу `Instant` vs `LocalDateTime`.

---

## Фаза 3 · Базы данных + SQL (2-3 недели)

Параллельно с фазой 2 или сразу после.
Большинство джуниоров в этом слабы и теряют на собеседованиях.

- **Реляционная модель**: таблицы, первичный/внешний ключ, нормальные формы (до 3НФ достаточно).
- **SQL**: `SELECT`/`JOIN` всех видов, подзапросы, `GROUP BY`, агрегации, оконные функции (`ROW_NUMBER`, `RANK`, `LAG`).
- **Индексы**: B-tree, когда работают, когда нет; композитные индексы и правило левого префикса.
- **`EXPLAIN`/`EXPLAIN ANALYZE`** — читать план запроса.
- **Транзакции**: ACID, уровни изоляции (`READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`), типичные аномалии (phantom read, lost update).
- Установить локально **PostgreSQL** (не H2, не in-memory). Реальная БД даёт реальные проблемы.

> **Упражнение**: возьмите базу Northwind или Sakila, решите 20 SQL-задач на sqlzoo.net или LeetCode SQL. Без этого за JPA лезть рано.

**Чекпоинт**: пишешь INNER/LEFT JOIN на 3 таблицах без подглядывания, объясняешь на пальцах, что такое READ_COMMITTED vs REPEATABLE_READ.

---

## Фаза 4 · JDBC → Spring Boot (6-8 недель)

**Важно**: перед Spring Boot потратьте 2-3 дня на **голый JDBC**. Напишите CRUD через `Connection`/`PreparedStatement`. Это важно — потом увидите, ЧТО Spring прячет.

Дальше:

- **Spring Core**: IoC, DI, `@Component`/`@Service`/`@Repository`, scopes (singleton, prototype), `@Configuration`/`@Bean`.
- **Spring Boot**: автоконфигурация, starters, `application.yml`, профили.
- **Spring MVC**: `@RestController`, `@GetMapping`/`@PostMapping`, `@RequestBody`/`@PathVariable`/`@RequestParam`, Jackson (JSON сериализация), Bean Validation (`@Valid`, `@NotNull`).
- **Spring Data JPA**: `@Entity`, отношения (`@OneToMany`, `@ManyToOne`), репозитории, JPQL vs native SQL.
- **Hibernate под капотом**: persistence context, lazy loading, **проблема N+1** (обязательно).
- **Spring Security основы**: `SecurityFilterChain`, BCrypt, базовая авторизация.
- **Обработка ошибок**: `@ControllerAdvice`, `@ExceptionHandler`.

> **Пет-проект фазы**: REST API для чего-то реального — трекер задач, блог, магазин. Требования: PostgreSQL через Docker, CRUD на 2-3 сущностях с отношениями, валидация, осмысленные HTTP-коды, Swagger/OpenAPI, базовая auth (JWT).

**Чекпоинт**: можешь без подсказки поднять Spring Boot + PostgreSQL + REST + JPA, знаешь N+1 проблему и как её решить (`JOIN FETCH`, `@EntityGraph`).

**После этой фазы** — **можно идти на Junior**.

---

## Фаза 5 · Production concerns (6-8 недель)

Граница, отделяющая «человека со Spring Boot на pet-проекте» от реального разработчика.

### Тестирование
- JUnit 5, AssertJ.
- Mockito: моки, `@Mock`, `@InjectMocks`, `when/thenReturn`, `verify`.
- `@SpringBootTest` vs `@WebMvcTest` vs `@DataJpaTest` — когда что.
- **Testcontainers** — запуск реального PostgreSQL в Docker для интеграционных тестов.

### Observability
- Логирование: SLF4J + Logback, структурированные логи (JSON), корреляционные ID.
- Метрики: Micrometer + Prometheus endpoint.
- Трассировка: OpenTelemetry базово.

### Инфраструктура
- **Docker + Docker Compose**: упаковать своё приложение + PostgreSQL + Redis.
- **CI/CD**: GitHub Actions — собрать, протестировать, собрать Docker-образ.

### Прикладное
- **REST design**: идемпотентность, версионирование API, пагинация, фильтры.
- **Spring Security глубже**: OAuth2, JWT, роли и permissions.
- **Кэширование**: Spring Cache + Caffeine (local) + Redis (distributed).

> **Пет-проект**: возьмите API из фазы 4 и доведите до production-ready. Docker, CI, 70%+ покрытие тестами, метрики, логи с correlation-id.

**Чекпоинт**: можешь запаковать своё приложение в Docker, запустить через docker-compose, показать Prometheus-метрики, написать интеграционный тест с Testcontainers.

**После этой фазы** — **Middle**, особенно если есть 1-2 года опыта работы.

---

## Фаза 6 · Асинхронщина, очереди, масштабирование (2-3 месяца)

Здесь уже senior-тематика, но без неё на серьёзные вакансии не попасть.

- **Message queues**: **Kafka** (обязательно) или RabbitMQ. Producer/Consumer, partitioning, offset, delivery guarantees (at-least-once, exactly-once).
- **Идемпотентность** и **eventual consistency** — в распределённых системах это хлеб.
- **Redis**: не только как кэш, но как data store — структуры (hash, sorted set, streams), паттерны (pub/sub, distributed lock через Redlock).
- **Реактивное программирование** (опционально, но полезно понимать): Project Reactor, WebFlux — в чём отличие от MVC, когда оправдано.
- **Резилентность**: Resilience4j — circuit breaker, retry, rate limiter, bulkhead.
- **Микросервисы vs монолит** — когда какой. Модульный монолит — часто лучший выбор.
- **Distributed tracing**: Jaeger / Zipkin.
- **API Gateway**, service discovery — базово.

> **Пет-проект**: 2-3 сервиса, общающиеся через Kafka. Например: `Order-Service → Kafka → Inventory-Service → Kafka → Notification-Service`. С observability, circuit breaker'ами, идемпотентностью на уровне consumer'ов.

---

## Фаза 7 · Глубокое погружение (senior-трек, постоянно)

Эти темы не «пройти за неделю» — они углубляются по мере того, как встречаешь на практике.

- **JVM internals**: object layout, compressed oops, JIT (C1/C2/tiered compilation), escape analysis.
- **GC детально**: G1, ZGC, Shenandoah — когда какой, как тюнить, как читать GC-логи.
- **Profiling и benchmarking**: JMH (правильные бенчмарки), async-profiler, JFR (Java Flight Recorder).
- **Java Memory Model**: happens-before, `volatile` глубоко, lock-free алгоритмы.
- **Virtual Threads (Loom, Java 21+)**: когда заменять пул потоков.
- **System design**: load balancing, sharding, CAP, consensus (Paxos/Raft на уровне понимания).
- **Архитектурные паттерны**: CQRS, Event Sourcing, Saga, Outbox.

---

## Параллельные треки (не фазы, постоянно)

- **Алгоритмы и структуры данных** — LeetCode Easy/Medium 3-5 раз в неделю. Для интервью FAANG-уровня — обязательно. Для российских интервью — полезно, но не критично.
- **English technical reading** — stackoverflow, Baeldung, JEPs читаются на английском. Если сложно — это тормоз №1.
- **Софт-скиллы**: code review культура, умение объяснить решение, работа с требованиями.

---

## Чего **не делать** в начале

- Не лезть в Spring до того, как уверенно пишешь обычную Java. Spring «магически» всё делает — непонимание, что происходит под капотом, ломает карьеру.
- Не учить одновременно Spring Boot, Docker, Kafka и Kubernetes. По очереди.
- Не читать «Thinking in Java» как первую книгу — устарела. Возьмите *Effective Java* (Bloch) после фазы 1.
- Не смотреть 40-часовые видео-курсы. Пишите код, ломайте его, чините.

---

## Книги (не все сразу)

- **После фазы 1**: *Effective Java*, Joshua Bloch — must read, даже если местами сложно.
- **После фазы 2**: *Java Concurrency in Practice*, Brian Goetz — каноническая книга по concurrency.
- **Перед фазой 4**: *Spring in Action*, Craig Walls — свежее издание под Spring Boot 3.
- **Фаза 6-7**: *Designing Data-Intensive Applications*, Martin Kleppmann — по системному дизайну, одна из лучших технических книг вообще.

---

## Временной ориентир

| Уровень | Примерное время |
|---|---|
| 0 → Junior-ready | ~6 месяцев при 2-3 ч/день |
| Junior → Middle | ~1-2 года реальной работы + фаза 5 |
| Middle → Senior | ~2-4 года + фаза 6-7 |
