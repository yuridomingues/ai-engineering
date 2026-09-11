---
name: backend-api
description: Design and implement reliable backend services, APIs, persistence, queues, integrations, and background work. Use for server architecture, endpoints, data flows, jobs, or backend reviews.
---
# Backend API

## Start with contracts

For every operation define:

- caller
- input schema
- authorization rule
- side effects
- persistence boundary
- response schema
- idempotency expectation
- failure behavior
- observability

## Engineering rules

- Validate at trust boundaries.
- Keep business logic separate from transport adapters.
- Make retries safe when operations can be repeated.
- Use transactions where invariants require atomicity.
- Prefer explicit timeouts for network calls.
- Avoid unbounded concurrency.
- Treat queues as at-least-once unless proven otherwise.
- Store timestamps and identifiers consistently.
- Never return internal errors or secrets to clients.
- Add structured logs/metrics around important state transitions.

## API review

Check:

- authentication vs authorization
- rate limits where abuse is plausible
- pagination for unbounded collections
- consistent error format
- backward compatibility
- race conditions
- duplicate delivery/retry behavior
- data retention and deletion paths
- migration/rollback plan
