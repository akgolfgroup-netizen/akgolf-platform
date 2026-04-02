import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs daily at 00:05.
 * Resets sessionsUsedThisMonth for subscriptions where billing period has rolled over.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let resetCount = 0;

  try {
    // Find active subscriptions where billingPeriodEnd has passed
    const expiredPeriods = await prisma.userSubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        billingPeriodEnd: { lt: now },
      },
      include: {
        CoachingPackage: { select: { sessionsPerMonth: true } },
      },
    });

    for (const sub of expiredPeriods) {
      // Calculate new billing period (1 month from previous end)
      const newStart = sub.billingPeriodEnd ?? now;
      const newEnd = new Date(newStart);
      newEnd.setMonth(newEnd.getMonth() + 1);

      await prisma.userSubscription.update({
        where: { id: sub.id },
        data: {
          sessionsUsedThisMonth: 0,
          billingPeriodStart: newStart,
          billingPeriodEnd: newEnd,
        },
      });

      resetCount++;
    }

    console.log(`[Cron] Reset ${resetCount} subscription periods`);

    return NextResponse.json({
      ok: true,
      resetCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Reset monthly sessions failed:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
