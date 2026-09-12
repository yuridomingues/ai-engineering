# Software engineering patterns for agents

Agent-first engineering does not replace software engineering. It makes good structure more valuable because agents exploit explicit structure at high speed.

## 1. Domain boundaries

Use domain-oriented modules or bounded contexts.

A module should expose:
- explicit public interface
- domain types
- operations
- invariants

Avoid cross-domain imports into internal implementation.

## 2. Ports and adapters

Keep:
- business rules
separate from:
- HTTP
- database
- queues
- framework state
- vendor SDKs

Agents can then change an adapter without rewriting domain logic.

## 3. Parse at boundaries

External input is untrusted.

Pipeline:

```text
raw input
 → schema validation
 → normalized domain type
 → business logic
```

This reduces defensive conditionals throughout the codebase.

## 4. Make illegal states hard to represent

Use:
- discriminated unions
- enums with exhaustive handling
- branded semantic IDs where useful
- database constraints
- schema-derived types

A good type system becomes a machine-readable instruction set for agents.

## 5. Idempotency

Agentic workflows retry often.

Side-effecting operations should define:
- idempotency key
- deduplication behavior
- transaction boundary
- partial-failure recovery

## 6. Determinism

Prefer:
- pinned dependencies
- reproducible seeds
- hermetic-ish tests
- fake clock where time matters
- stable fixture builders

Flaky feedback poisons agent loops.

## 7. Contract tests

For APIs and integrations, encode compatibility at boundaries so independent agents can change producers/consumers without relying on memory.

## 8. Property-based testing

Use when the invariant matters more than a list of examples:
- parsers
- serializers
- financial-ish arithmetic in test contexts
- state machines
- transformations

## 9. Architecture tests

Turn structural intent into code:
- allowed import directions
- package visibility
- forbidden dependencies
- naming/layout conventions that carry semantics

## 10. Small coherent diffs

High agent throughput increases review pressure.

Prefer:
- one concept per commit
- behavior-preserving refactors separated from behavior changes
- generated migrations separate from app logic where practical
- explicit evidence per change

## 11. Observability by construction

Important operations should emit structured, queryable signals.

An agent debugging production-like behavior should be able to answer:
- what request?
- which state transition?
- which dependency?
- how long?
- what failed?

## 12. Operational simplicity

"boring" technology often helps agents:
- fewer hidden conventions
- stable APIs
- transparent storage
- standard tooling
- easy local reproduction

Choose cleverness only when it buys measurable value.
