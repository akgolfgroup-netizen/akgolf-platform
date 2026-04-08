"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

// Mock suggested questions
const suggestedQuestions = [
  { icon: Users, text: "Hvem har ikke booket på 2 uker?", category: "elever" },
  { icon: Calendar, text: "Hva er kapasiteten neste uke?", category: "booking" },
  { icon: TrendingUp, text: "Hvordan går det med Olav Hansen?", category: "analyse" },
  { icon: BarChart3, text: "Generer månedsrapport for april", category: "rapport" },
  { icon: Lightbulb, text: "Hvilke elever trenger oppfølging?", category: "anbefaling" },
  { icon: Clock, text: "Når er neste ledige time?", category: "booking" },
];

// Mock conversation
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
}

export default function AIAssistentPage() {
  const { toggle } = useMCSidebar();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hei! Jeg er din AI-assistent for AK Golf Academy. Jeg kan hjelpe deg med å:\n\n• Finne informasjon om elever og bookinger\n• Analysere trender og statistikk\n• Generere rapporter\n• Gi anbefalinger for oppfølging\n\nHva kan jeg hjelpe deg med i dag?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Hvem har ikke booket på 2 uker?":
          "Jeg fant 3 elever som ikke har booket på 2 uker eller mer:\n\n1. **Erik Johansen** - Siste booking: 18. mars (3 uker siden)\n2. **Anders Pettersen** - Siste booking: 10. mars (1 måned siden)\n3. **Lisa Nilsen** - Siste booking: 15. mars (3 uker siden)\n\nVil du at jeg skal generere en oppfølgings-e-post til disse elevene?",
        "Hva er kapasiteten neste uke?":
          "Kapasitet neste uke (uke 17):\n\n• **Anders Kristiansen**: 32/40 timer (80%)\n• **Maria Hansen**: 18/24 timer (75%)\n• **Total kapasitet**: 50/64 timer (78%)\n\nDet er 14 ledige timer neste uke. Mest ledig onsdag ettermiddag og fredag formiddag.",
        "Hvordan går det med Olav Hansen?":
          "**Olav Hansen** - Statusrapport:\n\n📊 **Siste 30 dager:**\n• 8 bookinger (gjennomsnitt 2 per uke)\n• 94% oppmøte (kun 1 no-show)\n• Siste økt: 2 dager siden\n• Neste økt: I morgen kl 10:00\n\n📈 **Fremskritt:**\n• Handicap: -2.4 (fra 18.2 til 15.8)\n• Fokusområde: Putting og wedge-spill\n• Tilfredshet: Høy (basert på tilbakemeldinger)\n\n💡 **Anbefaling:** Olav er på et godt spor. Vurder å introdusere mer kurs-spill i neste fase.",
        "Generer månedsrapport for april":
          "Jeg har generert en månedsrapport for april 2024. Her er høydepunktene:\n\n📊 **Nøkkeltall:**\n• Omsetning: 203 000 kr (+12% vs mars)\n• Aktive elever: 128 (+8 nye)\n• Gjennomførte økter: 145\n• Gj.snittlig oppmøte: 92%\n\n👥 **Elevutvikling:**\n• 5 elever nådd mål-handicap\n• 3 elever trenger oppfølging (inaktive)\n\n💰 **Økonomi:**\n• Ubetalte fakturaer: 18 600 kr\n• Refusjoner: 1 800 kr (0.9%)\n\nVil du ha rapporten eksportert til PDF?",
        "Hvilke elever trenger oppfølging?":
          "Jeg har identifisert 5 elever som trenger oppfølging:\n\n🔴 **Kritisk (1):**\n• Anders Pettersen - Ingen aktivitet på 2 måneder\n\n🟡 **Oppfølging (4):**\n• Erik Johansen - 3 uker siden siste booking\n• Lisa Nilsen - 3 uker siden siste booking\n• Magnus Olsen - 2 uker siden, avlyste siste time\n• Emma Solberg - Synkende frekvens (4→2 økter/mnd)\n\n💡 **Anbefalt handling:** Send personlig e-post til Anders og tilbud om ny vurderingstime.",
        "Når er neste ledige time?":
          "Neste ledige timer:\n\n**I dag:**\n• 16:00 - Anders Kristiansen\n• 17:00 - Maria Hansen\n\n**I morgen:**\n• 09:00 - Anders Kristiansen\n• 10:00 - Anders Kristiansen\n• 14:00 - Maria Hansen\n• 15:00 - Maria Hansen\n\nVil du booke en av disse tidene?",
      };

      const responseContent =
        responses[text] ||
        "Jeg forstår spørsmålet ditt. Dessverre har jeg ikke tilgang til den spesifikke informasjonen akkurat nå. Kan du prøve å omformulere spørsmålet, eller velge en av de foreslåtte spørringene nedenfor?";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <MCTopbar
        title="AI Assistent"
        subtitle="Stil spørsmål om data, elever og analytikk"
        onMenuClick={toggle}
      />

      <div className="p-5 h-[calc(100vh-64px)]">
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 h-full flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#154212] to-[#0d2e0c]"
                      : "bg-[#f7f3ea] border border-[#c2c9bb]/50"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-[#1c1c16]" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    msg.role === "assistant"
                      ? "bg-[#f7f3ea] rounded-tl-sm"
                      : "bg-[#154212] text-white rounded-tr-sm"
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#c2c9bb]/30">
                      <button className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-[#8a9385] ml-auto">
                        {msg.timestamp.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#154212] to-[#0d2e0c] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#f7f3ea] rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#154212] animate-spin" />
                  <span className="text-sm text-[#6b7366]">Tenker...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-4 py-3 border-t border-[#c2c9bb]/30">
              <p className="text-xs text-[#8a9385] mb-2">Foreslåtte spørsmål:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(q.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#f7f3ea] hover:bg-[#e8e4db] text-[#6b7366] hover:text-[#1c1c16] rounded-full transition-colors border border-[#c2c9bb]/50"
                    >
                      <Icon className="w-3 h-3" />
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-[#c2c9bb]/30">
            <div className="flex items-end gap-2 bg-white border border-[#c2c9bb]/50 rounded-xl p-2 focus-within:border-[#154212] focus-within:ring-2 focus-within:ring-[#154212]/20 transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#154212] to-[#0d2e0c]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Stil et spørsmål om akademiet, elevene eller data..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#1c1c16] placeholder:text-[#8a9385] outline-none resize-none py-3"
                style={{ minHeight: "20px", maxHeight: "120px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-lg bg-[#154212] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#8a9385] mt-2 text-center">
              AI-assistenten kan gjøre feil. Viktig informasjon bør dobbeltsjekkes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
