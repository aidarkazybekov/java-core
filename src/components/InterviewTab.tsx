"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent, ProgressState, InterviewQuestion } from "@/lib/types";
import { localized, t, useLocale } from "@/lib/i18n";
import Markdown from "./Markdown";

interface InterviewTabProps {
  content: TopicContent;
  progress: ProgressState;
  onRate: (questionId: string, quality: number) => void;
}

type Difficulty = "junior" | "mid" | "senior";
type Filter = "all" | Difficulty;

const DIFFICULTY_META: Record<Difficulty, { stripe: string; label: string; dot: string; glow: string }> = {
  junior: {
    stripe: "border-l-accent-green",
    label: "text-accent-green",
    dot: "bg-accent-green",
    glow: "shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]",
  },
  mid: {
    stripe: "border-l-accent-amber",
    label: "text-accent-amber",
    dot: "bg-accent-amber",
    glow: "shadow-[inset_0_0_0_1px_rgba(251,191,36,0.15)]",
  },
  senior: {
    stripe: "border-l-accent-red",
    label: "text-accent-red",
    dot: "bg-accent-red",
    glow: "shadow-[inset_0_0_0_1px_rgba(248,113,113,0.15)]",
  },
};

export default function InterviewTab({ content, progress, onRate }: InterviewTabProps) {
  const { locale } = useLocale();
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [rated, setRated] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");

  const grouped = useMemo(() => {
    const by: Record<Difficulty, InterviewQuestion[]> = { junior: [], mid: [], senior: [] };
    content.interviewQs.forEach((q) => by[q.difficulty].push(q));
    return by;
  }, [content.interviewQs]);

  const ratingButtons = [
    { label: t("again", locale), quality: 0, color: "bg-accent-red/10 border-accent-red/30 text-accent-red" },
    { label: t("hard", locale), quality: 3, color: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber" },
    { label: t("good", locale), quality: 4, color: "bg-accent-green/10 border-accent-green/30 text-accent-green" },
    { label: t("easy", locale), quality: 5, color: "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" },
  ];

  const difficultyLabel = (d: Difficulty): string => {
    if (d === "junior") return t("difficultyJunior", locale);
    if (d === "mid") return t("difficultyMid", locale);
    return t("difficultySenior", locale);
  };

  const handleRate = (questionId: string, quality: number) => {
    onRate(questionId, quality);
    setRated((prev) => new Set(prev).add(questionId));
  };

  const reveal = (id: string) => setRevealed((prev) => new Set(prev).add(id));

  const sections: Difficulty[] = filter === "all" ? ["junior", "mid", "senior"] : [filter];
  const total = content.interviewQs.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase">
          {t("clickToReveal", locale)}
        </div>
        <div
          role="group"
          aria-label={locale === "ru" ? "Фильтр по сложности" : "Difficulty filter"}
          className="flex items-center gap-1 p-0.5 rounded-md bg-bg-elevated border border-border"
        >
          {(["all", "junior", "mid", "senior"] as Filter[]).map((f) => {
            const count = f === "all" ? total : grouped[f].length;
            const active = filter === f;
            const tone =
              f === "all"
                ? "text-text-secondary"
                : f === "junior"
                ? "text-accent-green"
                : f === "mid"
                ? "text-accent-amber"
                : "text-accent-red";
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-sm transition-colors ${
                  active ? `bg-bg-card ${tone}` : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {f === "all"
                  ? locale === "ru"
                    ? "ВСЕ"
                    : "ALL"
                  : difficultyLabel(f)}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {sections.map((diff) => {
        const qs = grouped[diff];
        if (qs.length === 0) return null;
        const meta = DIFFICULTY_META[diff];
        return (
          <section key={diff} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              <div className={`text-[10px] tracking-[2px] uppercase ${meta.label}`}>
                {difficultyLabel(diff)}
                <span className="ml-2 text-text-muted normal-case tracking-normal">
                  {qs.length}
                </span>
              </div>
            </div>

            {qs.map((item) => {
              const globalIdx = content.interviewQs.indexOf(item);
              const isRevealed = revealed.has(item.id);
              const isRated = rated.has(item.id);
              const srCard = progress.srState[item.id];
              const qText = localized(item.q, locale);
              const aText = localized(item.a, locale);

              return (
                <div
                  key={item.id}
                  className={`rounded-lg overflow-hidden border border-border border-l-[3px] ${meta.stripe} bg-bg-card ${meta.glow}`}
                >
                  <div className="p-4 flex gap-3 items-start">
                    <span className={`text-xs shrink-0 mt-0.5 font-mono ${meta.label}`}>
                      Q{globalIdx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-text-primary leading-relaxed">
                        <Markdown>{qText}</Markdown>
                      </div>
                    </div>
                  </div>

                  {!isRevealed ? (
                    <button
                      onClick={() => reveal(item.id)}
                      className="w-full py-2.5 border-t border-border bg-bg-elevated text-text-muted text-[11px] tracking-wider hover:text-text-secondary hover:bg-[#1c1c22] transition-colors"
                    >
                      {t("reveal", locale)}
                    </button>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-border"
                      >
                        <div className="p-4 bg-[#0f1a0f]">
                          <div className="text-[11px] text-text-muted mb-1.5 tracking-wider">A.</div>
                          <div className="text-[13px] text-[#bbf7d0] leading-[1.75]">
                            <Markdown>{aText}</Markdown>
                          </div>
                        </div>

                        {!isRated ? (
                          <div className="px-4 py-3 border-t border-border bg-bg-elevated flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-text-muted mr-2">
                              {t("rate", locale)}
                            </span>
                            {ratingButtons.map((btn) => (
                              <button
                                key={btn.quality}
                                onClick={() => handleRate(item.id, btn.quality)}
                                className={`px-3 py-1 text-[11px] rounded-sm border ${btn.color} hover:opacity-80 transition-opacity`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-2 border-t border-border bg-bg-elevated text-[11px] text-text-muted">
                            {t("rated", locale)} —{" "}
                            {srCard
                              ? `${t("nextReviewIn", locale)} ${srCard.interval} ${t("days", locale)}`
                              : t("saved", locale)}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
