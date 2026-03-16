import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AdminBookingList } from "@/components/portal/admin/admin-booking-list";

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
          <h1 className="text-2xl font-bold text-[#0F2950]">Bookinger</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sok, filtrer og administrer alle bookinger
          </p>
        </div>
        <a
          href="/admin/bookinger/ny"
          className="px-4 py-2 text-sm font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 transition-colors"
        >
          + Ny booking
        </a>
      </div>
      <AdminBookingList />
    </div>
  );
}
