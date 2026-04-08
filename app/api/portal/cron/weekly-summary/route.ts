import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { WeeklySummaryEmail } from "@/lib/portal/email/templates/weekly-summary";
import { subDays, startOfWeek, endOfWeek, subWeeks } from "date-fns";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs every Sunday at 18:00 UTC
 * Sends weekly training summary to all active users
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
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(thisWeekStart, 1);
  const lastWeekEnd = subWeeks(thisWeekEnd, 1);

  // Don't send if already sent this week
  const oneWeekAgo = subDays(now, 7);

  // Get users who haven't received a weekly summary this week
  const { data: users, error: usersError } = await supabase
    .from("User")
    .select("id, name, email, weeklyEmailSentAt")
    .eq("isActive", true)
    .not("email", "is", null)
    .eq("role", "STUDENT")
    .or(`weeklyEmailSentAt.is.null,weeklyEmailSentAt.lt.${oneWeekAgo.toISOString()}`);

  if (usersError) {
    logger.error("[Cron] Error fetching users:", usersError);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  let sent = 0;
  let errors = 0;

  for (const user of (users ?? [])) {
    if (!user.email) continue;

    try {
      // Get this week's logs
      const { data: thisWeekLogs, error: logsError } = await supabase
        .from("TrainingLog")
        .select("focusArea, durationMinutes")
        .eq("userId", user.id)
        .gte("date", thisWeekStart.toISOString())
        .lte("date", thisWeekEnd.toISOString());

      if (logsError) {
        throw logsError;
      }

      // Get last week's logs count
      const { count: lastWeekCount, error: lastWeekError } = await supabase
        .from("TrainingLog")
        .select("*", { count: "exact", head: true })
        .eq("userId", user.id)
        .gte("date", lastWeekStart.toISOString())
        .lte("date", lastWeekEnd.toISOString());

      if (lastWeekError) {
        throw lastWeekError;
      }

      // Calculate streak
      const streak = await calculateStreak(supabase, user.id);

      // Calculate total minutes this week
      const totalMinutes = (thisWeekLogs ?? []).reduce(
        (sum, log) => sum + (log.durationMinutes || 0),
        0
      );

      // Find most common focus area
      const focusAreas = (thisWeekLogs ?? [])
        .map((l) => l.focusArea)
        .filter((f): f is string => f !== null);
      const focusCounts = focusAreas.reduce(
        (acc, area) => {
          acc[area] = (acc[area] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      const topFocusArea =
        Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Din ukentlige treningsoversikt",
        react: WeeklySummaryEmail({
          name: user.name || "Hei",
          sessionsThisWeek: (thisWeekLogs ?? []).length,
          sessionsLastWeek: lastWeekCount ?? 0,
          currentStreak: streak,
          totalMinutes,
          topFocusArea,
        }),
      });

      // Update user
      await supabase
        .from("User")
        .update({ weeklyEmailSentAt: now.toISOString() })
        .eq("id", user.id);

      sent++;
    } catch (error) {
      logger.error(`[Cron] Weekly summary failed for user ${user.id}:`, error);
      errors++;
    }
  }

  logger.info(`[Cron] Weekly summaries sent: ${sent}, errors: ${errors}`);

  return NextResponse.json({
    ok: true,
    sent,
    errors,
    timestamp: now.toISOString(),
  });
}

async function calculateStreak(
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
