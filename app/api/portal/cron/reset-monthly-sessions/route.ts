import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs daily at 00:05.
 * Resets sessionsUsedThisMonth for subscriptions where billing period has rolled over.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  let resetCount = 0;

  try {
    // Find active subscriptions where billingPeriodEnd has passed
    const { data: expiredPeriods, error: subsError } = await supabase
      .from("UserSubscription")
      .select(`
        id,
        billingPeriodEnd,
        CoachingPackage (sessionsPerMonth)
      `)
      .eq("status", "ACTIVE")
      .lt("billingPeriodEnd", now.toISOString());

    if (subsError) {
      throw subsError;
    }

    for (const sub of (expiredPeriods ?? [])) {
      // Calculate new billing period (1 month from previous end)
      const newStart = sub.billingPeriodEnd ? new Date(sub.billingPeriodEnd) : now;
      const newEnd = new Date(newStart);
      newEnd.setMonth(newEnd.getMonth() + 1);

      const { error: updateError } = await supabase
        .from("UserSubscription")
        .update({
          sessionsUsedThisMonth: 0,
          billingPeriodStart: newStart.toISOString(),
          billingPeriodEnd: newEnd.toISOString(),
        })
        .eq("id", sub.id);

      if (updateError) {
        logger.error(`[Cron] Failed to reset subscription ${sub.id}:`, updateError);
        continue;
      }

      resetCount++;
    }

    logger.info(`[Cron] Reset ${resetCount} subscription periods`);

    return NextResponse.json({
      ok: true,
      resetCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error("[Cron] Reset monthly sessions error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
