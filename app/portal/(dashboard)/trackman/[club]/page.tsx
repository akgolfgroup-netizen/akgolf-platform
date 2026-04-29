import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { DispersionPlot } from "@/components/portal/trackman/dispersion-plot";
import { ClubTrendChart } from "@/components/portal/trackman/club-trend-chart";
import Link from "next/link";
import { ArrowLeft, Target, Gauge, RotateCw, Wind } from "lucide-react";

interface ClubPageProps {
  params: Promise<{ club: string }>;
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function generateMetadata({ params }: ClubPageProps): Promise<Metadata> {
  const { club } = await params;
  const decoded = decodeURIComponent(club);
  return {
    title: `${decoded} · TrackMan | PlayersHQ`,
  };
}

export default async function ClubDetailPage({ params }: ClubPageProps) {
  const user = await requirePortalUser();
  const { club } = await params;
  const clubName = decodeURIComponent(club);

  const since90 = new Date();
  since90.setDate(since90.getDate() - 90);

  const since84 = new Date();
  since84.setDate(since84.getDate() - 84);

  const allShots = await prisma.trackManShotData.findMany({
    where: {
      userId: user.id,
      club: clubName,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (allShots.length === 0) {
    notFound();
  }

  const shots = allShots.filter((s) => s.createdAt >= since90);

  // ── Hero-stats (siste 90 dager) ──
  const carries = shots.map((s) => s.carryDistance).filter((v): v is number => v !== null);
  const ballSpeeds = shots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
  const smashFactors = shots.map((s) => s.smashFactor).filter((v): v is number => v !== null);
  const spinRates = shots.map((s) => s.spinRate).filter((v): v is number => v !== null);

  const avgCarry = carries.length > 0 ? Math.round(avg(carries) * 10) / 10 : null;
  const avgBallSpeed = ballSpeeds.length > 0 ? Math.round(avg(ballSpeeds) * 10) / 10 : null;
  const avgSmash = smashFactors.length > 0 ? Math.round(avg(smashFactors) * 100) / 100 : null;
  const avgSpin = spinRates.length > 0 ? Math.round(avg(spinRates)) : null;

  // ── Trend: snitt-carry per uke siste 12 uker ──
  const trendShots = await prisma.trackManShotData.findMany({
    where: {
      userId: user.id,
      club: clubName,
      carryDistance: { not: null },
      createdAt: { gte: since84 },
    },
    select: { carryDistance: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const weekMap = new Map<string, number[]>();
  for (const shot of trendShots) {
    if (shot.carryDistance === null) continue;
    const weekStart = startOfWeek(shot.createdAt).toISOString().slice(0, 10);
    const existing = weekMap.get(weekStart) ?? [];
    existing.push(shot.carryDistance);
    weekMap.set(weekStart, existing);
  }

  const trendPoints = Array.from(weekMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weekStart, values]) => ({
      weekStart,
      avgCarry: Math.round(avg(values) * 10) / 10,
      shotCount: values.length,
    }));

  // ── Siste 20 slag ──
  const last20 = allShots.slice(0, 20);

  const plotShots = shots.map((s) => ({
    id: s.id,
    shotNumber: s.shotNumber,
    club: s.club,
    ballSpeed: s.ballSpeed,
    carryDistance: s.carryDistance,
    totalDistance: s.totalDistance,
    spinRate: s.spinRate,
    launchAngle: s.launchAngle,
    offlineDistance: s.offlineDistance,
  }));

  const formatDate = (d: Date) =>
    d.toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/portal/trackman"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-ink-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">{clubName}</h1>
          <p className="text-sm text-ink-muted">Siste 90 dager · {shots.length} slag</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Snitt carry"
          value={avgCarry !== null ? `${avgCarry}m` : "–"}
          icon={<Target className="w-4 h-4 text-primary" />}
        />
        <StatCard
          label="Snitt ballfart"
          value={avgBallSpeed !== null ? `${avgBallSpeed} mph` : "–"}
          icon={<Gauge className="w-4 h-4 text-warning" />}
        />
        <StatCard
          label="Smash factor"
          value={avgSmash !== null ? `${avgSmash}` : "–"}
          icon={<RotateCw className="w-4 h-4 text-success" />}
        />
        <StatCard
          label="Snitt spin"
          value={avgSpin !== null ? `${avgSpin} rpm` : "–"}
          icon={<Wind className="w-4 h-4 text-info" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-line shadow-card">
          <h3 className="text-sm font-semibold text-ink mb-4">Spredningsplot</h3>
          <DispersionPlot shots={plotShots} />
        </div>

        <div className="bg-card rounded-2xl p-5 border border-line shadow-card">
          <h3 className="text-sm font-semibold text-ink mb-4">Carry-trend (uker)</h3>
          <ClubTrendChart data={trendPoints} />
        </div>
      </div>

      {/* Shot table */}
      <div className="bg-card rounded-2xl border border-line overflow-hidden shadow-card">
        <div className="p-4 border-b border-line">
          <h3 className="font-semibold text-ink">Siste 20 slag</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                {["Dato", "#", "Carry", "Total", "Ballfart", "Spin", "Launch"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider p-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {last20.map((shot) => (
                <tr key={shot.id} className="border-t border-line-soft hover:bg-surface/50">
                  <td className="p-4 text-ink">{formatDate(shot.createdAt)}</td>
                  <td className="p-4 text-ink">{shot.shotNumber}</td>
                  <td className="p-4 text-ink">
                    {shot.carryDistance !== null ? `${Math.round(shot.carryDistance)}m` : "–"}
                  </td>
                  <td className="p-4 text-ink">
                    {shot.totalDistance !== null ? `${Math.round(shot.totalDistance)}m` : "–"}
                  </td>
                  <td className="p-4 text-ink">
                    {shot.ballSpeed !== null ? `${shot.ballSpeed} mph` : "–"}
                  </td>
                  <td className="p-4 text-ink">
                    {shot.spinRate !== null ? `${Math.round(shot.spinRate)} rpm` : "–"}
                  </td>
                  <td className="p-4 text-ink">
                    {shot.launchAngle !== null ? `${shot.launchAngle}°` : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-line p-4 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-ink tabular-nums">{value}</p>
    </div>
  );
}
