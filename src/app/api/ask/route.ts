import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a senior Java engineer helping a backend developer prepare for technical interviews.
The developer has ~3 years of Spring Boot experience but is rebuilding Java fundamentals.
Answer concisely but with depth. Focus on internals, gotchas, and interview-relevant details.
Keep answers under 300 words.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  try {
    const { topicTitle, context, messages } = await request.json();
    const client = new Anthropic({ apiKey });
    const contextBlock = `Current topic: ${topicTitle}\nSummary: ${context.summary}\nKey details: ${context.deepDive}\nTip: ${context.tip}`;
    const anthropicMessages = messages.map(
      (m: { role: string; text: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      })
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `${SYSTEM_PROMPT}\n\nContext:\n${contextBlock}`,
      messages: anthropicMessages,
    });

    const answer =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
