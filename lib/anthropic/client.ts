// Anthropic Claude SDK lazy-init helper.
// Speiler mønsteret i lib/portal/email/resend.ts og lib/portal/stripe.ts:
// - SDK instansieres ved første kall, ikke ved modul-load
// - Build-tid page-data-collection treffer ikke en SDK-konstruksjon
//   med tom env-var
// - Kaster eksplisitt feil ved manglende env (ingen graceful fallback —
//   Anthropic-routes har ingen meningsfull degradering uten API-key)

import Anthropic from "@anthropic-ai/sdk";

let _anthropic: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  // Trim defensivt — Vercel-env-vars har av og til trailing whitespace
  // eller literal \n fra historisk CLI/dashboard-input
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ikke konfigurert");
  }
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey });
  }
  return _anthropic;
}
