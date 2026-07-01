"use client";
import KeyTermText from "./KeyTermText";
import type { KeyTerm } from "@/lib/types";

export default function TldrLead({ text, keyTerms, locale }: { text: string; keyTerms: KeyTerm[]; locale: "ru" | "en" }) {
  return (
    <p className="text-[15px] leading-[1.65] text-text-primary pl-3.5 border-l-2 border-accent-green">
      <KeyTermText text={text} keyTerms={keyTerms} locale={locale} />
    </p>
  );
}
