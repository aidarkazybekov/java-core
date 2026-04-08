import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "8-1",
  blockId: 8,
  title: "Thread Lifecycle",
  summary:
    "Java threads transition through NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED states. Understanding these states and the methods that trigger transitions is foundational for debugging concurrency issues and answering interview questions.",
  deepDive:
    "## В каких состояниях может находиться поток?\n\n- **NEW** -- объект класса Thread создан, но еще не запущен.\n- **RUNNABLE** -- готов к выполнению, но планировщик еще не выбрал его.\n- **BLOCKED** -- заблокирован, ожидает освобождения монитора.\n- **WAITING** -- ожидает уведомления (notify / notifyAll), чтобы продолжить выполнение.\n- **TIMED_WAITING** -- такой же как WAITING, но с ограничением по времени.\n- **TERMINATED** -- завершил выполнение и больше не активен.\n\n## Чем отличается процесс от потока?\n\n**Процесс** -- программа во время выполнения, независимый объект, которому выделены системные ресурсы. Каждый процесс выполняется в отдельном адресном пространстве.\n\n**Поток** (thread) -- определенный способ выполнения процесса, минимальная единица выполнения программы. Потоки в одном процессе имеют общий доступ к памяти и ресурсам.\n\n## Каким образом можно создать поток?\n\n- Создать потомка класса Thread и переопределить метод run()\n- Реализовать функциональный интерфейс Runnable::void run и передать в конструктор Thread\n- Реализовать функциональный интерфейс Callable::V call throws Exception и передать в конструктор Thread\n\n## Чем отличаются Thread и Runnable и Callable?\n\n- Thread -- это класс, некоторая надстройка над физическим потоком.\n- Runnable -- функциональный интерфейс имеющий один метод void run()\n- Callable -- функциональный интерфейс имеющий один метод V call() throws Exception\n- Runnable появился в Java 1.0, а Callable в Java 5.0 в пакете java.util.concurrent\n\n## Чем отличаются run() и start()?\n\nrun() -- определяет работу для потока, но выполняет её в текущем потоке, а не в новом.\nstart() -- создает новый поток выполнения, вызывает системные ресурсы для запуска нового потока, а затем внутренне вызывает метод run().\n\n## Что такое Thread.sleep()?\n\nСтатический метод класса Thread, который приостанавливает выполнение текущего потока на заданное количество миллисекунд. Во время выполнения метода поток может быть прерван другим потоком, что вызовет InterruptedException.\n\n## Что такое InterruptedException?\n\nInterruptedException возникает, когда поток в состоянии ожидания прерывается другим потоком с помощью метода interrupt().\n- interrupt() -- устанавливает флаг прерывания потока\n- interrupted() -- статический метод, позволяющий получить состояние флага и сбросить его\n- isInterrupted() -- метод получения состояния флага прерывания\n\n---\n\nA Java thread begins in the NEW state after construction (new Thread(runnable)) and transitions to RUNNABLE when start() is called. RUNNABLE encompasses both 'ready to run' and 'currently running' -- the OS scheduler decides which RUNNABLE threads actually execute on CPU cores. Calling run() directly does NOT start a new thread; it executes the Runnable on the caller's thread.\n\nFrom RUNNABLE, a thread enters BLOCKED when it attempts to acquire a monitor lock held by another thread (entering a synchronized block or method). It enters WAITING when it calls Object.wait(), Thread.join(), or LockSupport.park() without a timeout. It enters TIMED_WAITING when it calls Thread.sleep(ms), Object.wait(ms), Thread.join(ms), or LockSupport.parkNanos(). The thread returns to RUNNABLE when the blocking condition resolves.\n\nThread.sleep() pauses the current thread but does NOT release any locks it holds -- this is a common source of deadlocks. Object.wait() DOES release the monitor lock and must be called within a synchronized block. The woken thread must re-acquire the lock before continuing, so wait() should always be called in a while loop checking the condition, not an if statement, to guard against spurious wakeups.\n\nThread creation is expensive: each thread allocates a ~1MB stack by default. For this reason, production code uses thread pools (ExecutorService) rather than raw threads. Java 21 introduced virtual threads (Project Loom) which are lightweight, JVM-managed threads with minimal stack footprint that can scale to millions of concurrent tasks.\n\nThread.interrupt() sets the thread's interrupt flag. If the thread is in WAITING or TIMED_WAITING, it throws InterruptedException and clears the flag. If the thread is RUNNABLE, the flag is simply set and must be checked with Thread.interrupted() or isInterrupted(). Proper interrupt handling -- catching InterruptedException, restoring the interrupt flag, and terminating gracefully -- is essential for well-behaved concurrent code.",
  code: `public class ThreadLifecycleDemo {

    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        // 1. Thread states demonstration
        Thread thread = new Thread(() -> {
            try {
                // RUNNABLE -> TIMED_WAITING
                Thread.sleep(100);

                // RUNNABLE -> WAITING (via wait)
                synchronized (lock) {
                    lock.wait(); // releases the lock, enters WAITING
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // restore flag
                System.out.println("Thread was interrupted");
            }
        });

        System.out.println("State after new: " + thread.getState()); // NEW

        thread.start();
        System.out.println("State after start: " + thread.getState()); // RUNNABLE

        Thread.sleep(50);
        System.out.println("State during sleep: " + thread.getState()); // TIMED_WAITING

        Thread.sleep(100);
        System.out.println("State during wait: " + thread.getState()); // WAITING

        // Wake it up
        synchronized (lock) {
            lock.notify();
        }
        thread.join(); // wait for thread to finish
        System.out.println("State after join: " + thread.getState()); // TERMINATED

        // 2. Proper wait/notify pattern with condition loop
        Thread producer = new Thread(() -> {
            synchronized (lock) {
                System.out.println("Producer: setting condition and notifying");
                lock.notifyAll();
            }
        });

        Thread consumer = new Thread(() -> {
            synchronized (lock) {
                // Always use while loop, NOT if, to guard against spurious wakeups
                while (!Thread.currentThread().isInterrupted()) {
                    try {
                        lock.wait(); // releases lock, waits for notify
                        break;
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
                System.out.println("Consumer: woke up and proceeding");
            }
        });

        consumer.start();
        Thread.sleep(50); // ensure consumer is waiting
        producer.start();

        consumer.join();
        producer.join();

        // 3. Interrupt handling
        Thread worker = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                // do work
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    System.out.println("Worker interrupted during sleep");
                    Thread.currentThread().interrupt(); // re-set flag
                    break; // exit gracefully
                }
            }
            System.out.println("Worker exiting cleanly");
        });
        worker.start();
        Thread.sleep(100);
        worker.interrupt(); // request cancellation
        worker.join();
    }
}`,
  interviewQs: [
    {
      id: "8-1-q0",
      q: "What are the six thread states in Java, and what causes transitions between them?",
      a: "NEW: created but not started. RUNNABLE: after start(), eligible for CPU time. BLOCKED: waiting to acquire a synchronized lock. WAITING: called wait(), join(), or park() with no timeout. TIMED_WAITING: called sleep(ms), wait(ms), join(ms), or parkNanos(). TERMINATED: run() completed or uncaught exception. Key transitions: start() moves NEW to RUNNABLE; entering a contended synchronized block moves to BLOCKED; calling wait() moves to WAITING and releases the lock; sleep() moves to TIMED_WAITING but retains locks.",
      difficulty: "junior",
    },
    {
      id: "8-1-q1",
      q: "Why should Object.wait() always be called in a while loop rather than an if statement?",
      a: "Because of spurious wakeups: the JVM specification allows threads to wake from wait() without being notified. If wait() is in an if block, the thread proceeds even though the condition it was waiting for may not be true. A while loop re-checks the condition after every wakeup, ensuring the thread only proceeds when the actual business condition is met. Pattern: synchronized(lock) { while (!condition) { lock.wait(); } // proceed }.",
      difficulty: "mid",
    },
    {
      id: "8-1-q2",
      q: "Compare platform threads to virtual threads (Project Loom). When would you still prefer platform threads?",
      a: "Virtual threads are JVM-managed, lightweight (~kilobytes of stack), and can scale to millions of concurrent tasks. They are ideal for I/O-bound workloads where threads mostly wait (web servers, database calls). Platform threads map 1:1 to OS threads (~1MB stack) and are managed by the OS scheduler. Prefer platform threads for CPU-bound computation where you need predictable scheduling and OS-level thread affinity, when using ThreadLocal heavily (virtual threads can have millions of instances, wasting memory per-ThreadLocal), when pinned to native code via JNI/FFI, or when using synchronized blocks that would pin virtual threads to carrier threads (ReentrantLock is preferred with virtual threads).",
      difficulty: "senior",
    },
  ],
  tip: "When catching InterruptedException, always either re-throw it or restore the interrupt flag with Thread.currentThread().interrupt(). Swallowing the exception silently breaks the interruption contract and prevents proper shutdown.",
  springConnection: {
    concept: "Thread Lifecycle",
    springFeature: "Spring's @Async and TaskExecutor",
    explanation:
      "Spring's @Async annotation causes methods to execute on a separate thread managed by a TaskExecutor (which wraps ExecutorService). Spring Boot auto-configures a ThreadPoolTaskExecutor that manages thread lifecycle -- creation, pooling, and shutdown -- so developers work at the task level rather than managing raw threads.",
  },
};
