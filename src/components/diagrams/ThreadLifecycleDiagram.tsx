"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "Thread lifecycle", ru: "Жизненный цикл потока" },
  states: {
    new: { en: "NEW", ru: "NEW" },
    runnable: { en: "RUNNABLE", ru: "RUNNABLE" },
    blocked: { en: "BLOCKED", ru: "BLOCKED" },
    waiting: { en: "WAITING", ru: "WAITING" },
    timed: { en: "TIMED_WAITING", ru: "TIMED_WAITING" },
    terminated: { en: "TERMINATED", ru: "TERMINATED" },
  },
  note: {
    en: "getState() returns one of these six enum values",
    ru: "getState() возвращает одно из этих шести значений",
  },
};

export default function ThreadLifecycleDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof L.states) => L.states[k][locale];

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 360"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Thread lifecycle state machine"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="th-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {L.title[locale].toUpperCase()}
        </text>

        {/* NEW */}
        <g transform="translate(40, 140)">
          <rect width="110" height="60" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="55" y="36" fontSize="12" fill="#fafafa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("new")}
          </text>
        </g>

        {/* RUNNABLE */}
        <g transform="translate(230, 140)">
          <rect width="140" height="60" rx="8" fill="#0f1a0f" stroke="#1e3a2a" />
          <text x="70" y="36" fontSize="12" fill="#4ade80" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("runnable")}
          </text>
        </g>

        {/* TERMINATED */}
        <g transform="translate(540, 140)">
          <rect width="140" height="60" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="70" y="36" fontSize="12" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("terminated")}
          </text>
        </g>

        {/* BLOCKED */}
        <g transform="translate(230, 30)">
          <rect width="140" height="56" rx="8" fill="#1a0808" stroke="#7f1d1d" />
          <text x="70" y="33" fontSize="12" fill="#f87171" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("blocked")}
          </text>
        </g>

        {/* WAITING */}
        <g transform="translate(390, 30)">
          <rect width="140" height="56" rx="8" fill="#1a1508" stroke="#854d0e" />
          <text x="70" y="33" fontSize="12" fill="#f59e0b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("waiting")}
          </text>
        </g>

        {/* TIMED_WAITING */}
        <g transform="translate(310, 260)">
          <rect width="180" height="56" rx="8" fill="#081115" stroke="#164e63" />
          <text x="90" y="33" fontSize="12" fill="#22d3ee" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {T("timed")}
          </text>
        </g>

        {/* Transitions */}
        <line x1="150" y1="170" x2="230" y2="170" stroke="#52525b" markerEnd="url(#th-arrow)" />
        <text x="190" y="162" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          start()
        </text>

        {/* RUNNABLE ↔ BLOCKED */}
        <path d="M 290,140 L 290,86" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="250" y="114" fontSize="9" fill="#f87171" fontFamily="JetBrains Mono, monospace">
          enter synchronized
        </text>
        <path d="M 310,86 L 310,140" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="316" y="114" fontSize="9" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
          acquired
        </text>

        {/* RUNNABLE ↔ WAITING */}
        <path d="M 370,170 L 408,96" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="400" y="140" fontSize="9" fill="#f59e0b" fontFamily="JetBrains Mono, monospace">
          wait() / join()
        </text>
        <path d="M 440,86 L 370,150" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="420" y="120" fontSize="9" fill="#a1a1aa" textAnchor="end" fontFamily="JetBrains Mono, monospace">
          notify()
        </text>

        {/* RUNNABLE ↔ TIMED_WAITING */}
        <path d="M 340,200 L 380,260" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="384" y="232" fontSize="9" fill="#22d3ee" fontFamily="JetBrains Mono, monospace">
          sleep(N) / wait(N)
        </text>
        <path d="M 420,260 L 340,205" stroke="#52525b" fill="none" markerEnd="url(#th-arrow)" />
        <text x="352" y="248" fontSize="9" fill="#a1a1aa" textAnchor="end" fontFamily="JetBrains Mono, monospace">
          timeout
        </text>

        {/* RUNNABLE → TERMINATED */}
        <line x1="370" y1="170" x2="540" y2="170" stroke="#52525b" markerEnd="url(#th-arrow)" />
        <text x="455" y="162" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          run() returns / exception
        </text>

        <text x="360" y="348" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {L.note[locale]}
        </text>
      </svg>
    </figure>
  );
}
