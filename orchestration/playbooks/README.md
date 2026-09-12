# Engineering playbooks

These are reusable **task DAG templates** for the existing provider-neutral control plane.

They encode software-engineering sequences, not model choreography.

Available templates:

- `feature.json` — frame -> investigate -> architecture -> baseline -> implement -> deterministic/runtime verification -> adversarial review -> integration
- `bugfix.json` — reproduce -> root cause -> regression proof -> causal fix -> replay -> adversarial review
- `refactor.json` — baseline -> target architecture -> characterization -> structural change -> behavior comparison
- `arena.json` — frozen rubric -> isolated candidates -> judge -> coherent integration -> verification
- `performance.json` — baseline -> profile -> hypothesis -> change -> remeasure -> tradeoff review

## Instantiate

```bash
node scripts/playbook.mjs list

node scripts/playbook.mjs init feature \
  --name billing-export \
  --out .agent/billing-export.taskgraph.json
```

Then edit the instantiated graph so generic acceptance criteria become project-specific.

Validate it:

```bash
node scripts/taskgraph.mjs validate .agent/billing-export.taskgraph.json
```

Claim only ready tasks and use separate worktrees for concurrent writable tasks.

## Important

The `agent` property is routing metadata. The graph is still decomposed by **outcome and dependency**, not by job title.

A task is complete only through the existing evidence gate in `scripts/taskgraph.mjs`.

Playbooks are defaults, not bureaucracy. For trivial work, use a single agent and direct verification.
