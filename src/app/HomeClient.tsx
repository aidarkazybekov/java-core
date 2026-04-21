"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProgressState } from "@/lib/types";
import { loadProgress, saveProgress } from "@/lib/progress";
import { getDueCards, updateSRState } from "@/lib/spaced-repetition";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROADMAP, TOTAL_TOPICS, getTopic } from "@/data/roadmap";
import { getTopicContent } from "@/data/content";
import { useLocale } from "@/lib/i18n";
import Sidebar from "@/components/Sidebar";
import BlockGrid from "@/components/BlockGrid";
import SearchDialog from "@/components/SearchDialog";
import QuizMode from "@/components/QuizMode";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";

export default function HomeClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);
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
            aria-label="Open sidebar"
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="text-sm font-semibold text-text-primary">Java Core</div>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
          <div className="p-4 sm:p-8 max-w-[720px] mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-text-primary">
                🔄 {L("Карточки к повтору", "Cards Due for Review")}
              </h2>
              <button
                onClick={() => setShowReview(false)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                ← {L("Назад", "Back")}
              </button>
            </div>
            <div className="space-y-2">
              {dueCards.map((card) => {
                const topicId = card.questionId.split("-q")[0];
                const meta = getTopic(topicId);
                return (
                  <button
                    key={card.questionId}
                    onClick={() => router.push(`/topic/${topicId}`)}
                    className="w-full text-left p-3 rounded-lg bg-bg-card border border-border hover:border-accent-amber/50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      {meta?.block.icon ?? "📘"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        {meta?.topic.title ?? topicId}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {meta?.block.title} · {card.questionId.split("-q")[1]
                          ? `Q${parseInt(card.questionId.split("-q")[1], 10) + 1}`
                          : ""} · {L("интервал", "interval")} {card.interval}d
                      </div>
                    </div>
                    <span className="text-[10px] text-accent-amber tracking-[2px] uppercase shrink-0">
                      {L("К повтору", "Due")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl leading-none" aria-hidden="true">☕</span>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                    Java Core
                  </h1>
                  {progress.streak > 0 && (
                    <span className="text-xs text-accent-amber px-2 py-0.5 rounded-sm bg-accent-amber/10 border border-accent-amber/30">
                      🔥 {progress.streak} {L("дней подряд", "day streak")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted">
                  {L(
                    "Интерактивная подготовка к техническим интервью.",
                    "Interactive interview prep for senior backend roles."
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-card border border-border hover:border-text-muted transition-colors text-[12px] text-text-secondary"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {L("Поиск", "Search")}
                  <kbd className="text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded border border-border ml-1 font-mono">⌘K</kbd>
                </button>
                <button
                  onClick={() => setShortcutsOpen(true)}
                  className="px-2.5 py-1.5 rounded-md bg-bg-card border border-border hover:border-text-muted transition-colors text-[12px] text-text-secondary font-mono"
                  aria-label={L("Клавиатурные сокращения", "Keyboard shortcuts")}
                >
                  ?
                </button>
              </div>
            </div>

            {/* Dashboard hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Overall progress */}
              <div className="rounded-lg border border-border bg-bg-card p-4">
                <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                  {L("Прогресс", "Overall progress")}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-2xl font-bold text-text-primary tabular-nums">
                    {completed.size}
                  </div>
                  <div className="text-sm text-text-muted tabular-nums">
                    / {TOTAL_TOPICS}
                  </div>
                  <div className="ml-auto text-[11px] font-mono text-accent-green tabular-nums">
                    {Math.round((completed.size / TOTAL_TOPICS) * 100)}%
                  </div>
                </div>
                <div className="h-1.5 rounded-sm bg-bg-elevated overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-green to-accent-cyan transition-[width] duration-300"
                    style={{
                      width: `${(completed.size / TOTAL_TOPICS) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-text-muted">
                  {L("тем пройдено", "topics complete")}
                </div>
              </div>

              {/* Resume card */}
              {(() => {
                const lastId = progress.lastVisited;
                const resumeMeta = lastId ? getTopic(lastId) : null;
                if (resumeMeta) {
                  return (
                    <button
                      onClick={() => handleSelectTopic(lastId!)}
                      className="text-left rounded-lg border border-border bg-bg-card hover:border-accent-cyan/60 transition-colors p-4 group"
                    >
                      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                        {L("Продолжить", "Resume")}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg leading-none" aria-hidden="true">
                          {resumeMeta.block.icon}
                        </span>
                        <span className="text-sm font-semibold text-text-primary truncate">
                          {resumeMeta.topic.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted truncate mb-3">
                        {resumeMeta.block.title}
                      </div>
                      <div className="text-[11px] text-accent-cyan group-hover:translate-x-0.5 transition-transform inline-block">
                        {L("Продолжить", "Continue")} →
                      </div>
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => handleSelectTopic("1-1")}
                    className="text-left rounded-lg border border-border bg-bg-card hover:border-accent-green/60 transition-colors p-4 group"
                  >
                    <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                      {L("Начать", "Get started")}
                    </div>
                    <div className="text-sm font-semibold text-text-primary mb-1">
                      {L("Первая тема", "First topic")}
                    </div>
                    <div className="text-[11px] text-text-muted mb-3">
                      {L("JVM Architecture — с чего всё начинается", "JVM Architecture — where it all begins")}
                    </div>
                    <div className="text-[11px] text-accent-green group-hover:translate-x-0.5 transition-transform inline-block">
                      {L("Начать", "Start")} →
                    </div>
                  </button>
                );
              })()}

              {/* Review / Quiz card */}
              {dueCards.length > 0 ? (
                <button
                  onClick={() => setShowReview(true)}
                  className="text-left rounded-lg border border-accent-amber/30 bg-accent-amber/5 hover:border-accent-amber/60 transition-colors p-4 group"
                >
                  <div className="text-[10px] text-accent-amber tracking-[2px] uppercase mb-2">
                    {L("Повторить", "Review")}
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className="text-2xl font-bold text-accent-amber tabular-nums">
                      {dueCards.length}
                    </div>
                    <div className="text-sm text-text-muted">
                      {L("карточек", "cards")}
                    </div>
                  </div>
                  <div className="text-[11px] text-text-muted mb-3">
                    {L("готовы к повтору", "due for spaced repetition")}
                  </div>
                  <div className="text-[11px] text-accent-amber group-hover:translate-x-0.5 transition-transform inline-block">
                    {L("Открыть", "Open")} →
                  </div>
                </button>
              ) : (
                <button
                  onClick={startQuiz}
                  className="text-left rounded-lg border border-accent-green/30 bg-accent-green/5 hover:border-accent-green/60 transition-colors p-4 group"
                >
                  <div className="text-[10px] text-accent-green tracking-[2px] uppercase mb-2">
                    {L("Тренировка", "Practice")}
                  </div>
                  <div className="text-sm font-semibold text-text-primary mb-1">
                    🎯 {L("Режим викторины", "Quiz Mode")}
                  </div>
                  <div className="text-[11px] text-text-muted mb-3">
                    {L(
                      "15 случайных вопросов из всех блоков",
                      "15 random questions across all blocks"
                    )}
                  </div>
                  <div className="text-[11px] text-accent-green group-hover:translate-x-0.5 transition-transform inline-block">
                    {L("Начать", "Start")} →
                  </div>
                </button>
              )}
            </div>

            {/* Block grid */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <div className="text-[10px] text-text-muted tracking-[2px] uppercase">
                  {L("Дорожная карта", "Roadmap")}
                </div>
                <div className="text-[11px] text-text-muted">
                  {ROADMAP.length} {L("блоков", "blocks")} ·{" "}
                  {TOTAL_TOPICS} {L("тем", "topics")}
                </div>
              </div>
              <BlockGrid completed={completed} onSelectTopic={handleSelectTopic} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
