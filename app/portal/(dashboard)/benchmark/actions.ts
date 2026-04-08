"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getSkillDecompositions,
  getApproachSkill,
  type SkillDecomposition,
  type ApproachSkill,
} from "@/lib/portal/datagolf/client";

// ── Types ──

export interface PlayerSGProfile {
  roundCount: number;
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  approachDistances: {
    approach100: number | null;
    approach150: number | null;
    approach200: number | null;
    approach200Plus: number | null;
  };
}

export interface ProPlayerSearchResult {
  dgId: number;
  name: string;
  sgTotal: number | null;
  sgOtt: number | null;
  sgApp: number | null;
  sgArg: number | null;
  sgPutt: number | null;
}

export interface ProComparison {
  pro: ProPlayerSearchResult;
  proApproach: ApproachSkill | null;
}

// ── Actions ──

/**
 * Henter gjennomsnittlig SG-profil for innlogget bruker
 * basert pa de siste 20 rundene.
 */
export async function getPlayerSGProfile(): Promise<PlayerSGProfile | null> {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  
  const { data: rounds } = await supabase
    .from("RoundStats")
    .select("sgTotal, sgOffTheTee, sgApproach, sgAroundTheGreen, sgPutting, approach100, approach150, approach200, approach200Plus")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(20);

  if (!rounds || rounds.length === 0) return null;

  function avg(vals: (number | null)[]): number | null {
    const valid = vals.filter((v): v is number => v !== null);
    return valid.length > 0
      ? valid.reduce((a, b) => a + b, 0) / valid.length
      : null;
  }

  return {
    roundCount: rounds.length,
    sgTotal: avg(rounds.map((r) => r.sgTotal)),
    sgOffTheTee: avg(rounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(rounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(rounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(rounds.map((r) => r.sgPutting)),
    approachDistances: {
      approach100: avg(rounds.map((r) => r.approach100)),
      approach150: avg(rounds.map((r) => r.approach150)),
      approach200: avg(rounds.map((r) => r.approach200)),
      approach200Plus: avg(rounds.map((r) => r.approach200Plus)),
    },
  };
}

/**
 * Soeker etter proffspillere i DataGolf etter navn.
 * Returnerer topp 10 treff.
 */
export async function getProPlayers(
  query: string
): Promise<ProPlayerSearchResult[]> {
  await requirePortalUser();

  if (!query || query.length < 2) return [];

  let decompositions: SkillDecomposition[];
  try {
    decompositions = await getSkillDecompositions("pga");
  } catch {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const matches = decompositions
    .filter((p) => p.player_name.toLowerCase().includes(normalizedQuery))
    .slice(0, 10)
    .map((p) => ({
      dgId: p.dg_id,
      name: p.player_name,
      sgTotal: p.sg_total,
      sgOtt: p.sg_ott,
      sgApp: p.sg_app,
      sgArg: p.sg_arg,
      sgPutt: p.sg_putt,
    }));

  return matches;
}

/**
 * Sammenligner brukerens SG-profil med en proff.
 * Returnerer proffens SG-verdier og approach-data.
 */
export async function getProComparison(
  dgId: number
): Promise<ProComparison | null> {
  await requirePortalUser();

  let decompositions: SkillDecomposition[];
  let approachData: ApproachSkill[];

  try {
    [decompositions, approachData] = await Promise.all([
      getSkillDecompositions("pga"),
      getApproachSkill("l24"),
    ]);
  } catch {
    return null;
  }

  const proSkill = decompositions.find((p) => p.dg_id === dgId);
  if (!proSkill) return null;

  const proApproach = approachData.find((a) => a.dg_id === dgId) ?? null;

  return {
    pro: {
      dgId: proSkill.dg_id,
      name: proSkill.player_name,
      sgTotal: proSkill.sg_total,
      sgOtt: proSkill.sg_ott,
      sgApp: proSkill.sg_app,
      sgArg: proSkill.sg_arg,
      sgPutt: proSkill.sg_putt,
    },
    proApproach,
  };
}
