import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";

interface SettingsLinkRowProps {
  onSignOut: () => void;
}

export function SettingsLinkRow({ onSignOut }: SettingsLinkRowProps) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <Link
        href="/portal/profil/innstillinger"
        className="flex items-center justify-between rounded-xl border border-[#1a4a3a] bg-white/[0.03] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.05]"
      >
        <div>
          <div className="font-medium text-white">Innstillinger</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/50">
            PERSONLIG · NOTIFIKASJONER · PERSONVERN
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-white/50" />
      </Link>

      <button
        type="button"
        onClick={onSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#B84233]/30 bg-[#B84233]/10 px-5 py-3.5 text-sm font-semibold text-[#F49283] transition hover:bg-[#B84233]/15"
      >
        <LogOut className="h-4 w-4" />
        Logg ut
      </button>
    </div>
  );
}
