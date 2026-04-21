"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { loadProgress, saveProgress, toggleComplete } from "@/lib/progress";
import { updateSRState, getDueCards } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROADMAP } from "@/data/roadmap";
import Sidebar from "@/components/Sidebar";
import TopicContentView, { TabId } from "@/components/TopicContent";
import AskDeeper from "@/components/AskDeeper";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";

interface TopicClientProps {
  content: TopicContentType;
  blockId: number;
  blockTitle: string;
  blockIcon: string;
  topicIndexInBlock: number;
  blockTopicCount: number;
  highlightedCode: string;
}

const allTopics = ROADMAP.flatMap((block) =>
  block.topics.map((t) => ({
    id: t.id,
    title: t.title,
    blockId: block.id,
    blockTitle: block.title,
    blockIcon: block.icon,
  }))
);

export default function TopicClient({
  content,
  blockId,
  blockTitle,
  blockIcon,
  topicIndexInBlock,
  blockTopicCount,
  highlightedCode,
}: TopicClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("learn");
  const lastGAt = useRef<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completed = new Set(progress.completed);
  const dueCount = getDueCards(progress).length;

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // '?' toggles shortcut help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((p) => !p);
        return;
      }
      if (shortcutsOpen) return;

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowLeft" && prevTopic) {
        router.push(`/topic/${prevTopic.id}`);
        return;
      }
      if (e.key === "ArrowRight" && nextTopic) {
        router.push(`/topic/${nextTopic.id}`);
        return;
      }
      if (e.key === "1") setActiveTab("learn");
      else if (e.key === "2") setActiveTab("code");
      else if (e.key === "3") setActiveTab("interview");
      else if (e.key === "4") setActiveTab("spring");

      // g h chord → home
      if (e.key === "g") {
        lastGAt.current = Date.now();
        return;
      }
      if (
        e.key === "h" &&
        lastGAt.current &&
        Date.now() - lastGAt.current < 1000
      ) {
        lastGAt.current = null;
        router.push("/");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevTopic, nextTopic, router, shortcutsOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
          blockId={blockId}
          blockTitle={blockTitle}
          blockIcon={blockIcon}
          topicIndexInBlock={topicIndexInBlock}
          blockTopicCount={blockTopicCount}
          isDone={completed.has(content.id)}
          highlightedCode={highlightedCode}
          progress={progress}
          prevTopic={prevTopic}
          nextTopic={nextTopic}
          onMarkDone={handleMarkDone}
          onRate={handleRate}
          onNavigate={handleSelectTopic}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <AskDeeper topicTitle={content.title} content={content} />
      </div>

      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
