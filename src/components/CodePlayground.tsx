"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";

interface CodePlaygroundProps {
  initialCode: string;
}

interface RunResult {
  output: string;
  statusCode: number | null;
  cpuTime: string | null;
  memory: string | null;
  elapsedMs: number;
  error?: string;
}

type RunState = "idle" | "running" | "ok" | "error";

export default function CodePlayground({ initialCode }: CodePlaygroundProps) {
  const { locale } = useLocale();
  const L = useCallback(
    (ru: string, en: string) => (locale === "ru" ? ru : en),
    [locale]
  );

  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [state, setState] = useState<RunState>("idle");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = code !== initialCode;

  const handleRun = useCallback(async () => {
    setState("running");
    setResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as RunResult;
      if (res.ok && !data.error) {
        setResult(data);
        // JDoodle returns non-zero statusCode on compile/runtime errors
        setState(data.statusCode && data.statusCode !== 0 ? "error" : "ok");
      } else {
        setResult({
          ...data,
          output: data.output ?? "",
          error: data.error ?? "Execution failed",
        });
        setState("error");
      }
    } catch (e) {
      setResult({
        output: "",
        statusCode: null,
        cpuTime: null,
        memory: null,
        elapsedMs: 0,
        error:
          e instanceof Error
            ? e.message
            : L("Не удалось выполнить. Попробуйте скопировать в IDE.", "Failed to execute. Try copying to your IDE."),
      });
      setState("error");
    }
  }, [code, L]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setResult(null);
    setState("idle");
  };

  // Cmd/Ctrl + Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (document.activeElement === textareaRef.current) {
          e.preventDefault();
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  // Tab key inside textarea inserts spaces rather than moving focus
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  const stateLabel: Record<RunState, string> = {
    idle: L("готов", "idle"),
    running: L("выполняется", "running"),
    ok: L("успешно", "ok"),
    error: L("ошибка", "error"),
  };
  const stateColor: Record<RunState, string> = {
    idle: "bg-text-muted",
    running: "bg-accent-cyan animate-pulse",
    ok: "bg-accent-green",
    error: "bg-accent-red",
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted tracking-[2px] uppercase">
            {L("Песочница", "Playground")}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-sm border border-border bg-bg-elevated text-text-secondary`}
            aria-live="polite"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${stateColor[state]}`} />
            {stateLabel[state]}
          </span>
          {isDirty && (
            <span className="text-[10px] text-accent-amber tracking-wider uppercase">
              {L("изменено", "modified")}
            </span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {isDirty && (
            <button
              onClick={handleReset}
              className="px-3 py-1 text-[11px] rounded-sm border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
            >
              {L("Сбросить", "Reset")}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-[11px] rounded-sm border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
          >
            {copied ? L("Скопировано", "Copied") : L("Копировать", "Copy")}
          </button>
          <button
            onClick={handleRun}
            disabled={state === "running"}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-sm bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === "running" ? (
              <>
                <svg width="10" height="10" viewBox="0 0 10 10" className="animate-spin" aria-hidden="true">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="12 22" />
                </svg>
                {L("Выполняется...", "Running...")}
              </>
            ) : (
              <>▶ {L("Запустить", "Run")}</>
            )}
            <kbd className="ml-1 text-[9px] font-mono opacity-60 hidden sm:inline">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleTextareaKeyDown}
        spellCheck={false}
        aria-label={L("Редактор кода", "Code editor")}
        className="w-full h-56 p-4 bg-[#0d0d10] border border-border rounded-lg font-mono text-[12px] leading-[1.8] text-[#cbd5e1] resize-y focus:outline-none focus:border-accent-cyan/50"
      />

      <div className="mt-2 rounded-lg border border-border bg-[#0d0d10] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-bg-elevated">
          <span className="text-[10px] text-text-muted tracking-[2px] uppercase">
            {L("Вывод", "Output")}
          </span>
          {result && state !== "running" && (
            <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
              {result.cpuTime && (
                <span>
                  <span className="text-text-muted/70">cpu </span>
                  {result.cpuTime}s
                </span>
              )}
              {result.memory && (
                <span>
                  <span className="text-text-muted/70">mem </span>
                  {result.memory}
                </span>
              )}
              {result.statusCode !== null && (
                <span
                  className={
                    result.statusCode === 0
                      ? "text-accent-green"
                      : "text-accent-red"
                  }
                >
                  exit {result.statusCode}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-3 min-h-[80px]">
          {state === "idle" && !result && (
            <div className="text-[11px] text-text-muted italic">
              {L(
                "Нажмите «Запустить» или ⌘↵ чтобы выполнить код.",
                "Press Run or ⌘↵ to execute the code."
              )}
            </div>
          )}
          {state === "running" && (
            <div className="text-[11px] text-text-muted italic animate-pulse">
              {L("Компиляция и запуск на JDoodle...", "Compiling and running on JDoodle...")}
            </div>
          )}
          {result && (
            <>
              {result.error && (
                <pre className="font-mono text-[12px] text-accent-red whitespace-pre-wrap mb-2">
                  {result.error}
                </pre>
              )}
              {result.output && (
                <pre
                  className={`font-mono text-[12px] whitespace-pre-wrap ${
                    state === "error" ? "text-accent-red" : "text-text-secondary"
                  }`}
                >
                  {result.output}
                </pre>
              )}
              {!result.error && !result.output && (
                <div className="text-[11px] text-text-muted italic">
                  {L("Программа завершилась без вывода.", "Program finished with no output.")}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
