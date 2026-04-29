"use client";

import { useRouter } from "next/navigation";
import {
  CoachHQDarkShell,
  PageHead,
  Button,
} from "@/components/admin/coachhq-dark";
import {
  ClipboardList,
  Zap,
  Edit3,
  CheckCircle2,
  Plus,
  Filter,
  Layers,
} from "lucide-react";
import type {
  ColumnTone,
  KanbanCard,
  KanbanColumn,
} from "./components/kanban-types";
import { KanbanColumnView } from "./components/kanban-column-view";

interface CoachingBoardDarkClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  weekSessionCount: number;
  cardsByColumn: Record<ColumnTone, KanbanCard[]>;
  totalsByColumn: Record<ColumnTone, number>;
}

const COLUMN_META: {
  tone: ColumnTone;
  title: string;
  icon: typeof ClipboardList;
}[] = [
  { tone: "preparation", title: "Forberedelse", icon: ClipboardList },
  { tone: "active", title: "Pågår", icon: Zap },
  { tone: "followup", title: "Etterarbeid", icon: Edit3 },
  { tone: "done", title: "Ferdig", icon: CheckCircle2 },
];

export function CoachingBoardDarkClient({
  user,
  weekSessionCount,
  cardsByColumn,
  totalsByColumn,
}: CoachingBoardDarkClientProps) {
  const router = useRouter();

  const columns: KanbanColumn[] = COLUMN_META.map((meta) => ({
    tone: meta.tone,
    title: meta.title,
    icon: meta.icon,
    count: totalsByColumn[meta.tone],
    cards: cardsByColumn[meta.tone],
  }));

  return (
    <CoachHQDarkShell
      user={user}
      title="Coaching Board"
      meta={`${weekSessionCount} økter denne uken`}
    >
      <PageHead
        eyebrow="Workflow · Drag og slipp"
        title="Coaching Board"
        description="Hver økt går gjennom 4 faser. Dra kort mellom kolonner for å oppdatere status."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/team")}
            >
              Anders + Markus
            </Button>
            <Button
              variant="ghost"
              icon={<Layers className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/denne-uken")}
            >
              Denne uken
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/bookinger/ny")}
            >
              Ny økt
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 items-start">
        {columns.map((col) => (
          <KanbanColumnView
            key={col.tone}
            column={col}
            onAdd={() => router.push("/admin/bookinger/ny")}
            onCardClick={(card) => {
              if (card.href) {
                router.push(card.href);
              } else {
                router.push(`/admin/bookinger?id=${card.id}`);
              }
            }}
          />
        ))}
      </div>
    </CoachHQDarkShell>
  );
}
