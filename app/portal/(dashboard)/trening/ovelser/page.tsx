import {
  Clock,
  Target,
  Dumbbell,
  Zap,
  Mountain,
  Trophy,
  CircleDot,
} from "lucide-react";

export const metadata = {
  title: "Øvelser | AK Golf Portal",
};

// Fetch drills from Supabase
async function getDrills() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("drills")
    .select("*")
    .eq("is_approved", true)
    .order("pyramid_level")
    .order("name");

  if (error) {
    return [];
  }

  return data ?? [];
}

const pyramidLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  FYS: { label: "Fysisk", icon: Dumbbell, color: "text-error bg-error/20" },
  TEK: { label: "Teknikk", icon: Target, color: "text-info bg-info/20" },
  SLAG: { label: "Slag", icon: Zap, color: "text-warning bg-warning/20" },
  SPILL: { label: "Spill", icon: Mountain, color: "text-primary bg-primary/20" },
  TURN: { label: "Turnering", icon: Trophy, color: "text-ai bg-ai/20" },
};

const difficultyColors: Record<string, string> = {
  nybegynner: "bg-success/20 text-success",
  rekrutt: "bg-info/20 text-info",
  klubb: "bg-warning/20 text-warning",
  regional: "bg-warning/20 text-warning",
  nasjonal: "bg-error/20 text-error",
  elite: "bg-ai/20 text-ai",
};

export default async function OvelserPage() {
  const drills = await getDrills();

  interface Drill {
    id: string;
    name: string;
    description: string;
    goal: string;
    pyramid_level: string;
    training_areas: string[];
    duration_minutes: number;
    difficulty: string;
    min_category: string;
    max_category: string;
  }

  // Group by pyramid level
  const grouped = drills.reduce((acc, d) => {
    const level = d.pyramid_level ?? "OTHER";
    if (!acc[level]) acc[level] = [];
    acc[level].push(d as Drill);
    return acc;
  }, {} as Record<string, Drill[]>);

  const pyramidOrder = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-portal-text">Øvelser</h1>
        <p className="text-portal-secondary mt-1">
          Øvelsebibliotek basert på AK Masterdokument — fra fysisk grunnlag til turneringsmental
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pyramidOrder.map((level) => {
          const config = pyramidLabels[level];
          const count = grouped[level]?.length ?? 0;
          const Icon = config?.icon ?? CircleDot;

          return (
            <div
              key={level}
              className="bg-white rounded-xl p-4 border border-portal-border shadow-card"
            >
              <div className={`w-8 h-8 rounded-lg ${config?.color.split(" ")[1]} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${config?.color.split(" ")[0]}`} />
              </div>
              <p className="text-2xl font-bold text-portal-text tabular-nums">{count}</p>
              <p className="text-sm text-portal-secondary">{config?.label ?? level}</p>
            </div>
          );
        })}
      </div>

      {/* Pyramid visualization */}
      <div className="bg-white rounded-xl p-6 border border-portal-border shadow-card">
        <h2 className="text-lg font-semibold text-portal-text mb-4">AK Treningspyramiden</h2>
        <div className="flex flex-col items-center gap-1">
          {[...pyramidOrder].reverse().map((level, i) => {
            const config = pyramidLabels[level];
            const width = 100 - i * 15;
            const count = grouped[level]?.length ?? 0;

            return (
              <div
                key={level}
                className={`${config?.color} px-4 py-2 rounded text-center text-sm font-medium`}
                style={{ width: `${width}%` }}
              >
                {config?.label} ({count} øvelser)
              </div>
            );
          })}
        </div>
      </div>

      {/* Drills by pyramid level */}
      <div className="space-y-8">
        {pyramidOrder.map((level) => {
          const levelDrills: Drill[] = grouped[level] ?? [];
          if (levelDrills.length === 0) return null;

          const config = pyramidLabels[level];
          const Icon = config?.icon ?? CircleDot;

          return (
            <div key={level} className="space-y-4">
              {/* Level header */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${config?.color.split(" ")[1]} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config?.color.split(" ")[0]}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-portal-text">{config?.label}</h2>
                  <p className="text-sm text-portal-secondary">{levelDrills.length} øvelser</p>
                </div>
              </div>

              {/* Drill cards */}
              <div className="grid gap-3">
                {levelDrills.map((drill) => (
                  <div
                    key={drill.id}
                    className="group bg-white border border-portal-border rounded-xl p-4 hover:border-black/8 transition-all duration-300 hover:-translate-y-px hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-portal-text group-hover:text-portal-secondary transition-colors">
                            {drill.name}
                          </h3>
                        </div>
                        <p className="text-sm text-portal-secondary line-clamp-2">
                          {drill.goal ?? drill.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-portal-muted">
                          <span className="flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3" />
                            {drill.duration_minutes} min
                          </span>
                          {drill.training_areas?.length > 0 && (
                            <span>
                              {drill.training_areas.slice(0, 2).join(", ")}
                              {drill.training_areas.length > 2 && ` +${drill.training_areas.length - 2}`}
                            </span>
                          )}
                          <span>
                            Kat. {drill.min_category}-{drill.max_category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            difficultyColors[drill.difficulty] ?? "bg-portal-hover text-portal-muted"
                          }`}
                        >
                          {drill.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
