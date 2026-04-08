"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAP } from "@/data/roadmap";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

interface SearchResult {
  topicId: string;
  topicTitle: string;
  blockTitle: string;
  blockIcon: string;
}

const allTopics: SearchResult[] = ROADMAP.flatMap((block) =>
  block.topics.map((topic) => ({
    topicId: topic.id,
    topicTitle: topic.title,
    blockTitle: block.title,
    blockIcon: block.icon,
  }))
);

export default function SearchDialog({ open, onClose, onSelectTopic }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? allTopics.filter(
        (t) =>
          t.topicTitle.toLowerCase().includes(query.toLowerCase()) ||
          t.blockTitle.toLowerCase().includes(query.toLowerCase()) ||
          t.topicId.includes(query)
      )
    : allTopics;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIdx]) {
        onSelectTopic(results[selectedIdx].topicId);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIdx, onSelectTopic, onClose]
  );

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          // Parent needs to handle opening — we just prevent default here
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted shrink-0">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search topics..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <kbd className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-text-muted text-sm">
                    No topics found
                  </div>
                ) : (
                  results.slice(0, 20).map((result, idx) => (
                    <button
                      key={result.topicId}
                      onClick={() => {
                        onSelectTopic(result.topicId);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                        ${idx === selectedIdx ? "bg-bg-elevated" : ""}
                      `}
                    >
                      <span className="text-sm">{result.blockIcon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">
                          {result.topicTitle}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {result.blockTitle} · {result.topicId}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-text-muted">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
