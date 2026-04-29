"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export type { AdminDonutChartDatum } from "./AdminDonutChart-impl";
export const AdminDonutChart = dynamic(
  () => import("./AdminDonutChart-impl").then((m) => ({ default: m.AdminDonutChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
