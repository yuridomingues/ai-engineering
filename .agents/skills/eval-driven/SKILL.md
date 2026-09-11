---
name: eval-driven
description: Create evaluation datasets, deterministic checks, semantic scoring, regression gates, and operational metrics for AI systems. Use when changing models, prompts, retrieval, tools, agents, or AI behavior.
---
# Evaluation Driven Development

## Build the dataset

Use real representative tasks whenever possible.

Include:

- normal cases
- ambiguous requests
- missing context
- tool failures
- adversarial/untrusted retrieved content
- long-context cases
- historical regressions

## Score the contract

Use deterministic checks first:

- schema validity
- exact required fields
- forbidden tool use
- citation presence
- bounds on calls/output

Use semantic evaluation only for behavior that cannot be reduced to deterministic assertions.

## Operational metrics

Track:

- success rate
- latency
- cost/tokens
- tool error rate
- retries
- human escalation
- safety/policy violations

## Change workflow

1. freeze a baseline
2. run candidate change
3. compare per-case deltas
4. inspect regressions, not only averages
5. add new regression cases
6. promote only when acceptance thresholds are met

Do not optimize only for one aggregate score.
