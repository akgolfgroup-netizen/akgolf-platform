"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const TrainingVolumeChart = dynamic(
  () => import("./training-volume-chart-impl").then((m) => ({ default: m.TrainingVolumeChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
