"use client";
import KeyTermText from "./KeyTermText";
import type { KeyTerm } from "@/lib/types";

export default function Gotcha({ text, keyTerms, locale }: { text: string; keyTerms: KeyTerm[]; locale: "ru" | "en" }) {
  return (
    <div className="flex gap-2.5 rounded-md border border-[#2e2712] bg-[#15130a] px-3.5 py-3 text-[12.5px] leading-[1.7] text-text-secondary">
      <span className="text-accent-amber" aria-hidden="true">⚠</span>
      <span>
        <span className="text-accent-amber font-semibold">{locale === "ru" ? "Подвох — " : "Gotcha — "}</span>
        <KeyTermText text={text} keyTerms={keyTerms} locale={locale} />
      </span>
    </div>
  );
}
