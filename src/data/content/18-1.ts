import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-1",
  blockId: 18,
  title: "Kafka Fundamentals",
  summary:
    "Apache Kafka -- распределенная система потоковой передачи данных (event streaming platform). Разработана в LinkedIn (2011). Используется для публикации/подписки на потоки событий, хранения событий на диске с сохранением порядка и обработки в реальном времени. Kafka горизонтально масштабируема: серверы объединяются в кластеры для надежности и отказоустойчивости.\n\n---\n\n" +
    "Apache Kafka is a distributed event streaming platform originally developed at LinkedIn (2011). It is used for publishing/subscribing to event streams, durable event storage with ordering guarantees, and real-time stream processing. Kafka scales horizontally by clustering brokers for reliability and fault tolerance.",
  deepDive:
    "## Что такое Kafka?\n\n" +
    "Apache Kafka -- это распределенный брокер сообщений (посредник) и платформа для обработки потоковых данных в реальном времени с высокой пропускной способностью и низкой задержкой.\n\n" +
    "Системы строятся так, чтобы функционал был разделён на части (модули/микросервисы). Этим распределённым системам нужно общаться между собой. Kafka является решением этой проблемы.\n\n" +
    "**Ключевые характеристики:**\n" +
    "- Распределённая система -- серверы объединяются в кластеры. Хранение и пересылка сообщений идёт параллельно на разных серверах\n" +
    "- Горизонтально масштабируемая -- добавление новых серверов (брокеров) для увеличения пропускной способности\n" +
    "- Отказоустойчивая -- репликация данных между брокерами\n" +
    "- Записи хранятся в виде журнала коммитов (commit log)\n\n" +
    "**Используется для:**\n" +
    "- Публикации и подписки на потоки событий (messages)\n" +
    "- Хранения событий на диске с сохранением порядка\n" +
    "- Обработки событий в реальном времени\n" +
    "- Отлично подходит для обработки больших объёмов данных между различными сервисами\n\n" +
    "**Kafka Message (Record / Event)** -- единица данных, key-value pair. Состоит из ключа (определяет партицию), значения (данные) и метаданных (timestamp, headers).\n\n---\n\n" +
    "## What is Kafka?\n\n" +
    "Apache Kafka is a distributed event streaming platform designed for high-throughput, low-latency, real-time data processing. Originally built at LinkedIn to handle their massive data pipeline (trillions of messages per day), open-sourced in 2011.\n\n" +
    "**Why Kafka exists:** In microservices architecture, services need to communicate asynchronously. Direct HTTP calls create tight coupling and cascading failures. Kafka acts as a central nervous system -- producers publish events, consumers subscribe to them, and Kafka handles delivery, ordering, and persistence.\n\n" +
    "**Key characteristics:**\n" +
    "- **Distributed:** Kafka runs as a cluster of brokers (servers). Data is partitioned and replicated across brokers for fault tolerance.\n" +
    "- **Horizontally scalable:** Add more brokers to increase throughput. Add more partitions to parallelize consumption.\n" +
    "- **Durable:** Messages are persisted to disk as an append-only commit log. Retention can be time-based (7 days default) or size-based.\n" +
    "- **High throughput:** Achieves millions of messages per second by leveraging sequential disk I/O, zero-copy transfers, and batching.\n\n" +
    "**Use cases:**\n" +
    "- Event-driven microservices communication\n" +
    "- Real-time analytics and stream processing\n" +
    "- Log aggregation (replacing Logstash/Fluentd)\n" +
    "- Change Data Capture (CDC) from databases\n" +
    "- Activity tracking and metrics collection\n\n" +
    "**Kafka Message (Record):** A key-value pair with metadata. The key determines which partition receives the message (messages with the same key always go to the same partition, guaranteeing ordering for that key). The value is the actual data (JSON, Avro, Protobuf). Metadata includes timestamp and optional headers.",
  code: `// ===== Spring Boot Kafka Configuration =====
// build.gradle / pom.xml: spring-kafka dependency

// application.yml
/*
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: my-app-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
*/

// ===== Simple Producer =====
@Service
public class OrderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderCreated(Order order) {
        String key = order.getUserId().toString();  // same user -> same partition
        String value = objectMapper.writeValueAsString(order);

        kafkaTemplate.send("order-events", key, value)
            .whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Sent to partition={}, offset={}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to send message", ex);
                }
            });
    }
}

// ===== Simple Consumer =====
@Service
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "order-processing")
    public void handleOrderEvent(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("Received from partition={}, offset={}", partition, offset);
        Order order = objectMapper.readValue(message, Order.class);
        orderService.process(order);
    }
}

// ===== Kafka Topic Configuration =====
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic orderEventsTopic() {
        return TopicBuilder.name("order-events")
            .partitions(6)
            .replicas(3)         // 3 copies across brokers
            .config(TopicConfig.RETENTION_MS_CONFIG, "604800000") // 7 days
            .build();
    }
}`,
  interviewQs: [
    {
      id: "18-1-q0",
      q: "Что такое Apache Kafka и для чего она используется? / What is Apache Kafka and what is it used for?",
      a: "Kafka -- распределённая платформа потоковой передачи данных (event streaming platform). Используется как брокер сообщений между микросервисами для асинхронной коммуникации. Основные применения: обмен событиями между сервисами, потоковая обработка данных в реальном времени, агрегация логов, CDC (Change Data Capture). Kafka горизонтально масштабируема и отказоустойчива за счёт кластеризации и репликации. // Kafka is a distributed event streaming platform used as a message broker between microservices. Use cases: event-driven communication, real-time stream processing, log aggregation, CDC. Horizontally scalable and fault-tolerant via clustering and replication.",
      difficulty: "junior",
    },
    {
      id: "18-1-q1",
      q: "Why would you choose Kafka over a traditional message broker like RabbitMQ?",
      a: "Kafka excels at: (1) high throughput -- millions of messages/sec via sequential disk I/O and batching; (2) message persistence -- messages are stored on disk with configurable retention, consumers can replay from any offset; (3) ordering guarantees within partitions; (4) horizontal scaling via partitions; (5) multiple consumer groups can read the same topic independently. RabbitMQ is better for: (1) complex routing (exchanges, bindings); (2) message acknowledgment and requeueing; (3) low-latency delivery of individual messages; (4) simpler setup for small workloads. Choose Kafka for event streaming, log aggregation, and high-throughput pipelines. Choose RabbitMQ for task queues and complex routing patterns.",
      difficulty: "mid",
    },
    {
      id: "18-1-q2",
      q: "How does Kafka achieve high throughput through its commit log architecture?",
      a: "Kafka writes messages to an append-only commit log on disk. This is fast because: (1) sequential disk writes are nearly as fast as memory access -- no random seeks; (2) the OS page cache keeps hot data in memory; (3) zero-copy transfer: data goes directly from disk to network socket via sendfile() without copying to application memory; (4) producers batch messages and compress them (Snappy, LZ4) before sending; (5) consumers read sequentially, benefiting from OS read-ahead. Each partition is a separate log file, enabling parallel I/O across disks. The result is throughput of millions of messages per second on commodity hardware.",
      difficulty: "senior",
    },
  ],
  tip: "Kafka хранит сообщения на диске (по умолчанию 7 дней). Это позволяет потребителям перечитывать сообщения -- полезно для исправления багов в обработке без потери данных.",
  springConnection: null,
};
