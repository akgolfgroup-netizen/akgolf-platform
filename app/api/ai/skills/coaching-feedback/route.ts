import { NextResponse } from "next/server";
import { coachingFeedback } from "@/lib/skills/coaching-feedback";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await coachingFeedback(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
