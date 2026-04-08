import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "17-5",
  blockId: 17,
  title: "Isolation Levels",
  summary:
    "Уровни изоляции транзакций определяют степень защиты от проблем конкурентного доступа. Проблемы: dirty read (чтение незакоммиченных данных), non-repeatable read (данные изменились между чтениями), phantom read (появились/исчезли строки). Уровни: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE -- от минимальной до максимальной изоляции.\n\n---\n\n" +
    "Transaction isolation levels control how much protection concurrent transactions have from each other. Problems: dirty read (reading uncommitted data), non-repeatable read (data changes between reads), phantom read (rows appear/disappear). Levels from least to most isolated: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.",
  deepDive:
    "## Проблемы конкурентного доступа\n\n" +
    "При параллельном выполнении транзакций возникают следующие проблемы:\n\n" +
    "**Lost Update (потерянное обновление):** Обе транзакции одновременно обновляют данные, затем вторая откатывает изменения -- изменения обеих транзакций теряются.\n\n" +
    "**Dirty Read (грязное чтение):** Первая транзакция читает изменения, сделанные второй транзакцией, которые ещё не были закоммичены. Вторая транзакция откатывает изменения, а первая работает с неактуальными данными.\n\n" +
    "**Non-Repeatable Read (неповторяющееся чтение):** Обе транзакции читают одни данные. Первая изменяет и коммитит их раньше, чем вторая. В результате вторая транзакция при повторном чтении получает другие значения.\n\n" +
    "**Phantom Read (фантомное чтение):** Первая транзакция читает набор строк дважды. Между чтениями вторая транзакция добавляет или удаляет строки и коммитит -- второй SELECT возвращает другой набор строк.\n\n" +
    "## Уровни изоляции\n\n" +
    "- **READ_UNCOMMITTED** -- минимальная изоляция. Разрешены dirty read, non-repeatable read, phantom read. Практически не используется.\n" +
    "- **READ_COMMITTED** -- защищает от dirty read. Транзакция видит только закоммиченные данные. Стандарт по умолчанию в PostgreSQL, Oracle.\n" +
    "- **REPEATABLE_READ** -- защищает от dirty read и non-repeatable read. Гарантирует, что повторное чтение одних данных вернет тот же результат. Стандарт по умолчанию в MySQL InnoDB.\n" +
    "- **SERIALIZABLE** -- максимальная изоляция. Защищает от всех проблем включая phantom read. Транзакции выполняются так, как будто они последовательные. Максимальная надежность, минимальная производительность.\n\n---\n\n" +
    "## Concurrency Problems\n\n" +
    "When multiple transactions execute concurrently, several anomalies can occur:\n\n" +
    "**Lost Update:** Two transactions read the same row, both update it, but only the last write survives. Classic example: two users editing the same record simultaneously.\n\n" +
    "**Dirty Read:** Transaction A reads data modified by Transaction B before B commits. If B rolls back, A has used invalid data to make decisions.\n\n" +
    "**Non-Repeatable Read:** Transaction A reads a row, Transaction B updates and commits that row, then A reads it again and gets a different value. A's two reads are inconsistent.\n\n" +
    "**Phantom Read:** Transaction A runs a range query (SELECT WHERE price < 100), Transaction B inserts a new row matching the condition and commits, then A runs the same query and gets an extra row. The new row is a 'phantom'.\n\n" +
    "## Isolation Levels\n\n" +
    "| Level | Dirty Read | Non-Repeatable Read | Phantom Read |\n" +
    "|---|---|---|---|\n" +
    "| READ_UNCOMMITTED | Yes | Yes | Yes |\n" +
    "| READ_COMMITTED | No | Yes | Yes |\n" +
    "| REPEATABLE_READ | No | No | Yes |\n" +
    "| SERIALIZABLE | No | No | No |\n\n" +
    "**READ_UNCOMMITTED:** Transactions can see uncommitted changes from others. Almost never used -- only for non-critical read-only analytics where dirty data is acceptable.\n\n" +
    "**READ_COMMITTED:** Default in PostgreSQL and Oracle. Each query within a transaction sees only committed data as of query start. Two identical queries may return different results if another transaction commits between them.\n\n" +
    "**REPEATABLE_READ:** Default in MySQL/InnoDB. Once a transaction reads a row, it will see the same value for that row throughout the transaction. Implemented via MVCC (Multi-Version Concurrency Control) -- the database keeps snapshots. Does not prevent phantoms in the SQL standard, but MySQL's gap locks prevent them in practice.\n\n" +
    "**SERIALIZABLE:** Strongest level. Transactions behave as if executed sequentially. PostgreSQL implements it with SSI (Serializable Snapshot Isolation), MySQL uses shared gap locks. High correctness but significant performance impact due to lock contention and increased rollback rates.\n\n" +
    "In practice, most applications use READ_COMMITTED (PostgreSQL) or REPEATABLE_READ (MySQL) and handle specific race conditions with optimistic locking (@Version in JPA) or SELECT FOR UPDATE.",
  code: `-- ===== Dirty Read Example =====
-- Transaction A                     -- Transaction B
-- SET ISOLATION READ UNCOMMITTED;
-- BEGIN;                            -- BEGIN;
--                                   -- UPDATE accounts SET balance = 0
--                                   --   WHERE id = 1;  (not committed!)
-- SELECT balance FROM accounts
--   WHERE id = 1;
-- -> Returns 0 (DIRTY READ!)
--                                   -- ROLLBACK;  (change undone)
-- But Transaction A already used 0!

-- ===== Non-Repeatable Read Example =====
-- Transaction A (READ_COMMITTED)     -- Transaction B
-- BEGIN;
-- SELECT balance FROM accounts
--   WHERE id = 1;  -> 1000
--                                   -- BEGIN;
--                                   -- UPDATE accounts SET balance = 500
--                                   --   WHERE id = 1;
--                                   -- COMMIT;
-- SELECT balance FROM accounts
--   WHERE id = 1;  -> 500 (DIFFERENT!)
-- Two reads, different results = non-repeatable read

-- ===== Setting isolation level in SQL =====
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- ===== Spring: setting isolation level =====
/*
@Service
public class AccountService {

    // Default isolation (database default)
    @Transactional
    public Account getAccount(Long id) {
        return accountRepo.findById(id).orElseThrow();
    }

    // Explicit REPEATABLE_READ for consistent reads
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public BigDecimal calculateBalance(Long userId) {
        // Both reads guaranteed to see same data
        BigDecimal credits = txRepo.sumCredits(userId);
        BigDecimal debits = txRepo.sumDebits(userId);
        return credits.subtract(debits);
    }

    // SERIALIZABLE for critical financial operations
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void transfer(Long from, Long to, BigDecimal amount) {
        Account sender = accountRepo.findById(from).orElseThrow();
        Account receiver = accountRepo.findById(to).orElseThrow();
        sender.debit(amount);
        receiver.credit(amount);
        accountRepo.save(sender);
        accountRepo.save(receiver);
    }

    // Optimistic locking alternative (avoids high isolation levels)
    @Transactional
    public void updateWithOptimisticLock(Long id, String newName) {
        Account account = accountRepo.findById(id).orElseThrow();
        account.setName(newName);
        // @Version field auto-checked on save
        // Throws OptimisticLockingFailureException on conflict
        accountRepo.save(account);
    }
}

@Entity
public class Account {
    @Id
    private Long id;

    @Version  // optimistic locking: auto-incremented on update
    private Long version;

    private BigDecimal balance;
}
*/`,
  interviewQs: [
    {
      id: "17-5-q0",
      q: "Какие проблемы возникают при конкурентном доступе к данным? / What problems arise from concurrent data access?",
      a: "Четыре основные проблемы: (1) Lost Update -- потерянное обновление при одновременной записи; (2) Dirty Read -- чтение данных, которые ещё не закоммичены другой транзакцией; (3) Non-Repeatable Read -- данные изменяются между двумя одинаковыми чтениями; (4) Phantom Read -- между двумя одинаковыми запросами появляются или исчезают строки. // Four problems: (1) Lost Update; (2) Dirty Read -- reading uncommitted data; (3) Non-Repeatable Read -- data changes between reads; (4) Phantom Read -- rows appear/disappear between identical queries.",
      difficulty: "junior",
    },
    {
      id: "17-5-q1",
      q: "Compare READ_COMMITTED and REPEATABLE_READ. When would you choose each?",
      a: "READ_COMMITTED (PostgreSQL default): each query sees only committed data at query start time. Two identical SELECTs may return different results if another transaction commits between them. Good for most OLTP workloads. REPEATABLE_READ (MySQL default): once a transaction reads data, it sees the same snapshot throughout. Prevents non-repeatable reads but allows phantoms in standard SQL (MySQL's InnoDB prevents phantoms via gap locks). Use REPEATABLE_READ when a transaction needs consistent reads across multiple queries (e.g., generating a report, calculating balances). Use READ_COMMITTED when you want maximum concurrency and can tolerate mid-transaction changes.",
      difficulty: "mid",
    },
    {
      id: "17-5-q2",
      q: "How does MVCC (Multi-Version Concurrency Control) work, and why do most databases prefer it over locking?",
      a: "MVCC maintains multiple versions of each row. When a transaction starts, it gets a snapshot timestamp. Reads see the version that was committed before the snapshot -- no locks needed for reads. Writers create new row versions without blocking readers. Old versions are cleaned up by a background process (vacuum in PostgreSQL, purge in InnoDB). MVCC is preferred because readers never block writers and writers never block readers -- only write-write conflicts cause blocking. Traditional locking (2PL) makes readers wait for writers and vice versa, severely limiting throughput. PostgreSQL implements MVCC with tuple versioning (xmin/xmax), MySQL/InnoDB uses undo logs. The trade-off: MVCC uses more storage for row versions and requires garbage collection.",
      difficulty: "senior",
    },
  ],
  tip: "На практике чаще используйте оптимистичную блокировку (@Version в JPA) вместо повышения уровня изоляции. Она масштабируется лучше и не создает блокировок в базе.",
  springConnection: null,
};
