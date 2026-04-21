"use client";

import { useLocale } from "@/lib/i18n";

const LABELS = {
  title: { en: "JVM", ru: "JVM" },
  classLoader: { en: "Class Loader Subsystem", ru: "Загрузчик классов" },
  loading: { en: "Loading", ru: "Loading" },
  linking: { en: "Linking", ru: "Linking" },
  initialization: { en: "Initialization", ru: "Initialization" },
  runtimeData: { en: "Runtime Data Areas", ru: "Области данных" },
  shared: { en: "Shared", ru: "Shared" },
  perThread: { en: "Per-thread", ru: "Per-thread" },
  heap: { en: "Heap", ru: "Heap" },
  heapGens: { en: "Young (Eden + S0 + S1)  ·  Old", ru: "Young (Eden + S0 + S1)  ·  Old" },
  metaspace: { en: "Method Area / Metaspace", ru: "Method Area / Metaspace" },
  jvmStack: { en: "JVM Stack", ru: "JVM Stack" },
  pc: { en: "PC Register", ru: "PC Register" },
  native: { en: "Native Method Stack", ru: "Native Stack" },
  execEngine: { en: "Execution Engine", ru: "Механизм исполнения" },
  interpreter: { en: "Interpreter", ru: "Interpreter" },
  jit: { en: "JIT (C1 → C2)", ru: "JIT (C1 → C2)" },
  gc: { en: "Garbage Collector", ru: "Garbage Collector" },
};

export default function JvmArchitectureDiagram() {
  const { locale } = useLocale();
  const T = (k: keyof typeof LABELS) => LABELS[k][locale];

  return (
    <figure className="not-prose my-5 rounded-lg border border-border bg-bg-card p-4 overflow-x-auto">
      <svg
        viewBox="0 0 720 420"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="JVM Architecture diagram"
        className="w-full h-auto min-w-[640px]"
      >
        <defs>
          <marker id="jvm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
          </marker>
        </defs>

        {/* Outer JVM frame */}
        <rect x="12" y="12" width="696" height="396" rx="8" fill="none" stroke="#27272a" strokeWidth="1" />
        <text x="28" y="32" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#52525b" letterSpacing="2">
          {T("title")}
        </text>

        {/* Column 1: Class Loader */}
        <g transform="translate(36, 54)">
          <rect width="180" height="310" rx="6" fill="#18181b" stroke="#27272a" />
          <rect width="180" height="24" rx="6" fill="#1e2a1f" />
          <text x="12" y="16" fontSize="10" fill="#4ade80" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("classLoader").toUpperCase()}
          </text>

          <g transform="translate(16, 50)">
            <rect width="148" height="56" rx="4" fill="#0d0f0a" stroke="#1e3a2a" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("loading")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">.class → metadata</text>
          </g>
          <g transform="translate(16, 118)">
            <rect width="148" height="72" rx="4" fill="#0d0f0a" stroke="#1e3a2a" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("linking")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">• Verify</text>
            <text x="12" y="54" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">• Prepare</text>
            <text x="12" y="68" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">• Resolve</text>
          </g>
          <g transform="translate(16, 202)">
            <rect width="148" height="56" rx="4" fill="#0d0f0a" stroke="#1e3a2a" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("initialization")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">{'<clinit>'}</text>
          </g>
        </g>

        {/* Arrow CL -> RDA */}
        <line x1="220" y1="200" x2="252" y2="200" stroke="#52525b" strokeWidth="1" markerEnd="url(#jvm-arrow)" />

        {/* Column 2: Runtime Data Areas */}
        <g transform="translate(256, 54)">
          <rect width="220" height="310" rx="6" fill="#18181b" stroke="#27272a" />
          <rect width="220" height="24" rx="6" fill="#0f1f25" />
          <text x="12" y="16" fontSize="10" fill="#22d3ee" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("runtimeData").toUpperCase()}
          </text>

          {/* Shared section */}
          <text x="14" y="44" fontSize="9" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("shared").toUpperCase()}
          </text>
          <g transform="translate(14, 50)">
            <rect width="192" height="52" rx="4" fill="#081115" stroke="#164e63" />
            <text x="10" y="20" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("heap")}</text>
            <text x="10" y="38" fontSize="9.5" fill="#a1a1aa" fontFamily="Inter, sans-serif">{T("heapGens")}</text>
          </g>
          <g transform="translate(14, 108)">
            <rect width="192" height="36" rx="4" fill="#081115" stroke="#164e63" />
            <text x="10" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("metaspace")}</text>
          </g>

          {/* Per-thread section */}
          <text x="14" y="168" fontSize="9" fill="#52525b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("perThread").toUpperCase()}
          </text>
          <g transform="translate(14, 174)">
            <rect width="192" height="36" rx="4" fill="#1a1508" stroke="#854d0e" />
            <text x="10" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("jvmStack")}</text>
          </g>
          <g transform="translate(14, 216)">
            <rect width="192" height="36" rx="4" fill="#1a1508" stroke="#854d0e" />
            <text x="10" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("pc")}</text>
          </g>
          <g transform="translate(14, 258)">
            <rect width="192" height="36" rx="4" fill="#1a1508" stroke="#854d0e" />
            <text x="10" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("native")}</text>
          </g>
        </g>

        {/* Arrow RDA <-> Exec Engine */}
        <line x1="480" y1="200" x2="512" y2="200" stroke="#52525b" strokeWidth="1" markerEnd="url(#jvm-arrow)" />

        {/* Column 3: Execution Engine */}
        <g transform="translate(516, 54)">
          <rect width="168" height="310" rx="6" fill="#18181b" stroke="#27272a" />
          <rect width="168" height="24" rx="6" fill="#241a0d" />
          <text x="12" y="16" fontSize="10" fill="#f59e0b" letterSpacing="1.5" fontFamily="Inter, sans-serif">
            {T("execEngine").toUpperCase()}
          </text>

          <g transform="translate(16, 50)">
            <rect width="136" height="56" rx="4" fill="#0f0a0d" stroke="#451a03" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("interpreter")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">Tier 0</text>
          </g>
          <g transform="translate(16, 118)">
            <rect width="136" height="56" rx="4" fill="#0f0a0d" stroke="#451a03" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("jit")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">Tier 1–4, OSR</text>
          </g>
          <g transform="translate(16, 186)">
            <rect width="136" height="56" rx="4" fill="#0f0a0d" stroke="#451a03" />
            <text x="12" y="22" fontSize="11" fill="#fafafa" fontFamily="Inter, sans-serif">{T("gc")}</text>
            <text x="12" y="40" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">G1 / ZGC / Parallel</text>
          </g>
        </g>

        {/* Bottom caption */}
        <text x="360" y="392" fontSize="10" fill="#52525b" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          java MyApp  →  Class Loader  →  Runtime Data Areas  ↔  Execution Engine
        </text>
      </svg>
    </figure>
  );
}
