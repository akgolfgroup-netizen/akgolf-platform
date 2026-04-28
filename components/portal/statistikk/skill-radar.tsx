"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
export const SkillRadar = dynamic(
  () => import("./skill-radar-impl").then((m) => ({ default: m.SkillRadar })),
  { ssr: false, loading: () => <ChartSkeleton height="280px" /> },
);
