---
name: architect
description: Define or review software boundaries, data shapes, state ownership, dependency direction, migration, failure semantics and observability before cross-module implementation.
---
# Architect

Use when a change crosses modules, introduces a service/integration, changes state ownership, or performs a risky refactor.

## Contract first

Decide:

- public inputs/outputs and schemas
- trust and validation boundaries
- state owner and lifecycle
- dependency direction
- synchronous vs asynchronous semantics
- retry/idempotency behavior
- failure representation
- migration and rollback/forward-fix path
- observability required to verify the design

Prefer an existing abstraction or deletion before adding a new layer.

## Output

Produce a small architecture decision that lists:

1. invariants
2. boundaries
3. rejected alternatives
4. migration sequence
5. verification strategy

If an architecture rule can be made mechanical, add or update architecture lint/config rather than relying only on prose.
