# Verification system

## Core rule

Verification is a first-class product surface for agents.

If a human must manually perform every check, the human remains the serial bottleneck.

## Evidence hierarchy

### L1 Static

- typecheck
- lint
- schema validation
- architecture boundaries

Useful but insufficient for runtime behavior.

### L2 Unit and property

Proves local behavior.

Prefer:
- observable outcomes
- literal expected values
- property tests for invariants

Avoid tests that merely mirror implementation.

### L3 Contract/integration

Proves boundaries:
- API contract
- DB interaction
- queues
- external adapters
- migration compatibility

### L4 Runtime

Launch the real artifact:
- service
- CLI
- desktop app
- mobile simulator
- browser app

### L5 User-path

Drive it as the user does:
- browser automation
- terminal/PTY
- simulator
- real HTTP client

Capture action + resulting state.

### L6 Operational

Inspect:
- logs
- metrics
- traces
- persistence
- network behavior

### L7 Non-functional

For relevant changes:
- latency
- CPU
- heap/memory
- bundle size
- load behavior
- security checks

### L8 Adversarial

Independent reviewer attempts to invalidate the result.

## Evidence ledger

Every substantial verification should be able to produce:

```json
{
  "claim": "checkout submits exactly one order",
  "method": "playwright + database readback",
  "command": "npm run verify:checkout",
  "result": "pass",
  "artifacts": ["artifacts/checkout.webm", "artifacts/db.json"],
  "ref": "abc123"
}
```

Do not store secrets or sensitive user data in evidence.

## Verify side effects

A green UI is not enough when the feature writes state.

Examples:
- upload → read stored object
- payment-like operation → inspect test ledger, not button state
- queue publish → inspect consumed message
- migration → query resulting schema/data
- CLI write → read resulting file

## Verification contracts

Before implementation, builder and verifier should agree on:
- behavior
- test data
- failure cases
- observables
- acceptance threshold

This prevents QA from grading a different product than the builder implemented.

## Inconclusive is a valid result

When evidence cannot be gathered, report:
- what was attempted
- why it failed
- what remains unknown

Never upgrade "could not test" into "looks correct".
