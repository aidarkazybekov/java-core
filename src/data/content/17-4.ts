import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "17-4",
  blockId: 17,
  title: "Transactions & ACID",
  summary:
    "Транзакция -- последовательность операций с базой данных, выполняемая как единое целое. ACID -- набор требований к транзакционным системам: Атомарность (выполняется полностью или не выполняется), Согласованность (данные всегда в валидном состоянии), Изолированность (параллельные транзакции не влияют друг на друга), Долговечность (зафиксированные данные не потеряются при сбое).\n\n---\n\n" +
    "A transaction is a sequence of database operations executed as a single unit of work. ACID is the set of properties guaranteeing reliable transaction processing: Atomicity (all or nothing), Consistency (data always valid), Isolation (concurrent transactions do not interfere), Durability (committed data survives failures).",
  deepDive:
    "## Транзакции\n\n" +
    "Транзакция -- последовательность операций с базой данных, которая выполняется как единое целое. Либо все операции выполняются успешно (COMMIT), либо ни одна (ROLLBACK).\n\n" +
    "**Логическая транзакция** -- бизнес-операция, выполняемая как одно целое с точки зрения бизнес-логики. Может включать несколько шагов или методов.\n\n" +
    "**Физическая транзакция** -- транзакция на уровне базы данных, управляемая командами BEGIN/COMMIT/ROLLBACK.\n\n" +
    "## Принципы ACID\n\n" +
    "ACID -- набор требований к транзакционным системам:\n\n" +
    "**Атомарность (Atomicity):** Гарантирует, что транзакция не будет зафиксирована частично. Будет выполнена полностью, либо совсем ничего. Пример: перевод денег -- списание с одного счета и зачисление на другой должны произойти вместе.\n\n" +
    "**Согласованность (Consistency):** Каждая успешная транзакция фиксирует только разрешенные результаты. Все ограничения (constraints), триггеры и правила будут соблюдены. База данных переходит из одного валидного состояния в другое.\n\n" +
    "**Изолированность (Isolation):** Во время выполнения транзакции параллельные транзакции не должны оказывать влияние на её результат. Степень изолированности настраивается через уровни изоляции.\n\n" +
    "**Долговечность (Durability):** Если транзакция выполнена (COMMIT), внесенные изменения не отменятся из-за какого-либо сбоя (отключение питания, крах системы). Данные записаны на диск.\n\n" +
    "## Связи таблиц\n\n" +
    "Реляционные БД построены на связях (relations) между таблицами:\n" +
    "- **One-to-One** -- одна запись в таблице A связана с одной записью в таблице B (user -- passport)\n" +
    "- **One-to-Many** -- одна запись в A связана с многими в B (department -- employees)\n" +
    "- **Many-to-Many** -- многие записи в A связаны с многими в B через промежуточную таблицу (students -- courses через enrollment)\n\n---\n\n" +
    "## Transactions\n\n" +
    "A transaction groups multiple database operations into an atomic unit. If any operation fails, the entire transaction is rolled back. Classic example: bank transfer -- debit from account A and credit to account B must both succeed or both fail.\n\n" +
    "**Logical transaction** -- a business-level concept spanning multiple steps/services. Example: placing an order involves creating an order record, updating inventory, and charging payment.\n\n" +
    "**Physical transaction** -- the database-level transaction managed by BEGIN/COMMIT/ROLLBACK.\n\n" +
    "## ACID Properties\n\n" +
    "**Atomicity:** All operations in a transaction succeed or all fail. If a transfer debits $100 from Account A but the credit to Account B fails, the debit is rolled back. The database uses a write-ahead log (WAL) to track changes and undo them on rollback.\n\n" +
    "**Consistency:** A transaction brings the database from one valid state to another. All constraints (primary keys, foreign keys, check constraints, unique constraints) must be satisfied after the transaction completes. If a constraint is violated, the transaction is rolled back.\n\n" +
    "**Isolation:** Concurrent transactions do not see each other's uncommitted changes (depending on isolation level). Without isolation, problems arise: dirty reads, non-repeatable reads, phantom reads. The isolation level is a trade-off between correctness and performance.\n\n" +
    "**Durability:** Once a transaction is committed, the changes are permanent even if the system crashes immediately after. Databases achieve this through write-ahead logging (WAL) -- changes are written to a log file on disk before being applied to data files. On recovery, the WAL is replayed.\n\n" +
    "## Table Relationships\n\n" +
    "Relational databases are built on relationships between tables:\n" +
    "- **One-to-One:** user <-> user_profile. Implemented with a FK + UNIQUE constraint.\n" +
    "- **One-to-Many:** department -> employees. The 'many' side holds the FK.\n" +
    "- **Many-to-Many:** students <-> courses. Requires a junction table (enrollment) with FKs to both tables.",
  code: `-- ===== Transaction example: bank transfer =====
START TRANSACTION;

-- Check sufficient balance
SELECT balance INTO @balance FROM accounts WHERE user_id = 1 FOR UPDATE;

-- Debit sender
UPDATE accounts SET balance = balance - 500.00 WHERE user_id = 1;

-- Credit receiver
UPDATE accounts SET balance = balance + 500.00 WHERE user_id = 2;

-- Log the transfer
INSERT INTO transfers (from_user, to_user, amount, created_at)
VALUES (1, 2, 500.00, NOW());

-- All good -> commit
COMMIT;

-- If anything fails -> ROLLBACK (all changes undone)

-- ===== Spring @Transactional =====
/*
@Service
public class TransferService {

    @Transactional  // wraps method in a physical transaction
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepo.findByIdForUpdate(fromId); // SELECT FOR UPDATE
        Account to = accountRepo.findById(toId).orElseThrow();

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException();  // triggers ROLLBACK
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        accountRepo.save(from);
        accountRepo.save(to);

        // If no exception -> auto COMMIT
        // If RuntimeException -> auto ROLLBACK
    }

    // Propagation: REQUIRED (default), REQUIRES_NEW, NESTED
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void auditLog(String message) {
        // Runs in its OWN transaction
        // Committed even if parent transaction rolls back
        auditRepo.save(new AuditEntry(message));
    }
}
*/

-- ===== Table Relationships =====

-- One-to-One: user <-> passport
CREATE TABLE passports (
    id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,  -- UNIQUE makes it 1:1
    passport_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- One-to-Many: department -> employees
CREATE TABLE employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    department_id BIGINT,  -- FK on the "many" side
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Many-to-Many: students <-> courses (via junction table)
CREATE TABLE students (id BIGINT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE courses  (id BIGINT PRIMARY KEY, title VARCHAR(100));

CREATE TABLE enrollments (
    student_id BIGINT,
    course_id BIGINT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);`,
  interviewQs: [
    {
      id: "17-4-q0",
      q: "Что такое ACID? Объясните каждый принцип. / What is ACID? Explain each property.",
      a: "ACID -- свойства транзакций: Atomicity (атомарность) -- все операции выполняются или ни одна; Consistency (согласованность) -- данные переходят из одного валидного состояния в другое, все ограничения соблюдены; Isolation (изолированность) -- параллельные транзакции не влияют друг на друга; Durability (долговечность) -- после COMMIT данные сохранены на диске и не потеряются при сбое. // ACID: Atomicity -- all or nothing; Consistency -- always valid state; Isolation -- concurrent transactions don't interfere; Durability -- committed data survives crashes.",
      difficulty: "junior",
    },
    {
      id: "17-4-q1",
      q: "How does Spring's @Transactional annotation work, and what is transaction propagation?",
      a: "Spring creates a proxy around @Transactional methods. When the method is called, the proxy starts a database transaction before the method and commits after it returns. If a RuntimeException is thrown, it rolls back (checked exceptions do not roll back by default -- use rollbackFor). Propagation controls how transactions nest: REQUIRED (default) joins the existing transaction or creates a new one; REQUIRES_NEW suspends the current transaction and creates a new independent one (useful for audit logs that must persist even if the parent fails); NESTED creates a savepoint within the existing transaction for partial rollback.",
      difficulty: "mid",
    },
    {
      id: "17-4-q2",
      q: "Explain the difference between logical and physical transactions. How does this relate to distributed transactions?",
      a: "A physical transaction is a single database-level BEGIN/COMMIT/ROLLBACK. A logical transaction is a business operation that may span multiple physical transactions across services or databases. In monoliths, one logical transaction = one physical transaction. In microservices, a logical transaction (like placing an order) spans Order Service, Inventory Service, and Payment Service -- each with its own database and physical transaction. This requires distributed transaction patterns: Two-Phase Commit (2PC) provides ACID across databases but is slow and fragile; the Saga pattern uses a sequence of local transactions with compensating actions on failure (more scalable but only eventually consistent).",
      difficulty: "senior",
    },
  ],
  tip: "В Spring, @Transactional не работает при вызове метода из того же класса (self-invocation), потому что вызов обходит прокси. Используйте отдельный сервис или AopContext.currentProxy().",
  springConnection: null,
};
