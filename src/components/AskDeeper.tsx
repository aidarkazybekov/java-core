"use client";

import { useState, useRef } from "react";
import { TopicContent } from "@/lib/types";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle,
          context: {
            summary: content.summary,
            deepDive: content.deepDive.slice(0, 2000),
            tip: content.tip,
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
          ? "Request timed out — try again."
          : "Couldn't reach AI — try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-border bg-bg-card">
      {messages.length > 0 && (
        <div className="max-h-48 overflow-y-auto px-7 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-[13px] leading-relaxed ${
                msg.role === "user" ? "text-accent-cyan" : "text-text-secondary"
              }`}
            >
              <span className="text-text-muted text-[11px] mr-2">
                {msg.role === "user" ? "You:" : "AI:"}
              </span>
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-text-muted text-[13px]">Thinking...</div>}
        </div>
      )}
      {error && <div className="px-7 py-2 text-accent-red text-[12px]">{error}</div>}
      <form onSubmit={handleSubmit} className="px-7 py-3 flex gap-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            remaining > 0
              ? `Ask a follow-up about ${topicTitle}... (${remaining} left)`
              : "Follow-up limit reached for this topic"
          }
          disabled={remaining <= 0 || loading}
          className="flex-1 bg-bg-elevated border border-border rounded-lg px-4 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={remaining <= 0 || loading || !input.trim()}
          className="px-4 py-2 text-sm rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 transition-colors disabled:opacity-30"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
