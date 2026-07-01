"use client";
import { localized } from "@/lib/i18n";
import type { KeyTerm } from "@/lib/types";

export default function Glossary({ terms, locale }: { terms: KeyTerm[]; locale: "ru" | "en" }) {
  if (terms.length === 0) return null;
  return (
    <div>
      <div className="text-[9.5px] tracking-[2px] uppercase text-text-muted mb-2">
        {locale === "ru" ? "Ключевые термины" : "Key terms"}
      </div>
      <dl className="space-y-2">
        {terms.map((k) => (
          <div key={k.term} className="text-[12.5px] leading-[1.6]">
            <dt className="inline text-accent-green font-medium">{k.term}</dt>
            <dd className="inline text-text-secondary"> — {localized(k.definition, locale)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
