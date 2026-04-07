"use client";

import { useState } from "react";

interface CodePlaygroundProps {
  initialCode: string;
}

export default function CodePlayground({ initialCode }: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch {
      setOutput("Failed to execute. Try copying to your IDE.");
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-text-muted tracking-[2px] uppercase">Playground</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-[11px] rounded-sm border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="px-3 py-1 text-[11px] rounded-sm bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50"
          >
            {running ? "Running..." : "▶ Run"}
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full h-48 p-4 bg-[#0d0d10] border border-border rounded-lg font-mono text-[12px] leading-[1.8] text-accent-green resize-y focus:outline-none focus:border-accent-cyan/50"
      />
      {output !== null && (
        <div className="mt-2 p-3 bg-[#0d0d10] border border-border rounded-lg">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">Output</div>
          <pre className="font-mono text-[12px] text-text-secondary whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
