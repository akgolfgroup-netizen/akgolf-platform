"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const ClubWaveform = dynamic(
  () => import("./club-waveform-impl").then((m) => ({ default: m.ClubWaveform })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
