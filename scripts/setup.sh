#!/bin/bash

# AK Golf Booking System - Setup Script
# Dette scriptet setter opp prosjektet for første gangs bruk

set -e

echo "🚀 Setter opp AK Golf Booking System..."
echo ""

# Farger
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Sjekk at .env finnes
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo -e "${YELLOW}⚠️  .env ikke funnet. Kopierer fra .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env opprettet${NC}"
    echo -e "${YELLOW}⚠️  Viktig: Oppdater .env med dine faktiske verdier før du fortsetter!${NC}"
    exit 1
  else
    echo -e "${RED}✗ .env.example ikke funnet${NC}"
    exit 1
  fi
fi

echo "📦 Installerer avhengigheter..."
npm install

echo ""
echo "🔄 Genererer Prisma klient..."
npx prisma generate

echo ""
echo "🗄️  Kjører database migrasjoner..."
npx prisma migrate deploy

echo ""
echo "🌱 Seeder database med initial data..."
npx prisma db seed

echo ""
echo "✅ Setup fullført!"
echo ""
echo "Neste steg:"
echo "  1. Start utviklingsserver: npm run dev"
echo "  2. Åpne http://localhost:3000"
echo "  3. For produksjon: vercel --prod"
