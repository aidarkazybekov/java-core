import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-2",
  blockId: 15,
  title: "Spring AOP",
  summary:
    "AOP (аспектно-ориентированное программирование) позволяет внедрять сквозную функциональность (логирование, транзакции) без изменения бизнес-кода. Использует прокси-объекты (JDK Proxy для интерфейсов, CGLIB для классов).\n\n---\n\nAOP (Aspect-Oriented Programming) enables cross-cutting concerns (logging, transactions) without modifying business code. Uses proxy objects (JDK Proxy for interfaces, CGLIB for classes).",
  deepDive:
    "## Spring AOP\n\nАспектно-ориентированное программирование (АОП) -- парадигма, основанная на идее разделения функциональности для улучшения модульности. AOP позволяет внедрять повторяющуюся функциональность (логирование, транзакции, безопасность) без изменения основного бизнес-кода.\n\nСквозная функциональность (cross-cutting concerns) -- логика, которая распределена по различным модулям: логирование, обработка исключений, кэширование, безопасность, транзакции.\n\nSpring AOP использует прокси-объекты:\n- **CGLIB** -- создает прокси через наследование. Проблема: не работает с final методами и классами. Немного бьет по производительности.\n- **JDK Dynamic Proxy** -- создает прокси через интерфейсы. Работает только если бин реализует интерфейс.\n\n---\n\n**AOP Terminology**:\n\n- **Aspect** -- модуль, содержащий сквозную логику. Класс с `@Aspect`.\n- **Join Point** -- точка в программе, где может быть применен аспект (в Spring AOP -- только выполнение метода).\n- **Pointcut** -- выражение, определяющее, к каким join points применяется advice. Примеры: `execution(* com.example.service.*.*(..))`, `@annotation(Loggable)`.\n- **Advice** -- действие, выполняемое аспектом в определенный момент:\n  - `@Before` -- до метода\n  - `@After` -- после метода (всегда, как finally)\n  - `@AfterReturning` -- после успешного завершения\n  - `@AfterThrowing` -- после исключения\n  - `@Around` -- оборачивает метод полностью (самый мощный)\n- **Weaving** -- процесс связывания аспектов с целевыми объектами. Spring AOP использует runtime weaving через прокси.\n\n**How Spring AOP works**: When a bean has applicable aspects, Spring wraps it in a proxy during BeanPostProcessor.postProcessAfterInitialization(). The proxy intercepts method calls and applies advice logic. The original bean instance is inside the proxy.\n\n**CGLIB vs JDK Dynamic Proxy**:\n- CGLIB (default in Spring Boot): creates a subclass of the target class. Works with any class. Cannot proxy final methods/classes.\n- JDK Proxy: creates a proxy implementing the same interfaces. Only works with interface-based beans.\n\nSince Spring Boot 2.0, CGLIB is the default (proxyTargetClass=true). This is why `@Transactional` on a class without an interface still works.\n\n**Limitations**: Spring AOP only intercepts external method calls through the proxy. Self-invocation (calling methods within the same object) bypasses AOP advice.",
  code: `// Enable AOP
@Configuration
@EnableAspectJAutoProxy
public class AopConfig { }

// Logging aspect
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    // Pointcut: all methods in service package
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    // Before advice
    @Before("serviceMethods()")
    public void logBefore(JoinPoint jp) {
        log.info("Calling: {}.{}()",
            jp.getTarget().getClass().getSimpleName(),
            jp.getSignature().getName());
    }

    // Around advice (most powerful)
    @Around("serviceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = pjp.proceed(); // execute the actual method
            return result;
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("{}.{} executed in {} ms",
                pjp.getTarget().getClass().getSimpleName(),
                pjp.getSignature().getName(),
                duration);
        }
    }

    // After throwing -- log exceptions
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logException(JoinPoint jp, Exception ex) {
        log.error("Exception in {}.{}: {}",
            jp.getTarget().getClass().getSimpleName(),
            jp.getSignature().getName(),
            ex.getMessage());
    }
}

// Custom annotation-based AOP
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action() default "";
}

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService;

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp,
                        Auditable auditable) throws Throwable {
        String user = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        try {
            Object result = pjp.proceed();
            auditService.log(user, auditable.action(), "SUCCESS");
            return result;
        } catch (Exception ex) {
            auditService.log(user, auditable.action(), "FAILED");
            throw ex;
        }
    }
}

// Usage
@Service
public class OrderService {

    @Auditable(action = "CREATE_ORDER")
    public Order createOrder(OrderRequest request) {
        // AOP will log audit entry automatically
        return orderRepository.save(new Order(request));
    }
}`,
  interviewQs: [
    {
      id: "15-2-q0",
      q: "What is AOP? Name the main concepts: Aspect, Advice, Pointcut, Join Point.",
      a: "AOP (Aspect-Oriented Programming) separates cross-cutting concerns from business logic. Aspect is a module containing cross-cutting logic (@Aspect class). Join Point is a method execution where an aspect can apply. Pointcut is an expression selecting which join points are targeted. Advice is the action taken: @Before, @After, @AfterReturning, @AfterThrowing, @Around. Common uses: logging, transactions, security, caching.",
      difficulty: "junior",
    },
    {
      id: "15-2-q1",
      q: "How does Spring AOP create proxies? What is the difference between CGLIB and JDK Dynamic Proxy?",
      a: "Spring creates proxies during bean post-processing. CGLIB (default in Spring Boot) generates a subclass of the target class -- works with any class but cannot proxy final methods/classes. JDK Dynamic Proxy creates a proxy implementing the same interfaces -- only works when the bean implements interfaces. Spring chooses CGLIB by default since Boot 2.0 (proxyTargetClass=true). Both approaches intercept method calls to apply advice. The proxy delegates to the original bean after executing the advice chain.",
      difficulty: "mid",
    },
    {
      id: "15-2-q2",
      q: "Why doesn't AOP work with self-invocation? What are the alternatives?",
      a: "Spring AOP is proxy-based. External calls go through the proxy, triggering advice. But when a method calls another method on 'this', it's a direct Java call bypassing the proxy -- no AOP advice fires. This affects @Transactional, @Cacheable, @Async, and custom aspects. Solutions: (1) Extract the method to a separate service bean, (2) Inject the proxy via @Lazy self-injection or ApplicationContext.getBean(), (3) Use AopContext.currentProxy() (requires exposeProxy=true), (4) Switch to AspectJ compile-time/load-time weaving, which modifies bytecode directly and doesn't rely on proxies.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@Around` advice when you need full control over method execution (timing, retry, caching). For simple logging, `@Before` and `@AfterReturning` are sufficient.\n\n---\n\nИспользуйте `@Around` когда нужен полный контроль над выполнением метода (тайминг, retry, кэширование). Для простого логирования достаточно `@Before` и `@AfterReturning`.",
  springConnection: null,
};
