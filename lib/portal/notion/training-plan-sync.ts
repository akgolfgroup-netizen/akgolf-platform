import { logger } from "@/lib/logger";
import { getNotionClient, notionRetry, queryDatabase } from "./client";

const DB_ID = process.env.NOTION_DB_TRAINING_PLANS;

/**
 * Uke-data med okter som synces som rich text blocks i Notion.
 */
interface WeekData {
  weekNumber: number;
  weekStart: string; // ISO-dato
  focus: string | null;
  volumeLabel: string | null;
  sessions: SessionData[];
}

interface SessionData {
  dayOfWeek: number;
  title: string;
  description: string | null;
  durationMinutes: number | null;
  focusArea: string | null;
}

/**
 * Treningsplan-data som synces til Notion.
 * Matcher TrainingPlan + TrainingPlanWeek + TrainingPlanSession i Prisma.
 */
interface TrainingPlanSyncInput {
  id: string;
  title: string;
  description: string | null;
  studentName: string;
  periodType: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  aiGenerated: boolean;
  weeks: WeekData[];
}

const DAY_NAMES: Record<number, string> = {
  0: "Sondag",
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
  6: "Lordag",
};

/**
 * Syncer en treningsplan til Notion.
 * Oppretter plan-side med uker og okter som rich text blocks.
 * Returnerer Notion page ID.
 */
export async function syncTrainingPlanToNotion(
  plan: TrainingPlanSyncInput
): Promise<string> {
  if (!DB_ID) {
    logger.info(
      "[Notion] NOTION_DB_TRAINING_PLANS ikke konfigurert — hopper over sync"
    );
    return "";
  }

  const notion = getNotionClient();

  // Sjekk om planen allerede finnes
  const existingPageId = await findPlanPageBySupabaseId(plan.id);
  const properties = buildPlanProperties(plan);

  if (existingPageId) {
    // Oppdater properties og erstatt innhold
    await notionRetry(() =>
      notion.pages.update({
        page_id: existingPageId,
        properties,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    );

    // Slett eksisterende blokker og legg inn oppdaterte
    await replacePageContent(existingPageId, buildPlanBlocks(plan));

    logger.info(
      `[Notion] Treningsplan oppdatert: ${plan.title} (${existingPageId})`
    );
    return existingPageId;
  }

  // Opprett ny side med innhold
  const page = await notionRetry(() =>
    notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
      children: buildPlanBlocks(plan),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  );

  logger.info(`[Notion] Treningsplan opprettet: ${plan.title} (${page.id})`);
  return page.id;
}

/**
 * Søker etter eksisterende Notion-side basert på Supabase ID.
 */
async function findPlanPageBySupabaseId(
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
      "[Notion] Feil ved sok etter treningsplan:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Erstatter alt innhold på en Notion-side.
 * Sletter eksisterende blokker og legger inn nye.
 */
async function replacePageContent(
  pageId: string,
  newBlocks: NotionBlock[]
): Promise<void> {
  const notion = getNotionClient();

  // Hent eksisterende blokker
  const existing = await notionRetry(() =>
    notion.blocks.children.list({ block_id: pageId })
  );

  // Slett alle eksisterende blokker
  for (const block of existing.results) {
    const blockWithId = block as { id: string };
    await notionRetry(() => notion.blocks.delete({ block_id: blockWithId.id }));
  }

  // Legg til nye blokker (maks 100 per kall)
  const chunks = chunkArray(newBlocks, 100);
  for (const chunk of chunks) {
    await notionRetry(() =>
      notion.blocks.children.append({
        block_id: pageId,
        children: chunk,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    );
  }
}

/**
 * Notion block-type for intern bruk.
 */
type NotionBlock = {
  type: string;
  [key: string]: unknown;
};

/**
 * Bygger Notion-properties for en treningsplan.
 */
function buildPlanProperties(
  plan: TrainingPlanSyncInput
): Record<string, unknown> {
  const totalMinutes = plan.weeks.reduce(
    (sum, week) =>
      sum +
      week.sessions.reduce((s, sess) => s + (sess.durationMinutes ?? 0), 0),
    0
  );
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  return {
    Tittel: {
      title: [{ text: { content: plan.title } }],
    },
    Spiller: {
      rich_text: [{ text: { content: plan.studentName } }],
    },
    Uker: {
      number: plan.weeks.length,
    },
    Periode: {
      date: {
        start: plan.startDate.toISOString().split("T")[0],
        end: plan.endDate.toISOString().split("T")[0],
      },
    },
    Uketype: {
      select: { name: plan.periodType },
    },
    "Timer totalt": {
      number: totalHours,
    },
    "AI-generert": {
      checkbox: plan.aiGenerated,
    },
    Aktiv: {
      checkbox: plan.isActive,
    },
    Startdato: {
      date: { start: plan.startDate.toISOString().split("T")[0] },
    },
    "Supabase ID": {
      rich_text: [{ text: { content: plan.id } }],
    },
  };
}

/**
 * Bygger Notion rich text blocks for planens uker og okter.
 */
function buildPlanBlocks(plan: TrainingPlanSyncInput): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  // Beskrivelse overstst
  if (plan.description) {
    blocks.push({
      type: "paragraph",
      paragraph: {
        rich_text: [{ text: { content: plan.description } }],
      },
    });
    blocks.push({ type: "divider", divider: {} });
  }

  // Bygg blokker per uke
  for (const week of plan.weeks) {
    const weekTitle = `Uke ${week.weekNumber}${week.focus ? ` — ${week.focus}` : ""}`;

    blocks.push({
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: weekTitle } }],
      },
    });

    if (week.volumeLabel) {
      blocks.push({
        type: "callout",
        callout: {
          rich_text: [{ text: { content: `Volum: ${week.volumeLabel}` } }],
          icon: { emoji: "📊" },
        },
      });
    }

    // Sorter okter etter ukedag
    const sortedSessions = [...week.sessions].sort(
      (a, b) => a.dayOfWeek - b.dayOfWeek
    );

    for (const session of sortedSessions) {
      const dayName = DAY_NAMES[session.dayOfWeek] ?? `Dag ${session.dayOfWeek}`;
      const duration = session.durationMinutes
        ? ` (${session.durationMinutes} min)`
        : "";

      blocks.push({
        type: "heading_3",
        heading_3: {
          rich_text: [
            { text: { content: `${dayName}: ${session.title}${duration}` } },
          ],
        },
      });

      if (session.description) {
        blocks.push({
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: session.description } }],
          },
        });
      }

      if (session.focusArea) {
        blocks.push({
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [
              {
                text: { content: `Fokus: ${session.focusArea}` },
                annotations: { bold: true },
              },
            ],
          },
        });
      }
    }

    blocks.push({ type: "divider", divider: {} });
  }

  return blocks;
}

/**
 * Deler en array i chunks av gitt storrelse.
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
