"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopicContent as TopicContentType, ProgressState } from "@/lib/types";
import { loadProgress, saveProgress, toggleComplete } from "@/lib/progress";
import { updateSRState, getDueCards } from "@/lib/spaced-repetition";
import Sidebar from "@/components/Sidebar";
import TopicContentView from "@/components/TopicContent";
import AskDeeper from "@/components/AskDeeper";

interface TopicClientProps {
  content: TopicContentType;
  blockTitle: string;
  highlightedCode: string;
}

export default function TopicClient({
  content,
  blockTitle,
  highlightedCode,
}: TopicClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completed = new Set(progress.completed);
  const dueCount = getDueCards(progress).length;

  const handleMarkDone = () => {
    setProgress((prev) => toggleComplete(prev, content.id));
  };

  const handleRate = (questionId: string, quality: number) => {
    setProgress((prev) => updateSRState(prev, questionId, quality));
  };

  const handleSelectTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        completed={completed}
        selectedTopicId={content.id}
        dueCount={dueCount}
        onSelectTopic={handleSelectTopic}
        onReviewClick={() => router.push("/")}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopicContentView
          content={content}
          blockTitle={blockTitle}
          isDone={completed.has(content.id)}
          highlightedCode={highlightedCode}
          progress={progress}
          onMarkDone={handleMarkDone}
          onRate={handleRate}
        />
        <AskDeeper topicTitle={content.title} content={content} />
      </div>
    </div>
  );
}
