"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "HashMap internals (Java 8+)", ru: "Устройство HashMap (Java 8+)" },
  bucket: { en: "bucket", ru: "корзина" },
  chainLabel: { en: "Chain (≤ 8 entries)", ru: "Цепочка (≤ 8 элементов)" },
  treeLabel: { en: "Treeified (≥ 8 entries, ≥ 64 cap)", ru: "Treeified (≥ 8 элементов, ≥ 64 cap)" },
  hashNote: {
    en: "index = (n - 1) & hash(key)   where n = table length (power of two)",
    ru: "index = (n - 1) & hash(key)   где n — длина таблицы (степень 2)",
  },
  threshold: {
    en: "Resize at 75% load factor  ·  collisions → red-black tree at size ≥ 8",
    ru: "Ресайз при load factor 75%  ·  коллизии → red-black tree при размере ≥ 8",
  },
};

export default function HashMapInternalsDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof L) => L[k][locale];

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 380"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="HashMap internals diagram"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="hm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {T("title").toUpperCase()}
        </text>

        {/* Key box */}
        <g transform="translate(24, 50)">
          <rect width="140" height="56" rx="6" fill="#0d0f0a" stroke="#1e3a2a" />
          <text x="12" y="22" fontSize="11" fill="#4ade80" fontFamily="JetBrains Mono, monospace">key</text>
          <text x="12" y="42" fontSize="10" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">&quot;apple&quot;</text>
        </g>

        {/* hash() */}
        <g transform="translate(184, 60)">
          <rect width="120" height="36" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="60" y="23" fontSize="10" fill="#22d3ee" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            hash(key)
          </text>
        </g>
        <line x1="164" y1="78" x2="184" y2="78" stroke="#52525b" markerEnd="url(#hm-arrow)" />

        {/* index calc */}
        <g transform="translate(320, 60)">
          <rect width="172" height="36" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="86" y="23" fontSize="10" fill="#f59e0b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            (n - 1) &amp; hash
          </text>
        </g>
        <line x1="304" y1="78" x2="320" y2="78" stroke="#52525b" markerEnd="url(#hm-arrow)" />

        <text x="320" y="112" fontSize="9.5" fill="#52525b" fontFamily="JetBrains Mono, monospace">
          {T("hashNote")}
        </text>

        {/* Table (buckets) */}
        <text x="24" y="150" fontSize="10" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          TABLE (n=16)
        </text>
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`translate(${24 + i * 80}, 156)`}>
            <rect width="72" height="28" rx="3" fill="#0d0d10" stroke="#27272a" />
            <text x="36" y="18" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              [{i}]
            </text>
          </g>
        ))}

        {/* Arrow from index calc down to bucket */}
        <line x1="406" y1="96" x2="150" y2="156" stroke="#52525b" strokeDasharray="3 3" />

        {/* Chain (short) from bucket [1] */}
        <text x="24" y="214" fontSize="10" fill="#4ade80" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          {T("chainLabel").toUpperCase()}
        </text>
        <g transform="translate(24, 222)">
          {/* node 1 */}
          <rect width="108" height="40" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
          <text x="8" y="16" fontSize="9" fill="#4ade80" fontFamily="JetBrains Mono, monospace">apple → 42</text>
          <text x="8" y="30" fontSize="8" fill="#52525b" fontFamily="JetBrains Mono, monospace">hash=0x1a…</text>
        </g>
        <line x1="132" y1="242" x2="148" y2="242" stroke="#52525b" markerEnd="url(#hm-arrow)" />
        <g transform="translate(148, 222)">
          <rect width="108" height="40" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
          <text x="8" y="16" fontSize="9" fill="#4ade80" fontFamily="JetBrains Mono, monospace">ant → 7</text>
          <text x="8" y="30" fontSize="8" fill="#52525b" fontFamily="JetBrains Mono, monospace">hash=0x2b…</text>
        </g>
        <line x1="256" y1="242" x2="272" y2="242" stroke="#52525b" markerEnd="url(#hm-arrow)" />
        <g transform="translate(272, 222)">
          <rect width="62" height="40" rx="4" fill="#0d0d10" stroke="#27272a" />
          <text x="31" y="24" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            null
          </text>
        </g>

        {/* Tree (bucket with treeify) */}
        <text x="400" y="214" fontSize="10" fill="#f87171" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          {T("treeLabel").toUpperCase()}
        </text>
        <g transform="translate(480, 226)">
          <circle cx="50" cy="16" r="14" fill="#1a0808" stroke="#7f1d1d" />
          <text x="50" y="20" fontSize="9" fill="#fecaca" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            k
          </text>
          <line x1="50" y1="30" x2="22" y2="62" stroke="#7f1d1d" />
          <line x1="50" y1="30" x2="78" y2="62" stroke="#7f1d1d" />

          <circle cx="18" cy="78" r="14" fill="#1a0808" stroke="#7f1d1d" />
          <text x="18" y="82" fontSize="9" fill="#fecaca" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            a
          </text>
          <circle cx="82" cy="78" r="14" fill="#1a0808" stroke="#7f1d1d" />
          <text x="82" y="82" fontSize="9" fill="#fecaca" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            z
          </text>

          <line x1="82" y1="92" x2="108" y2="120" stroke="#7f1d1d" />
          <circle cx="114" cy="130" r="12" fill="#1a0808" stroke="#7f1d1d" />
          <text x="114" y="134" fontSize="9" fill="#fecaca" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            m
          </text>
        </g>

        <text x="360" y="368" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {T("threshold")}
        </text>
      </svg>
    </figure>
  );
}
