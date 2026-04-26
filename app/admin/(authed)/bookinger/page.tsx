import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { searchBookings } from "./actions";
import { BookingerClient } from "./bookinger-client";

export const metadata = {
  title: "Bookinger | AK Golf CoachHQ",
};

export default async function AdminBookingerPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const initialData = await searchBookings("", undefined, 1);

  return <BookingerClient initialData={initialData} />;
}
