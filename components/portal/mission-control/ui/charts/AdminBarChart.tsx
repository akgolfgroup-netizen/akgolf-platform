"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export type { AdminBarChartDatum } from "./AdminBarChart-impl";
export const AdminBarChart = dynamic(
  () => import("./AdminBarChart-impl").then((m) => ({ default: m.AdminBarChart })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
