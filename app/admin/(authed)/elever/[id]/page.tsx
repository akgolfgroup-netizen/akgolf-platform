import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect, notFound } from "next/navigation";
import { getStudentProfile } from "./actions";
import { StudentDetailClient } from "./student-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getStudentProfile(id);
  return {
    title: profile
      ? `${profile.name ?? "Elev"} | AK Golf Mission Control`
      : "Elev | AK Golf Mission Control",
  };
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const { id } = await params;
  const profile = await getStudentProfile(id);

  if (!profile) {
    notFound();
  }

  return <StudentDetailClient profile={profile} />;
}
