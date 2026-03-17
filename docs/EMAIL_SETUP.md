# E-postoppsett med Resend

Denne guiden beskriver hvordan du setter opp e-postfunksjonalitet for AK Golf nettsiden.

## Hva er konfigurert

| Funksjon | API-route | Beskrivelse |
|----------|-----------|-------------|
| Kontaktskjema | `/api/contact` | Sender henvendelser til `post@akgolf.no` |
| Nyhetsbrev | `/api/newsletter` | Lagrer påmeldinger (sender e-post hvis Resend er konfigurert) |

## Steg-for-steg oppsett

### 1. Opprett Resend-konto

```bash
# Gå til https://resend.com
# Registrer deg med post@akgolf.no eller en annen e-post
```

### 2. Verifiser domene

1. I Resend-dashboardet, gå til **Domains**
2. Klikk **Add Domain**
3. Skriv inn: `akgolf.no`
4. Følg instruksjonene for DNS-oppsett (TXT og CNAME records)
5. Vent på verifisering (kan ta opptil 24 timer)

### 3. Generer API-nøkkel

1. Gå til **API Keys** i Resend-dashboardet
2. Klikk **Create API Key**
3. Velg:
   - **Name**: `AK Golf Production`
   - **Permissions**: ✅ Sending (kun denne trengs)
4. Kopier API-nøkkelen (starter med `re_`)

### 4. Konfigurer miljøvariabler

```bash
# I Vercel-dashboardet (eller .env.local for lokal testing):
RESEND_API_KEY=re_din_api_nokk_her
CONTACT_EMAIL=post@akgolf.no
FROM_EMAIL=noreply@akgolf.no
```

### 5. Test e-postfunksjonalitet

```bash
# Lokal testing
npm run dev

# Gå til http://localhost:3000
# Fyll ut kontaktskjemaet og send
# Sjekk at e-post mottas på post@akgolf.no
```

## Fallback-oppførsel

Hvis `RESEND_API_KEY` ikke er satt:
- Skjemaet viser fortsatt "Melding mottatt!"
- Data logges til konsollen (for debugging)
- Ingen e-post sendes

Dette gjør at nettsiden fungerer selv uten e-postkonfigurasjon.

## Sikkerhet

- API-nøkkelen lagres aldri i klienten (kun server-side)
- E-postvalidering på både klient- og serverside
- Rate limiting bør vurderes for produksjon

## Feilsøking

| Problem | Løsning |
|---------|---------|
| E-post sendes ikke | Sjekk at `RESEND_API_KEY` er satt i Vercel |
| E-post havner i spam | Verifiser domene i Resend |
| "Noe gikk galt"-melding | Sjekk server-logs i Vercel |
| Ingen e-post mottatt | Sjekk spam-filter på post@akgolf.no |

## Videreutvikling

- [ ] Legg til e-postbekreftelse til avsender (auto-reply)
- [ ] Lag e-posttemplates for ulike typer henvendelser
- [ ] Integrer med CRM (HubSpot, Pipedrive, etc.)
- [ ] Sett opp e-postkvitteringer for betalinger
