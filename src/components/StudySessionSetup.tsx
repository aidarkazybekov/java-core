"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import { SessionConfig } from "@/lib/study-session";

interface Props {
  open: boolean;
  onClose: () => void;
  onStart: (config: SessionConfig) => void;
}

const DURATIONS_MIN = [15, 25, 45, 60] as const;
const GOALS = [null, 1, 3, 5] as const;

export default function StudySessionSetup({ open, onClose, onStart }: Props) {
  const { locale } = useLocale();
  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);
  const [duration, setDuration] = useState<number>(25);
  const [goal, setGoal] = useState<number | null>(3);

  const handleStart = () => {
    onStart({ durationMs: duration * 60 * 1000, goalTopics: goal });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={L("Начать сессию", "Start a study session")}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[14%] left-1/2 -translate-x-1/2 w-[min(92vw,440px)] z-50 rounded-xl border border-border bg-bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="text-sm font-semibold text-text-primary">
                🎯 {L("Учебная сессия", "Study session")}
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-secondary"
                aria-label={L("Закрыть", "Close")}
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                {L(
                  "Сфокусированный режим: таймер в углу экрана и счётчик пройденных тем. По окончании — итог.",
                  "A focused mode: a small timer sits in the corner and counts topics you mark done. A summary appears at the end."
                )}
              </p>

              <div>
                <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                  {L("Длительность", "Duration")}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATIONS_MIN.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      aria-pressed={duration === d}
                      className={`py-2 rounded-md text-[12px] border transition-colors ${
                        duration === d
                          ? "border-accent-green bg-accent-green/10 text-accent-green"
                          : "border-border bg-bg-elevated text-text-secondary hover:border-text-muted"
                      }`}
                    >
                      {d} {L("мин", "min")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                  {L("Цель по темам", "Topic goal")}
                  <span className="ml-2 normal-case tracking-normal">
                    ({L("опционально", "optional")})
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {GOALS.map((g) => (
                    <button
                      key={g ?? "none"}
                      onClick={() => setGoal(g)}
                      aria-pressed={goal === g}
                      className={`py-2 rounded-md text-[12px] border transition-colors ${
                        goal === g
                          ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                          : "border-border bg-bg-elevated text-text-secondary hover:border-text-muted"
                      }`}
                    >
                      {g === null ? L("без цели", "no goal") : g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-[12px] text-text-muted hover:text-text-secondary"
              >
                {L("Отмена", "Cancel")}
              </button>
              <button
                onClick={handleStart}
                className="px-4 py-1.5 rounded-md text-[12px] bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors"
              >
                ▶ {L("Начать", "Start")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
