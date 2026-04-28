"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const SGRadarChart = dynamic(
  () => import("./sg-radar-chart-impl").then((m) => ({ default: m.SGRadarChart })),
  { ssr: false, loading: () => <ChartSkeleton height="280px" /> },
);
