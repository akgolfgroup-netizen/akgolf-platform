# AK Golf - Visuell Arkitektur
## To Portaler: Spillerportal + Mission Control

---

## INNLOGGINGS-FLYT

```
                    akgolf.no
                        │
                        ▼
            ┌───────────────────────┐
            │   DUAL PORTAL VALG    │
            │    (Landingsside)     │
            └───────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐               ┌──────────────────┐
│  SPILLERPORTAL│               │  MISSION CONTROL │
│    Login      │               │      Login       │
│  (Lys/Varm)   │               │   (Mørk/Tech)    │
└───────┬───────┘               └────────┬─────────┘
        │                                │
        ▼                                ▼
┌──────────────────┐        ┌──────────────────────────┐
│   ELEV/SPILLER   │        │    TRENER/COACH/ADMIN    │
│                  │        │                          │
│ • Oversikt       │        │ Rolle-sjekk:             │
│ • Mine Bookinger │        │                          │
│ • Treningsplan   │        │ ┌─────────────────────┐  │
│ • Statistikk     │        │ │ SUPER ADMIN         │  │
│ • Kalender       │        │ │ • Full tilgang      │  │
│                  │        │ │ • System-config     │  │
│ Abonnement:      │        │ • Bruker-admin        │  │
│ • VISITOR        │        │ • Økonomi           │  │
│ • ACADEMY        │        └─────────────────────┘  │
│ • STARTER        │        ┌─────────────────────┐  │
│ • PRO            │        │ HOVEDTRENER         │  │
│ • ELITE          │        │ • Egne elever       │  │
└──────────────────┘        │ • Se alle (view)    │  │
                            │ • Booking-admin     │  │
                            │ • Analyse           │  │
                            └─────────────────────┘  │
                            ┌─────────────────────┐  │
                            │ ASSISTENT-TRENER    │  │
                            │ • Egne elever only  │  │
                            │ • Egen kalender     │  │
                            │ • Basis funksjoner  │  │
                            └─────────────────────┘  │
                            ┌─────────────────────┐  │
                            │ INVITERT/GJEST      │  │
                            │ • Tildelte elever   │  │
                            │ • View-only         │  │
                            │ • Tidsbegrenset     │  │
                            └─────────────────────┘  │
                                                      │
                            └──────────────────────────┘
```

---

## SKJERM-FORDELING ETTER ROLLE

### SPILLERPORTAL (6 hovedskjermer)

| Skjerm | Tilgang | Beskrivelse |
|--------|---------|-------------|
| **Oversikt** | Alle spillere | Dashboard med widgets, AI-innsikt |
| **Mine Bookinger** | Alle spillere | Booking-historikk og fremtidige |
| **Treningsplan** | Starter+ | AI-generert treningsplan |
| **Treningsdagbok** | Alle spillere | Loggføring av egne økter |
| **Statistikk** | Alle spillere | Strokes Gained, handicap |
| **Kalender** | Alle spillere | Personlig timeplan |

**Trening-sub:**
- Trackman Tester (Pro+)
- Øvelser (Alle)

**Konto-sub:**
- Profil (Alle)
- Historikk (Alle)

---

### MISSION CONTROL (11 hovedskjermer + sub-pages)

| Skjerm | Super Admin | Hovedtrener | Assistent | Invitert |
|--------|:-----------:|:-----------:|:---------:|:--------:|
| **Mission Board** | ✅ Full | ✅ Full | ✅ Begrenset | ✅ Minimalt |
| **Kalender (Admin)** | ✅ Global | ✅ Global | ✅ Egen | ✅ Egen |
| **Bookinger (Admin)** | ✅ Alle | ✅ Alle | ✅ Egne | ❌ Nei |
| **Fasiliteter** | ✅ Full | ✅ Full | ✅ View | ✅ View |
| **Elever** | ✅ Alle | ✅ Alle | ✅ Tildelt | ✅ Tildelt |
| **Tilgjengelighet** | ✅ Global | ✅ Global | ✅ Egen | ✅ Egen |
| **Kapasitet** | ✅ Full | ✅ View | ❌ Nei | ❌ Nei |
| **Analyse** | ✅ Full | ✅ Full | ✅ Egen | ❌ Nei |
| **Denne uken** | ✅ Full | ✅ Full | ✅ Egen | ❌ Nei |
| **Turneringer** | ✅ Full | ✅ Full | ✅ View | ❌ Nei |
| **Notifikasjoner** | ✅ Global | ✅ Academy | ✅ Egen | ❌ Nei |

**Sub-pages (kun Super Admin + Hovedtrener):**
- Ny Booking (Admin)
- Elev Detaljer
- AI Assistent
- E-postmaler
- Meldinger (Unified Inbox)
- Godkjenninger
- Økter
- Økonomi (Kun Super Admin)
- Rapporter

---

## TILGANGSMATRISE (Permission Matrix)

### Feature-tilgang etter rolle

