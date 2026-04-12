import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { TestProtocolList } from "./components/test-protocol-list";

export const metadata = {
  title: "Trackman Tester | AK Golf Portal",
};

// Fetch from Supabase directly since it's not in Prisma schema
async function getTestProtocols() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("trackman_test_protocols")
    .select("*")
    .order("category")
    .order("difficulty");

  if (error) {
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return [];
    }
    return [];
  }

  return data ?? [];
}

async function getUserTestStats(userId: string) {
  const supabase = await createServerSupabase();

  const { data: results, error } = await supabase
    .from("TestResult")
    .select("testNumber, createdAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error || !results) {
    return { completedCount: 0, lastTestLabel: null };
  }

  // Antall unike tester brukeren har gjennomfort
  const uniqueTests = new Set(results.map((r) => r.testNumber));
  const completedCount = uniqueTests.size;

  const lastTestLabel = results.length > 0
    ? new Date(results[0].createdAt).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "short",
      })
    : null;

  return { completedCount, lastTestLabel };
}

export default async function TesterPage() {
  const user = await requirePortalUser();
  const [protocols, testStats] = await Promise.all([
    getTestProtocols(),
    getUserTestStats(user.id),
  ]);

  // Group by category
  const grouped = protocols.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, typeof protocols>);

  const categories = [
    { key: "speed", label: "Hastighet", description: "Mål og utvikle køllehastighet" },
    { key: "accuracy", label: "Presisjon", description: "Forbedre retning og spredning" },
    { key: "distance_control", label: "Avstandskontroll", description: "Konsistent lengde med alle køller" },
    { key: "ball_flight", label: "Ballflukt", description: "Optimaliser launch, spin og kurve" },
    { key: "consistency", label: "Konsistens", description: "Repeterbare slag under press" },
    { key: "efficiency", label: "Effektivitet", description: "Maksimer kraftoverføring" },
    { key: "wedge", label: "Wedge", description: "Scoring fra 50-100 meter" },
    { key: "iron", label: "Jern", description: "Presisjon med alle jern" },
    { key: "driver", label: "Driver", description: "Teeslag-spesifikke tester" },
    { key: "benchmark", label: "Benchmark", description: "Offisielle fremgangstester" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-portal-text">Trackman Tester</h1>
        <p className="text-portal-secondary mt-1">
          100 standardiserte tester for å måle og utvikle ditt spill
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-portal-border shadow-card">
          <p className="text-3xl font-bold text-portal-text tabular-nums">{protocols.length}</p>
          <p className="text-sm text-portal-secondary">Tester tilgjengelig</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-portal-border shadow-card">
          <p className="text-3xl font-bold text-portal-text tabular-nums">{categories.length}</p>
          <p className="text-sm text-portal-secondary">Kategorier</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-portal-border shadow-card">
          <p className="text-3xl font-bold text-portal-text tabular-nums">{testStats.completedCount}</p>
          <p className="text-sm text-portal-secondary">Fullførte tester</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-portal-border shadow-card">
          <p className="text-3xl font-bold text-success tabular-nums">{testStats.lastTestLabel ?? "-"}</p>
          <p className="text-sm text-portal-secondary">Siste test</p>
        </div>
      </div>

      {/* Test list */}
      <TestProtocolList
        categories={categories}
        grouped={grouped}
        userCategory={user.subscriptionTier === "ELITE" ? "A" : user.subscriptionTier === "PRO" ? "C" : "F"}
      />
    </div>
  );
}
