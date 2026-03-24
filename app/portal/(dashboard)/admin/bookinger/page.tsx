import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AdminBookingList } from "@/components/portal/admin/admin-booking-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-snow)]">Bookinger</h1>
          <p className="text-sm text-[var(--color-ink-40)] mt-1">
            Søk, filtrer og administrer alle bookinger
          </p>
        </div>
        <Link
          href="/portal/admin/bookinger/ny"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-white hover:brightness-110 transition-all cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(184,151,92,0.25)" }}
        >
          <Plus className="w-4 h-4" />
          Ny booking
        </Link>
      </div>
      <AdminBookingList />
    </div>
  );
}
