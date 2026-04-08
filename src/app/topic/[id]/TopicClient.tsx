"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { loadProgress, saveProgress, toggleComplete } from "@/lib/progress";
import { updateSRState, getDueCards } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROADMAP } from "@/data/roadmap";
import Sidebar from "@/components/Sidebar";
import TopicContentView from "@/components/TopicContent";
import AskDeeper from "@/components/AskDeeper";

interface TopicClientProps {
  content: TopicContentType;
  blockTitle: string;
  highlightedCode: string;
}

// Flatten all topics into a single ordered list for prev/next navigation
const allTopics = ROADMAP.flatMap((block) =>
  block.topics.map((t) => ({ id: t.id, title: t.title }))
);

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

  // Compute prev/next topics
  const { prevTopic, nextTopic } = useMemo(() => {
    const idx = allTopics.findIndex((t) => t.id === content.id);
    return {
      prevTopic: idx > 0 ? allTopics[idx - 1] : null,
      nextTopic: idx < allTopics.length - 1 ? allTopics[idx + 1] : null,
    };
  }, [content.id]);

  const handleMarkDone = () => {
    setProgress((prev) => toggleComplete(prev, content.id));
  };

  const handleRate = (questionId: string, quality: number) => {
    setProgress((prev) => updateSRState(prev, questionId, quality));
  };

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  // Keyboard shortcuts: arrow left/right for prev/next
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && prevTopic) {
        router.push(`/topic/${prevTopic.id}`);
      } else if (e.key === "ArrowRight" && nextTopic) {
        router.push(`/topic/${nextTopic.id}`);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevTopic, nextTopic, router]);

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
          prevTopic={prevTopic}
          nextTopic={nextTopic}
          onMarkDone={handleMarkDone}
          onRate={handleRate}
          onNavigate={handleSelectTopic}
        />
        <AskDeeper topicTitle={content.title} content={content} />
      </div>
    </div>
  );
}
