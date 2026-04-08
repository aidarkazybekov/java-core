import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "22-2",
  blockId: 22,
  title: "Servlets & JSP",
  summary:
    "A Servlet is a Java class that handles HTTP requests within a web container (Tomcat, Jetty). The servlet lifecycle involves init(), service() (doGet/doPost), and destroy(). Spring MVC's DispatcherServlet is the central servlet that routes all requests to controllers.",
  deepDive:
    "## Servlet API\n\nServlet API -- базовая спецификация Java EE для обработки HTTP-запросов и ответов. В основе Spring MVC лежит Servlet API: основной компонент **DispatcherServlet** наследует HttpServlet.\n\n### Жизненный цикл сервлета:\n\n1. **Загрузка и инстанцирование** -- контейнер (Tomcat) создаёт экземпляр сервлета\n2. **init()** -- инициализация, вызывается один раз при первом запросе (или при старте, если load-on-startup)\n3. **service()** -- обработка каждого запроса (делегирует в doGet(), doPost(), doPut(), doDelete())\n4. **destroy()** -- освобождение ресурсов при остановке контейнера\n\n### Ключевые объекты:\n\n- **HttpServletRequest** -- содержит данные запроса (параметры, заголовки, cookies, тело)\n- **HttpServletResponse** -- формирует ответ (статус код, заголовки, тело)\n- **HttpSession** -- хранение данных между запросами пользователя\n- **ServletContext** -- общий контекст приложения, доступный всем сервлетам\n- **Filter** -- перехватывает запросы/ответы для предобработки (авторизация, логирование)\n\n### JSP (JavaServer Pages):\n\nТехнология для создания динамических HTML-страниц. JSP-файлы компилируются в сервлеты контейнером. Современные приложения чаще используют Thymeleaf или фронтенд-фреймворки (React, Angular) вместо JSP.\n\n---\n\n## Servlet API\n\nThe Servlet API is the foundational Java EE specification for handling HTTP requests. A servlet is a Java class managed by a web container (Tomcat, Jetty, Undertow) that processes incoming requests and generates responses.\n\n### Servlet Lifecycle:\n\n1. **Loading** -- The container loads the servlet class (lazily on first request, or eagerly with `load-on-startup`)\n2. **init(ServletConfig)** -- Called once to initialize the servlet. Resources like DB connections are set up here.\n3. **service(request, response)** -- Called for every request. HttpServlet dispatches to doGet(), doPost(), doPut(), doDelete() based on HTTP method.\n4. **destroy()** -- Called once when the container shuts down or the servlet is unloaded. Used to release resources.\n\nServlets are **singletons** by default -- one instance handles all requests via multiple threads. This means servlet fields must be thread-safe or avoided.\n\n### Key Components:\n\n- **HttpServletRequest** -- access to request parameters, headers, cookies, session, body (InputStream)\n- **HttpServletResponse** -- set status code, headers, write response body (OutputStream / Writer)\n- **HttpSession** -- server-side session storage tied to a client via JSESSIONID cookie\n- **ServletContext** -- application-wide shared state, accessible by all servlets\n- **Filter** -- intercepts requests/responses in a chain (used for auth, logging, CORS, compression)\n- **Listener** -- reacts to lifecycle events (session creation, context initialization)\n\n### Spring MVC and Servlets:\n\nSpring MVC is built entirely on the Servlet API:\n- **DispatcherServlet** extends HttpServlet and acts as the front controller\n- It receives all requests and delegates to appropriate @Controller methods\n- Spring Boot embeds Tomcat/Jetty/Undertow, so you rarely configure servlets directly\n- Spring Security uses servlet Filters (FilterChainProxy) for authentication/authorization\n\n### JSP vs Modern Alternatives:\n\nJSP (JavaServer Pages) allows embedding Java code in HTML templates. While historically important, JSP is largely replaced by:\n- **Thymeleaf** -- Spring's preferred template engine (natural templates)\n- **Frontend frameworks** -- React, Angular, Vue with REST APIs\n- **Server-side rendering** -- limited use cases, mostly legacy",
  code: `// ─── Basic Servlet Example ───
@WebServlet(name = "UserServlet", urlPatterns = "/api/user")
public class UserServlet extends HttpServlet {

    private UserService userService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        // Initialize resources (called once)
        userService = new UserService();
    }

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp) throws IOException {
        String id = req.getParameter("id");
        User user = userService.findById(Long.parseLong(id));

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(toJson(user));
    }

    @Override
    protected void doPost(HttpServletRequest req,
                          HttpServletResponse resp) throws IOException {
        // Read request body
        BufferedReader reader = req.getReader();
        User user = fromJson(reader, User.class);

        userService.save(user);

        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().write("User created");
    }

    @Override
    public void destroy() {
        // Release resources (called once on shutdown)
        userService.close();
    }
}

// ─── Servlet Filter (cross-cutting concerns) ───
@WebFilter("/*")
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        long start = System.currentTimeMillis();

        chain.doFilter(request, response); // Pass to next filter/servlet

        long duration = System.currentTimeMillis() - start;
        System.out.printf("%s %s — %dms%n",
            req.getMethod(), req.getRequestURI(), duration);
    }
}

// ─── Spring MVC equivalent (much simpler) ───
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public User getUser(@RequestParam Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String createUser(@RequestBody User user) {
        userService.save(user);
        return "User created";
    }
}`,
  interviewQs: [
    {
      id: "22-2-q0",
      q: "Describe the lifecycle of a Java Servlet.",
      a: "1) The container loads the servlet class and creates an instance. 2) init(ServletConfig) is called once for initialization (setup resources). 3) For each request, service() is called, which delegates to doGet(), doPost(), etc. based on the HTTP method. 4) destroy() is called once when the container shuts down, for cleanup. Servlets are singletons -- one instance serves all requests concurrently, so instance variables must be thread-safe.",
      difficulty: "junior",
    },
    {
      id: "22-2-q1",
      q: "How does Spring MVC's DispatcherServlet relate to the Servlet API?",
      a: "DispatcherServlet extends HttpServlet (from the Servlet API) and acts as the front controller for all Spring MVC requests. When a request arrives, DispatcherServlet's service() method is invoked by the container. It then uses HandlerMapping to find the right @Controller method, calls the handler, and uses ViewResolver to render the response. Spring Boot auto-configures DispatcherServlet mapped to '/' on an embedded Tomcat/Jetty, abstracting away all servlet XML configuration.",
      difficulty: "mid",
    },
    {
      id: "22-2-q2",
      q: "Why are servlets singletons, and what thread-safety issues does this create?",
      a: "The container creates one servlet instance to handle all requests (for efficiency -- no per-request object creation). Each request runs in its own thread, but all threads share the same servlet instance. This means: (1) Instance variables are shared across threads and must be thread-safe. (2) Avoid mutable shared state in servlet fields; use local variables instead. (3) HttpServletRequest and HttpServletResponse are per-thread, so they are safe. (4) HttpSession is shared across requests from the same client and may be accessed concurrently. Spring MVC avoids these issues because @Controller beans are typically stateless, with request data passed as method parameters.",
      difficulty: "senior",
    },
  ],
  tip: "Even when using Spring MVC, understanding the Servlet API helps with debugging -- you can see how request/response objects flow through filters and the DispatcherServlet in stack traces.",
  springConnection: null,
};
