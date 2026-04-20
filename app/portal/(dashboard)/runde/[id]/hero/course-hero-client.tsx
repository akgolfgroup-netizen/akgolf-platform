"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { useState } from "react";
import { Target, Compass } from "lucide-react";
import {
  CourseHero,
  GlassPanel,
  GlassButton,
  HeroLabel,
  HeroLabelSeparator,
  FloatingTopbar,
  FloatingCrumbs,
  MonoLabel,
} from "@/components/portal/patterns";

interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  lengthMeter: number;
}

interface HoleResult {
  holeNumber: number;
  score: number;
  putts: number;
}

interface Props {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: Hole[];
  existingResults: HoleResult[];
  currentHole: Hole | null;
  totalScore: number;
  relative: number;
  completedCount: number;
}

export function RundeCourseHeroClient({
  roundId,
  courseName,
  coursePar,
  holes,
  existingResults,
  currentHole,
  totalScore,
  relative,
  completedCount,
}: Props) {
  const [scoreInput, setScoreInput] = useState<number | null>(null);

  const relativeLabel =
    relative === 0
      ? "E"
      : relative > 0
        ? `+${relative}`
        : `${relative}`;

  const currentHoleResult = existingResults.find(
    (r) => r.holeNumber === currentHole?.holeNumber
  );

  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10">
      <CourseHero
        bgImage="/images/course-hero/hero-golf-divot.jpg"
        bgAlt="Course fairway from elevated tee"
        overlay="immersive"
        className="min-h-screen rounded-none"
      >
        {/* Floating Topbar */}
        <FloatingTopbar
          left={
            <FloatingCrumbs
              items={[
                { label: "Portal" },
                { label: "Runde" },
                {
                  label: `Hull ${currentHole?.holeNumber ?? "-"}`,
                  active: true,
                  meta: `Par ${currentHole?.par ?? "-"}`,
                },
              ]}
            />
          }
          right={
            <>
              <Link href={`/portal/runde/${roundId}`}>
                <GlassButton
                  variant="glass"
                  size="icon"
                  icon={<Icon name="grid_view" className="w-4 h-4" />}
                  title="Standard visning"
                />
              </Link>
              <GlassButton
                variant="lime"
                size="sm"
                icon={<Icon name="save" className="w-3 h-3" />}
              >
                Lagre
              </GlassButton>
            </>
          }
        />

        {/* Hero label — course + hole */}
        <div className="absolute top-24 left-8 z-10 flex items-center gap-3 flex-wrap">
          <HeroLabel>
            <Icon name="flag" className="w-3 h-3" />
            <strong className="text-surface font-semibold">{courseName}</strong>
            <HeroLabelSeparator />
            <span>
              Hull {currentHole?.holeNumber ?? "-"} · Par{" "}
              {currentHole?.par ?? "-"}
            </span>
          </HeroLabel>
          {currentHole && (
            <HeroLabel variant="lime">
              <strong>{currentHole.lengthMeter}m</strong>
            </HeroLabel>
          )}
        </div>

        {/* Main layout: 3-kolonne — score venstre, bane midten, caddie høyre */}
        <div className="absolute inset-x-8 top-40 bottom-28 z-10 grid grid-cols-[280px_1fr_300px] gap-6">
          {/* Score & progress */}
          <div className="flex flex-col gap-4">
            <GlassPanel padding="md">
              <MonoLabel size="xs" uppercase className="text-surface/45 block">
                Total score
              </MonoLabel>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[48px] font-bold tracking-tight leading-none tabular-nums">
                  {totalScore}
                </span>
                <MonoLabel
                  size="sm"
                  className={
                    relative < 0
                      ? "text-secondary-fixed"
                      : relative > 0
                        ? "text-[#E85D4E]"
                        : "text-surface/55"
                  }
                >
                  {relativeLabel}
                </MonoLabel>
              </div>
              <MonoLabel size="xs" className="text-surface/45 mt-3 block">
                {completedCount} / 18 hull · Par {coursePar}
              </MonoLabel>
            </GlassPanel>

            <GlassPanel padding="md">
              <MonoLabel size="xs" uppercase className="text-surface/45 block mb-3">
                Hull-navigator
              </MonoLabel>
              <div className="grid grid-cols-6 gap-1.5">
                {holes.slice(0, 18).map((h) => {
                  const result = existingResults.find(
                    (r) => r.holeNumber === h.holeNumber
                  );
                  const isCurrent = h.holeNumber === currentHole?.holeNumber;
                  const hasResult = !!result;
                  const diff = result ? result.score - h.par : 0;
                  return (
                    <div
                      key={h.id}
                      className={[
                        "rounded-md py-2 text-center",
                        isCurrent
                          ? "bg-secondary-fixed text-[#0A1F18]"
                          : hasResult
                            ? diff < 0
                              ? "bg-secondary-fixed/25 text-secondary-fixed"
                              : diff > 0
                                ? "bg-[#E85D4E]/25 text-[#E85D4E]"
                                : "bg-surface-container-lowest/10 text-surface"
                            : "bg-surface-container-lowest/5 text-surface/40",
                      ].join(" ")}
                    >
                      <div className="text-[9px] font-mono opacity-70">
                        {h.holeNumber}
                      </div>
                      <div className="text-[14px] font-bold tabular-nums leading-none mt-0.5">
                        {result?.score ?? "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>

          {/* Bane-hero midten (plass til SVG/shot-tracking senere) */}
          <div className="relative flex items-center justify-center">
            {/* Distance pill */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-container-lowest/92 text-[#0A1F18] text-xs font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.25)]">
              <MonoLabel size="xs">
                {currentHole?.lengthMeter ?? 0}m til flagg
              </MonoLabel>
            </div>

            {/* Center call-to-action — score input */}
            <div className="flex flex-col items-center gap-6">
              <MonoLabel size="xs" uppercase className="text-surface/45">
                Slagtelling
              </MonoLabel>
              <div className="flex items-center gap-3">
                {[2, 3, 4, 5, 6, 7].map((score) => {
                  const diff = currentHole ? score - currentHole.par : 0;
                  const isSelected = scoreInput === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setScoreInput(score)}
                      className={[
                        "w-14 h-14 rounded-2xl font-bold text-xl tabular-nums",
                        "border backdrop-blur-[22px] transition-all duration-200",
                        isSelected
                          ? "bg-secondary-fixed text-[#0A1F18] border-transparent scale-110"
                          : "bg-[rgba(12,22,17,0.62)] border-white/14 text-surface hover:bg-surface-container-lowest/10",
                      ].join(" ")}
                    >
                      {score}
                      <div
                        className={[
                          "text-[9px] font-mono mt-0.5",
                          isSelected
                            ? "text-[#0A1F18]/60"
                            : diff < 0
                              ? "text-secondary-fixed"
                              : diff > 0
                                ? "text-[#E85D4E]"
                                : "text-surface/55",
                        ].join(" ")}
                      >
                        {diff === 0
                          ? "PAR"
                          : diff < 0
                            ? `${diff}`
                            : `+${diff}`}
                      </div>
                    </button>
                  );
                })}
              </div>
              {scoreInput && currentHole && (
                <MonoLabel size="sm" className="text-secondary-fixed">
                  Velg for hull {currentHole.holeNumber} · vil lagres
                </MonoLabel>
              )}
            </div>
          </div>

          {/* Caddie glass-panel høyre */}
          <div className="flex flex-col gap-4">
            <GlassPanel padding="md">
              <div className="flex items-center gap-3 mb-3">
                <Compass className="w-5 h-5 text-secondary-fixed" />
                <div>
                  <h4 className="text-[15px] font-bold leading-tight">
                    Caddie-tips
                  </h4>
                  <MonoLabel size="xs" className="text-surface/55">
                    AI · basert på din runde
                  </MonoLabel>
                </div>
              </div>
              <p className="text-[13px] text-surface/80 leading-relaxed">
                Dogleg høyre. Hold deg til venstre for bunkeren — du har vind i
                ryggen. Jern 6 anbefales basert på ditt carry siste 30 dager.
              </p>
            </GlassPanel>

            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <Icon name="air" className="w-6 h-6 text-secondary-fixed" />
                <div className="flex-1">
                  <MonoLabel size="xs" uppercase className="text-surface/45 block">
                    Vær nå
                  </MonoLabel>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold tabular-nums">14°</span>
                    <MonoLabel size="xs" className="text-surface/55">
                      NV 6 m/s
                    </MonoLabel>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel padding="md">
              <MonoLabel size="xs" uppercase className="text-surface/45 block mb-3">
                Denne hullet
              </MonoLabel>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-surface/60">Score</span>
                  <MonoLabel size="sm">
                    {currentHoleResult?.score ?? "—"}
                  </MonoLabel>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-surface/60">Putts</span>
                  <MonoLabel size="sm">
                    {currentHoleResult?.putts ?? "—"}
                  </MonoLabel>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-surface/60">Target par</span>
                  <MonoLabel size="sm">{currentHole?.par ?? "—"}</MonoLabel>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Bottom bar — navigate between holes */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <GlassButton
            variant="glass"
            size="icon"
            icon={<Icon name="chevron_left" className="w-4 h-4" />}
            disabled={!currentHole || currentHole.holeNumber <= 1}
          />
          <GlassButton variant="dark" icon={<Icon name="my_location" className="w-3.5 h-3.5" />}>
            Hull {currentHole?.holeNumber ?? "-"} av 18
          </GlassButton>
          <GlassButton
            variant="glass"
            size="icon"
            icon={<Icon name="chevron_right" className="w-4 h-4" />}
            disabled={!currentHole || currentHole.holeNumber >= 18}
          />
        </div>
      </CourseHero>
    </div>
  );
}
