# Architecture map

This repository is an **agent engineering system**, not a prompt collection.

The control model is:

```text
human intent
   |
   v
engineering-mode router
   |
   v
workflow / task graph
   |
   +--> context scouts (read-only, parallel)
   +--> implementation workers (isolated worktrees)
   +--> deterministic checks
   +--> product verification
   +--> adversarial reviewers
   |
   v
integrator
   |
   v
human approval where judgment or production risk requires it
```

## System layers

1. **Intent layer** — task, acceptance criteria, non-goals, risk.
2. **Knowledge layer** — AGENTS.md as map; docs as system of record.
3. **Workflow layer** — explicit DAGs with dependencies and stop rules.
4. **Execution layer** — agents and tools operating in isolated environments.
5. **Verification layer** — evidence from tests, product behavior, observability and reviewers.
6. **Learning layer** — failures become tests, policies, skills or tooling.
7. **Control layer** — permissions, human approvals, CI and release boundaries.

## Repository map

- `AGENTS.md` — short entry point and navigation.
- `.agents/skills/` — reusable engineering playbooks.
- `.cursor/agents/` and `.opencode/agents/` — host adapters.
- `docs/agent-system/` — operating model and deeper references.
- `workflows/` — reusable task graphs.
- `harness/` — provider-neutral workflow state/control plane.
- `schemas/` — machine-readable contracts.
- `templates/` — execution plans, feature maps and evidence.
- `evals/` — behavior regression cases.
- `mcp/` — external capability interfaces.

## Design rule

Prefer the smallest reliable mechanism:

- deterministic function before LLM
- single agent before multi-agent
- explicit workflow before open-ended swarm
- read-only scout before writable worker
- mechanical invariant before prose rule
- evidence before confidence

See `docs/agent-system/operating-model.md`.
