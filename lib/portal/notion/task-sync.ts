// VERIFY: Notion sync for interne oppgaver
// Kilde: docs/superpowers/specs/2026-05-01-integrasjoner-plan.md

import { queryDatabase } from "./client";
import { logger } from "@/lib/logger";

export interface InternalTask {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  project?: string;
  dueDate?: string;
  tags: string[];
  description?: string;
}

const DATABASE_ID = process.env.NOTION_TASKS_DATABASE_ID;

/** Synker interne oppgaver fra Notion */
export async function syncTasksFromNotion(): Promise<InternalTask[]> {
  if (!DATABASE_ID) {
    logger.warn("[Notion Task Sync] NOTION_TASKS_DATABASE_ID ikke satt");
    return [];
  }

  try {
    const response = await queryDatabase({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        status: {
          does_not_equal: "Done",
        },
      },
    });

    return response.results.map((page: Record<string, unknown>) => {
      const props = page.properties as Record<string, unknown>;
      return {
        id: page.id as string,
        title: (props?.["Name"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "Uten navn",
        status: mapNotionStatus((props?.["Status"] as { status?: { name: string } })?.status?.name),
        priority: mapNotionPriority((props?.["Priority"] as { select?: { name: string } })?.select?.name),
        assignee: (props?.["Assignee"] as { people?: Array<{ name: string }> })?.people?.[0]?.name,
        project: (props?.["Project"] as { select?: { name: string } })?.select?.name,
        dueDate: (props?.["Due Date"] as { date?: { start: string } })?.date?.start,
        tags: (props?.["Tags"] as { multi_select?: Array<{ name: string }> })?.multi_select?.map((t) => t.name) ?? [],
        description: (props?.["Description"] as { rich_text?: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text,
      };
    });
  } catch (err) {
    logger.error("[Notion Task Sync] Feil ved henting:", err);
    return [];
  }
}

/** Oppretter en oppgave i Notion */
export async function createTaskInNotion(task: Omit<InternalTask, "id">): Promise<string | null> {
  if (!DATABASE_ID) {
    logger.warn("[Notion Task Sync] NOTION_TASKS_DATABASE_ID ikke satt");
    return null;
  }

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: task.title } }] },
          Status: { status: { name: "To-do" } },
          Priority: { select: { name: task.priority.charAt(0).toUpperCase() + task.priority.slice(1) } },
          Tags: { multi_select: task.tags.map((t) => ({ name: t })) },
          ...(task.dueDate && { "Due Date": { date: { start: task.dueDate } } }),
          ...(task.description && { Description: { rich_text: [{ text: { content: task.description } }] } }),
        },
      }),
    });

    if (!res.ok) throw new Error(`Notion API error: ${res.status}`);
    const data = await res.json();
    return data.id;
  } catch (err) {
    logger.error("[Notion Task Sync] Feil ved oppretting:", err);
    return null;
  }
}

function mapNotionStatus(status?: string): InternalTask["status"] {
  const map: Record<string, InternalTask["status"]> = {
    "To-do": "todo",
    "In Progress": "in_progress",
    "Review": "review",
    "Done": "done",
  };
  return map[status ?? ""] ?? "todo";
}

function mapNotionPriority(priority?: string): InternalTask["priority"] {
  const map: Record<string, InternalTask["priority"]> = {
    "Low": "low",
    "Medium": "medium",
    "High": "high",
    "Critical": "critical",
  };
  return map[priority ?? ""] ?? "medium";
}
