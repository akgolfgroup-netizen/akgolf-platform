"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Activity,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock data
const mockSessions = [
  { id: "1", date: "2024-06-15", club: "Driver", shots: 45, avgCarry: 245 },
  { id: "2", date: "2024-06-12", club: "7-jern", shots: 30, avgCarry: 165 },
  { id: "3", date: "2024-06-08", club: "Driver", shots: 50, avgCarry: 242 },
  { id: "4", date: "2024-06-05", club: "Wedge", shots: 25, avgCarry: 95 },
];

const mockClubData = [
  { club: "Driver", avgSpeed: 98.5, avgBallSpeed: 145.2, avgSpin: 2200, avgLaunch: 12.5, avgCarry: 245 },
  { club: "3-wood", avgSpeed: 92.1, avgBallSpeed: 135.8, avgSpin: 2800, avgLaunch: 11.2, avgCarry: 220 },
  { club: "5-jern", avgSpeed: 85.4, avgBallSpeed: 122.5, avgSpin: 4200, avgLaunch: 14.8, avgCarry: 185 },
  { club: "7-jern", avgSpeed: 80.2, avgBallSpeed: 112.8, avgSpin: 5200, avgLaunch: 16.5, avgCarry: 165 },
  { club: "PW", avgSpeed: 72.5, avgBallSpeed: 98.4, avgSpin: 6800, avgLaunch: 20.2, avgCarry: 125 },
];

const carryTrend = [
  { date: "2024-01", value: 235 },
  { date: "2024-02", value: 238 },
  { date: "2024-03", value: 240 },
  { date: "2024-04", value: 242 },
  { date: "2024-05", value: 244 },
  { date: "2024-06", value: 245 },
];

export default function TrackManPage() {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">TrackMan Data</h1>
          <p className="text-[#6b7366] mt-1">Spredning, teknikk-profil og klubb-analyse</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors">
          <Upload className="w-4 h-4" />
          Last opp data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Sesjoner</p>
              <p className="text-3xl font-bold text-[#1c1c16] mt-1">12</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#154212]/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#154212]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Slag totalt</p>
              <p className="text-3xl font-bold text-[#1c1c16] mt-1">1,245</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#3b82f6]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Beste carry</p>
              <p className="text-3xl font-bold text-[#1c1c16] mt-1">268m</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#f59e0b]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Snitt carry</p>
              <p className="text-3xl font-bold text-[#1c1c16] mt-1">245m</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#22c55e]" />
            </div>
          </div>
        </div>
      </div>

      {/* Carry Trend */}
      <ProgressChart data={carryTrend} title="Driver carry-trend" color="#154212" height={200} />

      {/* Club Data Table */}
      <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
        <div className="p-4 border-b border-[#c2c9bb]/30">
          <h3 className="font-semibold text-[#1c1c16]">Klubb-statistikk</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f3ea]">
              <tr>
                <th className="text-left text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Klubb</th>
                <th className="text-right text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Klubb-fart</th>
                <th className="text-right text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Ball-fart</th>
                <th className="text-right text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Spin</th>
                <th className="text-right text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Launch</th>
                <th className="text-right text-xs font-semibold text-[#6b7366] uppercase tracking-wider p-4">Carry</th>
              </tr>
            </thead>
            <tbody>
              {mockClubData.map((club, index) => (
                <tr key={club.club} className="border-t border-[#c2c9bb]/30 hover:bg-[#f7f3ea]/50">
                  <td className="p-4 font-medium text-[#1c1c16]">{club.club}</td>
                  <td className="p-4 text-right text-[#42493e]">{club.avgSpeed} mph</td>
                  <td className="p-4 text-right text-[#42493e]">{club.avgBallSpeed} mph</td>
                  <td className="p-4 text-right text-[#42493e]">{club.avgSpin} rpm</td>
                  <td className="p-4 text-right text-[#42493e]">{club.avgLaunch}°</td>
                  <td className="p-4 text-right font-semibold text-[#154212]">{club.avgCarry}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1c1c16]">Siste sesjoner</h3>
          <button className="text-sm text-[#154212] hover:underline">Se alle</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#c2c9bb]/50 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#154212]">{session.club}</span>
                <Calendar className="w-4 h-4 text-[#8a9385]" />
              </div>
              <p className="text-xs text-[#8a9385]">{session.date}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c2c9bb]/30">
                <span className="text-xs text-[#6b7366]">{session.shots} slag</span>
                <span className="text-sm font-bold text-[#1c1c16]">{session.avgCarry}m</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#1c1c16] mb-4">Handlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction href="#" icon={Upload} label="Last opp CSV" description="Importer fra TrackMan" />
          <QuickAction href="#" icon={FileSpreadsheet} label="Eksporter data" description="Last ned rapport" />
          <QuickAction href="/portal/analyse" icon={TrendingUp} label="Se analyse" description="Dyp innsikt" />
        </div>
      </div>
    </div>
  );
}
