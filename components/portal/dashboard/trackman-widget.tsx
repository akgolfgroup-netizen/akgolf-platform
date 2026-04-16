"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, Target } from "lucide-react";
import { Sparkline } from "@/components/portal/dashboard/sparkline";
import Link from "next/link";

interface TrackManData {
  lastSession: {
    date: string;
    club: string;
    metric: string;
    value: number;
    unit: string;
  } | null;
  trends: {
    clubSpeed: number[];
    ballSpeed: number[];
    carry: number[];
  };
  improvements: {
    metric: string;
    change: number;
    period: string;
  }[];
}

interface TrackManWidgetProps {
  data?: TrackManData;
}

export function TrackManWidget({ data }: TrackManWidgetProps) {
  const hasData = data?.lastSession != null;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100">TrackMan Data</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Ingen TrackMan-data ennå. Book en TrackMan-time for å se din swing-analyse.
        </p>
        <Link
          href="/portal/booking"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
        >
          <Target className="w-4 h-4" />
          Book TrackMan
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100">TrackMan</h3>
        </div>
        <Link
          href="/portal/trackman"
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Se alle data →
        </Link>
      </div>

      {/* Siste økt */}
      <div className="mb-4 p-3 bg-slate-800/50 rounded-xl">
        <p className="text-xs text-slate-400 mb-1">Siste økt • {data.lastSession?.date}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-100">
            {data.lastSession?.value}
          </span>
          <span className="text-sm text-slate-400">{data.lastSession?.unit}</span>
          <span className="text-xs text-slate-500">({data.lastSession?.club})</span>
        </div>
        <p className="text-xs text-emerald-400 mt-1">{data.lastSession?.metric}</p>
      </div>

      {/* Trend-grafer */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Club Speed</p>
          <Sparkline
            data={data.trends.clubSpeed}
            width={80}
            height={30}
            color="#10B981"
          />
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Ball Speed</p>
          <Sparkline
            data={data.trends.ballSpeed}
            width={80}
            height={30}
            color="#3B82F6"
          />
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Carry</p>
          <Sparkline
            data={data.trends.carry}
            width={80}
            height={30}
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Forbedringer */}
      {data.improvements.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Fremgang
          </p>
          {data.improvements.slice(0, 2).map((imp, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{imp.metric}</span>
              <span className="text-emerald-400 font-medium">+{imp.change}%</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
