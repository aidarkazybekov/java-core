import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "13-1",
  blockId: 13,
  title: "Request Lifecycle",
  summary:
    "Жизненный цикл запроса в Spring MVC: запрос поступает к DispatcherServlet, HandlerMapping находит контроллер, HandlerAdapter вызывает метод, контроллер выполняет бизнес-логику, ответ формируется и отправляется клиенту.\n\n---\n\nSpring MVC request lifecycle: request hits DispatcherServlet, HandlerMapping locates the controller, HandlerAdapter invokes the method, the controller executes business logic, the response is formed and sent to the client.",
  deepDive:
    "## Жизненный цикл запроса в Spring MVC\n\nSpring MVC -- это модуль Spring Framework для построения веб-приложений на основе модели MVC (Model-View-Controller):\n- **Model** -- хранит данные и бизнес-логику\n- **View** -- отвечает за отображение данных\n- **Controller** -- обрабатывает пользовательские запросы\n\nЭтапы обработки запроса:\n\n1. **Поступление запроса к DispatcherServlet** -- главный контроллер (front controller), который обрабатывает все входящие HTTP-запросы\n2. **Поиск контроллера (HandlerMapping)** -- DispatcherServlet обращается к HandlerMapping для определения контроллера. HandlerMapping возвращает объект, включающий контроллер и метод для вызова\n3. **Вызов обработчика через HandlerAdapter** -- адаптирует запрос к API контроллера\n4. **Выполнение бизнес-логики в контроллере**\n5. **Формирование ответа** -- ответ контроллера преобразуется в JSON или другой формат\n6. **Обработка исключений** -- @ExceptionHandler или @ControllerAdvice перехватывают ошибки\n7. **Отправка ответа клиенту**\n8. **Интерцепторы** -- на различных этапах могут предварительно или послеобрабатывать запросы\n\n---\n\nThe DispatcherServlet is the front controller of Spring MVC, receiving every HTTP request and orchestrating the entire processing pipeline:\n\n**Step 1 -- DispatcherServlet receives the request**: As a servlet, it's mapped to `/` or `/*` and intercepts all incoming requests.\n\n**Step 2 -- HandlerMapping resolution**: DispatcherServlet consults HandlerMapping implementations to find which controller method handles the URL. `RequestMappingHandlerMapping` processes @RequestMapping annotations. It returns a HandlerExecutionChain containing the handler and any interceptors.\n\n**Step 3 -- Interceptor preHandle**: Any registered HandlerInterceptor.preHandle() methods run. If any returns false, processing stops.\n\n**Step 4 -- HandlerAdapter invocation**: The adapter (typically RequestMappingHandlerAdapter) resolves method arguments (@RequestParam, @PathVariable, @RequestBody via HttpMessageConverters), invokes the controller method, and processes the return value.\n\n**Step 5 -- Controller execution**: Your business logic runs. The method returns a response object, ResponseEntity, or view name.\n\n**Step 6 -- Response processing**: For @RestController, the return value is converted to JSON/XML via HttpMessageConverter (Jackson by default). For @Controller, ViewResolver finds and renders the view.\n\n**Step 7 -- Exception handling**: If an exception occurs, @ExceptionHandler methods (local or @ControllerAdvice global) handle it and produce an error response.\n\n**Step 8 -- Interceptor postHandle/afterCompletion**: Post-processing runs after the handler, and afterCompletion runs regardless of exceptions.\n\n**Step 9 -- Response sent to client**: The servlet container sends the HTTP response back.",
  code: `// DispatcherServlet flow illustrated through code

// Controller handling the request
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Step 2: HandlerMapping matches GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id) {
        // Step 4-5: Business logic executes
        OrderDto order = orderService.findById(id);
        // Step 6: Jackson converts OrderDto to JSON
        return ResponseEntity.ok(order);
    }

    // Step 7: Exception handler for this controller
    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            OrderNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }
}

// Global exception handler via @ControllerAdvice
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e ->
            errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}

// Custom interceptor (Step 3 & 8)
@Component
public class RequestTimingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) {
        request.setAttribute("startTime", System.currentTimeMillis());
        return true; // continue processing
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
            HttpServletResponse response, Object handler, Exception ex) {
        long start = (Long) request.getAttribute("startTime");
        long duration = System.currentTimeMillis() - start;
        System.out.printf("%s %s took %dms%n",
            request.getMethod(), request.getRequestURI(), duration);
    }
}`,
  interviewQs: [
    {
      id: "13-1-q0",
      q: "Describe the request lifecycle in Spring MVC. What is the role of DispatcherServlet?",
      a: "DispatcherServlet is the front controller that receives all HTTP requests. It consults HandlerMapping to find the target controller, uses HandlerAdapter to invoke the method, processes the response (JSON conversion or view rendering), handles exceptions via @ExceptionHandler/@ControllerAdvice, and runs interceptors at pre/post stages. It coordinates the entire MVC pipeline.",
      difficulty: "junior",
    },
    {
      id: "13-1-q1",
      q: "What is the difference between HandlerInterceptor and a Servlet Filter? When would you use each?",
      a: "Servlet Filters operate at the servlet container level, before DispatcherServlet, and work with raw request/response objects. HandlerInterceptors operate within Spring MVC, after DispatcherServlet, with access to the handler method and Spring context. Use Filters for cross-cutting concerns like encoding, CORS, security (Spring Security uses filters). Use Interceptors for MVC-specific logic like logging handler execution time, permission checks that need handler metadata, or modifying ModelAndView.",
      difficulty: "mid",
    },
    {
      id: "13-1-q2",
      q: "How does Spring MVC resolve controller method arguments? Explain the role of HandlerMethodArgumentResolver.",
      a: "RequestMappingHandlerAdapter maintains a list of HandlerMethodArgumentResolvers. For each method parameter, it iterates the resolvers calling supportsParameter(). The matching resolver extracts the value: RequestParamMethodArgumentResolver handles @RequestParam, PathVariableMethodArgumentResolver handles @PathVariable, RequestResponseBodyMethodProcessor handles @RequestBody (delegating to HttpMessageConverter for deserialization). Custom resolvers can be registered for domain-specific parameter types. The resolution order matters -- first matching resolver wins.",
      difficulty: "senior",
    },
  ],
  tip: "Use `@RestControllerAdvice` for global exception handling across all controllers -- it keeps error handling logic centralized and consistent.\n\n---\n\nИспользуйте `@RestControllerAdvice` для глобальной обработки исключений во всех контроллерах -- это централизует и унифицирует обработку ошибок.",
  springConnection: null,
};
