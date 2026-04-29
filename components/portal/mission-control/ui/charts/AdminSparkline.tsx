"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const AdminSparkline = dynamic(
  () => import("./AdminSparkline-impl").then((m) => ({ default: m.AdminSparkline })),
  { ssr: false, loading: () => <ChartSkeleton height="40px" /> },
);
