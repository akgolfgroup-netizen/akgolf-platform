import {
  Activity,
  BellRing,
  Brain,
  Dumbbell,
  Flag,
  Hammer,
  History,
  LayoutDashboard,
  Wallet,
} from "lucide-react";
import { ActivityList } from "@/components/admin/spillerprofil/activity-card";
import { CoachingCardLong } from "@/components/admin/spillerprofil/coaching-card";
import {
  EconomyCardLong,
  ECONOMY_KPIS,
  EquipmentCardLong,
} from "@/components/admin/spillerprofil/equipment-economy-card";
import { GolfCardLong } from "@/components/admin/spillerprofil/golf-card";
import { Hero360Compact } from "@/components/admin/spillerprofil/hero-360";
import { LongPageToc } from "@/components/admin/spillerprofil/long-page-toc";
import { MentalCardLong } from "@/components/admin/spillerprofil/mental-card";
import {
  MOCK_ACTIVITY_FULL,
  MOCK_COACH_NOTES,
  MOCK_EQUIPMENT,
  MOCK_GOALS,
  MOCK_HERO,
  MOCK_KPIS_SUMMARY,
  MOCK_MOOD_DAYS,
  MOCK_MOOD_LOGS,
  MOCK_PAYMENTS,
  MOCK_PRE_ROUND,
  MOCK_SG,
  MOCK_SIGNALS,
} from "@/components/admin/spillerprofil/mock-data";
import { Pill } from "@/components/admin/spillerprofil/primitives";
import { SectionShell } from "@/components/admin/spillerprofil/section-shell";
import { SignalsCardLong } from "@/components/admin/spillerprofil/signals-card";
import { SummaryCardLong } from "@/components/admin/spillerprofil/summary-card";
import { TRAINING_KPIS, TrainingCardLong } from "@/components/admin/spillerprofil/training-card";

// TODO: erstatt med Prisma-data — samme oppslag som tabs-page.

export default async function SpillerprofilLongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;

  const totalSg = MOCK_SG.reduce((a, r) => a + r.value, 0);

  return (
    <div
      className="min-h-full px-7 pb-12 pt-6 text-white"
      style={{ background: "#0A1F18" }}
    >
      <div
        className="grid items-start gap-6"
        style={{ gridTemplateColumns: "200px 1fr" }}
      >
        <div className="col-span-2 mb-[6px]">
          <Hero360Compact hero={MOCK_HERO} />
        </div>

        <LongPageToc />

        <div className="flex min-w-0 flex-col gap-[14px]">
          <SectionShell
            id="sec-summary"
            tone="lime"
            icon={<LayoutDashboard className="h-4 w-4" />}
            title="Sammendrag"
            sub="Q2 2025 · 30d"
            pills={
              <>
                <Pill tone="accent">På sporet</Pill>
                <Pill tone="success">3 PR</Pill>
              </>
            }
          >
            <SummaryCardLong kpis={MOCK_KPIS_SUMMARY} />
          </SectionShell>

          <SectionShell
            id="sec-golf"
            tone="blue"
            icon={<Flag className="h-4 w-4" />}
            title="Golf-ferdigheter"
            sub="Strokes Gained · ferdighetsnivå · 86 runder"
            pills={<Pill tone="info">SG +{totalSg.toFixed(2)}</Pill>}
          >
            <GolfCardLong sg={MOCK_SG} totalSg={totalSg} goals={MOCK_GOALS} />
          </SectionShell>

          <SectionShell
            id="sec-coaching"
            tone="green"
            icon={<Dumbbell className="h-4 w-4" />}
            title="Coaching"
            sub="23 økter siste 90d · primærcoach Anders K."
            pills={<Pill tone="success">På Performance-plan</Pill>}
          >
            <CoachingCardLong
              kpis={[
                { label: "Økter 90d", value: "23" },
                { label: "Snitt-lengde", value: "52", subText: "min" },
                { label: "Cancel-rate", value: "4%", trend: "up", trendLabel: "lavt" },
              ]}
              weekProgress={{
                current: 4,
                total: 10,
                description:
                  "Tempo-fokus driver · putting-protokoll · short-game-blokk i uke 5–6 · turneringsforberedelse uke 8–10.",
              }}
              notes={MOCK_COACH_NOTES}
            />
          </SectionShell>

          <SectionShell
            id="sec-mental"
            tone="violet"
            icon={<Brain className="h-4 w-4" />}
            title="Mental"
            sub="Selvrapportering · stemning · pre-runde-rutine"
            pills={<Pill tone="accent">Stabil</Pill>}
          >
            <MentalCardLong
              moodDays={MOCK_MOOD_DAYS}
              logs={MOCK_MOOD_LOGS}
              preRound={MOCK_PRE_ROUND}
            />
          </SectionShell>

          <SectionShell
            id="sec-trening"
            tone="amber"
            icon={<Activity className="h-4 w-4" />}
            title="Trening"
            sub="Fysisk · søvn · kosthold"
            pills={<Pill tone="warn">2 risikofaktorer</Pill>}
          >
            <TrainingCardLong kpis={TRAINING_KPIS} />
          </SectionShell>

          <SectionShell
            id="sec-utstyr"
            tone="neutral"
            icon={<Hammer className="h-4 w-4" />}
            title="Utstyr"
            sub="Bag-setup · siste fitting"
            pills={<Pill tone="info">Fitted feb 2025</Pill>}
          >
            <EquipmentCardLong rows={MOCK_EQUIPMENT} />
          </SectionShell>

          <SectionShell
            id="sec-okonomi"
            tone="green"
            icon={<Wallet className="h-4 w-4" />}
            title="Økonomi"
            sub="Abonnement · betalinger · pakker"
            pills={
              <>
                <Pill tone="success">Aktiv</Pill>
                <Pill>Performance Plus</Pill>
              </>
            }
          >
            <EconomyCardLong kpis={ECONOMY_KPIS} payments={MOCK_PAYMENTS} />
          </SectionShell>

          <SectionShell
            id="sec-signaler"
            tone="coral"
            icon={<BellRing className="h-4 w-4" />}
            title="Signaler"
            sub="Automatiske flagg · 2 åpne"
            pills={<Pill tone="danger">{MOCK_SIGNALS.length} åpne</Pill>}
          >
            <SignalsCardLong signals={MOCK_SIGNALS} />
          </SectionShell>

          <SectionShell
            id="sec-aktivitet"
            tone="blue"
            icon={<History className="h-4 w-4" />}
            title="Aktivitet"
            sub="Full historikk · siste 90 dager"
            pills={<Pill>{MOCK_ACTIVITY_FULL.length} hendelser</Pill>}
          >
            <ActivityList rows={MOCK_ACTIVITY_FULL} />
          </SectionShell>
        </div>
      </div>
    </div>
  );
}
