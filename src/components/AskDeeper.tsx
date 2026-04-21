"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicContent } from "@/lib/types";
import { localized, useLocale } from "@/lib/i18n";
import Markdown from "./Markdown";

interface AskDeeperProps {
  topicTitle: string;
  content: TopicContent;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

const MAX_FOLLOWUPS = 3;

export default function AskDeeper({ topicTitle, content }: AskDeeperProps) {
  const { locale } = useLocale();
  const L = (ru: string, en: string) => (locale === "ru" ? ru : en);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reset the conversation when the topic changes
  useEffect(() => {
    setMessages([]);
    setError(null);
    setInput("");
  }, [content.id]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // Esc closes the drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const remaining = MAX_FOLLOWUPS - messages.filter((m) => m.role === "user").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || remaining <= 0) return;
    const question = input.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle,
          context: {
            summary: localized(content.summary, locale),
            deepDive: localized(content.deepDive, locale).slice(0, 2400),
            tip: localized(content.tip, locale),
          },
          messages: [...messages, { role: "user", text: question }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      clearTimeout(timeout);
      const msg =
        err instanceof DOMException && err.name === "AbortError"
          ? L("Запрос превысил таймаут — попробуйте ещё раз.", "Request timed out — try again.")
          : L("Не удалось связаться с AI. Попробуйте ещё раз.", "Couldn't reach AI — try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => setOpen(true)}
            aria-label={L("Спросить", "Ask")}
            className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-bg-card/95 backdrop-blur-sm px-4 py-2.5 text-[12px] text-accent-cyan shadow-xl hover:bg-bg-elevated transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4.5 6h7M4.5 9h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3 3h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7l-3 2.5V12H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span>{L("Спросить глубже", "Ask deeper")}</span>
            {messages.length > 0 && (
              <span className="ml-1 text-[10px] font-mono bg-accent-cyan/20 px-1.5 rounded-sm">
                {messages.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              aria-hidden="true"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={L(`Ask about ${topicTitle}`, `Ask about ${topicTitle}`)}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-bg-card border-l border-border flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-accent-cyan" aria-hidden="true">
                    💬
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-text-muted tracking-[2px] uppercase">
                      {L("Спросить глубже", "Ask deeper")}
                    </div>
                    <div className="text-[13px] font-semibold text-text-primary truncate">
                      {topicTitle}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={L("Закрыть", "Close")}
                  className="text-text-muted hover:text-text-secondary text-lg px-1"
                >
                  ✕
                </button>
              </div>

              <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.length === 0 && (
                  <div className="text-[12px] text-text-muted italic leading-relaxed">
                    {L(
                      `Задайте до ${MAX_FOLLOWUPS} уточняющих вопросов по теме «${topicTitle}». Ответы основаны на материале урока.`,
                      `Ask up to ${MAX_FOLLOWUPS} follow-up questions about "${topicTitle}". Answers are grounded in the lesson content.`
                    )}
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i}>
                    <div
                      className={`text-[10px] tracking-[2px] uppercase mb-1 ${
                        msg.role === "user" ? "text-accent-cyan" : "text-accent-green"
                      }`}
                    >
                      {msg.role === "user" ? L("Вы", "You") : L("Ответ", "Answer")}
                    </div>
                    {msg.role === "user" ? (
                      <div className="text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="rounded-md border border-border bg-bg-elevated/60 px-3 py-2">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-[12px] text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                    {L("Думаю...", "Thinking...")}
                  </div>
                )}

                {error && (
                  <div className="text-[12px] text-accent-red border-l-2 border-accent-red pl-3">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-border p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      remaining > 0
                        ? L("Задайте вопрос...", "Ask a question...")
                        : L("Достигнут лимит вопросов для этой темы", "Follow-up limit reached")
                    }
                    disabled={remaining <= 0 || loading}
                    className="flex-1 bg-bg-elevated border border-border rounded-md px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/60 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={remaining <= 0 || loading || !input.trim()}
                    className="px-3 py-2 text-[12px] rounded-md bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? L("...", "...") : L("Спросить", "Ask")}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span>
                    {remaining}/{MAX_FOLLOWUPS}{" "}
                    {L("осталось", "left")}
                  </span>
                  <span className="font-mono">Esc — {L("закрыть", "close")}</span>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
