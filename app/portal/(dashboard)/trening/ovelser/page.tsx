import { Icon } from "@/components/ui/icon";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { PYRAMIDE } from "@/lib/portal/training/ak-taxonomy";

export const metadata = {
  title: "Øvelser | AK Golf Portal",
};

async function getExercises() {
  const user = await requirePortalUser();

  const exercises = await prisma.exerciseDefinition.findMany({
    where: {
      OR: [
        { isPublic: true },
        { isSystemDrill: true },
        { createdById: user.id },
      ],
    },
    orderBy: [{ pyramid: "asc" }, { name: "asc" }],
  });

  return exercises;
}

const pyramidConfig: Record<
  string,
  { label: string; icon: string; chip: string; bar: string }
> = {
  FYS: {
    label: "Fysisk",
    icon: "exercise",
    chip: "bg-primary/15 text-primary",
    bar: "bg-primary",
  },
  TEK: {
    label: "Teknikk",
    icon: "target",
    chip: "bg-secondary-container/80 text-primary",
    bar: "bg-secondary-container",
  },
  SLAG: {
    label: "Golfslag",
    icon: "bolt",
    chip: "bg-secondary-fixed/40 text-primary",
    bar: "bg-secondary-fixed",
  },
  SPILL: {
    label: "Spill",
    icon: "terrain",
    chip: "bg-tertiary-container/40 text-primary",
    bar: "bg-tertiary-container",
  },
  TURN: {
    label: "Turnering",
    icon: "emoji_events",
    chip: "bg-error-container/40 text-primary",
    bar: "bg-error-container",
  },
};

const difficultyLabels: Record<number, string> = {
  1: "Nybegynner",
  2: "Rekrutt",
  3: "Klubb",
  4: "Regional",
  5: "Nasjonal",
};

const difficultyChip: Record<number, string> = {
  1: "bg-success/15 text-success",
  2: "bg-info/15 text-info",
  3: "bg-warning/15 text-warning",
  4: "bg-error/15 text-error",
  5: "bg-ai/15 text-ai",
};

export default async function OvelserPage() {
  const exercises = await getExercises();

  // Group by pyramid
  const grouped = exercises.reduce((acc, ex) => {
    const level = ex.pyramid ?? "OTHER";
    if (!acc[level]) acc[level] = [];
    acc[level].push(ex);
    return acc;
  }, {} as Record<string, typeof exercises>);

  const pyramidOrder = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

  return (
    <section className="space-y-8">
      {/* Header */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
          Øvelsesbank
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Øvelser
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Fra fysisk grunnlag til turneringsmental — {exercises.length} øvelser
        </p>
      </header>

      {/* Stats-kort */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {pyramidOrder.map((level) => {
          const config = pyramidConfig[level];
          const count = grouped[level]?.length ?? 0;
          return (
            <div
              key={level}
              className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={config?.icon ?? "help"}
                  size={16}
                  className="text-primary/60"
                />
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/50">
                  {config?.label ?? level}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-primary tabular-nums">
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pyramide-visualisering */}
      <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-card">
        <h2 className="text-sm font-bold text-primary">
          Treningsfordeling
        </h2>
        <div className="mt-4 flex flex-col items-center gap-1.5">
          {[...pyramidOrder].reverse().map((level, i) => {
            const config = pyramidConfig[level];
            const width = 100 - i * 15;
            const count = grouped[level]?.length ?? 0;
            return (
              <div
                key={level}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold text-primary ${config?.bar ?? "bg-surface-container"}`}
                style={{ width: `${width}%` }}
              >
                <Icon name={config?.icon ?? "help"} size={14} />
                {config?.label} ({count})
              </div>
            );
          })}
        </div>
      </div>

      {/* Øvelser gruppert etter pyramide */}
      <div className="space-y-8">
        {pyramidOrder.map((level) => {
          const levelExercises = grouped[level] ?? [];
          if (levelExercises.length === 0) return null;

          const config = pyramidConfig[level];

          return (
            <div key={level} className="space-y-3">
              {/* Seksjonsheader */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${config?.chip ?? ""}`}
                >
                  <Icon name={config?.icon ?? "help"} size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-primary">
                    {config?.label}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary/40">
                    {levelExercises.length} øvelser
                  </p>
                </div>
              </div>

              {/* Kort */}
              <div className="grid gap-2">
                {levelExercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="group rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-card transition-all hover:-translate-y-px hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-primary">
                          {ex.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                          {ex.description ?? ex.instructions ?? "Ingen beskrivelse"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 font-mono text-[10px] text-on-surface-variant tabular-nums">
                            <Icon name="schedule" size={12} />
                            {ex.minDurationMinutes === ex.maxDurationMinutes
                              ? `${ex.minDurationMinutes}m`
                              : `${ex.minDurationMinutes}–${ex.maxDurationMinutes}m`}
                          </span>
                          {ex.area && (
                            <span className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant">
                              {ex.area}
                            </span>
                          )}
                          {ex.lPhase && (
                            <span className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant">
                              {ex.lPhase}
                            </span>
                          )}
                          {ex.equipment.length > 0 && (
                            <span className="font-mono text-[9px] text-on-surface-variant/70">
                              {ex.equipment.slice(0, 2).join(", ")}
                              {ex.equipment.length > 2 &&
                                ` +${ex.equipment.length - 2}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          difficultyChip[ex.difficulty] ??
                          "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {difficultyLabels[ex.difficulty] ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
