#!/bin/bash
# =============================================================================
# AK Golf Booking - Full Oppsett Script
# Brukes med Claude Code (har MCP-tilgang til tjenester)
# =============================================================================

set -e  # Stopp ved første feil

# Farger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AK Golf Booking - Full Integrasjonsoppsett               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# =============================================================================
# HJELPEFUNKSJONER
# =============================================================================

ask_user() {
    local question="$1"
    local default="${2:-}"
    
    if [ -n "$default" ]; then
        read -rp "$question [$default]: " answer
        echo "${answer:-$default}"
    else
        read -rp "$question: " answer
        echo "$answer"
    fi
}

confirm() {
    local question="$1"
    read -rp "$question (y/N): " response
    [[ "$response" =~ ^[Yy]$ ]]
}

update_env() {
    local key="$1"
    local value="$2"
    
    if grep -q "^$key=" .env 2>/dev/null; then
        # Nøkkel finnes - oppdater
        sed -i '' "s|^$key=.*|$key=$value|" .env
    else
        # Nøkkel finnes ikke - legg til
        echo "$key=$value" >> .env
    fi
    echo -e "${GREEN}✓${NC} Oppdatert: $key"
}

# =============================================================================
# STEG 1: SUPABASE (Auth + Database)
# =============================================================================

setup_supabase() {
    echo ""
    echo -e "${YELLOW}═══ STEG 1: Supabase Oppsett ═══${NC}"
    echo ""
    
    if confirm "Har du allerede et Supabase-prosjekt?"; then
        echo "Bruk MCP-verktøyet til å hente prosjektdetaljer..."
        echo "(Claude Code: Bruk Supabase MCP til å liste prosjekter)"
        
        SUPABASE_URL=$(ask_user "Supabase Project URL" "https://xxxxx.supabase.co")
        SUPABASE_ANON=$(ask_user "Supabase Anon Key (public)" "")
        SUPABASE_SERVICE=$(ask_user "Supabase Service Role Key (secret)" "")
    else
        echo ""
        echo "📋 For å opprette nytt Supabase-prosjekt:"
        echo "   1. Gå til https://supabase.com/dashboard"
        echo "   2. Klikk 'New Project'"
        echo "   3. Velg organisasjon: din org"
        echo "   4. Prosjektnavn: akgolf-booking"
        echo "   5. Database password: (generer sterk passord)"
        echo "   6. Region: North Europe (Stockholm)"
        echo "   7. Vent på deploy (~2 min)"
        echo ""
        echo "   Hent API-nøkler fra: Project Settings → API"
        echo ""
        
        SUPABASE_URL=$(ask_user "Supabase Project URL")
        SUPABASE_ANON=$(ask_user "Supabase Anon Key")
        SUPABASE_SERVICE=$(ask_user "Supabase Service Role Key")
    fi
    
    update_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
    update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON"
    update_env "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE"
    
    echo ""
    echo -e "${GREEN}✓ Supabase konfigurert${NC}"
}

# =============================================================================
# STEG 2: PRISMA/DATABASE
# =============================================================================

setup_database() {
    echo ""
    echo -e "${YELLOW}═══ STEG 2: Database (Prisma) ═══${NC}"
    echo ""
    
    echo "📋 Database connection string fra Supabase:"
    echo "   Project Settings → Database → Connection String → URI"
    echo ""
    
    DB_PASSWORD=$(ask_user "Database password (fra Supabase-oppsett)")
    
    # Ekstrakt prosjekt-ref fra Supabase URL
    SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env | cut -d'=' -f2)
    PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's/https:\/\///' | sed 's/\.supabase\.co//' | sed 's/\.supabase\.red//')
    
    DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"
    
    update_env "DATABASE_URL" "$DATABASE_URL"
    
    echo ""
    echo "🔄 Kjører Prisma migrasjoner..."
    
    if npx prisma migrate dev --name init 2>/dev/null; then
        echo -e "${GREEN}✓ Migrasjoner kjørt${NC}"
    else
        echo -e "${YELLOW}⚠ Migrasjoner allerede kjørt eller feil${NC}"
    fi
    
    if npx prisma generate; then
        echo -e "${GREEN}✓ Prisma client generert${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Database konfigurert${NC}"
}

# =============================================================================
# STEG 3: STRIPE (Betaling)
# =============================================================================

