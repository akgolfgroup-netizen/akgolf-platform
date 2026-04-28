"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export type { AdminLineChartDatum } from "./AdminLineChart-impl";
export const AdminLineChart = dynamic(
  () => import("./AdminLineChart-impl").then((m) => ({ default: m.AdminLineChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
