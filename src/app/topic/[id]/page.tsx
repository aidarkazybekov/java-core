import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { ROADMAP } from "@/data/roadmap";
import { getTopicContent } from "@/data/content";
import { getTopic } from "@/data/roadmap";
import TopicClient from "./TopicClient";

export async function generateStaticParams() {
  return ROADMAP.flatMap((block) =>
    block.topics.map((topic) => ({ id: topic.id }))
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = getTopic(id);
  if (!meta) notFound();

  const content = await getTopicContent(id);
  if (!content) notFound();

  const highlightedCode = await codeToHtml(content.code, {
    lang: "java",
    theme: "github-dark-dimmed",
  });

  return (
    <TopicClient
      content={content}
      blockTitle={meta.block.title}
      highlightedCode={highlightedCode}
    />
  );
}
