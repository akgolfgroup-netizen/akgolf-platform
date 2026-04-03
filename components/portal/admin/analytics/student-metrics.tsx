"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  Trophy,
  AlertTriangle,
  Users,
  UserMinus,
} from "lucide-react";
import type { AnalyticsData } from "@/app/portal/(dashboard)/admin/analytics/actions";

interface StudentMetricsProps {
  data: AnalyticsData;
}

export function StudentMetrics({ data }: StudentMetricsProps) {
  const noShowRate =
    data.totalBookings > 0
      ? (data.noShowCount / data.totalBookings) * 100
      : 0;
  const isHighNoShow = noShowRate > 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Improvers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              Storst HCP-forbedring
            </h3>
            <p className="text-xs text-[var(--color-grey-500)]">
              Gjennomsnitt: {data.avgHcpImprovement.toFixed(1)} slag
            </p>
          </div>
        </div>

        {data.topImprovers.length > 0 ? (
          <div className="space-y-3">
            {data.topImprovers.map((player, index) => (
              <div
                key={player.name}
                className="flex items-center justify-between py-2 border-b border-[var(--color-grey-100)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-[var(--color-grey-900)] text-white"
                        : index === 1
                          ? "bg-[var(--color-grey-200)] text-[var(--color-grey-700)]"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-grey-900)]">
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    -{player.hcpChange.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-grey-500)] text-center py-6">
            Ingen handicap-data i perioden
          </p>
        )}
      </motion.div>

      {/* Student Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              Elevstatus
            </h3>
            <p className="text-xs text-[var(--color-grey-500)]">
              Aktivitet og frafall
            </p>
          </div>
        </div>

        {/* Aktive vs Churnet bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[var(--color-grey-500)] mb-2">
            <span>Aktive ({data.activeStudents})</span>
            <span>Churnet ({data.churnedStudents})</span>
          </div>
          <div className="h-3 bg-[var(--color-grey-100)] rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 transition-[width] duration-500"
              style={{
                width: `${
                  data.activeStudents + data.churnedStudents > 0
                    ? (data.activeStudents /
                        (data.activeStudents + data.churnedStudents)) *
                      100
                    : 100
                }%`,
              }}
            />
            <div
              className="bg-red-400 transition-[width] duration-500"
              style={{
                width: `${
                  data.activeStudents + data.churnedStudents > 0
                    ? (data.churnedStudents /
                        (data.activeStudents + data.churnedStudents)) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* No-show warning */}
        {isHighNoShow && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Hoy no-show rate: {noShowRate.toFixed(1)}%
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Vurder a sende paminnelser eller justere avbestillingsregler
              </p>
            </div>
          </div>
        )}

        {!isHighNoShow && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-bold text-green-700">
                {noShowRate.toFixed(0)}%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                No-show rate under kontroll
              </p>
              <p className="text-xs text-green-600">
                {data.noShowCount} av {data.totalBookings} bookinger
              </p>
            </div>
          </div>
        )}

        {/* Churn warning if significant */}
        {data.churnedStudents > 0 && data.churnedStudents >= data.activeStudents * 0.2 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 mt-3">
            <UserMinus className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {data.churnedStudents} inaktive elever
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Vurder a sende win-back kampanje
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
