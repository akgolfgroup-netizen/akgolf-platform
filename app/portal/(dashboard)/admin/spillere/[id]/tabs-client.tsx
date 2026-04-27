"use client";

import { ActivityPanel, UpcomingPanel } from "@/components/admin/spillerprofil/activity-card";
import { CoachingCardLong } from "@/components/admin/spillerprofil/coaching-card";
import {
  EconomyCardLong,
  ECONOMY_KPIS,
  EquipmentCardLong,
} from "@/components/admin/spillerprofil/equipment-economy-card";
import {
  ActiveGoalsPanel,
  HcpTimelineSvg,
  KpiStrip,
} from "@/components/admin/spillerprofil/golf-card";
import { MentalCardLong } from "@/components/admin/spillerprofil/mental-card";
import { Panel, PanelHead, Pill, SgBar, COLORS } from "@/components/admin/spillerprofil/primitives";
import {
  SignalsCardLong,
  SignalsPanel,
} from "@/components/admin/spillerprofil/signals-card";
import { TabsShell } from "@/components/admin/spillerprofil/tabs-shell";
import { TRAINING_KPIS, TrainingCardLong } from "@/components/admin/spillerprofil/training-card";
import type {
  ActivityRow,
  CoachNote,
  EquipmentRow,
  GoalRow,
  KpiBlock,
  MoodLevel,
  MoodLog,
  PaymentRow,
  PlayerHero,
  SgRow,
  SignalCard as SignalCardType,
  UpcomingItem,
} from "@/components/admin/spillerprofil/types";

type Data = {
  hero: PlayerHero;
  kpis: KpiBlock[];
  summaryKpis: KpiBlock[];
  sg: SgRow[];
  totalSg: number;
  goals: GoalRow[];
  activity: ActivityRow[];
  coachNotes: CoachNote[];
  moodDays: MoodLevel[];
  moodLogs: MoodLog[];
  preRound: { label: string; tone: "up" | "neutral" }[];
  equipment: EquipmentRow[];
  payments: PaymentRow[];
  signals: SignalCardType[];
  upcoming: UpcomingItem[];
};

export function TabsClient({ data }: { data: Data }) {
  return (
    <TabsShell
      render={(tab) => {
        switch (tab) {
          case "oversikt":
            return <OversiktTab data={data} />;
          case "golf":
            return <GolfTab data={data} />;
          case "coaching":
            return <CoachingTab data={data} />;
          case "mental":
            return <MentalTab data={data} />;
          case "trening":
            return <TreningTab />;
          case "okonomi":
            return <OkonomiTab data={data} />;
          case "signaler":
            return <SignalerTab data={data} />;
        }
      }}
    />
  );
}

function OversiktTab({ data }: { data: Data }) {
  return (
    <>
      <div className="mb-[18px]">
        <KpiStrip kpis={data.kpis} />
      </div>
      <div className="mb-[18px] grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <Panel>
          <PanelHead
            title="HCP-utvikling · 12 måneder"
            sub="3 PR-er denne måneden"
            right={
              <>
                <Pill tone="accent">PR siste 30d</Pill>
                <Pill tone="success">På mål</Pill>
              </>
            }
          />
          <HcpTimelineSvg />
        </Panel>
        <ActiveGoalsPanel goals={data.goals} />
      </div>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <ActivityPanel rows={data.activity} sub="14 dager" />
        <div className="flex flex-col gap-[18px]">
          <Panel>
            <PanelHead title="Strokes Gained · 30d" sub="vs. HCP-snitt" />
            {data.sg.map((row) => (
              <SgBar key={row.label} row={row} labelWidth={96} />
            ))}
            <div
              className="mt-[12px] flex justify-between border-t border-dashed pt-[12px] text-[12px]"
              style={{ borderColor: COLORS.line }}
            >
              <span style={{ color: COLORS.textSubtle }}>Total SG</span>
              <span
                className="font-mono font-semibold"
                style={{ color: data.totalSg >= 0 ? COLORS.success : COLORS.danger }}
              >
                {data.totalSg >= 0 ? "+" : "−"}
                {Math.abs(data.totalSg).toFixed(2)} / runde
              </span>
            </div>
          </Panel>
          <SignalsPanel signals={data.signals} />
          <UpcomingPanel items={data.upcoming} />
        </div>
      </div>
    </>
  );
}

function GolfTab({ data }: { data: Data }) {
  return (
    <div className="grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
      <Panel>
        <PanelHead
          title="Strokes Gained · 30d"
          sub="vs. HCP-snitt"
          right={<Pill tone="info">SG +{data.totalSg.toFixed(2)}</Pill>}
        />
        {data.sg.map((row) => (
          <SgBar key={row.label} row={row} />
        ))}
        <div
          className="mt-[14px] flex justify-between border-t border-dashed pt-[12px] text-[12px]"
          style={{ borderColor: COLORS.line }}
        >
          <span style={{ color: COLORS.textSubtle }}>Total SG</span>
          <span
            className="font-mono font-semibold"
            style={{ color: data.totalSg >= 0 ? COLORS.success : COLORS.danger }}
          >
            {data.totalSg >= 0 ? "+" : "−"}
            {Math.abs(data.totalSg).toFixed(2)} / runde
          </span>
        </div>
        <div className="mt-[18px]">
          <PanelHead title="HCP-utvikling · 12 mnd" />
          <HcpTimelineSvg />
        </div>
      </Panel>
      <ActiveGoalsPanel goals={data.goals} />
    </div>
  );
}

function CoachingTab({ data }: { data: Data }) {
  return (
    <Panel>
      <PanelHead
        title="Coaching"
        sub="23 økter siste 90d · primærcoach Anders K."
        right={<Pill tone="success">På Performance-plan</Pill>}
      />
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
        notes={data.coachNotes}
      />
    </Panel>
  );
}

function MentalTab({ data }: { data: Data }) {
  return (
    <Panel>
      <PanelHead
        title="Mental"
        sub="Selvrapportering · stemning · pre-runde-rutine"
        right={<Pill tone="accent">Stabil</Pill>}
      />
      <MentalCardLong
        moodDays={data.moodDays}
        logs={data.moodLogs}
        preRound={data.preRound}
      />
    </Panel>
  );
}

function TreningTab() {
  return (
    <Panel>
      <PanelHead
        title="Trening"
        sub="Fysisk · søvn · kosthold"
        right={<Pill tone="warn">2 risikofaktorer</Pill>}
      />
      <TrainingCardLong kpis={TRAINING_KPIS} />
    </Panel>
  );
}

function OkonomiTab({ data }: { data: Data }) {
  return (
    <Panel>
      <PanelHead
        title="Økonomi"
        sub="Abonnement · betalinger · pakker"
        right={
          <>
            <Pill tone="success">Aktiv</Pill>
            <Pill>Performance Plus</Pill>
          </>
        }
      />
      <EconomyCardLong kpis={ECONOMY_KPIS} payments={data.payments} />
      <div className="mt-[16px]">
        <PanelHead title="Utstyr" sub="bag-setup" />
        <EquipmentCardLong rows={data.equipment} />
      </div>
    </Panel>
  );
}

function SignalerTab({ data }: { data: Data }) {
  return (
    <Panel>
      <PanelHead
        title="Signaler"
        sub={`${data.signals.length} åpne · automatiske flagg`}
        right={<Pill tone="danger">{data.signals.length} åpne</Pill>}
      />
      <SignalsCardLong signals={data.signals} />
    </Panel>
  );
}
