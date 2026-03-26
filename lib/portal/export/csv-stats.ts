interface RoundStatRow {
  date: Date;
  courseName: string | null;
  totalScore: number | null;
  totalPutts: number | null;
  fairwaysHit: number | null;
  greensInRegulation?: number | null;
  girPct?: number | null;
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
}

export function roundStatsToCsv(stats: RoundStatRow[]): string {
  const headers = [
    "Dato",
    "Bane",
    "Score",
    "Putts",
    "Fairways",
    "GIR %",
    "SG Total",
    "SG Off Tee",
    "SG Approach",
    "SG Around Green",
    "SG Putting",
  ];

  const rows = stats.map((s) =>
    [
      s.date.toISOString().split("T")[0],
      escapeCsvField(s.courseName ?? ""),
      s.totalScore ?? "",
      s.totalPutts ?? "",
      s.fairwaysHit ?? "",
      s.girPct ?? "",
      s.sgTotal ?? "",
      s.sgOffTheTee ?? "",
      s.sgApproach ?? "",
      s.sgAroundTheGreen ?? "",
      s.sgPutting ?? "",
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
