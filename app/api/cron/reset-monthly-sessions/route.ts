import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { sendMonthlyResetEmail } from "@/lib/portal/email/send-monthly-reset-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Nullstill sessionsUsedThisMonth ved slutten av faktureringsperioden.
 * Kjorer daglig kl 00:05 (Europe/Oslo).
 *
 * For hver UserSubscription der billingPeriodEnd <= na:
 * 1. Les sessionsUsedThisMonth og sessionsPerMonth fra pakken
 * 2. Nullstill sessionsUsedThisMonth til 0
 * 3. Flytt billingPeriodStart/End en maned frem
 * 4. Send e-post om ubrukte økter (hvis noen)
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const results = { reset: 0, notified: 0, errors: 0 };

  try {
    // Finn aktive abonnementer der faktureringsperioden har utlopt
    const { data: expiredSubs, error: subsError } = await supabase
      .from("UserSubscription")
      .select(`
        id,
        sessionsUsedThisMonth,
        billingPeriodEnd,
        User (id, name, email),
        CoachingPackage (name, sessionsPerMonth)
      `)
      .eq("status", "ACTIVE")
      .lte("billingPeriodEnd", now.toISOString());

    if (subsError) {
      throw subsError;
    }

    if (!expiredSubs || expiredSubs.length === 0) {
      logger.info("[cron/reset] Ingen abonnementer a nullstille");
      return NextResponse.json({
        success: true,
        timestamp: now.toISOString(),
        message: "Ingen abonnementer a nullstille",
        ...results,
      });
    }

    for (const sub of expiredSubs) {
      try {
        // Skip if billingPeriodEnd is null (should not happen due to filter)
        if (!sub.billingPeriodEnd) continue;

        const sessionsUsed = sub.sessionsUsedThisMonth ?? 0;
        const sessionsTotal = (sub.CoachingPackage as { sessionsPerMonth?: number })?.sessionsPerMonth ?? 0;
        const unusedSessions = Math.max(0, sessionsTotal - sessionsUsed);

        // Beregn ny faktureringsperiode (en maned frem)
        const oldEnd = new Date(sub.billingPeriodEnd);
        const newStart = new Date(oldEnd);
        const newEnd = new Date(oldEnd);
        newEnd.setMonth(newEnd.getMonth() + 1);

        // Oppdater abonnementet
        const { error: updateError } = await supabase
          .from("UserSubscription")
          .update({
            sessionsUsedThisMonth: 0,
            billingPeriodStart: newStart.toISOString(),
            billingPeriodEnd: newEnd.toISOString(),
          })
          .eq("id", sub.id);

        if (updateError) {
          throw updateError;
        }

        results.reset++;

        // Send e-post om ubrukte økter
        const user = (sub.User as { id: string; name?: string; email?: string }[] | null)?.[0] ?? null;
        if (unusedSessions > 0 && user?.email) {
          try {
            await sendMonthlyResetEmail({
              studentName: user.name ?? "Elev",
              studentEmail: user.email,
              packageName: (sub.CoachingPackage as { name?: string })?.name ?? "Coaching-pakke",
              sessionsUsed: sessionsUsed,
              sessionsTotal: sessionsTotal,
              unusedSessions: unusedSessions,
              newPeriodStart: newStart,
              newPeriodEnd: newEnd,
            });
            results.notified++;
          } catch (emailErr) {
            logger.error(
              `[cron/reset] Feil ved sending av e-post til ${user.email}:`,
              emailErr
            );
            // Ikke telle dette som kritisk feil — reset er allerede gjort
          }
        }
      } catch (subError) {
        logger.error(
          `[cron/reset] Uventet feil for sub ${sub.id}:`,
          subError
        );
        results.errors++;
      }
    }

    logger.info(
      `[cron/reset] Fullfort: ${results.reset} nullstilt, ${results.notified} varslet, ${results.errors} feil`
    );

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (error) {
    logger.error("[cron/reset] Uventet feil:", error);
    return NextResponse.json(
      { error: "Intern feil i manedlig reset-cron" },
      { status: 500 }
    );
  }
}
