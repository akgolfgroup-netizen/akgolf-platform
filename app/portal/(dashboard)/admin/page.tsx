import { DagensFokusPageHeader } from "@/components/admin/dagens-fokus/page-header";
import { SignalsGrid } from "@/components/admin/dagens-fokus/signals-grid";
import { KpiStrip } from "@/components/admin/dagens-fokus/kpi-strip";
import { TodayTimeline } from "@/components/admin/dagens-fokus/today-timeline";
import { TasksCard } from "@/components/admin/dagens-fokus/tasks-card";
import { QuickActionsCard } from "@/components/admin/dagens-fokus/quick-actions-card";
import {
  MOCK_SIGNALS,
  MOCK_KPIS,
  MOCK_TIMELINE,
  MOCK_TASKS,
  MOCK_QUICK_ACTIONS,
} from "@/components/admin/dagens-fokus/mock-data";

// TODO: koble til ekte data
// - signals: lib/portal/coaching-signals/computeCoachingSignalsForCoach(coachUserId)
// - timeline: prisma.booking.findMany({ where: { instructorId, startTime: { gte: dayStart, lt: dayEnd } } })
// - tasks: ny modell CoachTask eller gjenbruk Notification med kategori
// - kpis: aggregat fra Player count + Booking + Stripe MRR + Invoice past_due

export default function DagensFokusPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <DagensFokusPageHeader
        eyebrow="Dagens fokus · Mandag 28 april"
        title="Tre signaler trenger din oppmerksomhet"
        subtitle="Du har 6 okter i dag · 4 forberedt · Markus jobber med 8"
      />

      <SignalsGrid signals={MOCK_SIGNALS} />

      <KpiStrip kpis={MOCK_KPIS} />

      <div className="mt-[18px] grid grid-cols-[1.5fr_1fr] gap-4">
        <TodayTimeline entries={MOCK_TIMELINE} />
        <div className="flex flex-col gap-4">
          <TasksCard tasks={MOCK_TASKS} />
          <QuickActionsCard actions={MOCK_QUICK_ACTIONS} />
        </div>
      </div>
    </div>
  );
}
