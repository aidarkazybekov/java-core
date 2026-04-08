import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "8-5",
  blockId: 8,
  title: "ExecutorService",
  summary:
    "ExecutorService decouples task submission from execution mechanics, managing thread pools that reuse threads efficiently. The Executors factory class provides common configurations, while ThreadPoolExecutor allows fine-tuned control over pool sizing, queuing, and rejection policies.",
  deepDive:
    "## Что такое «пул потоков»?\n\nПул потоков -- это коллекция заранее созданных потоков, которые могут повторно использоваться для выполнения задач. Вместо создания нового потока для каждой задачи, задачи помещаются в очередь, а существующие потоки из очереди берут их на выполнение.\n\nНачиная с Java 1.5 предоставляются инструменты для создания и управления пулами потоков:\n- Executor -- упрощенный интерфейс пула, содержит один метод для передачи задачи на выполнение\n- ExecutorService -- расширенный интерфейс пула, с возможностью завершения всех потоков\n- ScheduledExecutorService -- для планирования задач с задержкой или периодически\n- Executors -- фабрика создания пула потоков\n\nМетоды Executors для создания пулов:\n- newCachedThreadPool() -- если есть свободный поток, то задача выполняется в нем, иначе добавляется новый поток в пул. Потоки, не используемые больше минуты, удаляются.\n- newFixedThreadPool() -- фиксированное количество потоков\n\n## Что такое Fork/Join Framework?\n\nFork/Join Framework -- фреймворк, представленный в Java 7, предназначенный для выполнения задач, которые можно рекурсивно разбить (fork) на маленькие подзадачи, решить параллельно, а затем объединить (join) их результаты. Базируется на алгоритме «разделяй и властвуй».\n\n---\n\nThe Executor framework (java.util.concurrent) separates the 'what' (tasks as Runnable/Callable) from the 'how' (thread management). ExecutorService extends Executor with lifecycle management (shutdown(), shutdownNow(), awaitTermination()) and Future-returning submission methods (submit(), invokeAll(), invokeAny()).\n\nExecutors factory methods create common pool types: newFixedThreadPool(n) maintains exactly n threads with an unbounded LinkedBlockingQueue -- safe for CPU-bound work but risky if tasks accumulate faster than they complete (unbounded queue = potential OOM). newCachedThreadPool() creates threads on demand and reuses idle ones for 60 seconds -- good for short-lived tasks but can spawn unlimited threads under load. newSingleThreadExecutor() guarantees sequential execution with one thread. newScheduledThreadPool(n) supports delayed and periodic task execution.\n\nThreadPoolExecutor is the underlying implementation with configurable parameters: corePoolSize (minimum threads kept alive), maximumPoolSize (ceiling under load), keepAliveTime (how long excess threads wait before terminating), workQueue (bounded or unbounded), threadFactory (for naming and daemon status), and rejectionHandler (AbortPolicy, CallerRunsPolicy, DiscardPolicy, DiscardOldestPolicy). Understanding these parameters and their interaction is essential: the pool only creates threads beyond corePoolSize when the work queue is full, which means with an unbounded queue, maximumPoolSize is effectively ignored.\n\nFuture<T> represents an asynchronous computation result. get() blocks until the result is available (or throws ExecutionException wrapping any thrown exception). get(timeout, unit) bounds the wait. cancel(mayInterruptIfRunning) attempts to cancel the task. The limitation of Future is that it is purely blocking -- composing multiple futures requires manual thread coordination, which CompletableFuture solves.\n\nProper shutdown is critical: shutdown() stops accepting new tasks and waits for submitted tasks to complete. shutdownNow() interrupts running tasks and returns a list of unexecuted tasks. The idiom is: executor.shutdown(); if (!executor.awaitTermination(60, SECONDS)) { executor.shutdownNow(); }. In Spring Boot, the ApplicationContext handles executor shutdown automatically when the bean is properly managed.",
  code: `import java.util.concurrent.*;
import java.util.List;
import java.util.ArrayList;

public class ExecutorServiceDemo {

    public static void main(String[] args) throws Exception {
        // 1. Fixed thread pool
        ExecutorService fixedPool = Executors.newFixedThreadPool(4);
        List<Future<String>> futures = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            Future<String> future = fixedPool.submit(() -> {
                Thread.sleep(100); // simulate work
                return "Task-" + taskId + " by " + Thread.currentThread().getName();
            });
            futures.add(future);
        }

        for (Future<String> f : futures) {
            System.out.println(f.get()); // blocks until result ready
        }

        // 2. Custom ThreadPoolExecutor with bounded queue
        ThreadPoolExecutor customPool = new ThreadPoolExecutor(
            2,                           // corePoolSize
            4,                           // maximumPoolSize
            30L, TimeUnit.SECONDS,       // keepAliveTime
            new ArrayBlockingQueue<>(10), // bounded work queue
            new ThreadFactory() {        // custom thread naming
                private int count = 0;
                @Override
                public Thread newThread(Runnable r) {
                    return new Thread(r, "worker-" + count++);
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy() // rejection: run in caller thread
        );

        for (int i = 0; i < 20; i++) {
            final int taskId = i;
            customPool.execute(() -> {
                System.out.println("Custom task " + taskId
                    + " on " + Thread.currentThread().getName());
            });
        }

        // 3. Scheduled executor
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        // One-shot delay
        scheduler.schedule(
            () -> System.out.println("Delayed task executed"),
            1, TimeUnit.SECONDS
        );

        // Periodic execution (fixed rate)
        ScheduledFuture<?> periodic = scheduler.scheduleAtFixedRate(
            () -> System.out.println("Periodic: " + System.currentTimeMillis()),
            0, 500, TimeUnit.MILLISECONDS
        );

        Thread.sleep(2000);
        periodic.cancel(false); // stop periodic task

        // 4. invokeAll -- submit batch, wait for all
        List<Callable<Integer>> tasks = List.of(
            () -> { Thread.sleep(200); return 1; },
            () -> { Thread.sleep(100); return 2; },
            () -> { Thread.sleep(300); return 3; }
        );
        List<Future<Integer>> results = fixedPool.invokeAll(tasks);
        for (Future<Integer> r : results) {
            System.out.println("Batch result: " + r.get());
        }

        // 5. invokeAny -- return first completed result
        Integer fastest = fixedPool.invokeAny(tasks);
        System.out.println("Fastest result: " + fastest);

        // 6. Proper shutdown
        fixedPool.shutdown();
        customPool.shutdown();
        scheduler.shutdown();

        if (!fixedPool.awaitTermination(5, TimeUnit.SECONDS)) {
            fixedPool.shutdownNow();
        }
    }
}`,
  interviewQs: [
    {
      id: "8-5-q0",
      q: "What is the difference between execute() and submit() on ExecutorService?",
      a: "execute(Runnable) submits a task for execution but returns void -- exceptions are silently passed to the UncaughtExceptionHandler. submit(Callable/Runnable) returns a Future<T> that lets you retrieve the result, check completion, cancel the task, and access exceptions via ExecutionException when calling get(). Always prefer submit() when you need to handle results or exceptions.",
      difficulty: "junior",
    },
    {
      id: "8-5-q1",
      q: "Why is Executors.newFixedThreadPool() potentially dangerous in production, and what should you use instead?",
      a: "newFixedThreadPool() uses an unbounded LinkedBlockingQueue. If tasks arrive faster than threads process them, the queue grows without limit, eventually causing OutOfMemoryError. In production, use ThreadPoolExecutor directly with a bounded ArrayBlockingQueue and an appropriate RejectionHandler (e.g., CallerRunsPolicy to apply backpressure). This gives you control over queue capacity, rejection behavior, thread naming (via ThreadFactory), and monitoring via getPoolSize()/getActiveCount().",
      difficulty: "mid",
    },
    {
      id: "8-5-q2",
      q: "Explain the interaction between corePoolSize, maximumPoolSize, and the work queue in ThreadPoolExecutor. How does the pool decide when to create new threads?",
      a: "When a task is submitted: (1) If fewer than corePoolSize threads are running, a new thread is created regardless of idle threads. (2) If corePoolSize threads exist, the task is queued in the work queue. (3) Only when the queue is FULL and running threads are below maximumPoolSize, a new thread is created. (4) If the queue is full and threads are at maximumPoolSize, the RejectionHandler is invoked. Critical insight: with an unbounded queue (LinkedBlockingQueue), step 3 never happens -- maximumPoolSize is effectively ignored. For the pool to scale beyond corePoolSize, you must use a bounded queue. keepAliveTime only applies to threads above corePoolSize; call allowCoreThreadTimeOut(true) to apply it to core threads too.",
      difficulty: "senior",
    },
  ],
  tip: "Always name your threads via a custom ThreadFactory. In a thread dump, 'pool-1-thread-3' tells you nothing, but 'order-processor-3' immediately identifies the purpose, making production debugging vastly easier.",
  springConnection: {
    concept: "ExecutorService",
    springFeature: "@Async and ThreadPoolTaskExecutor",
    explanation:
      "Spring's @Async annotation executes methods on a separate thread from a configured TaskExecutor. Spring Boot auto-configures a ThreadPoolTaskExecutor (wrapping ThreadPoolExecutor) with sensible defaults. You can customize it via spring.task.execution.pool.* properties or by defining a TaskExecutor bean. The @Async method returns Future, CompletableFuture, or void, and Spring handles the submission and thread management transparently.",
  },
};
