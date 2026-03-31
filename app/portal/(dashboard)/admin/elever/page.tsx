import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { StudentList } from "@/components/portal/admin/student-list";
import { ADMIN_CONTENT } from "@/lib/website-constants";
import { Info, UserPlus, Download, ChevronDown } from "lucide-react";
import { AppleButton } from "@/components/portal/apple";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[var(--apple-gray-950)] tracking-[-0.02em] font-[family-name:var(--font-display)]">
            Elever
          </h1>
          <p className="text-[15px] text-[var(--apple-gray-500)] mt-1">
            Administrer medlemskap og coaching-historikk
          </p>
        </div>
        <div className="flex gap-3">
          <AppleButton variant="secondary" size="sm" icon={Download}>
            Eksporter
          </AppleButton>
          <AppleButton variant="primary" size="sm" icon={UserPlus}>
            Ny elev
          </AppleButton>
        </div>
      </div>

      {/* Player Categories - Apple Glassmorphism */}
      <details className="group rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none">
          <div className="w-9 h-9 rounded-xl bg-[var(--apple-gray-100)] flex items-center justify-center">
            <Info className="w-[18px] h-[18px] text-[var(--apple-gold-500)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--apple-gray-900)]">
            Spillerkategorier (A-K)
          </span>
          <ChevronDown className="ml-auto w-5 h-5 text-[var(--apple-gray-400)] transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-5 pb-5 pt-2 border-t border-[var(--apple-gray-200)]">
          <div className="grid grid-cols-2 gap-3 mt-3">
            {ADMIN_CONTENT.elever.playerCategories.map((cat) => (
              <div key={cat.key} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[var(--apple-gray-50)] hover:bg-[var(--apple-gray-100)] transition-colors">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--apple-gold-300)] to-[var(--apple-gold-500)] text-white text-xs font-bold shadow-sm">
                  {cat.key}
                </span>
                <span className="text-sm text-[var(--apple-gray-700)]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <StudentList />
    </div>
  );
}
