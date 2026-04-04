"use client";

import {
  Users,
  UserPlus,
  UserCheck,
  TrendingDown,
  CalendarCheck,
  XCircle,
  Trophy,
  BarChart3,
} from "lucide-react";
import {
  MCTopbar,
  MCCard,
  MCCardHeader,
  MCCardTitle,
  MCCardBody,
  useMCSidebar,
} from "@/components/portal/mission-control";

interface ReportData {
  totalStudents: number;
  newStudents: number;
  activeStudents: number;
  retentionRate: number;
  completedSessions: number;
  cancelledSessions: number;
  cancellationRate: number;
  handicapImprovement: number;
  bookingTrends: { week: string; count: number }[];
  tierDistribution: { tier: string; count: number }[];
}

interface RapporterClientProps {
  data: ReportData;
}

const tierLabels: Record<string, string> = {
  VISITOR: "Visitor",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

const tierColors: Record<string, string> = {
  VISITOR: "#86868B",
  ACADEMY: "#007AFF",
  STARTER: "#34C759",
  PRO: "#FF9500",
  ELITE: "#2D6A4F",
};

export function RapporterClient({ data }: RapporterClientProps) {
  const { toggle } = useMCSidebar();

  const maxBookings = Math.max(...data.bookingTrends.map((t) => t.count), 1);

  return (
    <>
      <MCTopbar
        title="Rapporter"
        subtitle="KPIer og analyse"
        onMenuClick={toggle}
        notificationCount={0}
      />

      <div className="p-5 space-y-6">
        {/* Student KPIs */}
        <div>
          <h2 className="text-sm font-bold text-[#1D1D1F] mb-3">Elever</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Totalt
                    </div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                      {data.totalStudents}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1D1D1F]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Nye (30d)
                    </div>
                    <div className="text-2xl font-bold text-[#34C759] mt-1">
                      +{data.newStudents}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-[#34C759]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Aktive (30d)
                    </div>
                    <div className="text-2xl font-bold text-[#007AFF] mt-1">
                      {data.activeStudents}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#007AFF]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Retensjon
                    </div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                      {data.retentionRate}%
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>
          </div>
        </div>

        {/* Session KPIs */}
        <div>
          <h2 className="text-sm font-bold text-[#1D1D1F] mb-3">Okter (siste 30 dager)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Fullforte
                    </div>
                    <div className="text-2xl font-bold text-[#34C759] mt-1">
                      {data.completedSessions}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-[#34C759]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Kansellerte
                    </div>
                    <div className="text-2xl font-bold text-[#FF3B30] mt-1">
                      {data.cancelledSessions}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-[#FF3B30]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      Kanselleringsrate
                    </div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                      {data.cancellationRate}%
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-[#86868B]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>

            <MCCard>
              <MCCardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                      HCP-forbedring
                    </div>
                    <div className="text-2xl font-bold text-[#34C759] mt-1">
                      {data.handicapImprovement}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                </div>
              </MCCardBody>
            </MCCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trends */}
          <MCCard>
            <MCCardHeader>
              <MCCardTitle>Booking-trend (siste 4 uker)</MCCardTitle>
            </MCCardHeader>
            <MCCardBody>
              <div className="space-y-3">
                {data.bookingTrends.length > 0 ? (
                  data.bookingTrends.map((trend) => (
                    <div key={trend.week}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-[#1D1D1F]">
                          Uke fra {trend.week}
                        </span>
                        <span className="text-[11px] text-[#6E6E73]">
                          {trend.count} bookinger
                        </span>
                      </div>
                      <div className="h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#007AFF] rounded-full"
                          style={{ width: `${(trend.count / maxBookings) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-[#86868B] text-center py-4">
                    Ingen bookinger i perioden
                  </div>
                )}
              </div>
            </MCCardBody>
          </MCCard>

          {/* Tier Distribution */}
          <MCCard>
            <MCCardHeader>
              <MCCardTitle>Fordeling per tier</MCCardTitle>
            </MCCardHeader>
            <MCCardBody>
              <div className="space-y-3">
                {data.tierDistribution.length > 0 ? (
                  data.tierDistribution.map((tier) => {
                    const percentage =
                      data.totalStudents > 0
                        ? (tier.count / data.totalStudents) * 100
                        : 0;
                    return (
                      <div key={tier.tier}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-sm"
                              style={{
                                backgroundColor:
                                  tierColors[tier.tier] || "#86868B",
                              }}
                            />
                            <span className="text-[11px] font-medium text-[#1D1D1F]">
                              {tierLabels[tier.tier] || tier.tier}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#6E6E73]">
                            {tier.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                tierColors[tier.tier] || "#86868B",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] text-[#86868B] text-center py-4">
                    Ingen elever funnet
                  </div>
                )}
              </div>
            </MCCardBody>
          </MCCard>
        </div>
      </div>
    </>
  );
}
