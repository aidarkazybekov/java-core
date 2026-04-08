import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-1",
  blockId: 15,
  title: "Spring Security & JWT",
  summary:
    "Spring Security обеспечивает аутентификацию и авторизацию. JWT (JSON Web Token) -- стандарт для токенов доступа, состоящий из Header (алгоритм), Payload (данные пользователя) и Signature (подпись). Используется для stateless аутентификации.\n\n---\n\nSpring Security provides authentication and authorization. JWT (JSON Web Token) is a standard for access tokens consisting of Header (algorithm), Payload (user data), and Signature. Used for stateless authentication in REST APIs.",
  deepDive:
    "## Spring Security\n\nSpring Security -- фреймворк для обеспечения безопасности приложения, предоставляющий аутентификацию (кто вы?) и авторизацию (что вам разрешено?).\n\n## JWT\n\nJSON Web Token -- открытый стандарт для создания токенов доступа, основанный на формате JSON. Используется для передачи данных аутентификации в клиент-серверных приложениях.\n\nСтруктура:\n- **Header** -- тип токена, алгоритм подписи (например, HS256, RS256)\n- **Payload** -- полезные данные, информация по пользователю (JWT claims: sub, exp, iat, roles)\n- **Signature** -- подпись. Header и payload кодируются при помощи Base64, затем хэшируются с секретным ключом. Все три компонента объединяются через точку.\n\n---\n\n**Spring Security** architecture is based on a chain of servlet filters that intercept HTTP requests:\n\n1. **SecurityFilterChain** -- ordered list of filters applied to matching requests\n2. **AuthenticationManager** -- coordinates authentication (delegates to AuthenticationProvider)\n3. **AuthenticationProvider** -- performs actual authentication (checking credentials)\n4. **UserDetailsService** -- loads user data by username from the data source\n5. **SecurityContext** -- holds the Authentication object for the current request (stored in ThreadLocal via SecurityContextHolder)\n\n**JWT-based authentication flow**:\n1. Client sends credentials (username/password) to /api/auth/login\n2. Server validates credentials, generates a JWT with claims (userId, roles, expiration)\n3. Server returns the JWT to the client\n4. Client includes JWT in subsequent requests: `Authorization: Bearer <token>`\n5. A custom JwtAuthenticationFilter intercepts requests, validates the token, and sets the SecurityContext\n6. The request proceeds with the authenticated user's authorities\n\n**JWT structure**: `xxxxx.yyyyy.zzzzz`\n- Header: `{\"alg\": \"HS256\", \"typ\": \"JWT\"}` -> Base64URL encoded\n- Payload: `{\"sub\": \"user@mail.com\", \"roles\": [\"USER\"], \"exp\": 1234567890}` -> Base64URL encoded\n- Signature: `HMACSHA256(base64(header) + \".\" + base64(payload), secret)`\n\n**Key security considerations**: Store secrets securely (not in code), set reasonable expiration times, use HTTPS only, implement refresh token rotation, and consider RS256 (asymmetric) over HS256 (symmetric) for microservices.",
  code: `// Security configuration (Spring Security 6+)
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // disable for stateless API
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter,
                UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// JWT utility class
@Component
public class JwtService {

    @Value("\${jwt.secret}")
    private String secretKey;

    @Value("\${jwt.expiration:86400000}") // 24h default
    private long expiration;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}

// JWT filter
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext()
                .getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, user)) {
                var auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}`,
  interviewQs: [
    {
      id: "15-1-q0",
      q: "What is JWT and what are its three parts? How is it used for authentication?",
      a: "JWT (JSON Web Token) consists of Header (algorithm + token type), Payload (claims like userId, roles, expiration), and Signature (HMAC of header + payload with a secret key). All three are Base64URL-encoded and joined with dots. For authentication: client sends credentials, server returns a JWT, client includes it in subsequent requests as 'Authorization: Bearer <token>', and a filter validates the token on each request.",
      difficulty: "junior",
    },
    {
      id: "15-1-q1",
      q: "How does Spring Security's filter chain work? What happens when a request arrives?",
      a: "Spring Security inserts a DelegatingFilterProxy in the servlet filter chain. It delegates to SecurityFilterChain, which contains ordered security filters. Key filters: SecurityContextPersistenceFilter (loads/saves security context), UsernamePasswordAuthenticationFilter (handles form login), BasicAuthenticationFilter (HTTP Basic), ExceptionTranslationFilter (converts security exceptions to HTTP responses), FilterSecurityInterceptor/AuthorizationFilter (checks access rules). Each filter can pass, reject, or modify the request. Custom filters (like JwtAuthenticationFilter) are inserted at specific positions.",
      difficulty: "mid",
    },
    {
      id: "15-1-q2",
      q: "Compare JWT with session-based authentication. What are the security trade-offs of stateless JWT?",
      a: "Sessions store state server-side (scalability requires sticky sessions or shared session store). JWT is stateless (token contains all info). JWT advantages: horizontal scaling without shared state, works across services (microservices), no server-side storage. JWT drawbacks: tokens cannot be revoked before expiration (mitigate with short expiration + refresh tokens or a token blacklist), payload is readable (Base64, not encrypted) -- never store secrets in it, larger request size than session cookies. Session advantages: immediate revocation, smaller request size, server controls all state. For microservices, JWT is preferred; for monoliths, sessions are simpler and more secure.",
      difficulty: "senior",
    },
  ],
  tip: "Always use `BCryptPasswordEncoder` for password hashing and never store JWT secrets in source code -- use environment variables or a secret manager.\n\n---\n\nВсегда используйте `BCryptPasswordEncoder` для хэширования паролей и никогда не храните JWT-секреты в исходном коде -- используйте переменные окружения или менеджер секретов.",
  springConnection: null,
};
