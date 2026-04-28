"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export const SessionsDonut = dynamic(
  () => import("./sessions-donut-impl").then((m) => ({ default: m.SessionsDonut })),
  { ssr: false, loading: () => <ChartSkeleton height="240px" /> },
);
