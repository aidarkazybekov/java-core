"use client";

import { useLocale } from "@/lib/i18n";

const L = {
  title: { en: "Stream pipeline — lazy until a terminal op", ru: "Stream pipeline — ленивый до терминальной операции" },
  source: { en: "Source", ru: "Источник" },
  sourceDetail: { en: "Collection · Stream.of · IntStream.range", ru: "Collection · Stream.of · IntStream.range" },
  intermediate: { en: "Intermediate (lazy)", ru: "Промежуточные (ленивые)" },
  terminal: { en: "Terminal (triggers)", ru: "Терминальные (запускают)" },
  note: {
    en: "Items flow through the pipeline one at a time (pull-based). filter/map are only called when a terminal op is invoked.",
    ru: "Элементы идут через pipeline по одному (pull). filter/map вызываются только когда запущена терминальная операция.",
  },
};

export default function StreamPipelineDiagram() {
  const { locale } = useLocale();

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 340"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Stream pipeline flow diagram"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="sp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        <text x="20" y="22" fontSize="11" fill="#52525b" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
          {L.title[locale].toUpperCase()}
        </text>

        {/* Source */}
        <g transform="translate(24, 60)">
          <rect width="140" height="62" rx="8" fill="#0d0f0a" stroke="#1e3a2a" />
          <text x="70" y="22" fontSize="10" fill="#4ade80" textAnchor="middle" letterSpacing="1.2" fontFamily="Inter, sans-serif">
            {L.source[locale].toUpperCase()}
          </text>
          <text x="70" y="38" fontSize="10" fill="#fafafa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            List.of(1,2,3,4)
          </text>
          <text x="70" y="52" fontSize="9" fill="#52525b" textAnchor="middle" fontFamily="Inter, sans-serif">
            .stream()
          </text>
        </g>

        {/* Intermediate section bracket */}
        <text x="184" y="56" fontSize="10" fill="#22d3ee" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          {L.intermediate[locale].toUpperCase()}
        </text>
        <line x1="184" y1="62" x2="512" y2="62" stroke="#22d3ee" strokeOpacity="0.25" strokeDasharray="2 3" />

        {/* filter */}
        <g transform="translate(184, 76)">
          <rect width="100" height="46" rx="6" fill="#081115" stroke="#164e63" />
          <text x="50" y="20" fontSize="11" fill="#22d3ee" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            filter
          </text>
          <text x="50" y="36" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            x &gt; 1
          </text>
        </g>
        <line x1="164" y1="91" x2="184" y2="99" stroke="#52525b" markerEnd="url(#sp-arrow)" />

        {/* map */}
        <g transform="translate(304, 76)">
          <rect width="100" height="46" rx="6" fill="#081115" stroke="#164e63" />
          <text x="50" y="20" fontSize="11" fill="#22d3ee" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            map
          </text>
          <text x="50" y="36" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            x * x
          </text>
        </g>
        <line x1="284" y1="99" x2="304" y2="99" stroke="#52525b" markerEnd="url(#sp-arrow)" />

        {/* distinct */}
        <g transform="translate(424, 76)">
          <rect width="100" height="46" rx="6" fill="#081115" stroke="#164e63" />
          <text x="50" y="20" fontSize="11" fill="#22d3ee" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            distinct
          </text>
          <text x="50" y="36" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            stateful
          </text>
        </g>
        <line x1="404" y1="99" x2="424" y2="99" stroke="#52525b" markerEnd="url(#sp-arrow)" />

        {/* Terminal section */}
        <text x="544" y="56" fontSize="10" fill="#f59e0b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          {L.terminal[locale].toUpperCase()}
        </text>
        <g transform="translate(544, 76)">
          <rect width="152" height="46" rx="6" fill="#1a1508" stroke="#854d0e" />
          <text x="76" y="20" fontSize="11" fill="#f59e0b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            collect(toList())
          </text>
          <text x="76" y="36" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            triggers evaluation
          </text>
        </g>
        <line x1="524" y1="99" x2="544" y2="99" stroke="#52525b" markerEnd="url(#sp-arrow)" />

        {/* Items flowing through */}
        <text x="24" y="168" fontSize="10" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
          PULL-BASED, ONE ITEM AT A TIME
        </text>
        <g transform="translate(24, 180)">
          {/* arrow baseline */}
          <line x1="0" y1="60" x2="672" y2="60" stroke="#27272a" strokeDasharray="4 4" />

          {/* item flow bubbles */}
          {[
            { x: 20, label: "1", pass: false },
            { x: 120, label: "2", pass: true },
            { x: 220, label: "4", pass: true },
            { x: 340, label: "3", pass: true },
            { x: 460, label: "9", pass: true },
            { x: 580, label: "4", pass: false },
          ].map((n, i) => (
            <g key={i} transform={`translate(${n.x}, 50)`}>
              <circle cx="0" cy="20" r="14" fill={n.pass ? "#0f1a0f" : "#1a0808"} stroke={n.pass ? "#1e3a2a" : "#7f1d1d"} />
              <text x="0" y="24" fontSize="10" fill={n.pass ? "#4ade80" : "#f87171"} textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                {n.label}
              </text>
            </g>
          ))}

          <text x="20" y="100" fontSize="9" fill="#f87171" fontFamily="JetBrains Mono, monospace">
            1 filtered out
          </text>
          <text x="580" y="100" fontSize="9" fill="#f87171" fontFamily="JetBrains Mono, monospace">
            4 = dup
          </text>
        </g>

        <text x="360" y="325" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {L.note[locale]}
        </text>
      </svg>
    </figure>
  );
}
