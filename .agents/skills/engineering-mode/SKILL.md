---
name: engineering-mode
description: Route any non-trivial software engineering task into the smallest rigorous agent workflow: investigation, bug fix, feature, refactor, performance, architecture, multi-agent DAG, arena, or long-running execution. Use as the default entry point for serious engineering work.
---
# Engineering Mode

## Objective

Turn a user goal into a verifiable engineering outcome while spending the least orchestration overhead necessary.

## Classify first

Choose one:

- investigation: read-only understanding
- bug: reproduce -> root cause -> fix -> verify
- feature: contract -> implement -> user-path verify
- refactor: preserve behavior -> structural checks
- performance: baseline -> trace -> change -> compare
- architecture: alternatives -> constraints -> decision
- large project: task graph -> isolated workers -> integration
- uncertain design: arena -> judge -> synthesize
- critical review: adversarial verifier
- long-running: exec plan -> checkpoints -> handoffs

## Default loop

1. Inspect the repository and relevant runtime surface.
2. State the observable outcome.
3. Define how it will be verified.
4. Decide whether a second agent adds real value.
5. Implement the smallest coherent change.
6. Run verification.
7. If verification fails, diagnose from evidence and loop.
8. Report evidence and remaining uncertainty.

## Escalate topology only when needed

Do not spawn a team for a one-file fix.

Use planner/builder/verifier when:
- requirements are ambiguous
- quality is partly subjective
- work spans multiple phases
- self-review bias is costly

Use a DAG when:
- tasks are independently executable
- dependencies are explicit
- each worker can have an isolated workspace

Use arena when:
- there are multiple legitimate approaches
- diversity is more valuable than shared context

## Non-negotiable

Do not declare behavioral success from code inspection alone when the real artifact can be run.
