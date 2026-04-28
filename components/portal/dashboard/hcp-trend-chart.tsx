"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const HCPTrendChart = dynamic(
  () => import("./hcp-trend-chart-impl").then((m) => ({ default: m.HCPTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton height="220px" /> },
);
