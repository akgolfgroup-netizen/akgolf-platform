import { NextResponse } from "next/server";
import { analyserRunde } from "@/lib/skills/analyser-runde";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await analyserRunde(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
