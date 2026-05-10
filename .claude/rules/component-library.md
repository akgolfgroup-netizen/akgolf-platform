# Komponentbibliotek — AK Golf HQ

Sjekk ALLTID denne filen FØR du bygger en ny komponent.
Gjenbruk eksisterende — aldri bygg duplikater.

## CoachHQ Dark — admin-primitiver (Brand Guide V2.0, eneste sannhetskilde fra 2026-05-02)

Tre tidligere admin-design-trær (`mc-v2/`, `coachhq/dark-cockpit`, `coachhq-dark/`) er konsolidert til **`coachhq-dark/`**. Bruk kun denne for nye admin-flater.

| Eksport | Fil | Bruk |
|---|---|---|
| `CoachHQDarkShell` | components/admin/coachhq-dark/CoachHQDarkShell.tsx | Wrapper for alle admin-route-pages |
| `CoachHQDarkRail` | components/admin/coachhq-dark/CoachHQDarkRail.tsx | Smal ikon-rail (56px) |
| `CoachHQDarkNav` | components/admin/coachhq-dark/CoachHQDarkNav.tsx | Navnliste (200px) |
| `CoachHQDarkTopbar` | components/admin/coachhq-dark/CoachHQDarkTopbar.tsx | Topbar med crumbs + handlinger |
| `PageHead` | components/admin/coachhq-dark/PageHead.tsx | Eyebrow + tittel + beskrivelse + actions |
| `Card`, `CardHeader` | components/admin/coachhq-dark/Primitives.tsx | Standard mørke kort |
| `Button` | components/admin/coachhq-dark/Primitives.tsx | variant: default \| primary \| accent \| ghost |
| `Pill` | components/admin/coachhq-dark/Primitives.tsx | tone: default/accent/success/warn/danger/info/violet (+ aliaser) |
| `KpiCard` | components/admin/coachhq-dark/Primitives.tsx | Stor KPI med tone, ikon og sub |
| `StatCard` | components/admin/coachhq-dark/Primitives.tsx | Kompakt label + verdi |
| `Empty` | components/admin/coachhq-dark/Primitives.tsx | Tom-tilstand for kort |
| `Table<T>` | components/admin/coachhq-dark/Primitives.tsx | Generisk dark-tabell |
| `Eyebrow`, `MonoLabel` | components/admin/coachhq-dark/Primitives.tsx | JetBrains Mono labels |
| `TOKENS` | components/admin/coachhq-dark/Primitives.tsx | bg/card/line/primary/accent/success/warn/danger/blue/violet |
| `ActivityItem` + `ActivityItemData` | components/admin/coachhq-dark/ActivityItem.tsx | Aktivitets-rad med ikon + tittel + when |
| `avatarColor`, `getInitials` | components/admin/coachhq-dark/avatar.ts | Avatar-hjelpere |

## Markedsside Kontakt v2 (Brand Guide V2.0 — pixel-rebuild 2026-04-29)
Pixel-naer implementasjon av `public/design-reference/handoff-2026-04-27/screens/g10-kontakt.html`.
Default visning av `/kontakt`. Bruker `/api/contact`-endepunktet for skjema-submit.
| Komponent | Fil | Bruk |
|---|---|---|
| ContactPageClient | components/website-v2/contact-page-client.tsx | Orchestrator: hero, quick-tiles, form+sidebar, lokasjoner, FAQ |
| ContactHero | components/website-v2/contact/contact-hero.tsx | "Vi svarer samme dag." hero med Fraunces-italic |
| ContactQuickTiles | components/website-v2/contact/contact-quick-tiles.tsx | 4 quick-cards (e-post, Anders telefon, Markus telefon, Instagram) |
| ContactFormSection | components/website-v2/contact/contact-form-section.tsx | Container med form-card + sidebar i 1.5fr/1fr grid |
| ContactFormCard | components/website-v2/contact/contact-form-card.tsx | Hovedskjema: navn, kontakt, lokasjon, melding, samtykke |
| ContactTopicGrid | components/website-v2/contact/contact-topic-grid.tsx | 6 topic-pills (Bli spiller, Junior, Booking, Bedrift, Presse, Annet) |
| ContactSidebar | components/website-v2/contact/contact-sidebar.tsx | Mork CTA-kort + info-rader (org-nr, coacher, generell e-post) |
| ContactLocations | components/website-v2/contact/contact-locations.tsx | Kart-tile + lokasjonskort for Gamle Fredrikstad GK |
| ContactFaq | components/website-v2/contact/contact-faq.tsx | 5 vanlige spsorsmal i toggle-liste |

