#!/bin/bash
# scripts/backup-before-launch.sh
# Pre-launch backup for AK Golf Portal

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="${BACKUP_DIR}/akgolf_prod_${TIMESTAMP}.sql"

echo "🗄️  AK Golf Pre-Launch Backup"
echo "=============================="
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check for pg_dump
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump not found. Install PostgreSQL client tools."
    exit 1
fi

# Load env
if [ -f .env.local ]; then
    export $(grep DATABASE_URL .env.local | xargs)
elif [ -f .env ]; then
    export $(grep DATABASE_URL .env | xargs)
else
    echo "❌ No .env file found"
    exit 1
fi

echo "📦 Creating backup..."
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    echo "✅ Backup created: $BACKUP_FILE ($SIZE)"
    echo ""
    echo "📋 Tables in backup:"
    grep "CREATE TABLE" "$BACKUP_FILE" | wc -l | xargs echo "   "
else
    echo "❌ Backup failed"
    exit 1
fi
