import { logger } from "@/lib/logger";
import { getNotionClient, notionRetry, queryDatabase } from "./client";

const DB_ID = process.env.NOTION_DB_CONTENT;

/**
 * Content-data som synces til Notion.
 * Matcher ContentItem-modellen i Prisma.
 */
interface ContentSyncInput {
  id: string;
  title: string;
  type: "SOME_POST" | "NEWSLETTER" | "ARTICLE";
  status: "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  body: string;
  excerpt: string | null;
  platform: string | null;
  segment: string | null;
  aiGenerated: boolean;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  hashtags: string[];
  imageUrl: string | null;
}

/**
 * Innhold hentet fra Notion for visning i portalen.
 */
interface NotionContentItem {
  notionPageId: string;
  title: string;
  type: string;
  body: string;
  platform: string | null;
  segment: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
}

/** Leservennlige norske navn for innholdstyper */
const TYPE_LABELS: Record<string, string> = {
  SOME_POST: "SoMe-innlegg",
  NEWSLETTER: "Nyhetsbrev",
  ARTICLE: "Artikkel",
};

/** Leservennlige norske navn for status */
const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Utkast",
  REVIEW: "Til gjennomgang",
  APPROVED: "Godkjent",
  PUBLISHED: "Publisert",
  ARCHIVED: "Arkivert",
};

/**
 * Syncer en ContentItem til Notion.
 * Oppretter ny side hvis den ikke finnes, oppdaterer ellers.
 * Returnerer Notion page ID.
 */
export async function syncContentToNotion(
  content: ContentSyncInput
): Promise<string> {
  if (!DB_ID) {
    logger.info(
      "[Notion] NOTION_DB_CONTENT ikke konfigurert — hopper over sync"
    );
    return "";
  }

  const notion = getNotionClient();

  // Sjekk om innholdet allerede finnes
  const existingPageId = await findContentPageBySupabaseId(content.id);
  const properties = buildContentProperties(content);

  if (existingPageId) {
    await notionRetry(() =>
      notion.pages.update({
        page_id: existingPageId,
        properties,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    );

    logger.info(
      `[Notion] Innhold oppdatert: ${content.title} (${existingPageId})`
    );
    return existingPageId;
  }

  // Opprett ny side med body som innhold
  const page = await notionRetry(() =>
    notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
      children: buildContentBlocks(content),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  );

  logger.info(`[Notion] Innhold opprettet: ${content.title} (${page.id})`);
  return page.id;
}

/**
 * Henter publiserte innholdselementer fra Notion.
 * Brukes for a vise Notion-styrt innhold i portalen.
 */
export async function fetchContentFromNotion(): Promise<NotionContentItem[]> {
  if (!DB_ID) {
    logger.info(
      "[Notion] NOTION_DB_CONTENT ikke konfigurert — returnerer tom liste"
    );
    return [];
  }

  try {
    const response = await notionRetry(() =>
      queryDatabase({
        database_id: DB_ID,
        filter: {
          property: "Status",
          select: {
            equals: "Publisert",
          },
        },
        sorts: [
          {
            property: "Publiseringsdato",
            direction: "descending",
          },
        ],
        page_size: 50,
      })
    );

    const results = response.results as NotionPageResult[];
    return results.map(parseNotionContentPage);
  } catch (error) {
    console.error(
      "[Notion] Feil ved henting av innhold:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Notion page-struktur for parsing.
 */
interface NotionPageResult {
  id: string;
  properties: {
    Tittel?: { title: Array<{ plain_text: string }> };
    Type?: { select: { name: string } | null };
    Platform?: { select: { name: string } | null };
    Malgruppe?: { rich_text: Array<{ plain_text: string }> };
    Publiseringsdato?: { date: { start: string } | null };
    "Bilde-URL"?: { url: string | null };
  };
}

/**
 * Parser en Notion-side til internt format.
 */
function parseNotionContentPage(page: NotionPageResult): NotionContentItem {
  const props = page.properties;

  return {
    notionPageId: page.id,
    title:
      props.Tittel?.title?.map((t) => t.plain_text).join("") ?? "Uten tittel",
    type: props.Type?.select?.name ?? "Ukjent",
    body: "", // Body hentes separat via blocks API ved behov
    platform: props.Platform?.select?.name ?? null,
    segment:
      props.Malgruppe?.rich_text?.map((t) => t.plain_text).join("") ?? null,
    publishedAt: props.Publiseringsdato?.date?.start ?? null,
    imageUrl: props["Bilde-URL"]?.url ?? null,
  };
}

/**
 * Soker etter eksisterende Notion-side basert pa Supabase ID.
 */
async function findContentPageBySupabaseId(
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
      "[Notion] Feil ved sok etter innhold:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Bygger Notion-properties for et innholdselement.
 */
function buildContentProperties(
  content: ContentSyncInput
): Record<string, unknown> {
  return {
    Tittel: {
      title: [{ text: { content: content.title } }],
    },
    Type: {
      select: { name: TYPE_LABELS[content.type] ?? content.type },
    },
    Status: {
      select: { name: STATUS_LABELS[content.status] ?? content.status },
    },
    Malgruppe: {
      rich_text: [{ text: { content: content.segment ?? "" } }],
    },
    Platform: content.platform
      ? { select: { name: content.platform } }
      : { select: null },
    "AI-generert": {
      checkbox: content.aiGenerated,
    },
    Publiseringsdato: content.publishedAt
      ? { date: { start: content.publishedAt.toISOString().split("T")[0] } }
      : content.scheduledAt
        ? { date: { start: content.scheduledAt.toISOString().split("T")[0] } }
        : { date: null },
    "Supabase ID": {
      rich_text: [{ text: { content: content.id } }],
    },
    ...(content.imageUrl
      ? { "Bilde-URL": { url: content.imageUrl } }
      : {}),
  };
}

/**
 * Bygger Notion-blokker for innholdets body-tekst.
 */
function buildContentBlocks(
  content: ContentSyncInput
): Array<{ type: string; [key: string]: unknown }> {
  const blocks: Array<{ type: string; [key: string]: unknown }> = [];

  // Excerpt som callout hvis den finnes
  if (content.excerpt) {
    blocks.push({
      type: "callout",
      callout: {
        rich_text: [{ text: { content: content.excerpt } }],
        icon: { emoji: "📝" },
      },
    });
  }

  // Body-tekst delt i paragrafer (Notion har 2000 tegn-grense per block)
  const paragraphs = content.body.split("\n\n").filter(Boolean);

  for (const paragraph of paragraphs) {
    // Del opp lange paragrafer
    const chunks = splitTextByLength(paragraph, 2000);
    for (const chunk of chunks) {
      blocks.push({
        type: "paragraph",
        paragraph: {
          rich_text: [{ text: { content: chunk } }],
        },
      });
    }
  }

  // Hashtags som egen seksjon
  if (content.hashtags.length > 0) {
    blocks.push({ type: "divider", divider: {} });
    blocks.push({
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            text: { content: content.hashtags.map((h) => `#${h}`).join(" ") },
            annotations: { color: "gray" },
          },
        ],
      },
    });
  }

  return blocks;
}

/**
 * Deler tekst i biter av maks gitt lengde, uten a bryte midt i ord.
 */
function splitTextByLength(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    // Finn siste mellomrom innenfor grensen
    let splitAt = remaining.lastIndexOf(" ", maxLength);
    if (splitAt === -1) splitAt = maxLength;

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}
