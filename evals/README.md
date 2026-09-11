# Evals

Use this folder for portable AI behavior regression cases.

The example JSONL format is intentionally vendor-neutral.

Recommended fields:

- id: stable case identifier
- input: task/input presented to the system
- context: optional controlled context
- expected: deterministic expectations or semantic rubric
- tags: slices such as happy-path, injection, tool-failure, long-context

Do not put production secrets or personal data in datasets.

For a real project, add an executable harness that records:

- pass/fail or score per case
- model/provider
- prompt/skill version
- latency
- cost/tokens
- tool calls
