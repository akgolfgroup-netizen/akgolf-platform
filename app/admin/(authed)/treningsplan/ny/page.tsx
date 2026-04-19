import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getStudents, getDrills } from "../actions";
import { NyPlanWizard } from "./ny-plan-wizard";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ studentId?: string }>;
}

export default async function NyTreningsplanPage({ searchParams }: PageProps) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const params = await searchParams;
  const preselectedStudentId = params.studentId ?? null;

  const [students, drills] = await Promise.all([
    getStudents(),
    getDrills(),
  ]);

  return (
    <NyPlanWizard
      students={students}
      drills={drills}
      preselectedStudentId={preselectedStudentId}
    />
  );
}
