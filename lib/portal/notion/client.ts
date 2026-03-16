import { Client } from "@notionhq/client";

let notionClient: Client | null = null;

export function getNotionClient(): Client {
  if (!notionClient) {
    if (!process.env.NOTION_API_KEY) {
      throw new Error("NOTION_API_KEY is not set");
    }
    notionClient = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return notionClient;
}

// Notion v5 SDK compatibility: use REST API directly for database queries
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryDatabase(params: {
  database_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sorts?: any;
  page_size?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
  const body: Record<string, unknown> = {};
  if (params.filter) body.filter = params.filter;
  if (params.sorts) body.sorts = params.sorts;
  if (params.page_size) body.page_size = params.page_size;

  const res = await fetch(
    `https://api.notion.com/v1/databases/${params.database_id}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(err.message || `Notion API error ${res.status}`),
      { code: err.code, status: res.status }
    );
  }
  return res.json();
}

// Retry wrapper with exponential backoff for 429 rate limits
export async function notionRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const isRateLimit =
        error instanceof Error &&
        "status" in error &&
        (error as { status: number }).status === 429;
      if (!isRateLimit || attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
