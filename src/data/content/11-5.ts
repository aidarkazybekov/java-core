import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "11-5",
  blockId: 11,
  title: "BPP & BFPP",
  summary:
    "BeanPostProcessor (BPP) -- позволяет модифицировать бины после создания (создание прокси, валидация). BeanFactoryPostProcessor (BFPP) -- позволяет модифицировать определения бинов до их создания (изменение metadata, замена плейсхолдеров).\n\n---\n\nBeanPostProcessor (BPP) modifies bean instances after creation (creating proxies, validation). BeanFactoryPostProcessor (BFPP) modifies bean definitions before instantiation (altering metadata, resolving property placeholders).",
  deepDive:
    "## Что такое BPP и BFPP?\n\n**BeanFactoryPostProcessor (BFPP)** работает на этапе обработки определений бинов (BeanDefinition), то есть до создания самих бинов. Он может изменять метаданные бинов: менять scope, добавлять/удалять свойства, заменять плейсхолдеры в конфигурации. Пример: PropertySourcesPlaceholderConfigurer заменяет ${...} значениями из properties-файлов.\n\n**BeanPostProcessor (BPP)** работает после создания экземпляра бина. Имеет два метода:\n- postProcessBeforeInitialization() -- вызывается до @PostConstruct\n- postProcessAfterInitialization() -- вызывается после @PostConstruct\n\nBPP используется для создания AOP-прокси, обработки аннотаций (@Autowired, @Value), валидации бинов.\n\n---\n\n**BeanFactoryPostProcessor (BFPP)** operates on the bean definitions (metadata) before any beans are instantiated. It receives a ConfigurableListableBeanFactory and can modify BeanDefinition objects. Key built-in implementations:\n\n- `PropertySourcesPlaceholderConfigurer` -- resolves `${...}` placeholders in bean definitions\n- `ConfigurationClassPostProcessor` -- processes @Configuration, @ComponentScan, @Import, @Bean\n\nBFPP runs very early in the context lifecycle. A BFPP should never trigger eager bean instantiation (e.g., by injecting other beans through @Autowired), as those beans will miss BeanPostProcessor processing.\n\n**BeanPostProcessor (BPP)** operates on bean instances after they are created. Every bean passes through all registered BPPs. The two callback methods provide hooks:\n\n1. `postProcessBeforeInitialization(bean, beanName)` -- runs before @PostConstruct/afterPropertiesSet. Used by CommonAnnotationBeanPostProcessor to handle @PostConstruct, @PreDestroy, @Resource.\n\n2. `postProcessAfterInitialization(bean, beanName)` -- runs after initialization. Used by:\n   - `AutowiredAnnotationBeanPostProcessor` -- processes @Autowired, @Value\n   - `AbstractAutoProxyCreator` -- wraps beans in AOP proxies (for @Transactional, @Cacheable, etc.)\n\nThe order matters: BFPPs run first (modifying definitions), then beans are created, then BPPs process each bean. Understanding this pipeline is essential for debugging initialization issues and knowing when proxies are created.",
  code: `// Custom BeanPostProcessor -- logging and timing
@Component
public class BeanTimingPostProcessor implements BeanPostProcessor {

    private final Map<String, Long> startTimes = new ConcurrentHashMap<>();

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        startTimes.put(beanName, System.nanoTime());
        return bean; // must return the bean (or a wrapper)
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        Long start = startTimes.remove(beanName);
        if (start != null) {
            long duration = System.nanoTime() - start;
            if (duration > 1_000_000) { // > 1ms
                System.out.printf("Bean '%s' init took %d ms%n",
                    beanName, duration / 1_000_000);
            }
        }
        return bean;
    }
}

// Custom BeanFactoryPostProcessor -- modify bean definitions
@Component
public class DefaultScopePostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(
            ConfigurableListableBeanFactory beanFactory) {

        for (String name : beanFactory.getBeanDefinitionNames()) {
            BeanDefinition def = beanFactory.getBeanDefinition(name);
            // Example: log all bean definitions at startup
            System.out.printf("Bean: %s, scope: %s, class: %s%n",
                name,
                def.getScope().isEmpty() ? "singleton" : def.getScope(),
                def.getBeanClassName());
        }
    }
}

// How Spring uses BPP internally for AOP proxying
// (simplified illustration)
public class ProxyCreatorPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessAfterInitialization(Object bean, String name) {
        if (needsProxy(bean)) {
            // Return a proxy instead of the original bean
            return createProxy(bean);
        }
        return bean;
    }
}`,
  interviewQs: [
    {
      id: "11-5-q0",
      q: "What is the difference between BeanPostProcessor and BeanFactoryPostProcessor?",
      a: "BeanFactoryPostProcessor works with bean definitions (metadata) before beans are created -- it can modify scope, properties, or resolve placeholders. BeanPostProcessor works with bean instances after creation, providing before/after initialization hooks. BFPP runs first during context startup, then beans are instantiated and each passes through all registered BPPs.",
      difficulty: "junior",
    },
    {
      id: "11-5-q1",
      q: "Give examples of built-in BeanPostProcessors in Spring and what they do.",
      a: "AutowiredAnnotationBeanPostProcessor processes @Autowired and @Value injection. CommonAnnotationBeanPostProcessor handles @PostConstruct, @PreDestroy, and @Resource. AbstractAutoProxyCreator (and its subclass AnnotationAwareAspectJAutoProxyCreator) creates AOP proxies for beans that match pointcuts, enabling @Transactional, @Cacheable, @Async. ScheduledAnnotationBeanPostProcessor registers @Scheduled methods with the task scheduler.",
      difficulty: "mid",
    },
    {
      id: "11-5-q2",
      q: "Why is it dangerous for a BeanFactoryPostProcessor to have @Autowired dependencies? What happens?",
      a: "BFPP runs before any regular beans are created. If a BFPP has @Autowired dependencies, Spring must eagerly instantiate those beans to satisfy the BFPP. But those beans will miss processing by other BPPs (like AutowiredAnnotationBeanPostProcessor) because BPPs are registered after BFPPs. This leads to beans without proper injection, missing AOP proxies, or subtle bugs. Spring logs warnings like 'BeanPostProcessor not eligible for getting processed by all BeanPostProcessors'. The fix: BFPP should declare dependencies via static @Bean methods or constructor parameters from the BeanFactory directly.",
      difficulty: "senior",
    },
  ],
  tip: "Remember the order: BFPP modifies *definitions*, BPP modifies *instances*. AOP proxies are created in `postProcessAfterInitialization`, which is why `@Transactional` self-invocation does not work.\n\n---\n\nЗапомните порядок: BFPP модифицирует *определения*, BPP модифицирует *экземпляры*. AOP-прокси создаются в `postProcessAfterInitialization`, поэтому self-invocation в `@Transactional` не работает.",
  springConnection: null,
};
