import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Code execution not configured. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const { code } = await request.json();
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
    const data = await res.json();
    return NextResponse.json({ output: data.output || "No output" });
  } catch {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