## Booking Wizard-komponenter (delt mellom markedsside og portal)
| Komponent | Fil | Bruk |
|---|---|---|
| BookingWizard | components/booking/booking-wizard.tsx | Steg-container med progress, hovedkomponent |
| ServiceSelector | components/booking/service-selector.tsx | Velg tjeneste (kort med pris/varighet) |
| BookingDatePicker | components/booking/date-picker.tsx | Kalender med ledige dager |
| TimeSlots | components/booking/time-slots.tsx | Tidslots som pills |
| BookingSummary | components/booking/booking-summary.tsx | Oppsummering + kundedetaljer + betal |
| useBookingWizard | components/booking/use-booking-wizard.ts | Hook med all booking-state og logikk |
| booking-types | components/booking/booking-types.ts | Felles typer og hjelpefunksjoner |

## Portal Dashboard Bento (v1 — Brand Guide V2.0, valgt 2026-04-27)
Pixel-nær implementasjon av `public/design-reference/handoff-2026-04-27/screens/dashboard-v1-bento.html`.
Aktiveres via `?dashboard=bento` eller cookie `dashboard=bento`. Default fortsatt `DashboardClientV3`.
| Komponent | Fil | Bruk |
|---|---|---|
| DashboardBentoClient | app/portal/(dashboard)/dashboard-bento-client.tsx | Orchestrator: 12-kolonne grid + alle bento-kort |
| HeroCard | components/portal/dashboard-bento/hero-card.tsx | Mørk gradient + animert lime-prikk + headline + 4 hero-stats |
| NextSessionCard | components/portal/dashboard-bento/next-session-card.tsx | Hvit kort, fokus-pill (lime), "Åpne økt"/"Flytt"-knapper |
| KpiCard | components/portal/dashboard-bento/kpi-card.tsx | Gjenbrukbar KPI med line/bars sparkline + accent-variant (lime bakgrunn) |
| SgCard | components/portal/dashboard-bento/sg-card.tsx | Strokes Gained-barer +/- rundt 0-linje (Tee/Approach/Around green/Putting) |
| TrendCard | components/portal/dashboard-bento/trend-card.tsx | Handicap 12-mnd SVG med gradient-fill + dot på siste punkt |
| AiInsightCard | components/portal/dashboard-bento/ai-insight-card.tsx | Lilla AI-card med rec-bullets, fokus-pills og kilder |
| StreakCard | components/portal/dashboard-bento/streak-card.tsx | Mørk gradient med 14-dagers streak-prikker + personlig rekord |
| ShortcutsRow | components/portal/dashboard-bento/shortcuts-row.tsx | 6 hurtighandlinger med lucide-ikoner (Logg runde, Ukesplan, etc.) |

## Portal Dashboard-komponenter (legacy v3)
| Komponent | Fil | Bruk |
|---|---|---|
| NumberTicker | components/portal/dashboard/number-ticker.tsx | Animert tall som teller opp |
| StatCard | components/portal/dashboard/stat-card.tsx | Nøkkeltall med label/kontekst |
| StrokesGainedCard | components/portal/dashboard/strokes-gained-card.tsx | Horisontale SG-barer |
| HandicapSparklineCard | components/portal/dashboard/handicap-sparkline-card.tsx | Handicap-utvikling graf |
| TrainingPlanCard | components/portal/dashboard/training-plan-card.tsx | Ukesvelger + øvelsesliste |
| CoachInsightCard | components/portal/dashboard/coach-insight-card.tsx | AI-innsikt med sparkles |
| NextBookingCard | components/portal/dashboard/next-booking-card.tsx | Neste booking |
| PlayerProfileCompactCard | components/portal/dashboard/player-profile-compact-card.tsx | Spillerprofil mini |
| GreetingHeader | components/portal/dashboard/greeting-header.tsx | "Hei, Erik" header |
| QuickActionsRow | components/portal/dashboard/quick-actions-row.tsx | Hurtighandlinger |
| WeekRingsGrid | components/portal/dashboard/week-rings-grid.tsx | Ukens aktivitetsringer |
| DailyChecklistCard | components/portal/dashboard/daily-checklist-card.tsx | Daglig sjekkliste |
| SGBreakdownCard | components/portal/dashboard/sg-breakdown-card.tsx | Individuelt SG-kort per omrade (Tee, Approach, etc.) |
| SGFocusCard | components/portal/dashboard/sg-focus-card.tsx | Fokusomrade med prioritet og anbefalinger |
| PlayerCategoryCard | components/portal/dashboard/player-category-card.tsx | Spillerkategori: kode, snitt, HCP, total SG |
| TrainingDistributionCard | components/portal/dashboard/training-distribution-card.tsx | Treningspyramide bar chart per periode |

