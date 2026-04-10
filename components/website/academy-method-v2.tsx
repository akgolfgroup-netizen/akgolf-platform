import { ScanSearch, ClipboardList, TrendingUp } from "lucide-react";
import { FOUNDATION_METHOD } from "@/lib/website-constants";

const PHASE_ICONS = [ScanSearch, ClipboardList, TrendingUp] as const;

export function AcademyMethodV2() {
  return (
    <section className="py-24 bg-[var(--color-surface)]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[var(--color-primary)] font-bold tracking-widest text-xs uppercase mb-4">
            {FOUNDATION_METHOD.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            {FOUNDATION_METHOD.heading}
          </h2>
          <p className="text-[var(--color-muted)] text-lg">
            {FOUNDATION_METHOD.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FOUNDATION_METHOD.phases.map((phase, index) => {
            const Icon = PHASE_ICONS[index];
            return (
              <div
                key={phase.id}
                className="bg-white rounded-2xl p-8 border border-[var(--color-grey-200)] shadow-sm flex flex-col gap-6"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-[var(--color-accent-cta)]" />
                  </div>
                  <span className="text-4xl font-bold text-[var(--color-grey-200)] select-none leading-none">
                    {phase.name}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed text-sm">
                    {phase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
