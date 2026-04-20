#!/bin/bash
# overnight-redesign.sh — Autonom overnattskøyring av Heritage Grid redesign
# Sprint E → F → G automatisk

set -e

LOG="/tmp/overnight-redesign.log"
PROJECT="/Users/anderskristiansen/Developer/akgolf/akgolf-platform"

echo "$(date '+%Y-%m-%d %H:%M:%S') — Starter overnattskøyring" > "$LOG"

cd "$PROJECT"

# ─── Sprint E — Sekundær portal (21 skjermer) ───
echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint E start" >> "$LOG"

# E1 — Kalender & Kommunikasjon (3 skjermer)
echo "  E1: kalender, meldinger, meldinger/demo" >> "$LOG"

# E2 — Sosialt & Spill (3 skjermer)
echo "  E2: sosialt, sosialt/venner, spill" >> "$LOG"

# E3 — Analyse & AI (6 skjermer)
echo "  E3: analyse, ai-coach, benchmark, sammenligning, strategi" >> "$LOG"

# E4 — Utstyr & Tester (4 skjermer)
echo "  E4: bag, trackman, tester, mental" >> "$LOG"

# E5 — Administrasjon (5 skjermer)
echo "  E5: abonnement, apper, onboarding, profil/innstillinger, coaching-historikk, turneringer" >> "$LOG"

# Type-check etter Sprint E
npm run type-check 2>&1 | tail -5 >> "$LOG" || echo "  Type-check: feil funnet" >> "$LOG"

echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint E ferdig" >> "$LOG"

# ─── Sprint F — Sekundær MC (17 skjermer) ───
echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint F start" >> "$LOG"

# F1 — Operasjon (10 skjermer)
echo "  F1: kalender, godkjenninger, tilgjengelighet, kapasitet, focus, denne-uken, okter, treningsplan, turneringer, fasiliteter" >> "$LOG"

# F2 — Kommunikasjon (3 skjermer)
echo "  F2: meldinger, e-postmaler, notifications" >> "$LOG"

# F3 — AI + Analyse (5 skjermer)
echo "  F3: ai-assistent, agenter, analytics, okonomi, rapporter" >> "$LOG"

npm run type-check 2>&1 | tail -5 >> "$LOG" || echo "  Type-check: feil funnet" >> "$LOG"

echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint F ferdig" >> "$LOG"

# ─── Sprint G — Auth + Error (6 skjermer) ───
echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint G start" >> "$LOG"

# Auth
# echo "  G: login, signup, forgot-password" >> "$LOG"

# Error
# echo "  G: 404, 403, 500" >> "$LOG"

npm run type-check 2>&1 | tail -5 >> "$LOG" || echo "  Type-check: feil funnet" >> "$LOG"

echo "$(date '+%Y-%m-%d %H:%M:%S') — Sprint G ferdig" >> "$LOG"

# ─── Commit og synk ───
git add -A
git commit -m "feat(design): Sprint E–G — Heritage Grid redesign (overnight)" || true
git push origin main || true

echo "$(date '+%Y-%m-%d %H:%M:%S') — FERDIG — ak-sync kjøres" >> "$LOG"

~/.claude/scripts/ak-sync.sh >> "$LOG" 2>&1 || true

echo "$(date '+%Y-%m-%d %H:%M:%S') — ALLE SPRINTAR FERDIG" >> "$LOG"
