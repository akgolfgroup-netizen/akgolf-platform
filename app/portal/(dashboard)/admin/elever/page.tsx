import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { StudentList } from "@/components/portal/admin/student-list";
import { ADMIN_CONTENT } from "@/lib/website-constants";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">Elever</h1>
        <p className="text-sm text-[var(--color-ink-40)] mt-1">
          Oversikt over alle elever med booking- og coachinghistorikk
        </p>
      </div>

      {/* Player Categories */}
      <details className="rounded-lg bg-[#1a1a1a] border border-[#333] group">
        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none hover:bg-[#262626]">
          <Info className="w-4 h-4 text-[#B07D4F]" />
          <span className="text-sm font-medium text-white">Spillerkategorier (A-K)</span>
          <span className="ml-auto text-xs text-[#737373] group-open:hidden">Vis</span>
          <span className="ml-auto text-xs text-[#737373] hidden group-open:inline">Skjul</span>
        </summary>
        <div className="px-4 pb-4 pt-2 border-t border-[#333]">
          <div className="grid grid-cols-2 gap-2">
            {ADMIN_CONTENT.elever.playerCategories.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2 py-1">
                <span className="w-6 h-6 rounded flex items-center justify-center bg-[#B07D4F]/20 text-[#B07D4F] text-xs font-bold">
                  {cat.key}
                </span>
                <span className="text-sm text-[#A3A3A3]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <StudentList />
    </div>
  );
}
