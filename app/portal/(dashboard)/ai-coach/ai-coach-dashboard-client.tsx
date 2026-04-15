"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Brain,
  Calendar,
  Gamepad2,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Sparkles,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ChatContext } from "./actions";

interface AiCoachDashboardClientProps {
  context: ChatContext;
  quickInsight: string;
}

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface MetricsData {
  driverSpeed: { value: number; trend: number; unit: string };
  consistency: { value: number; trend: number; unit: string };
  mentalTrend: { value: number; trend: number; unit: string };
  decadeScore: { value: number; trend: number; unit: string };
}

export function AiCoachDashboardClient({ quickInsight }: AiCoachDashboardClientProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [metricsRes, mentalRes] = await Promise.all([
          fetch("/api/portal/ai/metrics"),
          fetch("/api/portal/ai/mental/trends"),
        ]);

        const metricsJson = await metricsRes.json();
        const mentalJson = await mentalRes.json();

        const m = metricsJson.metrics;
        const focusData = mentalJson.focus ?? [];
        const lastFocus = focusData.length > 0
          ? focusData.slice(-7).reduce((a: number, e: { value: number }) => a + e.value, 0) /
            Math.min(focusData.length, 7)
          : 0;

        setMetrics({
          driverSpeed: {
            value: m?.last10DriverSpeed ? Math.round(m.last10DriverSpeed * 10) / 10 : 0,
            trend: m?.speedGapToPotential ? -Math.round(m.speedGapToPotential * 10) / 10 : 0,
            unit: "mph",
          },
          consistency: {
            value: m?.consistencyScore ?? 0,
            trend: 0,
            unit: "poeng",
          },
          mentalTrend: {
            value: Math.round(lastFocus * 10) / 10,
            trend: 0,
            unit: "snitt",
          },
          decadeScore: {
            value: m?.consistencyScore ? Math.min(100, Math.round(m.consistencyScore * 0.8 + 20)) : 0,
            trend: 0,
            unit: "poeng",
          },
        });
      } catch {
        // fallback to empty metrics
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const KPI_DATA = metrics ?? {
    driverSpeed: { value: 0, trend: 0, unit: "mph" },
    consistency: { value: 0, trend: 0, unit: "poeng" },
    mentalTrend: { value: 0, trend: 0, unit: "snitt" },
    decadeScore: { value: 0, trend: 0, unit: "poeng" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-black">AI Coach</h1>
          <p className="text-grey-400 mt-1">Din personlige golf-assistent</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/portal/ai-coach/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Chat med AI Coach
          </Link>
        </div>
      </motion.div>

      {/* Quick insight banner */}
      {quickInsight && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE_APPLE }}
        >
          <PremiumCard variant="accent" padding="md" radius="large">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-black">Dagens innsikt</p>
                <p className="text-sm text-grey-400 mt-0.5">{quickInsight}</p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Siste driver speed"
          value={KPI_DATA.driverSpeed.value}
          unit={KPI_DATA.driverSpeed.unit}
          trend={KPI_DATA.driverSpeed.trend}
          icon={<Activity className="w-5 h-5 text-black" />}
          delay={0.1}
        />
        <KpiCard
          label="Konsistensscore"
          value={KPI_DATA.consistency.value}
          unit={KPI_DATA.consistency.unit}
          trend={KPI_DATA.consistency.trend}
          icon={<Target className="w-5 h-5 text-blue-500" />}
          delay={0.15}
        />
        <KpiCard
          label="Mental trend (7 d)"
          value={KPI_DATA.mentalTrend.value}
          unit={KPI_DATA.mentalTrend.unit}
          trend={KPI_DATA.mentalTrend.trend}
          icon={<Brain className="w-5 h-5 text-purple-500" />}
          delay={0.2}
        />
        <KpiCard
          label="DECADE score"
          value={KPI_DATA.decadeScore.value}
          unit={KPI_DATA.decadeScore.unit}
          trend={KPI_DATA.decadeScore.trend}
          icon={<TrendingUp className="w-5 h-5 text-success" />}
          delay={0.25}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE_APPLE }}
      >
        <h3 className="text-sm font-semibold text-black mb-4">Hurtighandlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionButton
            href="/portal/trackman"
            icon={<Upload className="w-4 h-4" />}
            title="Last opp TrackMan CSV"
            subtitle="Importer ny sesjon"
          />
          <QuickActionButton
            href="/portal/mental"
            icon={<Brain className="w-4 h-4" />}
            title="Ny mental scorecard"
            subtitle="Logg runde-mentalitet"
          />
          <QuickActionButton
            href="/portal/treningsplan"
            icon={<Calendar className="w-4 h-4" />}
            title="Se treningsplan"
            subtitle="Ukeplan og økter"
          />
          <QuickActionButton
            href="/portal/spill"
            icon={<Gamepad2 className="w-4 h-4" />}
            title="Spill-modul"
            subtitle="Nærspill, putting, press"
          />
        </div>
      </motion.div>

      {/* Secondary modules preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ModulePreviewCard
          title="TrackMan"
          description="Siste sesjon: Driver, 24 slag, 112.4 mph snitt"
          href="/portal/trackman"
          delay={0.35}
        />
        <ModulePreviewCard
          title="Mental scorecard"
          description="Siste runde: 7.2/10 fokus, 8.5/10 selvtillit"
          href="/portal/mental"
          delay={0.4}
        />
        <ModulePreviewCard
          title="DECADE Strategi"
          description="Neste bane: Losby GK — gjennomgå hull-for-hull"
          href="/portal/strategi"
          delay={0.45}
        />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  unit,
  trend,
  icon,
  delay = 0,
}: {
  label: string;
  value: number;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  delay?: number;
}) {
  const isPositive = trend >= 0;
  return (
    <PremiumCard delay={delay} padding="md" radius="large" hover="lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-grey-400">
            {label}
          </p>
          <p className="text-3xl font-bold text-black mt-1 tabular-nums">
            {typeof value === "number" && value % 1 !== 0
              ? value.toFixed(1)
              : value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-error" />
            )}
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-success" : "text-error"
              }`}
            >
              {isPositive ? "+" : ""}
              {trend} {unit}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-grey-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </PremiumCard>
  );
}

function QuickActionButton({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-white border border-grey-200 p-4 text-sm font-medium text-black hover:border-grey-300 hover:shadow-[0_4px_12px_rgba(10,31,24,0.04)] transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-grey-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-semibold text-sm text-black">{title}</p>
        <p className="text-xs text-grey-400 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}

function ModulePreviewCard({
  title,
  description,
  href,
  delay = 0,
}: {
  title: string;
  description: string;
  href: string;
  delay?: number;
}) {
  return (
    <PremiumCard delay={delay} padding="md" radius="large" hover="lift">
      <div className="flex flex-col h-full">
        <h4 className="text-sm font-semibold text-black">{title}</h4>
        <p className="text-sm text-grey-400 mt-1 flex-1">{description}</p>
        <div className="mt-4">
          <Button variant="secondary" size="sm" asChild>
            <Link href={href}>Åpne</Link>
          </Button>
        </div>
      </div>
    </PremiumCard>
  );
}
