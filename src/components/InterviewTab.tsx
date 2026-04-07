"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent, ProgressState } from "@/lib/types";

interface InterviewTabProps {
  content: TopicContent;
  progress: ProgressState;
  onRate: (questionId: string, quality: number) => void;
}

const DIFFICULTY_COLORS = {
  junior: "text-accent-green",
  mid: "text-accent-amber",
  senior: "text-accent-red",
};

const RATING_BUTTONS = [
  { label: "Again", quality: 0, color: "bg-accent-red/10 border-accent-red/30 text-accent-red" },
  { label: "Hard", quality: 3, color: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber" },
  { label: "Good", quality: 4, color: "bg-accent-green/10 border-accent-green/30 text-accent-green" },
  { label: "Easy", quality: 5, color: "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" },
];

export default function InterviewTab({ content, progress, onRate }: InterviewTabProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [rated, setRated] = useState<Set<string>>(new Set());

  const revealAnswer = (idx: number) => {
    setRevealed((prev) => new Set(prev).add(idx));
  };

  const handleRate = (questionId: string, quality: number) => {
    onRate(questionId, quality);
    setRated((prev) => new Set(prev).add(questionId));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
        Click to reveal answers — then rate your confidence
      </div>
      {content.interviewQs.map((item, idx) => {
        const isRevealed = revealed.has(idx);
        const isRated = rated.has(item.id);
        const srCard = progress.srState[item.id];

        return (
          <div key={item.id} className="rounded-lg overflow-hidden border border-border bg-bg-card">
            <div className="p-4 flex gap-3 items-start">
              <span className="text-accent-green text-xs shrink-0 mt-0.5">Q{idx + 1}.</span>
              <div className="flex-1">
                <p className="text-[13px] text-text-primary leading-relaxed">{item.q}</p>
                <span className={`text-[10px] mt-1 inline-block ${DIFFICULTY_COLORS[item.difficulty]}`}>
                  {item.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {!isRevealed ? (
              <button
                onClick={() => revealAnswer(idx)}
                className="w-full py-2.5 border-t border-border bg-bg-elevated text-text-muted text-[11px] tracking-wider hover:text-text-secondary hover:bg-[#1c1c22] transition-colors"
              >
                ▶ REVEAL ANSWER
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-border"
                >
                  <div className="p-4 bg-[#0f1a0f]">
                    <span className="text-text-muted text-[11px] mr-2">A.</span>
                    <span className="text-[13px] text-[#86efac] leading-[1.7]">{item.a}</span>
                  </div>

                  {!isRated ? (
                    <div className="px-4 py-3 border-t border-border bg-bg-elevated flex items-center gap-2">
                      <span className="text-[10px] text-text-muted mr-2">Rate:</span>
                      {RATING_BUTTONS.map((btn) => (
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
                      Rated — {srCard ? `next review in ${srCard.interval} day(s)` : "saved"}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
