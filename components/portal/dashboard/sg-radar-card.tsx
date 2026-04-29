"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const SGRadarCard = dynamic(
  () => import("./sg-radar-card-impl").then((m) => ({ default: m.SGRadarCard })),
  { ssr: false, loading: () => <ChartSkeleton height="280px" /> },
);
