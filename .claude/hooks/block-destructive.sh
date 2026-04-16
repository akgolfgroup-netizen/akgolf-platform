#!/bin/bash
# Block destructive rm commands

COMMAND=$(jq -r '.tool_input.command' < /dev/stdin)

# Block rm -rf /, rm -rf ~, rm -rf /*, and other dangerous patterns
if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(/|~|/\*|\.\.|\.)\s*$'; then
  jq -n '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "Destructive command blocked by hook: cannot remove root, home, or current directory"
    }
  }'
  exit 0
fi

# Block rm -rf without specific targets (too broad)
if echo "$COMMAND" | grep -qE '^rm\s+-rf\s*$'; then
  jq -n '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "Destructive command blocked: rm -rf requires a specific target"
    }
  }'
  exit 0
fi

exit 0
