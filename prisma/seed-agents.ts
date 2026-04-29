/**
 * Seed Agent-tabellen fra AGENT_REGISTRY i lib/portal/agents/types.ts.
 *
 * Idempotent — trygt å kjøre flere ganger. Eksisterende rader oppdateres
 * på name (unique), nye opprettes med nanoid.
 *
 * Kjør:
 *   npm run seed:agents
 *
 * Mot prod (med DIRECT_URL for å unngå pooler-prepared-statements-bug):
 *   DATABASE_URL="$(grep '^DIRECT_URL=' .env.production | cut -d= -f2- | tr -d '"')" npx tsx prisma/seed-agents.ts
 */
import "dotenv/config";
import { nanoid } from "nanoid";
import { prisma } from "../lib/portal/prisma";
import { AGENT_REGISTRY, type AgentName } from "../lib/portal/agents/types";

type AgentTeam = "LEADERSHIP" | "DEV" | "OPS" | "COACHING" | "CONTENT";

const TEAM_BY_CATEGORY: Record<string, AgentTeam> = {
  "post-session": "COACHING",
  data: "COACHING",
  payment: "OPS",
  communication: "OPS",
  admin: "OPS",
};

const MODEL_BY_NAME: Record<AgentName, string> = {
  "post-session-transcriber": "whisper-1+claude-sonnet-4-5",
  "next-session-planner": "claude-sonnet-4-5",
  "usi-focus-updater": "rule-based",
  "test-retest-scheduler": "rule-based",
  "degradation-flagger": "rule-based",
  "payment-collect": "stripe-api",
  cancellation: "stripe-api",
  "coach-payout": "rule-based",
  "booking-confirm": "rule-based",
  "no-show": "rule-based",
  dunning: "rule-based",
  onboarding: "rule-based",
  winback: "rule-based",
  birthday: "rule-based",
  "sponsor-report": "rule-based",
  "degradation-flag": "rule-based",
};

const TOOLS_BY_NAME: Record<AgentName, string[]> = {
  "post-session-transcriber": ["whisper", "anthropic", "supabase-storage"],
  "next-session-planner": ["anthropic", "prisma", "notification"],
  "usi-focus-updater": ["prisma", "notification"],
  "test-retest-scheduler": ["prisma", "notification"],
  "degradation-flagger": ["prisma", "notification"],
  "payment-collect": ["stripe", "prisma"],
  cancellation: ["stripe", "prisma"],
  "coach-payout": ["prisma", "notification"],
  "booking-confirm": ["resend", "twilio", "prisma", "notification"],
  "no-show": ["prisma"],
  dunning: ["resend", "prisma", "notification"],
  onboarding: ["resend", "prisma", "notification"],
  winback: ["resend", "prisma", "notification"],
  birthday: ["resend", "prisma", "notification"],
  "sponsor-report": ["prisma", "react-pdf"],
  "degradation-flag": ["prisma", "notification"],
};

async function main() {
  console.log("Seeder Agent-tabell fra AGENT_REGISTRY...\n");

  let created = 0;
  let updated = 0;

  const entries = Object.entries(AGENT_REGISTRY) as Array<
    [AgentName, (typeof AGENT_REGISTRY)[AgentName]]
  >;

  for (const [name, def] of entries) {
    const team = TEAM_BY_CATEGORY[def.category] ?? "OPS";
    const model = MODEL_BY_NAME[name];
    const tools = TOOLS_BY_NAME[name];
    const skills = def.schedule
      ? [`cron:${def.schedule}`, `category:${def.category}`]
      : [`trigger:${def.trigger}`, `category:${def.category}`];

    const existing = await prisma.agent.findUnique({ where: { name } });

    if (existing) {
      await prisma.agent.update({
        where: { name },
        data: {
          displayName: def.displayName,
          description: def.description,
          team,
          model,
          tools,
          skills,
          updatedAt: new Date(),
        },
      });
      updated += 1;
      console.log(`  oppdatert: ${name}`);
    } else {
      await prisma.agent.create({
        data: {
          id: nanoid(),
          name,
          displayName: def.displayName,
          description: def.description,
          team,
          model,
          tools,
          skills,
          avatarPath: `/avatars/agents/${name}.png`,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });
      created += 1;
      console.log(`  opprettet: ${name}`);
    }
  }

  console.log(`\nFerdig. ${created} opprettet, ${updated} oppdatert.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Feil under seed-agents:", err);
  await prisma.$disconnect();
  process.exit(1);
});
