"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { loadProgress, saveProgress, toggleComplete } from "@/lib/progress";
import { updateSRState, getDueCards } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import Sidebar from "@/components/Sidebar";
import TopicContentView from "@/components/TopicContent";
import AskDeeper from "@/components/AskDeeper";

interface TopicClientProps {
  content: TopicContentType;
  blockTitle: string;
  highlightedCode: string;
}

export default function TopicClient({
  content,
  blockTitle,
  highlightedCode,
}: TopicClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completed = new Set(progress.completed);
  const dueCount = getDueCards(progress).length;

  const handleMarkDone = () => {
    setProgress((prev) => toggleComplete(prev, content.id));
  };

  const handleRate = (questionId: string, quality: number) => {
    setProgress((prev) => updateSRState(prev, questionId, quality));
  };

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
          <div className="text-sm font-semibold text-text-primary truncate mx-4">
            {content.title}
          </div>
          <div className="w-5" />
        </div>
      )}

      <Sidebar
        completed={completed}
        selectedTopicId={content.id}
        dueCount={dueCount}
        onSelectTopic={handleSelectTopic}
        onReviewClick={() => router.push("/")}
        mobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`flex-1 flex flex-col overflow-hidden ${isMobile ? "pt-14" : ""}`}>
        <TopicContentView
          content={content}
          blockTitle={blockTitle}
          isDone={completed.has(content.id)}
          highlightedCode={highlightedCode}
          progress={progress}
          onMarkDone={handleMarkDone}
          onRate={handleRate}
        />
        <AskDeeper topicTitle={content.title} content={content} />
      </div>
    </div>
  );
}
