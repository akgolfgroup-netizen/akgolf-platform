---
name: akgolf-branch-workflow
description: Git-workflow og worktree-manager for AK Golf Platform. Bruk denne skillen når Anders spør om branches, worktrees, merge, PR, git-status, hvilken branch han skal jobbe i, hvordan bytte branch, hvordan merge til main, eller når han rapporterer ferdig arbeid fra Claude Code og vil vite neste steg. Trigger ved fraser som "ferdig med X", "hva nå", "merge dette", "neste branch", "push og PR", "er dette klart for lansering", "git-status", "hvilken worktree", "commit og push".
---

# AK Golf Branch Workflow

## Worktrees i ~/Developer/akgolf/
akgolf-platform → main
akgolf-go-live → feature/go-live-checklist
akgolf-booking-slot-fix → feature/booking-slot-fix
akgolf-heritage-design → feature/heritage-design-rewrite
akgolf-coachhq-rebrand → feature/coachhq-rebrand
akgolf-facility-booking → feature/facility-booking
akgolf-drill-of-the-day → feature/drill-of-the-day
akgolf-trackman-insights → feature/trackman-ai-insights
akgolf-stripe-idempotency → feature/stripe-idempotency
akgolf-waitlist → feature/waitlist
akgolf-web-push → feature/web-push
akgolf-feature-flags → feature/feature-flags
akgolf-realtime-board → feature/realtime-mission-board

## Prioriteringer
P1 (før lansering): go-live-checklist → booking-slot-fix → heritage-design-rewrite
P2 (etter P1): coachhq-rebrand, facility-booking, web-push, drill-of-the-day, trackman-ai-insights, stripe-idempotency, waitlist
P3 (etter lansering): feature-flags, realtime-mission-board

## Merge-kommando
cd ~/Developer/akgolf/akgolf-platform
git merge feature/[branch] --no-ff -m "feat: merge [branch]"
git push origin main

## Daglig start
cd ~/Developer/akgolf/akgolf-platform && git pull && tail -20 WORKLOG.md

## Avslutt alltid med
git add -A && git commit -m "[type]: [beskrivelse]" && git push origin feature/[branch]
