import { NextResponse } from "next/server";
import { generateQuarterlyReport } from "@/lib/skills/rapport-agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateQuarterlyReport(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
