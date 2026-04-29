/**
 * Uke-detalj for treningsplanen (a6).
 *
 * Pixel-nær re-skin av
 * `public/design-reference/handoff-2026-04-27/screens/a6-treningsplan-detalj.html`.
 *
 * All data hentes via eksisterende server actions i ../actions.ts —
 * ingen ny logikk, kun visning.
 */

import { notFound } from "next/navigation";
import {
  getActivePlan,
  getCurrentPeriodization,
  getWeekEvents,
} from "../../actions";
import { getActiveCoachName } from "../../overview-helpers";
import { WeekDetailClient } from "./week-detail-client";

interface PageProps {
  params: Promise<{ offset: string }>;
}

export default async function TreningsplanUkeDetailPage({ params }: PageProps) {
  const { offset } = await params;
  const weekOffset = parseInt(offset, 10);
  if (Number.isNaN(weekOffset)) notFound();

  const plan = await getActivePlan();
  const periodization = await getCurrentPeriodization();
  const events = await getWeekEvents(weekOffset);

  // Hent ekstra uker (forrige + neste) for week-tabs.
  const [prevEvents, nextEvents] = await Promise.all([
    getWeekEvents(weekOffset - 1),
    getWeekEvents(weekOffset + 1),
  ]);

  const coachName = await getActiveCoachName();

  return (
    <WeekDetailClient
      weekOffset={weekOffset}
      planTitle={plan?.title ?? "Treningsplan"}
      planId={plan?.id ?? null}
      periodization={periodization}
      events={events}
      neighborWeeks={{
        prev: { offset: weekOffset - 1, events: prevEvents },
        next: { offset: weekOffset + 1, events: nextEvents },
      }}
      coachName={coachName}
      coachFeedback={
        plan?.coachFeedback
          ? {
              text: plan.coachFeedback as string,
              at: plan.coachFeedbackAt
                ? new Date(plan.coachFeedbackAt).toISOString()
                : null,
            }
          : null
      }
    />
  );
}
