"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Trophy,
  Target,
  Edit2,
  Check,
  Crown,
  Award,
  TrendingDown,
  Camera,
} from "lucide-react";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock data - replace with actual API calls
const mockHandicapHistory = [
  { date: "2024-01", value: 18.5 },
  { date: "2024-02", value: 17.8 },
  { date: "2024-03", value: 17.2 },
  { date: "2024-04", value: 16.5 },
  { date: "2024-05", value: 15.9 },
  { date: "2024-06", value: 15.2 },
];

const mockGoals = [
  { id: "1", title: "Nå handicap 15", category: "SCORE", progress: 60, target: 15, current: 15.2 },
  { id: "2", title: "Trene 3x per uke", category: "PROCESS", progress: 80, target: 12, current: 10 },
  { id: "3", title: "Spille 5 turneringer", category: "TOURNAMENT", progress: 40, target: 5, current: 2 },
];

const mockAchievements = [
  { id: "1", title: "Første runde", icon: "🎯", unlocked: true },
  { id: "2", title: "7-dagers streak", icon: "🔥", unlocked: true },
  { id: "3", title: "Handicap 20", icon: "📉", unlocked: true },
  { id: "4", title: "Birdie", icon: "🐦", unlocked: false },
  { id: "5", title: "Eagle", icon: "🦅", unlocked: false },
];

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Anders Kristiansen");
  const [handicap, setHandicap] = useState(15.2);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#154212] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Min profil</h1>
        <p className="text-[#6b7366] mt-1">Administrer din profil, mål og prestasjoner</p>
      </div>

      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30 overflow-hidden">
              <User className="w-12 h-12 text-white/60" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[#d2f000] flex items-center justify-center text-[#1c1c16] hover:bg-[#b8d600] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d2f000]/50"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg bg-[#d2f000] text-[#1c1c16]"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-bold">{name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-white/60" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <span className="px-2 py-0.5 rounded-full bg-[#d2f000] text-[#1c1c16] text-xs font-semibold">
                Elite
              </span>
              <span className="text-white/60 text-sm">Medlem siden 2024</span>
            </div>
          </div>

          {/* Handicap */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-center min-w-[120px]">
            <p className="text-xs text-white/60 uppercase tracking-wider">Handicap</p>
            <p className="text-4xl font-bold text-[#d2f000]">{handicap.toFixed(1)}</p>
            <p className="text-xs text-white/60 mt-1">Nivå: 3</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Runder</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Coaching</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Turneringer</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Beste score</p>
              <p className="text-2xl font-bold text-[#1c1c16] mt-1">78</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#f59e0b]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Snitt putts</p>
              <p className="text-2xl font-bold text-[#1c1c16] mt-1">32.5</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#3b82f6]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">Fairway %</p>
              <p className="text-2xl font-bold text-[#1c1c16] mt-1">58%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#22c55e]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">GIR %</p>
              <p className="text-2xl font-bold text-[#1c1c16] mt-1">42%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#8b5cf6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handicap Chart */}
        <ProgressChart
          data={mockHandicapHistory}
          title="Handicap-utvikling"
          color="#154212"
          height={200}
        />

        {/* Goals */}
        <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1c1c16]">Mine mål</h3>
            <button className="text-xs font-medium text-[#154212] hover:underline">+ Nytt mål</button>
          </div>
          <div className="space-y-4">
            {mockGoals.map((goal) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#1c1c16]">{goal.title}</span>
                  <span className="text-xs text-[#8a9385]">{goal.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f7f3ea] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#154212] transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
        <h3 className="font-semibold text-[#1c1c16] mb-4">Prestasjoner</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
          {mockAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`text-center ${!achievement.unlocked ? "opacity-40" : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 ${
                  achievement.unlocked ? "bg-[#d2f000]/30" : "bg-[#f7f3ea]"
                }`}
              >
                {achievement.icon}
              </div>
              <p className="text-[10px] text-[#6b7366] leading-tight">{achievement.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#1c1c16] mb-4">Innstillinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction href="/portal/profil/innstillinger" icon={User} label="Kontoinnstillinger" />
          <QuickAction href="/portal/profil/abonnement" icon={Crown} label="Abonnement" />
          <QuickAction href="/portal/profil/personvern" icon={Award} label="Personvern" />
        </div>
      </div>
    </div>
  );
}
