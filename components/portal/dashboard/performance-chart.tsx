"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const PerformanceChart = dynamic(
  () => import("./performance-chart-impl").then((m) => ({ default: m.PerformanceChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
