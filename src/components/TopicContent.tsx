"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { localized, useLocale } from "@/lib/i18n";
import LearnTab from "./LearnTab";
import CodeTab from "./CodeTab";
import InterviewTab from "./InterviewTab";
import SpringTab from "./SpringTab";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";

interface TopicNav {
  id: string;
  title: string;
}

interface TopicContentProps {
  content: TopicContentType;
  blockTitle: string;
  isDone: boolean;
  highlightedCode: string;
  prevTopic?: TopicNav | null;
  nextTopic?: TopicNav | null;
  onNavigate?: (topicId: string) => void;
  progress: ProgressState;
  onMarkDone: () => void;
  onRate: (questionId: string, quality: number) => void;
}

const TABS = [
  { id: "learn", label: "📖 Learn" },
  { id: "code", label: "💻 Code" },
  { id: "interview", label: "🎯 Interview" },
  { id: "spring", label: "🌱 Spring" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TopicContentView({
  content,
  blockTitle,
  isDone,
  highlightedCode,
  progress,
  prevTopic,
  nextTopic,
  onMarkDone,
  onRate,
  onNavigate,
}: TopicContentProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("learn");
  const scrollRef = useRef<HTMLDivElement>(null);

  const deepDiveMd = localized(content.deepDive, locale);
  const showToc = activeTab === "learn";

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto relative">
      <ReadingProgress scrollRef={scrollRef} />
      <div className="flex gap-8 p-4 sm:p-7">
        <div className="flex-1 min-w-0 max-w-[860px]">
          <div className="mb-6">
            <div className="text-[11px] text-accent-green tracking-[2px] uppercase mb-1.5">
              {blockTitle}
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text-primary">{content.title}</h1>
              <button
                onClick={onMarkDone}
                className={`px-4 py-1.5 rounded-md text-xs font-medium border transition-all shrink-0 ml-3 ${
                  isDone
                    ? "border-accent-green text-accent-green bg-accent-green/10"
                    : "border-border text-text-muted hover:border-text-muted hover:text-text-secondary"
                }`}
              >
                {isDone ? "✓ Done" : "Mark done"}
              </button>
            </div>
          </div>

          <div className="flex gap-1 mb-6 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "text-accent-green border-accent-green"
                    : "text-text-muted border-transparent hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "learn" && <LearnTab content={content} />}
              {activeTab === "code" && (
                <CodeTab content={content} highlightedCode={highlightedCode} />
              )}
              {activeTab === "interview" && (
                <InterviewTab content={content} progress={progress} onRate={onRate} />
              )}
              {activeTab === "spring" && <SpringTab content={content} />}
            </motion.div>
          </AnimatePresence>

          {onNavigate && (prevTopic || nextTopic) && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {prevTopic ? (
                <button
                  onClick={() => onNavigate(prevTopic.id)}
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  <span>←</span>
                  <span className="truncate max-w-[200px]">{prevTopic.title}</span>
                </button>
              ) : (
                <div />
              )}
              {nextTopic ? (
                <button
                  onClick={() => onNavigate(nextTopic.id)}
                  className="flex items-center gap-2 text-sm text-accent-green hover:text-accent-cyan transition-colors"
                >
                  <span className="truncate max-w-[200px]">{nextTopic.title}</span>
                  <span>→</span>
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>

        {showToc && (
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-8">
              <TableOfContents markdown={deepDiveMd} containerRef={scrollRef} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
