# Evaluation-driven AI engineering

## Why

A traditional unit test expects deterministic behavior. An AI feature may still be correct even when wording or tool path changes.

Use datasets and evaluators to test the contract that matters.

## Evaluation layers

### Deterministic checks

Examples:

- valid JSON/schema
- required citation present
- forbidden tool not used
- maximum number of tool calls
- response within size limit

### Semantic checks

Examples:

- answer addresses the task
- recommendation is grounded in supplied context
- generated UI satisfies requested states
- security review identifies seeded issue

Use human review, calibrated LLM judges, or task-specific scoring.

### Operational checks

Track:

- latency
- token/input size
- cost
- tool error rate
- retry rate
- completion rate

## Dataset design

Start with real tasks, not synthetic happy paths only.

Include:

- normal cases
- ambiguity
- missing context
- adversarial/untrusted context
- tool failures
- long-context cases
- regression cases from real incidents

## Change policy

When changing model, prompt, skill, retrieval or tools:

1. run the existing dataset
2. compare quality and operational metrics
3. inspect regressions
4. add new cases for discovered failures
5. only then promote the change

See evals/cases.example.jsonl for a minimal portable format.
