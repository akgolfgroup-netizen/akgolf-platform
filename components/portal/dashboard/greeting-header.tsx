import { format, getISOWeek, type Locale } from "date-fns";
import { nb } from "date-fns/locale";

interface GreetingHeaderProps {
  userName: string | null;
  locale?: Locale;
}

function getGreeting(hour: number): string {
  if (hour < 6) return "God natt";
  if (hour < 11) return "God morgen";
  if (hour < 17) return "God dag";
  if (hour < 22) return "God kveld";
  return "God natt";
}

export function GreetingHeader({ userName, locale = nb }: GreetingHeaderProps) {
  const now = new Date();
  const firstName = userName?.split(" ")[0] ?? "spiller";
  const greeting = getGreeting(now.getHours());
  const dateLabel = format(now, "EEEE d. MMMM yyyy", { locale });
  const weekNumber = getISOWeek(now);

  return (
    <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-portal-muted)]">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--color-portal-text)] md:text-4xl">
          {greeting},{" "}
          <span className="text-[var(--color-primary)]">{firstName}</span>
        </h1>
      </div>
      <div className="flex items-center gap-3 text-sm text-[var(--color-portal-secondary)]">
        <span className="capitalize">{dateLabel}</span>
        <span className="h-4 w-px bg-[var(--color-portal-border)]" />
        <span className="rounded-full border border-[var(--color-portal-border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-portal-text)]">
          Uke {weekNumber}
        </span>
      </div>
    </header>
  );
}
