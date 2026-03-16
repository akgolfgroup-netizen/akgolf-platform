import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { Topbar } from "@/components/portal/layout/topbar";
import { BookCoachingForm } from "./book-coaching-form";

export default async function NyBookingPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const serviceTypes = await prisma.serviceType.findMany({
    where: { isActive: true, isPublic: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      duration: true,
      price: true,
      color: true,
      maxStudents: true,
      instructors: {
        select: {
          id: true,
          title: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
  });

  return (
    <div>
      <Topbar title="Book coaching" />
      <div className="p-6 max-w-2xl">
        <BookCoachingForm serviceTypes={serviceTypes} />
      </div>
    </div>
  );
}