setup_stripe() {
    echo ""
    echo -e "${YELLOW}═══ STEG 3: Stripe Betaling ═══${NC}"
    echo ""
    
    echo "📋 Stripe oppsett:"
    echo "   1. Gå til https://dashboard.stripe.com"
    echo "   2. Bytt til TEST mode (toggle øverst)"
    echo "   3. Developers → API keys"
    echo ""
    
    STRIPE_SECRET=$(ask_user "Stripe Secret Key (sk_test_...)" "")
    STRIPE_PUBLISHABLE=$(ask_user "Stripe Publishable Key (pk_test_...)" "")
    
    update_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET"
    update_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUBLISHABLE"
    
    echo ""
    echo "📋 Coaching-produkter i booking-systemet:"
    echo "   (Fra prisma/seed.ts og lib/stripe/products.ts)"
    echo ""
    echo "   🏌️ AI Treningsplaner (Trening) - valgfritt:"
    echo "      - Basis: 199 kr (engangsbetaling)"
    echo "      - Standard: 699 kr/sesong (abonnement)"
    echo "      - Premium: 1999 kr/år (abonnement)"
    echo ""
    echo "   ⛳ Coaching-tjenester (Booking) - ONE-TIME payments:"
    echo "      - Individuell coaching: 995 kr (60 min)"
    echo "      - Playing lesson: 1795 kr (120 min, 9 hull)"
    echo "      - Gruppetrening: 495 kr/person (90 min, maks 4)"
    echo "      - Simulator-time: 595 kr (60 min, maks 2)"
    echo ""
    echo "   Gå til Stripe Dashboard → Products for å se Price IDs"
    echo ""
    
    # AI Treningsplaner (valgfritt)
    if confirm "Sette opp AI Treningsplan-produkter (Basis/Standard/Premium)?"; then
        STRIPE_BASIS=$(ask_user "Stripe Price ID for AI Treningsplan Basis (price_...)" "")
        STRIPE_STANDARD=$(ask_user "Stripe Price ID for AI Treningsplan Standard (price_...)" "")
        STRIPE_PREMIUM=$(ask_user "Stripe Price ID for AI Treningsplan Premium (price_...)" "")
        
        [ -n "$STRIPE_BASIS" ] && update_env "STRIPE_PRICE_BASIS" "$STRIPE_BASIS"
        [ -n "$STRIPE_STANDARD" ] && update_env "STRIPE_PRICE_STANDARD" "$STRIPE_STANDARD"
        [ -n "$STRIPE_PREMIUM" ] && update_env "STRIPE_PRICE_PREMIUM" "$STRIPE_PREMIUM"
    fi
    
    # Coaching-tjenester (brukes i booking)
    echo ""
    echo "📋 Coaching-tjenester for booking (valgfritt):"
    if confirm "Sette opp coaching-produkter i Stripe (for Vipps-alternativ)?"; then
        echo "Merk: Coaching-tjenester bruker vanligvis Vipps i Norge."
        echo "Stripe kan brukes som alternativ for internasjonale kunder."
        
        STRIPE_COACH_INDIVIDUAL=$(ask_user "Price ID: Individuell coaching 995kr (price_...)" "")
        STRIPE_COACH_PLAYING=$(ask_user "Price ID: Playing lesson 1795kr (price_...)" "")
        STRIPE_COACH_GROUP=$(ask_user "Price ID: Gruppetrening 495kr (price_...)" "")
        STRIPE_COACH_SIMULATOR=$(ask_user "Price ID: Simulator-time 595kr (price_...)" "")
        
        [ -n "$STRIPE_COACH_INDIVIDUAL" ] && update_env "STRIPE_PRICE_COACH_INDIVIDUAL" "$STRIPE_COACH_INDIVIDUAL"
        [ -n "$STRIPE_COACH_PLAYING" ] && update_env "STRIPE_PRICE_COACH_PLAYING" "$STRIPE_COACH_PLAYING"
        [ -n "$STRIPE_COACH_GROUP" ] && update_env "STRIPE_PRICE_COACH_GROUP" "$STRIPE_COACH_GROUP"
        [ -n "$STRIPE_COACH_SIMULATOR" ] && update_env "STRIPE_PRICE_COACH_SIMULATOR" "$STRIPE_COACH_SIMULATOR"
    fi
    
    echo ""
    echo "📋 Stripe Webhook (for produksjon):"
    echo "   Developers → Webhooks → Add endpoint"
    echo "   URL: https://akgolf.no/api/portal/webhooks/stripe"
    echo "   Events: checkout.session.completed, payment_intent.succeeded"
    echo ""
    
    STRIPE_WEBHOOK=$(ask_user "Stripe Webhook Secret (whsec_...) (valgfritt, kan legges til senere)" "")
    
    if [ -n "$STRIPE_WEBHOOK" ]; then
        update_env "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Stripe konfigurert${NC}"
}

