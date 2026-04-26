import { NextResponse } from "next/server";
import { genererTreningsplanAi } from "@/lib/skills/generer-treningsplan-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await genererTreningsplanAi(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
