import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-1",
  blockId: 11,
  title: "IoC & Dependency Injection",
  summary:
    "IoC (Inversion of Control) -- принцип, при котором контроль над созданием объектов передается контейнеру. DI (Dependency Injection) -- конкретный механизм реализации IoC, когда зависимости автоматически внедряются в поля, конструкторы или сеттеры класса.\n\n---\n\nIoC (Inversion of Control) is a principle where the framework takes over object creation and lifecycle management. DI (Dependency Injection) is the concrete mechanism that implements IoC by automatically supplying dependencies through constructors, setters, or field injection, promoting loose coupling and testability.",
  deepDive:
    "## Что такое IoC и DI?\n\nIoC -- это принцип, согласно которому контроль над выполнением программы переходит от самого приложения к внешнему фреймворку или контейнеру. В контексте Spring, IoC означает, что фреймворк управляет жизненным циклом объектов (бинов) и их зависимостями. Вместо того чтобы создавать объекты напрямую, разработчик описывает, какие зависимости нужны, и контейнер Spring берет на себя ответственность за создание, настройку и управление этими объектами.\n\nDI (Dependency Injection) -- конкретный механизм реализации IoC, когда зависимости вкалываются (inject) в поля, конструкторы или сеттеры класса. Вместо ручного вызова конструктора, класс лишь декларирует, что ему требуется некий интерфейс/сервис, а Spring в момент создания бина автоматически подставляет соответствующую реализацию.\n\nТри способа внедрения:\n- **Field injection** -- через аннотацию @Autowired на поле\n- **Constructor injection** -- через конструктор (рекомендуемый способ)\n- **Setter (method) injection** -- через сеттер-метод\n\nЧто дает использование DI и IoC?\n- Меньше жестких связей: классы зависят от абстракций (интерфейсов), а не от конкретных реализаций\n- Упрощается тестирование: легко подменять настоящие зависимости мок-объектами\n- Упрощенная конфигурация: достаточно указать нужные зависимости, а контейнер сам их создаст и свяжет\n\n---\n\nInversion of Control (IoC) is the foundational design principle behind the Spring Framework. Instead of application code controlling the flow and instantiation of objects, the container takes charge. The developer declares what is needed, and the container handles the \"how\" and \"when\".\n\nDependency Injection is the practical implementation of IoC. Spring supports three injection styles:\n\n1. **Constructor injection** (recommended) -- dependencies are provided as constructor parameters. This makes the class immutable-friendly, ensures all required dependencies are present at creation time, and works well with `final` fields.\n2. **Setter injection** -- dependencies are provided via setter methods after construction. Useful for optional dependencies.\n3. **Field injection** -- the container directly sets fields annotated with `@Autowired`. While concise, it hides dependencies, makes testing harder (requires reflection), and prevents immutability.\n\nThe Spring team officially recommends constructor injection because it makes dependencies explicit, supports immutability, and prevents `NullPointerException` from missing dependencies. Since Spring 4.3, if a class has only one constructor, `@Autowired` is not even required on it.\n\nUnder the hood, Spring resolves dependencies by type first, then by qualifier or name if there are multiple candidates. If ambiguity remains, it throws `NoUniqueBeanDefinitionException`, which can be resolved with `@Qualifier` or `@Primary`.",
  code: `// Constructor injection (recommended)
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;

    // Since Spring 4.3, @Autowired is optional for single constructor
    public OrderService(OrderRepository orderRepository,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.paymentService = paymentService;
    }

    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        paymentService.process(order);
        return order;
    }
}

// Setter injection -- useful for optional dependencies
@Service
public class ReportService {

    private NotificationService notificationService;

    @Autowired(required = false)
    public void setNotificationService(NotificationService ns) {
        this.notificationService = ns;
    }

    public void generateReport() {
        // ... generate report
        if (notificationService != null) {
            notificationService.send("Report ready");
        }
    }
}

// Field injection -- concise but NOT recommended
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // hidden dependency

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
}`,
  interviewQs: [
    {
      id: "11-1-q0",
      q: "What is the difference between IoC and DI? How does Spring implement these concepts?",
      a: "IoC is the broad principle of inverting the control flow so that a framework manages object creation and lifecycle instead of application code. DI is one specific pattern that implements IoC by injecting dependencies into objects. Spring implements IoC through its ApplicationContext container that creates, wires, and manages beans. DI is performed via constructor, setter, or field injection using annotations like @Autowired.",
      difficulty: "junior",
    },
    {
      id: "11-1-q1",
      q: "Why does the Spring team recommend constructor injection over field injection? What are the trade-offs?",
      a: "Constructor injection makes dependencies explicit and visible in the API, supports immutability via final fields, ensures all required dependencies are present at creation time (fail-fast), and works naturally with unit tests (no reflection needed). Field injection is more concise but hides dependencies, prevents immutability, requires a Spring container or reflection for testing, and can mask design issues like too many dependencies. Setter injection is a middle ground suitable for optional dependencies.",
      difficulty: "mid",
    },
    {
      id: "11-1-q2",
      q: "Explain how Spring resolves dependencies when multiple beans of the same type exist. What happens internally?",
      a: "Spring first attempts to match by type. If multiple candidates exist, it checks for @Primary to select a default. If no @Primary is found, it looks for @Qualifier annotations for explicit naming. As a fallback, it matches by parameter/field name against bean names. If ambiguity still remains, Spring throws NoUniqueBeanDefinitionException. Internally, DefaultListableBeanFactory.doResolveDependency() orchestrates this process, consulting the BeanDefinitionRegistry and applying AutowireCandidateResolver implementations.",
      difficulty: "senior",
    },
  ],
  tip: "Always prefer constructor injection for required dependencies -- it enforces immutability with `final` fields and provides clear compile-time guarantees that all dependencies are satisfied.\n\n---\n\nВсегда предпочитайте внедрение через конструктор для обязательных зависимостей -- это обеспечивает иммутабельность через `final` поля и гарантирует, что все зависимости будут предоставлены на этапе компиляции.",
  springConnection: null,
};
