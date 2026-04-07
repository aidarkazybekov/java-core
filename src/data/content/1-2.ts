import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "1-2",
  blockId: 1,
  title: "JDK vs JRE vs JVM",
  summary:
    "JDK, JRE, and JVM are nested layers of the Java platform. Confusing them is a red flag in interviews. The JDK is for development (compiler + tools + JRE), the JRE is for running apps (libraries + JVM), and the JVM is the actual bytecode execution engine. Since Java 11, the JRE is no longer distributed separately.",
  deepDive:
    "The Java Virtual Machine (JVM) is a specification that defines how bytecode is executed. It is an abstract machine — HotSpot, OpenJ9, GraalVM, and Azul Zing are all different implementations. The JVM handles class loading, memory management, garbage collection, and bytecode execution. It does NOT include the standard library or development tools.\n\n" +
    "The Java Runtime Environment (JRE) bundles the JVM with the Java Class Library (rt.jar / modules), supporting files, and deployment tools. Before Java 11, you could install just the JRE on servers that only needed to run compiled applications. Since Java 11, Oracle stopped shipping a separate JRE — you get the full JDK, and you can use `jlink` to create custom minimal runtimes for your application.\n\n" +
    "The Java Development Kit (JDK) includes everything in the JRE plus development tools: `javac` (compiler), `javap` (disassembler), `jdb` (debugger), `jconsole` / `jvisualvm` (monitoring), `jmap` / `jstack` / `jstat` (diagnostics), and `jlink` (custom runtime images). When you install 'Java' for development, you install the JDK. The relationship is: JDK contains JRE contains JVM.\n\n" +
    "A common interview trap: 'Can you run a Java application with just the JVM?' The answer is no — the JVM alone cannot execute anything useful because it needs the standard library classes (java.lang.Object, java.lang.String, etc.) that come with the JRE. Even a trivial `public static void main` requires class library support.\n\n" +
    "In modern Java (11+), the distinction matters differently. The JDK is the only distribution. Docker images like `eclipse-temurin:21-jre` exist but they are custom-built JRE-like images created using `jlink`. Understanding `jlink` and custom runtime images is increasingly important for containerized deployments — you can strip your runtime from ~300MB to ~40MB by including only the modules your application needs.",
  code:
    `// Inspecting which layer you're running on
public class JavaPlatformInfo {
    public static void main(String[] args) {
        // JVM information
        System.out.println("=== JVM ===");
        System.out.println("JVM Name:    " + System.getProperty("java.vm.name"));
        System.out.println("JVM Vendor:  " + System.getProperty("java.vm.vendor"));
        System.out.println("JVM Version: " + System.getProperty("java.vm.version"));

        // JRE information
        System.out.println("\\n=== JRE ===");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home:    " + System.getProperty("java.home"));
        System.out.println("Spec Version: " + System.getProperty("java.specification.version"));

        // JDK tools detection — are we running from a JDK?
        System.out.println("\\n=== JDK Detection ===");
        String javaHome = System.getProperty("java.home");
        java.io.File javac = new java.io.File(javaHome, "bin/javac");
        java.io.File javacExe = new java.io.File(javaHome, "bin/javac.exe");
        boolean isJdk = javac.exists() || javacExe.exists();
        System.out.println("Running from JDK: " + isJdk);

        // Module system (Java 9+) — shows the modular JRE
        System.out.println("\\n=== Module System ===");
        Module mod = String.class.getModule();
        System.out.println("String is in module: " + mod.getName());
        System.out.println("Module layer present: " + (mod.getLayer() != null));

        // Available processors and memory (JVM-level)
        System.out.println("\\n=== Runtime ===");
        Runtime rt = Runtime.getRuntime();
        System.out.println("Available processors: " + rt.availableProcessors());
        System.out.println("Max memory (MB): " + rt.maxMemory() / 1024 / 1024);
    }
}`,
  interviewQs: [
    {
      id: "1-2-q0",
      q: "What is the relationship between JDK, JRE, and JVM?",
      a: "They are nested layers. The JVM is the bytecode execution engine (class loading, GC, execution). The JRE wraps the JVM and adds the Java standard library plus runtime resources needed to actually run programs. The JDK wraps the JRE and adds development tools like javac, javap, jdb, and diagnostic tools. Since Java 11, the standalone JRE is no longer shipped separately — the JDK is the only distribution, and jlink can create minimal custom runtimes.",
      difficulty: "junior",
    },
    {
      id: "1-2-q1",
      q: "What changed about JDK/JRE distribution starting with Java 11, and why does it matter for deployments?",
      a: "Starting with Java 11 (and the new release cadence), Oracle stopped shipping a standalone JRE. The JDK became the only downloadable distribution. For deployments, this means you either ship a full JDK (larger image) or use jlink to create a custom minimal runtime containing only the modules your application actually uses. This is significant for containers — a full JDK image can be 300+ MB, while a jlink-optimized runtime can be under 50 MB. Docker base images like eclipse-temurin:21-jre are actually jlink-created custom runtimes, not the traditional JRE.",
      difficulty: "mid",
    },
    {
      id: "1-2-q2",
      q: "Name three different JVM implementations and explain when you might choose one over another.",
      a: "HotSpot (OpenJDK/Oracle) is the default — battle-tested, well-documented, and the baseline for most applications. Eclipse OpenJ9 (IBM) has a smaller memory footprint and faster startup than HotSpot, making it attractive for containerized microservices where memory is constrained and cold start matters. GraalVM offers ahead-of-time (AOT) compilation to native binaries via native-image, giving near-instant startup and reduced memory but with limitations on reflection and dynamic class loading. For a Spring Boot microservice in Kubernetes with tight memory limits and frequent scaling, OpenJ9 or GraalVM native-image can be significantly better than HotSpot. For a long-running monolith where peak throughput matters, HotSpot with its mature C2 JIT is usually the best choice.",
      difficulty: "senior",
    },
  ],
  tip: "Since Java 11, if someone asks about the JRE, clarify that it no longer ships separately. Mentioning jlink for custom runtimes in containers shows you understand modern Java deployment.",
  springConnection: {
    concept: "JDK vs JRE in deployment",
    springFeature: "Spring Boot Docker Images & GraalVM Native Image",
    explanation:
      "Spring Boot 3.x supports building GraalVM native images via `spring-boot-maven-plugin` and the `native` profile. This eliminates the JVM entirely at runtime, producing a standalone binary. For JVM-based deployments, Spring Boot's layered jar format pairs with jlink-based custom runtimes to produce minimal Docker images. The Paketo buildpack used by `spring-boot:build-image` automatically applies these optimizations.",
  },
};
