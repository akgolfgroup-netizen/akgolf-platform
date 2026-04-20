"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

import { MonoLabel, BentoGrid, BentoCard } from "@/components/portal/patterns";

// ── Design tokens as hex (for Recharts) ──────────────────
const COLORS = {
  outlineVariant: "#D5DFDB",
  onSurfaceVariant: "#7A8C85",
  onSurface: "#0A1F18",
  ai: "#AF52DE",
  info: "#007AFF",
  success: "#1A4D36",
};

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function MentalPage() {
  const [activeTab, setActiveTab] = useState<string>("runder");
  const [trendData, setTrendData] = useState<{ date: string; focus: number; confidence: number; commitment: number; acceptance: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const trendsRes = await fetch("/api/portal/ai/mental/trends");

        // We don't have a list-all-rounds endpoint, so we can't fetch rounds directly.
        // For now, show empty rounds tab and real trends.
        if (trendsRes.ok) {
          const trends = await trendsRes.json();
          const focus = trends.focus ?? [];
          const confidence = trends.confidence ?? [];
          const commitment = trends.commitment ?? [];
          const acceptance = trends.acceptance ?? [];

          const dates = Array.from(new Set([
            ...focus.map((d: { date: string }) => d.date.slice(0, 10)),
            ...confidence.map((d: { date: string }) => d.date.slice(0, 10)),
          ])).sort();

          const data = dates.map((date) => {
            const f = focus.find((d: { date: string; value: number }) => d.date.slice(0, 10) === date);
            const c = confidence.find((d: { date: string; value: number }) => d.date.slice(0, 10) === date);
            const com = commitment.find((d: { date: string; value: number }) => d.date.slice(0, 10) === date);
            const a = acceptance.find((d: { date: string; value: number }) => d.date.slice(0, 10) === date);
            return {
              date: new Date(date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" }),
              focus: f?.value ?? 0,
              confidence: c?.value ?? 0,
              commitment: com ? Math.round(com.value * 10) : 0,
              acceptance: a ? Math.round(a.value * 10) : 0,
            };
          });

          setTrendData(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          <MonoLabel size="xs" uppercase className="mb-2 block text-on-surface-variant">
            Mental trening
          </MonoLabel>
          <h1 className="text-2xl font-bold text-on-surface">Mental scorecard</h1>
          <p className="text-on-surface-variant mt-1">Spor fokus, selvtillit og rutiner</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/portal/mental/ny">
            <Icon name="add" className="w-4 h-4 mr-2" />
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
        {activeTab === "runder" ? (
          <EmptyRoundsTab />
        ) : (
          <TrendsTab data={trendData} loading={loading} />
        )}
      </motion.div>
    </div>
  );
}

function EmptyRoundsTab() {
  return (
    <PremiumCard padding="lg" radius="large">
      <div className="text-center py-8">
        <Icon name="psychology" className="w-10 h-10 text-on-surface-variant mx-auto mb-4" />
        <p className="text-sm text-on-surface-variant">Ingen runder registrert ennå.</p>
        <p className="text-xs text-on-surface-variant/60 mt-1">Start din første mental scorecard-runde.</p>
      </div>
    </PremiumCard>
  );
}

function TrendsTab({ data, loading }: { data: { date: string; focus: number; confidence: number; commitment: number; acceptance: number }[]; loading: boolean }) {
  const avg = (arr: number[]) => (arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "0");

  return (
    <div className="space-y-6">
      <PremiumCard padding="md" radius="large">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="trending_up" className="w-5 h-5 text-on-surface" />
          <h3 className="text-sm font-semibold text-on-surface">Mentale metrics over tid</h3>
        </div>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant">Laster...</div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant">Ingen data ennå</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.outlineVariant} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: `1px solid ${COLORS.outlineVariant}` }}
                  labelStyle={{ color: COLORS.onSurface, fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Line type="monotone" dataKey="focus" name="Fokus" stroke={COLORS.ai} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="confidence" name="Selvtillit" stroke={COLORS.info} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="commitment" name="Engasjement" stroke={COLORS.onSurface} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="acceptance" name="Aksept" stroke={COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </PremiumCard>

      <BentoGrid cols={4} gap="md">
        <BentoCard variant="light" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Icon name="psychology" className="w-4 h-4 text-ai" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Fokus snitt</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">{avg(data.map((d) => d.focus))}</p>
            </div>
          </div>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Icon name="my_location" className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Selvtillit snitt</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">{avg(data.map((d) => d.confidence))}</p>
            </div>
          </div>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Icon name="calendar_today" className="w-4 h-4 text-on-surface" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Engasjement snitt</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">{avg(data.map((d) => d.commitment))}</p>
            </div>
          </div>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Icon name="flag" className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Aksept snitt</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">{avg(data.map((d) => d.acceptance))}</p>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
