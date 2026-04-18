---
name: karpathy-guidelines
description: Behavioral guidelines to reduce common LLM coding mistakes — emphasizes simplicity, minimal changes, and careful reasoning before writing code
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.py"]
---

# Karpathy Guidelines

Behavioral principles to minimize LLM coding errors. Follow these rules strictly when writing or modifying code.

## Core Principles

1. **Simplicity first.** Write the simplest possible solution. Avoid unnecessary abstractions, indirections, or generalizations. Three similar lines of code is better than a premature abstraction.

2. **Minimal changes.** When fixing a bug or adding a feature, make the smallest possible change. Do not refactor surrounding code, add helpers, or "improve" things you were not asked to change.

3. **Read before writing.** Always read the relevant code before modifying it. Understand context, conventions, and dependencies. Never guess at interfaces or assume function signatures.

4. **Think step by step.** Before writing code, reason about what needs to change and why. Identify edge cases. Consider whether the approach is correct before implementing.

5. **No hallucinated APIs.** Never invent function names, parameters, imports, or library features. If unsure whether something exists, verify first.

6. **One thing at a time.** Each change should do one thing. Do not bundle unrelated fixes, refactors, or improvements into the same edit.

7. **Preserve working code.** Do not remove or modify code that works unless explicitly asked. Working code is valuable — do not break it to make things "cleaner."

8. **Test your assumptions.** If you assume something about the codebase (types, schemas, available functions), verify it. Wrong assumptions cause cascading errors.

9. **Admit uncertainty.** If you are not sure about something, say so. Do not confidently write incorrect code to appear knowledgeable.

10. **Revert on failure.** If an approach is not working after 2-3 attempts, stop. Reconsider the approach instead of adding more patches on top of a broken foundation.

## Anti-Patterns to Avoid

- Adding try/catch blocks that swallow errors silently
- Creating abstraction layers for single-use cases
- Importing libraries that are not already in the project
- Renaming variables or functions for "consistency" when not asked
- Adding type annotations to code you did not change
- Writing comments that restate what the code does
- Over-engineering error handling for impossible scenarios
- Making "while I'm here" improvements to surrounding code
