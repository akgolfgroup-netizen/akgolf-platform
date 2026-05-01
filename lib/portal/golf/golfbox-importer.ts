// VERIFY: GolfBox CSV-import — placeholder. Implementeres når GolfBox API/format er kjent.
// Forventet input: CSV med runder (dato, bane, hull, slag, putter, etc.)

export interface GolfBoxRound {
  date: string;
  course: string;
  totalScore: number;
  par: number;
  holes: Array<{ hole: number; par: number; score: number; putts: number }>;
}

export async function parseGolfBoxCSV(_csvText: string): Promise<GolfBoxRound[]> {
  // TODO: Implementer parsing når format er bekreftet
  return [];
}

export async function importGolfBoxRounds(_userId: string, _rounds: GolfBoxRound[]): Promise<void> {
  // TODO: Lagre til Round-tabellen
}
