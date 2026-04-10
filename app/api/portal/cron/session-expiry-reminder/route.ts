import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { addDays, format } from "date-fns";
import { nb } from "date-fns/locale";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs daily at 09:00.
 * Sends reminder to users with unused sessions expiring in ~10 days.
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
  const reminderWindowStart = addDays(now, 9);
  const reminderWindowEnd = addDays(now, 11);

  let remindersSent = 0;

  try {
    // Find subscriptions expiring in 9-11 days with unused sessions
    const { data: subscriptions, error: subsError } = await supabase
      .from("UserSubscription")
      .select(`
        id,
        sessionsUsedThisMonth,
        billingPeriodEnd,
        User (name, email),
        CoachingPackage (name, sessionsPerMonth)
      `)
      .eq("status", "ACTIVE")
      .gte("billingPeriodEnd", reminderWindowStart.toISOString())
      .lte("billingPeriodEnd", reminderWindowEnd.toISOString());

    if (subsError) {
      throw subsError;
    }

    const resend = getResend();
    if (!resend) {
      logger.warn("[Cron] Resend not configured, skipping email reminders");
      return NextResponse.json({ ok: true, remindersSent: 0, skipped: true });
    }

    for (const sub of (subscriptions ?? [])) {
      const user = sub.User as { name?: string; email?: string } | null;
      const coachingPackage = sub.CoachingPackage as { name?: string; sessionsPerMonth?: number } | null;

      if (!user?.email) continue;
      if (!coachingPackage?.sessionsPerMonth) continue;

      const unusedSessions = coachingPackage.sessionsPerMonth - sub.sessionsUsedThisMonth;
      if (unusedSessions <= 0) continue;

      const expiryDate = format(new Date(sub.billingPeriodEnd!), "d. MMMM", { locale: nb });

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `${unusedSessions} ubrukte coaching-sesjoner utloper ${expiryDate}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #0A1F18;">Hei${user.name ? ` ${user.name.split(" ")[0]}` : ""}!</h2>
              <p style="color: #374151; line-height: 1.6;">
                Du har <strong>${unusedSessions} ubrukte coaching-sesjoner</strong> i ${coachingPackage.name}-pakken din.
              </p>
              <p style="color: #374151; line-height: 1.6;">
                Disse utloper <strong>${expiryDate}</strong> og kan ikke overføres til neste måned.
              </p>
              <p style="margin-top: 24px;">
                <a href="https://akgolf.no/portal/bookinger/ny"
                   style="display: inline-block; background: #0A1F18; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                  Book en sesjon nå
                </a>
              </p>
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 32px;">
                — Anders @ AK Golf Academy
              </p>
            </div>
          `,
        });

        remindersSent++;
      } catch (error) {
        logger.error(`[Cron] Failed to send expiry reminder to ${user.email}:`, error);
      }
    }

    logger.info(`[Cron] Sent ${remindersSent} session expiry reminders`);

    return NextResponse.json({
      ok: true,
      remindersSent,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error("[Cron] Session expiry reminder failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
