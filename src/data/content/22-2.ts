import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-2",
  blockId: 22,
  title: "Servlets & JSP",
  summary:
    "Servlet -- Java-класс для обработки HTTP-запросов/ответов, наследующий HttpServlet. Жизненный цикл: init(), service()/doGet()/doPost(), destroy(). JSP (JavaServer Pages) -- технология для создания динамических HTML-страниц. Spring MVC построен поверх Servlet API.\n\n---\n\nA Servlet is a Java class for handling HTTP requests/responses, extending HttpServlet. Lifecycle: init(), service()/doGet()/doPost(), destroy(). JSP (JavaServer Pages) creates dynamic HTML pages. Spring MVC is built on top of the Servlet API.",
  deepDive:
    "## Servlet\n\n" +
    "Servlet -- это Java-класс, предназначенный для обработки HTTP-запросов и формирования ответов. Базовая спецификация для веб-приложений на Java.\n\n" +
    "**Жизненный цикл Servlet:**\n" +
    "1. **Загрузка класса** -- при первом запросе или при старте контейнера\n" +
    "2. **init()** -- инициализация, вызывается один раз\n" +
    "3. **service()** -- обработка каждого запроса (делегирует в doGet, doPost и т.д.)\n" +
    "4. **destroy()** -- освобождение ресурсов при завершении\n\n" +
    "**JSP** -- шаблонная технология для генерации HTML с вставками Java-кода. Компилируется в Servlet.\n\n---\n\n" +
    "## Servlet API Deep Dive\n\n" +
    "A **Servlet** runs inside a **Servlet Container** (Tomcat, Jetty, Undertow). The container manages the servlet lifecycle, thread pool, and request dispatching.\n\n" +
    "**HttpServlet methods:**\n" +
    "- `doGet()` -- handles GET requests\n" +
    "- `doPost()` -- handles POST requests\n" +
    "- `doPut()`, `doDelete()`, `doPatch()`\n\n" +
    "**Key objects:**\n" +
    "- `HttpServletRequest` -- request parameters, headers, body, session, cookies\n" +
    "- `HttpServletResponse` -- status code, headers, output stream/writer\n" +
    "- `HttpSession` -- server-side session storage\n" +
    "- `ServletContext` -- application-scoped shared state\n\n" +
    "**Filters:** Intercept requests before/after the servlet. Used for authentication, logging, CORS. Spring Security is implemented as a chain of Servlet Filters.\n\n" +
    "**JSP (JavaServer Pages):** Allows mixing HTML with Java code. Under the hood, JSP is compiled into a Servlet by the container. Modern Spring apps use Thymeleaf or return JSON instead of JSP.\n\n" +
    "**Spring MVC and Servlets:** Spring's DispatcherServlet extends HttpServlet and acts as a front controller -- all requests go through it, then are routed to @Controller methods via HandlerMapping.",
  code: `// ===== Basic Servlet (without Spring) =====
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

    @Override
    public void init() throws ServletException {
        // Called once when servlet is loaded
        log("HelloServlet initialized");
    }

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp)
            throws ServletException, IOException {

        String name = req.getParameter("name");

        resp.setContentType("text/html");
        resp.setStatus(HttpServletResponse.SC_OK);
        PrintWriter out = resp.getWriter();
        out.println("<h1>Hello, " + (name != null ? name : "World") + "</h1>");
    }

    @Override
    protected void doPost(HttpServletRequest req,
                          HttpServletResponse resp)
            throws ServletException, IOException {

        String body = req.getReader().lines()
            .collect(Collectors.joining());

        resp.setContentType("application/json");
        resp.getWriter().write("{\\"received\\": true}");
    }

    @Override
    public void destroy() {
        // Called when servlet is unloaded
        log("HelloServlet destroyed");
    }
}

// ===== Servlet Filter =====
@WebFilter("/*")
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp,
                         FilterChain chain)
            throws IOException, ServletException {
        long start = System.currentTimeMillis();
        chain.doFilter(req, resp);  // pass to next filter/servlet
        long elapsed = System.currentTimeMillis() - start;
        log.info("{} {} took {}ms",
            ((HttpServletRequest) req).getMethod(),
            ((HttpServletRequest) req).getRequestURI(),
            elapsed);
    }
}

// ===== Spring's DispatcherServlet (extends HttpServlet) =====
// Auto-configured by Spring Boot
// All requests -> DispatcherServlet -> HandlerMapping
//   -> Controller -> ViewResolver / ResponseBody`,
  interviewQs: [
    {
      id: "22-2-q0",
      q: "What is a Servlet? Describe its lifecycle.",
      a: "A Servlet is a Java class that handles HTTP requests, extending HttpServlet. Lifecycle: (1) Container loads the class and calls init() once; (2) For each request, service() is called, which delegates to doGet(), doPost(), etc.; (3) When unloading, destroy() is called for cleanup. Servlets are managed by a Servlet Container (Tomcat, Jetty).",
      difficulty: "junior",
    },
    {
      id: "22-2-q1",
      q: "How does Spring MVC relate to the Servlet API? What is DispatcherServlet?",
      a: "Spring MVC is built on top of the Servlet API. DispatcherServlet extends HttpServlet and acts as a front controller. All HTTP requests are routed through DispatcherServlet, which uses HandlerMapping to find the right @Controller method, HandlerAdapter to invoke it, and ViewResolver (or HttpMessageConverter for REST) to render the response. Spring Security is also implemented as Servlet Filters in the filter chain.",
      difficulty: "mid",
    },
    {
      id: "22-2-q2",
      q: "What are Servlet Filters? How does Spring Security use them?",
      a: "Servlet Filters intercept requests before they reach the servlet and responses before they return to the client. They form a FilterChain -- each filter calls chain.doFilter() to pass to the next. Spring Security registers a DelegatingFilterProxy that delegates to its own FilterChainProxy containing a SecurityFilterChain with 15+ filters: CorsFilter, CsrfFilter, AuthenticationFilter, AuthorizationFilter, etc. Each handles a specific security concern. This architecture allows adding/removing security features by modifying the filter chain configuration.",
      difficulty: "senior",
    },
  ],
  tip: "Spring MVC -- это надстройка над Servlet API. Понимание сервлетов помогает отлаживать Spring MVC.\n\n---\n\nSpring MVC is built on top of the Servlet API. Understanding servlets helps debug Spring MVC issues.",
  springConnection: null,
};
