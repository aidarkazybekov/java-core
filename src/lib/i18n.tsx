"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type Locale = "ru" | "en";

const STORAGE_KEY = "java-core:locale";
const DEFAULT_LOCALE: Locale = "en";
const SEPARATOR = /\n\s*---\s*\n/;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ru" || stored === "en") setLocaleState(stored);
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "ru" ? "en" : "ru";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ locale, setLocale, toggle }), [locale, setLocale, toggle]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/**
 * Splits a bilingual string on the `\n---\n` separator.
 * Returns { ru, en }. If the string has no separator, both halves return the
 * original text so UIs can fall back to a single language transparently.
 */
export function splitLocalized(text: string): { ru: string; en: string } {
  if (!text) return { ru: "", en: "" };
  const parts = text.split(SEPARATOR);
  if (parts.length < 2) return { ru: text, en: text };
  const [ru, ...rest] = parts;
  return { ru: ru.trim(), en: rest.join("\n---\n").trim() };
}

export function localized(text: string, locale: Locale): string {
  const { ru, en } = splitLocalized(text);
  return locale === "ru" ? ru : en;
}

export const UI_STRINGS = {
  summary: { ru: "Кратко", en: "Summary" },
  deepDive: { ru: "Подробно", en: "Deep Dive" },
  interviewTip: { ru: "Совет на интервью", en: "Interview Tip" },
  howConnected: { ru: "Как связаны", en: "How They Connect" },
  java: { ru: "Java", en: "Java" },
  spring: { ru: "Spring", en: "Spring" },
  reveal: { ru: "▶ ПОКАЗАТЬ ОТВЕТ", en: "▶ REVEAL ANSWER" },
  rate: { ru: "Оценка:", en: "Rate:" },
  clickToReveal: {
    ru: "Нажмите, чтобы увидеть ответ — затем оцените свою уверенность",
    en: "Click to reveal answers — then rate your confidence",
  },
  rated: { ru: "Оценено", en: "Rated" },
  nextReviewIn: { ru: "повтор через", en: "next review in" },
  days: { ru: "дн.", en: "day(s)" },
  saved: { ru: "сохранено", en: "saved" },
  javaExample: { ru: "Пример на Java", en: "Java Example" },
  foundationalTopic: {
    ru: "Это базовая тема по Java. Связи со Spring появляются в более продвинутых блоках, где эти основы применяются на практике.",
    en: "This is a foundational Java topic. Spring connections appear in later, more advanced blocks where these fundamentals are applied.",
  },
  again: { ru: "Снова", en: "Again" },
  hard: { ru: "Сложно", en: "Hard" },
  good: { ru: "Хорошо", en: "Good" },
  easy: { ru: "Легко", en: "Easy" },
  difficultyJunior: { ru: "ДЖУНИОР", en: "JUNIOR" },
  difficultyMid: { ru: "МИДДЛ", en: "MID" },
  difficultySenior: { ru: "СЕНЬОР", en: "SENIOR" },
} as const;

export function t(key: keyof typeof UI_STRINGS, locale: Locale): string {
  return UI_STRINGS[key][locale];
}