## Portal Booking-komponenter
| Komponent | Fil | Bruk |
|---|---|---|
| BookingStatusBadge | components/portal/booking/booking-status-badge.tsx | Status-badges semantisk |
| WaitlistCard | app/portal/(dashboard)/bookinger/venteliste/waitlist-card.tsx | Waitlist-entry kort med posisjon, NOTIFIED-state og meld-av-knapp |

## Portal Layout-komponenter
| Komponent | Fil | Bruk |
|---|---|---|
| Sidebar | components/portal/layout/sidebar.tsx | Hovednavigasjon (6 items) |
| Topbar | components/portal/layout/topbar.tsx | Topbar med tabs + profil-dropdown |
| SubNavTabs | components/portal/layout/sub-nav-tabs.tsx | Gjenbrukbar tab/pills navigasjon |

## Portal Profil-komponenter
| Komponent | Fil | Bruk |
|---|---|---|
| HandicapChart | components/portal/profil/handicap-chart.tsx | Handicap-historikk graf |
| SettingsLinks | components/portal/profil/settings-links.tsx | Profil-innstillinger lenker |

## Portal Sosialt-komponenter
| Komponent | Fil | Bruk |
|---|---|---|
| AddFriendDialog | components/portal/social/add-friend-dialog.tsx | Søk og legg til venn |
| PendingRequests | components/portal/social/pending-requests.tsx | Ventende venneforespørsler |

## Portal Abonnement-komponenter
| Komponent | Fil | Bruk |
|---|---|---|
| UpgradeOptions | components/portal/subscription/upgrade-options.tsx | Oppgraderingskort med planer |

## Portal Statistikk V2 (Brand Guide V2.0 — pixel-rebuild 2026-04-28)
Pixel-naer implementasjon av `public/design-reference/handoff-2026-04-27/screens/stats-v2.html`,
`a13-sammenligning.html` og `a14-strategi.html`. Default visning av `/portal/statistikk`.
| Komponent | Fil | Bruk |
|---|---|---|
| StatsV2Client | components/portal/statistikk/v2/stats-v2-client.tsx | Orchestrator: 12-kolonne grid med page header, hero benchmark, KPI-rad, fokus-callout, SG-fordeling, HCP-trend, sammenligning, AK-pyramide og rundetabell |
| PeriodTabs | components/portal/statistikk/v2/period-tabs.tsx | Periodevelger pill-gruppe (30d/90d/sesong/1y) som skifter `?period=`-query |
| StatsHeroBenchmark | components/portal/statistikk/v2/stats-hero-benchmark.tsx | Mork gradient-kort med animert percentil-dial og lede-tekst |
| FocusCallout | components/portal/statistikk/v2/focus-callout.tsx | Fokus-callout med lime ikon-block + "Lag plan"-CTA |
| SgDistributionCard | components/portal/statistikk/v2/sg-distribution-card.tsx | Strokes Gained-fordeling med +/- barer rundt 0-linje |
| HcpTrendCard | components/portal/statistikk/v2/hcp-trend-card.tsx | Handicap-historikk SVG med gradient-fill, lime accent-prikk + 30/90d prognose |
| CompareCard | components/portal/statistikk/v2/compare-card.tsx | Sammenligningskort med tre stablete barer (Du / Peer / Pyramide) + percentil-chip + delta |
| AkPyramidCard | components/portal/statistikk/v2/ak-pyramid-card.tsx | A-K talentutviklingsmodell med uthevet "din rad" + 4 stat-bokser |
| RoundsTable | components/portal/statistikk/v2/rounds-table.tsx | Runde-for-runde tabell (10 siste) med dato, score, FIR/GIR/putts/SG total |

