#!/bin/bash
# Sletter Next.js og node_modules caches.
# Trygt — regenereres ved neste npm run dev / build.

set -e

cd "$(dirname "$0")/../.."

echo "Sletter .next/..."
rm -rf .next/

echo "Sletter node_modules/.cache/..."
rm -rf node_modules/.cache/

echo "Ferdig. Kjør 'npm run dev' eller 'npm run build' for å regenerere."
