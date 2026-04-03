"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "Vis meg statistikk for mine spillere",
  "Hvem har forbedret seg mest denne måneden?",
  "Lag en treningsplan for en spiller med HCP 18",
  "Hvilke spillere bør jeg følge opp?",
];

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hei! Jeg er din AI-assistent. Jeg kan hjelpe deg med å analysere spillerdata, lage treningsplaner, og gi innsikt om dine elever. Hva kan jeg hjelpe deg med?",
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simuler AI-respons (byttes ut med ekte API-kall)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getSimulatedResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col bg-white border border-[var(--color-grey-200)] rounded-2xl overflow-hidden shadow-[var(--shadow-card)] min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-[var(--color-grey-900)]" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 text-[15px]",
                message.role === "user"
                  ? "bg-[var(--color-black)] text-white"
                  : "bg-[var(--color-grey-50)] text-[var(--color-grey-900)] border border-[var(--color-grey-200)]"
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[var(--color-grey-500)]" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
              <Bot className="h-4 w-4 text-[var(--color-grey-900)]" />
            </div>
            <div className="bg-[var(--color-grey-50)] border border-[var(--color-grey-200)] rounded-2xl px-4 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-grey-400)]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-[var(--color-grey-500)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Forslag</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3 py-1.5 bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] border border-[var(--color-grey-200)] rounded-full text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Skriv en melding..."
            className="flex-1 px-4 py-3 bg-white border border-[var(--color-grey-200)] rounded-xl text-[15px] text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-300)] focus:border-[var(--color-grey-300)] transition-[border-color,box-shadow]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-[var(--color-black)] hover:bg-[var(--color-grey-900)] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getSimulatedResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("statistikk")) {
    return "Basert på dataene dine har jeg analysert statistikken:\n\n- Gjennomsnittlig HCP-forbedring: 2.3 slag\n- Mest aktive spillere: 8 økter siste måned\n- Områder med størst forbedring: Putting og nærspill\n\nVil du se detaljer for en spesifikk spiller?";
  }

  if (lowerInput.includes("forbedret")) {
    return "De tre spillerne som har forbedret seg mest denne måneden:\n\n1. Ola Nordmann — HCP ned fra 18.2 til 15.8 (-2.4)\n2. Kari Hansen — HCP ned fra 24.1 til 22.3 (-1.8)\n3. Per Johansen — HCP ned fra 12.5 til 11.2 (-1.3)\n\nAlle tre har fokusert på kortspill og putting.";
  }

  if (lowerInput.includes("treningsplan")) {
    return "For en spiller med HCP 18 anbefaler jeg følgende ukentlige plan:\n\n**Mandag:** Driving range — fokus på setup og grunnlag\n**Onsdag:** Nærspill — chipping og pitching\n**Fredag:** Putting-økt (45 min)\n**Helg:** Spille 9–18 hull med fokus på kurshåndtering\n\nSkal jeg tilpasse denne til en spesifikk spiller?";
  }

  if (lowerInput.includes("følge opp")) {
    return "Spillere som bør følges opp:\n\n- Anna Svendsen — Ingen aktivitet siste 3 uker\n- Erik Berg — Booket men møtte ikke forrige gang\n- Live Eriksen — Har uttrykt frustrasjon over putting\n\nVil du at jeg skal lage oppfølgingsforslag for noen av disse?";
  }

  return "Jeg forstår spørsmålet ditt. For å gi deg best mulig svar, trenger jeg tilgang til spillerdataene. Denne funksjonen er under utvikling.\n\nI mellomtiden kan jeg hjelpe deg med:\n- Generelle treningsråd\n- Strukturering av økter\n- Analyse av spilleutfordringer\n\nHva vil du vite mer om?";
}
