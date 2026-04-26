#!/usr/bin/env bash
# Kopier alle Production-env-variabler til Preview + Development for et Vercel-prosjekt.
#
# Bruk:
#   chmod +x scripts/sync-vercel-env.sh
#   ./scripts/sync-vercel-env.sh                      # default: akgolf-platform
#   ./scripts/sync-vercel-env.sh akgolf-website       # annet prosjekt
#
# Forutsetning: vercel CLI må være innlogget (`vercel whoami`) og prosjektet
# må være linket (kjør `vercel link --project <name>` først hvis ikke).

set -euo pipefail

PROJECT="${1:-akgolf-platform}"
TMP_FILE=".env.${PROJECT}-prod-tmp"

echo "→ Linker til Vercel-prosjekt: ${PROJECT}"
vercel link --yes --project "${PROJECT}" > /dev/null

echo "→ Henter Production-env..."
vercel env pull --environment=production "${TMP_FILE}" > /dev/null

if [[ ! -s "${TMP_FILE}" ]]; then
  echo "✗ Ingen env-variabler funnet i Production"
  rm -f "${TMP_FILE}"
  exit 1
fi

# Filtrer ut tomme linjer og kommentarer
COUNT=$(grep -cE "^[A-Z_]+=." "${TMP_FILE}" || echo 0)
echo "→ Fant ${COUNT} variabler. Synker til Preview + Development..."

while IFS= read -r line; do
  # Skip kommentarer og tomme linjer
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue
  [[ ! "$line" =~ ^[A-Z_]+=.*$ ]] && continue

  KEY="${line%%=*}"
  VALUE="${line#*=}"
  # Strip ledende/trailende quotes hvis de finnes
  VALUE="${VALUE%\"}"
  VALUE="${VALUE#\"}"

  for ENV in preview development; do
    # Slett først hvis variabelen allerede finnes i target-env (idempotent)
    # < /dev/null: forhindre at vercel spiser stdin fra while-loopen
    vercel env rm "${KEY}" "${ENV}" --yes < /dev/null > /dev/null 2>&1 || true
    # Legg til med --value (non-interactive, fungerer for både preview og development)
    vercel env add "${KEY}" "${ENV}" --value "${VALUE}" --yes < /dev/null > /dev/null 2>&1 \
      && echo "  ✓ ${KEY} → ${ENV}" \
      || echo "  ✗ ${KEY} → ${ENV} (feilet)"
  done
done < "${TMP_FILE}"

# Rydd opp
rm -f "${TMP_FILE}"
echo "→ Ferdig. Trigger en re-deploy ved å pushe en commit eller via Vercel Dashboard."
