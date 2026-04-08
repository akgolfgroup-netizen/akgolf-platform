import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
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

  const supabase = createServiceClient();
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
    const { data: day0Users, error: day0Error } = await supabase
      .from("User")
      .select("id, name, email")
      .eq("welcomeEmailStep", 0)
      .gte("createdAt", oneDayAgo.toISOString())
      .not("email", "is", null);

    if (day0Error) {
      throw day0Error;
    }

    for (const user of (day0Users ?? [])) {
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

        await supabase
          .from("User")
          .update({ welcomeEmailStep: 1 })
          .eq("id", user.id);

        results.day0++;
      } catch (error) {
        results.errors.push(`Day0 ${user.email}: ${String(error)}`);
      }
    }

    // Day 1: Users who signed up 1-2 days ago (step 1)
    const { data: day1Users, error: day1Error } = await supabase
      .from("User")
      .select(`
        id,
        name,
        email,
        onboardingGoals,
        TrainingLog (id)
      `)
      .eq("welcomeEmailStep", 1)
      .gte("createdAt", twoDaysAgo.toISOString())
      .lt("createdAt", oneDayAgo.toISOString())
      .not("email", "is", null);

    if (day1Error) {
      throw day1Error;
    }

    for (const user of (day1Users ?? [])) {
      if (!user.email) continue;

      try {
        const trainingLogs = user.TrainingLog as { id: string }[] | null;
        const hasLoggedSession = (trainingLogs?.length ?? 0) > 0;
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

        await supabase
          .from("User")
          .update({ welcomeEmailStep: 2 })
          .eq("id", user.id);

        results.day1++;
      } catch (error) {
        results.errors.push(`Day1 ${user.email}: ${String(error)}`);
      }
    }

    // Day 3: Users who signed up 3-4 days ago (step 2)
    const { data: day3Users, error: day3Error } = await supabase
      .from("User")
      .select(`
        id,
        name,
        email,
        TrainingLog (count)
      `)
      .eq("welcomeEmailStep", 2)
      .gte("createdAt", fourDaysAgo.toISOString())
      .lt("createdAt", threeDaysAgo.toISOString())
      .not("email", "is", null);

    if (day3Error) {
      throw day3Error;
    }

    for (const user of (day3Users ?? [])) {
      if (!user.email) continue;

      try {
        const trainingLogCount = (user.TrainingLog as { count: number }[] | null)?.[0]?.count ?? 0;

        const html = await render(
          WelcomeDay3Email({
            name: user.name || "Golfspiller",
            sessionCount: trainingLogCount,
          })
        );

        await resend.emails.send({
          from: process.env.FROM_EMAIL || "AK Golf <hei@akgolf.no>",
          to: user.email,
          subject:
            trainingLogCount > 0
              ? "Bra jobba! Her er neste steg"
              : "Trenger du hjelp a komme i gang?",
          html,
        });

        await supabase
          .from("User")
          .update({ welcomeEmailStep: 3 })
          .eq("id", user.id);

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
    logger.error("Welcome sequence error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome emails" },
      { status: 500 }
    );
  }
}