## Admin Fasiliteter-komponenter (CoachHQ — GFGK fasilitets-bookingkart)
| Komponent | Fil | Bruk |
|---|---|---|
| FacilityMap | components/admin/FacilityMap.tsx | Flyfoto-kart med 4 klikkbare SVG-soner (Driving Range, Performance Studio, Putting Green, Short Game Area), kapasitets-fargekoding og pulserende live-indikator når booking pågår nå |
| ZoneDetailPanel | components/admin/facility-map/zone-detail-panel.tsx | Mørkt glasspanel som åpner fra kart-sone — viser dagens bookinger, live-status, "Book nå"-knapp |
| OffMapStrip | components/admin/facility-map/off-map-strip.tsx | Pille-rad under kartet for fasiliteter som ikke er synlige (Korthullsbane), med samme klikk-til-glasspanel-flyt |
| FacilityCalendar | components/admin/FacilityCalendar.tsx | Dagvelger (7 dager) + 08-20 timeplan med fargede booking-blokker per fasilitet |
| FacilityList | components/admin/FacilityList.tsx | Bookinger gruppert per fasilitet med status-badge per type |
| AddActivityModal | components/admin/AddActivityModal.tsx | Modal for å legge til ny FacilityBooking (fasilitet, person, type, dato, tid, varighet) |

## Sprint 0 — Delte komponenter (Brand Guide V2.0 + HQ Foundation)
| Komponent | Fil | Bruk |
|---|---|---|
| PyramideRinger | components/shared/PyramideRinger.tsx | 5 konsentriske SVG-buer for treningspyramide (FYS/TEK/SLAG/SPILL/TURN) |
| SgRadarChart | components/shared/SgRadarChart.tsx | 4-akset SVG-radar for Strokes Gained |
| HcpTrendChart | components/shared/HcpTrendChart.tsx | HCP-trend SVG med lime gradient-fill |
| SessionCard | components/shared/SessionCard.tsx | Treningsokt-kort med venstre pyramide-stripe |
| MetricCard | components/shared/MetricCard.tsx | KPI-kort med stort mono-tall og delta |
| EmptyState | components/shared/EmptyState.tsx | Tom-tilstand med ikon, tittel, CTA |
| ChatBubble | components/shared/ChatBubble.tsx | Speilvendt melding for sender/mottaker |
| WeekPills | components/shared/WeekPills.tsx | Horisontale pills for ukenavigsjon (U1-U6) |
| StreakGrid | components/shared/StreakGrid.tsx | 14/30-dagers prikk-grid for streaks |
| PlanActionCard | components/admin/coachhq-dark/PlanActionCard.tsx | AI-agent forslag med urgency-stripe |

## Kalender-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| AkCalendar | components/shared/calendar/AkCalendar.tsx | Fullscreen kalender med dag/uke/maaned/aar-visning |
| MonthView | components/shared/calendar/MonthView.tsx | Maanedsvisning med event-pills |
| WeekView | components/shared/calendar/WeekView.tsx | 7-dagers grid med tidsblokker |
| DayView | components/shared/calendar/DayView.tsx | Dagvisning med timeplan 08-20 |
| YearView | components/shared/calendar/YearView.tsx | 12 mini-maaneder med aktivitetsprikker |

## Statistikk-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| SgBarChart | components/shared/charts/SgBarChart.tsx | Strokes Gained horisontale barer (+/- rundt 0) |
| ScoreDistribution | components/shared/charts/ScoreDistribution.tsx | Score-fordeling histogram |
| ComparisonBar | components/shared/charts/ComparisonBar.tsx | Spillerverdi vs peer vs benchmark |
| PercentilDial | components/shared/charts/PercentilDial.tsx | Halvsirkel-gauge (0-100) |
| RoundSummaryCard | components/shared/RoundSummaryCard.tsx | Kompakt runde-sammendrag |

