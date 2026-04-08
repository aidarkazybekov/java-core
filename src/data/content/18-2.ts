import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "18-2",
  blockId: 18,
  title: "Kafka Components & Guarantees",
  summary:
    "Основные компоненты Kafka: Producer, Consumer, Topic, Partition, Broker, Offset, ZooKeeper/KRaft. Kafka Broker -- сервер, хранящий и выдающий сообщения. Гарантии доставки: at-most-once, at-least-once, exactly-once. Сообщения в партиции упорядочены.\n\n---\n\nKafka components: Producer, Consumer, Topic, Partition, Broker, Offset, ZooKeeper/KRaft. Kafka Broker stores and serves messages. Delivery guarantees: at-most-once, at-least-once, exactly-once. Messages within a partition are ordered.",
  deepDive:
    "## Основные компоненты\n\n" +
    "- **Producer** -- отправляет сообщения в Kafka\n" +
    "- **Consumer** -- считывает сообщения из Kafka\n" +
    "- **Topic** -- логическое название для потока сообщений\n" +
    "- **Partition** -- каждая тема разделена на партиции для масштабирования. Сообщения упорядочены (offset)\n" +
    "- **Broker** -- сервер, хранящий данные и управляющий партициями\n" +
    "- **Offset** -- уникальный номер сообщения в партиции\n" +
    "- **ZooKeeper** -- управление метаданными кластера (в новых версиях заменяется KRaft)\n\n" +
    "**Kafka Broker** -- приём, хранение и выдача сообщений. Кластер состоит из множества брокеров.\n\n" +
    "**Kafka Message (Record)** -- key-value pair с метаданными. Ключ определяет партицию.\n\n" +
    "## Гарантии\n\n" +
    "- **At-most-once** -- сообщение может потеряться\n" +
    "- **At-least-once** -- может быть доставлено несколько раз\n" +
    "- **Exactly-once** -- ровно один раз\n\n" +
    "Сообщения в рамках одной партиции всегда упорядочены.\n\n---\n\n" +
    "## Components Deep Dive\n\n" +
    "**Topic** -- a named stream of data, like a table in a DB. Topics are split into **partitions** distributed across brokers.\n\n" +
    "**Partitions** -- enable parallelism. Each partition is an ordered, immutable append-only log. Messages get a sequential offset. A topic with 6 partitions can have 6 consumers reading in parallel.\n\n" +
    "**Consumer Groups** -- consumers with the same group.id share partitions. Each partition is assigned to exactly one consumer in the group. If a consumer fails, its partitions are rebalanced to others.\n\n" +
    "**Replication** -- each partition has a leader and N-1 followers (replicas). Writes go to the leader. Followers replicate. If leader fails, a follower becomes the new leader (ISR -- In-Sync Replicas).\n\n" +
    "**ZooKeeper vs KRaft:** ZooKeeper managed broker metadata, topic config, leader election. KRaft (Kafka Raft) replaces ZooKeeper, removing the external dependency.\n\n" +
    "## Delivery Guarantees\n\n" +
    "- **At-most-once:** Fire and forget. Producer sends, doesn't wait for ack. Fast but lossy.\n" +
    "- **At-least-once:** Producer retries until ack. Consumer commits offset after processing. May produce duplicates -- consumer must be idempotent.\n" +
    "- **Exactly-once:** Producer uses idempotent mode + transactions. Consumer uses read_committed isolation. Heaviest but no duplicates.",
  code: `// ===== Consumer Group Configuration =====
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String>
            kafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String, String>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);  // 3 consumer threads
        factory.getContainerProperties()
            .setAckMode(ContainerProperties.AckMode.MANUAL);
        return factory;
    }
}

// ===== Manual Offset Commit (at-least-once) =====
@Service
public class OrderConsumer {

    @KafkaListener(topics = "order-events", groupId = "order-service")
    public void consume(ConsumerRecord<String, String> record,
                        Acknowledgment ack) {
        try {
            Order order = objectMapper.readValue(record.value(), Order.class);
            orderService.process(order);  // process first
            ack.acknowledge();  // then commit offset
        } catch (Exception e) {
            log.error("Failed to process offset={}", record.offset(), e);
            // Don't ack -- message will be redelivered
        }
    }
}

// ===== Idempotent Producer (exactly-once) =====
@Bean
public ProducerFactory<String, String> producerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
    props.put(ProducerConfig.ACKS_CONFIG, "all");
    props.put(ProducerConfig.RETRIES_CONFIG, 3);
    return new DefaultKafkaProducerFactory<>(props);
}`,
  interviewQs: [
    {
      id: "18-2-q0",
      q: "What are the main components of Kafka architecture?",
      a: "Producer sends messages to topics. Consumer reads messages. Topic is a named stream split into Partitions for parallelism. Broker is a Kafka server storing partitions. Offset is a sequential message ID within a partition. Consumer Group enables parallel consumption -- each partition is assigned to one consumer in the group. ZooKeeper/KRaft manages cluster metadata.",
      difficulty: "junior",
    },
    {
      id: "18-2-q1",
      q: "Explain the three Kafka delivery guarantees. How do you achieve each?",
      a: "At-most-once: producer acks=0, fire-and-forget. Fast but messages can be lost. At-least-once: producer acks=all with retries, consumer commits offset AFTER processing. Messages may be duplicated -- consumer must be idempotent. Exactly-once: enable.idempotence=true on producer + transactional producer/consumer with isolation.level=read_committed. Heaviest but ensures no duplicates or losses.",
      difficulty: "mid",
    },
    {
      id: "18-2-q2",
      q: "How does Kafka rebalancing work? What problems can it cause and how do you mitigate them?",
      a: "When consumers join/leave a group, Kafka reassigns partitions (rebalancing). During rebalancing, all consumers in the group stop processing -- this causes a pause. Problems: (1) frequent rebalances from slow consumers (session.timeout exceeded); (2) duplicate processing if offset wasn't committed before rebalance. Mitigations: (1) increase session.timeout.ms and heartbeat.interval.ms; (2) use static group membership (group.instance.id) to avoid rebalance on restart; (3) use cooperative rebalancing (CooperativeStickyAssignor) for incremental rebalances instead of stop-the-world; (4) commit offsets regularly with manual acknowledgment.",
      difficulty: "senior",
    },
  ],
  tip: "Всегда делайте consumer идемпотентным при at-least-once гарантии -- дублирование сообщений неизбежно.\n\n---\n\nAlways make consumers idempotent with at-least-once delivery -- message duplication is inevitable.",
  springConnection: null,
};
