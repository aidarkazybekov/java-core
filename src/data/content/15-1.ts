import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "15-1",
  blockId: 15,
  title: "Spring Security & JWT",
  summary:
    "Spring Security -- фреймворк аутентификации и авторизации. JWT (JSON Web Token) -- открытый стандарт для токенов доступа. Структура JWT: Header (тип, алгоритм), Payload (claims, данные пользователя), Signature (подпись). Header и Payload кодируются Base64, подпись создаётся указанным алгоритмом.\n\n---\n\nSpring Security provides authentication and authorization. JWT (JSON Web Token) is a standard for access tokens. JWT structure: Header (type, algorithm), Payload (claims, user data), Signature. Header and Payload are Base64-encoded, signature is created with the specified algorithm.",
  deepDive:
    "## Spring Security\n\n" +
    "Фреймворк для аутентификации и авторизации в Spring приложениях. Обрабатывает HTTP-запросы через цепочку фильтров (FilterChain).\n\n" +
    "## JWT\n\n" +
    "JSON Web Token -- открытый стандарт для создания токенов доступа на основе JSON. Используется для аутентификации в клиент-серверных приложениях.\n\n" +
    "**Структура:**\n" +
    "- **Header** -- тип токена, алгоритм подписи\n" +
    "- **Payload** -- полезные данные, информация по пользователю (JWT claims)\n" +
    "- **Signature** -- подпись токена\n\n" +
    "Header и Payload кодируются отдельно Base64. Затем алгоритмом из Header хэшируется header+payload с секретным ключом. Все три компонента объединяются через точку.\n\n---\n\n" +
    "## Spring Security Architecture\n\n" +
    "Requests pass through a **SecurityFilterChain**. Key filters: `UsernamePasswordAuthenticationFilter`, `BasicAuthenticationFilter`, custom JWT filter. The `AuthenticationManager` delegates to `AuthenticationProvider`s which use `UserDetailsService` to load users.\n\n" +
    "## JWT Deep Dive\n\n" +
    "**Why JWT?** Stateless authentication -- no server-side session storage. The token contains all needed info. Scales horizontally (any server can verify the token).\n\n" +
    "**JWT Structure:** `xxxxx.yyyyy.zzzzz`\n" +
    "- Header: `{\"alg\": \"HS256\", \"typ\": \"JWT\"}`\n" +
    "- Payload: `{\"sub\": \"user123\", \"role\": \"ADMIN\", \"exp\": 1700000000}`\n" +
    "- Signature: `HMACSHA256(base64(header) + \".\" + base64(payload), secret)`\n\n" +
    "**Standard claims:** `sub` (subject), `iss` (issuer), `exp` (expiration), `iat` (issued at), `aud` (audience).\n\n" +
    "**Access + Refresh token pattern:** Short-lived access token (15min) for API calls. Long-lived refresh token (7d) to obtain new access tokens without re-login.\n\n" +
    "**Security considerations:** Never store sensitive data in payload (it is only Base64-encoded, not encrypted). Always use HTTPS. Store tokens in httpOnly cookies (not localStorage) to prevent XSS.",
  code: `// ===== Security Configuration =====
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())  // stateless, no CSRF needed
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// ===== JWT Utility =====
@Component
public class JwtUtil {
    @Value("\${jwt.secret}")
    private String secret;

    @Value("\${jwt.expiration:900000}")  // 15 min
    private long expiration;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("roles", user.getAuthorities())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails user) {
        return extractUsername(token).equals(user.getUsername())
                && !isTokenExpired(token);
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}

// ===== JWT Authentication Filter =====
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
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
        String username = jwtUtil.extractUsername(token);

        if (username != null && SecurityContextHolder
                .getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService
                .loadUserByUsername(username);
            if (jwtUtil.isTokenValid(token, user)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities());
                SecurityContextHolder.getContext()
                    .setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}`,
  interviewQs: [
    {
      id: "15-1-q0",
      q: "What is JWT and what are its three parts?",
      a: "JWT (JSON Web Token) is a standard for creating stateless access tokens. Three parts separated by dots: (1) Header -- token type and signing algorithm (e.g., HS256); (2) Payload -- claims (user data, roles, expiration); (3) Signature -- HMAC or RSA signature of encoded header + payload. Header and Payload are Base64-encoded (not encrypted), so never store secrets in them.",
      difficulty: "junior",
    },
    {
      id: "15-1-q1",
      q: "How does Spring Security's filter chain work with JWT authentication?",
      a: "Requests pass through a SecurityFilterChain. A custom JwtAuthFilter (extends OncePerRequestFilter) is added before UsernamePasswordAuthenticationFilter. The filter: (1) extracts the Bearer token from the Authorization header; (2) validates the token (signature, expiration); (3) loads UserDetails; (4) creates an Authentication object and sets it in SecurityContextHolder. Subsequent filters/controllers can then access the authenticated user.",
      difficulty: "mid",
    },
    {
      id: "15-1-q2",
      q: "What are the security risks of JWT and how do you mitigate them?",
      a: "Risks: (1) Token theft -- store in httpOnly cookies, not localStorage (XSS prevention). (2) No revocation -- JWTs are valid until expiry. Mitigate with short-lived access tokens (15min) + refresh tokens, or maintain a token blacklist in Redis. (3) Payload is not encrypted -- never include sensitive data. (4) Algorithm confusion attack -- always validate the algorithm server-side, never trust the header. (5) Secret key compromise -- use strong keys, rotate periodically. For high-security systems, consider opaque tokens with server-side session store instead of JWT.",
      difficulty: "senior",
    },
  ],
  tip: "Никогда не храните чувствительные данные в JWT payload -- он только закодирован Base64, а не зашифрован.\n\n---\n\nNever store sensitive data in JWT payload -- it is only Base64-encoded, not encrypted.",
  springConnection: null,
};
