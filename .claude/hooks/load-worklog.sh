#!/bin/bash
# Load WORKLOG.md context into the conversation

WORKLOG="$CLAUDE_PROJECT_DIR/WORKLOG.md"

if [ -f "$WORKLOG" ]; then
  CONTENT=$(cat "$WORKLOG")
  jq -n --arg content "$CONTENT" '{
    "hookSpecificOutput": {
      "hookEventName": "UserPromptSubmit",
      "additionalContext": "=== WORKLOG.md ===\n\n\($content)\n\n=== End WORKLOG ==="
    }
  }'
else
  exit 0
fi
