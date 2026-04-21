"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAP, TOTAL_TOPICS } from "@/data/roadmap";
import { Block } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import ProgressRing from "./ProgressRing";
import LanguageToggle from "./LanguageToggle";

interface SidebarProps {
  completed: Set<string>;
  selectedTopicId: string | null;
  dueCount: number;
  onSelectTopic: (topicId: string) => void;
  onReviewClick: () => void;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  completed,
  selectedTopicId,
  dueCount,
  onSelectTopic,
  onReviewClick,
  mobile = false,
  open = true,
  onClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(
    new Set([1])
  );

  const toggleBlock = (id: number) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectTopic = (topicId: string) => {
    onSelectTopic(topicId);
    if (mobile && onClose) onClose();
  };

  const sidebarContent = (
    <motion.aside
      animate={{ width: mobile ? 280 : collapsed ? 56 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="shrink-0 bg-bg-card border-r border-border flex flex-col overflow-hidden h-screen"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          {(mobile || !collapsed) && (
            <div>
              <div className="text-[11px] text-accent-green tracking-[3px] uppercase">
                Java Core
              </div>
              <div className="text-lg font-bold text-text-primary">
                Interview Prep
              </div>
            </div>
          )}
          {mobile ? (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1.5 rounded-sm hover:bg-bg-elevated transition-colors text-text-muted text-lg"
            >
              <span aria-hidden="true">✕</span>
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className="p-1.5 rounded-sm hover:bg-bg-elevated transition-colors text-text-muted"
            >
              <span aria-hidden="true">{collapsed ? "▶" : "◀"}</span>
            </button>
          )}
        </div>
        {(mobile || !collapsed) && (
          <>
            <div className="flex items-center justify-end mb-2">
              <LanguageToggle />
            </div>
            <ProgressBar completed={completed.size} total={TOTAL_TOPICS} />
          </>
        )}
        {(mobile || !collapsed) && dueCount > 0 && (
          <button
            onClick={() => {
              onReviewClick();
              if (mobile && onClose) onClose();
            }}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border hover:border-accent-amber transition-colors text-sm"
          >
            <span className="text-accent-amber">🔄</span>
            <span className="text-text-secondary">{dueCount} cards due</span>
          </button>
        )}
      </div>

      {(mobile || !collapsed) && (
        <div className="flex-1 overflow-y-auto py-2">
          {ROADMAP.map((block) => (
            <SidebarBlock
              key={block.id}
              block={block}
              completed={completed}
              expanded={expandedBlocks.has(block.id)}
              selectedTopicId={selectedTopicId}
              onToggle={() => toggleBlock(block.id)}
              onSelectTopic={handleSelectTopic}
            />
          ))}
        </div>
      )}

      {!mobile && collapsed && (
        <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1">
          {ROADMAP.map((block) => (
            <button
              key={block.id}
              onClick={() => {
                setCollapsed(false);
                setExpandedBlocks((prev) => new Set(prev).add(block.id));
              }}
              className="p-2 rounded-sm hover:bg-bg-elevated transition-colors"
              title={block.title}
              aria-label={`${block.title} — expand sidebar`}
            >
              <span className="text-sm" aria-hidden="true">{block.icon}</span>
            </button>
          ))}
        </div>
      )}
    </motion.aside>
  );

  // Mobile: overlay drawer
  if (mobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: inline
  return sidebarContent;
}

function SidebarBlock({
  block,
  completed,
  expanded,
  selectedTopicId,
  onToggle,
  onSelectTopic,
}: {
  block: Block;
  completed: Set<string>;
  expanded: boolean;
  selectedTopicId: string | null;
  onToggle: () => void;
  onSelectTopic: (id: string) => void;
}) {
  const blockDone = block.topics.filter((t) => completed.has(t.id)).length;

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-bg-elevated transition-colors"
      >
        <ProgressRing completed={blockDone} total={block.topics.length} />
        <div className="flex-1 text-left min-w-0">
          <div className="text-[11px] font-semibold text-text-secondary tracking-wide">
            {block.id.toString().padStart(2, "0")}. {block.title}
          </div>
          <div className="text-[10px] text-text-muted">
            {blockDone}/{block.topics.length} done
          </div>
        </div>
        <span className="text-[10px] text-text-muted">
          {expanded ? "▼" : "▶"}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden ml-6 border-l border-border"
          >
            {block.topics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const isDone = completed.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-all
                    ${
                      isSelected
                        ? "bg-accent-green/10 border-l-2 border-accent-green -ml-px"
                        : "border-l-2 border-transparent -ml-px hover:bg-bg-elevated"
                    }
                  `}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-sm shrink-0 flex items-center justify-center text-[9px]
                      ${isDone ? "bg-accent-green text-black" : "border border-border"}
                    `}
                  >
                    {isDone ? "✓" : ""}
                  </div>
                  <span
                    className={`text-[11px] leading-tight
                      ${
                        isSelected
                          ? "text-accent-green"
                          : isDone
                            ? "text-text-muted"
                            : "text-text-secondary"
                      }
                    `}
                  >
                    {topic.title}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
