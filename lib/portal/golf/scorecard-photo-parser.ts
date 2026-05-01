// VERIFY: Scorecard-foto OCR — placeholder. Krever GPT-4 Vision eller lignende.
// Forventet input: Bilde av scorecard -> output: hull, par, score, putts

export interface ScorecardHole {
  hole: number;
  par: number;
  score: number;
  putts?: number;
}

export async function parseScorecardPhoto(_imageBase64: string): Promise<ScorecardHole[]> {
  // TODO: Integrer med GPT-4 Vision eller annen OCR-tjeneste
  return [];
}
