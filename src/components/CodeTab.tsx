"use client";

import { TopicContent } from "@/lib/types";
import { t, useLocale } from "@/lib/i18n";
import CodePlayground from "./CodePlayground";

interface CodeTabProps {
  content: TopicContent;
  highlightedCode: string;
}

export default function CodeTab({ content, highlightedCode }: CodeTabProps) {
  const { locale } = useLocale();
  const fileName = content.title.replace(/[^a-zA-Z0-9]/g, "") + ".java";
  return (
    <div>
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">
        {t("javaExample", locale)}
      </div>
      <div className="rounded-lg overflow-hidden border border-border">
        <div className="bg-bg-elevated px-4 py-2 flex items-center gap-2 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="text-[11px] text-text-muted ml-2">{fileName}</span>
        </div>
        <div
          className="p-5 bg-[#0d0d10] overflow-x-auto text-[12px] leading-[1.8] [&_pre]:!bg-transparent [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
      <CodePlayground initialCode={content.code} />
    </div>
  );
}
