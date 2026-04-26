import { NextResponse } from "next/server";
import { vurderOpprykk } from "@/lib/skills/vurder-opprykk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await vurderOpprykk({ playerId: body.playerId });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
