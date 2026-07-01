"use client";
import KeyTermText from "./KeyTermText";
import type { KeyTerm } from "@/lib/types";

export default function Recap({ text, keyTerms, locale }: { text: string; keyTerms: KeyTerm[]; locale: "ru" | "en" }) {
  return (
    <div className="text-[12.5px] leading-[1.7] text-text-secondary">
      <span className="block text-[9.5px] tracking-[2px] uppercase text-accent-green mb-1">
        {locale === "ru" ? "Итог" : "Recap"}
      </span>
      <KeyTermText text={text} keyTerms={keyTerms} locale={locale} />
    </div>
  );
}
