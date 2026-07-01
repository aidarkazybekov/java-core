"use client";
import { annotateTerms } from "@/lib/key-terms";
import { localized } from "@/lib/i18n";
import type { KeyTerm } from "@/lib/types";

export default function KeyTermText({
  text,
  keyTerms,
  locale,
}: {
  text: string;
  keyTerms: KeyTerm[];
  locale: "ru" | "en";
}) {
  if (keyTerms.length === 0) return <>{text}</>;
  const defByTerm = new Map(keyTerms.map((k) => [k.term.toLowerCase(), localized(k.definition, locale)]));
  const segs = annotateTerms(text, keyTerms.map((k) => k.term));
  return (
    <>
      {segs.map((s, i) =>
        s.term ? (
          <span
            key={i}
            title={defByTerm.get(s.term.toLowerCase()) ?? ""}
            className="border-b border-dashed border-accent-green/60 cursor-help"
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </>
  );
}
