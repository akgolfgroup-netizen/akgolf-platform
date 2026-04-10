import { logger } from "@/lib/logger";
import { getNotionClient, notionRetry, queryDatabase } from "./client";

const DB_ID = process.env.NOTION_DB_DRILLS;

/**
 * Drill-data som synces til Notion.
 * Matcher ExerciseDefinition-modellen i Prisma.
 */
interface DrillSyncInput {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  pyramid: string;
  area: string;
  lPhase: string | null;
  difficulty: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  isPublic: boolean;
  isSystemDrill: boolean;
  tags: string[];
  createdById: string | null;
}

/**
 * Syncer en enkelt drill (ExerciseDefinition) til Notion.
 * Oppretter ny side hvis den ikke finnes, oppdaterer ellers.
 * Returnerer Notion page ID.
 */
export async function syncDrillToNotion(
  drill: DrillSyncInput
): Promise<string> {
  if (!DB_ID) {
    logger.info("[Notion] NOTION_DB_DRILLS ikke konfigurert — hopper over sync");
    return "";
  }

  const notion = getNotionClient();

  // Sjekk om drill allerede finnes i Notion via Supabase ID
  const existingPageId = await findDrillPageBySupabaseId(drill.id);

  const properties = buildDrillProperties(drill);

  if (existingPageId) {
    // Oppdater eksisterende side
    await notionRetry(() =>
      notion.pages.update({
        page_id: existingPageId,
        properties,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    );

    logger.info(`[Notion] Drill oppdatert: ${drill.name} (${existingPageId})`);
    return existingPageId;
  }

  // Opprett ny side
  const page = await notionRetry(() =>
    notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
      children: drill.instructions
        ? [
            {
              type: "heading_3" as const,
              heading_3: {
                rich_text: [{ text: { content: "Instruksjoner" } }],
              },
            },
            {
              type: "paragraph" as const,
              paragraph: {
                rich_text: [{ text: { content: drill.instructions } }],
              },
            },
          ]
        : [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  );

  logger.info(`[Notion] Drill opprettet: ${drill.name} (${page.id})`);
  return page.id;
}

/**
 * Batch-syncer alle drills til Notion.
 * Non-blocking — logger feil men kaster ikke.
 */
export async function syncAllDrillsToNotion(
  drills: DrillSyncInput[]
): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  for (const drill of drills) {
    try {
      await syncDrillToNotion(drill);
      synced++;
    } catch (error) {
      failed++;
      console.error(
        `[Notion] Feil ved sync av drill "${drill.name}":`,
        error instanceof Error ? error.message : error
      );
    }
  }

  logger.info(
    `[Notion] Drill batch-sync ferdig: ${synced} synced, ${failed} feilet`
  );
  return { synced, failed };
}

/**
 * Søker etter eksisterende Notion-side basert på Supabase ID.
 */
async function findDrillPageBySupabaseId(
  supabaseId: string
): Promise<string | null> {
  if (!DB_ID) return null;

  try {
    const response = await notionRetry(() =>
      queryDatabase({
        database_id: DB_ID,
        filter: {
          property: "Supabase ID",
          rich_text: {
            equals: supabaseId,
          },
        },
        page_size: 1,
      })
    );

    const results = response.results as Array<{ id: string }>;
    return results.length > 0 ? results[0].id : null;
  } catch (error) {
    console.error(
      "[Notion] Feil ved søk etter drill:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Bygger Notion-properties for en drill.
 */
function buildDrillProperties(drill: DrillSyncInput): Record<string, unknown> {
  return {
    Navn: {
      title: [{ text: { content: drill.name } }],
    },
    Beskrivelse: {
      rich_text: [{ text: { content: drill.description ?? "" } }],
    },
    Pyramide: {
      select: { name: drill.pyramid },
    },
    "L-fase": {
      select: drill.lPhase ? { name: drill.lPhase } : null,
    },
    Vanskelighetsgrad: {
      number: drill.difficulty,
    },
    "SG-omrade": {
      select: { name: drill.area },
    },
    "Min varighet": {
      number: drill.minDurationMinutes,
    },
    "Maks varighet": {
      number: drill.maxDurationMinutes,
    },
    Godkjent: {
      checkbox: drill.isPublic,
    },
    Kilde: {
      select: { name: drill.isSystemDrill ? "System" : "Bruker" },
    },
    Tags: {
      multi_select: drill.tags.map((tag) => ({ name: tag })),
    },
    "Supabase ID": {
      rich_text: [{ text: { content: drill.id } }],
    },
  };
}
