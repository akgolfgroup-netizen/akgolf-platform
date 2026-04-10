import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getStudentPlans, getExistingPlans } from "./actions";
import { TreningsplanClient } from "./treningsplan-client";

interface PageProps {
  searchParams: Promise<{ studentId?: string }>;
}

export default async function TreningsplanAdminPage({
  searchParams,
}: PageProps) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const params = await searchParams;
  const studentId = params.studentId;

  // Elevspesifikk visning med redigering
  if (studentId) {
    const { plans, student } = await getStudentPlans(studentId);
    return (
      <TreningsplanClient
        plans={plans}
        student={student}
        studentId={studentId}
      />
    );
  }

  // Oversikt over alle planer
  const allPlans = await getExistingPlans();
  return <TreningsplanClient initialPlans={allPlans} />;
}
