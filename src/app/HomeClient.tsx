"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressState } from "@/lib/types";
import { loadProgress } from "@/lib/progress";
import { getDueCards } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import Sidebar from "@/components/Sidebar";
import RoadmapGraph from "@/components/RoadmapGraph";

export default function HomeClient() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [showReview, setShowReview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const completed = new Set(progress.completed);
  const dueCards = getDueCards(progress);

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
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
          <div className="w-5" />
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
              {progress.streak > 0 && (
                <div className="mt-3 text-xs text-accent-amber">
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
