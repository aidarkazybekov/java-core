import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "12-4",
  blockId: 12,
  title: "Multiple Bean Injection",
  summary:
    "Множественное внедрение возникает, когда для одного типа есть несколько бинов. Решается через @Primary (основной бин по умолчанию), @Qualifier (выбор конкретного бина по имени) и @Order (приоритет в коллекции).\n\n---\n\nMultiple bean injection occurs when several beans match one type. Resolved via @Primary (default bean), @Qualifier (select by name), and @Order (priority in collections).",
  deepDive:
    "## Множественное внедрение\n\nЭто ситуация, когда необходимо иметь более одного бина определенного типа. Возникает ошибка DI, которая говорит что невозможно точно определить бин для внедрения зависимостей. Возникает из-за того, что система ищет кандидата по типу, а тип является интерфейсом и она находит несколько реализаций данного интерфейса.\n\nСпособы решения:\n- **@Primary** -- используется для указания основного бина контейнера. Если есть несколько кандидатов и ни один не указан через @Qualifier, будет выбран бин с @Primary.\n- **@Order** -- для указания порядка (приоритета) бинов в коллекции, используемой для внедрения зависимостей. Принимает целое число -- индекс в списке.\n- **@Qualifier** -- позволяет выбрать конкретный компонент. Принимает строковое значение идентификатора компонента.\n\n---\n\nWhen Spring finds multiple beans of the same type during dependency injection, it throws `NoUniqueBeanDefinitionException`. This commonly happens with interface-based design where multiple implementations exist.\n\n**Resolution strategies:**\n\n1. **@Primary** -- marks one bean as the default choice. When no other disambiguation is provided, the @Primary bean wins. Best for a clear \"main\" implementation with optional alternatives.\n\n2. **@Qualifier(\"name\")** -- explicitly selects a specific bean by its qualifier name. More precise than @Primary and takes precedence over it. Can be placed on constructor parameters, setter parameters, or fields.\n\n3. **@Order(value)** -- controls the order of beans when injecting a `List<T>`. Lower values have higher priority. Does NOT affect which single bean is chosen -- only the ordering in collections.\n\n4. **Parameter name matching** -- as a fallback, Spring matches the parameter/field name to a bean name. If you have a field `private PaymentService stripePaymentService`, Spring will look for a bean named \"stripePaymentService\".\n\n5. **Custom @Qualifier annotations** -- create a custom annotation annotated with @Qualifier for type-safe bean selection. This avoids magic strings and is refactoring-friendly.\n\n6. **Profiles** -- use @Profile to activate different implementations per environment, avoiding multiple candidates at runtime.\n\nPrecedence order: @Qualifier > @Primary > parameter name matching. If none resolves the ambiguity, Spring throws an exception.",
  code: `// Multiple implementations of the same interface
public interface PaymentService {
    void processPayment(Order order);
}

@Service
@Primary // default choice when no qualifier specified
public class StripePaymentService implements PaymentService {
    @Override
    public void processPayment(Order order) {
        System.out.println("Processing via Stripe: " + order.getTotal());
    }
}

@Service
public class PayPalPaymentService implements PaymentService {
    @Override
    public void processPayment(Order order) {
        System.out.println("Processing via PayPal: " + order.getTotal());
    }
}

// Using @Qualifier to select specific implementation
@Service
public class OrderService {

    private final PaymentService defaultPayment;
    private final PaymentService paypalPayment;

    public OrderService(
            PaymentService defaultPayment, // gets @Primary (Stripe)
            @Qualifier("payPalPaymentService") PaymentService paypalPayment) {
        this.defaultPayment = defaultPayment;
        this.paypalPayment = paypalPayment;
    }
}

// Injecting all implementations as a List
@Service
public class PaymentRouter {

    private final List<PaymentService> allServices; // all impls injected

    public PaymentRouter(List<PaymentService> allServices) {
        this.allServices = allServices;
    }
}

// @Order controls collection ordering
@Service
@Order(1)
public class CreditCardValidator implements PaymentValidator { }

@Service
@Order(2)
public class FraudCheckValidator implements PaymentValidator { }

// Custom qualifier annotation (type-safe, no magic strings)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface PayPal { }

@Service
@PayPal
public class PayPalPaymentService implements PaymentService { ... }

@Service
public class CheckoutService {
    public CheckoutService(@PayPal PaymentService payment) {
        // gets PayPalPaymentService specifically
    }
}`,
  interviewQs: [
    {
      id: "12-4-q0",
      q: "What happens when Spring finds multiple beans of the same type? How do you resolve it?",
      a: "Spring throws NoUniqueBeanDefinitionException. Resolve with: @Primary on the default bean, @Qualifier(\"name\") to select a specific bean, or inject a List<T> to get all implementations. @Qualifier takes precedence over @Primary. As a fallback, Spring matches parameter/field names to bean names.",
      difficulty: "junior",
    },
    {
      id: "12-4-q1",
      q: "What is the precedence order when resolving bean ambiguity? When would you use @Primary vs @Qualifier?",
      a: "@Qualifier has highest precedence, then @Primary, then parameter name matching. Use @Primary when there's a clear 'main' implementation that most injection points should use (e.g., the primary DataSource). Use @Qualifier when specific injection points need a non-default implementation (e.g., a secondary read-only DataSource). They complement each other: @Primary provides the default, @Qualifier provides the override.",
      difficulty: "mid",
    },
    {
      id: "12-4-q2",
      q: "How would you design a plugin system where multiple implementations of an interface are discovered and ordered at runtime?",
      a: "Define the plugin interface and have implementations annotated with @Component and @Order. Inject List<PluginInterface> -- Spring auto-discovers all implementations and orders them by @Order value. For more control, use a custom @Qualifier annotation with metadata (e.g., @Plugin(name=\"pdf\", priority=1)). Combine with @Conditional to enable/disable plugins via properties. For true runtime discovery, use Spring's SpringFactoriesLoader or ServiceLoader pattern. The List injection approach is how Spring Security's filter chain and Spring Boot's auto-configuration ordering work internally.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@Primary` for the main implementation and `@Qualifier` only where you need a specific alternative. For collections, `@Order` controls the sequence.\n\n---\n\nИспользуйте `@Primary` для основной реализации и `@Qualifier` только там, где нужна конкретная альтернатива. Для коллекций `@Order` управляет порядком.",
  springConnection: null,
};
