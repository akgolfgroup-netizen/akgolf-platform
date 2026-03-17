#!/bin/bash
# =============================================================================
# AK Golf Booking - Ultra-enkel Oppsett
# Kjør etter å ha fylt ut CONFIG.md
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AK Golf Booking - Oppsett                               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# HJELPEFUNKSJONER
# =============================================================================

update_env() {
    local key="$1"
    local value="$2"
    
    if grep -q "^$key=" .env 2>/dev/null; then
        sed -i '' "s|^$key=.*|$key=$value|" .env 2>/dev/null || sed -i "s|^$key=.*|$key=$value|" .env
    else
        echo "$key=$value" >> .env
    fi
    echo -e "  ${GREEN}✓${NC} $key"
}

ask() {
    read -rp "  $1: " value
    echo "$value"
}

confirm() {
    read -rp "  $1 (y/N): " response
    [[ "$response" =~ ^[Yy]$ ]]
}

# =============================================================================
# SJEKK FORUTSETNINGER
# =============================================================================

echo "📋 Sjekker forutsetninger..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "  ${GREEN}✓${NC} Opprettet .env fra mal"
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗${NC} npm ikke funnet. Installer Node.js først."
    exit 1
fi

echo ""

# =============================================================================
# 1. SUPABASE (DATABASE)
# =============================================================================

echo -e "${YELLOW}1️⃣  Supabase (Database)${NC}"
echo "   Hent fra: https://supabase.com/dashboard → Project Settings → API"
echo ""

SUPABASE_URL=$(ask "Project URL (https://...supabase.co)")
SUPABASE_ANON=$(ask "Anon Key (public)")
SUPABASE_SERVICE=$(ask "Service Role Key (secret)")

echo ""

update_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON"
update_env "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE"

# Database URL (auto-generert fra Supabase URL)
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's/https:\/\///' | sed 's/\.supabase\.co//' | sed 's/\.supabase\.red//')
DB_PASSWORD=$(ask "Database password (fra Supabase-oppsett)")
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"
update_env "DATABASE_URL" "$DATABASE_URL"

echo ""

# =============================================================================
# 2. VIPPS (BETALING - ANBEFALT)
# =============================================================================

echo -e "${YELLOW}2️⃣  Vipps MobilePay (Betaling)${NC}"
echo "   Hent fra: https://portal.vippsmobilepay.com → Developer → API Keys"
echo ""

VIPPS_MSN=$(ask "Merchant Serial Number")
VIPPS_CLIENT=$(ask "Client ID")
VIPPS_SUBKEY=$(ask "Subscription Key (Primary)")

echo ""

update_env "VIPPS_MERCHANT_SERIAL_NUMBER" "$VIPPS_MSN"
update_env "VIPPS_CLIENT_ID" "$VIPPS_CLIENT"
update_env "VIPPS_SUBSCRIPTION_KEY" "$VIPPS_SUBKEY"

echo ""

# =============================================================================
# 3. STRIPE (VALGFRITT - INTERNASJONALT)
# =============================================================================

echo -e "${YELLOW}3️⃣  Stripe (Valgfritt - internasjonalt)${NC}"

if confirm "Vil du sette opp Stripe?"; then
    echo "   Hent fra: https://dashboard.stripe.com → Developers → API keys"
    echo ""
    
    STRIPE_SECRET=$(ask "Secret Key (sk_test_...)")
    STRIPE_PUB=$(ask "Publishable Key (pk_test_...)")
    
    update_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET"
    update_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUB"
    echo ""
fi

# =============================================================================
# 4. RESEND (E-POST)
# =============================================================================

echo -e "${YELLOW}4️⃣  Resend (E-post)${NC}"
echo "   Hent fra: https://resend.com → API Keys"
echo ""

RESEND_KEY=$(ask "API Key (re_...)")

echo ""

update_env "RESEND_API_KEY" "$RESEND_KEY"
update_env "CONTACT_EMAIL" "post@akgolf.no"
update_env "FROM_EMAIL" "noreply@akgolf.no"

echo ""

# =============================================================================
# 5. DATABASE-MIGRASJONER
# =============================================================================

echo -e "${YELLOW}5️⃣  Database-migrasjoner${NC}"
echo ""

echo "  🔄 Installerer avhengigheter..."
npm install --silent

echo "  🔄 Kjører Prisma migrasjoner..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init

echo "  🔄 Genererer Prisma client..."
npx prisma generate

echo "  🔄 Seeder database med standarddata..."
npx prisma db seed 2>/dev/null || echo "  (Seed allerede kjørt)"

echo ""
echo -e "  ${GREEN}✓${NC} Database klar"
echo ""

# =============================================================================
# 6. VERIFISERING
# =============================================================================

echo -e "${YELLOW}6️⃣  Verifisering${NC}"
echo ""

echo "  Sjekker konfigurasjon:"

# Sjekk viktige variabler
for var in NEXT_PUBLIC_SUPABASE_URL DATABASE_URL VIPPS_MERCHANT_SERIAL_NUMBER RESEND_API_KEY; do
    if grep -q "^$var=" .env && ! grep -q "^$var=$" .env && ! grep -q "^$var=___" .env; then
        echo -e "    ${GREEN}✓${NC} $var"
    else
        echo -e "    ${YELLOW}⚠${NC} $var mangler"
    fi
done

echo ""

# =============================================================================
# FERDIG
# =============================================================================

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ Oppsett fullført!                                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "📋 Neste steg:"
echo ""
echo "  1. Fyll inn CONFIG.md med:"
echo "     • Priser for hver tjeneste"
echo "     • Åpningstider for hver dag"
echo "     • Hvilke tjenester som tilbys"
echo ""
echo "  2. Start dev-server:"
echo "     npm run dev"
echo ""
echo "  3. Åpne i nettleser:"
echo "     http://localhost:3000/booking"
echo ""
echo "  4. Logg inn i portalen:"
echo "     http://localhost:3000/portal"
echo ""
echo "📖 Dokumentasjon:"
echo "   • CONFIG.md - Fyll inn priser og tilgjengelighet"
echo "   • PRISER-OCH-TJENESTER.md - Komplett prisoversikt"
echo "   • TRENERE-OVERSIKT.md - Trener-informasjon"
echo ""

if confirm "Starte dev-server nå?"; then
    echo ""
    echo "🚀 Starter..."
    npm run dev
else
    echo ""
    echo "Start senere med: npm run dev"
fi
