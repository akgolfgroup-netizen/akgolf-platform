import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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
      Instructor: {
        select: {
          id: true,
          title: true,
          User: { select: { name: true, image: true } },
        },
      },
    },
  });

  return (
    <div className="p-6 max-w-2xl">
      <BookCoachingForm serviceTypes={serviceTypes.map((st) => ({
        ...st,
        instructors: st.Instructor.map((i) => ({
          id: i.id,
          title: i.title,
          user: { name: i.User.name, image: i.User.image },
        })),
      }))} />
    </div>
  );
}
