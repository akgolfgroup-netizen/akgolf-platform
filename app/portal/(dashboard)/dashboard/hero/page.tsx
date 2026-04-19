import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getDashboardStats,
  getHandicapData,
  getNextBooking,
} from "@/app/portal/(dashboard)/dashboard-actions";
import { CourseHeroClient } from "./course-hero-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard · Course Hero | AK Golf Portal",
  description:
    "Immersivt dashboard med foto-hero og glass bento. Din dag i ett blikk.",
};

export default async function CourseHeroDashboardPage() {
  const user = await requirePortalUser();

  const [stats, handicap, nextBooking] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getNextBooking(user.id),
  ]);

  return (
    <CourseHeroClient
      userName={user.name ?? "Spiller"}
      stats={stats}
      handicap={handicap}
      nextBooking={nextBooking}
    />
  );
}
