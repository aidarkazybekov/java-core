"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "B-tree index — lookup path", ru: "B-tree индекс — путь поиска" },
  query: { en: "SELECT ... WHERE age = 42", ru: "SELECT ... WHERE age = 42" },
  rootLabel: { en: "Root (1 page read)", ru: "Root (1 чтение страницы)" },
  midLabel: { en: "Internal (2 page reads)", ru: "Internal (2 чтения)" },
  leafLabel: { en: "Leaf pages → rowIDs", ru: "Leaf-страницы → rowID" },
  heapLabel: { en: "Heap / table rows", ru: "Heap / строки таблицы" },
  note: {
    en: "Lookup cost: O(log N). Leaf pages are linked → range scans = sequential reads.",
    ru: "Стоимость поиска: O(log N). Leaf-страницы связаны → range-скан = последовательное чтение.",
  },
};

export default function SqlIndexDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof L) => L[k][locale];

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="B-tree index lookup path"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="sq-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
          <marker id="sq-hit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#4ade80" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {T("title").toUpperCase()}
        </text>

        {/* Query chip */}
        <g transform="translate(24, 42)">
          <rect width="200" height="30" rx="4" fill="#0d0f0a" stroke="#1e3a2a" />
          <text x="12" y="20" fontSize="11" fill="#4ade80" fontFamily="JetBrains Mono, monospace">
            {T("query")}
          </text>
        </g>

        {/* Root */}
        <g transform="translate(280, 82)">
          <rect width="160" height="34" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
          <text x="10" y="14" fontSize="9" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            ROOT
          </text>
          <text x="10" y="28" fontSize="11" fill="#fafafa" fontFamily="JetBrains Mono, monospace">
            [ 30 | 60 | 90 ]
          </text>
        </g>
        <line x1="224" y1="57" x2="276" y2="95" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#sq-hit)" />
        <text x="228" y="92" fontSize="9" fill="#4ade80" fontFamily="JetBrains Mono, monospace">
          42 &lt; 60
        </text>

        {/* Internal nodes */}
        <g transform="translate(80, 156)">
          <rect width="140" height="30" rx="4" fill="#081115" stroke="#164e63" />
          <text x="10" y="20" fontSize="11" fill="#fafafa" fontFamily="JetBrains Mono, monospace">
            [ 10 | 20 ]
          </text>
        </g>
        <g transform="translate(240, 156)">
          <rect width="140" height="30" rx="4" fill="#0f1a0f" stroke="#1e3a2a" />
          <text x="10" y="20" fontSize="11" fill="#fafafa" fontFamily="JetBrains Mono, monospace">
            [ 40 | 50 ]
          </text>
        </g>
        <g transform="translate(400, 156)">
          <rect width="140" height="30" rx="4" fill="#081115" stroke="#164e63" />
          <text x="10" y="20" fontSize="11" fill="#fafafa" fontFamily="JetBrains Mono, monospace">
            [ 70 | 80 ]
          </text>
        </g>
        <g transform="translate(560, 156)">
          <rect width="120" height="30" rx="4" fill="#081115" stroke="#164e63" />
          <text x="10" y="20" fontSize="11" fill="#fafafa" fontFamily="JetBrains Mono, monospace">
            [ 95 ]
          </text>
        </g>

        <line x1="290" y1="116" x2="310" y2="152" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#sq-hit)" />
        <line x1="340" y1="116" x2="150" y2="152" stroke="#27272a" />
        <line x1="380" y1="116" x2="470" y2="152" stroke="#27272a" />
        <line x1="420" y1="116" x2="620" y2="152" stroke="#27272a" />

        {/* Leaf pages */}
        <g transform="translate(40, 226)">
          <rect width="640" height="44" rx="4" fill="#0d0d10" stroke="#27272a" />
          <text x="10" y="14" fontSize="9" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("leafLabel").toUpperCase()}
          </text>
          <text x="10" y="34" fontSize="10" fill="#52525b" fontFamily="JetBrains Mono, monospace">
            [10,r1] → [20,r2]
          </text>
          <text x="186" y="34" fontSize="10" fill="#4ade80" fontFamily="JetBrains Mono, monospace">
            [40,r3] → [42,r4] → [50,r5]
          </text>
          <text x="400" y="34" fontSize="10" fill="#52525b" fontFamily="JetBrains Mono, monospace">
            [70,r6] → [80,r7] → [95,r8]
          </text>
          {/* Sibling links between leaf nodes */}
          <line x1="186" y1="28" x2="196" y2="28" stroke="#52525b" markerEnd="url(#sq-arrow)" />
          <line x1="396" y1="28" x2="406" y2="28" stroke="#52525b" markerEnd="url(#sq-arrow)" />
        </g>
        <line x1="310" y1="186" x2="250" y2="222" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#sq-hit)" />

        {/* Heap */}
        <g transform="translate(80, 310)">
          <rect width="560" height="46" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="12" y="16" fontSize="9" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("heapLabel").toUpperCase()}
          </text>
          <text x="12" y="36" fontSize="10" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
            r1 {"{id:1,name:Bob,age:10}"}   r4 {"{id:4,name:Alice,age:42}"}   r7 {"{…}"}
          </text>
        </g>
        <line x1="250" y1="270" x2="320" y2="306" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#sq-hit)" />

        <text x="360" y="388" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {T("note")}
        </text>
      </svg>
    </figure>
  );
}
