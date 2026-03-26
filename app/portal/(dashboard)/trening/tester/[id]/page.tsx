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
  const user = await requirePortalUser();
  const protocol = await getTestProtocol(id);

  if (!protocol) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back link */}
      <Link
        href="/portal/trening/tester"
        className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbake til tester
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-[#1E3A5F] text-[#A3A3A3] rounded">
                {categoryLabels[protocol.category] ?? protocol.category}
              </span>
              <span className="px-2 py-1 text-xs bg-[#B07D4F]/20 text-[#B07D4F] rounded">
                {difficultyLabels[protocol.difficulty] ?? protocol.difficulty}
              </span>
              {protocol.is_official && (
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                  Offisiell AK Test
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{protocol.name}</h1>
            <p className="text-[#A3A3A3] mt-2">{protocol.description}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
            <Clock className="w-5 h-5 text-[#B07D4F] mb-2" />
            <p className="text-xl font-bold text-white">{protocol.duration_minutes} min</p>
            <p className="text-sm text-[#A3A3A3]">Varighet</p>
          </div>
          <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
            <Target className="w-5 h-5 text-[#B07D4F] mb-2" />
            <p className="text-xl font-bold text-white">{protocol.shots_required}</p>
            <p className="text-sm text-[#A3A3A3]">Slag</p>
          </div>
          <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
            <Dumbbell className="w-5 h-5 text-[#B07D4F] mb-2" />
            <p className="text-xl font-bold text-white">{protocol.clubs?.length ?? 0}</p>
            <p className="text-sm text-[#A3A3A3]">Køller</p>
          </div>
          <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
            <CheckCircle2 className="w-5 h-5 text-[#B07D4F] mb-2" />
            <p className="text-xl font-bold text-white">
              {protocol.min_category}-{protocol.max_category}
            </p>
            <p className="text-sm text-[#A3A3A3]">Kategorier</p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="bg-[#112240] rounded-lg p-6 border border-[#1E3A5F]">
          <h2 className="text-lg font-semibold text-white mb-4">Instruksjoner</h2>
          <div className="space-y-3">
            {protocol.instructions?.split("\n").map((line: string, i: number) => (
              <p key={i} className="text-[#A3A3A3] text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#112240] rounded-lg p-6 border border-[#1E3A5F]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Tips
          </h2>
          <ul className="space-y-2">
            {protocol.tips?.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#A3A3A3]">
                <span className="text-[#B07D4F]">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Equipment */}
        <div className="bg-[#112240] rounded-lg p-6 border border-[#1E3A5F]">
          <h2 className="text-lg font-semibold text-white mb-4">Utstyr</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.equipment_required?.map((item: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#1E3A5F] text-[#A3A3A3] rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-medium text-white mt-4 mb-2">Køller</h3>
          <div className="flex flex-wrap gap-2">
            {protocol.clubs?.map((club: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#B07D4F]/20 text-[#B07D4F] rounded-full text-sm"
              >
                {club}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-[#112240] rounded-lg p-6 border border-[#1E3A5F]">
          <h2 className="text-lg font-semibold text-white mb-4">Metrikker som spores</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.metrics_tracked?.map((metric: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-sm"
              >
                {metric.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {protocol.passing_criteria && Object.keys(protocol.passing_criteria).length > 0 && (
            <>
              <h3 className="text-sm font-medium text-white mt-4 mb-2">Bestått-kriterier</h3>
              <div className="space-y-1 text-sm text-[#A3A3A3]">
                {Object.entries(protocol.passing_criteria).map(([key, value]: [string, unknown]) => {
                  const criteria = value as { min?: number; max?: number; target?: number };
                  return (
                    <p key={key}>
                      <span className="text-white">{key.replace(/_/g, " ")}:</span>{" "}
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
          className="flex items-center gap-3 px-8 py-4 bg-[#B07D4F] hover:bg-[#8E6340] text-white font-semibold rounded-lg transition-colors"
        >
          <Play className="w-5 h-5" />
          Start Test
        </button>
      </div>
    </div>
  );
}
