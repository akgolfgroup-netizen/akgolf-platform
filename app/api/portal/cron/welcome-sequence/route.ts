import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeDay0Email } from "@/lib/portal/email/templates/welcome-day0";
import { WelcomeDay1Email } from "@/lib/portal/email/templates/welcome-day1";
import { WelcomeDay3Email } from "@/lib/portal/email/templates/welcome-day3";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  const results = {
    day0: 0,
    day1: 0,
    day3: 0,
    errors: [] as string[],
  };

  try {
    // Day 0: Users who signed up in the last 24 hours (step 0)
    const day0Users = await prisma.user.findMany({
      where: {
        welcomeEmailStep: 0,
        createdAt: { gte: oneDayAgo },
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    for (const user of day0Users) {
      if (!user.email) continue;

      try {
        const html = await render(
          WelcomeDay0Email({ name: user.name || "Golfspiller" })
        );

        await resend.emails.send({
          from: process.env.FROM_EMAIL || "AK Golf <hei@akgolf.no>",
          to: user.email,
          subject: "Velkommen til AK Golf Academy!",
          html,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { welcomeEmailStep: 1 },
        });

        results.day0++;
      } catch (error) {
        results.errors.push(`Day0 ${user.email}: ${String(error)}`);
      }
    }

    // Day 1: Users who signed up 1-2 days ago (step 1)
    const day1Users = await prisma.user.findMany({
      where: {
        welcomeEmailStep: 1,
        createdAt: {
          gte: twoDaysAgo,
          lt: oneDayAgo,
        },
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        onboardingGoals: true,
        TrainingLog: {
          select: { id: true },
          take: 1,
        },
      },
    });

    for (const user of day1Users) {
      if (!user.email) continue;

      try {
        const hasLoggedSession = user.TrainingLog.length > 0;
        const hasSetGoals = !!user.onboardingGoals;

        const html = await render(
          WelcomeDay1Email({
            name: user.name || "Golfspiller",
            hasLoggedSession,
            hasSetGoals,
          })
        );

        await resend.emails.send({
          from: process.env.FROM_EMAIL || "AK Golf <hei@akgolf.no>",
          to: user.email,
          subject: "3 ting du kan gjore i dag",
          html,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { welcomeEmailStep: 2 },
        });

        results.day1++;
      } catch (error) {
        results.errors.push(`Day1 ${user.email}: ${String(error)}`);
      }
    }

    // Day 3: Users who signed up 3-4 days ago (step 2)
    const day3Users = await prisma.user.findMany({
      where: {
        welcomeEmailStep: 2,
        createdAt: {
          gte: fourDaysAgo,
          lt: threeDaysAgo,
        },
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { TrainingLog: true },
        },
      },
    });

    for (const user of day3Users) {
      if (!user.email) continue;

      try {
        const html = await render(
          WelcomeDay3Email({
            name: user.name || "Golfspiller",
            sessionCount: user._count.TrainingLog,
          })
        );

        await resend.emails.send({
          from: process.env.FROM_EMAIL || "AK Golf <hei@akgolf.no>",
          to: user.email,
          subject:
            user._count.TrainingLog > 0
              ? "Bra jobba! Her er neste steg"
              : "Trenger du hjelp a komme i gang?",
          html,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { welcomeEmailStep: 3 },
        });

        results.day3++;
      } catch (error) {
        results.errors.push(`Day3 ${user.email}: ${String(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent: {
        day0: results.day0,
        day1: results.day1,
        day3: results.day3,
      },
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error("Welcome sequence error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome emails" },
      { status: 500 }
    );
  }
}
