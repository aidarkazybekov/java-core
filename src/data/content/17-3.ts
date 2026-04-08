import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "17-3",
  blockId: 17,
  title: "SQL Commands: DDL, DML, DCL, TCL",
  summary:
    "SQL-команды делятся на четыре категории: DDL (Data Definition Language) -- CREATE, ALTER, DROP для управления структурой; DML (Data Manipulation Language) -- SELECT, INSERT, UPDATE, DELETE для работы с данными; DCL (Data Control Language) -- GRANT, REVOKE для управления правами; TCL (Transaction Control Language) -- COMMIT, ROLLBACK для управления транзакциями.\n\n---\n\n" +
    "SQL commands are divided into four categories: DDL (Data Definition Language) -- CREATE, ALTER, DROP for structure management; DML (Data Manipulation Language) -- SELECT, INSERT, UPDATE, DELETE for data operations; DCL (Data Control Language) -- GRANT, REVOKE for access control; TCL (Transaction Control Language) -- COMMIT, ROLLBACK for transaction management.",
  deepDive:
    "## Категории SQL-команд\n\n" +
    "**DDL (Data Definition Language)** -- язык определения данных. Управляет структурой (схемой) базы данных:\n" +
    "- `CREATE` -- создание таблиц, индексов, представлений, схем\n" +
    "- `ALTER` -- изменение структуры существующих объектов (добавление/удаление столбцов, изменение типов)\n" +
    "- `DROP` -- удаление объектов (таблиц, индексов, представлений)\n" +
    "- `TRUNCATE` -- быстрое удаление всех строк из таблицы (без логирования каждой строки)\n\n" +
    "**DML (Data Manipulation Language)** -- язык манипуляции данными:\n" +
    "- `SELECT` (иногда выделяют в DQL -- Data Query Language) -- чтение данных\n" +
    "- `INSERT` -- вставка новых строк\n" +
    "- `UPDATE` -- обновление существующих строк\n" +
    "- `DELETE` -- удаление строк\n\n" +
    "**DCL (Data Control Language)** -- управление правами доступа:\n" +
    "- `GRANT` -- предоставление привилегий пользователям/ролям\n" +
    "- `REVOKE` -- отзыв привилегий\n\n" +
    "**TCL (Transaction Control Language)** -- управление транзакциями:\n" +
    "- `COMMIT` -- фиксация изменений транзакции\n" +
    "- `ROLLBACK` -- откат изменений транзакции\n" +
    "- `SAVEPOINT` -- создание точки сохранения внутри транзакции\n\n" +
    "## Ограничения (Constraints)\n\n" +
    "Правила, накладываемые на данные:\n" +
    "- **PRIMARY KEY** -- уникальный идентификатор строки\n" +
    "- **FOREIGN KEY** -- связь между таблицами с поведением ON DELETE/ON UPDATE (CASCADE, SET NULL, RESTRICT)\n" +
    "- **UNIQUE** -- уникальность значений\n" +
    "- **NOT NULL** -- обязательность заполнения\n" +
    "- **DEFAULT** -- значение по умолчанию\n" +
    "- **CHECK** -- произвольное условие проверки\n\n---\n\n" +
    "## SQL Command Categories\n\n" +
    "**DDL (Data Definition Language)** -- defines and modifies database structure:\n" +
    "- `CREATE` -- create tables, indexes, views, schemas\n" +
    "- `ALTER` -- modify existing objects (add/drop columns, change types, rename)\n" +
    "- `DROP` -- permanently remove objects\n" +
    "- `TRUNCATE` -- remove all rows from a table (faster than DELETE, cannot be rolled back in some databases)\n\n" +
    "DDL commands are auto-committed in most databases -- you cannot roll back a DROP TABLE.\n\n" +
    "**DML (Data Manipulation Language)** -- operates on data within tables:\n" +
    "- `SELECT` (sometimes classified as DQL) -- query/read data\n" +
    "- `INSERT` -- add new rows\n" +
    "- `UPDATE` -- modify existing rows\n" +
    "- `DELETE` -- remove rows (can be rolled back within a transaction)\n\n" +
    "**DCL (Data Control Language)** -- manages access and permissions:\n" +
    "- `GRANT` -- give privileges (SELECT, INSERT, UPDATE on specific tables to specific users/roles)\n" +
    "- `REVOKE` -- remove previously granted privileges\n\n" +
    "**TCL (Transaction Control Language)** -- manages transactions:\n" +
    "- `COMMIT` -- make all changes permanent since the last commit\n" +
    "- `ROLLBACK` -- undo all changes since the last commit\n" +
    "- `SAVEPOINT` -- set a named point within a transaction to partially roll back to\n\n" +
    "## Constraints\n\n" +
    "Constraints enforce rules on data:\n" +
    "- **PRIMARY KEY** -- unique, non-null identifier. One per table. Can be composite.\n" +
    "- **FOREIGN KEY** -- references a primary key in another table. ON DELETE behavior: CASCADE (delete child rows), SET NULL, RESTRICT/NO ACTION (prevent deletion)\n" +
    "- **UNIQUE** -- no duplicate values (allows one NULL in most databases)\n" +
    "- **NOT NULL** -- column must have a value\n" +
    "- **DEFAULT** -- fallback value when none is specified\n" +
    "- **CHECK** -- custom validation (e.g., age > 0, status IN ('active', 'inactive'))",
  code: `-- ===== DDL: Data Definition Language =====

-- CREATE table with constraints
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT CHECK (age >= 18),
    role VARCHAR(20) DEFAULT 'USER',
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ALTER: add/modify columns
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users MODIFY COLUMN email VARCHAR(200);
ALTER TABLE users DROP COLUMN phone;

-- DROP: remove table entirely
DROP TABLE IF EXISTS temp_data;

-- TRUNCATE: fast delete all rows
TRUNCATE TABLE logs;

-- ===== DML: Data Manipulation Language =====

-- INSERT: add new rows
INSERT INTO users (username, email, age) VALUES ('john', 'john@mail.com', 25);

-- INSERT multiple rows
INSERT INTO users (username, email, age) VALUES
    ('alice', 'alice@mail.com', 30),
    ('bob', 'bob@mail.com', 28);

-- SELECT: query data with filtering, sorting, grouping
SELECT u.username, d.name AS department, COUNT(o.id) AS orders
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.age >= 21
GROUP BY u.username, d.name
HAVING COUNT(o.id) > 0
ORDER BY orders DESC
LIMIT 10;

-- UPDATE: modify existing rows
UPDATE users SET role = 'ADMIN' WHERE username = 'john';

-- DELETE: remove rows (can rollback in transaction)
DELETE FROM users WHERE age < 18;

-- ===== DCL: Data Control Language =====

-- GRANT: give permissions
GRANT SELECT, INSERT ON users TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON mydb.* TO 'admin'@'%';

-- REVOKE: remove permissions
REVOKE INSERT ON users FROM 'app_user'@'localhost';

-- ===== TCL: Transaction Control Language =====

START TRANSACTION;

INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 200 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 200 WHERE user_id = 2;

-- If everything OK:
COMMIT;

-- If something went wrong:
-- ROLLBACK;

-- SAVEPOINT example
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
SAVEPOINT after_debit;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 3;
-- Oops, user 3 does not exist, rollback to savepoint
ROLLBACK TO after_debit;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
COMMIT;`,
  interviewQs: [
    {
      id: "17-3-q0",
      q: "Назовите четыре категории SQL-команд и приведите примеры. / Name the four SQL command categories with examples.",
      a: "DDL (определение структуры): CREATE, ALTER, DROP, TRUNCATE. DML (работа с данными): SELECT, INSERT, UPDATE, DELETE. DCL (управление доступом): GRANT, REVOKE. TCL (управление транзакциями): COMMIT, ROLLBACK, SAVEPOINT. // DDL (structure): CREATE, ALTER, DROP, TRUNCATE. DML (data): SELECT, INSERT, UPDATE, DELETE. DCL (access): GRANT, REVOKE. TCL (transactions): COMMIT, ROLLBACK, SAVEPOINT.",
      difficulty: "junior",
    },
    {
      id: "17-3-q1",
      q: "What is the difference between DELETE, TRUNCATE, and DROP?",
      a: "DELETE removes specific rows matching a WHERE clause (or all rows without WHERE). It is DML, logged row-by-row, can be rolled back in a transaction, and fires triggers. TRUNCATE removes all rows from a table -- it is DDL, much faster because it deallocates data pages instead of logging individual rows. In most databases, TRUNCATE cannot be rolled back and does not fire row-level triggers. It resets auto-increment counters. DROP removes the entire table structure and all its data permanently. It is DDL and auto-committed. After DROP, the table no longer exists.",
      difficulty: "mid",
    },
    {
      id: "17-3-q2",
      q: "Explain ON DELETE CASCADE vs SET NULL vs RESTRICT on a foreign key. When would you use each?",
      a: "CASCADE: when the parent row is deleted, all child rows referencing it are automatically deleted too. Use for dependent data that has no meaning without the parent (e.g., order_items when an order is deleted). SET NULL: when the parent is deleted, the foreign key column in child rows is set to NULL. Use when the child record should survive but lose its association (e.g., employee.department_id when a department is dissolved). RESTRICT/NO ACTION: prevents deletion of the parent row if any child rows reference it. This is the safest default -- use it when accidental cascading deletions would be catastrophic (e.g., deleting a user should not cascade-delete their audit logs). Most ORMs default to RESTRICT.",
      difficulty: "senior",
    },
  ],
  tip: "TRUNCATE быстрее DELETE для очистки таблицы, но не может быть откачен и не вызывает триггеры. Используйте DELETE с WHERE для точечного удаления, TRUNCATE для полной очистки.",
  springConnection: null,
};
