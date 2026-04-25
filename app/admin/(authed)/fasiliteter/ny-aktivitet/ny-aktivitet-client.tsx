"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { createActivity } from "../actions-legacy";

// ── Types ──────────────────────────────────────────────────

interface FacilityOption {
 id: string;
 name: string;
 locationName: string | null;
}

type ActivityType = "PRACTICE"| "LESSON"| "TOURNAMENT"| "EVENT"| "OTHER";

const ACTIVITY_OPTIONS: { id: ActivityType; label: string; icon: typeof Users }[] = [
 { id: "PRACTICE", label: "Trening", icon: Users },
 { id: "TOURNAMENT", label: "Turnering", icon: Calendar },
 { id: "LESSON", label: "Kurs", icon: FileText },
 { id: "EVENT", label: "Event", icon: Calendar },
];

interface FormData {
 title: string;
 facilityId: string;
 date: string;
 startTime: string;
 endTime: string;
 maxParticipants: string;
 description: string;
 activityType: ActivityType;
}

// ── Component ──────────────────────────────────────────────

export function NyAktivitetClient({ facilities }: { facilities: FacilityOption[] }) {
 const { toggle } = useMCSidebar();
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [formData, setFormData] = useState<FormData>({
 title:"", facilityId:"", date:"", startTime:"", endTime:"",
 maxParticipants:"", description:"", activityType: "PRACTICE",
 });

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);
 try {
 await createActivity({
 facilityId: formData.facilityId,
 title: formData.title,
 description: formData.description || undefined,
 activityType: formData.activityType,
 startDate: formData.date,
 startTime: formData.startTime,
 endTime: formData.endTime,
 });
 setSuccess(true);
 setTimeout(() => router.push("/admin/fasiliteter"), 1500);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Noe gikk galt");
 } finally {
 setLoading(false);
 }
 };

 if (success) {
 return (
 <>
 <MCTopbar title="Ny aktivitet"subtitle=""onMenuClick={toggle} />
 <div className="p-6">
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl py-16 text-center max-w-md mx-auto">
 <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
 <Icon name="check_circle" className="w-8 h-8 text-green-600" />
 </div>
 <h2 className="text-xl font-semibold text-on-surface">Aktivitet opprettet!</h2>
 <p className="text-on-surface-variant mt-2">Aktiviteten er lagt til i kalenderen.</p>
 </div>
 </div>
 </>
 );
 }

 return (
 <>
 <MCTopbar title="Ny aktivitet"subtitle="Opprett en ny turnering, kurs eller aktivitet"onMenuClick={toggle} />
 <div className="p-6 max-w-2xl mx-auto space-y-6">
 <Link href="/admin/fasiliteter"className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface-variant transition-colors">
 <Icon name="arrow_back" className="w-4 h-4" />Tilbake til fasiliteter
 </Link>

 {/* Page Header */}
 <div>
 <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
 <Link href="/admin/fasiliteter"className="hover:text-on-surface-variant transition-colors">Fasiliteter</Link>
 <span>/</span>
 <span className="text-on-surface-variant">Ny aktivitet</span>
 </nav>
 <h1 className="text-2xl font-semibold text-on-surface">Ny aktivitet</h1>
 <p className="text-on-surface-variant mt-1">Opprett en ny turnering, kurs eller aktivitet</p>
 </div>

 {error && (
 <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
 )}

 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 rounded-xl p-6">
 <form onSubmit={handleSubmit} className="space-y-5">
 {/* Tittel */}
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Tittel</label>
 <input
 type="text"
 value={formData.title}
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 placeholder="F.eks. Junior Academy"
 required
 className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
 />
 </div>

 {/* Aktivitetstype */}
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-2">Aktivitetstype</label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {ACTIVITY_OPTIONS.map((type) => {
 const Icon = type.icon;
 const isActive = formData.activityType === type.id;
 return (
 <button
 key={type.id}
 type="button"
 onClick={() => setFormData({ ...formData, activityType: type.id })}
 className={cn(
 "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
 isActive
 ? "border-green-500 bg-green-50"
 : "border-outline-variant/30 bg-surface-container-lowest hover:bg-surface"
 )}
 >
 <Icon className={cn("w-5 h-5", isActive ? "text-green-600": "text-on-surface-variant")} />
 <span className={cn("text-sm", isActive ? "text-on-surface font-medium": "text-on-surface-variant")}>
 {type.label}
 </span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Fasilitet */}
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Fasilitet</label>
 <div className="relative">
 <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none z-10" />
 <select
 value={formData.facilityId}
 onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
 required
 className="w-full px-3 py-2 pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors appearance-none"
 >
 <option value="">Velg fasilitet</option>
 {facilities.map((f) => (
 <option key={f.id} value={f.id}>{f.name}{f.locationName ? ` (${f.locationName})` :""}</option>
 ))}
 </select>
 </div>
 </div>

 {/* Dato og tid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Dato</label>
 <div className="relative">
 <Icon name="calendar_today" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none z-10" />
 <input
 type="date"
 value={formData.date}
 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
 required
 className="w-full px-3 py-2 pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Start</label>
 <div className="relative">
 <Icon name="schedule" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none z-10" />
 <input
 type="time"
 value={formData.startTime}
 onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
 required
 className="w-full px-3 py-2 pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Slutt</label>
 <div className="relative">
 <Icon name="schedule" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none z-10" />
 <input
 type="time"
 value={formData.endTime}
 onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
 required
 className="w-full px-3 py-2 pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
 />
 </div>
 </div>
 </div>

 {/* Beskrivelse */}
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Beskrivelse</label>
 <textarea
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 placeholder="Beskriv aktiviteten..."
 rows={4}
 className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors resize-none"
 />
 </div>

 {/* Knapper */}
 <div className="flex gap-3 pt-2">
 <Link href="/admin/fasiliteter"className="flex-1">
 <button
 type="button"
 className="w-full px-4 py-2.5 bg-surface text-on-surface-variant font-medium rounded-lg hover:bg-surface transition-colors"
 >
 Avbryt
 </button>
 </Link>
 <button
 type="submit"
 disabled={loading}
 className="flex-1 px-4 py-2.5 bg-green-600 text-surface font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 {loading ? "Oppretter...": "Opprett aktivitet"}
 </button>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}
