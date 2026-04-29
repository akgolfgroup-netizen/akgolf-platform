"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export type { TrendPoint } from "./trends-chart-impl";
export const TrendsChart = dynamic(
  () => import("./trends-chart-impl").then((m) => ({ default: m.TrendsChart })),
  { ssr: false, loading: () => <ChartSkeleton height="220px" /> },
);
