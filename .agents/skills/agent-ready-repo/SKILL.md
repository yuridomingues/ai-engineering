---
name: agent-ready-repo
description: Audit and improve a repository for autonomous coding agents by adding maps, deterministic commands, runtime verification, isolation, architecture boundaries, observability access, task artifacts, and mechanical guardrails.
---
# Agent-ready repository

## Audit

Check:

1. map: can a fresh agent find the subsystem?
2. boot: can it start from a clean checkout?
3. test: are checks deterministic?
4. verify: can it drive the real product?
5. isolate: can multiple workers run independently?
6. observe: can it query logs/traces/state?
7. architecture: are dependency rules explicit?
8. context: are decisions/docs versioned?
9. handoff: can a new session resume?
10. guardrails: which rules are mechanically enforced?

## Improve in leverage order

Prefer:
1. fix broken bootstrap
2. add one-command test/verify
3. expose runtime evidence
4. add feature/system map
5. enforce architecture boundaries
6. add task/handoff artifacts
7. add skills only after deterministic gaps are addressed

## Rule

Do not optimize for agent instructions while the environment itself is opaque or flaky.
