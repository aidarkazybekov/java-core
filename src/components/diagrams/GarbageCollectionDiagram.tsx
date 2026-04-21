"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "Heap generations + GC phases", ru: "Поколения heap + фазы GC" },
  young: { en: "Young Generation", ru: "Young Generation" },
  old: { en: "Old Generation (Tenured)", ru: "Old Generation (Tenured)" },
  eden: { en: "Eden", ru: "Eden" },
  s0: { en: "Survivor S0", ru: "Survivor S0" },
  s1: { en: "Survivor S1", ru: "Survivor S1" },
  newAlloc: { en: "new Foo()  →  allocated here", ru: "new Foo()  →  аллокация здесь" },
  minor: { en: "Minor GC (Young only)", ru: "Minor GC (только Young)" },
  major: { en: "Major / Full GC", ru: "Major / Full GC" },
  promo: { en: "promoted after N GCs", ru: "promotion после N GC" },
  phases: { en: "Mark → Sweep → (Compact)", ru: "Mark → Sweep → (Compact)" },
  note: {
    en: "Most objects die young. Young GC is cheap; Full GC stops the world.",
    ru: "Большинство объектов умирает молодыми. Young GC дешёвый; Full GC — stop-the-world.",
  },
};

export default function GarbageCollectionDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof L) => L[k][locale];

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="GC generations and phases"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="gc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {T("title").toUpperCase()}
        </text>

        {/* Heap container */}
        <rect x="24" y="46" width="672" height="240" rx="8" fill="#18181b" stroke="#27272a" />
        <text x="40" y="66" fontSize="10" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          HEAP
        </text>

        {/* Young Generation */}
        <g transform="translate(40, 82)">
          <rect width="420" height="186" rx="6" fill="#0d0f0a" stroke="#1e3a2a" />
          <text x="12" y="22" fontSize="11" fill="#4ade80" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("young").toUpperCase()}
          </text>

          {/* Eden — largest */}
          <g transform="translate(16, 40)">
            <rect width="240" height="128" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
            <text x="14" y="22" fontSize="12" fill="#fafafa" fontFamily="Inter, sans-serif">{T("eden")}</text>
            <text x="14" y="40" fontSize="10" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
              {T("newAlloc")}
            </text>
            {/* Allocation dots */}
            {Array.from({ length: 14 }).map((_, i) => (
              <circle
                key={i}
                cx={22 + (i % 7) * 30}
                cy={68 + Math.floor(i / 7) * 22}
                r="4"
                fill="#4ade80"
                fillOpacity={0.4 + (i % 3) * 0.2}
              />
            ))}
            <text x="14" y="118" fontSize="9" fill="#52525b" fontFamily="JetBrains Mono, monospace">
              ~80% of young
            </text>
          </g>

          {/* S0 */}
          <g transform="translate(264, 40)">
            <rect width="68" height="128" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
            <text x="8" y="20" fontSize="10" fill="#fafafa" fontFamily="Inter, sans-serif">{T("s0")}</text>
            <circle cx="18" cy="58" r="3.5" fill="#4ade80" />
            <circle cx="36" cy="66" r="3.5" fill="#4ade80" />
            <circle cx="26" cy="82" r="3.5" fill="#4ade80" />
            <circle cx="44" cy="100" r="3.5" fill="#4ade80" />
          </g>

          {/* S1 */}
          <g transform="translate(340, 40)">
            <rect width="68" height="128" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
            <text x="8" y="20" fontSize="10" fill="#fafafa" fontFamily="Inter, sans-serif">{T("s1")}</text>
          </g>
        </g>

        {/* Old Generation */}
        <g transform="translate(476, 82)">
          <rect width="208" height="186" rx="6" fill="#081115" stroke="#164e63" />
          <text x="12" y="22" fontSize="11" fill="#22d3ee" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("old").toUpperCase()}
          </text>
          {/* Long-lived objects (bigger circles) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={24 + (i % 4) * 44}
              cy={60 + Math.floor(i / 4) * 40}
              r="7"
              fill="#22d3ee"
              fillOpacity={0.4 + (i % 3) * 0.15}
            />
          ))}
          <text x="12" y="160" fontSize="9" fill="#52525b" fontFamily="JetBrains Mono, monospace">
            survivors of N GCs
          </text>
        </g>

        {/* Promotion arrow */}
        <line x1="410" y1="172" x2="476" y2="172" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#gc-arrow)" />
        <text x="443" y="164" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {T("promo")}
        </text>

        {/* GC phases bar */}
        <g transform="translate(24, 306)">
          <rect width="672" height="72" rx="8" fill="#18181b" stroke="#27272a" />

          <g transform="translate(16, 14)">
            <rect width="312" height="44" rx="4" fill="#0d0f0a" stroke="#1e3a2a" />
            <text x="12" y="20" fontSize="11" fill="#4ade80" fontFamily="Inter, sans-serif">{T("minor")}</text>
            <text x="12" y="36" fontSize="9" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
              {T("phases")} · &lt; 50ms typical
            </text>
          </g>

          <g transform="translate(344, 14)">
            <rect width="312" height="44" rx="4" fill="#1a0808" stroke="#7f1d1d" />
            <text x="12" y="20" fontSize="11" fill="#f87171" fontFamily="Inter, sans-serif">{T("major")}</text>
            <text x="12" y="36" fontSize="9" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
              Mark → Sweep → Compact · stop-the-world
            </text>
          </g>
        </g>

        <text x="360" y="396" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {T("note")}
        </text>
      </svg>
    </figure>
  );
}
