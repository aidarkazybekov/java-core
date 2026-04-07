"use client";

import { TopicContent } from "@/lib/types";

interface LearnTabProps {
  content: TopicContent;
}

export default function LearnTab({ content }: LearnTabProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 rounded-lg bg-[#111827] border border-[#1e3a2a] border-l-[3px] border-l-accent-green">
        <div className="text-[10px] text-accent-green tracking-[2px] uppercase mb-2">Summary</div>
        <p className="text-[13px] leading-[1.8] text-text-secondary">{content.summary}</p>
      </div>
      <div>
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">Deep Dive</div>
        {content.deepDive
          .split("\n")
          .filter((p) => p.trim())
          .map((para, i) => (
            <p key={i} className="text-[13px] leading-[1.85] text-text-secondary mb-3.5">
              {para}
            </p>
          ))}
      </div>
      {content.tip && (
        <div className="p-4 rounded-lg bg-[#12121a] border border-[#2d2d45] border-l-[3px] border-l-accent-amber">
          <div className="text-[10px] text-accent-amber tracking-[2px] uppercase mb-2">Interview Tip</div>
          <p className="text-[13px] leading-[1.7] text-text-secondary">{content.tip}</p>
        </div>
      )}
    </div>
  );
}
