# Verification-first engineering

Generation is cheap; trustworthy verification is the scaling constraint.

An agent that cannot inspect the real behavior leaves the human as the serial QA bottleneck.

## Evidence pyramid

From cheapest to strongest:

1. **syntax/static** — formatter, typecheck, lint, dependency rules
2. **unit** — local behavior and edge cases
3. **integration/contract** — component boundaries and external contracts
4. **product-drive** — operate the actual UI/API/CLI as a user would
5. **observability** — logs, traces, metrics, profiles, resource behavior
6. **independent review** — another context/model attempts to falsify the claim

Use the cheapest layer that can actually prove the acceptance criterion. High-risk changes should combine layers.

## Reproduce before fix

For a bug:

1. write a precise reproduction
2. capture failure evidence
3. add a regression test when feasible
4. implement
5. rerun the same reproduction
6. capture resolution evidence

A change that cannot reproduce the original failure has weak causal evidence.

## Feature maps

A feature map makes the product operable by agents.

For each user-facing capability record:

- what it is
- how to start the app/service
- route/entry point
- prerequisites/fixtures
- stable selectors, API calls or CLI commands
- expected visible state
- relevant logs/traces/metrics
- verification recipe

Use `templates/FEATURE_MAP.md`.

## Evidence ledger

Every important workflow node should emit evidence.

Good evidence:

- test command + exit status
- screenshot/video/artifact path
- before/after metric
- trace/profile path
- exact reproduction steps
- review finding IDs and disposition
- commit/diff identifier

Weak evidence:

- "looks good"
- "I checked it"
- confidence percentages
- restating the code

The harness records evidence file hashes so run artifacts can be audited.

## Verification independence

The implementer may perform first-pass checks, but high-confidence completion uses a verifier that starts from the acceptance criteria and observable behavior, not from the implementer's explanation.

Self-review is useful; self-certification is not.
