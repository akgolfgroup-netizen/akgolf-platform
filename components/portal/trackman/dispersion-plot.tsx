"use client";

import React, { useMemo, useState } from "react";

interface Shot {
  id: string;
  shotNumber: number;
  club: string;
  ballSpeed: number | null;
  carryDistance: number | null;
  totalDistance: number | null;
  spinRate: number | null;
  launchAngle: number | null;
  offlineDistance: number | null;
}

interface DispersionPlotProps {
  shots: Shot[];
  width?: number;
  height?: number;
}

const CLUB_PALETTE: Record<string, string> = {
  Driver: "#005840",
  "3 Wood": "#2A7D5A",
  "5 Wood": "#007AFF",
  "3 Iron": "#AF52DE",
  "4 Iron": "#AF52DE",
  "5 Iron": "#C48A32",
  "6 Iron": "#C48A32",
  "7 Iron": "#E85D4E",
  "8 Iron": "#E85D4E",
  "9 Iron": "#B84233",
  PW: "#D1F843",
  GW: "#A6C734",
  SW: "#576500",
  LW: "#0A1F18",
};

function getClubColor(club: string): string {
  const normalized = club.trim();
  if (CLUB_PALETTE[normalized]) return CLUB_PALETTE[normalized];
  const lower = normalized.toLowerCase();
  if (lower.includes("driver")) return CLUB_PALETTE.Driver;
  if (lower.includes("3 wood")) return CLUB_PALETTE["3 Wood"];
  if (lower.includes("5 wood")) return CLUB_PALETTE["5 Wood"];
  if (lower.includes("3 iron")) return CLUB_PALETTE["3 Iron"];
  if (lower.includes("4 iron")) return CLUB_PALETTE["4 Iron"];
  if (lower.includes("5 iron")) return CLUB_PALETTE["5 Iron"];
  if (lower.includes("6 iron")) return CLUB_PALETTE["6 Iron"];
  if (lower.includes("7 iron")) return CLUB_PALETTE["7 Iron"];
  if (lower.includes("8 iron")) return CLUB_PALETTE["8 Iron"];
  if (lower.includes("9 iron")) return CLUB_PALETTE["9 Iron"];
  if (lower === "pw" || lower.includes("pitching")) return CLUB_PALETTE.PW;
  if (lower === "gw" || lower.includes("gap")) return CLUB_PALETTE.GW;
  if (lower === "sw" || lower.includes("sand")) return CLUB_PALETTE.SW;
  if (lower === "lw" || lower.includes("lob")) return CLUB_PALETTE.LW;
  return "#5C6B62";
}

const X_MIN = -30;
const X_MAX = 30;
const Y_MIN = 0;
const Y_MAX = 300;
const MARGIN = { top: 24, right: 24, bottom: 40, left: 48 };

