"use client";
import KeyTermText from "./KeyTermText";
import type { KeyTerm } from "@/lib/types";

export default function Analogy({ text, keyTerms, locale }: { text: string; keyTerms: KeyTerm[]; locale: "ru" | "en" }) {
  return (
    <p className="italic text-[13px] leading-[1.7] text-text-muted">
      <span className="not-italic text-text-secondary font-medium">{locale === "ru" ? "Представь: " : "Think of it like: "}</span>
      <KeyTermText text={text} keyTerms={keyTerms} locale={locale} />
    </p>
  );
}
