import { getNotionClient, notionRetry } from "./client";

const DB_ID = process.env.NOTION_DB_PLAYER_PROFILES;

interface CreatePlayerProfileInput {
  name: string;
  email: string;
  phone?: string;
  startDate: Date;
}

/**
 * Create a player profile page in the Notion Spillerprofiler database.
 * Returns the Notion page ID.
 */
export async function createPlayerProfile(
  input: CreatePlayerProfileInput
): Promise<string> {
  if (!DB_ID) {
    console.log(
      "[Notion] NOTION_DB_PLAYER_PROFILES not configured — skipping profile creation"
    );
    return "";
  }

  const notion = getNotionClient();

  const page = await notionRetry(() =>
    notion.pages.create({
      parent: { database_id: DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: input.name } }],
        },
        Email: {
          email: input.email,
        },
        ...(input.phone
          ? {
              Phone: {
                phone_number: input.phone,
              },
            }
          : {}),
        "Start Date": {
          date: { start: input.startDate.toISOString().split("T")[0] },
        },
        Status: {
          select: { name: "Aktiv" },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  );

  console.log(
    `[Notion] Player profile created for ${input.email}: ${page.id}`
  );
  return page.id;
}

/**
 * Append coaching session summary to an existing player profile page.
 */
export async function appendCoachingSessionToProfile(
  notionPageId: string,
  session: {
    date: string;
    serviceName: string;
    keyPoints: string[];
    focusAreas: string[];
    actionItems: string[];
  }
): Promise<void> {
  if (!notionPageId) return;

  const notion = getNotionClient();

  await notionRetry(() =>
    notion.blocks.children.append({
      block_id: notionPageId,
      children: [
        {
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: `${session.date} — ${session.serviceName}`,
                },
              },
            ],
          },
        },
        ...(session.keyPoints.length > 0
          ? [
              {
                type: "heading_3" as const,
                heading_3: {
                  rich_text: [{ text: { content: "Nøkkelpunkter" } }],
                },
              },
              ...session.keyPoints.map((point) => ({
                type: "bulleted_list_item" as const,
                bulleted_list_item: {
                  rich_text: [{ text: { content: point } }],
                },
              })),
            ]
          : []),
        ...(session.focusAreas.length > 0
          ? [
              {
                type: "heading_3" as const,
                heading_3: {
                  rich_text: [{ text: { content: "Fokusområder" } }],
                },
              },
              ...session.focusAreas.map((area) => ({
                type: "bulleted_list_item" as const,
                bulleted_list_item: {
                  rich_text: [{ text: { content: area } }],
                },
              })),
            ]
          : []),
        ...(session.actionItems.length > 0
          ? [
              {
                type: "heading_3" as const,
                heading_3: {
                  rich_text: [{ text: { content: "Handlingspunkter" } }],
                },
              },
              ...session.actionItems.map((item) => ({
                type: "to_do" as const,
                to_do: {
                  rich_text: [{ text: { content: item } }],
                  checked: false,
                },
              })),
            ]
          : []),
        {
          type: "divider" as const,
          divider: {},
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  );

  console.log(`[Notion] Coaching session appended to profile ${notionPageId}`);
}
