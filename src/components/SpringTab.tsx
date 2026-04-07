import { TopicContent } from "@/lib/types";

interface SpringTabProps {
  content: TopicContent;
}

export default function SpringTab({ content }: SpringTabProps) {
  if (!content.springConnection) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-3xl mb-3">🌱</div>
        <p className="text-text-muted text-sm max-w-sm leading-relaxed">
          This is a foundational Java topic. Spring connections appear in later,
          more advanced blocks where these fundamentals are applied.
        </p>
      </div>
    );
  }

  const { concept, springFeature, explanation } = content.springConnection;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-bg-card border border-border">
        <div className="flex-1 text-center p-3 rounded-sm bg-bg-elevated border border-border">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">Java</div>
          <div className="text-sm font-semibold text-accent-cyan">{concept}</div>
        </div>
        <div className="text-accent-green text-lg">→</div>
        <div className="flex-1 text-center p-3 rounded-sm bg-bg-elevated border border-border">
          <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-1">Spring</div>
          <div className="text-sm font-semibold text-accent-green">{springFeature}</div>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">How They Connect</div>
        {explanation
          .split("\n")
          .filter((p) => p.trim())
          .map((para, i) => (
            <p key={i} className="text-[13px] leading-[1.85] text-text-secondary mb-3.5">
              {para}
            </p>
          ))}
      </div>
    </div>
  );
}
