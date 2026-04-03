import { requirePortalUser } from "@/lib/portal/auth";
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
  const _user = await requirePortalUser();
  const protocol = await getTestProtocol(id);

  if (!protocol) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back link */}
      <Link
        href="/portal/trening/tester"
        className="inline-flex items-center gap-2 text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbake til tester
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-[var(--color-grey-100)] text-[var(--color-grey-500)] rounded">
                {categoryLabels[protocol.category] ?? protocol.category}
              </span>
              <span className="px-2 py-1 text-xs bg-[var(--color-grey-100)] text-[var(--color-grey-900)] rounded">
                {difficultyLabels[protocol.difficulty] ?? protocol.difficulty}
              </span>
              {protocol.is_official && (
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                  Offisiell AK Test
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">{protocol.name}</h1>
            <p className="text-[var(--color-grey-500)] mt-2">{protocol.description}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
            <Clock className="w-5 h-5 text-[var(--color-grey-900)] mb-2" />
            <p className="text-xl font-bold text-[var(--color-grey-900)]">{protocol.duration_minutes} min</p>
            <p className="text-sm text-[var(--color-grey-500)]">Varighet</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
            <Target className="w-5 h-5 text-[var(--color-grey-900)] mb-2" />
            <p className="text-xl font-bold text-[var(--color-grey-900)]">{protocol.shots_required}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Slag</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
            <Dumbbell className="w-5 h-5 text-[var(--color-grey-900)] mb-2" />
            <p className="text-xl font-bold text-[var(--color-grey-900)]">{protocol.clubs?.length ?? 0}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Køller</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-grey-900)] mb-2" />
            <p className="text-xl font-bold text-[var(--color-grey-900)]">
              {protocol.min_category}-{protocol.max_category}
            </p>
            <p className="text-sm text-[var(--color-grey-500)]">Kategorier</p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="bg-white rounded-[20px] p-6 border border-[var(--color-grey-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">Instruksjoner</h2>
          <div className="space-y-3">
            {protocol.instructions?.split("\n").map((line: string, i: number) => (
              <p key={i} className="text-[var(--color-grey-500)] text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-[20px] p-6 border border-[var(--color-grey-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Tips
          </h2>
          <ul className="space-y-2">
            {protocol.tips?.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-grey-500)]">
                <span className="text-[var(--color-grey-900)]">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Equipment */}
        <div className="bg-white rounded-[20px] p-6 border border-[var(--color-grey-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">Utstyr</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.equipment_required?.map((item: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[var(--color-grey-100)] text-[var(--color-grey-500)] rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-medium text-[var(--color-grey-900)] mt-4 mb-2">Køller</h3>
          <div className="flex flex-wrap gap-2">
            {protocol.clubs?.map((club: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[var(--color-grey-100)] text-[var(--color-grey-900)] rounded-full text-sm"
              >
                {club}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-[20px] p-6 border border-[var(--color-grey-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">Metrikker som spores</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.metrics_tracked?.map((metric: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-full text-sm"
              >
                {metric.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {protocol.passing_criteria && Object.keys(protocol.passing_criteria).length > 0 && (
            <>
              <h3 className="text-sm font-medium text-[var(--color-grey-900)] mt-4 mb-2">Bestått-kriterier</h3>
              <div className="space-y-1 text-sm text-[var(--color-grey-500)]">
                {Object.entries(protocol.passing_criteria).map(([key, value]: [string, unknown]) => {
                  const criteria = value as { min?: number; max?: number; target?: number };
                  return (
                    <p key={key}>
                      <span className="text-[var(--color-grey-900)]">{key.replace(/_/g, " ")}:</span>{" "}
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
          className="flex items-center gap-3 px-8 py-4 bg-[var(--color-black)] hover:bg-[var(--color-grey-800)] text-white font-semibold rounded-[980px] transition-colors"
        >
          <Play className="w-5 h-5" />
          Start Test
        </button>
      </div>
    </div>
  );
}
