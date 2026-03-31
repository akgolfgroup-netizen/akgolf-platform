import { redirect } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { CoachSidebar } from "@/components/coach/layout/CoachSidebar";
import { CoachTopbar } from "@/components/coach/layout/CoachTopbar";

export default async function CoachDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  // Kun INSTRUCTOR og ADMIN har tilgang
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-[var(--color-grey-100)]">
      <CoachSidebar />
      <div className="pl-64">
        <CoachTopbar userName={user.name || user.email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
