"use client";
import { useMemo, useState } from "react";
import { localized, t, useLocale } from "@/lib/i18n";
import { sampleQuizQuestions } from "@/lib/quiz-sample";
import type { InterviewQuestion } from "@/lib/types";
import Markdown from "../Markdown";

const RATINGS = [
  { key: "again" as const, quality: 0, cls: "text-accent-red border-accent-red/30 bg-accent-red/10" },
  { key: "hard" as const, quality: 3, cls: "text-accent-amber border-accent-amber/30 bg-accent-amber/10" },
  { key: "good" as const, quality: 4, cls: "text-accent-green border-accent-green/30 bg-accent-green/10" },
  { key: "easy" as const, quality: 5, cls: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10" },
];

export default function MiniQuiz({
  questions,
  onRate,
  anchorRef,
}: {
  questions: InterviewQuestion[];
  onRate: (id: string, quality: number) => void;
  locale: "ru" | "en";
  anchorRef?: React.Ref<HTMLDivElement>;
}) {
  const { locale } = useLocale();
  const items = useMemo(() => sampleQuizQuestions(questions, 3), [questions]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [rated, setRated] = useState<Set<string>>(new Set());
  if (items.length === 0) return null;

  return (
    <div ref={anchorRef} className="rounded-md border border-border bg-bg-card p-3.5 scroll-mt-28">
      <div className="text-[9.5px] tracking-[2px] uppercase text-text-muted mb-3">
        {locale === "ru" ? `Мини-квиз · ${items.length} вопр.` : `Mini-quiz · ${items.length} questions`}
      </div>
      <div className="flex flex-col gap-3">
        {items.map((q, i) => {
          const isOpen = revealed.has(q.id);
          const isRated = rated.has(q.id);
          return (
            <div key={q.id} className="border-t border-border first:border-t-0 pt-3 first:pt-0">
              <div className="text-[13px] text-text-primary mb-1.5">
                <span className="text-text-muted mr-1.5">{i + 1}.</span>
                {localized(q.q, locale)}
              </div>
              {!isOpen ? (
                <button
                  type="button"
                  onClick={() => setRevealed((p) => new Set(p).add(q.id))}
                  className="text-[11px] text-accent-green hover:underline"
                >
                  {t("reveal", locale)}
                </button>
              ) : (
                <>
                  <div className="text-[12.5px] text-text-secondary [&_p]:mb-1.5">
                    <Markdown>{localized(q.a, locale)}</Markdown>
                  </div>
                  {!isRated && (
                    <div className="flex gap-1.5 mt-2">
                      {RATINGS.map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => {
                            onRate(q.id, r.quality);
                            setRated((p) => new Set(p).add(q.id));
                          }}
                          className={`px-2.5 py-1 rounded border text-[10px] ${r.cls}`}
                        >
                          {t(r.key, locale)}
                        </button>
                      ))}
                    </div>
                  )}
                  {isRated && (
                    <div className="text-[10px] text-text-muted mt-1.5">{t("rated", locale)} ✓</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
