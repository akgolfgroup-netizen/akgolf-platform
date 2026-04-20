"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import { useState } from "react";

interface AiInsightV2Props {
  insights: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    goalProgress: {
      target: string;
      current: number;
      target_value: number;
      unit: string;
    };
    patternAnalysis: string;
  };
}

export function AiInsightsV2({ insights }: AiInsightV2Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "recommendations">("overview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon name="psychology" className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-inverse-on-surface">AI-Analyse</h3>
        <span className="ml-auto text-xs text-inverse-on-surface/70 bg-inverse-surface px-2 py-1 rounded-full">
          Oppdatert i dag
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-inverse-surface/50 p-1 rounded-lg">
        {(["overview", "analysis", "recommendations"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeTab === tab
                ? "bg-inverse-surface/80 text-inverse-on-surface"
                : "text-inverse-on-surface/60 hover:text-inverse-on-surface"
            }`}
          >
            {tab === "overview" && "Oversikt"}
            {tab === "analysis" && "Analyse"}
            {tab === "recommendations" && "Anbefalinger"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[160px]">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-sm text-inverse-on-surface/50 leading-relaxed">{insights.summary}</p>
            
            {/* Goal Progress */}
            <div className="p-3 bg-inverse-surface/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-inverse-on-surface/60 flex items-center gap-1">
                  <Icon name="my_location" className="w-3 h-3" />
                  {insights.goalProgress.target}
                </span>
                <span className="text-xs font-medium text-emerald-400">
                  {insights.goalProgress.current} / {insights.goalProgress.target_value} {insights.goalProgress.unit}
                </span>
              </div>
              <div className="w-full bg-inverse-surface/80 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(insights.goalProgress.current / insights.goalProgress.target_value) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Strengths */}
            <div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mb-2">
                <Icon name="trending_up" className="w-3 h-3" />
                Dine styrker
              </p>
              <ul className="space-y-1">
                {insights.strengths.slice(0, 2).map((s, i) => (
                  <li key={i} className="text-sm text-inverse-on-surface/50 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <p className="text-xs text-amber-400 flex items-center gap-1 mb-2">
                <Icon name="error" className="w-3 h-3" />
                Utviklingsområder
              </p>
              <ul className="space-y-1">
                {insights.weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i} className="text-sm text-inverse-on-surface/50 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-inverse-on-surface/60 mt-3 italic">{insights.patternAnalysis}</p>
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-xs text-purple-400 flex items-center gap-1 mb-2">
              <Icon name="lightbulb" className="w-3 h-3" />
              Denne ukens fokus
            </p>
            <ul className="space-y-2">
              {insights.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="text-sm text-inverse-on-surface/50 p-2 bg-inverse-surface/30 rounded-lg flex items-start gap-2"
                >
                  <span className="bg-purple-500/20 text-purple-400 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
