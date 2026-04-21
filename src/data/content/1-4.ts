import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-4",
  blockId: 1,
  title: "ClassLoaders & Delegation",
  summary:
    "ClassLoader -- подсистема JVM, отвечающая за загрузку .class файлов. Загрузчики классов следуют модели делегирования родителю (parent-delegation), гарантируя, что базовые классы Java загружаются доверенными загрузчиками. Понимание ClassLoader объясняет разницу между ClassNotFoundException и NoClassDefFoundError.\n\n---\n\n" +
    "ClassLoaders are responsible for finding and loading .class files into the JVM. They follow a parent-delegation model that ensures core Java classes are loaded by trusted loaders first. Understanding classloaders explains why you get ClassNotFoundException vs NoClassDefFoundError, and why app servers and module systems work the way they do.",
  deepDive:
    "## Три встроенных загрузчика (Java 9+)\n\n" +
    "- **Bootstrap** — загружает модули `java.base` и другие базовые. Написан на нативном коде. `String.class.getClassLoader()` возвращает `null` — это не баг, у Bootstrap нет Java-представления.\n" +
    "- **Platform** (раньше назывался Extension) — загружает модули платформы.\n" +
    "- **Application** — загружает классы из classpath, то есть ваш код и зависимости.\n\n" +
    "## Parent-delegation model\n\n" +
    "Ключевая концепция. Когда классу нужно что-то загрузить, он **сначала делегирует родителю**. Только если родитель не нашёл — ребёнок пытается сам.\n\n" +
    "Цепочка: `Application → Platform → Bootstrap`. Если никто не нашёл — `ClassNotFoundException`.\n\n" +
    "> [!info]\n" +
    "> Зачем так? Это гарантирует, что `java.lang.Object` и другие базовые классы всегда загружаются доверенным Bootstrap-загрузчиком — никакой пользовательский код не сможет подменить `java.lang.String`.\n\n" +
    "## ClassNotFoundException vs NoClassDefFoundError\n\n" +
    "Классический вопрос на интервью.\n\n" +
    "- **`ClassNotFoundException`** (checked) — вы явно попытались загрузить класс по имени (`Class.forName(...)`, `ClassLoader.loadClass(...)`) и он не найден. JVM никогда про него не слышала.\n" +
    "- **`NoClassDefFoundError`** (Error) — JVM знала про класс во время компиляции, но не может загрузить его во время исполнения. Обычно: зависимость отсутствует в classpath, либо статический инициализатор класса упал с исключением.\n\n" +
    "Коротко: **CNFE = «никогда не знал», NCDFE = «знал, но сейчас не могу загрузить»**.\n\n" +
    "## Кастомные загрузчики и app-серверы\n\n" +
    "Tomcat, WildFly, OSGi, фреймворки с hot-reload используют кастомные загрузчики. Каждое веб-приложение в Tomcat имеет свой `WebappClassLoader`, так что два приложения могут использовать разные версии одной библиотеки.\n\n" +
    "Tomcat **инвертирует** модель делегирования для веб-приложений (`child-first` / `parent-last`): сначала проверяется локальный classloader, и только потом родитель. Иначе все приложения были бы вынуждены использовать одну версию библиотеки из common classpath.\n\n" +
    "## Classloader leaks\n\n" +
    "> [!production]\n" +
    "> Утечки classloader'ов — серьёзная проблема. Если на classloader остаётся ссылка, GC не может его убрать, и **все** классы со своей статикой остаются в Metaspace. Типичные виновники при hot-redeploy: `ThreadLocal`, незарегистрированные JDBC-драйверы, shutdown hooks, статические поля, ссылающиеся на классы приложения. Результат — постепенный рост Metaspace и `OutOfMemoryError: Metaspace` после N передеплоев.\n\n---\n\n" +
    "## Three built-in loaders (Java 9+)\n\n" +
    "- **Bootstrap** — loads `java.base` and other core modules. Written in native code. `String.class.getClassLoader()` returns `null` — this isn't a bug, Bootstrap has no Java representation.\n" +
    "- **Platform** (formerly Extension) — loads platform modules.\n" +
    "- **Application** — loads classes from the classpath, i.e. your code and dependencies.\n\n" +
    "## Parent-delegation model\n\n" +
    "The central concept. When asked to load a class, a classloader **first delegates to its parent**. Only if the parent can't find it does the child try to load it itself.\n\n" +
    "Chain: `Application → Platform → Bootstrap`. If none of them find it → `ClassNotFoundException`.\n\n" +
    "> [!info]\n" +
    "> Why? It guarantees that `java.lang.Object` and other core classes are always loaded by the trusted Bootstrap loader — no user code can substitute a fake `java.lang.String`.\n\n" +
    "## ClassNotFoundException vs NoClassDefFoundError\n\n" +
    "A classic interview question.\n\n" +
    "- **`ClassNotFoundException`** (checked) — you explicitly tried to load a class by name (`Class.forName(...)`, `ClassLoader.loadClass(...)`) and it wasn't found. The JVM never heard of it.\n" +
    "- **`NoClassDefFoundError`** (Error) — the JVM knew about the class at compile time but can't load it at runtime. Usually: the dependency JAR is missing from classpath, or the class's static initialiser threw an exception.\n\n" +
    "Short form: **CNFE = \"never heard of it\", NCDFE = \"knew it but can't load it now\"**.\n\n" +
    "## Custom loaders and app servers\n\n" +
    "Tomcat, WildFly, OSGi, hot-reload frameworks all use custom classloaders. Each web app in Tomcat gets its own `WebappClassLoader`, so two apps can depend on different versions of the same library.\n\n" +
    "Tomcat **inverts** the delegation model for web apps (`child-first` / `parent-last`): the local classloader is checked first, then the parent. Without this, all apps would have to share a single library version from the common classpath.\n\n" +
    "## Classloader leaks\n\n" +
    "> [!production]\n" +
    "> Classloader leaks are a serious production issue. If something still references a classloader, GC can't collect it, and **every** class (with its static state) it loaded stays in Metaspace. Common culprits during hot-redeploy: `ThreadLocal`, un-deregistered JDBC drivers, shutdown hooks, static fields pointing to app classes. Result: Metaspace creeps up and eventually `OutOfMemoryError: Metaspace` after N redeploys.",
  code:
    `// Demonstrating classloader hierarchy and delegation
public class ClassLoaderDemo {
    public static void main(String[] args) throws Exception {
        // 1. Built-in classloader hierarchy
        ClassLoader appLoader = ClassLoaderDemo.class.getClassLoader();
        ClassLoader platformLoader = appLoader.getParent();
        ClassLoader bootstrapLoader = platformLoader.getParent(); // null!

        System.out.println("=== ClassLoader Hierarchy ===");
        System.out.println("App class loaded by:      " + appLoader);
        System.out.println("Parent (Platform):        " + platformLoader);
        System.out.println("Grandparent (Bootstrap):  " + bootstrapLoader); // null

        // Bootstrap loader returns null — it's native code
        System.out.println("\\nString loaded by: " +
            String.class.getClassLoader()); // null = Bootstrap

        // 2. ClassNotFoundException vs NoClassDefFoundError
        System.out.println("\\n=== Exception vs Error ===");

        // ClassNotFoundException — explicit load attempt fails
        try {
            Class.forName("com.nonexistent.FakeClass");
        } catch (ClassNotFoundException e) {
            System.out.println("ClassNotFoundException: " + e.getMessage());
        }

        // NoClassDefFoundError — class was known at compile time but
        // its dependency is missing at runtime (simulated here)
        try {
            triggerNoClassDefFound();
        } catch (NoClassDefFoundError e) {
            System.out.println("NoClassDefFoundError: " + e.getMessage());
        }

        // 3. Same class loaded by different classloaders = different Class objects
        System.out.println("\\n=== Class Identity ===");
        ClassLoader loader1 = new java.net.URLClassLoader(
            new java.net.URL[]{new java.io.File(".").toURI().toURL()},
            null // parent = null, bypasses delegation
        );
        ClassLoader loader2 = new java.net.URLClassLoader(
            new java.net.URL[]{new java.io.File(".").toURI().toURL()},
            null
        );

        // If ClassLoaderDemo.class is on disk, these are DIFFERENT classes
        // even though they have the same name!
        // This is why app servers isolate web applications.
        System.out.println("A class's identity = fully qualified name + classloader");
        System.out.println("Two classes with same name from different loaders are NOT equal");
    }

    // In real code, this would fail if a compile-time dependency JAR is missing
    private static void triggerNoClassDefFound() {
        // This would throw NoClassDefFoundError if HelperClass.class
        // existed at compile time but is missing from classpath at runtime
        // For demo, we simulate via a static init failure:
        try {
            Class.forName("ClassLoaderDemo$FailingInit");
        } catch (Exception e) { /* first attempt */ }

        // Second attempt to use a class whose static init failed
        // would produce NoClassDefFoundError in real scenarios
    }

    static class FailingInit {
        static {
            if (true) throw new RuntimeException("Static init failed!");
        }
    }
}`,
  interviewQs: [
    {
      id: "1-4-q0",
      q:
        "Что такое parent-delegation model в загрузке классов?\n\n---\n\n" +
        "What is the parent-delegation model in classloading?",
      a:
        "Когда classloader получает запрос на загрузку класса, он сначала делегирует родителю, и только если родитель не нашёл — пытается загрузить сам. Цепочка: `Application → Platform → Bootstrap`. Если Bootstrap не нашёл — пробует Platform, потом Application. Если все трое не нашли — `ClassNotFoundException`.\n\n" +
        "Это гарантирует, что базовые Java-классы (`java.lang.*` и т.д.) всегда загружаются доверенным Bootstrap-загрузчиком. Недоверенный код не может подменить их. Также это предотвращает многократную загрузку одного класса разными загрузчиками.\n\n---\n\n" +
        "When a classloader receives a request to load a class, it first delegates to its parent; only if the parent can't find it does it try itself. The chain goes `Application → Platform → Bootstrap`. If Bootstrap can't find it, Platform tries, then Application. If all three fail → `ClassNotFoundException`.\n\n" +
        "This guarantees that core Java classes (`java.lang.*`, etc.) are always loaded by the trusted Bootstrap loader — untrusted code can't substitute them. It also prevents the same class from being loaded multiple times across different loaders.",
      difficulty: "junior",
    },
    {
      id: "1-4-q1",
      q:
        "В чём разница между `ClassNotFoundException` и `NoClassDefFoundError`?\n\n---\n\n" +
        "What is the difference between `ClassNotFoundException` and `NoClassDefFoundError`?",
      a:
        "- **`ClassNotFoundException`** — checked-исключение, возникает при явной попытке загрузить класс по имени: `Class.forName(\"com.example.Missing\")` или `ClassLoader.loadClass(...)`. JVM **никогда не знала** про этот класс.\n" +
        "- **`NoClassDefFoundError`** — unchecked Error, возникает когда JVM пытается использовать класс, который **был известен во время компиляции**, но недоступен в рантайме. Частые причины: зависимость-JAR убрали из classpath; статический инициализатор класса выбросил исключение (класс помечается как permanently unloadable).\n\n" +
        "Коротко: **CNFE = «никогда не слышал», NCDFE = «знал, но сейчас загрузить не могу»**.\n\n---\n\n" +
        "- **`ClassNotFoundException`** — a checked exception thrown when an explicit load attempt fails: `Class.forName(\"com.example.Missing\")` or `ClassLoader.loadClass(...)`. The JVM **never heard of** the class.\n" +
        "- **`NoClassDefFoundError`** — an unchecked Error thrown when the JVM tries to use a class that **was known at compile time** but isn't available at runtime. Common causes: a dependency JAR was dropped from the classpath; the class's static initialiser threw an exception (the class is then flagged permanently unloadable).\n\n" +
        "Short form: **CNFE = \"never heard of it\", NCDFE = \"knew it, can't load it now\"**.",
      difficulty: "mid",
    },
    {
      id: "1-4-q2",
      q:
        "Как app-серверы типа Tomcat работают с classloader'ами по-другому, какие проблемы это решает и какие создаёт?\n\n---\n\n" +
        "How do application servers like Tomcat handle classloading differently, and what problems does this solve and create?",
      a:
        "Tomcat использует **child-first** (инвертированное делегирование) для веб-приложений. У каждого приложения свой `WebappClassLoader`, который сначала проверяет локально (`WEB-INF/classes`, `WEB-INF/lib`), и только потом делегирует родителю.\n\n" +
        "Это решает проблему: два веб-приложения могут использовать разные версии одной библиотеки (например, одно — Guava 30, другое — Guava 31). Без этого все приложения делили бы общую версию из common classloader.\n\n" +
        "Проблема, которую это создаёт — **classloader leaks**. Если при передеплое что-то удерживает ссылку на `WebappClassLoader` (ThreadLocal'ы, `DriverManager.registerDriver(...)` без deregister, shutdown hooks, статические поля со ссылками на классы приложения), все классы этого приложения остаются в Metaspace.\n\n" +
        "Постепенно накапливается до `OutOfMemoryError: Metaspace`. Чинится очисткой ресурсов в `ServletContextListener.destroy()`:\n\n" +
        "```java\n" +
        "public void contextDestroyed(ServletContextEvent ev) {\n" +
        "    // unregister JDBC drivers\n" +
        "    DriverManager.getDrivers().asIterator().forEachRemaining(d -> {\n" +
        "        try { DriverManager.deregisterDriver(d); } catch (Exception ignored) {}\n" +
        "    });\n" +
        "    // clear ThreadLocals, stop your executors, etc.\n" +
        "}\n" +
        "```\n\n---\n\n" +
        "Tomcat uses **child-first** (inverted delegation) for web applications. Each app has its own `WebappClassLoader` that first checks locally (`WEB-INF/classes`, `WEB-INF/lib`) before delegating to the parent.\n\n" +
        "This solves a real problem: two web apps can use different versions of the same library (one on Guava 30, another on Guava 31). Without inversion, all apps would share a single version from the common loader.\n\n" +
        "The problem it creates is **classloader leaks**. If anything retains a reference to the `WebappClassLoader` during redeploy (ThreadLocals, `DriverManager.registerDriver(...)` without deregister, shutdown hooks, static fields pointing to app classes), every class loaded by that app stays in Metaspace.\n\n" +
        "It builds up across redeploys and eventually trips `OutOfMemoryError: Metaspace`. Fix by cleaning up in `ServletContextListener.destroy()`:\n\n" +
        "```java\n" +
        "public void contextDestroyed(ServletContextEvent ev) {\n" +
        "    // unregister JDBC drivers\n" +
        "    DriverManager.getDrivers().asIterator().forEachRemaining(d -> {\n" +
        "        try { DriverManager.deregisterDriver(d); } catch (Exception ignored) {}\n" +
        "    });\n" +
        "    // clear ThreadLocals, stop your executors, etc.\n" +
        "}\n" +
        "```",
      difficulty: "senior",
    },
  ],
  tip:
    "Если `getClassLoader()` возвращает `null` — класс был загружен Bootstrap-загрузчиком. Это не ошибка: Bootstrap написан на нативном коде и не имеет Java-представления.\n\n---\n\n" +
    "If `getClassLoader()` returns `null`, the class was loaded by the Bootstrap classloader. This is not a bug — Bootstrap is native code and has no Java representation.",
  springConnection: {
    concept: "ClassLoader isolation and delegation",
    springFeature: "Spring Boot DevTools & Restart ClassLoader",
    explanation:
      "Spring Boot DevTools использует специальный `RestartClassLoader`, который загружает только код вашего приложения, пока базовый classloader держит сторонние JAR'ы.\n\n" +
      "При изменении кода уничтожается и пересоздаётся только `RestartClassLoader` (уже с обновлёнными классами), а базовый остаётся. Именно поэтому DevTools-рестарт гораздо быстрее полного рестарта JVM — пересоздаётся только ваш код, а не весь Spring.\n\n" +
      "Понимание делегирования classloader'ов объясняет, почему это работает и в каких случаях рестарт может не подхватить изменения (например, если изменился класс в JAR-зависимости, загружаемой базовым loader'ом — тогда нужен полный рестарт).\n\n---\n\n" +
      "Spring Boot DevTools uses a custom `RestartClassLoader` that loads only your application code, while a base classloader holds third-party JARs.\n\n" +
      "On code change, only the `RestartClassLoader` is discarded and recreated (with updated classes); the base loader persists. That's why DevTools restart is much faster than a full JVM restart — only your code reloads, not the whole Spring framework.\n\n" +
      "Understanding classloader delegation explains why this works and when a restart may not pick up changes (e.g. a change inside a JAR dependency loaded by the base loader — then a full restart is needed).",
  },
};
