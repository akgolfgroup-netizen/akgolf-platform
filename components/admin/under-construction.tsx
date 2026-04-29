import { Construction } from "lucide-react";

type UnderConstructionProps = {
  title: string;
  description?: string;
};

export function UnderConstruction({
  title,
  description = "Under bygging — kommer snart.",
}: UnderConstructionProps) {
  return (
    <div className="p-8">
      <h1 className="font-inter-tight text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">{description}</p>
      <div className="mt-8 max-w-xl rounded-2xl border border-[var(--color-line)] bg-card p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-primary">
            <Construction className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-inter-tight text-base font-semibold text-ink">
              Under bygging
            </div>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Denne siden er en del av CoachHQ-scaffold. Innhold legges til i
              kommende sprinter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