| Feature | Super Admin | Hovedtrener | Assistent | Invitert | Spiller |
|---------|:-----------:|:-----------:|:---------:|:--------:|:-------:|
| **BOOKINGER** |
| Se alle bookinger | ✅ | ✅ | ❌ | ❌ | ❌ |
| Se egne bookinger | ✅ | ✅ | ✅ | ✅ | ✅ |
| Opprette booking | ✅ | ✅ | ✅ | ❌ | ✅ |
| Endre andres booking | ✅ | ✅ | ❌ | ❌ | ❌ |
| Slette booking | ✅ | ✅ | ❌ | ❌ | ✅ Egen |
| **ELEVER** |
| Se alle elever | ✅ | ✅ | ❌ | ❌ | ❌ |
| Se egne elever | ✅ | ✅ | ✅ | ✅ | N/A |
| Redigere elev-profil | ✅ | ✅ | ❌ | ❌ | ✅ Egen |
| Se elev-statistikk | ✅ | ✅ | ✅ | ✅ | ❌ |
| **KALENDER** |
| Se global kalender | ✅ | ✅ | ❌ | ❌ | ❌ |
| Administrere tilgjengelighet | ✅ | ✅ | ✅ | ✅ | N/A |
| **ØKONOMI** |
| Se all inntekt | ✅ | ❌ | ❌ | ❌ | ❌ |
| Se egen inntekt | ✅ | ✅ | ✅ | ❌ | N/A |
| Behandle refusjoner | ✅ | ❌ | ❌ | ❌ | ❌ |
| Se egne betalinger | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SYSTEM** |
| Endre roller/tilganger | ✅ | ❌ | ❌ | ❌ | ❌ |
| System-innstillinger | ✅ | ❌ | ❌ | ❌ | ❌ |
| Integrasjoner | ✅ | ❌ | ❌ | ❌ | ❌ |
| **INNHOLD** |
| E-postmaler | ✅ | ✅ | ❌ | ❌ | ❌ |
| Øvelsesbibliotek | ✅ | ✅ | ✅ View | ✅ View | ✅ View |
| AI Assistent | ✅ | ✅ | ✅ | ❌ | ✅ |
| **ANALYSE** |
| Academy-analyse | ✅ | ✅ View | ❌ | ❌ | ❌ |
| Egen ytelse | ✅ | ✅ | ✅ | ❌ | ✅ |
| Student-fremgang | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## FARGE-KODING FOR ROLLER

```
┌─────────────────────────────────────────────────────────────┐
│                    ROLLE-FARGER                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🟣 SUPER ADMIN     #7C3AED  (Lilla)                       │
│     └── Full system kontroll                               │
│                                                             │
│  🟢 HOVEDTRENER     #D2F000  (Neon Lime)                   │
│     └── Full coaching tilgang                              │
│                                                             │
│  🔵 ASSISTENT       #3B82F6  (Blå)                         │
│     └── Begrenset til egen aktivitet                       │
│                                                             │
│  🟠 INVITERT        #F97316  (Oransje)                     │
│     └── Temporær, view-only                                │
│                                                             │
│  ⚪ SPILLER         #2D6A4F  (AK Grønn)                    │
│     └── Spillerportal tilgang                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## URL-STRUKTUR

### Spillerportal
```
/                          → Portal Selector Landing
/spillerportal             → Spillerportal Login
/portal                    → Spiller Dashboard (Oversikt)
/portal/bookinger          → Mine Bookinger
/portal/treningsplan       → Treningsplan
/portal/dagbok            → Treningsdagbok
/portal/statistikk         → Statistikk
/portal/kalender           → Kalender
/portal/trening/*          → Trening sub-pages
/portal/profil             → Min Profil
```

### Mission Control
```
/mission-control           → Mission Control Login
/mission/dashboard         → Mission Board (rolle-tilpasset)
/mission/admin/*           → Super Admin only
/mission/coach/*           → Hovedtrener funksjoner
/mission/assistant/*       → Assistent funksjoner
/mission/guest/*           → Invitert funksjoner
```

---

## VIKTIGE FORSKJELLER: Spillerportal vs Mission Control

| Aspekt | Spillerportal | Mission Control |
|--------|---------------|-----------------|
| **Målgruppe** | Elever, juniorer, medlemmer | Trenere, coacher, admin |
| **Stemning** | Varm, motiverende, personlig | Profesjonell, effektiv, tech |
| **Farger** | #FDF9F0 (lys), #2D6A4F (grønn) | #0A0D0A (mørk), #D2F000 (lime) |
| **Fokus** | Egen utvikling, trening, fremgang | Administrasjon, elever, system |
| **Data** | Kun egne data | Elevers data + system |
| **Handlinger** | Booke, logge, se | Administrere, planlegge, analysere |
| **AI** | Treningsplaner, tips | Coaching-assistent, analyse |
| **Abonnement** | 5 nivåer (Visitor → Elite) | Rolle-basert (4 nivåer) |

---

## GENERERINGSPRIORITET FOR STITCH

### Høyeste prioritet (MVP)
1. ✅ Portal Selector Landing
2. ✅ Spillerportal Login
3. ✅ Mission Control Login
4. ✅ Spiller Dashboard (Oversikt)
5. ✅ Mission Board (Super Admin versjon)

### Høy prioritet (Core)
6. Spiller: Mine Bookinger
7. Spiller: Treningsplan
8. Spiller: Statistikk
9. Mission: Brukeradministrasjon (Roller)
10. Mission: Kalender (Admin)

### Medium prioritet
11. Spiller: Kalender
12. Spiller: Treningsdagbok
13. Mission: Bookinger (Admin)
14. Mission: Elever
15. Mission: Analyse

### Lavere prioritet
16. Andre Mission-skjermer
17. Spiller: Trackman Tester
18. Spiller: Øvelser
19. Spiller: Profil/Historikk

---

*Visuell oversikt for AK Golf rollebasert arkitektur*
