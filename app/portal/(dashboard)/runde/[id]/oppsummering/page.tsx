import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Flag,
  Target,
  TrendingDown,
  TrendingUp,
  Circle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoundSummaryPage({ params }: Props) {
  const { id } = await params;
  await requirePortalUser();

  const round = await getRoundDetail(id);
  if (!round) notFound();

  type HoleResultRow = {
    scoreToPar: number;
    gir: boolean;
    fairwayHit: boolean | null;
    putts: number;
  };
  const holes = (round.HoleResult ?? []) as HoleResultRow[];
  const courseName = (round.Course as { name?: string } | null)?.name ?? "Ukjent bane";
  const coursePar = (round.Course as { par?: number } | null)?.par ?? 72;

  const eagles = holes.filter((h) => h.scoreToPar <= -2).length;
  const birdies = holes.filter((h) => h.scoreToPar === -1).length;
  const pars = holes.filter((h) => h.scoreToPar === 0).length;
  const bogeys = holes.filter((h) => h.scoreToPar === 1).length;
  const doubles = holes.filter((h) => h.scoreToPar >= 2).length;

  const girCount = holes.filter((h) => h.gir).length;
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;
  const totalPutts = holes.reduce((s, h) => s + h.putts, 0);

  const scoreColor =
    (round.scoreToPar ?? 0) < 0
      ? "text-[var(--color-success-text)]"
      : (round.scoreToPar ?? 0) === 0
        ? "text-[var(--color-portal-text)]"
        : "text-[var(--color-error)]";

  const sgSections = [
    { label: "Off The Tee", value: round.sgOffTheTee, icon: Target },
    { label: "Approach", value: round.sgApproach, icon: Target },
    { label: "Short Game", value: round.sgShortGame, icon: Circle },
    { label: "Putting", value: round.sgPutting, icon: Flag },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href="/portal/runde/ny"
        className="flex items-center gap-2 text-sm text-[var(--color-portal-secondary)] hover:text-[var(--color-portal-text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Ny runde
      </Link>

      {/* Score headline */}
      <div className="bg-white rounded-2xl border border-[var(--color-portal-border)] p-6 text-center">
        <div className="text-sm text-[var(--color-portal-secondary)]">{courseName}</div>
        <div className={`text-6xl font-bold mt-2 tabular-nums tracking-tight ${scoreColor}`}>
          {round.totalScore ?? "-"}
        </div>
        <div className="text-lg text-[var(--color-portal-secondary)] mt-1 tabular-nums">
          {(round.scoreToPar ?? 0) > 0 ? "+" : ""}
          {round.scoreToPar ?? 0} (par {coursePar})
        </div>
        <div className="text-xs text-[var(--color-portal-muted)] mt-2">
          {new Date(round.date).toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Score-fordeling */}
      <div className="bg-white rounded-2xl border border-[var(--color-portal-border)] p-6">
        <h2 className="text-sm font-semibold text-[var(--color-portal-text)] mb-4">
          Score-fordeling
        </h2>
        <div className="flex items-end justify-around h-28">
          {[
            { label: "Eagle+", count: eagles, color: "#EAB308" },
            { label: "Birdie", count: birdies, color: "#EF4444" },
            { label: "Par", count: pars, color: "#005840" },
            { label: "Bogey", count: bogeys, color: "#5A6E66" },
            { label: "Dobbel+", count: doubles, color: "#A5B2AD" },
          ].map((item) => {
            const maxCount = Math.max(eagles, birdies, pars, bogeys, doubles, 1);
            const height = Math.max(4, (item.count / maxCount) * 80);
            return (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[var(--color-portal-text)]">
                  {item.count}
                </span>
                <div
                  className="w-10 rounded-t-lg transition-all"
                  style={{ height: `${height}px`, backgroundColor: item.color }}
                />
                <span className="text-xs text-[var(--color-portal-secondary)]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistikk */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-[var(--color-portal-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-portal-text)] tabular-nums tracking-tight">
            {fairwayHoles.length > 0
              ? `${Math.round((fairwaysHit / fairwayHoles.length) * 100)}%`
              : "-"}
          </div>
          <div className="text-xs text-[var(--color-portal-secondary)] mt-1">
            Fairway ({fairwaysHit}/{fairwayHoles.length})
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-portal-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-portal-text)] tabular-nums tracking-tight">
            {holes.length > 0
              ? `${Math.round((girCount / holes.length) * 100)}%`
              : "-"}
          </div>
          <div className="text-xs text-[var(--color-portal-secondary)] mt-1">
            GIR ({girCount}/{holes.length})
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-portal-border)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-portal-text)] tabular-nums tracking-tight">
            {totalPutts}
          </div>
          <div className="text-xs text-[var(--color-portal-secondary)] mt-1">
            Putts ({holes.length > 0 ? (totalPutts / holes.length).toFixed(1) : "-"}/hull)
          </div>
        </div>
      </div>

      {/* SG Breakdown */}
      {round.sgTotal !== null && (
        <div className="bg-white rounded-2xl border border-[var(--color-portal-border)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-portal-text)] mb-1">
            Strokes Gained
          </h2>
          <div className="text-3xl font-bold text-[var(--color-portal-text)] mb-4 tabular-nums tracking-tight">
            {(round.sgTotal ?? 0) > 0 ? "+" : ""}
            {(round.sgTotal ?? 0).toFixed(1)}
          </div>
          <div className="space-y-3">
            {sgSections.map((sg) => {
              if (sg.value === null) return null;
              const isPositive = sg.value > 0;
              return (
                <div key={sg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-[var(--color-success)]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-[var(--color-error)]" />
                    )}
                    <span className="text-sm text-[var(--color-portal-text)]">
                      {sg.label}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isPositive
                        ? "text-[var(--color-success-text)]"
                        : "text-[var(--color-error)]"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {sg.value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DECADE Score */}
      {round.decadeScore !== null && (
        <div className="bg-white rounded-2xl border border-[var(--color-portal-border)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-portal-text)] mb-1">
            DECADE Score
          </h2>
          <div className="text-3xl font-bold text-[var(--color-portal-text)] tabular-nums tracking-tight">
            {round.decadeScore}/100
          </div>
          <div className="w-full bg-[var(--color-portal-hover)] rounded-full h-3 mt-3">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${round.decadeScore}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-portal-secondary)] mt-2">
            Strategietterlevelse og beslutningskvalitet
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/portal/statistikk"
          className="flex-1 text-center py-3 rounded-[20px] border border-[var(--color-portal-border)] text-[var(--color-portal-text)] font-medium hover:bg-[var(--color-portal-hover)] transition-all duration-300"
        >
          Se statistikk
        </Link>
        <Link
          href="/portal/runde/ny"
          className="flex-1 text-center py-3 rounded-[20px] bg-primary text-white font-medium hover:opacity-85 active:scale-[0.98] transition-all duration-300"
        >
          Ny runde
        </Link>
      </div>
    </div>
  );
}
