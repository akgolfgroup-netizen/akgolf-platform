import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { AbandonedCheckoutEmail } from "@/lib/portal/email/templates/abandoned-checkout";
import { stripe } from "@/lib/portal/stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Users who started checkout 24-48 hours ago
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const results = {
    sent: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Find users with abandoned checkouts (started 24-48h ago)
    const abandonedUsers = await prisma.user.findMany({
      where: {
        checkoutAbandonedAt: {
          gte: fortyEightHoursAgo,
          lt: twentyFourHoursAgo,
        },
        lastCheckoutSessionId: { not: null },
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastCheckoutSessionId: true,
        AppSubscription: {
          where: { status: { in: ["ACTIVE", "TRIALING"] } },
          take: 1,
        },
      },
    });

    for (const user of abandonedUsers) {
      if (!user.email || !user.lastCheckoutSessionId) continue;

      // Skip if user already has active subscription
      if (user.AppSubscription.length > 0) {
        results.skipped++;
        // Clear abandoned checkout flag
        await prisma.user.update({
          where: { id: user.id },
          data: { checkoutAbandonedAt: null, lastCheckoutSessionId: null },
        });
        continue;
      }

      try {
        // Check if checkout session was completed
        const session = await stripe.checkout.sessions.retrieve(
          user.lastCheckoutSessionId
        );

        if (session.status === "complete") {
          // Checkout was completed, clear the flag
          results.skipped++;
          await prisma.user.update({
            where: { id: user.id },
            data: { checkoutAbandonedAt: null, lastCheckoutSessionId: null },
          });
          continue;
        }

        // Get plan name from metadata
        const bundleSlug = session.metadata?.bundleSlug || "Pro";
        const planName = bundleSlug.includes("premium") ? "Elite" : "Pro";

        // Create a recovery URL - link to apper page
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://akgolf.no";
        const checkoutUrl = `${baseUrl}/portal/apper`;

        const html = await render(
          AbandonedCheckoutEmail({
            name: user.name || "Golfspiller",
            planName,
            checkoutUrl,
          })
        );

        await resend.emails.send({
          from: process.env.FROM_EMAIL || "AK Golf <hei@akgolf.no>",
          to: user.email,
          subject: `Fullfor oppgraderingen din til ${planName}`,
          html,
        });

        // Clear the abandoned checkout flag so we don't email again
        await prisma.user.update({
          where: { id: user.id },
          data: { checkoutAbandonedAt: null, lastCheckoutSessionId: null },
        });

        results.sent++;
      } catch (error) {
        results.errors.push(`User ${user.email}: ${String(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.sent,
      skipped: results.skipped,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    logger.error("Abandoned checkout cron error:", error);
    return NextResponse.json(
      { error: "Failed to process abandoned checkouts" },
      { status: 500 }
    );
  }
}
