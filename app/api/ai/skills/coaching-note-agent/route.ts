import { NextResponse } from "next/server";
import { structureCoachingNote } from "@/lib/skills/coaching-note-agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await structureCoachingNote(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
