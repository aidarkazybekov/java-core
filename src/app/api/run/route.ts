import { NextRequest, NextResponse } from "next/server";

interface JDoodleResponse {
  output?: string;
  statusCode?: number;
  memory?: string;
  cpuTime?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Code execution not configured. Set JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET.",
      },
      { status: 500 }
    );
  }

  try {
    const { code } = await request.json();
    const started = Date.now();
    const res = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: code,
        language: "java",
        versionIndex: "5",
      }),
    });
    const data = (await res.json()) as JDoodleResponse;
    const elapsed = Date.now() - started;
    return NextResponse.json({
      output: data.output ?? "",
      statusCode: data.statusCode ?? null,
      cpuTime: data.cpuTime ?? null,
      memory: data.memory ?? null,
      elapsedMs: elapsed,
    });
  } catch {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
