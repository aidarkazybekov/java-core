import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "19-1",
  blockId: 19,
  title: "Testing Types & Pyramid",
  summary:
    "Software testing verifies that actual behavior matches expected behavior. The testing pyramid recommends many fast unit tests at the base, fewer integration tests in the middle, and minimal E2E tests at the top to balance confidence with speed.",
  deepDive:
    "## Виды тестирования\n\nТестирование -- процесс исследования, испытания программного продукта, имеющий своей целью проверку соответствия между реальным поведением программы и её ожидаемым поведением.\n\n### Основные виды:\n\n- **Unit (модульное)** -- проверка отдельных блоков кода (компонентов) в изоляции. Самые быстрые и дешёвые тесты.\n- **Интеграционные** -- проверка взаимодействия между компонентами (например, сервис + база данных, контроллер + сервис).\n- **Системные (E2E)** -- тестирование системы целиком, включая пользовательский интерфейс и все интеграции.\n- **Приёмочные (Acceptance)** -- проверка соответствия бизнес-требованиям, часто выполняется заказчиком или QA.\n- **Производительность** -- проверка скорости, времени отклика и пропускной способности.\n- **Безопасность** -- поиск уязвимостей и проверка защиты данных.\n\n### Пирамида тестирования\n\nКонцепция, предложенная Mike Cohn, рекомендует:\n\n```\n      /  E2E  \\        ← Мало, медленные, дорогие\n     / Integr. \\       ← Средне\n    /   Unit    \\      ← Много, быстрые, дешёвые\n```\n\nОснова пирамиды -- unit-тесты (70-80%), затем интеграционные (15-20%), и на вершине E2E (5-10%).\n\n---\n\n## Testing Types & the Testing Pyramid\n\nSoftware testing is a systematic process of verifying that a program behaves as expected under defined conditions.\n\n### Core Testing Types:\n\n- **Unit Tests** -- test individual methods or classes in isolation, mocking all dependencies. They execute in milliseconds and form the foundation of any test suite.\n- **Integration Tests** -- verify that multiple components work together correctly (e.g., service layer with a real database, REST controller with Spring context).\n- **System / E2E Tests** -- exercise the entire application from the user's perspective, often through a browser or API client.\n- **Acceptance Tests** -- validate business requirements and user stories, typically written in collaboration with stakeholders.\n- **Performance Tests** -- measure throughput, latency, and resource usage under load (tools: JMeter, Gatling).\n- **Security Tests** -- identify vulnerabilities such as SQL injection, XSS, and authentication flaws.\n\n### The Testing Pyramid\n\nThe testing pyramid, introduced by Mike Cohn, is a strategy for balancing test types:\n\n```\n      /  E2E  \\        ← Few, slow, expensive, high confidence\n     / Integr. \\       ← Moderate count\n    /   Unit    \\      ← Many, fast, cheap, pinpoint failures\n```\n\nUnit tests should comprise 70-80% of your suite because they are fast, deterministic, and easy to maintain. Integration tests (15-20%) catch wiring issues between components. E2E tests (5-10%) provide the highest confidence but are slow, brittle, and expensive to maintain.\n\nThe anti-pattern \"ice cream cone\" inverts this pyramid -- heavy reliance on manual and E2E tests with few unit tests -- leading to slow feedback loops and fragile CI pipelines.\n\nIn Java, common frameworks include JUnit 5 for unit/integration tests, Mockito for mocking, Testcontainers for integration tests with real databases, and Selenium/Playwright for E2E browser tests.",
  code: `// Example: Unit test vs Integration test structure
// ─── Unit Test (fast, isolated) ───
@ExtendWith(MockitoExtension.class)
class OrderServiceUnitTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCalculateTotalCorrectly() {
        Order order = new Order(List.of(
            new Item("Book", 15.00),
            new Item("Pen", 2.50)
        ));
        when(orderRepository.findById(1L))
            .thenReturn(Optional.of(order));

        double total = orderService.getTotal(1L);

        assertEquals(17.50, total, 0.01);
        verify(orderRepository).findById(1L);
    }
}

// ─── Integration Test (slower, real context) ───
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnOrderById() throws Exception {
        mockMvc.perform(get("/api/orders/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.total").value(17.50));
    }
}

// ─── E2E Test (slowest, full stack) ───
// Typically uses Selenium, Playwright, or RestAssured
// to hit a running application instance`,
  interviewQs: [
    {
      id: "19-1-q0",
      q: "What is the testing pyramid and why should unit tests form its base?",
      a: "The testing pyramid recommends many unit tests at the base, fewer integration tests in the middle, and minimal E2E tests at the top. Unit tests should dominate because they are fast (milliseconds), cheap to maintain, deterministic, and pinpoint the exact location of failures. This gives developers rapid feedback during development and keeps CI pipelines fast.",
      difficulty: "junior",
    },
    {
      id: "19-1-q1",
      q: "How do you decide whether to write a unit test or an integration test for a service method that calls a database?",
      a: "If you want to test the business logic in isolation, write a unit test and mock the repository. If you want to verify that queries, transactions, and entity mappings work correctly with a real database, write an integration test using @DataJpaTest or Testcontainers. Both are needed: unit tests catch logic bugs fast, integration tests catch wiring and SQL issues.",
      difficulty: "mid",
    },
    {
      id: "19-1-q2",
      q: "What strategies can you use to keep E2E tests reliable and fast in a CI pipeline?",
      a: "Run E2E tests in parallel on isolated environments using Docker Compose or Kubernetes. Use the Page Object pattern to decouple tests from UI details. Implement retry mechanisms for flaky network calls. Prefer API-level E2E over browser-level where possible. Use Testcontainers for database-dependent flows. Tag E2E tests separately and run them on a nightly schedule rather than every commit to avoid blocking the main pipeline.",
      difficulty: "senior",
    },
  ],
  tip: "Follow the testing pyramid: invest most effort in unit tests for fast feedback, use integration tests to catch wiring issues, and reserve E2E tests for critical user journeys only.",
  springConnection: null,
};
