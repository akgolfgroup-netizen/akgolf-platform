import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { shouldRecompute } from "@/lib/portal/allocation/recompute";

export async function GET(req: Request) {
  // Verifiser cron-secret hvis konfigurert
  const authHeader = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { onboardingCompletedAt: { not: null } },
    select: { id: true },
  });

  const results: Array<{ userId: string; recomputed: boolean; reason?: string }> = [];

  for (const user of users) {
    const check = await shouldRecompute(user.id);
    if (check.should) {
      results.push({ userId: user.id, recomputed: true, reason: check.reason });
      // TODO: Trigger faktisk replanlegging via generatePlan
    } else {
      results.push({ userId: user.id, recomputed: false });
    }
  }

  return NextResponse.json({
    processed: users.length,
    recomputed: results.filter((r) => r.recomputed).length,
    results,
  });
}
