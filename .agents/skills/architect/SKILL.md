---
name: architect
description: Settle software boundaries, types, data shapes, state ownership, dependency direction, migration and failure semantics before implementation. Use for cross-module changes, new services, major state changes, or risky refactors.
---
# Architect

Before code crosses a boundary, make the boundary explicit.

Decide:

- input/output data shapes
- validation/trust boundaries
- state owner and lifecycle
- dependency direction
- sync vs async semantics
- idempotency/retry behavior
- failure representation
- migration/rollback
- observability surface

Prefer subtraction and existing abstractions before adding layers.

Produce a small decision artifact. For substantial work, update an Exec Plan or ADR.
