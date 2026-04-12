"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, Target } from "lucide-react";
import { HeroHeading, GlassCard, fadeInUp, staggerContainer } from "@/components/portal/premium";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import { PyramidTag } from "@/components/portal/treningsplan/ak-formula-tags";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import { ManualPlanButton } from "@/components/portal/treningsplan/manual-plan-button";
import type { PyramidLevel } from "@/lib/portal/golf/ak-formula";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
interface SessionExercise { name: string; details: string }

interface DayData {
  dayName: string;
  dateISO: string;
  isToday: boolean;
  session: {
    id: string;
    title: string;
    duration: number;
    focusArea: string | null;
    pyramidLevel: PyramidLevel | null;
    completed: boolean;
    exercises: SessionExercise[];
  } | null;
}

interface TreningsplanClientProps {
  hasPlan: boolean;
  weekNumber: string;
  weekRange: string;
  weekOffset: number;
  weekDays: DayData[];
  canGenerate: boolean;
  userId: string;
}

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
const pyramidConfig: Record<PyramidLevel, { token: string; label: string }> = {
  FYS: { token: "var(--color-warning)", label: "Fysisk" },
  TEK: { token: "var(--color-primary)", label: "Teknikk" },
  SLAG: { token: "var(--color-primary-alt)", label: "Slag" },
  SPILL: { token: "var(--color-ai)", label: "Spill" },
  TURN: { token: "var(--color-grey-900)", label: "Turnering" },
};

const SUB_NAV_TABS = [
  { label: "Ukeplan", href: "/portal/treningsplan" },
  { label: "AI-plan", href: "/portal/treningsplan/ai" },
];

// ---------------------------------------------------------------------
// Day card sub-component (inline, not exported)
// ---------------------------------------------------------------------
function DayCard({ day }: { day: DayData }) {
  const level: PyramidLevel = day.session?.pyramidLevel ?? "SLAG";
  const levelToken = pyramidConfig[level].token;
  const isCompleted = day.session?.completed ?? false;
  const borderLeftColor = isCompleted ? "var(--color-success)" : levelToken;

  return (
    <motion.div
      variants={fadeInUp}
      className="relative rounded-[24px] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)] transition-all duration-300"
      style={day.isToday ? {
        borderColor: "var(--color-accent-cta)",
        boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-accent-cta) 25%, transparent), 0 12px 40px -12px rgba(209,248,67,0.35)",
      } : undefined}
    >
      <div
        className="p-3 text-center border-b"
        style={{
          backgroundColor: day.isToday
            ? "color-mix(in srgb, var(--color-accent-cta) 14%, white)"
            : "color-mix(in srgb, var(--color-grey-100) 70%, white)",
          borderColor: day.isToday
            ? "color-mix(in srgb, var(--color-accent-cta) 30%, transparent)"
            : "rgba(10,31,24,0.06)",
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: day.isToday ? "var(--color-primary)" : "var(--color-muted)" }}>
          {day.dayName}
        </p>
        <p className="text-[22px] font-[300] mt-0.5 tabular-nums tracking-[-0.03em]"
          style={{ color: day.isToday ? "var(--color-primary)" : "var(--color-grey-900)" }}>
          {format(new Date(day.dateISO), "d", { locale: nb })}
        </p>
      </div>

      <div className="p-3 min-h-[180px]">
        {day.session ? (
          <Link href={`/portal/treningsplan/${day.session.id}`}>
            <div className="p-3 rounded-xl border-l-4 transition-all hover:shadow-md" style={{
              borderLeftColor,
              backgroundColor: isCompleted
                ? "color-mix(in srgb, var(--color-success) 10%, white)"
                : `color-mix(in srgb, ${levelToken} 10%, white)`,
            }}>
              <div className="flex items-center justify-between mb-2">
                <PyramidTag level={level} />
                {isCompleted && <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-success)" }} />}
              </div>
              <h4 className="font-medium text-[13px] leading-tight" style={{ color: "var(--color-grey-900)" }}>
                {day.session.title}
              </h4>
              <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: "var(--color-muted)" }}>
                <Clock className="w-3 h-3" />
                {day.session.duration} min
              </div>
              {day.session.exercises.length > 0 && (
                <p className="text-[11px] mt-2" style={{ color: "var(--color-muted)" }}>
                  {day.session.exercises.length} ovelser
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <Target className="w-6 h-6 mb-2" style={{ color: "var(--color-grey-300)" }} />
            <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>Hviledag</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------
export function TreningsplanClient({
  hasPlan, weekNumber, weekRange, weekOffset, weekDays, canGenerate, userId,
}: TreningsplanClientProps) {
  const heroTitle = (
    <>
      Din trenings
      <span className="font-serif italic text-[var(--color-primary)] font-normal">plan</span>
      <span className="text-[var(--color-accent-cta)]">.</span>
    </>
  );

  if (!hasPlan) {
    return (
      <div className="space-y-10">
        <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/treningsplan" />
        <HeroHeading
          label={`Uke ${weekNumber}`}
          title={heroTitle}
          description="Ingen aktiv plan enda. La AI lage en personlig plan, eller kontakt coachen din."
        />
        <GlassCard variant="light" padding="lg" className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[var(--color-primary)]/10">
            <Calendar className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[20px] font-semibold mb-2 text-[var(--color-grey-900)]">
            Din treningsplan er tom
          </h2>
          <p className="text-[13px] max-w-md mx-auto mb-6 text-[var(--color-muted)] leading-relaxed">
            {canGenerate
              ? "Dra ovelser fra banken, eller la AI lage en plan for deg."
              : "Kontakt din coach for a fa en personlig treningsplan."}
          </p>
          {canGenerate && (
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <ManualPlanButton studentId={userId} />
              <GeneratePlanButton studentId={userId} />
            </div>
          )}
        </GlassCard>
      </div>
    );
  }

  const heroDescription = (
    <>
      Uken din i fugleperspektiv.{" "}
      <span className="font-semibold text-[var(--color-grey-900)]">{weekRange}</span>
    </>
  );

  const headerActions = (
    <>
      <div className="flex items-center gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm">
        <Link href={`/portal/treningsplan?week=${weekOffset - 1}`}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
          aria-label="Forrige uke">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        {weekOffset !== 0 && (
          <Link href="/portal/treningsplan"
            className="h-9 px-3 rounded-full text-[12px] font-semibold text-[var(--color-text)] hover:bg-white transition-colors inline-flex items-center">
            I dag
          </Link>
        )}
        <Link href={`/portal/treningsplan?week=${weekOffset + 1}`}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
          aria-label="Neste uke">
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      {canGenerate && (
        <>
          <ManualPlanButton studentId={userId} />
          <GeneratePlanButton studentId={userId} />
        </>
      )}
    </>
  );

  return (
    <div className="space-y-10">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/treningsplan" />
      <HeroHeading
        label={`Uke ${weekNumber}`}
        title={heroTitle}
        description={heroDescription}
        actions={headerActions}
      />

      <div>
        <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--color-muted)]" />
          Ukens plan
        </p>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weekDays.map((day) => <DayCard key={day.dayName} day={day} />)}
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] pt-2">
        <span className="font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Pyramidenivaaer
        </span>
        {(Object.keys(pyramidConfig) as PyramidLevel[]).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: pyramidConfig[key].token }} />
            <span className="text-[var(--color-muted)]">{pyramidConfig[key].label} ({key})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
