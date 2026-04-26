#!/usr/bin/env bash
# Kopier env-vars fra ett Vercel-prosjekt til et annet via REST API.
# Bruker REST API for å omgå CLI 52.0.0-bug der `vercel env add VAR preview --value X --yes` ikke fungerer.
#
# Bruk:
#   ./scripts/copy-env-via-api.sh <source-project> <target-project>
# Eksempel:
#   ./scripts/copy-env-via-api.sh akgolf-portal akgolf-platform

set -euo pipefail

SOURCE_PROJECT="${1:?source-project mangler}"
TARGET_PROJECT="${2:?target-project mangler}"
TMP_FILE="_${SOURCE_PROJECT}_env.tmp"

# Skip Vercel-internal vars (auto-generert)
SKIP_PATTERN="^(VERCEL|TURBO_|NX_DAEMON)"

VERCEL_TOKEN=$(jq -r .token "${HOME}/Library/Application Support/com.vercel.cli/auth.json")
TEAM_ID=$(curl -s "https://api.vercel.com/v2/teams?slug=akgolfgroup-netizens-projects" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | jq -r '.id // .teams[0].id')

# Hent target project ID
TARGET_ID=$(curl -s "https://api.vercel.com/v9/projects/${TARGET_PROJECT}?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | jq -r '.id')

if [[ -z "${TARGET_ID}" || "${TARGET_ID}" == "null" ]]; then
  echo "✗ Fant ikke target-prosjekt: ${TARGET_PROJECT}"
  exit 1
fi

echo "→ Source: ${SOURCE_PROJECT}"
echo "→ Target: ${TARGET_PROJECT} (${TARGET_ID})"
echo "→ Henter env fra source..."

# Pull env fra source via vercel CLI
vercel link --yes --project "${SOURCE_PROJECT}" > /dev/null 2>&1
vercel env pull --environment=production "${TMP_FILE}" > /dev/null 2>&1

if [[ ! -s "${TMP_FILE}" ]]; then
  echo "✗ Ingen env-variabler funnet i source"
  rm -f "${TMP_FILE}"
  exit 1
fi

# Få liste over eksisterende vars i target (for å unngå duplikater)
echo "→ Henter eksisterende vars i target..."
EXISTING=$(curl -s "https://api.vercel.com/v10/projects/${TARGET_ID}/env?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | jq -r '.envs[].key' | sort -u)

echo "→ Kopierer vars (skipper VERCEL/TURBO/NX_DAEMON-prefix)..."

while IFS= read -r line; do
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue
  [[ ! "$line" =~ ^[A-Z_]+=.*$ ]] && continue

  KEY="${line%%=*}"
  VALUE="${line#*=}"
  VALUE="${VALUE%\"}"
  VALUE="${VALUE#\"}"

  # Skip auto-generated Vercel-internal vars
  if [[ "${KEY}" =~ ${SKIP_PATTERN} ]]; then
    echo "  · ${KEY} (skipped: auto-generated)"
    continue
  fi

  # Slett eksisterende hvis det er der (idempotent)
  if echo "${EXISTING}" | grep -qx "${KEY}"; then
    EXISTING_IDS=$(curl -s "https://api.vercel.com/v10/projects/${TARGET_ID}/env?teamId=${TEAM_ID}" \
      -H "Authorization: Bearer ${VERCEL_TOKEN}" | jq -r ".envs[] | select(.key==\"${KEY}\") | .id")
    for ID in ${EXISTING_IDS}; do
      curl -s -X DELETE "https://api.vercel.com/v9/projects/${TARGET_ID}/env/${ID}?teamId=${TEAM_ID}" \
        -H "Authorization: Bearer ${VERCEL_TOKEN}" > /dev/null
    done
  fi

  # Legg til via REST API for alle 3 environments
  RESPONSE=$(curl -s -X POST "https://api.vercel.com/v10/projects/${TARGET_ID}/env?teamId=${TEAM_ID}" \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg k "${KEY}" --arg v "${VALUE}" '{
      key: $k,
      value: $v,
      target: ["production", "preview", "development"],
      type: "encrypted"
    }')")

  if echo "${RESPONSE}" | jq -e '.created' > /dev/null 2>&1; then
    echo "  ✓ ${KEY} → prod+preview+dev"
  else
    ERR=$(echo "${RESPONSE}" | jq -r '.error.message // .error // "ukjent"')
    echo "  ✗ ${KEY} (feilet: ${ERR})"
  fi
done < "${TMP_FILE}"

rm -f "${TMP_FILE}"
echo "→ Ferdig. Trigger en re-deploy ved å pushe en commit eller via Vercel Dashboard."
