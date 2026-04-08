import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "14-4",
  blockId: 14,
  title: "Transactions & @Transactional",
  summary:
    "Spring поддерживает декларативное управление транзакциями через @Transactional. Два ключевых атрибута: propagation (поведение при вложенных вызовах: REQUIRED, REQUIRES_NEW и др.) и isolation (уровень изоляции: READ_COMMITTED, REPEATABLE_READ и др.).\n\n---\n\nSpring supports declarative transaction management via @Transactional. Two key attributes: propagation (nested call behavior: REQUIRED, REQUIRES_NEW, etc.) and isolation (isolation level: READ_COMMITTED, REPEATABLE_READ, etc.).",
  deepDive:
    "## Transaction\n\nДля управления транзакциями в Spring есть два механизма:\n- **Программное** -- connection.setAutoCommit(false), connection.commit()\n- **Декларативное** -- @Transactional\n\nОсновные атрибуты @Transactional:\n\n### Propagation (распространение)\n- **REQUIRED** (по умолчанию) -- если транзакция существует, выполняется в ней. Если нет -- создается новая.\n- **SUPPORTS** -- выполняется в транзакции, если она есть. Если нет -- без транзакции.\n- **REQUIRES_NEW** -- всегда создает новую транзакцию. Текущая приостанавливается.\n- **NOT_SUPPORTED** -- выполняется без транзакции. Текущая приостанавливается.\n- **MANDATORY** -- должен выполняться в транзакции. Если нет -- исключение.\n- **NEVER** -- не должен выполняться в транзакции. Если есть -- исключение.\n- **NESTED** -- вложенная транзакция, зависимая от текущей. Может быть откачена отдельно.\n\n### Isolation (изоляция)\n- **DEFAULT** -- уровень изоляции БД\n- **READ_UNCOMMITTED** -- чтение незакоммиченных данных (dirty read)\n- **READ_COMMITTED** -- только закоммиченные данные\n- **REPEATABLE_READ** -- повторяемое чтение\n- **SERIALIZABLE** -- полная сериализация\n\n---\n\n**@Transactional** works through AOP proxies. Spring wraps the bean in a proxy that starts a transaction before the method and commits/rolls back after. Key implications:\n\n1. **Self-invocation problem**: Calling a @Transactional method from the same class bypasses the proxy, so the transaction is not applied. Solution: inject the service into itself, extract to a separate service, or use `AopContext.currentProxy()`.\n\n2. **Rollback behavior**: By default, Spring rolls back on unchecked exceptions (RuntimeException) and Errors, but NOT on checked exceptions. Customize with `rollbackFor = Exception.class`.\n\n3. **readOnly flag**: `@Transactional(readOnly = true)` hints the persistence provider to optimize (skip dirty checking, allow read replicas). Does NOT prevent writes at the code level.\n\n4. **Propagation** controls how transactions nest:\n- REQUIRED (default) -- join existing or create new. Most common.\n- REQUIRES_NEW -- suspend current, create independent. Use for audit logs that must persist even if the main transaction fails.\n- NESTED -- savepoint-based. Can rollback independently but commits with parent.\n\n5. **Isolation** controls visibility of concurrent changes. Higher isolation prevents more anomalies but reduces throughput. READ_COMMITTED is the most common production choice.\n\n6. **Timeout**: `@Transactional(timeout = 30)` sets maximum seconds for the transaction.",
  code: `// Basic @Transactional usage
@Service
@Transactional(readOnly = true)  // default for all methods
public class OrderService {

    private final OrderRepository orderRepo;
    private final PaymentService paymentService;
    private final AuditService auditService;

    @Transactional  // overrides readOnly for write operation
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order(request);
        order = orderRepo.save(order);
        paymentService.processPayment(order);
        return order;
    }

    // readOnly = true: optimized read, skip dirty checking
    public Order findById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    // Custom rollback rules
    @Transactional(rollbackFor = Exception.class)  // rollback on ALL exceptions
    public void processRefund(Long orderId) throws PaymentException {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.REFUNDED);
        paymentService.refund(order);  // may throw checked exception
    }
}

// Propagation examples
@Service
public class AuditService {

    private final AuditLogRepository auditRepo;

    // REQUIRES_NEW: audit log saved even if calling transaction fails
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String action, String details) {
        auditRepo.save(new AuditLog(action, details, LocalDateTime.now()));
    }
}

@Service
public class TransferService {

    private final AccountRepository accountRepo;
    private final AuditService auditService;

    @Transactional(
        isolation = Isolation.REPEATABLE_READ,
        timeout = 10
    )
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepo.findByIdWithLock(fromId);
        Account to = accountRepo.findByIdWithLock(toId);

        from.debit(amount);
        to.credit(amount);

        // Audit runs in separate transaction (REQUIRES_NEW)
        // Persists even if transfer rolls back
        auditService.logAction("TRANSFER",
            String.format("%d -> %d: %s", fromId, toId, amount));
    }
}`,
  interviewQs: [
    {
      id: "14-4-q0",
      q: "What does @Transactional do? What are its default settings?",
      a: "@Transactional wraps the method in a database transaction via AOP proxy. Defaults: propagation = REQUIRED (join existing or create new), isolation = DEFAULT (database default), readOnly = false, rollback on RuntimeException and Error only (not checked exceptions), no timeout. Place on service methods, not repository methods.",
      difficulty: "junior",
    },
    {
      id: "14-4-q1",
      q: "Explain the difference between REQUIRED, REQUIRES_NEW, and NESTED propagation.",
      a: "REQUIRED (default) joins the existing transaction or creates a new one if none exists. Both caller and callee share the same transaction -- if either fails, both roll back. REQUIRES_NEW always creates an independent transaction, suspending the existing one. The new transaction commits/rolls back independently. Use for audit logs or notifications that must persist regardless. NESTED creates a savepoint within the current transaction. It can roll back to the savepoint without affecting the outer transaction, but its commit depends on the outer transaction committing.",
      difficulty: "mid",
    },
    {
      id: "14-4-q2",
      q: "Why doesn't @Transactional work with self-invocation? How does the proxy mechanism work?",
      a: "Spring creates a CGLIB (or JDK) proxy around the bean. External calls go through the proxy, which intercepts @Transactional methods to manage transactions. But when a method calls another method on 'this', it's a direct Java call that bypasses the proxy entirely -- the AOP advice never fires. Solutions: (1) inject the service into itself via @Lazy or ApplicationContext.getBean(), (2) extract the transactional method to a separate service, (3) use AspectJ compile-time weaving instead of proxies (real AOP, not proxy-based). This is the fundamental limitation of Spring's proxy-based AOP.",
      difficulty: "senior",
    },
  ],
  tip: "Set `@Transactional(readOnly = true)` at the class level for services that mostly read, and override specific write methods with `@Transactional` -- this optimizes Hibernate's flush behavior.\n\n---\n\nУстановите `@Transactional(readOnly = true)` на уровне класса для сервисов, преимущественно читающих данные, и переопределяйте конкретные методы записи через `@Transactional` -- это оптимизирует flush-поведение Hibernate.",
  springConnection: null,
};
