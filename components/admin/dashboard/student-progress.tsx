"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, AlertCircle, ChevronRight, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminLineChart } from "@/components/portal/mission-control/ui/charts/AdminLineChart";
import type { AdminLineChartDatum } from "@/components/portal/mission-control/ui/charts/AdminLineChart";
import { cn } from "@/lib/utils";

interface StudentProgressData {
  hcpTrend: AdminLineChartDatum[];
  topImprovements: Array<{
    id: string;
    name: string;
    hcpChange: number;
    currentHcp: number;
    avatar?: string;
  }>;
  needsFollowUp: Array<{
    id: string;
    name: string;
    lastActivity: string;
    reason: string;
  }>;
}

// Generate mock HCP trend data
const generateHcpTrend = (): AdminLineChartDatum[] => {
  const data: AdminLineChartDatum[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    data.push({
      label: date.toLocaleDateString("nb-NO", { month: "short" }),
      value: Number((18.5 - (5 - i) * 0.4 + Math.random() * 0.5).toFixed(1)),
    });
  }
  return data;
};

const defaultData: StudentProgressData = {
  hcpTrend: generateHcpTrend(),
  topImprovements: [
    { id: "1", name: "Ola Nordmann", hcpChange: -3.2, currentHcp: 15.4 },
    { id: "2", name: "Kari Hansen", hcpChange: -2.8, currentHcp: 22.1 },
    { id: "3", name: "Per Olsen", hcpChange: -2.1, currentHcp: 12.3 },
    { id: "4", name: "Lisa Pedersen", hcpChange: -1.9, currentHcp: 18.7 },
    { id: "5", name: "Erik Johansen", hcpChange: -1.5, currentHcp: 9.2 },
  ],
  needsFollowUp: [
    { id: "6", name: "Maren Solberg", lastActivity: "14 dager siden", reason: "Ingen trening registrert" },
    { id: "7", name: "Thomas Berg", lastActivity: "21 dager siden", reason: "Ingen aktivitet" },
  ],
};

function StudentAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-grey-100 flex items-center justify-center text-sm font-semibold text-grey-400">
      {initial}
    </div>
  );
}

function ImprovementItem({
  student,
  rank,
}: {
  student: StudentProgressData["topImprovements"][0];
  rank: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-grey-50 transition-colors">
      <span
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          rank === 1 && "bg-warning/20 text-warning",
          rank === 2 && "bg-grey-200 text-grey-400",
          rank === 3 && "bg-[#CD7F32]/20 text-[#CD7F32]",
          rank > 3 && "text-grey-300"
        )}
      >
        {rank}
      </span>
      <StudentAvatar name={student.name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black truncate">{student.name}</p>
        <p className="text-xs text-grey-400">HCP: {student.currentHcp}</p>
      </div>
      <div className="flex items-center gap-1 text-success">
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-semibold tabular-nums">{student.hcpChange}</span>
      </div>
    </div>
  );
}

function FollowUpItem({ student }: { student: StudentProgressData["needsFollowUp"][0] }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-error-light/50 hover:bg-error-light transition-colors">
      <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black">{student.name}</p>
        <p className="text-xs text-grey-400">{student.lastActivity}</p>
        <p className="text-xs text-error mt-1">{student.reason}</p>
      </div>
      <Link
        href={`/admin/elever/${student.id}`}
        className="text-grey-400 hover:text-black transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

interface StudentProgressProps {
  data?: StudentProgressData;
}

export function StudentProgress({ data = defaultData }: StudentProgressProps) {
  const currentHcp = data.hcpTrend[data.hcpTrend.length - 1]?.value ?? 0;
  const previousHcp = data.hcpTrend[data.hcpTrend.length - 2]?.value ?? 0;
  const hcpChange = Number((currentHcp - previousHcp).toFixed(1));
  const isImproving = hcpChange < 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-grey-400" />
          <h2 className="text-sm font-semibold text-black">Elev-progresjon</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-grey-400">Snitt HCP:</span>
          <span className="text-sm font-semibold text-black tabular-nums">{currentHcp}</span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              isImproving ? "text-success" : "text-error"
            )}
          >
            {isImproving ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            {hcpChange > 0 ? "+" : ""}
            {hcpChange}
          </span>
        </div>
      </div>

      {/* HCP Trend Chart */}
      <div className="mb-6">
        <AdminLineChart data={data.hcpTrend} height={160} />
      </div>

      {/* Top 5 Improvements */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-grey-400 uppercase tracking-wide mb-3">
          Topp 5 forbedringer
        </h3>
        <div className="space-y-1">
          {data.topImprovements.map((student, index) => (
            <ImprovementItem key={student.id} student={student} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* Needs Follow-up */}
      {data.needsFollowUp.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-grey-400 uppercase tracking-wide mb-3">
            Trenger oppfølging
          </h3>
          <div className="space-y-2">
            {data.needsFollowUp.map((student) => (
              <FollowUpItem key={student.id} student={student} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function CompactStudentStats({
  totalStudents,
  averageHcp,
  activeThisWeek,
}: {
  totalStudents: number;
  averageHcp: number;
  activeThisWeek: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center p-3 rounded-lg bg-grey-50">
        <p className="text-2xl font-bold text-black tabular-nums">{totalStudents}</p>
        <p className="text-[10px] text-grey-400 uppercase tracking-wide">Totalt</p>
      </div>
      <div className="text-center p-3 rounded-lg bg-grey-50">
        <p className="text-2xl font-bold text-black tabular-nums">{averageHcp}</p>
        <p className="text-[10px] text-grey-400 uppercase tracking-wide">Snitt HCP</p>
      </div>
      <div className="text-center p-3 rounded-lg bg-grey-50">
        <p className="text-2xl font-bold text-black tabular-nums">{activeThisWeek}</p>
        <p className="text-[10px] text-grey-400 uppercase tracking-wide">Aktive denne uke</p>
      </div>
    </div>
  );
}