## Treningsdata-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| ComplianceChart | components/shared/ComplianceChart.tsx | Ukentlig gjennomforing (planlagt vs fullfort) |
| PeriodizationTimeline | components/shared/PeriodizationTimeline.tsx | Aarsplan med fargekodede perioder |
| DrillProgressCard | components/shared/DrillProgressCard.tsx | Drill-fremgang med score-trend og benchmark |
| TrainingVolumeChart | components/shared/TrainingVolumeChart.tsx | Treningsvolum stablet per pyramide-omrade |

## Coaching-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| PlayerTimeline | components/shared/PlayerTimeline.tsx | Vertikal tidslinje med okter, tester, milepaler |
| SignalBadge | components/shared/SignalBadge.tsx | Coaching-signal pill med severity-farge |
| CoachNoteCard | components/shared/CoachNoteCard.tsx | Coach-notat med tidsstempel og kategori |
| PriorityQueueList | components/shared/PriorityQueueList.tsx | Prioritert oppgaveliste med SLA-timer |
| AlertCard | components/shared/AlertCard.tsx | SLA-brudd-varsling med severity |
| SlaProgressBar | components/shared/SlaProgressBar.tsx | Tid brukt vs SLA-grense progress |
| PlayerRiskCard | components/shared/PlayerRiskCard.tsx | Churn-risiko-indikator |
| PlayerQuickStats | components/shared/PlayerQuickStats.tsx | Inline HCP/SG/streak per spiller-rad |
| CoachLoadChart | components/shared/CoachLoadChart.tsx | Coach-kapasitet og utnyttelse |

## Live Session-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| RepLoggingPanel | components/shared/RepLoggingPanel.tsx | Store +/- knapper for rep-logging |
| SessionTimerCard | components/shared/SessionTimerCard.tsx | Stoppeklokke for coaching-okter |

## Spiller-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| GoalProgressCard | components/shared/GoalProgressCard.tsx | Mal-fremgang med target vs naverdi |
| CourseCard | components/shared/CourseCard.tsx | Bane-info med glassmorfisk overlay |

## Video-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| VideoPlayerCard | components/shared/VideoPlayerCard.tsx | Video med tidsstemplede kommentarer |
| SwingAnnotationPanel | components/shared/SwingAnnotationPanel.tsx | Tegne pa video-frame for swing-analyse |

## Interaksjon og flow-komponenter (Sprint 0 komponentbibliotek)
| Komponent | Fil | Bruk |
|---|---|---|
| ConfirmDialog | components/shared/ConfirmDialog.tsx | Bekreftelsesmodal med default/danger variant |
| FilterPanel | components/shared/FilterPanel.tsx | Horisontal filterrad (select, multi-select, date-range) |
| SearchInput | components/shared/SearchInput.tsx | Sok-felt med debounce og nullstill |
| ActionMenu | components/shared/ActionMenu.tsx | Tre-prikker-meny med handlinger |
| FormModal | components/shared/FormModal.tsx | Modal med skjema, validering, submit |
| LoadingSkeleton | components/shared/LoadingSkeleton.tsx | Skeleton-loader (card/metric/chart/list/profile/timeline) |
| ErrorRetry | components/shared/ErrorRetry.tsx | Feilvisning med retry-knapp |
| StepperProgress | components/shared/StepperProgress.tsx | Multi-steg-indikator (Steg X av Y) |
| ToastProvider | components/shared/ToastProvider.tsx | Sonner toast-wrapper med AK Golf-styling |
| toast-helpers | components/shared/toast-helpers.ts | showSuccess/showError/showWarning/showInfo |

## Delte UI-komponenter (shadcn/ui)
Installerte primitiver i components/ui/:
avatar, badge, breadcrumb, button, card, checkbox, command, dialog, dropdown-menu,
input, label, popover, scroll-area, select, separator, sheet, skeleton, slider,
switch, tabs, textarea, tooltip

## Motion-wrappers
Se components/motion/ for Framer Motion wrappers.

## Regler
- Nye komponenter i components/portal/{feature}/ eller components/shared/
- Maks 300 linjer per fil
- Registrer nye komponenter i denne filen umiddelbart
- Bruk kun Tailwind-tokens fra design-system.md
- Toast: bruk `showSuccess`/`showError` fra `@/components/shared/toast-helpers`
- Modaler: bruk ConfirmDialog for bekreftelser, FormModal for skjemaer
- Loading: bruk LoadingSkeleton med riktig variant
- Feil: bruk ErrorRetry med onRetry callback
