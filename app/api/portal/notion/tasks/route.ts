import { NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { syncTasksFromNotion, createTaskInNotion } from "@/lib/portal/notion/task-sync";

export async function GET() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tasks = await syncTasksFromNotion();
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const id = await createTaskInNotion({
    title: body.title,
    status: body.status ?? "todo",
    priority: body.priority ?? "medium",
    assignee: body.assignee,
    project: body.project,
    dueDate: body.dueDate,
    tags: body.tags ?? [],
    description: body.description,
  });

  if (!id) {
    return NextResponse.json({ error: "Kunne ikke opprette oppgave" }, { status: 500 });
  }

  return NextResponse.json({ id });
}
