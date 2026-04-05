import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { StartRoundClient } from "./start-round-client";

export const dynamic = "force-dynamic";

export default async function NyRundePage() {
  await requirePortalUser();

  const courses = await prisma.course.findMany({
    where: { country: "NO" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      location: true,
      par: true,
      courseRating: true,
      slopeRating: true,
    },
  });

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Ny runde
        </h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Velg bane og start registrering
        </p>
      </div>

      <StartRoundClient courses={courses} />
    </div>
  );
}
