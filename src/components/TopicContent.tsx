"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { localized, useLocale } from "@/lib/i18n";
import { estimateReadingMinutes } from "@/lib/reading-time";
import LearnTab from "./LearnTab";
import CodeTab from "./CodeTab";
import InterviewTab from "./InterviewTab";
import SpringTab from "./SpringTab";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";
import StudyStats from "./StudyStats";

interface TopicNav {
  id: string;
  title: string;
  blockId: number;
  blockTitle: string;
  blockIcon: string;
}

const TABS = [
  { id: "learn", label: "📖 Learn" },
  { id: "code", label: "💻 Code" },
  { id: "interview", label: "🎯 Interview" },
  { id: "spring", label: "🌱 Spring" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface TopicContentProps {
  content: TopicContentType;
  blockId: number;
  blockTitle: string;
  blockIcon: string;
  topicIndexInBlock: number;
  blockTopicCount: number;
  isDone: boolean;
  highlightedCode: string;
  prevTopic?: TopicNav | null;
  nextTopic?: TopicNav | null;
  onNavigate?: (topicId: string) => void;
  progress: ProgressState;
  onMarkDone: () => void;
  onRate: (questionId: string, quality: number) => void;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
}

export default function TopicContentView({
  content,
  blockId,
  blockTitle,
  blockIcon,
  topicIndexInBlock,
  blockTopicCount,
  isDone,
  highlightedCode,
  progress,
  prevTopic,
  nextTopic,
  onMarkDone,
  onRate,
  onNavigate,
  activeTab,
  onTabChange,
}: TopicContentProps) {
  const { locale } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const deepDiveMd = localized(content.deepDive, locale);
  const showToc = activeTab === "learn";
  const readingMinutes = estimateReadingMinutes(
    content.summary,
    content.deepDive,
    content.tip
  );

  const blockLabel =
    locale === "ru"
      ? `Блок ${blockId}: ${blockTitle}`
      : `Block ${blockId}: ${blockTitle}`;
  const topicPosition =
    locale === "ru"
      ? `Тема ${topicIndexInBlock + 1} из ${blockTopicCount}`
      : `Topic ${topicIndexInBlock + 1} of ${blockTopicCount}`;
  const readingLabel =
    locale === "ru" ? `~${readingMinutes} мин чтения` : `~${readingMinutes} min read`;
  const markDoneLabel =
    locale === "ru" ? (isDone ? "✓ Готово" : "Отметить") : isDone ? "✓ Done" : "Mark done";

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto relative">
      <div className="flex gap-8 px-4 sm:px-7 2xl:gap-10">
        <div className="flex-1 min-w-0 max-w-[860px] 2xl:max-w-[940px]">
          {/* Sticky header: reading progress + breadcrumb + title + tabs */}
          <div className="sticky top-0 z-20 -mx-4 sm:-mx-7 bg-bg-primary/90 backdrop-blur-sm border-b border-border">
            <ReadingProgress scrollRef={scrollRef} />
            <div className="px-4 sm:px-7 pt-4 sm:pt-5 pb-1">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px] tracking-[2px] uppercase mb-1.5">
                <span className="text-base leading-none" aria-hidden="true">
                  {blockIcon}
                </span>
                <span className="text-accent-green">{blockLabel}</span>
                <span className="text-text-muted">·</span>
                <span className="text-text-muted">{topicPosition}</span>
                {readingMinutes > 0 && (
                  <>
                    <span className="text-text-muted">·</span>
                    <span className="text-text-muted">{readingLabel}</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-text-primary truncate">
                  {content.title}
                </h1>
                <button
                  onClick={onMarkDone}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium border transition-all shrink-0 ${
                    isDone
                      ? "border-accent-green text-accent-green bg-accent-green/10"
                      : "border-border text-text-muted hover:border-text-muted hover:text-text-secondary"
                  }`}
                >
                  {markDoneLabel}
                </button>
              </div>
            </div>
            <div
              role="tablist"
              aria-label={locale === "ru" ? "Разделы темы" : "Topic sections"}
              className="flex gap-1 -mb-px px-4 sm:px-7"
            >
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-label={`${tab.label} (${i + 1})`}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 text-xs transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "text-accent-green border-accent-green"
                      : "text-text-muted border-transparent hover:text-text-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 pb-7">
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
              <nav
                aria-label={locale === "ru" ? "Навигация по темам" : "Topic navigation"}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-border"
              >
                {prevTopic ? (
                  <button
                    onClick={() => onNavigate(prevTopic.id)}
                    className="group text-left rounded-lg border border-border bg-bg-card hover:border-text-muted transition-colors p-3"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted tracking-[2px] uppercase mb-1">
                      <span aria-hidden="true">←</span>
                      <span>{locale === "ru" ? "Предыдущая" : "Previous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-none" aria-hidden="true">
                        {prevTopic.blockIcon}
                      </span>
                      <span className="text-[13px] text-text-primary group-hover:text-accent-green transition-colors truncate">
                        {prevTopic.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-1 truncate">
                      {locale === "ru" ? "Блок" : "Block"} {prevTopic.blockId} · {prevTopic.blockTitle}
                    </div>
                  </button>
                ) : (
                  <div />
                )}
                {nextTopic ? (
                  <button
                    onClick={() => onNavigate(nextTopic.id)}
                    className="group text-right rounded-lg border border-border bg-bg-card hover:border-accent-green/60 transition-colors p-3"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-accent-green tracking-[2px] uppercase mb-1">
                      <span>{locale === "ru" ? "Следующая" : "Next"}</span>
                      <span aria-hidden="true">→</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] text-text-primary group-hover:text-accent-green transition-colors truncate">
                        {nextTopic.title}
                      </span>
                      <span className="text-sm leading-none" aria-hidden="true">
                        {nextTopic.blockIcon}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-1 truncate">
                      {locale === "ru" ? "Блок" : "Block"} {nextTopic.blockId} · {nextTopic.blockTitle}
                    </div>
                  </button>
                ) : (
                  <div />
                )}
              </nav>
            )}
          </div>
        </div>

        {showToc && (
          <aside className="hidden xl:block w-52 2xl:w-64 shrink-0">
            <div className="sticky top-28 pt-7 pb-7">
              <TableOfContents markdown={deepDiveMd} containerRef={scrollRef} />
              <div className="hidden 2xl:block">
                <StudyStats content={content} progress={progress} isDone={isDone} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
