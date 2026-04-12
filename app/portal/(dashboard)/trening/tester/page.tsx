import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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
  const [completedCount, lastResult] = await Promise.all([
    prisma.testResult.count({ where: { userId } }),
    prisma.testResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const lastTestLabel = lastResult
    ? lastResult.createdAt.toLocaleDateString("nb-NO", { day: "numeric", month: "short" })
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
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Trackman Tester</h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          100 standardiserte tester for å måle og utvikle ditt spill
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
          <p className="text-3xl font-bold text-[var(--color-grey-900)]">{protocols.length}</p>
          <p className="text-sm text-[var(--color-grey-500)]">Tester tilgjengelig</p>
        </div>
        <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
          <p className="text-3xl font-bold text-[var(--color-grey-900)]">{categories.length}</p>
          <p className="text-sm text-[var(--color-grey-500)]">Kategorier</p>
        </div>
        <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
          <p className="text-3xl font-bold text-[var(--color-grey-900)]">{testStats.completedCount}</p>
          <p className="text-sm text-[var(--color-grey-500)]">Fullførte tester</p>
        </div>
        <div className="bg-white rounded-[20px] p-4 border border-[var(--color-grey-200)]">
          <p className="text-3xl font-bold text-[var(--color-success)]">{testStats.lastTestLabel ?? "-"}</p>
          <p className="text-sm text-[var(--color-grey-500)]">Siste test</p>
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
