---
name: add-ai-protection
description: Security layer for AI endpoints — detects prompt injection, blocks PII exposure, enforces token budgets, and validates AI inputs/outputs
globs: ["**/api/ai/**", "**/api/portal/ai/**", "**/lib/portal/ai/**"]
---

# Add AI Protection

Security patterns for protecting AI-powered endpoints from common attack vectors.

## When to Apply

Apply these protections to any endpoint that:
- Accepts user input and passes it to an LLM
- Returns AI-generated content to users
- Processes user data through AI pipelines

## 1. Prompt Injection Detection

Before sending user input to any LLM, scan for injection attempts:

```typescript
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now/i,
  /system\s*:\s*/i,
  /\bact\s+as\b/i,
  /\brole\s*:\s*system\b/i,
  /\<\/?system\>/i,
  /\[INST\]/i,
  /\<\|im_start\|\>/i,
];

function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(input));
}
```

**Action:** If injection detected, return 400 with generic error. Never reveal which pattern matched.

## 2. PII Filtering

Strip or redact PII before logging or storing AI interactions:

- Email addresses
- Phone numbers
- Norwegian personal numbers (fodselsnummer: 11 digits)
- Credit card numbers
- Physical addresses

**Rule:** Never log the full user prompt or AI response in production. Log only metadata (token count, latency, success/failure).

## 3. Token Budget Enforcement

Set hard limits per request and per user per day:

```typescript
const TOKEN_LIMITS = {
  perRequest: 4096,      // Max input tokens per request
  perResponseMax: 2048,  // Max output tokens
  perUserPerDay: 50000,  // Daily budget per user
};
```

**Action:** Track usage in database. Return 429 when budget exceeded.

## 4. Input Validation

Before any AI call:

1. **Length check:** Reject inputs over max character limit
2. **Rate limit:** Max N requests per minute per user
3. **Content type:** Validate input is text, not binary/encoded data
4. **Sanitize:** Strip HTML tags, control characters, null bytes

```typescript
function validateAIInput(input: string): { valid: boolean; error?: string } {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: "Input required" };
  }
  if (input.length > 10000) {
    return { valid: false, error: "Input too long" };
  }
  if (detectInjection(input)) {
    return { valid: false, error: "Invalid input" };
  }
  return { valid: true };
}
```

## 5. Output Validation

Before returning AI responses to users:

1. **Strip system information:** Remove any leaked system prompts or internal instructions
2. **Content safety:** Check for harmful content in responses
3. **Format validation:** Ensure response matches expected schema
4. **Truncation:** Enforce max response length

## 6. Error Handling

- Never expose AI provider errors directly to users
- Never include the original prompt in error responses
- Log errors server-side with request ID for debugging
- Return generic "Something went wrong" to client

## Checklist

When reviewing AI endpoints:

- [ ] User input is validated before LLM call
- [ ] Prompt injection detection is active
- [ ] Token limits are enforced
- [ ] Rate limiting is in place
- [ ] PII is not logged
- [ ] AI errors are not leaked to client
- [ ] System prompts are not exposed in responses
- [ ] Output is validated before returning
