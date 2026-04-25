# Komponentbibliotek — AK Golf Platform

Sjekk ALLTID denne filen FØR du bygger en ny komponent.
Gjenbruk eksisterende — aldri bygg duplikater.

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

## Portal Dashboard-komponenter
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
| BookingHoverCard | components/portal/booking/booking-hover-card.tsx | Aceternity-inspirert glow |
| NextBookingHero | components/portal/booking/next-booking-hero.tsx | Neste booking uthevet |
| UpcomingBookingCard | components/portal/booking/upcoming-booking-card.tsx | Kommende booking-kort |
| PastBookingList | components/portal/booking/past-booking-list.tsx | Tidligere bookinger |
| CancellationRulesCard | components/portal/booking/cancellation-rules-card.tsx | Avbestillingsregler |

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

## Admin Fasiliteter-komponenter (CoachHQ — GFGK fasilitets-bookingkart)
| Komponent | Fil | Bruk |
|---|---|---|
| FacilityMap | components/admin/FacilityMap.tsx | Flyfoto-kart med 4 klikkbare SVG-soner (Driving Range, Performance Studio, Putting Green, Short Game Area), kapasitets-fargekoding og pulserende live-indikator når booking pågår nå |
| ZoneDetailPanel | components/admin/facility-map/zone-detail-panel.tsx | Mørkt glasspanel som åpner fra kart-sone — viser dagens bookinger, live-status, "Book nå"-knapp |
| OffMapStrip | components/admin/facility-map/off-map-strip.tsx | Pille-rad under kartet for fasiliteter som ikke er synlige (Korthullsbane), med samme klikk-til-glasspanel-flyt |
| FacilityCalendar | components/admin/FacilityCalendar.tsx | Dagvelger (7 dager) + 08-20 timeplan med fargede booking-blokker per fasilitet |
| FacilityList | components/admin/FacilityList.tsx | Bookinger gruppert per fasilitet med status-badge per type |
| AddActivityModal | components/admin/AddActivityModal.tsx | Modal for å legge til ny FacilityBooking (fasilitet, person, type, dato, tid, varighet) |

## Delte UI-komponenter (shadcn/ui)
Se components/ui/ for shadcn primitiver (Button, Dialog, Card, etc.)

## Motion-wrappers
Se components/motion/ for Framer Motion wrappers.

## Regler
- Nye komponenter i components/portal/{feature}/ 
- Maks 300 linjer per fil
- Registrer nye komponenter i denne filen umiddelbart
- Bruk kun Tailwind-tokens fra design-system.md
