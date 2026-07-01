"use client";
import { useState } from "react";

export default function Checkpoint({ prompt, answer, locale }: { prompt: string; answer: string; locale: "ru" | "en" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border pt-3.5 text-[12.5px] leading-[1.7] text-text-secondary">
      <span aria-hidden="true">🧠 </span>
      <span className="font-medium text-text-primary">{locale === "ru" ? "Прежде чем листать — " : "Before you scroll — "}</span>
      {prompt}
      {open ? (
        <span className="block mt-1.5 text-text-muted">{answer}</span>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-1.5 text-accent-green hover:underline"
        >
          {locale === "ru" ? "▶ показать" : "▶ reveal"}
        </button>
      )}
    </div>
  );
}
