import { NextResponse } from "next/server";
import { forklarKonsept } from "@/lib/skills/forklar-konsept";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await forklarKonsept({
      question: body.question,
      audience: body.audience,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
