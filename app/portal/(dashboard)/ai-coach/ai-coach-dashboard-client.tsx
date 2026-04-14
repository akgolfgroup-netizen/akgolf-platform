"use client";

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

// Mock KPI data
const KPI_DATA = {
  driverSpeed: { value: 112.4, trend: +2.1, unit: "mph" },
  consistency: { value: 78, trend: +4, unit: "poeng" },
  mentalTrend: { value: 7.2, trend: -0.3, unit: "snitt" },
  decadeScore: { value: 82, trend: +5, unit: "poeng" },
};

export function AiCoachDashboardClient({ quickInsight }: AiCoachDashboardClientProps) {
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
          <h1 className="text-2xl font-bold text-[#0A1F18]">AI Coach</h1>
          <p className="text-[#7A8C85] mt-1">Din personlige golf-assistent</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/portal/ai-coach/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1F18] text-white text-sm font-medium hover:opacity-90 transition-opacity"
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
              <Sparkles className="w-5 h-5 text-[#0A1F18] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#0A1F18]">Dagens innsikt</p>
                <p className="text-sm text-[#324D45] mt-0.5">{quickInsight}</p>
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
          icon={<Activity className="w-5 h-5 text-[#0A1F18]" />}
          delay={0.1}
        />
        <KpiCard
          label="Konsistensscore"
          value={KPI_DATA.consistency.value}
          unit={KPI_DATA.consistency.unit}
          trend={KPI_DATA.consistency.trend}
          icon={<Target className="w-5 h-5 text-[#007AFF]" />}
          delay={0.15}
        />
        <KpiCard
          label="Mental trend (7 d)"
          value={KPI_DATA.mentalTrend.value}
          unit={KPI_DATA.mentalTrend.unit}
          trend={KPI_DATA.mentalTrend.trend}
          icon={<Brain className="w-5 h-5 text-[#AF52DE]" />}
          delay={0.2}
        />
        <KpiCard
          label="DECADE score"
          value={KPI_DATA.decadeScore.value}
          unit={KPI_DATA.decadeScore.unit}
          trend={KPI_DATA.decadeScore.trend}
          icon={<TrendingUp className="w-5 h-5 text-[#1A4D36]" />}
          delay={0.25}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE_APPLE }}
      >
        <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">Hurtighandlinger</h3>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#0A1F18] mt-1 tabular-nums">
            {typeof value === "number" && value % 1 !== 0
              ? value.toFixed(1)
              : value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#1A4D36]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#B84233]" />
            )}
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-[#1A4D36]" : "text-[#B84233]"
              }`}
            >
              {isPositive ? "+" : ""}
              {trend} {unit}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
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
      className="flex items-center gap-3 rounded-xl bg-white border border-[#D5DFDB] p-4 text-sm font-medium text-[#0A1F18] hover:border-[#A5B2AD] hover:shadow-[0_4px_12px_rgba(10,31,24,0.04)] transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-semibold text-sm text-[#0A1F18]">{title}</p>
        <p className="text-xs text-[#7A8C85] mt-0.5">{subtitle}</p>
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
        <h4 className="text-sm font-semibold text-[#0A1F18]">{title}</h4>
        <p className="text-sm text-[#7A8C85] mt-1 flex-1">{description}</p>
        <div className="mt-4">
          <Button variant="secondary" size="sm" asChild>
            <Link href={href}>Åpne</Link>
          </Button>
        </div>
      </div>
    </PremiumCard>
  );
}
