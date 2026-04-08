import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-2",
  blockId: 18,
  title: "Kafka Components & Guarantees",
  summary:
    "Основные компоненты Kafka: Producer (отправляет сообщения), Consumer (читает сообщения), Topic (логическое имя потока), Partition (раздел топика для масштабирования, упорядоченный по offset), Broker (сервер, хранящий данные), Consumer Group (группа потребителей для параллельной обработки). Гарантии доставки: at-most-once, at-least-once, exactly-once.\n\n---\n\n" +
    "Kafka core components: Producer (sends messages), Consumer (reads messages), Topic (logical stream name), Partition (topic subdivision for scaling, ordered by offset), Broker (server storing data), Consumer Group (parallel consumption). Delivery guarantees: at-most-once, at-least-once, exactly-once.",
  deepDive:
    "## Основные компоненты Kafka\n\n" +
    "**Producer** -- компонент, который отправляет сообщения в Kafka. Продюсер выбирает партицию на основе ключа сообщения.\n\n" +
    "**Consumer** -- компонент, который считывает сообщения из Kafka. Потребитель использует offset, чтобы запомнить, какое сообщение он прочитал последним.\n\n" +
    "**Topic** -- логическое название для потока сообщений. Продюсеры записывают сообщения в топик, потребители подписываются и читают.\n\n" +
    "**Partition** -- каждый топик разделён на партиции для масштабирования. Сообщения внутри партиции упорядочены и имеют уникальный offset. Партиции работают как параллельные потоки по принципу FIFO.\n\n" +
    "**Broker (Kafka Server / Node)** -- сервер, который хранит данные и управляет партициями. Функции: приём, хранение и выдача сообщений. Kafka кластер состоит из нескольких брокеров для отказоустойчивости.\n\n" +
    "**Offset** -- уникальный номер сообщения в рамках партиции. Потребитель использует offset для отслеживания прогресса чтения.\n\n" +
    "**Consumer Group** -- группа потребителей, совместно читающих топик. Каждая партиция назначается только одному потребителю в группе, обеспечивая параллельную обработку без дублирования.\n\n" +
    "**ZooKeeper** -- раньше использовался для управления метаданными и координации брокеров. В новых версиях заменяется Kafka Raft (KRaft).\n\n" +
    "## Гарантии доставки\n\n" +
    "- **At-most-once** -- сообщение может потеряться, но не будет доставлено повторно\n" +
    "- **At-least-once** -- сообщение гарантированно доставлено, но может быть доставлено несколько раз (дублирование)\n" +
    "- **Exactly-once** -- сообщение доставляется ровно один раз\n\n" +
    "Упорядоченность: сообщения в рамках одной партиции всегда упорядочены.\n\n---\n\n" +
    "## Kafka Components\n\n" +
    "**Producer:** Publishes messages to Kafka topics. The producer determines which partition receives a message based on: (1) explicit partition assignment, (2) key-based hashing (same key always goes to same partition), or (3) round-robin if no key. Producers can configure acks: 0 (fire-and-forget), 1 (leader acknowledged), all (all replicas acknowledged).\n\n" +
    "**Consumer:** Reads messages from topics. Each consumer tracks its position via offsets. Consumers can commit offsets automatically or manually. Manual commits provide at-least-once semantics; auto-commits risk at-most-once.\n\n" +
    "**Topic:** A logical category/feed name for messages. Topics are multi-subscriber -- multiple consumer groups can read the same topic independently.\n\n" +
    "**Partition:** Topics are divided into partitions for parallelism. Each partition is an ordered, immutable sequence of records, each with a unique sequential offset. Partitions are distributed across brokers. More partitions = more parallelism, but also more resources.\n\n" +
    "**Broker:** A Kafka server that stores partition data and serves client requests. A cluster has multiple brokers. Each partition has one leader broker (handles reads/writes) and replica brokers (passive copies for fault tolerance).\n\n" +
    "**Consumer Group:** A set of consumers sharing the work of reading a topic. Kafka assigns each partition to exactly one consumer in the group. If a consumer crashes, its partitions are reassigned (rebalancing). Maximum parallelism = number of partitions (extra consumers sit idle).\n\n" +
    "**ZooKeeper / KRaft:** ZooKeeper managed broker metadata and leader election. Since Kafka 3.3+, KRaft (Kafka Raft) replaces ZooKeeper for simpler deployment.\n\n" +
    "## Delivery Guarantees\n\n" +
    "- **At-most-once:** Message may be lost. Consumer commits offset before processing. If processing fails, the message is skipped.\n" +
    "- **At-least-once:** Message guaranteed delivered but may be duplicated. Consumer commits offset after processing. If processing succeeds but commit fails, the message is reprocessed. Most common in practice -- consumers must be idempotent.\n" +
    "- **Exactly-once:** Message delivered exactly once. Achieved via idempotent producers (enable.idempotence=true) and transactional APIs. Highest overhead, used for critical financial data.\n\n" +
    "Ordering guarantee: Messages within a single partition are strictly ordered by offset. No ordering guarantee across partitions.",
  code: `// ===== Producer with acknowledgment configuration =====
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);

        // Acknowledgment: "all" = leader + all replicas must confirm
        props.put(ProducerConfig.ACKS_CONFIG, "all");

        // Exactly-once: enable idempotent producer
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);

        // Retries and ordering
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        props.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 1);

        return new DefaultKafkaProducerFactory<>(props);
    }
}

// ===== Consumer Group with manual offset commit =====
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);

        // Manual offset commit for at-least-once
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String>
            kafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String, String>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties()
            .setAckMode(ContainerProperties.AckMode.MANUAL);
        factory.setConcurrency(3); // 3 consumer threads
        return factory;
    }
}

// ===== Consumer with manual acknowledgment =====
@Service
public class PaymentConsumer {

    @KafkaListener(topics = "payment-events", groupId = "payment-group")
    public void processPayment(
            @Payload String message,
            Acknowledgment acknowledgment) {
        try {
            Payment payment = objectMapper.readValue(message, Payment.class);
            paymentService.process(payment);

            // Commit offset only AFTER successful processing
            // -> at-least-once guarantee
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Failed to process payment, will retry", e);
            // Do NOT acknowledge -> message will be redelivered
        }
    }
}

// ===== Consumer Group scaling =====
// Topic "orders" has 6 partitions
// Consumer Group "order-processors":
//
//   1 consumer  -> reads all 6 partitions (sequential)
//   3 consumers -> each reads 2 partitions (parallel)
//   6 consumers -> each reads 1 partition  (max parallelism)
//   9 consumers -> 6 active, 3 idle (waste!)
//
// Rule: consumers in group <= partitions in topic`,
  interviewQs: [
    {
      id: "18-2-q0",
      q: "Назовите основные компоненты Kafka. / Name the core components of Kafka.",
      a: "Producer -- отправляет сообщения; Consumer -- читает сообщения; Topic -- логическое имя потока; Partition -- раздел топика для параллелизма, упорядочен по offset; Broker -- сервер кластера, хранит данные; Consumer Group -- группа потребителей для параллельной обработки; Offset -- уникальный номер сообщения в партиции. // Producer sends messages; Consumer reads messages; Topic is a logical stream name; Partition enables parallel processing, ordered by offset; Broker is a cluster server; Consumer Group enables parallel consumption; Offset is a unique message number within a partition.",
      difficulty: "junior",
    },
    {
      id: "18-2-q1",
      q: "Explain the three delivery guarantees in Kafka and how to achieve each.",
      a: "At-most-once: commit offset before processing; if processing fails, the message is lost. Achieved with auto-commit enabled. At-least-once: commit offset after processing; if commit fails after successful processing, the message is reprocessed (duplicated). Achieved with manual commit after processing. Consumers must be idempotent. Exactly-once: use idempotent producer (enable.idempotence=true) + transactional API (beginTransaction/commitTransaction). The producer assigns a sequence number to each message; the broker deduplicates. Most expensive option, used for critical financial operations.",
      difficulty: "mid",
    },
    {
      id: "18-2-q2",
      q: "How does consumer group rebalancing work, and what are its problems?",
      a: "When a consumer joins or leaves a group, Kafka triggers rebalancing: partitions are reassigned among remaining consumers. The group coordinator (a broker) detects changes via heartbeats. During rebalancing, all consumers in the group stop processing (stop-the-world). This causes latency spikes and potential duplicate processing if offsets were not committed before the rebalance. Solutions: (1) Cooperative rebalancing (incremental, only affected partitions stop); (2) Static group membership (group.instance.id) to avoid rebalance on brief disconnects; (3) Proper session.timeout.ms and heartbeat.interval.ms tuning. Maximum parallelism equals the number of partitions -- extra consumers beyond the partition count sit idle.",
      difficulty: "senior",
    },
  ],
  tip: "Количество потребителей в consumer group не должно превышать количество партиций -- лишние потребители будут простаивать. Планируйте количество партиций заранее.",
  springConnection: null,
};
