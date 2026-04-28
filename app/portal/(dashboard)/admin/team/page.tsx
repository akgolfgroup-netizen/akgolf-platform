import { Mail, Plus, Repeat, UserCog } from "lucide-react";
import {
  InvitePlaceholder,
  PersonCard,
} from "@/components/admin/team/person-card";
import { PermissionsTable } from "@/components/admin/team/permissions-table";
import { MOCK_TEAM } from "@/components/admin/team/mock-data";

// TODO: koble til ekte data
// - team: prisma.user.findMany({ where: { role: { in: [INSTRUCTOR, ADMIN] } } })
// - invites: prisma.invitation
// - permissions: lib/portal/capabilities/check.ts

export default function TeamPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
            / MENNESKER · TEAM
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Erik &amp; medspillere på Akademiet.
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-[13px] text-white/60">
            5 aktive team-medlemmer. Erik er hoved-coach (lead). Resten har
            avgrensede roller — fysio kan logge tester, junior-coach booker bare
            kohortene sine, admin tar fakturering.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 hover:border-white/20 hover:bg-white/10"
          >
            <UserCog className="h-3.5 w-3.5" strokeWidth={1.8} /> Roller
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-ink hover:bg-accent/90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} /> Inviter team-medlem
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3 rounded-[10px] border border-dashed border-[#E8B967]/40 bg-[#E8B967]/10 px-4 py-3">
        <Mail className="h-4 w-4 text-[#E8B967]" strokeWidth={1.8} />
        <div className="flex-1 text-[13px] text-white">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.10em] text-[#E8B967]">
            PENDING INVITE · sendt 24. APRIL
          </div>
          Maja Berg · invitert som <strong>Junior-coach</strong> for Junior
          Mid-kohort. Venter på aksept (3 dager igjen).
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/85"
        >
          <Repeat className="h-3.5 w-3.5" strokeWidth={1.8} /> Send påminnelse
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {MOCK_TEAM.map((m) => (
          <PersonCard key={m.id} member={m} />
        ))}
        <InvitePlaceholder />
      </div>

      <PermissionsTable />
    </div>
  );
}
