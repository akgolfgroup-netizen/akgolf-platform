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
  "Hvem har forbedret seg mest denne maneden?",
  "Lag en treningsplan for en spiller med HCP 18",
  "Hvilke spillere bor jeg folge opp?",
];

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hei! Jeg er din AI-assistent. Jeg kan hjelpe deg med a analysere spillerdata, lage treningsplaner, og gi innsikt om dine elever. Hva kan jeg hjelpe deg med?",
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
    <div className="flex-1 flex flex-col bg-[var(--color-ink-95)] rounded-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-[var(--color-gold)]" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
                  : "bg-[var(--color-ink-90)] text-white"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-[var(--color-ink-80)] flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[var(--color-ink-40)]" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-[var(--color-gold)]" />
            </div>
            <div className="bg-[var(--color-ink-90)] rounded-2xl px-4 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-ink-50)]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-[var(--color-ink-50)]">
            <Sparkles className="h-4 w-4" />
            <span>Forslag</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3 py-1.5 bg-[var(--color-ink-90)] hover:bg-[var(--color-ink-80)] rounded-full text-sm text-[var(--color-ink-40)] hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-ink-90)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Skriv en melding..."
            className="flex-1 px-4 py-3 bg-[var(--color-ink-90)] border border-[var(--color-ink-80)] rounded-xl text-white placeholder:text-[var(--color-ink-50)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send className="h-5 w-5 text-[var(--color-ink-100)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getSimulatedResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("statistikk")) {
    return "Basert pa dataene dine har jeg analysert statistikken:\n\n- Gjennomsnittlig HCP-forbedring: 2.3 slag\n- Mest aktive spillere: 8 okter siste maned\n- Omrader med storst forbedring: Putting og narspill\n\nVil du se detaljer for en spesifikk spiller?";
  }

  if (lowerInput.includes("forbedret")) {
    return "De tre spillerne som har forbedret seg mest denne maneden:\n\n1. Ola Nordmann - HCP ned fra 18.2 til 15.8 (-2.4)\n2. Kari Hansen - HCP ned fra 24.1 til 22.3 (-1.8)\n3. Per Johansen - HCP ned fra 12.5 til 11.2 (-1.3)\n\nAlle tre har fokusert pa kortspill og putting.";
  }

  if (lowerInput.includes("treningsplan")) {
    return "For en spiller med HCP 18 anbefaler jeg folgende ukentlige plan:\n\n**Mandag:** Driving range - fokus pa setup og grunnlag\n**Onsdag:** Narspill - chipping og pitching\n**Fredag:** Putting-okt (45 min)\n**Helg:** Spille 9-18 hull med fokus pa kurshatering\n\nSkal jeg tilpasse denne til en spesifikk spiller?";
  }

  if (lowerInput.includes("folge opp")) {
    return "Spillere som bor folges opp:\n\n- Anna Svendsen - Ingen aktivitet siste 3 uker\n- Erik Berg - Booket men motte ikke forrige gang\n- Live Eriksen - Har uttrykket frustrasjon over putting\n\nVil du at jeg skal lage oppfolgingsforslag for noen av disse?";
  }

  return "Jeg forstar sporsmalet ditt. For a gi deg best mulig svar, trenger jeg tilgang til spillerdataene. Denne funksjonen er under utvikling.\n\nI mellomtiden kan jeg hjelpe deg med:\n- Generelle treningsrad\n- Strukturering av okter\n- Analyse av spilleutfordringer\n\nHva vil du vite mer om?";
}
