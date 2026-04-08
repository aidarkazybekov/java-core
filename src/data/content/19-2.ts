import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "19-2",
  blockId: 19,
  title: "TDD & BDD",
  summary:
    "TDD (Test-Driven Development) follows the Red-Green-Refactor cycle: write a failing test first, make it pass with minimal code, then refactor. BDD (Behavior-Driven Development) extends TDD with Given-When-Then scenarios written in natural language.",
  deepDive:
    "## Циклы разработки\n\n### Классический (Git Flow)\n\n1. Пишем код\n2. ~~Пишем тесты~~ (часто пропускают)\n3. Коммит\n4. CI\n5. Ревью\n6. QA\n7. Релиз\n8. Проверка релиза\n9. В продакшен\n\n### TBD (Trunk Based Development)\n\n1. Пишем код\n2. Пишем тесты\n3. Коммит\n4. CI\n5. Ревью\n6. Продакшен (feature off)\n7. QA\n8. Feature on\n\n### TDD (Test-Driven Development)\n\nЦикл Red-Green-Refactor:\n\n1. **Red** -- пишем тест, который не проходит (тест описывает желаемое поведение)\n2. **Green** -- пишем минимальный код, чтобы тест прошёл\n3. **Refactor** -- улучшаем код, не меняя поведения\n\nПовторяем цикл для каждого нового требования.\n\n### BDD (Behavior-Driven Development)\n\nРасширяет TDD, фокусируясь на поведении системы с точки зрения бизнеса:\n\n- **Given** -- начальное состояние (контекст)\n- **When** -- действие пользователя\n- **Then** -- ожидаемый результат\n\nИнструменты: Cucumber, JBehave, Spock.\n\n---\n\n## TDD & BDD\n\n### Development Cycles\n\n**Classic (Git Flow):** Write code -> Write tests (often skipped) -> Commit -> CI -> Code review -> QA -> Release -> Verify -> Production.\n\n**Trunk Based Development (TBD):** Write code -> Write tests -> Commit -> CI -> Review -> Deploy to production (feature off) -> QA -> Feature on. Features are hidden behind feature flags until validated.\n\n### TDD -- Test-Driven Development\n\nTDD follows the Red-Green-Refactor cycle:\n\n1. **Red** -- Write a failing test that describes the desired behavior. The test must fail (compile error counts as failure).\n2. **Green** -- Write the minimum code necessary to make the test pass. Do not over-engineer.\n3. **Refactor** -- Improve code structure, remove duplication, rename, extract methods -- all while keeping tests green.\n\nBenefits of TDD:\n- Forces you to think about the API before implementation\n- Produces high test coverage naturally\n- Catches regressions immediately\n- Results in smaller, more focused methods\n\n### BDD -- Behavior-Driven Development\n\nBDD extends TDD by writing tests in natural language that stakeholders can understand:\n\n- **Given** -- the initial context or precondition\n- **When** -- an action or event occurs\n- **Then** -- the expected outcome\n\nBDD scenarios are typically written in Gherkin syntax (`.feature` files) and executed with frameworks like Cucumber. Each step maps to a Java method (step definition) that performs the actual test logic.\n\nBDD bridges the gap between developers, QA, and business stakeholders by using a shared language (ubiquitous language from DDD). It ensures that tests reflect actual business requirements rather than implementation details.",
  code: `// ─── TDD Example: Red-Green-Refactor ───

// Step 1: RED — Write a failing test
@Test
void shouldReturnDiscountedPrice() {
    PriceCalculator calc = new PriceCalculator();
    // 20% discount on 100.0 = 80.0
    assertEquals(80.0, calc.applyDiscount(100.0, 20), 0.01);
}
// Compilation fails — PriceCalculator doesn't exist yet!

// Step 2: GREEN — Minimal implementation
public class PriceCalculator {
    public double applyDiscount(double price, int percent) {
        return price * (100 - percent) / 100.0;
    }
}
// Test passes! ✓

// Step 3: REFACTOR — Improve (add validation)
public class PriceCalculator {
    public double applyDiscount(double price, int percent) {
        if (price < 0) throw new IllegalArgumentException("Negative price");
        if (percent < 0 || percent > 100)
            throw new IllegalArgumentException("Invalid discount");
        return price * (100 - percent) / 100.0;
    }
}
// All tests still pass! ✓

// ─── BDD Example: Cucumber / Gherkin ───

// file: discount.feature
// Feature: Price discount
//   Scenario: Apply percentage discount
//     Given a product with price 100.0
//     When I apply a 20% discount
//     Then the final price should be 80.0

// Step definitions (Java):
public class DiscountSteps {
    private PriceCalculator calculator = new PriceCalculator();
    private double price;
    private double result;

    @Given("a product with price {double}")
    public void setPrice(double price) {
        this.price = price;
    }

    @When("I apply a {int}% discount")
    public void applyDiscount(int percent) {
        result = calculator.applyDiscount(price, percent);
    }

    @Then("the final price should be {double}")
    public void verifyPrice(double expected) {
        assertEquals(expected, result, 0.01);
    }
}`,
  interviewQs: [
    {
      id: "19-2-q0",
      q: "Explain the Red-Green-Refactor cycle in TDD.",
      a: "Red: write a test that fails because the feature doesn't exist yet. Green: write the minimum code to make the test pass. Refactor: clean up the code (remove duplication, improve names, extract methods) while keeping all tests green. This cycle repeats for each new piece of functionality, ensuring high test coverage and incremental design.",
      difficulty: "junior",
    },
    {
      id: "19-2-q1",
      q: "How does BDD differ from TDD, and what tools support BDD in Java?",
      a: "TDD focuses on testing implementation from the developer's perspective, while BDD focuses on testing behavior from the business perspective using Given-When-Then scenarios written in natural language (Gherkin syntax). BDD scenarios are readable by non-technical stakeholders. Java tools include Cucumber-JVM (most popular), JBehave, and Spock (Groovy-based). Cucumber maps Gherkin steps to Java step definition methods.",
      difficulty: "mid",
    },
    {
      id: "19-2-q2",
      q: "What are common pitfalls of TDD and how do you avoid them?",
      a: "Common pitfalls: (1) Writing tests that are too tightly coupled to implementation, making refactoring painful -- fix by testing behavior, not internals. (2) Skipping the refactor step, leading to test duplication -- discipline the cycle. (3) Testing trivial getters/setters with no logic -- focus on meaningful business behavior. (4) Slow tests from not mocking dependencies -- keep unit tests isolated and fast. (5) Over-mocking leading to tests that pass but the system fails -- balance with integration tests.",
      difficulty: "senior",
    },
  ],
  tip: "In TDD, resist the urge to write more code than the failing test requires. The discipline of minimal implementation forces better design through small, composable methods.",
  springConnection: null,
};
