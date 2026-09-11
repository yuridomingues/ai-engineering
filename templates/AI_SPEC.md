# AI feature specification

## 1. User outcome

Who is the user and what result should they get?

## 2. Why AI

What part genuinely benefits from probabilistic inference instead of deterministic software?

## 3. Input contract

Define required and optional inputs, validation and size limits.

## 4. Context

List each context source:

- repository/application data
- retrieval
- user-provided content
- external tools
- memory/state

For each source define trust level and freshness.

## 5. Architecture

Choose the simplest viable pattern:

- single inference
- structured output
- retrieval + inference
- tool calling
- agent loop
- MCP-backed tools
- multi-agent orchestration

Explain why more complex patterns are not needed.

## 6. Tool permissions

For every tool define:

- read/write/destructive behavior
- authentication/authorization
- input schema
- expected errors
- retry/idempotency behavior
- approval requirements

## 7. Output contract

Define the schema or human-facing behavior.

## 8. Failure modes

Include:

- missing context
- invalid output
- timeout
- model/provider unavailable
- tool failure
- unsafe/untrusted content
- user cancellation

## 9. Evals

Dataset:
- representative cases
- edge cases
- regression cases
- adversarial/untrusted content

Metrics:
- quality/success
- schema adherence
- latency
- cost
- tool errors
- escalation rate

Acceptance threshold:

## 10. Observability

Trace IDs, model/provider, latency, token/cost data, tool calls, errors and user feedback.

Never log secrets or unnecessary sensitive content.

## 11. Rollout

- feature flag
- fallback
- rate limits
- staged rollout
- rollback condition
