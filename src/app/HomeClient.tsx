"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProgressState } from "@/lib/types";
import { loadProgress, saveProgress } from "@/lib/progress";
import { getDueCards, updateSRState } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROADMAP } from "@/data/roadmap";
import { getTopicContent } from "@/data/content";
import Sidebar from "@/components/Sidebar";
import RoadmapGraph from "@/components/RoadmapGraph";
import SearchDialog from "@/components/SearchDialog";
import QuizMode from "@/components/QuizMode";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";

export default function HomeClient() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [showReview, setShowReview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<
    { question: { id: string; q: string; a: string; difficulty: "junior" | "mid" | "senior" }; topicTitle: string; blockTitle: string }[]
  >([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Global Cmd+K for search, ? for shortcuts help
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (typing) return;
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const completed = new Set(progress.completed);
  const dueCards = getDueCards(progress);

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  const handleRate = useCallback(
    (questionId: string, quality: number) => {
      setProgress((prev) => {
        const updated = updateSRState(prev, questionId, quality);
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const startQuiz = async () => {
    // Gather random questions from all loaded content
    const allQuestions: typeof quizQuestions = [];
    for (const block of ROADMAP) {
      for (const topic of block.topics) {
        try {
          const content = await getTopicContent(topic.id);
          if (content) {
            for (const q of content.interviewQs) {
              allQuestions.push({
                question: q,
                topicTitle: content.title,
                blockTitle: block.title,
              });
            }
          }
        } catch {
          // Skip topics that fail to load
        }
      }
    }
    // Shuffle and take 15
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 15);
    setQuizQuestions(shuffled);
    setQuizActive(true);
  };

  if (quizActive && quizQuestions.length > 0) {
    return (
      <QuizMode
        questions={quizQuestions}
        onRate={handleRate}
        onClose={() => setQuizActive(false)}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Search dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTopic={handleSelectTopic}
      />

      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Mobile header bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="text-sm font-semibold text-text-primary">Java Core</div>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <Sidebar
        completed={completed}
        selectedTopicId={null}
        dueCount={dueCards.length}
        onSelectTopic={handleSelectTopic}
        onReviewClick={() => setShowReview(!showReview)}
        mobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`flex-1 overflow-auto ${isMobile ? "pt-14" : ""}`}>
        {showReview && dueCards.length > 0 ? (
          <div className="p-4 sm:p-8 max-w-[700px] mx-auto">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              🔄 Cards Due for Review
            </h2>
            <div className="space-y-3">
              {dueCards.map((card) => {
                const topicId = card.questionId.split("-q")[0];
                return (
                  <button
                    key={card.questionId}
                    onClick={() => router.push(`/topic/${topicId}`)}
                    className="w-full text-left p-4 rounded-lg bg-bg-card border border-border hover:border-accent-amber/50 transition-colors"
                  >
                    <div className="text-sm text-text-secondary">
                      {card.questionId}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      Due: {card.nextReview} · Interval: {card.interval}d
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center pt-8 sm:pt-12 pb-4 px-4">
              <div className="text-5xl mb-4">☕</div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                Java Core — Interview Prep
              </h1>
              <p className="text-sm text-text-muted mt-2 max-w-md mx-auto leading-relaxed">
                Click any topic node to start learning. Your progress is saved
                automatically.
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border hover:border-text-muted transition-colors text-sm text-text-muted"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Search
                  <kbd className="text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded border border-border ml-1">⌘K</kbd>
                </button>
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors text-sm"
                >
                  🎯 Quiz Mode
                </button>
              </div>

              {progress.streak > 0 && (
                <div className="mt-4 text-xs text-accent-amber">
                  🔥 {progress.streak} day streak
                </div>
              )}
            </div>
            <RoadmapGraph
              completed={completed}
              selectedTopicId={null}
              onSelectTopic={handleSelectTopic}
            />
          </>
        )}
      </main>
    </div>
  );
}
