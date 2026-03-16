export interface DataGolfPlayer {
  player_name: string;
  dg_id: number;
  sg_total: number | null;
  sg_ott: number | null;
  sg_app: number | null;
  sg_atg: number | null;
  sg_putt: number | null;
}

const BASE_URL = "https://feeds.datagolf.com";

function getApiKey(): string {
  const key = process.env.DATAGOLF_API_KEY ?? null;
  if (!key) throw new Error("DATAGOLF_API_KEY is not configured");
  return key;
}

export async function fetchPlayerSkillDecomp(tour = "pga"): Promise<DataGolfPlayer[]> {
  const res = await fetch(
    `${BASE_URL}/preds/player-skill-decomp?tour=${tour}&key=${getApiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`DataGolf API feil: ${res.status}`);
  const json = await res.json();
  // API may return array directly or wrapped in { players: [] }
  return Array.isArray(json) ? json : (json.players ?? []);
}
