"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Calendar, Target, Brain, Flag } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// Mock data
const ROUNDS = [
  {
    id: "r1",
    date: "2026-04-12",
    course: "Losby GK",
    score: 78,
    mentalScore: 8.2,
    focus: 8,
    confidence: 9,
    commitment: 7,
    acceptance: 9,
  },
  {
    id: "r2",
    date: "2026-04-05",
    course: "Miklagard GK",
    score: 82,
    mentalScore: 6.8,
    focus: 6,
    confidence: 7,
    commitment: 7,
    acceptance: 7,
  },
  {
    id: "r3",
    date: "2026-03-29",
    course: "Oslo GK",
    mentalScore: 7.5,
    score: 80,
    focus: 7,
    confidence: 8,
    commitment: 8,
    acceptance: 7,
  },
  {
    id: "r4",
    date: "2026-03-22",
    course: "Losby GK",
    mentalScore: 8.0,
    score: 77,
    focus: 8,
    confidence: 8,
    commitment: 8,
    acceptance: 8,
  },
];

const TREND_DATA = [
  { date: "22. mar", focus: 8, confidence: 8, commitment: 8, acceptance: 8 },
  { date: "29. mar", focus: 7, confidence: 8, commitment: 8, acceptance: 7 },
  { date: "05. apr", focus: 6, confidence: 7, commitment: 7, acceptance: 7 },
  { date: "12. apr", focus: 8, confidence: 9, commitment: 7, acceptance: 9 },
];

export default function MentalPage() {
  const [activeTab, setActiveTab] = useState<string>("runder");

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">Mental scorecard</h1>
          <p className="text-[#7A8C85] mt-1">Spor fokus, selvtillit og rutiner</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/portal/mental/ny">
            <Plus className="w-4 h-4 mr-2" />
            Ny runde
          </Link>
        </Button>
      </motion.div>

      {/* Tabs */}
      <Tabs
        items={[
          { id: "runder", label: "Runder" },
          { id: "trends", label: "Trends" },
        ]}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_APPLE }}
      >
        {activeTab === "runder" ? <RoundsTab /> : <TrendsTab />}
      </motion.div>
    </div>
  );
}

function RoundsTab() {
  return (
    <div className="space-y-4">
      {ROUNDS.map((round, idx) => (
        <PremiumCard key={round.id} delay={idx * 0.05} padding="md" radius="large" hover="lift">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5FF] flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-[#AF52DE]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#0A1F18]">{round.course}</h3>
                  <span className="text-xs text-[#7A8C85]">
                    {new Date(round.date).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-[#324D45]">
                    Score: <span className="font-semibold text-[#0A1F18]">{round.score}</span>
                  </span>
                  <span className="text-sm text-[#324D45]">
                    Mental: {" "}
                    <span className="font-semibold text-[#0A1F18]">{round.mentalScore}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/portal/mental/${round.id}`}>Åpne</Link>
              </Button>
            </div>
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}

function TrendsTab() {
  return (
    <div className="space-y-6">
      <PremiumCard padding="md" radius="large">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#0A1F18]" />
          <h3 className="text-sm font-semibold text-[#0A1F18]">Mentale metrics over tid</h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECF0EF" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #D5DFDB" }}
                labelStyle={{ color: "#0A1F18", fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ paddingTop: 8 }} />
              <Line type="monotone" dataKey="focus" name="Fokus" stroke="#AF52DE" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="confidence" name="Selvtillit" stroke="#007AFF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="commitment" name="Engasjement" stroke="#0A1F18" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="acceptance" name="Aksept" stroke="#1A4D36" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat icon={<Brain className="w-4 h-4 text-[#AF52DE]" />} label="Fokus snitt" value="7.3" />
        <MiniStat icon={<Target className="w-4 h-4 text-[#007AFF]" />} label="Selvtillit snitt" value="8.0" />
        <MiniStat icon={<Calendar className="w-4 h-4 text-[#0A1F18]" />} label="Engasjement snitt" value="7.5" />
        <MiniStat icon={<Flag className="w-4 h-4 text-[#1A4D36]" />} label="Aksept snitt" value="7.8" />
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <PremiumCard padding="md" radius="large" hover="lift">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#F5F8F7] flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-xs text-[#7A8C85]">{label}</p>
          <p className="text-lg font-bold text-[#0A1F18] tabular-nums">{value}</p>
        </div>
      </div>
    </PremiumCard>
  );
}
