export type KColumn = "preparation" | "active" | "followup" | "done";

export type KCard = {
  id: string;
  studentName: string;
  studentInitials: string;
  avatarColor: string;
  when: string;
  focus: string;
  /** 0–100 */
  progress?: number;
  /** "3/5 steg" eller "Lukket fre 18:24" osv. */
  metaLabel: string;
  /** ekstra ikoner i footer */
  attachments?: number;
  comments?: number;
  /** spesielle states */
  state?: "live" | "urgent" | "ready" | "done" | "archive";
  /** høyre-stilt ikon (lucide-navn) */
  trailingIcon?:
    | "check-circle"
    | "alert-triangle"
    | "circle-dot"
    | "file-text"
    | "sparkles"
    | "clock"
    | "mail"
    | "user"
    | "users"
    | "check"
    | "archive";
};

export type KColumnData = {
  key: KColumn;
  title: string;
  count: number;
  icon: "clipboard-list" | "zap" | "edit-3" | "check-circle-2";
  cards: KCard[];
};