# =============================================================================
# STEG 4: RESEND (E-post)
# =============================================================================

setup_resend() {
    echo ""
    echo -e "${YELLOW}═══ STEG 4: Resend E-post ═══${NC}"
    echo ""
    
    echo "📋 Resend oppsett:"
    echo "   1. Gå til https://resend.com"
    echo "   2. Registrer med post@akgolf.no"
    echo "   3. API Keys → Create API Key (Sending access)"
    echo "   4. Domains → Add Domain → akgolf.no"
    echo "   5. Verifiser domenet (DNS-records)"
    echo ""
    
    RESEND_KEY=$(ask_user "Resend API Key (re_...)" "")
    
    update_env "RESEND_API_KEY" "$RESEND_KEY"
    update_env "CONTACT_EMAIL" "post@akgolf.no"
    update_env "FROM_EMAIL" "noreply@akgolf.no"
    
    echo ""
    echo -e "${GREEN}✓ Resend konfigurert${NC}"
}

# =============================================================================
# STEG 5: VIPPS MOBILEPAY
# =============================================================================

setup_vipps() {
    echo ""
    echo -e "${YELLOW}═══ STEG 5: Vipps MobilePay (Valgfritt) ═══${NC}"
    echo ""
    
    if confirm "Vil du sette opp Vipps MobilePay?"; then
        echo ""
        echo "📋 Vipps søknad:"
        echo "   1. Gå til https://portal.vippsmobilepay.com"
        echo "   2. Logg inn med BankID"
        echo "   3. Søk om 'Vipps på Nett'"
        echo "   4. Fyll ut:"
        echo "      - Organisasjonsnummer"
        echo "      - Bankkonto for utbetaling"
        echo "      - Nettside: akgolf.no"
        echo "   5. Vent på godkjenning (1-3 dager)"
        echo ""
        echo -e "${YELLOW}⚠ Vipps krever manuell søknad og godkjenning${NC}"
        echo "   (Dette kan ikke automatiseres)"
        echo ""
        
        if confirm "Har du allerede Vipps API-nøkler?"; then
            echo "Legg til nøkler i .env manuelt etter søknad"
        fi
    else
        echo "Hoppet over Vipps (kan settes opp senere)"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Vipps (valgfritt)${NC}"
}

# =============================================================================
# STEG 6: ANTHROPIC CLAUDE (AI)
# =============================================================================

setup_anthropic() {
    echo ""
    echo -e "${YELLOW}═══ STEG 6: Anthropic Claude (AI) ═══${NC}"
    echo ""
    
    echo "📋 Anthropic oppsett:"
    echo "   1. Gå til https://console.anthropic.com"
    echo "   2. API keys → Create Key"
    echo "   3. Name: AK Golf Booking"
    echo ""
    
    ANTHROPIC_KEY=$(ask_user "Anthropic API Key (sk-ant-...) (valgfritt)" "")
    
    if [ -n "$ANTHROPIC_KEY" ]; then
        update_env "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Anthropic (valgfritt)${NC}"
}

# =============================================================================
# STEG 7: ANDRE INTEGRASJONER
# =============================================================================

setup_others() {
    echo ""
    echo -e "${YELLOW}═══ STEG 7: Andre Integrasjoner (Valgfritt) ═══${NC}"
    echo ""
    
    # Twilio
    if confirm "Sette opp Twilio (SMS)?"; then
        echo "   Gå til https://twilio.com"
        TWILIO_SID=$(ask_user "Twilio Account SID" "")
        TWILIO_TOKEN=$(ask_user "Twilio Auth Token" "")
        TWILIO_PHONE=$(ask_user "Twilio Phone Number (+47...)" "")
        
        update_env "TWILIO_ACCOUNT_SID" "$TWILIO_SID"
        update_env "TWILIO_AUTH_TOKEN" "$TWILIO_TOKEN"
        update_env "TWILIO_PHONE_NUMBER" "$TWILIO_PHONE"
    fi
    
    # Notion
    if confirm "Sette opp Notion?"; then
        echo "   Gå til https://notion.so → Settings → Integrations"
        NOTION_KEY=$(ask_user "Notion API Key (ntn_...)" "")
        NOTION_DB=$(ask_user "Notion Database ID" "")
        
        update_env "NOTION_API_KEY" "$NOTION_KEY"
        update_env "NOTION_BRAND_GUIDE_DB_ID" "$NOTION_DB"
    fi
    
    # Google OAuth
    if confirm "Sette opp Google OAuth?"; then
        echo "   Gå til https://console.cloud.google.com"
        echo "   APIs & Services → Credentials → Create OAuth 2.0"
        GOOGLE_ID=$(ask_user "Google Client ID" "")
        GOOGLE_SECRET=$(ask_user "Google Client Secret" "")
        
        update_env "GOOGLE_CLIENT_ID" "$GOOGLE_ID"
        update_env "GOOGLE_CLIENT_SECRET" "$GOOGLE_SECRET"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Andre integrasjoner${NC}"
}

