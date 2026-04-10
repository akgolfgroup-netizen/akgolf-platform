"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Drawer } from "./Drawer";
import type { BookingState, TrainerService } from "./types";

interface SuccessDrawerProps {
  isOpen: boolean;
  state: BookingState;
  service: TrainerService | null;
  trainerName: string;
}

export function SuccessDrawer({ isOpen, state, service, trainerName }: SuccessDrawerProps) {
  const router = useRouter();

  if (!service || !state.date || !state.time) return null;

  const dateStr = new Date(state.date).toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Drawer isOpen={isOpen} onClose={() => router.push("/")}>
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-[#D1F843] flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-[#005840]" strokeWidth={3} />
        </div>
        <div className="text-xl font-bold text-[#0A1F18] mb-1">Bookingen er bekreftet!</div>
        <div className="text-[13px] text-[#A5B2AD] mb-6">Du mottar en bekreftelse pa e-post</div>

        <div className="bg-[#ECF0EF] rounded-xl p-4 text-left text-[13px] text-[#324D45] space-y-1">
          <DetailRow label="Trener" value={trainerName} />
          <DetailRow label="Tjeneste" value={service.name} />
          <DetailRow label="Dato" value={dateStr} />
          <DetailRow label="Tid" value={state.time} />
          <DetailRow label="Sted" value="Gamle Fredrikstad GK" />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 py-4 rounded-[14px] bg-[#005840] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#004530] transition-all"
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={() => router.push("/portal/bookinger")}
            className="flex-1 py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider hover:bg-[#c8ef35] transition-all"
          >
            Mine bookinger
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <strong className="text-[#0A1F18]">{value}</strong>
    </div>
  );
}
