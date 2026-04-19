#!/usr/bin/env bash
# Heritage Grid migrering — Steg 3 Gruppe A
# Renamer portal-* og --hg-* tokens til Heritage Material 3 semantic tokens.
# Grey-skala (bg-grey-*, text-grey-*) beholdes som permanente aliaser.

set -euo pipefail

# macOS sed requires empty arg for -i
SED_INPLACE=(-i '')

DIRS=("app" "components" "lib")

# Collect all target files via while-loop (macOS bash 3.2-kompatibel)
FILES=()
while IFS= read -r f; do
  FILES+=("$f")
done < <(find "${DIRS[@]}" \
  -type f \
  \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.next/*")

echo "Skanner ${#FILES[@]} filer..."

replace_in_file() {
  local file="$1"
  # Klasse-rename (må være word-boundary for å ikke treffe --color-portal-secondary osv.)
  # Bruk \b for word boundary i BSD sed (macOS)

  # Portal Tailwind-klasser
  sed "${SED_INPLACE[@]}" -E '
    s/[[:<:]]bg-portal-bg[[:>:]]/bg-surface/g
    s/[[:<:]]bg-portal-card[[:>:]]/bg-surface-container-lowest/g
    s/[[:<:]]bg-portal-hover[[:>:]]/bg-surface-container/g
    s/[[:<:]]bg-portal-muted[[:>:]]/bg-surface-container-high/g
    s/[[:<:]]text-portal-text[[:>:]]/text-on-surface/g
    s/[[:<:]]text-portal-secondary[[:>:]]/text-on-surface-variant/g
    s/[[:<:]]text-portal-muted[[:>:]]/text-outline/g
    s/[[:<:]]border-portal-border-subtle[[:>:]]/border-outline-variant\/50/g
    s/[[:<:]]border-portal-border[[:>:]]/border-outline-variant/g
    s/[[:<:]]shadow-portal-card-hover[[:>:]]/shadow-card-hover/g
    s/[[:<:]]shadow-portal-card[[:>:]]/shadow-card/g
    s/[[:<:]]shadow-portal-glow-green[[:>:]]/shadow-accent-glow/g
    s/[[:<:]]shadow-portal-glow-lime[[:>:]]/shadow-accent-glow/g
    s/[[:<:]]shadow-portal-glow-ai[[:>:]]/shadow-card/g
    s/[[:<:]]shadow-portal-floating[[:>:]]/shadow-card-hover/g
    s/bg-portal-border/bg-outline-variant/g
    s/bg-portal-text/bg-on-surface/g
    s/text-portal-bg/text-surface/g
    s/border-portal-text/border-on-surface/g
    s/border-portal-muted/border-outline/g
    s/bg-portal-muted/bg-surface-container-high/g
  ' "$file"

  # HG CSS-variabler (i var(--hg-*) og inline styles)
  sed "${SED_INPLACE[@]}" -E '
    s/var\(--hg-bg\)/var(--color-surface)/g
    s/var\(--hg-surface-raised\)/var(--color-surface-container)/g
    s/var\(--hg-surface-sunken\)/var(--color-surface-container-high)/g
    s/var\(--hg-surface\)/var(--color-surface-container-lowest)/g
    s/var\(--hg-text-secondary\)/var(--color-on-surface-variant)/g
    s/var\(--hg-text-muted\)/var(--color-outline)/g
    s/var\(--hg-text\)/var(--color-on-surface)/g
    s/var\(--hg-border-subtle\)/var(--color-outline-variant)/g
    s/var\(--hg-border-hover\)/var(--color-outline)/g
    s/var\(--hg-border\)/var(--color-outline-variant)/g
    s/var\(--hg-primary-glow\)/var(--shadow-accent-glow)/g
    s/var\(--hg-primary-muted\)/var(--color-surface-container)/g
    s/var\(--hg-primary\)/var(--color-on-surface)/g
    s/var\(--hg-success-bg\)/var(--color-primary-fixed)/g
    s/var\(--hg-success\)/var(--color-on-primary-fixed-variant)/g
    s/var\(--hg-error-bg\)/var(--color-error-container)/g
    s/var\(--hg-error\)/var(--color-error)/g
    s/var\(--hg-warning-bg\)/#fdf4e4/g
    s/var\(--hg-warning\)/#7a5520/g
    s/var\(--hg-info-bg\)/#eff6ff/g
    s/var\(--hg-info\)/#007aff/g
  ' "$file"

  # Portal CSS-variabler
  sed "${SED_INPLACE[@]}" -E '
    s/var\(--color-portal-bg\)/var(--color-surface)/g
    s/var\(--color-portal-card\)/var(--color-surface-container-lowest)/g
    s/var\(--color-portal-hover\)/var(--color-surface-container)/g
    s/var\(--color-portal-muted\)/var(--color-surface-container-high)/g
    s/var\(--color-portal-text\)/var(--color-on-surface)/g
    s/var\(--color-portal-secondary\)/var(--color-on-surface-variant)/g
    s/var\(--color-portal-border-subtle\)/var(--color-outline-variant)/g
    s/var\(--color-portal-border\)/var(--color-outline-variant)/g
  ' "$file"
}

changed=0
for file in "${FILES[@]}"; do
  # Sjekk om filen faktisk inneholder noen av mønstrene
  if grep -qE '(portal-(bg|card|hover|muted|text|secondary|border)|hg-(bg|surface|text|border|primary|success|error|warning|info))' "$file"; then
    replace_in_file "$file"
    changed=$((changed+1))
  fi
done

echo "Berørte filer: $changed"
