import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AdminBookingList } from "@/components/portal/admin/admin-booking-list";
import Link from "next/link";
import { Plus, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FC] via-[#F0F4F8] to-[#F5F5F7]">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em] mb-1">
              Bookinger
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)]">
              Administrer alle bookinger — filtrer, endre status og behandle betalinger
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-[var(--color-grey-700)] border border-[var(--color-grey-200)] hover:bg-[var(--color-grey-100)] hover:border-[var(--color-grey-300)] transition-all duration-200">
              <Download className="w-[18px] h-[18px]" />
              Eksporter
            </button>
            <Link
              href="/portal/admin/bookinger/ny"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-900)]/90 transition-all duration-200 shadow-[var(--shadow-md)] hover:-translate-y-0.5"
            >
              <Plus className="w-[18px] h-[18px]" />
              Ny Booking
            </Link>
          </div>
        </header>

        <AdminBookingList />
      </div>
    </div>
  );
}
