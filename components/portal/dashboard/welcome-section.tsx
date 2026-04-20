import { colors } from "@/lib/design-tokens";

interface WelcomeSectionProps {
  userName: string | null;
  tier: string;
  memberSince: string | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "God morgen";
  if (hour >= 12 && hour < 17) return "God ettermiddag";
  return "God kveld";
}

const tierLabel: Record<string, string> = {
  VISITOR: "Gratis",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

export function WelcomeSection({
  userName,
  tier,
  memberSince,
}: WelcomeSectionProps) {
  const firstName = userName?.split(" ")[0] ?? "spiller";

  return (
    <div className="flex flex-col gap-2">
      <h1
        className="text-[32px] font-bold tracking-tight"
        style={{ color: colors.primary.dark }}
      >
        {getGreeting()}, <span className="font-extrabold">{firstName}</span>
      </h1>
      <div className="inline-flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-secondary-fixed-text">
          {tierLabel[tier] ?? tier}
        </span>
        {memberSince && (
          <span className="text-sm text-on-surface-variant">
            Medlem siden {memberSince}
          </span>
        )}
      </div>
    </div>
  );
}
