import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { ArrowLeft, MapPin, Check, X } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fasilitetinnstillinger | AK Golf Portal",
  description: "Administrer fasiliteter og instruktor-defaults",
};

export default async function FasilitetInnstillingerPage() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    redirect("/portal/admin/fasiliteter");
  }

  // Hent fasiliteter med location
  const facilities = await prisma.facility.findMany({
    include: {
      Location: { select: { id: true, name: true } },
    },
    orderBy: [{ Location: { name: "asc" } }, { sortOrder: "asc" }],
  });

  // Hent instructor defaults
  const defaults = await prisma.instructorFacilityDefault.findMany({
    include: {
      Instructor: {
        include: {
          User: { select: { name: true } },
        },
      },
      Facility: { select: { name: true } },
      ServiceType: { select: { name: true } },
    },
    orderBy: { priority: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/portal/admin/fasiliteter"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til fasiliteter
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Fasilitetinnstillinger
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Administrer fasiliteter og standard fasilitet-tildeling for instruktører
        </p>
      </div>

      {/* Facilities list */}
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
          <h2 className="font-semibold text-[var(--color-grey-900)]">
            Fasiliteter
          </h2>
        </div>
        <div className="divide-y divide-[var(--color-grey-100)]">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--color-grey-500)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-grey-900)]">
                    {facility.name}
                  </p>
                  <p className="text-sm text-[var(--color-grey-500)]">
                    {facility.Location?.name} · Kapasitet: {facility.capacity ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    facility.isActive
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-grey-400)]"
                  }`}
                >
                  {facility.isActive ? (
                    <>
                      <Check className="w-3 h-3" />
                      Aktiv
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      Inaktiv
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor defaults */}
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
          <h2 className="font-semibold text-[var(--color-grey-900)]">
            Instruktør-fasilitet defaults
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mt-1">
            Standard fasilitet for hver instruktør ved booking-opprettelse
          </p>
        </div>
        {defaults.length > 0 ? (
          <div className="divide-y divide-[var(--color-grey-100)]">
            {defaults.map((d) => (
              <div
                key={d.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--color-grey-900)]">
                    {d.Instructor.User.name}
                  </p>
                  <p className="text-sm text-[var(--color-grey-500)]">
                    {d.Facility.name}
                    {d.ServiceType && ` (${d.ServiceType.name})`}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-grey-400)]">
                  Prioritet: {d.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-[var(--color-grey-400)]">
            Ingen defaults konfigurert
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/20">
        <p className="text-sm text-[#007AFF]">
          <strong>Tips:</strong> Fasilitet-defaults brukes til automatisk å tildele riktig fasilitet
          når en booking opprettes. Du kan konfigurere dette via{" "}
          <code className="px-1.5 py-0.5 rounded bg-[#007AFF]/10">prisma/seed-config.ts</code>
        </p>
      </div>
    </div>
  );
}
