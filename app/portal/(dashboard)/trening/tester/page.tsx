import { requirePortalUser } from "@/lib/portal/auth";
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
    console.error("Error fetching protocols:", error);
    return [];
  }

  return data ?? [];
}

export default async function TesterPage() {
  const user = await requirePortalUser();
  const protocols = await getTestProtocols();

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
        <h1 className="text-2xl font-bold text-white">Trackman Tester</h1>
        <p className="text-[#A3A3A3] mt-1">
          100 standardiserte tester for å måle og utvikle ditt spill
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
          <p className="text-3xl font-bold text-white">{protocols.length}</p>
          <p className="text-sm text-[#A3A3A3]">Tester tilgjengelig</p>
        </div>
        <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
          <p className="text-3xl font-bold text-white">{categories.length}</p>
          <p className="text-sm text-[#A3A3A3]">Kategorier</p>
        </div>
        <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
          <p className="text-3xl font-bold text-[#B07D4F]">0</p>
          <p className="text-sm text-[#A3A3A3]">Fullførte tester</p>
        </div>
        <div className="bg-[#112240] rounded-lg p-4 border border-[#1E3A5F]">
          <p className="text-3xl font-bold text-[#22C55E]">-</p>
          <p className="text-sm text-[#A3A3A3]">Siste test</p>
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
