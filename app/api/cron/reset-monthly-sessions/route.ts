import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { prisma } from "@/lib/portal/prisma";
import { sendMonthlyResetEmail } from "@/lib/portal/email/send-monthly-reset-email";
import { SubscriptionStatus } from "@prisma/client";

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
 * 4. Send e-post om ubrukte okter (hvis noen)
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { reset: 0, notified: 0, errors: 0 };

  try {
    // Finn aktive abonnementer der faktureringsperioden har utlopt
    const expiredSubs = await prisma.userSubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        billingPeriodEnd: { lte: now },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: { select: { name: true, sessionsPerMonth: true } },
      },
    });

    if (expiredSubs.length === 0) {
      console.log("[cron/reset] Ingen abonnementer a nullstille");
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
        const sessionsTotal = sub.package?.sessionsPerMonth ?? 0;
        const unusedSessions = Math.max(0, sessionsTotal - sessionsUsed);

        // Beregn ny faktureringsperiode (en maned frem)
        const oldEnd = new Date(sub.billingPeriodEnd);
        const newStart = new Date(oldEnd);
        const newEnd = new Date(oldEnd);
        newEnd.setMonth(newEnd.getMonth() + 1);

        // Oppdater abonnementet
        await prisma.userSubscription.update({
          where: { id: sub.id },
          data: {
            sessionsUsedThisMonth: 0,
            billingPeriodStart: newStart,
            billingPeriodEnd: newEnd,
          },
        });

        results.reset++;

        // Send e-post om ubrukte okter
        if (unusedSessions > 0 && sub.user?.email) {
          try {
            await sendMonthlyResetEmail({
              studentName: sub.user.name ?? "Elev",
              studentEmail: sub.user.email,
              packageName: sub.package?.name ?? "Coaching-pakke",
              sessionsUsed: sessionsUsed,
              sessionsTotal: sessionsTotal,
              unusedSessions: unusedSessions,
              newPeriodStart: newStart,
              newPeriodEnd: newEnd,
            });
            results.notified++;
          } catch (emailErr) {
            console.error(
              `[cron/reset] Feil ved sending av e-post til ${sub.user.email}:`,
              emailErr
            );
            // Ikke telle dette som kritisk feil — reset er allerede gjort
          }
        }
      } catch (subError) {
        console.error(
          `[cron/reset] Uventet feil for sub ${sub.id}:`,
          subError
        );
        results.errors++;
      }
    }

    console.log(
      `[cron/reset] Fullfort: ${results.reset} nullstilt, ${results.notified} varslet, ${results.errors} feil`
    );

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (error) {
    console.error("[cron/reset] Uventet feil:", error);
    return NextResponse.json(
      { error: "Intern feil i manedlig reset-cron" },
      { status: 500 }
    );
  }
}
