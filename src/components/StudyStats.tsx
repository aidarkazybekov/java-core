"use client";

import { TopicContent, ProgressState } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

interface StudyStatsProps {
  content: TopicContent;
  progress: ProgressState;
  isDone: boolean;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function StudyStats({ content, progress, isDone }: StudyStatsProps) {
  const { locale } = useLocale();

  const byDifficulty = {
    junior: content.interviewQs.filter((q) => q.difficulty === "junior").length,
    mid: content.interviewQs.filter((q) => q.difficulty === "mid").length,
    senior: content.interviewQs.filter((q) => q.difficulty === "senior").length,
  };

  const topicCards = content.interviewQs
    .map((q) => progress.srState[q.id])
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const ratedCount = topicCards.length;
  const dueNow = topicCards.filter((c) => daysUntil(c.nextReview) <= 0).length;

  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);

  return (
    <aside
      aria-label={L("Статистика темы", "Topic stats")}
      className="mt-6 rounded-lg border border-border bg-bg-card px-3 py-3 text-[11px] leading-[1.5]"
    >
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2.5">
        {L("Статистика темы", "Topic stats")}
      </div>

      <dl className="space-y-1.5">
        <div className="flex items-center justify-between">
          <dt className="text-text-muted">{L("Статус", "Status")}</dt>
          <dd className={isDone ? "text-accent-green" : "text-text-secondary"}>
            {isDone ? L("✓ Пройдена", "✓ Done") : L("В процессе", "In progress")}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-text-muted">{L("Всего вопросов", "Questions")}</dt>
          <dd className="text-text-secondary">{content.interviewQs.length}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-text-muted">{L("Оценено", "Rated")}</dt>
          <dd className="text-text-secondary">
            {ratedCount}
            <span className="text-text-muted"> / {content.interviewQs.length}</span>
          </dd>
        </div>

        {dueNow > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">{L("К повтору", "Due now")}</dt>
            <dd className="text-accent-amber">{dueNow}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1.5">
          {L("По сложности", "By difficulty")}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="flex-1 flex h-1.5 rounded-sm overflow-hidden bg-bg-elevated"
            role="img"
            aria-label={`${byDifficulty.junior} junior, ${byDifficulty.mid} mid, ${byDifficulty.senior} senior`}
          >
            {byDifficulty.junior > 0 && (
              <div className="bg-accent-green" style={{ flex: byDifficulty.junior }} />
            )}
            {byDifficulty.mid > 0 && (
              <div className="bg-accent-amber" style={{ flex: byDifficulty.mid }} />
            )}
            {byDifficulty.senior > 0 && (
              <div className="bg-accent-red" style={{ flex: byDifficulty.senior }} />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[10px]">
          <span className="text-accent-green">J {byDifficulty.junior}</span>
          <span className="text-accent-amber">M {byDifficulty.mid}</span>
          <span className="text-accent-red">S {byDifficulty.senior}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border text-[10px] text-text-muted leading-[1.6]">
        {L(
          "Нажмите ? для клавиатурных сокращений",
          "Press ? for keyboard shortcuts"
        )}
      </div>
    </aside>
  );
}
