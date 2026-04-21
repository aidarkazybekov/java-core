"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import { useStudySession, formatMs } from "@/lib/study-session";
import { loadProgress } from "@/lib/progress";

interface Props {
  completedNow?: string[];
}

export default function StudySessionOverlay({ completedNow }: Props) {
  const { locale } = useLocale();
  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);
  const { active, remainingMs, isFinished, end } = useStudySession();
  const [showSummary, setShowSummary] = useState(false);
  const [justDone, setJustDone] = useState<string[]>([]);

  // Recompute how many new topics have been marked done since the session
  // started. Falls back to reading progress from localStorage if the caller
  // didn't pass it (i.e. on pages without a local progress state).
  useEffect(() => {
    if (!active) {
      setJustDone([]);
      return;
    }
    const done = completedNow ?? loadProgress().completed;
    const initial = new Set(active.initialDoneIds);
    setJustDone(done.filter((id) => !initial.has(id)));
  }, [active, completedNow]);

  useEffect(() => {
    if (isFinished && !showSummary) setShowSummary(true);
  }, [isFinished, showSummary]);

  if (!active) return null;

  const goal = active.goalTopics;
  const pct = goal ? Math.min(1, justDone.length / goal) : 0;

  return (
    <>
      {/* Floating pill (top-right, leaves bottom-right for Ask Deeper) */}
      <div className="fixed top-4 right-4 z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto rounded-lg border border-border bg-bg-card/95 backdrop-blur-sm shadow-xl px-3 py-2 min-w-[180px]"
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-[10px] text-accent-green tracking-[2px] uppercase">
                {L("Сессия", "Session")}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm(L("Завершить сессию?", "End the session?"))) end();
              }}
              className="text-[10px] text-text-muted hover:text-text-secondary tracking-wider uppercase"
            >
              {L("Стоп", "End")}
            </button>
          </div>
          <div className="text-xl font-mono tabular-nums text-text-primary">
            {formatMs(remainingMs)}
          </div>
          {goal !== null && (
            <>
              <div className="h-1 mt-2 rounded-sm bg-bg-elevated overflow-hidden">
                <div
                  className="h-full bg-accent-cyan transition-[width] duration-300"
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-text-muted mt-1 font-mono tabular-nums">
                {justDone.length} / {goal} {L("тем", "topics")}
              </div>
            </>
          )}
          {goal === null && (
            <div className="text-[10px] text-text-muted mt-1 font-mono tabular-nums">
              {justDone.length} {L("пройдено", "done")}
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary dialog when timer hits 0 */}
      <AnimatePresence>
        {showSummary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={L("Итоги сессии", "Session summary")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[min(92vw,440px)] z-50 rounded-xl border border-border bg-bg-card shadow-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">
                {goal && justDone.length >= goal
                  ? "🎉"
                  : justDone.length > 0
                  ? "💪"
                  : "⏰"}
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">
                {L("Сессия завершена", "Session complete")}
              </h2>
              <p className="text-sm text-text-muted mb-5">
                {L("Время вышло — отличная работа!", "Time's up — great work!")}
              </p>

              <div className="grid grid-cols-2 gap-3 text-left mb-5">
                <div className="rounded-md border border-border bg-bg-elevated p-3">
                  <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
                    {L("Пройдено", "Topics done")}
                  </div>
                  <div className="text-2xl font-bold text-accent-green tabular-nums">
                    {justDone.length}
                  </div>
                  {goal !== null && (
                    <div className="text-[10px] text-text-muted">
                      / {goal} {L("цель", "goal")}
                    </div>
                  )}
                </div>
                <div className="rounded-md border border-border bg-bg-elevated p-3">
                  <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
                    {L("Длительность", "Duration")}
                  </div>
                  <div className="text-2xl font-bold text-text-primary tabular-nums">
                    {Math.round(active.durationMs / 60000)}
                  </div>
                  <div className="text-[10px] text-text-muted">{L("мин", "min")}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSummary(false);
                  end();
                }}
                className="w-full px-4 py-2 rounded-md bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors text-sm"
              >
                {L("Закрыть", "Close")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
