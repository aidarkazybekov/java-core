"use client";

export default function CompletionNudge({ locale, onStart }: { locale: "ru" | "en"; onStart: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#1e3a2a] bg-[#0f1c16] px-3.5 py-2.5">
      <span className="text-[12px] text-text-muted">
        {locale === "ru" ? "Ты дочитал урок." : "You've reached the end of the lesson."}
      </span>
      <button
        type="button"
        onClick={onStart}
        className="shrink-0 rounded-md bg-accent-green/15 text-accent-green border border-accent-green/30 px-3 py-1.5 text-[11px] font-semibold hover:bg-accent-green/25 transition-colors"
      >
        {locale === "ru" ? "🧠 Проверить себя" : "🧠 Test yourself"}
      </button>
    </div>
  );
}
