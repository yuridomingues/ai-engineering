---
name: tdd
description: Establish a failing regression test or measurable behavioral baseline before implementation, then make the smallest causal change that turns the proof green.
---
# TDD / Baseline-first

## Red

Express the requested behavior at the highest stable contract level practical.

Run it before implementation and confirm it fails for the expected reason.

For a bug, reproduce the user/system symptom first.

## Green

Implement the smallest causal change needed to satisfy the proof.

Do not weaken the test to fit the implementation.

## Refactor

Only after green:

- improve structure
- rerun focused proof
- run relevant surrounding suite
- verify runtime behavior if the acceptance criterion is user-facing

## When deterministic tests are impractical

Capture a repeatable runtime baseline instead:

- exact action
- observable result
- side effect
- environment
- artifact/metric

Replay the same recipe after the change.

A baseline that changes between before/after conditions is not strong evidence.
