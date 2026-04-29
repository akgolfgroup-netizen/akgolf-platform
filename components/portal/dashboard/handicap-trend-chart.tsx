"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const HandicapTrendChart = dynamic(
  () => import("./handicap-trend-chart-impl").then((m) => ({ default: m.HandicapTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton height="220px" /> },
);
