"use client";

import { ROADMAP } from "@/data/roadmap";
import { useLocale } from "@/lib/i18n";

interface BlockGridProps {
  completed: Set<string>;
  onSelectTopic: (topicId: string) => void;
}

export default function BlockGrid({ completed, onSelectTopic }: BlockGridProps) {
  const { locale } = useLocale();
  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ROADMAP.map((block) => {
        const doneCount = block.topics.filter((t) => completed.has(t.id)).length;
        const pct = Math.round((doneCount / block.topics.length) * 100);
        const allDone = doneCount === block.topics.length;
        const inProgress = doneCount > 0 && !allDone;

        const resumeTarget =
          block.topics.find((t) => !completed.has(t.id)) ?? block.topics[0];

        return (
          <button
            key={block.id}
            onClick={() => onSelectTopic(resumeTarget.id)}
            className={`text-left rounded-lg border p-4 transition-colors ${
              allDone
                ? "border-accent-green/40 bg-accent-green/5 hover:border-accent-green/70"
                : inProgress
                ? "border-accent-cyan/30 bg-bg-card hover:border-accent-cyan/60"
                : "border-border bg-bg-card hover:border-text-muted"
            }`}
            aria-label={`${block.title} — ${pct}% ${L("завершено", "complete")}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl leading-none mt-0.5" aria-hidden="true">
                {block.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text-muted tracking-[2px] uppercase">
                  {L("Блок", "Block")} {block.id}
                </div>
                <div className="text-sm font-semibold text-text-primary truncate">
                  {block.title}
                </div>
              </div>
              <div
                className={`text-xs shrink-0 font-mono tabular-nums ${
                  allDone
                    ? "text-accent-green"
                    : inProgress
                    ? "text-accent-cyan"
                    : "text-text-muted"
                }`}
              >
                {pct}%
              </div>
            </div>

            <div className="mt-3 h-1 rounded-sm bg-bg-elevated overflow-hidden">
              <div
                className={`h-full transition-[width] duration-300 ${
                  allDone ? "bg-accent-green" : "bg-accent-cyan"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1" aria-hidden="true">
              {block.topics.map((t) => {
                const done = completed.has(t.id);
                return (
                  <div
                    key={t.id}
                    className={`w-1.5 h-1.5 rounded-full ${
                      done ? "bg-accent-green" : "bg-border"
                    }`}
                    title={t.title}
                  />
                );
              })}
            </div>

            <div className="mt-2 text-[10px] text-text-muted">
              {doneCount} / {block.topics.length}{" "}
              {L("тем", "topics")}
            </div>
          </button>
        );
      })}
    </div>
  );
}
