"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InterviewQuestion } from "@/lib/types";

interface QuizModeProps {
  questions: { question: InterviewQuestion; topicTitle: string; blockTitle: string }[];
  onRate: (questionId: string, quality: number) => void;
  onClose: () => void;
}

const RATING_BUTTONS = [
  { label: "Again", quality: 0, color: "bg-accent-red/10 border-accent-red/30 text-accent-red hover:bg-accent-red/20" },
  { label: "Hard", quality: 3, color: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber hover:bg-accent-amber/20" },
  { label: "Good", quality: 4, color: "bg-accent-green/10 border-accent-green/30 text-accent-green hover:bg-accent-green/20" },
  { label: "Easy", quality: 5, color: "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20" },
];

export default function QuizMode({ questions, onRate, onClose }: QuizModeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIdx];

  // Timer
  useEffect(() => {
    if (finished || revealed) return;
    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, revealed]);

  const handleRate = useCallback(
    (quality: number) => {
      onRate(current.question.id, quality);
      setScore((prev) => ({
        correct: prev.correct + (quality >= 4 ? 1 : 0),
        total: prev.total + 1,
      }));

      if (currentIdx + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrentIdx((prev) => prev + 1);
        setRevealed(false);
        setTimeLeft(30);
      }
    },
    [current, currentIdx, questions.length, onRate]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
      }
      if (revealed && !finished) {
        if (e.key === "1") handleRate(0);
        if (e.key === "2") handleRate(3);
        if (e.key === "3") handleRate(4);
        if (e.key === "4") handleRate(5);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [revealed, finished, handleRate, onClose]);

  if (finished) {
    const pct = questions.length > 0 ? Math.round((score.correct / questions.length) * 100) : 0;
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">{pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚"}</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Quiz Complete!</h2>
          <div className="text-4xl font-bold text-accent-green mb-2">{pct}%</div>
          <p className="text-text-muted mb-6">
            {score.correct}/{questions.length} questions rated Good or Easy
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors"
          >
            Back to Roadmap
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary transition-colors">
            ✕
          </button>
          <span className="text-sm text-text-muted">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm font-mono tabular-nums ${timeLeft <= 5 ? "text-accent-red" : "text-text-muted"}`}>
            {timeLeft}s
          </div>
          {/* Progress bar */}
          <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-green rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl w-full"
          >
            {/* Topic badge */}
            <div className="text-[11px] text-accent-cyan tracking-wide mb-4">
              {current.blockTitle} → {current.topicTitle}
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-text-primary leading-relaxed mb-8">
              {current.question.q}
            </h2>

            {/* Answer */}
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-4 rounded-lg border border-border bg-bg-card text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors text-sm"
              >
                Press Space or click to reveal answer
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-5 rounded-lg bg-[#0f1a0f] border border-[#1e3a2a] mb-6">
                  <p className="text-[14px] text-[#86efac] leading-[1.8]">{current.question.a}</p>
                </div>

                {/* Rating buttons */}
                <div className="flex items-center justify-center gap-3">
                  {RATING_BUTTONS.map((btn, i) => (
                    <button
                      key={btn.quality}
                      onClick={() => handleRate(btn.quality)}
                      className={`px-5 py-2.5 rounded-lg border text-sm transition-colors ${btn.color}`}
                    >
                      {btn.label}
                      <span className="ml-2 text-[10px] opacity-60">{i + 1}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer hints */}
      <div className="px-6 py-3 border-t border-border flex justify-center gap-6 text-[10px] text-text-muted">
        <span>Space — reveal</span>
        <span>1-4 — rate</span>
        <span>Esc — exit</span>
      </div>
    </div>
  );
}
