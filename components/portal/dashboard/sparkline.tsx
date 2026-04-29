"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const Sparkline = dynamic(
  () => import("./sparkline-impl").then((m) => ({ default: m.Sparkline })),
  { ssr: false, loading: () => <ChartSkeleton height="40px" /> },
);

export const SparklineCompact = dynamic(
  () => import("./sparkline-impl").then((m) => ({ default: m.SparklineCompact })),
  { ssr: false, loading: () => <ChartSkeleton height="24px" /> },
);
