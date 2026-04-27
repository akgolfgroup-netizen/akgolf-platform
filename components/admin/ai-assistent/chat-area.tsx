import {
  ArrowUp,
  Check,
  CheckSquare,
  Copy,
  Edit,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { FollowUpTable } from "./follow-up-table";
import { SUGGESTION_CHIPS } from "./mock-data";

export function ChatArea() {
  return (
    <section className="flex flex-col overflow-hidden rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23]">
      <header className="flex items-center gap-3.5 border-b border-[#1a4a3a] px-6 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-accent/30 to-[#AF52DE]/20">
          <Sparkles className="h-[18px] w-[18px] text-accent" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-bold text-white">Coach Copilot</div>
          <div className="mt-px font-mono text-[10px] tracking-[0.06em] text-white/50">
            VET OM ALLE 42 SPILLERE · 28 ØKTER UKE · 14 MND HISTORIKK
          </div>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-black/20 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.06em] text-white/70">
          CLAUDE · COACH-MODE
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-6 py-[22px]">
        {/* user msg 1 */}
        <UserBubble>
          Hei. Hvem trenger jeg å følge opp denne uken? Tenker både på spillere
          som har plateauet og de jeg ikke har snakket med på en stund.
        </UserBubble>

        {/* AI msg 1 */}
        <AiBubble label="Analyse · spillere som krever oppfølging">
          <p>
            Jeg har sett på siste 30d med data. <strong>Tre spillere skiller seg ut</strong>:
          </p>
          <FollowUpTable />
          <p className="mt-2.5">
            <strong>Forslag</strong>: Send Lina en personlig velkomst og book inn
            første økt. Ring foreldre Berg for samtale om Aksel. Per er godkjent
            for refusjon — bruk det som anledning til å høre om alt er ok.
          </p>
          <ActionsBar>
            <ActionPill
              primary
              icon={<CheckSquare className="h-3 w-3" strokeWidth={1.8} />}
            >
              Lag tasks for alle 5
            </ActionPill>
            <ActionPill icon={<MessageCircle className="h-3 w-3" strokeWidth={1.8} />}>
              Skriv velkomst til Lina
            </ActionPill>
            <ActionPill icon={<Phone className="h-3 w-3" strokeWidth={1.8} />}>
              Ring foreldre Berg
            </ActionPill>
            <ActionPill icon={<Copy className="h-3 w-3" strokeWidth={1.8} />}>
              Kopier
            </ActionPill>
          </ActionsBar>
        </AiBubble>

        {/* user 2 */}
        <UserBubble>
          Bra. Lag de 5 tasks. Og send Lina en velkomstmelding — gjør den varm men kort.
        </UserBubble>

        {/* AI 2 */}
        <AiBubble
          label="Utført · 5 tasks opprettet, utkast klart"
          icon={<Check className="h-[11px] w-[11px]" strokeWidth={2.2} />}
        >
          <p>
            5 tasks lagt i Mission Board (sortert «denne uken»). Velkomst til
            Lina ligger som utkast — godkjenn før send:
          </p>
          <div className="mt-2.5 rounded-[10px] border border-white/[0.06] bg-black/20 p-3.5">
            <div className="mb-2 text-[13px] font-bold text-white">
              Utkast til Lina Holm
            </div>
            <p className="text-[13px] leading-[1.6] text-white/85">
              «Hei Lina! Velkommen til Akademiet — jeg så at du fullførte
              onboarding for et par uker siden. Skulle bare høre hvordan det går,
              og om du har lyst til å booke første økt? Vi kan starte rolig —
              kanskje en kartleggings-time på Skullerud så vi får et godt
              utgangspunkt? Bare svar her, så finner vi en tid. Ha en fin uke!
              — Erik»
            </p>
          </div>
          <ActionsBar>
            <ActionPill
              primary
              icon={<Send className="h-3 w-3" strokeWidth={1.8} />}
            >
              Send som er
            </ActionPill>
            <ActionPill icon={<Edit className="h-3 w-3" strokeWidth={1.8} />}>
              Rediger
            </ActionPill>
            <ActionPill icon={<RotateCcw className="h-3 w-3" strokeWidth={1.8} />}>
              Skriv ny variant
            </ActionPill>
          </ActionsBar>
        </AiBubble>
      </div>

      <footer className="border-t border-[#1a4a3a] px-[22px] py-4">
        <div className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/25 px-3.5 py-3">
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Spør om spillere, økonomi, bookinger eller be om utkast…"
            className="flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
          />
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-ink"
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
            Forslag
          </span>
          {SUGGESTION_CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/70 hover:border-accent/30 hover:text-white"
            >
              {c}
            </button>
          ))}
        </div>
      </footer>
    </section>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[14px] rounded-br-[5px] border border-accent/20 bg-gradient-to-b from-accent/[0.18] to-accent/10 px-[18px] py-3.5 text-[13.5px] leading-[1.6] text-white">
        {children}
      </div>
    </div>
  );
}

function AiBubble({
  children,
  label,
  icon,
}: {
  children: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="max-w-[80%] rounded-[14px] rounded-bl-[5px] border border-white/[0.06] bg-white/[0.04] px-[18px] py-3.5 text-[13.5px] leading-[1.6] text-[#E6EAE8]">
        <div className="mb-2 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-accent">
          {icon ?? <Sparkles className="h-[11px] w-[11px]" strokeWidth={1.8} />}
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

function ActionsBar({ children }: { children: React.ReactNode }) {
  return <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>;
}

function ActionPill({
  icon,
  children,
  primary,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11.5px] " +
        (primary
          ? "border-accent/30 bg-accent/15 text-accent"
          : "border-white/[0.06] bg-white/[0.04] text-white/85")
      }
    >
      {icon}
      {children}
    </button>
  );
}
