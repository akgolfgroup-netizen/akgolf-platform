"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const TrainingDistribution = dynamic(
  () => import("./training-distribution-impl").then((m) => ({ default: m.TrainingDistribution })),
  { ssr: false, loading: () => <ChartSkeleton height="220px" /> },
);
