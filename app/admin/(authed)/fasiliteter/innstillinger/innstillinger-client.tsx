"use client";


import { Icon } from "@/components/ui/icon";
import { useTransition } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { toggleFacilityActive, deleteInstructorDefault } from "../actions";

// ── Types ──────────────────────────────────────────────────

interface FacilityRow {
 id: string;
 name: string;
 locationName: string;
 capacity: number | null;
 isActive: boolean;
}

interface DefaultRow {
 id: string;
 instructorName: string;
 facilityName: string;
 serviceType: string | null;
 priority: number;
}

interface Props {
 facilities: FacilityRow[];
 defaults: DefaultRow[];
}

// ── Component ──────────────────────────────────────────────

export function InnstillingerClient({ facilities, defaults }: Props) {
 const { toggle } = useMCSidebar();
 const [isPending, startTransition] = useTransition();

 function handleToggle(facilityId: string) {
 startTransition(async () => {
 await toggleFacilityActive(facilityId);
 });
 }

 function handleDeleteDefault(defaultId: string) {
 if (!window.confirm("Slett denne default-koblingen?")) return;
 startTransition(async () => {
 await deleteInstructorDefault(defaultId);
 });
 }

 return (
 <>
 <MCTopbar title="Fasilitetinnstillinger"subtitle="Administrer fasiliteter og standard innstillinger"onMenuClick={toggle} />
 <div className={cn("p-6 max-w-4xl mx-auto space-y-6", isPending && "opacity-60 pointer-events-none")}>
 <Link href="/admin/fasiliteter"className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface-variant transition-colors">
 <Icon name="arrow_back" className="w-4 h-4" />Tilbake til fasiliteter
 </Link>

 {/* Page Header */}
 <div>
 <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
 <Link href="/admin/fasiliteter"className="hover:text-on-surface-variant transition-colors">Fasiliteter</Link>
 <span>/</span>
 <span className="text-on-surface-variant">Innstillinger</span>
 </nav>
 <h1 className="text-2xl font-semibold text-on-surface">Innstillinger</h1>
 <p className="text-on-surface-variant mt-1">Administrer fasiliteter og instruktør-defaults</p>
 </div>

 {/* Facilities List */}
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl overflow-hidden">
 <div className="px-5 py-4 border-b border-outline-variant/30">
 <h3 className="font-semibold text-on-surface">Fasiliteter</h3>
 </div>
 <div className="divide-y divide-grey-200">
 {facilities.map((f) => (
 <div key={f.id} className="px-5 py-4 flex items-center justify-between gap-4">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
 <Icon name="location_on" className="w-5 h-5 text-on-surface-variant" />
 </div>
 <div className="min-w-0">
 <p className="font-medium text-on-surface truncate">{f.name}</p>
 <p className="text-sm text-on-surface-variant">{f.locationName} · Kapasitet: {f.capacity}</p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => handleToggle(f.id)}
 className={cn(
 "inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
 f.isActive
 ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
 : "text-on-surface-variant bg-surface hover:bg-surface",
 )}
 >
 {f.isActive ? <><Icon name="check" className="w-3 h-3" />Aktiv</> : <><Icon name="close" className="w-3 h-3" />Inaktiv</>}
 </button>
 </div>
 ))}
 {facilities.length === 0 && (
 <div className="px-5 py-8 text-center text-sm text-on-surface-variant">Ingen fasiliteter registrert</div>
 )}
 </div>
 </div>

 {/* Instructor Defaults */}
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl overflow-hidden">
 <div className="px-5 py-4 border-b border-outline-variant/30">
 <h3 className="font-semibold text-on-surface">Instruktør-fasilitet defaults</h3>
 <p className="text-sm text-on-surface-variant mt-1">Standard fasilitet for hver instruktør ved booking-opprettelse</p>
 </div>
 {defaults.length > 0 ? (
 <div className="divide-y divide-grey-200">
 {defaults.map((d) => (
 <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
 <Icon name="person" className="w-5 h-5 text-on-surface-variant" />
 </div>
 <div className="min-w-0">
 <p className="font-medium text-on-surface truncate">{d.instructorName}</p>
 <p className="text-sm text-on-surface-variant truncate">{d.facilityName}{d.serviceType ? ` (${d.serviceType})` :""}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-on-surface-variant">
 Prioritet: {d.priority}
 </span>
 <button type="button"onClick={() => handleDeleteDefault(d.id)}
 className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"aria-label={`Slett default for ${d.instructorName}`}>
 <Icon name="delete" className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="px-5 py-8 text-center text-sm text-on-surface-variant">Ingen defaults konfigurert</div>
 )}
 </div>

 <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
 <div className="flex items-start gap-3">
 <Icon name="settings" className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
 <p className="text-sm text-on-surface-variant">
 <strong>Tips:</strong> Fasilitet-defaults brukes til automatisk å tildele riktig fasilitet når en booking opprettes.
 </p>
 </div>
 </div>
 </div>
 </>
 );
}