export function DispersionPlot({ shots, width = 640, height = 400 }: DispersionPlotProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; shot: Shot & { carryDistance: number; offlineDistance: number } } | null>(null);

  const plotWidth = width - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const validShots = useMemo(
    () =>
      shots.filter(
        (s): s is Shot & { carryDistance: number; offlineDistance: number } =>
          s.carryDistance !== null && s.carryDistance >= Y_MIN && s.carryDistance <= Y_MAX &&
          s.offlineDistance !== null && s.offlineDistance >= X_MIN && s.offlineDistance <= X_MAX
      ),
    [shots]
  );

  const scaleX = (val: number) => MARGIN.left + ((val - X_MIN) / (X_MAX - X_MIN)) * plotWidth;
  const scaleY = (val: number) => MARGIN.top + plotHeight - ((val - Y_MIN) / (Y_MAX - Y_MIN)) * plotHeight;
  const scaleR = (ballSpeed: number | null): number => {
    if (ballSpeed === null) return 4;
    const minR = 3;
    const maxR = 10;
    const minSpeed = 80;
    const maxSpeed = 180;
    const t = Math.max(0, Math.min(1, (ballSpeed - minSpeed) / (maxSpeed - minSpeed)));
    return minR + t * (maxR - minR);
  };

  const xTicks = [-30, -20, -10, 0, 10, 20, 30];
  const yTicks = [0, 50, 100, 150, 200, 250, 300];

  const handleMouseEnter = (shot: Shot & { carryDistance: number; offlineDistance: number }, event: React.MouseEvent) => {
    setHoveredId(shot.id);
    const svgRect = (event.currentTarget as SVGGElement).closest("svg")?.getBoundingClientRect();
    if (svgRect) {
      setTooltip({
        x: event.clientX - svgRect.left + 12,
        y: event.clientY - svgRect.top - 12,
        shot,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setTooltip(null);
  };

  if (validShots.length === 0) {
    return (
      <div className="flex items-center justify-center h-[260px] text-sm text-ink-muted">
        Ingen shot-data med offline- og carry-målinger for denne perioden
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ minWidth: 320, maxWidth: width }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Bakgrunn */}
        <rect x={MARGIN.left} y={MARGIN.top} width={plotWidth} height={plotHeight} fill="#FAFBFA" rx={6} />

        {/* Grid — Y */}
        {yTicks.map((t) => (
          <line
            key={`ygrid-${t}`}
            x1={MARGIN.left}
            x2={MARGIN.left + plotWidth}
            y1={scaleY(t)}
            y2={scaleY(t)}
            stroke="#E4EAE6"
            strokeDasharray={t === 0 ? undefined : "3 3"}
          />
        ))}

        {/* Grid — X */}
        {xTicks.map((t) => (
          <line
            key={`xgrid-${t}`}
            x1={scaleX(t)}
            x2={scaleX(t)}
            y1={MARGIN.top}
            y2={MARGIN.top + plotHeight}
            stroke="#E4EAE6"
            strokeDasharray={t === 0 ? undefined : "3 3"}
          />
        ))}

        {/* Center target */}
        <circle cx={scaleX(0)} cy={scaleY(0)} r={4} fill="#B84233" opacity={0.6} />
        <circle cx={scaleX(0)} cy={scaleY(0)} r={12} fill="none" stroke="#B84233" opacity={0.3} strokeWidth={1} />
        <text x={scaleX(0) + 8} y={scaleY(0) + 4} fontSize={10} fill="#B84233" opacity={0.7}>
          Target
        </text>

        {/* Y-ticks */}
        {yTicks.map((t) => (
          <g key={`ytick-${t}`}>
            <text
              x={MARGIN.left - 8}
              y={scaleY(t) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#8A958E"
              fontFamily="var(--font-inter), Inter, sans-serif"
            >
              {t}m
            </text>
          </g>
        ))}

        {/* X-ticks */}
        {xTicks.map((t) => (
          <g key={`xtick-${t}`}>
            <text
              x={scaleX(t)}
              y={MARGIN.top + plotHeight + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#8A958E"
              fontFamily="var(--font-inter), Inter, sans-serif"
            >
              {t > 0 ? `+${t}` : t}m
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={MARGIN.left + plotWidth / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize={11}
          fill="#5C6B62"
          fontWeight={500}
          fontFamily="var(--font-inter), Inter, sans-serif"
        >
          Lateral spredning (m)
        </text>
        <text
          x={14}
          y={MARGIN.top + plotHeight / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#5C6B62"
          fontWeight={500}
          fontFamily="var(--font-inter), Inter, sans-serif"
          transform={`rotate(-90, 14, ${MARGIN.top + plotHeight / 2})`}
        >
          Distanse (m)
        </text>

        {/* Shots */}
        {validShots.map((shot) => {
          const cx = scaleX(shot.offlineDistance);
          const cy = scaleY(shot.carryDistance);
          const r = scaleR(shot.ballSpeed);
          const isHovered = hoveredId === shot.id;
          const color = getClubColor(shot.club);

          return (
            <circle
              key={shot.id}
              cx={cx}
              cy={cy}
              r={isHovered ? r + 2 : r}
              fill={color}
              opacity={isHovered ? 0.95 : 0.7}
              stroke={isHovered ? "#0A1F18" : "none"}
              strokeWidth={1.5}
              style={{ cursor: "pointer", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => handleMouseEnter(shot, e)}
              onMouseMove={(e) => handleMouseEnter(shot, e)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x}
              y={tooltip.y - 56}
              width={160}
              height={56}
              rx={8}
              fill="#0A1F18"
              opacity={0.95}
            />
            <text x={tooltip.x + 8} y={tooltip.y - 40} fontSize={10} fill="#D1F843" fontWeight={600}>
              {tooltip.shot.club} · Slag #{tooltip.shot.shotNumber}
            </text>
            <text x={tooltip.x + 8} y={tooltip.y - 26} fontSize={10} fill="#FFFFFF">
              Carry: {Math.round(tooltip.shot.carryDistance)}m
            </text>
            <text x={tooltip.x + 8} y={tooltip.y - 12} fontSize={10} fill="#FFFFFF">
              Offline: {tooltip.shot.offlineDistance && tooltip.shot.offlineDistance > 0 ? "+" : ""}
              {Math.round(tooltip.shot.offlineDistance * 10) / 10}m
              {tooltip.shot.ballSpeed ? ` · ${Math.round(tooltip.shot.ballSpeed)} mph` : ""}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
