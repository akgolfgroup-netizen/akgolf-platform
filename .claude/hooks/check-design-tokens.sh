#!/bin/bash
# Check that TS/TSX files don't use hardcoded hex colors

FILE_PATH=$(jq -r '.tool_input.file_path' < /dev/stdin)

# Only check .tsx and .ts files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts)$ ]]; then
  exit 0
fi

# Skip node_modules, .next, and archive directories
if echo "$FILE_PATH" | grep -qE '(node_modules|\.next|archive)'; then
  exit 0
fi

# Check for hardcoded hex colors in brackets (e.g., bg-[#005840])
if grep -qE '(bg|text|border|fill|stroke|outline|ring|shadow|from|to|via)-\[#[0-9a-fA-F]{3,8}\]' "$FILE_PATH" 2>/dev/null; then
  jq -n --arg file "$FILE_PATH" '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "ask",
      "permissionDecisionReason": "Hardcoded hex color detected. Use Tailwind tokens from .claude/rules/design-system.md instead."
    }
  }'
  exit 0
fi

exit 0
