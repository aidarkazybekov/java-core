import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-2",
  blockId: 15,
  title: "Spring AOP",
  summary:
    "AOP (Аспектно-ориентированное программирование) -- парадигма разделения сквозной функциональности (логирование, транзакции, безопасность) от бизнес-логики. Spring AOP использует прокси-объекты (JDK Dynamic Proxy для интерфейсов, CGLIB для классов).\n\n---\n\nAOP (Aspect-Oriented Programming) separates cross-cutting concerns (logging, transactions, security) from business logic. Spring AOP uses proxy objects (JDK Dynamic Proxy for interfaces, CGLIB for classes).",
  deepDive:
    "## Spring AOP\n\n" +
    "Аспектно-ориентированное программирование -- парадигма, основанная на разделении функциональности для улучшения модульности.\n\n" +
    "AOP позволяет внедрять повторяющуюся функциональность (логирование, транзакции) без изменения основного бизнес-кода.\n\n" +
    "Использует **прокси-объекты**:\n" +
    "- **CGLIB** -- наследование (проблема: final методы)\n" +
    "- **JDK Dynamic Proxy** -- через интерфейсы\n\n" +
    "Сквозная функциональность (cross-cutting concerns): логирование, обработка исключений, безопасность, транзакции.\n\n---\n\n" +
    "## AOP Concepts\n\n" +
    "- **Aspect** -- a module encapsulating cross-cutting logic (e.g., logging aspect)\n" +
    "- **Join Point** -- a point in program execution (method call, exception throw)\n" +
    "- **Pointcut** -- an expression that selects join points (e.g., all methods in service layer)\n" +
    "- **Advice** -- the action taken at a join point. Types:\n" +
    "  - `@Before` -- runs before the method\n" +
    "  - `@After` -- runs after (regardless of outcome)\n" +
    "  - `@AfterReturning` -- runs after successful return\n" +
    "  - `@AfterThrowing` -- runs after exception\n" +
    "  - `@Around` -- wraps the method, controls execution\n" +
    "- **Weaving** -- linking aspects with target objects. Spring does this at runtime via proxies.\n\n" +
    "## Proxy Types\n\n" +
    "- **JDK Dynamic Proxy:** Used when the bean implements an interface. Proxy implements the same interface.\n" +
    "- **CGLIB Proxy:** Used when no interface. Creates a subclass of the target. Cannot proxy final methods/classes.\n\n" +
    "Spring Boot defaults to CGLIB proxies (`spring.aop.proxy-target-class=true`).\n\n" +
    "## Common Uses\n\n" +
    "Spring itself uses AOP extensively: `@Transactional`, `@Cacheable`, `@Async`, `@Secured` -- all work through AOP proxies.",
  code: `// ===== Logging Aspect =====
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    // Pointcut: all methods in service package
    @Pointcut("within(com.example.service..*)")
    public void serviceMethods() {}

    // Before advice
    @Before("serviceMethods()")
    public void logBefore(JoinPoint jp) {
        log.info("Calling: {}.{}({})",
            jp.getTarget().getClass().getSimpleName(),
            jp.getSignature().getName(),
            Arrays.toString(jp.getArgs()));
    }

    // Around advice (most powerful)
    @Around("serviceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = pjp.proceed();  // execute the method
            long elapsed = System.currentTimeMillis() - start;
            log.info("{}.{} completed in {}ms",
                pjp.getTarget().getClass().getSimpleName(),
                pjp.getSignature().getName(), elapsed);
            return result;
        } catch (Exception e) {
            log.error("{}.{} failed: {}",
                pjp.getTarget().getClass().getSimpleName(),
                pjp.getSignature().getName(), e.getMessage());
            throw e;
        }
    }

    // After returning
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint jp, Object result) {
        log.info("{} returned: {}", jp.getSignature().getName(), result);
    }

    // After throwing
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logAfterThrowing(JoinPoint jp, Exception ex) {
        log.error("{} threw: {}", jp.getSignature().getName(), ex.getMessage());
    }
}

// ===== Custom annotation + aspect =====
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    int maxRequests() default 100;
    int periodSeconds() default 60;
}

@Aspect
@Component
public class RateLimitAspect {

    @Around("@annotation(rateLimit)")
    public Object enforce(ProceedingJoinPoint pjp, RateLimit rateLimit)
            throws Throwable {
        String key = pjp.getSignature().toShortString();
        if (isRateLimited(key, rateLimit.maxRequests())) {
            throw new TooManyRequestsException("Rate limit exceeded");
        }
        return pjp.proceed();
    }
}`,
  interviewQs: [
    {
      id: "15-2-q0",
      q: "What is AOP and what problem does it solve? Give examples of cross-cutting concerns.",
      a: "AOP (Aspect-Oriented Programming) separates cross-cutting concerns from business logic. Cross-cutting concerns are functionalities that span multiple modules: logging, transaction management, security, caching, exception handling. Without AOP, this logic would be duplicated across many classes. AOP lets you define it once in an Aspect and apply it declaratively.",
      difficulty: "junior",
    },
    {
      id: "15-2-q1",
      q: "Explain the difference between @Before, @After, @Around, @AfterReturning, and @AfterThrowing advice types.",
      a: "@Before runs before the target method. @After runs after regardless of outcome (like finally). @AfterReturning runs only after successful return, can access the return value. @AfterThrowing runs only when an exception is thrown, can access the exception. @Around is the most powerful -- it wraps the method, controls whether it executes (pjp.proceed()), can modify arguments and return value. Use @Around for timing, retry logic, or when you need full control.",
      difficulty: "mid",
    },
    {
      id: "15-2-q2",
      q: "How does Spring AOP differ from AspectJ? What are the limitations of proxy-based AOP?",
      a: "Spring AOP uses runtime proxies (JDK or CGLIB), while AspectJ uses compile-time or load-time weaving. Spring AOP limitations: (1) Only method-level join points (no field access, constructor interception). (2) Self-invocation bypasses proxy -- internal calls within a bean don't trigger aspects. (3) Cannot proxy final classes/methods (CGLIB). (4) Only works on Spring-managed beans. AspectJ has none of these limitations but requires a weaving agent. For most applications, Spring AOP is sufficient. Use AspectJ when you need self-invocation support or non-method join points.",
      difficulty: "senior",
    },
  ],
  tip: "Помните: @Around аспект ДОЛЖЕН вызвать `pjp.proceed()` -- иначе целевой метод не выполнится.\n\n---\n\nRemember: @Around advice MUST call `pjp.proceed()` -- otherwise the target method will not execute.",
  springConnection: null,
};
