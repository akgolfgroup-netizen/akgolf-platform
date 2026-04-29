"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const PeerRadarChart = dynamic(
  () => import("./peer-radar-chart-impl").then((m) => ({ default: m.PeerRadarChart })),
  { ssr: false, loading: () => <ChartSkeleton height="280px" /> },
);
