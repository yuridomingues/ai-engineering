---
name: adversarial-review
description: Independently try to break a proposed change by challenging assumptions, exploring blast radius, boundary cases, concurrency, failure modes, migrations, and verification gaps. Use for critical changes or before release.
---
# Adversarial Review

## Stance

Do not begin by explaining why the implementation is good.

Try to falsify the claim that it is safe and correct.

## Review

1. Restate the intended invariant.
2. Identify attacker/user/system-controlled inputs.
3. Trace blast radius.
4. Find boundary conditions.
5. Check concurrency/retry/partial failure.
6. Check backward/forward compatibility.
7. Inspect tests for false confidence.
8. Run targeted counterexamples where possible.
9. Distinguish confirmed issues from speculative risks.

## Output

For each issue:
- evidence
- impact
- reproduction
- remediation
- verification

If no issue is found, list what was actually attempted.
