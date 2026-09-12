# Designing an agent-friendly codebase

The repository is part of the agent harness.

## 1. Make knowledge navigable

Keep `AGENTS.md` short. Treat it as a map, not an encyclopedia.

Put durable detail in structured docs:

- architecture
- product specs
- execution plans
- security/reliability
- feature maps
- generated schemas
- decision records

Prefer progressive disclosure.

## 2. Make correct actions obvious

Provide canonical commands for:

- setup
- test
- typecheck
- lint
- build
- run
- seed/reset
- verify a feature

One command should do one predictable thing.

## 3. Make the product legible

Agents need access to the same feedback a human engineer uses:

- browser/app automation
- logs
- metrics
- traces
- screenshots
- profiles
- network requests
- database state through safe interfaces

For UI systems, stable test IDs or accessibility semantics are better than brittle visual guessing.

## 4. Isolate work

Each concurrent writable agent should use an isolated branch/worktree or sandbox.

Benefits:

- no file races
- independent app instances
- clean evidence
- simple rollback
- parallel verification

See `harness/worktree.mjs`.

## 5. Encode architectural boundaries

Agents amplify existing patterns. Mechanical boundaries reduce drift.

Useful checks:

- allowed dependency directions
- public API boundaries
- schema validation at trust boundaries
- maximum file/module size
- forbidden imports
- structured logging
- migration invariants
- deterministic formatting

Write linter errors so they explain the remediation.

## 6. Prefer boring, inspectable systems

Agent leverage rises when behavior is visible from the repository.

Opaque magic, undocumented build steps and hidden conventions increase context cost.

## 7. Keep changes small and reversible

A high-throughput agent system benefits from:

- narrow PRs
- explicit feature flags
- migrations with rollback
- idempotent operations
- small commits tied to evidence

## 8. Continuously collect entropy

Repeated cleanup should become automation.

When a recurring failure appears, promote it in this order where possible:

`review comment -> documented rule -> test/lint/policy -> automated maintenance`

The goal is to pay for human judgment once and reuse it mechanically.
