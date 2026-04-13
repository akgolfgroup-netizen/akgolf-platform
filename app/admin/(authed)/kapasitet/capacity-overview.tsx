"use client";

import { TrendingUp, TrendingDown, Calendar, Users, Wallet, Clock } from "lucide-react";
import type { CapacityData } from "./actions";

function formatKr(value: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value) + " kr";
}

function formatPercent(value: number): string {
  return Math.round(value * 100) + "%";
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function StatCard({ title, value, subtitle, icon, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-white border border-[#D5DFDB] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-[#7A8C85] uppercase tracking-wide">
          {title}
        </span>
        <div className="text-[#0A1F18]">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-[#0A1F18] mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-[#7A8C85]">{subtitle}</p>
      )}
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${
          trend === "up" ? "text-[#1A4D36]" :
          trend === "down" ? "text-[#EF4444]" :
          "text-[#7A8C85]"
        }`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> :
           trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

function CoachCapacityCard({ coach }: { coach: CapacityData["coaches"][0] }) {
  const occupancyColor = coach.occupancy >= 0.8
    ? "#1A4D36"
    : coach.occupancy >= 0.5
    ? "#C48A32"
    : "#EF4444";

  return (
    <div className="bg-white border border-[#D5DFDB] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0A1F18]">{coach.name}</h3>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: `color-mix(in srgb, ${occupancyColor} 20%, transparent)`,
            color: occupancyColor
          }}
        >
          {formatPercent(coach.occupancy)} belegg
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[#7A8C85] mb-1">Timer booket</p>
          <p className="text-lg font-semibold text-[#0A1F18]">
            {coach.bookedSlots} / {coach.weeklySlots}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#7A8C85] mb-1">Inntekt uke</p>
          <p className="text-lg font-semibold text-[#0A1F18]">
            {formatKr(coach.weeklyRevenue)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#ECF0EF] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.min(coach.occupancy * 100, 100)}%`,
            background: occupancyColor
          }}
        />
      </div>
    </div>
  );
}

function OccupancyHeatmap({ dailyBreakdown, coaches }: {
  dailyBreakdown: CapacityData["dailyBreakdown"];
  coaches: string[];
}) {
  const getColor = (booked: number, total: number) => {
    if (total === 0) return "#ECF0EF";
    const ratio = booked / total;
    if (ratio >= 0.8) return "#1A4D36";
    if (ratio >= 0.5) return "#C48A32";
    if (ratio > 0) return "color-mix(in srgb, #C48A32 50%, #ECF0EF)";
    return "#ECF0EF";
  };

  return (
    <div className="bg-white border border-[#D5DFDB] rounded-xl p-5">
      <h3 className="font-semibold text-[#0A1F18] mb-4">Belegg per dag</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-[#7A8C85] pb-2"></th>
              {dailyBreakdown.map((day) => (
                <th
                  key={day.day}
                  className="text-center text-[#7A8C85] pb-2 px-2 capitalize"
                >
                  {day.day.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coaches.map((coachName) => (
              <tr key={coachName}>
                <td className="text-[#0A1F18] py-1 pr-4 whitespace-nowrap">
                  {coachName.split(" ")[0]}
                </td>
                {dailyBreakdown.map((day) => {
                  const data = day.coaches[coachName] ?? { booked: 0, total: 0 };
                  return (
                    <td key={day.day} className="text-center py-1 px-2">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center mx-auto"
                        style={{ background: getColor(data.booked, data.total) }}
                        title={`${data.booked}/${data.total} timer`}
                      >
                        <span className="text-[#0A1F18] font-medium">
                          {data.total > 0 ? data.booked : "-"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-[#7A8C85]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: "#1A4D36" }} />
          <span>80%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: "#C48A32" }} />
          <span>50-80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: "#ECF0EF" }} />
          <span>&lt;50%</span>
        </div>
      </div>
    </div>
  );
}

export function CapacityOverview({ data }: { data: CapacityData }) {
  const coachNames = data.coaches.map((c) => c.name);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Belegg uke"
          value={formatPercent(data.weeklyTotal.occupancy)}
          subtitle={`${data.weeklyTotal.booked} av ${data.weeklyTotal.slots} timer`}
          icon={<Calendar className="w-5 h-5" />}
          trend={data.weeklyTotal.occupancy >= 0.7 ? "up" : "neutral"}
        />
        <StatCard
          title="Inntekt uke"
          value={formatKr(data.weeklyTotal.revenue)}
          subtitle={`${data.weekRange.from} - ${data.weekRange.to}`}
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Inntekt mnd"
          value={formatKr(data.monthlyTotal.revenue)}
          subtitle={`${data.monthlyTotal.bookedCount} bookinger`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Potensial uke"
          value={formatKr(data.weeklyTotal.maxRevenue)}
          subtitle="Ved 100% belegg"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Coach Cards */}
      <div>
        <h2 className="text-lg font-semibold text-[#0A1F18] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0A1F18]" />
          Per trener
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.coaches.map((coach) => (
            <CoachCapacityCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <OccupancyHeatmap
        dailyBreakdown={data.dailyBreakdown}
        coaches={coachNames}
      />
    </div>
  );
}
