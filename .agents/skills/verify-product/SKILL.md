---
name: verify-product
description: Prove software behavior by operating the real product or closest faithful environment and collecting reviewable evidence. Use for UI/API/CLI verification, bug reproduction, performance checks, or release confidence.
---
# Verify Product

Verification starts from acceptance criteria, not implementation rationale.

- Reproduce before fixing bugs.
- Use the actual UI/API/CLI when possible.
- Follow a project Feature Map when one exists.
- Capture commands, exit status, screenshots/traces/metrics or exact observable behavior.
- Repeat the same reproduction after the change.
- Distinguish verified facts from assumptions.
- Do not certify a change from code inspection alone when runtime behavior is the requirement.

If verification requires a capability the agent lacks, report the missing capability as infrastructure debt rather than guessing.
