import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { BagClient } from "./bag-client";

export const dynamic = "force-dynamic";

export default async function BagPage() {
  const user = await requirePortalUser();

  const bag = await prisma.playerBag.findUnique({
    where: { userId: user.id },
    include: {
      clubs: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Min bag</h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Registrer klubber og avstander for presise anbefalinger
        </p>
      </div>

      <BagClient
        clubs={
          bag?.clubs.map((c) => ({
            id: c.id,
            name: c.name,
            brand: c.brand,
            model: c.model,
            loft: c.loft,
            avgCarry: c.avgCarry,
            avgTotal: c.avgTotal,
            avgOffline: c.avgOffline,
            shotCount: c.shotCount,
          })) ?? []
        }
      />
    </div>
  );
}
