"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n";

interface Shortcut {
  keys: string[];
  desc: { en: string; ru: string };
}

const SHORTCUTS: { section: { en: string; ru: string }; items: Shortcut[] }[] = [
  {
    section: { en: "Global", ru: "Общие" },
    items: [
      { keys: ["?"], desc: { en: "Show this help", ru: "Открыть этот список" } },
      { keys: ["⌘K", "Ctrl K"], desc: { en: "Search topics", ru: "Поиск по темам" } },
      { keys: ["g", "h"], desc: { en: "Go to home", ru: "На главную" } },
      { keys: ["Esc"], desc: { en: "Close modal / drawer", ru: "Закрыть диалог" } },
    ],
  },
  {
    section: { en: "On a topic", ru: "На странице темы" },
    items: [
      { keys: ["←"], desc: { en: "Previous topic", ru: "Предыдущая тема" } },
      { keys: ["→"], desc: { en: "Next topic", ru: "Следующая тема" } },
      { keys: ["1"], desc: { en: "Learn tab", ru: "Вкладка Learn" } },
      { keys: ["2"], desc: { en: "Code tab", ru: "Вкладка Code" } },
      { keys: ["3"], desc: { en: "Interview tab", ru: "Вкладка Interview" } },
      { keys: ["4"], desc: { en: "Spring tab", ru: "Вкладка Spring" } },
    ],
  },
  {
    section: { en: "Quiz mode", ru: "Режим викторины" },
    items: [
      { keys: ["Space"], desc: { en: "Reveal the answer", ru: "Показать ответ" } },
      { keys: ["1"], desc: { en: "Rate — Again", ru: "Оценка — Снова" } },
      { keys: ["2"], desc: { en: "Rate — Hard", ru: "Оценка — Сложно" } },
      { keys: ["3"], desc: { en: "Rate — Good", ru: "Оценка — Хорошо" } },
      { keys: ["4"], desc: { en: "Rate — Easy", ru: "Оценка — Легко" } },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  const { locale } = useLocale();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={locale === "ru" ? "Клавиатурные сокращения" : "Keyboard shortcuts"}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[12%] left-1/2 -translate-x-1/2 w-[min(92vw,560px)] z-50 max-h-[76vh] overflow-auto rounded-xl border border-border bg-bg-card shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-border bg-bg-card/95 backdrop-blur-sm">
              <div className="text-sm font-semibold text-text-primary">
                {locale === "ru" ? "Сокращения" : "Keyboard shortcuts"}
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-secondary text-sm"
                aria-label={locale === "ru" ? "Закрыть" : "Close"}
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-4 space-y-5">
              {SHORTCUTS.map((section) => (
                <div key={section.section.en}>
                  <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-2">
                    {section.section[locale]}
                  </div>
                  <dl className="space-y-1.5">
                    {section.items.map((item) => (
                      <div
                        key={item.keys.join("+")}
                        className="flex items-center justify-between gap-4"
                      >
                        <dt className="text-[12.5px] text-text-secondary">
                          {item.desc[locale]}
                        </dt>
                        <dd className="flex items-center gap-1 shrink-0">
                          {item.keys.map((k, i) => (
                            <kbd
                              key={i}
                              className="min-w-[24px] text-center px-1.5 py-0.5 text-[11px] font-mono rounded-sm border border-border bg-bg-elevated text-text-secondary"
                            >
                              {k}
                            </kbd>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
