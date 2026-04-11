# ADR-001: Portal sidebar-navigasjon

**Dato:** 11. april 2026
**Status:** Implementert

## Beslutning

Portal-sidebaren bruker 6 nav-punkter basert på spillerens syklus fra A-K metodikken:

| Nav-punkt | Ikon | Rute | Formål |
|-----------|------|------|--------|
| Dashboard | LayoutDashboard | `/portal` | Oversikt og neste steg |
| Planlegg | Calendar | `/portal/bookinger` | Booking og kalender |
| Tren | Target | `/portal/treningsplan` | Treningsplaner og øvelser |
| Spill | Flag | `/portal/runder` | Runder og scoring |
| Analyser | BarChart3 | `/portal/statistikk` | Statistikk og benchmark |
| AI Coach | Sparkles | `/portal/ai` | AI-analyse og innsikt |

## Kontekst

Navigasjonsstrukturen følger masterdokumentet for A-K metodikken — spillerens naturlige syklus:

1. **Planlegg** — sett mål, book timer
2. **Tren** — gjennomfør øvelser og coaching
3. **Spill** — registrer runder på banen
4. **Analyser** — se statistikk og trender
5. **AI Coach** — få personlige anbefalinger

Dashboard er inngangspunktet som viser neste handling i syklusen.

## Konsekvenser

- Alle nye portal-funksjoner må plasseres under ett av disse 6 punktene
- Sidebar-rekkefølgen er fast og representerer spillerens flyt
- Admin/Mission Control har egen sidebar og følger ikke denne strukturen
