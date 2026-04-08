import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-4",
  blockId: 1,
  title: "ClassLoaders & Delegation",
  summary:
    "ClassLoader -- подсистема JVM, отвечающая за загрузку .class файлов. Загрузчики классов следуют модели делегирования родителю (parent-delegation), гарантируя, что базовые классы Java загружаются доверенными загрузчиками. Понимание ClassLoader объясняет разницу между ClassNotFoundException и NoClassDefFoundError.\n\n---\n\n" +
    "ClassLoaders are responsible for finding and loading .class files into the JVM. They follow a parent-delegation model that ensures core Java classes are loaded by trusted loaders first. Understanding classloaders explains why you get ClassNotFoundException vs NoClassDefFoundError, and why app servers and module systems work the way they do.",
  deepDive:
    "Каждый класс в Java загружается экземпляром ClassLoader. JVM имеет три встроенных загрузчика: Bootstrap (загружает базовые классы JDK, написан на нативном коде), Platform (ранее Extension -- загружает модули платформы) и Application (загружает классы из classpath). Модель делегирования: Application -> Platform -> Bootstrap. Если все три не нашли класс -- ClassNotFoundException. ClassLoader критически важен в серверах приложений (Tomcat использует child-first загрузку для изоляции веб-приложений).\n\n---\n\n" +
    "Every class in Java is loaded by a ClassLoader instance. The JVM ships with three built-in loaders forming a hierarchy: the Bootstrap ClassLoader (loads core JDK classes from java.base module — written in native code, returns null when you call `getClassLoader()` on java.lang.String), the Platform ClassLoader (formerly Extension ClassLoader — loads platform/extension modules), and the Application ClassLoader (loads classes from the classpath — your application code).\n\n" +
    "The parent-delegation model is the critical concept. When asked to load a class, a classloader first delegates to its parent. Only if the parent cannot find the class does the child attempt to load it. This ensures that core classes like `java.lang.Object` are always loaded by the Bootstrap loader, preventing malicious code from replacing core classes. The delegation chain is: Application -> Platform -> Bootstrap. If all three fail, you get ClassNotFoundException.\n\n" +
    "ClassNotFoundException vs NoClassDefFoundError is a classic interview question. ClassNotFoundException is a checked exception thrown when you explicitly try to load a class by name (Class.forName(), ClassLoader.loadClass()) and it is not found. NoClassDefFoundError is an Error thrown when the JVM/classloader had previously found the class (it was available at compile time) but cannot load it at runtime — usually because a dependency JAR is missing from the classpath or static initialization failed.\n\n" +
    "Custom classloaders are used in app servers (Tomcat, WildFly), OSGi, and hot-reloading frameworks. Each web application in Tomcat gets its own classloader, so two apps can use different versions of the same library. Tomcat inverts the delegation model for web apps — it checks the local webapp classloader first (child-first loading) before delegating to the parent. This is why web apps can override libraries that exist in the server's common classpath.\n\n" +
    "Classloader leaks are a serious production issue. If a classloader cannot be garbage collected because something still references a class it loaded, all classes (and their static data) loaded by that classloader stay in memory. This is the root cause of Metaspace/PermGen leaks during hot redeployment. ThreadLocal variables, JDBC drivers, and shutdown hooks are common culprits that pin classloaders in memory.",
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
      q: "What is the parent-delegation model in classloading?",
      a: "When a classloader receives a request to load a class, it first delegates to its parent classloader before attempting to load it itself. The chain goes: Application ClassLoader -> Platform ClassLoader -> Bootstrap ClassLoader. If the Bootstrap cannot find the class, Platform tries, then Application tries. This ensures core Java classes (java.lang.*, etc.) are always loaded by the trusted Bootstrap loader, preventing untrusted code from replacing them. It also avoids loading the same class multiple times across different loaders.",
      difficulty: "junior",
    },
    {
      id: "1-4-q1",
      q: "What is the difference between ClassNotFoundException and NoClassDefFoundError?",
      a: "ClassNotFoundException is a checked exception thrown when an explicit class loading attempt fails — like calling Class.forName('com.example.Missing') or ClassLoader.loadClass(). The class was never known to the JVM. NoClassDefFoundError is an unchecked Error thrown when the JVM tries to use a class that existed at compile time but is not available at runtime. Common causes: a dependency JAR was removed from the classpath, or the class's static initializer threw an exception (the class is then marked as permanently unloadable). The key difference is: CNFE = 'never heard of it', NCDFE = 'I knew about it but cannot load it now'.",
      difficulty: "mid",
    },
    {
      id: "1-4-q2",
      q: "How do application servers like Tomcat handle classloading differently, and what problems does this solve and create?",
      a: "Tomcat uses a child-first (inverted delegation) classloading model for web applications. Each web app gets its own WebappClassLoader that first checks locally (WEB-INF/classes, WEB-INF/lib) before delegating to the parent. This inverts the standard delegation model and allows two different web apps to use different versions of the same library (e.g., one app uses Guava 30, another uses Guava 31). Without this, all apps would share the same version from the common classloader. The problem it creates is classloader leaks: if any reference chain prevents the WebappClassLoader from being garbage collected during redeployment (ThreadLocals, JDBC DriverManager registrations, shutdown hooks, static fields referencing app classes), then all classes loaded by that app remain in Metaspace. This accumulates across redeployments and eventually causes OutOfMemoryError: Metaspace. The fix involves properly cleaning up resources in a ServletContextListener.destroy() method.",
      difficulty: "senior",
    },
  ],
  tip: "Если getClassLoader() возвращает null, класс был загружен Bootstrap-загрузчиком. Это не ошибка -- Bootstrap написан на нативном коде и не имеет Java-представления.\n\n---\n\n" +
    "If getClassLoader() returns null, the class was loaded by the Bootstrap classloader. This is not a bug — the Bootstrap loader is native code and has no Java representation.",
  springConnection: {
    concept: "ClassLoader isolation and delegation",
    springFeature: "Spring Boot DevTools & Restart ClassLoader",
    explanation:
      "Spring Boot DevTools uses a custom RestartClassLoader that loads your application classes, while a base classloader loads third-party JARs. On code change, only the RestartClassLoader is discarded and recreated (with updated classes), while the base classloader persists. This is a classloader trick that makes restarts fast — only your code is reloaded, not the entire Spring framework. Understanding classloader delegation explains why DevTools restart is much faster than a full JVM restart.",
  },
};
