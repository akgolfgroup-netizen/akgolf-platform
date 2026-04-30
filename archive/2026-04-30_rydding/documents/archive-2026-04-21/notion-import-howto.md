# Notion-import: Master TODO 2026

Denne guiden importerer `docs/notion-import-master-todo.json` til Notion som en database.

## Forutsetninger

- En Notion-workspace du har admin-tilgang til
- Filen `docs/notion-import-master-todo.json` i prosjektet (41 oppgaver)

## Framgangsmåte

### 1. Opprett ny side i Notion

- Gå til riktig workspace (f.eks. "AK Golf Group")
- Opprett ny side: `Master TODO 2026`

### 2. Importer JSON

Notion støtter ikke direkte JSON-import i UI-et. Bruk en av disse metodene:

#### Metode A — Notion API (anbefalt)

Lag en database manuelt først med disse egenskapene:

| Egenskap | Type |
|----------|------|
| ID | Number |
| Task | Title |
| Category | Select (Research, Design, Feature, AI/MCP, DataViz, Booking, Auth, Marketing, Admin, DevOps, Analytics, Operations) |
| Priority | Select (High, Normal, Low) |
| Status | Select (Done, In Progress, Pending) |
| DependsOn | Text |
| EstimatedHours | Number |
| Notes | Text |

Deretter kjør et engangsskript:

```bash
# Sett Notion-token (https://www.notion.so/my-integrations)
export NOTION_API_KEY="secret_xxxx"
export NOTION_DATABASE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Bruk et ad-hoc script (lag evt. scripts/notion-import-master-todo.ts)
node -e '
const { Client } = require("@notionhq/client");
const data = require("./docs/notion-import-master-todo.json");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

(async () => {
  for (const row of data) {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        ID: { number: row.ID },
        Task: { title: [{ text: { content: row.Task } }] },
        Category: { select: { name: row.Category } },
        Priority: { select: { name: row.Priority } },
        Status: { select: { name: row.Status } },
        DependsOn: { rich_text: [{ text: { content: row.DependsOn || "" } }] },
        EstimatedHours: { number: row.EstimatedHours },
        Notes: { rich_text: [{ text: { content: row.Notes } }] },
      },
    });
    console.log("Imported:", row.ID, row.Task);
  }
})();
'
```

#### Metode B — CSV via Notion Import

Konverter JSON til CSV først (vi har allerede `docs/MASTER_TODO_2026.csv`):

1. I Notion, klikk `... → Import → CSV`
2. Last opp `docs/MASTER_TODO_2026.csv`
3. Notion oppretter en ny database automatisk med kolonnene fra CSV

### 3. Organiser visninger

Opprett tre views:

- **Alle** — sortert etter ID
- **Gjenstående** — filter: Status ≠ Done
- **Etter kategori** — gruppert etter Category

### 4. Link til prosjekt

Legg lenke til Notion-databasen i:
- `CLAUDE.md` under "Referanser"
- Repository README (hvis offentlig)

## Oppdatere databasen

Når MASTER_TODO endres i CSV:
1. Oppdater `docs/MASTER_TODO_2026.csv`
2. Regenerer JSON: manuell eller via script
3. Oppdater Notion-oppføringer (API eller manuelt)

## Ansvar

Anders Kristiansen eier Notion-databasen. AI-agenter oppdaterer kun CSV + JSON i repo.
