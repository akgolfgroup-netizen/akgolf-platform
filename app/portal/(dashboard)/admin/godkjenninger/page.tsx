import { GodkjenningerPageHeader } from "@/components/admin/godkjenninger/page-header";
import { ApprovalInbox } from "@/components/admin/godkjenninger/inbox";
import { ApprovalDetail } from "@/components/admin/godkjenninger/detail";
import { AutomationCard } from "@/components/admin/godkjenninger/automation-card";
import {
  APPROVAL_ROWS,
  DETAIL_INFO_CELLS,
  DETAIL_CHECKLIST,
  FEEDBACK_QUOTE,
  AI_FLAG_TEXT,
  AUTOMATION_BLURB,
} from "@/components/admin/godkjenninger/mock-data";

// TODO: koble til ekte data
// - approvals: ny modell ApprovalRequest med type, requestedBy, status og payload
// - automatiseringsregler: ApprovalRule (treshold, ekspertise-krav, etc.)
// - audit: AuditLog for godkjenninger
// - SHIFT+ENTER hurtig-godkjenn: client component med keybind

export default function GodkjenningerPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <GodkjenningerPageHeader
        eyebrow="Operasjon · Godkjenninger"
        title="Inbox for ting som krever deg"
        subtitle="Video-feedback fra coacher, refusjoner, kontrakter, rabatter — alt som skal igjennom deg før det går ut. Hovedregel: avgjør innen 24 t."
      />

      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "360px 1fr" }}>
        <ApprovalInbox rows={APPROVAL_ROWS} />
        <ApprovalDetail
          feedbackQuote={FEEDBACK_QUOTE}
          aiFlagText={AI_FLAG_TEXT}
          infoCells={DETAIL_INFO_CELLS}
          checklist={DETAIL_CHECKLIST}
        />
      </div>

      <AutomationCard blurb={AUTOMATION_BLURB} />
    </div>
  );
}
