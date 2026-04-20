"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { HcpForecastData } from "@/app/portal/(dashboard)/statistikk/actions";

interface HcpForecastChartProps {
  data: HcpForecastData;
}

export function HcpForecastChart({ data }: HcpForecastChartProps) {
  const hasForecast = data.predicted30d != null && data.predicted90d != null;
  const hasHistory = data.history.length >= 2;

  const chart = useMemo(() => {
    if (!hasHistory || !hasForecast || !data.currentHcp) return null;

    const W = 800;
    const H = 220;
    const PAD_X = 32;
    const PAD_TOP = 20;
    const PAD_BOTTOM = 28;

    const now = new Date(data.history[data.history.length - 1].date).getTime();
    const day = 24 * 60 * 60 * 1000;
    const minT = new Date(data.history[0].date).getTime();
    const maxT = now + 90 * day;
    const tRange = maxT - minT;

    const allValues: number[] = [
      ...data.history.map((p) => p.hcp),
      data.predicted30d ?? data.currentHcp,
      data.predicted90d ?? data.currentHcp,
    ];
    if (data.ci30d) {
      allValues.push(data.ci30d.lower, data.ci30d.upper);
    }
    if (data.ci90d) {
      allValues.push(data.ci90d.lower, data.ci90d.upper);
    }
    const minY = Math.min(...allValues);
    const maxY = Math.max(...allValues);
    const yPad = (maxY - minY) * 0.15 || 1;
    const yMin = minY - yPad;
    const yMax = maxY + yPad;
    const yRange = yMax - yMin;

    const xScale = (t: number) => PAD_X + ((t - minT) / tRange) * (W - 2 * PAD_X);
    // Invert: higher hcp = lower on chart? No — lower hcp = better, so put lower hcp higher visually
    const yScale = (v: number) => PAD_TOP + ((v - yMin) / yRange) * (H - PAD_TOP - PAD_BOTTOM);

    const historyPoints = data.history.map((p) => ({
      x: xScale(new Date(p.date).getTime()),
      y: yScale(p.hcp),
    }));

    let historyPath = `M${historyPoints[0].x},${historyPoints[0].y}`;
    for (let i = 1; i < historyPoints.length; i++) {
      const prev = historyPoints[i - 1];
      const curr = historyPoints[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      historyPath += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }

    const nowX = xScale(now);
    const nowY = yScale(data.currentHcp);

    const p30 = {
      x: xScale(now + 30 * day),
      y: yScale(data.predicted30d as number),
    };
    const p90 = {
      x: xScale(now + 90 * day),
      y: yScale(data.predicted90d as number),
    };

    const forecastPath = `M${nowX},${nowY} Q${(nowX + p30.x) / 2},${(nowY + p30.y) / 2} ${p30.x},${p30.y} T${p90.x},${p90.y}`;

    const ciPath = data.ci30d && data.ci90d
      ? `M${nowX},${nowY} L${p30.x},${yScale(data.ci30d.upper)} L${p90.x},${yScale(data.ci90d.upper)} L${p90.x},${yScale(data.ci90d.lower)} L${p30.x},${yScale(data.ci30d.lower)} L${nowX},${nowY} Z`
      : null;

    return {
      W,
      H,
      PAD_X,
      PAD_BOTTOM,
      historyPath,
      forecastPath,
      ciPath,
      nowX,
      nowY,
      p30,
      p90,
      yScale,
      xScale,
      lastHistoryPoint: historyPoints[historyPoints.length - 1],
      firstHistoryDate: new Date(data.history[0].date),
    };
  }, [data, hasHistory, hasForecast]);

  if (!hasHistory) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl bg-surface text-sm text-on-surface-variant">
        Vi trenger flere HCP-snapshots for å vise trend og prognose.
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl bg-surface text-sm text-on-surface-variant">
        Ikke nok data til å lage prognose ennå.
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${chart.W} ${chart.H}`} preserveAspectRatio="none" className="h-[220px] w-full">
      <defs>
        <linearGradient id="hcpHistoryGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#005840" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#005840" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hcpForecastStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#005840" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D1F843" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={chart.PAD_X}
          y1={20 + pct * (chart.H - 20 - chart.PAD_BOTTOM)}
          x2={chart.W - chart.PAD_X}
          y2={20 + pct * (chart.H - 20 - chart.PAD_BOTTOM)}
          stroke="#000"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      ))}

      {/* Today divider */}
      <line
        x1={chart.nowX}
        y1={20}
        x2={chart.nowX}
        y2={chart.H - chart.PAD_BOTTOM}
        stroke="#A5B2AD"
        strokeDasharray="3 4"
        strokeWidth="1"
      />
      <text
        x={chart.nowX}
        y={16}
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#7A8C85"
      >
        I dag
      </text>

      {/* CI band */}
      {chart.ciPath && (
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          d={chart.ciPath}
          fill="#D1F843"
          fillOpacity="0.12"
          stroke="none"
        />
      )}

      {/* History area */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        d={`${chart.historyPath} L${chart.nowX},${chart.H - chart.PAD_BOTTOM} L${chart.PAD_X},${chart.H - chart.PAD_BOTTOM} Z`}
        fill="url(#hcpHistoryGrad)"
        stroke="none"
      />

      {/* History line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        d={chart.historyPath}
        fill="none"
        stroke="#005840"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Forecast line (dashed) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
        d={chart.forecastPath}
        fill="none"
        stroke="url(#hcpForecastStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />

      {/* Now point */}
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        cx={chart.nowX}
        cy={chart.nowY}
        r={5}
        fill="#005840"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {/* 30d point */}
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
        cx={chart.p30.x}
        cy={chart.p30.y}
        r={4}
        fill="#FFFFFF"
        stroke="#005840"
        strokeWidth="2"
      />
      <text
        x={chart.p30.x}
        y={chart.p30.y - 10}
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#324D45"
      >
        30d: {data.predicted30d?.toFixed(1)}
      </text>

      {/* 90d point */}
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1.7, ease: [0.34, 1.56, 0.64, 1] }}
        cx={chart.p90.x}
        cy={chart.p90.y}
        r={5}
        fill="#D1F843"
        stroke="#005840"
        strokeWidth="2"
      />
      <text
        x={chart.p90.x}
        y={chart.p90.y - 10}
        textAnchor="end"
        fontSize="10"
        fontWeight="700"
        fill="#0A1F18"
      >
        90d: {data.predicted90d?.toFixed(1)}
      </text>

      {/* X-axis labels */}
      <text
        x={chart.PAD_X}
        y={chart.H - 6}
        textAnchor="start"
        fontSize="9"
        fill="#A5B2AD"
      >
        {chart.firstHistoryDate.toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
      </text>
      <text
        x={chart.W - chart.PAD_X}
        y={chart.H - 6}
        textAnchor="end"
        fontSize="9"
        fill="#A5B2AD"
      >
        +90 dager
      </text>
    </svg>
  );
}
