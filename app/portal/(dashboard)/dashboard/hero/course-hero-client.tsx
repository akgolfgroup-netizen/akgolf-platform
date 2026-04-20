"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import {
  CourseHero,
  BentoCard,
  BentoGrid,
  BentoEyebrow,
  GlassButton,
  HeroLabel,
  HeroLabelSeparator,
  FloatingTopbar,
  FloatingCrumbs,
  FloatingSegmented,
  MonoLabel,
} from "@/components/portal/patterns";

interface CourseHeroClientProps {
  userName: string;
  stats: {
    bookingsCompleted: number;
    roundsLogged: number;
  };
  handicap: {
    current: number | null;
    trend: number | null;
  };
  nextBooking: {
    id: string;
    instructorName: string;
    serviceName: string;
    duration: number;
    startTime: string | Date;
  } | null;
}

export function CourseHeroClient({
  userName,
  stats,
  handicap,
  nextBooking,
}: CourseHeroClientProps) {
  const [activeTab, setActiveTab] = useState<"today" | "week" | "overview">(
    "today"
  );

  const nextBookingDate = nextBooking
    ? new Date(nextBooking.startTime)
    : null;
  const nextBookingTime = nextBookingDate
    ? format(nextBookingDate, "HH:mm", { locale: nb })
    : null;
  const nextBookingDay = nextBookingDate
    ? format(nextBookingDate, "EEEE d. MMMM", { locale: nb })
    : null;

  const handicapDelta = handicap.trend != null ? handicap.trend : null;
  const handicapDeltaLabel =
    handicapDelta === null
      ? null
      : handicapDelta <= 0
        ? `↓ ${Math.abs(handicapDelta).toFixed(1)} · 30d`
        : `↑ ${handicapDelta.toFixed(1)} · 30d`;
  const handicapDeltaColor =
    handicapDelta === null
      ? "text-surface/55"
      : handicapDelta <= 0
        ? "text-secondary-fixed"
        : "text-[#E85D4E]";

  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10">
      <CourseHero
        bgImage="/images/course-hero/hero-golf-divot.jpg"
        bgAlt="Golf course aerial view"
        overlay="dashboard"
        className="min-h-screen rounded-none"
      >
        {/* Floating Topbar */}
        <FloatingTopbar
          left={
            <FloatingCrumbs
              items={[
                { label: "Portal" },
                { label: "Dashboard", active: true, meta: "Course Hero" },
              ]}
            />
          }
          right={
            <>
              <FloatingSegmented
                items={[
                  { id: "today", label: "I dag" },
                  { id: "week", label: "Uke" },
                  { id: "overview", label: "Oversikt" },
                ]}
                activeId={activeTab}
                onChange={setActiveTab}
              />
              <Link href="/portal">
                <GlassButton
                  variant="glass"
                  size="icon"
                  icon={<Icon name="grid_view" className="w-4 h-4" />}
                  title="Bytt til standard dashboard"
                />
              </Link>
            </>
          }
        />

        {/* Greeting + Hero labels */}
        <div className="absolute top-24 left-8 right-8 z-10">
          <div className="flex items-center gap-3 flex-wrap mb-5">
            <HeroLabel>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shadow-[0_0_12px_#D1F843]" />
              <strong className="text-surface font-semibold">Miklagard GK</strong>
              <HeroLabelSeparator />
              <span>
                {format(new Date(), "d. MMMM", { locale: nb })} · uke{" "}
                {format(new Date(), "w", { locale: nb })}
              </span>
            </HeroLabel>
            {handicap.current != null && (
              <HeroLabel variant="lime">
                <strong>HCP {handicap.current.toFixed(1)}</strong>
              </HeroLabel>
            )}
          </div>

          <MonoLabel
            size="xs"
            uppercase
            className="text-surface/45 block mb-3"
          >
            ◆ God morgen, {userName.split(" ")[0]}
          </MonoLabel>
          <h1 className="text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.02] max-w-2xl">
            Dagen er din.
            <br />
            <span className="text-secondary-fixed">Hold fokuset skarpt.</span>
          </h1>
        </div>

        {/* Bento grid — bottom 55% */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <BentoGrid cols={4} gap="md" className="mb-4">
            {/* Score card */}
            <BentoCard variant="glass" className="col-span-2">
              <BentoEyebrow>Strokes Gained · 30d</BentoEyebrow>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[48px] font-bold tracking-tight leading-none tabular-nums">
                  +2.4
                </span>
                <MonoLabel size="sm" className="text-surface/55">
                  sg/runde
                </MonoLabel>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/18 text-secondary-fixed text-[12px] font-semibold">
                  <Icon name="trending_up" className="w-3 h-3" />
                  0.8 vs forrige
                </span>
                <MonoLabel size="xs" className="text-surface/45">
                  Topp 12% elite
                </MonoLabel>
              </div>
            </BentoCard>

            {/* Handicap */}
            <BentoCard variant="glass" interactive>
              <BentoEyebrow>Handicap</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[36px] font-bold tracking-tight tabular-nums leading-none">
                  {handicap.current != null
                    ? handicap.current.toFixed(1)
                    : "—"}
                </div>
                {handicapDeltaLabel && (
                  <MonoLabel
                    size="xs"
                    className={`mt-2 ${handicapDeltaColor}`}
                  >
                    {handicapDeltaLabel}
                  </MonoLabel>
                )}
              </div>
            </BentoCard>

            {/* Runder */}
            <BentoCard variant="accent" interactive>
              <BentoEyebrow dotColor="#0A1F18">Runder · 30d</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[36px] font-bold tracking-tight tabular-nums leading-none">
                  {stats.roundsLogged}
                </div>
                <MonoLabel size="xs" className="mt-2 text-[#0A1F18]/55">
                  {stats.bookingsCompleted} coaching-økter
                </MonoLabel>
              </div>
            </BentoCard>
          </BentoGrid>

          <BentoGrid cols={3} gap="md">
            {/* Next booking */}
            {nextBooking ? (
              <BentoCard variant="glass" interactive className="col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <BentoEyebrow>
                      Neste · {nextBookingTime}
                    </BentoEyebrow>
                    <h3 className="text-[22px] font-bold tracking-tight mt-3 leading-tight">
                      {nextBooking.serviceName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-surface/70">
                      <span>{nextBooking.instructorName}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-container-lowest/30" />
                      <MonoLabel size="xs" className="text-surface/55">
                        {nextBooking.duration} min
                      </MonoLabel>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-surface/55">
                      <Icon name="calendar_today"Days className="w-3.5 h-3.5" />
                      <span>{nextBookingDay}</span>
                    </div>
                  </div>
                  <Link href={`/portal/bookinger/${nextBooking.id}`}>
                    <GlassButton
                      variant="lime"
                      size="sm"
                      icon={<Icon name="play_arrow" className="w-3 h-3" />}
                    >
                      Forbered
                    </GlassButton>
                  </Link>
                </div>
              </BentoCard>
            ) : (
              <BentoCard variant="glass" className="col-span-2">
                <BentoEyebrow>Neste booking</BentoEyebrow>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-surface/60 text-sm">
                    Ingen kommende bookinger.
                  </p>
                  <Link href="/portal/bookinger/ny">
                    <GlassButton
                      variant="lime"
                      size="sm"
                      icon={<Icon name="add" className="w-3.5 h-3.5" />}
                    >
                      Book time
                    </GlassButton>
                  </Link>
                </div>
              </BentoCard>
            )}

            {/* Hurtighandlinger */}
            <BentoCard variant="glass">
              <BentoEyebrow>Hurtighandlinger</BentoEyebrow>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/portal/runde/ny">
                  <GlassButton
                    variant="glass"
                    size="sm"
                    icon={<Icon name="bolt" className="w-3 h-3" />}
                  >
                    Live runde
                  </GlassButton>
                </Link>
                <Link href="/portal/statistikk">
                  <GlassButton
                    variant="glass"
                    size="sm"
                    icon={<Icon name="my_location" className="w-3 h-3" />}
                  >
                    Statistikk
                  </GlassButton>
                </Link>
                <Link href="/portal/dagbok">
                  <GlassButton
                    variant="glass"
                    size="sm"
                    icon={<Icon name="location_on" className="w-3 h-3" />}
                  >
                    Logg
                  </GlassButton>
                </Link>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </CourseHero>
    </div>
  );
}
