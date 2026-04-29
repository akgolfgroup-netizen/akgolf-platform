// Server Component — kun next/link og statisk rendering.
import Link from "next/link";

interface NextSessionCardProps {
  when: string | null;
  instructorName: string | null;
  serviceName: string | null;
  duration: number | null;
  focusLabel?: string | null;
  focusValue?: string | null;
  bookingId?: string;
}

function initials(name: string | null) {
  if (!name) return "—";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function NextSessionCard({
  when,
  instructorName,
  serviceName,
  duration,
  focusLabel,
  focusValue,
  bookingId,
}: NextSessionCardProps) {
  const hasBooking = Boolean(when && instructorName);

  return (
    <div
      className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col rounded-2xl bg-card p-5"
      style={{ boxShadow: "var(--shadow-card)", minHeight: "260px" }}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
        Neste økt
      </div>
      <div className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-ink">
        {hasBooking ? when : "Ingen kommende økt"}
      </div>

      {hasBooking ? (
        <>
          <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-surface-soft px-3 py-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sidebar))",
                color: "var(--color-accent)",
              }}
            >
              {initials(instructorName)}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-ink">
                Coach {instructorName}
              </div>
              <div className="mt-px text-[11px] text-ink-muted">
                {serviceName ?? "Privat"} · {duration ?? 60} min
              </div>
            </div>
          </div>

          {focusLabel && focusValue ? (
            <div className="mt-3.5 flex items-center gap-2.5 rounded-xl p-3 bg-accent">
              <div className="grid h-7 w-7 place-items-center rounded-lg text-[11px] font-extrabold bg-sidebar text-accent">
                {focusLabel.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">
                  Fokus
                </div>
                <div className="mt-px text-[13px] font-semibold text-ink">
                  {focusValue}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex gap-2 pt-3.5">
            {bookingId ? (
              <Link
                href={`/portal/bookinger/${bookingId}`}
                className="flex-1 rounded-xl bg-sidebar py-2.5 text-center text-xs font-semibold text-white hover:bg-sidebar-hover transition-colors"
              >
                Åpne økt
              </Link>
            ) : null}
            {bookingId ? (
              <Link
                href={`/portal/bookinger/${bookingId}/endre`}
                className="flex-1 rounded-xl bg-surface-soft py-2.5 text-center text-xs font-semibold text-ink-muted hover:bg-line transition-colors"
              >
                Flytt
              </Link>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="mt-3.5 rounded-xl bg-surface-soft px-3 py-3 text-[13px] text-ink-muted">
            Du har ingen planlagte økter de neste ukene.
          </div>
          <div className="mt-auto flex gap-2 pt-3.5">
            <Link
              href="/booking-v2"
              className="flex-1 rounded-xl bg-sidebar py-2.5 text-center text-xs font-semibold text-white hover:bg-sidebar-hover transition-colors"
            >
              Bestill økt
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
