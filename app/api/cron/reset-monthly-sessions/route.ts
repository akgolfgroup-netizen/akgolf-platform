import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendMonthlyResetEmail } from "@/lib/portal/email/send-monthly-reset-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubscriptionRow {
  id: string;
  userId: string;
  packageId: string;
  sessionsUsedThisMonth: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  user: { id: string; name: string | null; email: string | null } | null;
  package: { name: string; sessionsPerMonth: number | null } | null;
}

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

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const results = { reset: 0, notified: 0, errors: 0 };

  try {
    // Finn aktive abonnementer der faktureringsperioden har utlopt
    const { data: rawSubs, error: fetchError } = await supabase
      .from("UserSubscription")
      .select(
        `
        id,
        userId,
        packageId,
        sessionsUsedThisMonth,
        billingPeriodStart,
        billingPeriodEnd,
        user:User!UserSubscription_userId_fkey (
          id, name, email
        ),
        package:CoachingPackage!UserSubscription_packageId_fkey (
          name, sessionsPerMonth
        )
      `
      )
      .eq("status", "ACTIVE")
      .lte("billingPeriodEnd", now.toISOString());

    if (fetchError) {
      console.error(
        "[cron/reset] Feil ved henting av utlopte abonnementer:",
        fetchError
      );
      return NextResponse.json(
        { error: "Feil ved henting av abonnementer" },
        { status: 500 }
      );
    }

    const expiredSubs = (rawSubs ?? []) as unknown as SubscriptionRow[];

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
        const sessionsUsed = sub.sessionsUsedThisMonth ?? 0;
        const sessionsTotal = sub.package?.sessionsPerMonth ?? 0;
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
          console.error(
            `[cron/reset] Feil ved oppdatering av sub ${sub.id}:`,
            updateError
          );
          results.errors++;
          continue;
        }

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
