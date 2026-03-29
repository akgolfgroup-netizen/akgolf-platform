import Link from "next/link";
import { DIVISIONS } from "@/lib/website-constants";

const accentColors = {
  academy: "bg-academy",
  junior: "bg-junior",
  software: "bg-software",
  utvikling: "bg-utvikling",
  gold: "bg-black",
} as const;

export function RelatedPages({ exclude }: { exclude: string }) {
  const related = DIVISIONS.filter((d) => d.id !== exclude);

  return (
    <section className="w-section bg-grey-100">
      <div className="w-container">
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-grey-500">
            Mer fra AK Golf
          </span>
          <h2 className="w-heading-lg mt-4">Utforsk våre andre tilbud</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((div) => (
            <Link key={div.id} href={div.href} className="group block">
              <div className="w-card h-full flex flex-col">
                <div
                  className={`h-1 w-12 rounded-full ${accentColors[div.accent]} mb-6`}
                />
                <h3 className="w-heading-sm mb-3 group-hover:opacity-70 transition-opacity duration-300">
                  {div.title}
                </h3>
                <p className="text-sm text-grey-500 leading-relaxed mb-6 flex-1">
                  {div.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-grey-500 group-hover:text-black transition-colors duration-300">
                  Les mer
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
