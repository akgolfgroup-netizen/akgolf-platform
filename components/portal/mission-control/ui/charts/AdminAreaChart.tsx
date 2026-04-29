"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export type { AdminAreaChartDatum } from "./AdminAreaChart-impl";
export const AdminAreaChart = dynamic(
  () => import("./AdminAreaChart-impl").then((m) => ({ default: m.AdminAreaChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
