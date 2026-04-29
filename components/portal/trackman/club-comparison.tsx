"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const ClubComparison = dynamic(
  () => import("./club-comparison-impl").then((m) => ({ default: m.ClubComparison })),
  { ssr: false, loading: () => <ChartSkeleton height="280px" /> },
);
