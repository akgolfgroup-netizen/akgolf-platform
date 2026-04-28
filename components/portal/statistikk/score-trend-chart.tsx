"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const ScoreTrendChart = dynamic(
  () => import("./score-trend-chart-impl").then((m) => ({ default: m.ScoreTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
