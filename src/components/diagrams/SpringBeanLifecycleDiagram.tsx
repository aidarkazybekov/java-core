"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "Spring bean lifecycle", ru: "Жизненный цикл Spring-бина" },
  instantiate: { en: "Instantiate", ru: "Instantiate" },
  instantiateSub: { en: "constructor", ru: "конструктор" },
  populate: { en: "Populate properties", ru: "Populate properties" },
  populateSub: { en: "field / setter injection", ru: "field / setter инъекции" },
  aware: { en: "*Aware callbacks", ru: "*Aware callbacks" },
  awareSub: { en: "BeanName / BeanFactory / ApplicationContext", ru: "BeanName / BeanFactory / ApplicationContext" },
  bppBefore: { en: "BeanPostProcessor: before init", ru: "BeanPostProcessor: до init" },
  bppBeforeSub: {
    en: "@PostConstruct runs here (via CommonAnnotationBPP)",
    ru: "@PostConstruct запускается здесь",
  },
  init: { en: "Initialization", ru: "Initialization" },
  initSub: { en: "InitializingBean.afterPropertiesSet · init-method", ru: "InitializingBean.afterPropertiesSet · init-method" },
  bppAfter: { en: "BeanPostProcessor: after init", ru: "BeanPostProcessor: после init" },
  bppAfterSub: {
    en: "AOP proxies wrap the bean here",
    ru: "здесь AOP оборачивает бин в прокси",
  },
  ready: { en: "Bean is ready", ru: "Бин готов" },
  destroy: { en: "Destruction", ru: "Уничтожение" },
  destroySub: {
    en: "@PreDestroy · DisposableBean.destroy() · destroy-method",
    ru: "@PreDestroy · DisposableBean.destroy() · destroy-method",
  },
  note: {
    en: "Proxy wrapping happens in 'after init' — this is why self-invocation skips @Transactional.",
    ru: "Оборачивание в прокси — в «после init». Поэтому self-invocation обходит @Transactional.",
  },
};

export default function SpringBeanLifecycleDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof L) => L[k][locale];

  const steps: Array<{ label: keyof typeof L; sub: keyof typeof L; tone: "green" | "cyan" | "amber" }> = [
    { label: "instantiate", sub: "instantiateSub", tone: "green" },
    { label: "populate", sub: "populateSub", tone: "green" },
    { label: "aware", sub: "awareSub", tone: "cyan" },
    { label: "bppBefore", sub: "bppBeforeSub", tone: "cyan" },
    { label: "init", sub: "initSub", tone: "green" },
    { label: "bppAfter", sub: "bppAfterSub", tone: "amber" },
  ];

  const tones = {
    green: { bg: "#0f1a0f", border: "#1e3a2a", label: "#4ade80" },
    cyan: { bg: "#081115", border: "#164e63", label: "#22d3ee" },
    amber: { bg: "#1a1508", border: "#854d0e", label: "#f59e0b" },
    red: { bg: "#1a0808", border: "#7f1d1d", label: "#f87171" },
  };

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 480"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Spring bean lifecycle"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="bl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {T("title").toUpperCase()}
        </text>

        {steps.map((s, i) => {
          const y = 42 + i * 56;
          const tone = tones[s.tone];
          return (
            <g key={s.label} transform={`translate(24, ${y})`}>
              <rect width="672" height="46" rx="6" fill={tone.bg} stroke={tone.border} />
              <text x="20" y="22" fontSize="11" fontWeight="600" fill={tone.label} fontFamily="Inter, sans-serif">
                {i + 1}. {T(s.label)}
              </text>
              <text x="20" y="38" fontSize="10" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
                {T(s.sub)}
              </text>
              {i < steps.length - 1 && (
                <line x1="360" y1="52" x2="360" y2="66" stroke="#52525b" markerEnd="url(#bl-arrow)" />
              )}
            </g>
          );
        })}

        {/* Ready state */}
        <g transform="translate(24, 378)">
          <rect width="672" height="34" rx="6" fill="#111114" stroke="#27272a" />
          <text x="340" y="22" fontSize="12" textAnchor="middle" fontWeight="600" fill="#4ade80" fontFamily="Inter, sans-serif">
            ✓ {T("ready")}
          </text>
        </g>

        {/* Destruction */}
        <g transform="translate(24, 420)">
          <rect width="672" height="40" rx="6" fill="#1a0808" stroke="#7f1d1d" />
          <text x="20" y="20" fontSize="11" fontWeight="600" fill="#f87171" fontFamily="Inter, sans-serif">
            {T("destroy")}
          </text>
          <text x="20" y="34" fontSize="10" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
            {T("destroySub")}
          </text>
        </g>

        <text x="360" y="476" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {T("note")}
        </text>
      </svg>
    </figure>
  );
}
