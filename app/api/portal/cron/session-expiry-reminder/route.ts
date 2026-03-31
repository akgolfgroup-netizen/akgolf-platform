import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { SubscriptionStatus } from "@prisma/client";
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

  const now = new Date();
  const reminderWindowStart = addDays(now, 9);
  const reminderWindowEnd = addDays(now, 11);

  let remindersSent = 0;

  try {
    // Find subscriptions expiring in 9-11 days with unused sessions
    const subscriptions = await prisma.userSubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        billingPeriodEnd: {
          gte: reminderWindowStart,
          lte: reminderWindowEnd,
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { name: true, sessionsPerMonth: true } },
      },
    });

    const resend = getResend();
    if (!resend) {
      console.warn("[Cron] Resend not configured, skipping email reminders");
      return NextResponse.json({ ok: true, remindersSent: 0, skipped: true });
    }

    for (const sub of subscriptions) {
      if (!sub.user.email) continue;
      if (!sub.package.sessionsPerMonth) continue;

      const unusedSessions = sub.package.sessionsPerMonth - sub.sessionsUsedThisMonth;
      if (unusedSessions <= 0) continue;

      const expiryDate = format(sub.billingPeriodEnd!, "d. MMMM", { locale: nb });

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: sub.user.email,
          subject: `${unusedSessions} ubrukte coaching-sesjoner utloper ${expiryDate}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #1D1D1F;">Hei${sub.user.name ? ` ${sub.user.name.split(" ")[0]}` : ""}!</h2>
              <p style="color: #374151; line-height: 1.6;">
                Du har <strong>${unusedSessions} ubrukte coaching-sesjoner</strong> i ${sub.package.name}-pakken din.
              </p>
              <p style="color: #374151; line-height: 1.6;">
                Disse utloper <strong>${expiryDate}</strong> og kan ikke overføres til neste måned.
              </p>
              <p style="margin-top: 24px;">
                <a href="https://akgolf.no/portal/bookinger/ny"
                   style="display: inline-block; background: #1D1D1F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
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
        console.error(`[Cron] Failed to send expiry reminder to ${sub.user.email}:`, error);
      }
    }

    console.log(`[Cron] Sent ${remindersSent} session expiry reminders`);

    return NextResponse.json({
      ok: true,
      remindersSent,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Session expiry reminder failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
