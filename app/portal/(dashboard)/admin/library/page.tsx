import { FolderPlus, UploadCloud } from "lucide-react";
import { FeaturedCard } from "@/components/admin/library/featured-card";
import { ResourceCard } from "@/components/admin/library/resource-card";
import { SidebarFilters } from "@/components/admin/library/sidebar-filters";
import { SortBar } from "@/components/admin/library/sort-bar";
import { MOCK_RESOURCES } from "@/components/admin/library/mock-data";

// TODO: koble til ekte data
// - resources: prisma.libraryResource.findMany med tags og kategorier
// - featured: konfigurert manuelt eller "uke-resource" basert på views
// - filters: aggregert count per type/kategori

export default function LibraryPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
            / INNHOLD · BIBLIOTEK
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Coaching-ressurser, samlet.
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-[13px] text-white/60">
            Dine drills, video-leksjoner og PDFer — søk- og filtrerbart, deles
            direkte med spillere. Featured ressurs denne uken: Erik sin
            Trackman-tolkningsguide.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 hover:border-white/20 hover:bg-white/10"
          >
            <FolderPlus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny mappe
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-ink hover:bg-accent/90"
          >
            <UploadCloud className="h-3.5 w-3.5" strokeWidth={2.2} /> Last opp ressurs
          </button>
        </div>
      </div>

      <div
        className="grid items-start gap-[18px]"
        style={{ gridTemplateColumns: "240px 1fr" }}
      >
        <SidebarFilters />
        <div>
          <FeaturedCard />
          <SortBar />
          <div className="grid grid-cols-3 gap-3.5">
            {MOCK_RESOURCES.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