# =============================================================================
# STEG 8: TEST OG VERIFISERING
# =============================================================================

test_setup() {
    echo ""
    echo -e "${YELLOW}═══ STEG 8: Test og Verifisering ═══${NC}"
    echo ""
    
    echo "🔄 Tester oppsettet..."
    echo ""
    
    # Sjekk .env
    echo "Sjekker .env fil:"
    if [ -f .env ]; then
        echo -e "  ${GREEN}✓${NC} .env fil finnes"
        
        # Tell konfigurerte nøkler
        CONFIGURED=$(grep -c "=" .env | grep -v "^#" | wc -l | tr -d ' ')
        echo "  Konfigurerte variabler: $CONFIGURED"
    else
        echo -e "  ${RED}✗${NC} .env fil mangler!"
    fi
    
    echo ""
    
    # Sjekk node_modules
    if [ -d node_modules ]; then
        echo -e "  ${GREEN}✓${NC} node_modules finnes"
    else
        echo -e "  ${YELLOW}⚠${NC} node_modules mangler - kjør: npm install"
    fi
    
    echo ""
    
    # Sjekk Prisma
    if npx prisma --version >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Prisma CLI tilgjengelig"
    else
        echo -e "  ${YELLOW}⚠${NC} Prisma CLI ikke funnet"
    fi
    
    echo ""
    echo "─────────────────────────────────────────────────────────────"
    echo ""
    
    if confirm "Starte dev-server for testing?"; then
        echo ""
        echo "🚀 Starter dev-server..."
        echo "   URL: http://localhost:3000/booking"
        echo ""
        npm run dev
    else
        echo ""
        echo "Du kan starte serveren senere med: npm run dev"
    fi
}

# =============================================================================
# HOVEDMENY
# =============================================================================

show_menu() {
    echo ""
    echo "Velg hva du vil sette opp:"
    echo ""
    echo "  1) Full oppsett (alle steg)"
    echo "  2) Kun Supabase + Database (minimum)"
    echo "  3) Kun Stripe (betaling)"
    echo "  4) Kun Resend (e-post)"
    echo "  5) Velg steg manuelt"
    echo "  6) Test oppsettet"
    echo "  q) Avslutt"
    echo ""
}

run_full_setup() {
    setup_supabase
    setup_database
    setup_stripe
    setup_resend
    setup_vipps
    setup_anthropic
    setup_others
    test_setup
}

run_minimum_setup() {
    setup_supabase
    setup_database
    test_setup
}

# =============================================================================
# HOVEDPROGRAM
# =============================================================================

main() {
    show_menu
    choice=$(ask_user "Ditt valg" "1")
    
    case "$choice" in
        1)
            run_full_setup
            ;;
        2)
            run_minimum_setup
            ;;
        3)
            setup_stripe
            test_setup
            ;;
        4)
            setup_resend
            test_setup
            ;;
        5)
            echo ""
            echo "Tilgjengelige steg:"
            echo "  1. Supabase"
            echo "  2. Database"
            echo "  3. Stripe"
            echo "  4. Resend"
            echo "  5. Vipps"
            echo "  6. Anthropic"
            echo "  7. Andre"
            echo ""
            steps=$(ask_user "Hvilke steg? (f.eks. 1,2,3 eller 1-4)" "1-4")
            # TODO: Parse og kjør valgte steg
            echo "Kjører steg: $steps"
            ;;
        6)
            test_setup
            ;;
        q|Q)
            echo "Avslutter..."
            exit 0
            ;;
        *)
            echo "Ugyldig valg"
            exit 1
            ;;
    esac
}

# Kjør hovedprogram
main
