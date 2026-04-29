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
      className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col rounded-[22px] bg-white p-5"
      style={{
        boxShadow:
          "0 0 0 1px rgba(10, 31, 24, 0.05), 0 1px 2px rgba(10, 31, 24, 0.03), 0 6px 20px rgba(10, 31, 24, 0.05)",
        minHeight: "260px",
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ak-g-400,#7A8C85)]">
        Neste økt
      </div>
      <div className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-[var(--ak-g-900,#0A1F18)]">
        {hasBooking ? when : "Ingen kommende økt"}
      </div>

      {hasBooking ? (
        <>
          <div className="mt-3.5 flex items-center gap-2.5 rounded-[10px] bg-[var(--ak-g-50,#F5F8F7)] px-3 py-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #005840, #0A1F18)",
                color: "#D1F843",
              }}
            >
              {initials(instructorName)}
            </div>
            <div>
              <div className="text-[13px] font-semibold">
                Coach {instructorName}
              </div>
              <div className="mt-px text-[11px] text-[var(--ak-g-500,#5A6E66)]">
                {serviceName ?? "Privat"} · {duration ?? 60} min
              </div>
            </div>
          </div>

          {focusLabel && focusValue ? (
            <div
              className="mt-3.5 flex items-center gap-2.5 rounded-[10px] p-3"
              style={{ background: "#D1F843" }}
            >
              <div
                className="grid h-7 w-7 place-items-center rounded-lg text-[11px] font-extrabold"
                style={{
                  background: "var(--ak-g-900, #0A1F18)",
                  color: "#D1F843",
                }}
              >
                {focusLabel.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(10, 31, 24, 0.6)" }}
                >
                  Fokus
                </div>
                <div className="mt-px text-[13px] font-semibold text-[var(--ak-g-900,#0A1F18)]">
                  {focusValue}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex gap-2 pt-3.5">
            {bookingId ? (
              <Link
                href={`/portal/bookinger/${bookingId}`}
                className="flex-1 rounded-[10px] bg-[var(--ak-g-900,#0A1F18)] py-2.5 text-center text-xs font-semibold text-white"
              >
                Åpne økt
              </Link>
            ) : null}
            {bookingId ? (
              <Link
                href={`/portal/bookinger/${bookingId}/endre`}
                className="flex-1 rounded-[10px] bg-[var(--ak-g-50,#F5F8F7)] py-2.5 text-center text-xs font-semibold text-[var(--ak-g-700,#324D45)]"
              >
                Flytt
              </Link>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="mt-3.5 rounded-[10px] bg-[var(--ak-g-50,#F5F8F7)] px-3 py-3 text-[13px] text-[var(--ak-g-500,#5A6E66)]">
            Du har ingen planlagte økter de neste ukene.
          </div>
          <div className="mt-auto flex gap-2 pt-3.5">
            <Link
              href="/booking-v2"
              className="flex-1 rounded-[10px] bg-[var(--ak-g-900,#0A1F18)] py-2.5 text-center text-xs font-semibold text-white"
            >
              Bestill økt
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
