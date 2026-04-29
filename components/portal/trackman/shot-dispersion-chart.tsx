"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const ShotDispersionChart = dynamic(
  () => import("./shot-dispersion-chart-impl").then((m) => ({ default: m.ShotDispersionChart })),
  { ssr: false, loading: () => <ChartSkeleton height="320px" /> },
);
