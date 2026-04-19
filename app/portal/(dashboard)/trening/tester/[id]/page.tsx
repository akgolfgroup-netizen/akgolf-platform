import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Target,
  Dumbbell,
  CheckCircle2,
  Lightbulb,
  Play,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

async function getTestProtocol(id: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("trackman_test_protocols")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

const difficultyLabels: Record<string, string> = {
  nybegynner: "Nybegynner",
  rekrutt: "Rekrutt",
  klubb: "Klubb",
  regional: "Regional",
  nasjonal: "Nasjonal",
  elite: "Elite",
};

const categoryLabels: Record<string, string> = {
  speed: "Hastighet",
  accuracy: "Presisjon",
  distance_control: "Avstandskontroll",
  ball_flight: "Ballflukt",
  consistency: "Konsistens",
  efficiency: "Effektivitet",
  wedge: "Wedge",
  iron: "Jern",
  driver: "Driver",
  benchmark: "Benchmark",
};

export default async function TestDetailPage({ params }: Props) {
  const { id } = await params;
  const protocol = await getTestProtocol(id);

  if (!protocol) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back link */}
      <Link
        href="/portal/trening/tester"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbake til tester
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-surface-container text-on-surface-variant rounded">
                {categoryLabels[protocol.category] ?? protocol.category}
              </span>
              <span className="px-2 py-1 text-xs bg-surface-container text-on-surface rounded">
                {difficultyLabels[protocol.difficulty] ?? protocol.difficulty}
              </span>
              {protocol.is_official && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  Offisiell AK Test
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-on-surface">{protocol.name}</h1>
            <p className="text-on-surface-variant mt-2">{protocol.description}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-card">
            <Clock className="w-5 h-5 text-on-surface mb-2" />
            <p className="text-xl font-bold text-on-surface tabular-nums">{protocol.duration_minutes} min</p>
            <p className="text-sm text-on-surface-variant">Varighet</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-card">
            <Target className="w-5 h-5 text-on-surface mb-2" />
            <p className="text-xl font-bold text-on-surface tabular-nums">{protocol.shots_required}</p>
            <p className="text-sm text-on-surface-variant">Slag</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-card">
            <Dumbbell className="w-5 h-5 text-on-surface mb-2" />
            <p className="text-xl font-bold text-on-surface tabular-nums">{protocol.clubs?.length ?? 0}</p>
            <p className="text-sm text-on-surface-variant">Køller</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-card">
            <CheckCircle2 className="w-5 h-5 text-on-surface mb-2" />
            <p className="text-xl font-bold text-on-surface">
              {protocol.min_category}-{protocol.max_category}
            </p>
            <p className="text-sm text-on-surface-variant">Kategorier</p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-card">
          <h2 className="text-lg font-semibold text-on-surface mb-4">Instruksjoner</h2>
          <div className="space-y-3">
            {protocol.instructions?.split("\n").map((line: string, i: number) => (
              <p key={i} className="text-on-surface-variant text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-card">
          <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            Tips
          </h2>
          <ul className="space-y-2">
            {protocol.tips?.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="text-on-surface">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Equipment */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-card">
          <h2 className="text-lg font-semibold text-on-surface mb-4">Utstyr</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.equipment_required?.map((item: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-medium text-on-surface mt-4 mb-2">Køller</h3>
          <div className="flex flex-wrap gap-2">
            {protocol.clubs?.map((club: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-surface-container text-on-surface rounded-full text-sm"
              >
                {club}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-card">
          <h2 className="text-lg font-semibold text-on-surface mb-4">Metrikker som spores</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.metrics_tracked?.map((metric: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-success/10 text-success rounded-full text-sm"
              >
                {metric.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {protocol.passing_criteria && Object.keys(protocol.passing_criteria).length > 0 && (
            <>
              <h3 className="text-sm font-medium text-on-surface mt-4 mb-2">Bestått-kriterier</h3>
              <div className="space-y-1 text-sm text-on-surface-variant">
                {Object.entries(protocol.passing_criteria).map(([key, value]: [string, unknown]) => {
                  const criteria = value as { min?: number; max?: number; target?: number };
                  return (
                    <p key={key}>
                      <span className="text-on-surface">{key.replace(/_/g, " ")}:</span>{" "}
                      {criteria.min !== undefined && `min ${criteria.min}`}
                      {criteria.max !== undefined && ` max ${criteria.max}`}
                      {criteria.target !== undefined && ` mål ${criteria.target}`}
                    </p>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Start test button */}
      <div className="flex justify-center pt-4">
        <button
          className="flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold rounded-[20px] transition-colors hover:opacity-90"
        >
          <Play className="w-5 h-5" />
          Start Test
        </button>
      </div>
    </div>
  );
}
