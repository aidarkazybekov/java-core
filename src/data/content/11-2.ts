import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-2",
  blockId: 11,
  title: "ApplicationContext & BeanFactory",
  summary:
    "BeanFactory -- базовый контейнер Spring с ленивой инициализацией бинов. ApplicationContext -- расширение BeanFactory, которое создает все singleton-бины сразу (eager init), поддерживает события, i18n и интеграцию с AOP.\n\n---\n\nBeanFactory is the basic Spring container that lazily initializes beans on first request. ApplicationContext extends BeanFactory with eager initialization of singletons, event publishing, internationalization (i18n), and seamless AOP integration.",
  deepDive:
    "## Что такое ApplicationContext и BeanFactory?\n\nСуществует два ключевых контейнера:\n\n**BeanFactory**\n- Базовый контейнер, предоставляющий базовые операции по созданию, поиску и настройке бинов\n- Ленивая инициализация бинов -- создаются при первом запросе бина\n- Поддержка двух scope -- singleton и prototype\n\n**ApplicationContext**\n- Расширяет функциональность BeanFactory\n- По умолчанию создает все бины сразу (eager init), что позволяет заранее обнаружить проблемы\n- Поддерживает события (ApplicationEvent), i18n (MessageSource), доступ к ресурсам (ResourceLoader)\n- Автоматическая регистрация BeanPostProcessor и BeanFactoryPostProcessor\n\nБином называется объект, который управляется контейнером Spring.\n\n---\n\nThe Spring IoC container comes in two main flavors:\n\n**BeanFactory** is the root interface (org.springframework.beans.factory.BeanFactory). It provides the most basic container functionality: registering bean definitions, resolving beans by name or type, and managing scope. Critically, BeanFactory uses lazy initialization -- beans are created only when first requested via `getBean()`. This saves memory but means configuration errors are discovered late, at runtime.\n\n**ApplicationContext** (org.springframework.context.ApplicationContext) extends BeanFactory and is the container used in virtually all production Spring applications. Key enhancements include:\n\n1. **Eager initialization** -- all singleton beans are created at startup, catching misconfiguration early.\n2. **Event system** -- publish/subscribe via ApplicationEvent and @EventListener.\n3. **Internationalization** -- MessageSource for locale-aware messages.\n4. **Resource loading** -- unified resource abstraction (classpath:, file:, http:).\n5. **Environment abstraction** -- profiles and property sources.\n6. **AOP integration** -- automatic proxy creation for @Transactional, @Cacheable, etc.\n\nCommon implementations include AnnotationConfigApplicationContext (Java config), ClassPathXmlApplicationContext (XML config), and the auto-configured context in Spring Boot. In Spring Boot, the context is typically a specialized AnnotationConfigServletWebServerApplicationContext that also manages the embedded web server.\n\nWhen choosing between them: always use ApplicationContext unless you have extreme memory constraints (rare in practice). BeanFactory is the foundation, but ApplicationContext is the real workhorse.",
  code: `// BeanFactory -- basic container (rarely used directly)
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;

BeanFactory factory = new XmlBeanFactory(
    new ClassPathResource("beans.xml")
);
// Bean created only when requested (lazy)
MyService service = factory.getBean("myService", MyService.class);

// ApplicationContext -- full-featured container (standard choice)
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
// All singletons already created at this point (eager)
MyService service = ctx.getBean(MyService.class);

// Spring Boot auto-configures ApplicationContext
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(MyApp.class, args);
        // Context is fully initialized, all beans ready
        MyService service = ctx.getBean(MyService.class);
    }
}

// Using events via ApplicationContext
@Component
public class OrderEventListener {

    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        System.out.println("Order created: " + event.getOrderId());
    }
}

@Service
public class OrderService {

    private final ApplicationEventPublisher publisher;

    public OrderService(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void createOrder(Order order) {
        // ... save order
        publisher.publishEvent(new OrderCreatedEvent(order.getId()));
    }
}`,
  interviewQs: [
    {
      id: "11-2-q0",
      q: "What is the difference between BeanFactory and ApplicationContext? Which should you use?",
      a: "BeanFactory is the basic container providing lazy bean initialization and basic DI. ApplicationContext extends BeanFactory adding eager singleton initialization, event publishing, i18n support, resource loading, and AOP integration. Always use ApplicationContext in production -- BeanFactory is too limited for real applications. Spring Boot automatically configures ApplicationContext.",
      difficulty: "junior",
    },
    {
      id: "11-2-q1",
      q: "What types of ApplicationContext exist in Spring and when is each used?",
      a: "AnnotationConfigApplicationContext is used with Java-based @Configuration classes. ClassPathXmlApplicationContext loads bean definitions from XML on the classpath. AnnotationConfigServletWebServerApplicationContext is Spring Boot's default for web applications -- it also manages the embedded server. GenericWebApplicationContext is used in servlet-based Spring MVC without Boot. AnnotationConfigReactiveWebServerApplicationContext is used for WebFlux applications.",
      difficulty: "mid",
    },
    {
      id: "11-2-q2",
      q: "Explain how ApplicationContext startup works internally. What happens between calling SpringApplication.run() and the context being ready?",
      a: "SpringApplication.run() creates the appropriate ApplicationContext type, loads bean definitions from @Configuration classes and component scanning, then calls refresh(). During refresh(): BeanFactoryPostProcessors run (processing @Configuration, resolving property placeholders), BeanPostProcessors are registered, singleton beans are instantiated and injected in dependency order, @PostConstruct methods fire, the embedded web server starts (if web app), and finally ContextRefreshedEvent is published. If any bean fails, the entire context is destroyed to prevent partial initialization.",
      difficulty: "senior",
    },
  ],
  tip: "Use ApplicationContext events (`@EventListener`) to decouple components instead of direct method calls -- it keeps modules independent and testable.\n\n---\n\nИспользуйте события ApplicationContext (`@EventListener`) для развязки компонентов вместо прямых вызовов методов -- это сохраняет модули независимыми и тестируемыми.",
  springConnection: null,
};
