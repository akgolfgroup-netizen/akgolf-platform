"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const SGBreakdownBars = dynamic(
  () => import("./sg-breakdown-bars-impl").then((m) => ({ default: m.SGBreakdownBars })),
  { ssr: false, loading: () => <ChartSkeleton height="220px" /> },
);
