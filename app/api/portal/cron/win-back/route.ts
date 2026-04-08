import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { WinBackDay3Email } from "@/lib/portal/email/templates/win-back-day3";
import { WinBackDay7Email } from "@/lib/portal/email/templates/win-back-day7";
import { WinBackDay14Email } from "@/lib/portal/email/templates/win-back-day14";
import { subDays, format } from "date-fns";
import { nb } from "date-fns/locale";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs daily at 09:00 UTC
 * Sends win-back emails to inactive users:
 * - Day 3: "Vi savner deg"
 * - Day 7: "Din streak venter"
 * - Day 14: "20% rabatt på Pro"
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const day3Threshold = subDays(now, 3);
  const day7Threshold = subDays(now, 7);
  const day14Threshold = subDays(now, 14);

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  let sent = 0;
  let errors = 0;

  // Get users who need win-back emails
  // Step 0: Users with no activity in 3+ days and winBackEmailStep = 0
  // Step 1: Users with no activity in 7+ days and winBackEmailStep = 1
  // Step 2: Users with no activity in 14+ days and winBackEmailStep = 2

  // Step 0 → 1: Day 3 email
  const { data: step0Users, error: step0Error } = await supabase
    .from("User")
    .select("id, name, email, lastActiveAt")
    .eq("isActive", true)
    .not("email", "is", null)
    .eq("role", "STUDENT")
    .eq("winBackEmailStep", 0)
    .in("subscriptionTier", ["VISITOR", "ACADEMY"])
    .lt("lastActiveAt", day3Threshold.toISOString())
    .limit(50);

  if (step0Error) {
    logger.error("[Cron] Error fetching step0 users:", step0Error);
  }

  for (const user of (step0Users ?? [])) {
    if (!user.email) continue;

    try {
      // Get streak
      const streak = await getStreak(supabase, user.id);
      const lastActiveDate = user.lastActiveAt
        ? format(new Date(user.lastActiveAt), "d. MMMM", { locale: nb })
        : "en stund siden";

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Vi savner deg i treningsdagboken!",
        react: WinBackDay3Email({
          name: user.name || "Hei",
          lastActiveDate,
          streak,
        }),
      });

      await supabase
        .from("User")
        .update({ winBackEmailStep: 1 })
        .eq("id", user.id);

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 3 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Step 1 → 2: Day 7 email
  const { data: step1Users, error: step1Error } = await supabase
    .from("User")
    .select("id, name, email")
    .eq("isActive", true)
    .not("email", "is", null)
    .eq("role", "STUDENT")
    .eq("winBackEmailStep", 1)
    .in("subscriptionTier", ["VISITOR", "ACADEMY"])
    .lt("lastActiveAt", day7Threshold.toISOString())
    .limit(50);

  if (step1Error) {
    logger.error("[Cron] Error fetching step1 users:", step1Error);
  }

  for (const user of (step1Users ?? [])) {
    if (!user.email) continue;

    try {
      const [totalSessions, bestStreak] = await Promise.all([
        getTrainingLogCount(supabase, user.id),
        getBestStreak(supabase, user.id),
      ]);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Din treningsreise venter pa deg",
        react: WinBackDay7Email({
          name: user.name || "Hei",
          totalSessions,
          bestStreak,
        }),
      });

      await supabase
        .from("User")
        .update({ winBackEmailStep: 2 })
        .eq("id", user.id);

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 7 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Step 2 → 3: Day 14 email with discount
  const { data: step2Users, error: step2Error } = await supabase
    .from("User")
    .select("id, name, email")
    .eq("isActive", true)
    .not("email", "is", null)
    .eq("role", "STUDENT")
    .eq("winBackEmailStep", 2)
    .in("subscriptionTier", ["VISITOR", "ACADEMY"])
    .lt("lastActiveAt", day14Threshold.toISOString())
    .limit(50);

  if (step2Error) {
    logger.error("[Cron] Error fetching step2 users:", step2Error);
  }

  for (const user of (step2Users ?? [])) {
    if (!user.email) continue;

    try {
      // Generate unique discount code
      const discountCode = `WINBACK-${nanoid(8).toUpperCase()}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "20% rabatt pa Pro — kun for deg!",
        react: WinBackDay14Email({
          name: user.name || "Hei",
          discountCode,
          discountPercent: 20,
        }),
      });

      await supabase
        .from("User")
        .update({ winBackEmailStep: 3 })
        .eq("id", user.id);

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 14 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Reset users who have become active again
  const { data: activeAgain, error: resetError } = await supabase
    .from("User")
    .update({ winBackEmailStep: 0 })
    .gt("winBackEmailStep", 0)
    .gte("lastActiveAt", day3Threshold.toISOString())
    .select("id");

  if (resetError) {
    logger.error("[Cron] Error resetting active users:", resetError);
  }

  const resetCount = activeAgain?.length ?? 0;

  logger.info(
    `[Cron] Win-back: ${sent} emails sent, ${errors} errors, ${resetCount} users reset`
  );

  return NextResponse.json({
    ok: true,
    sent,
    errors,
    reset: resetCount,
    timestamp: now.toISOString(),
  });
}

async function getStreak(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<number> {
  const { data: logs, error } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false });

  if (error || !logs || logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ]
    .sort()
    .reverse();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

async function getBestStreak(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<number> {
  const { data: logs, error } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: true });

  if (error || !logs || logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ].sort();

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diff === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

async function getTrainingLogCount(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("TrainingLog")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId);

  if (error) {
    logger.error(`[getTrainingLogCount] Error for user ${userId}:`, error);
    return 0;
  }

  return count ?? 0;
}
