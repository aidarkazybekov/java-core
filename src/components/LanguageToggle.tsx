"use client";

import { useLocale, Locale } from "@/lib/i18n";

interface LanguageToggleProps {
  compact?: boolean;
}

export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ru", label: "RU" },
  ];

  return (
    <div
      className={`inline-flex items-center rounded-md border border-border bg-bg-elevated overflow-hidden ${
        compact ? "text-[10px]" : "text-[11px]"
      }`}
      role="group"
      aria-label="Language"
    >
      {options.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            aria-pressed={active}
            className={`px-2.5 py-1 tracking-wider transition-colors ${
              active
                ? "bg-accent-green/15 text-accent-green"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
