import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { UploadForm } from "@/components/portal/trackman/upload-form";

export const metadata: Metadata = {
  title: "Last opp TrackMan | PlayersHQ",
  description: "Last opp TrackMan-data fra bilde eller CSV.",
};

export default async function TrackManUploadPage() {
  const user = await requirePortalUser();

  const bag = await prisma.playerBag.findUnique({
    where: { userId: user.id },
    include: { clubs: { orderBy: { sortOrder: "asc" } } },
  });

  const clubs = bag?.clubs.map((c) => c.name) ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Last opp TrackMan-data</h1>
        <p className="text-ink-muted mt-1">
          Importer slag-data fra bilde eller CSV-fil.
        </p>
      </div>
      <UploadForm clubs={clubs} />
    </div>
  );
}
