# Orchestration

This directory contains the provider-neutral control-plane contracts.

The system deliberately separates **coordination** from **model execution**:

- `taskgraph.mjs`: owns dependency and task state
- `worktree.mjs`: owns workspace isolation
- `agent-runner.mjs`: thin Cursor/OpenCode process adapter
- verification evidence: owns completion proof


## Reusable playbooks

For common engineering shapes, start from `orchestration/playbooks/` instead of inventing a new process:

```bash
node scripts/playbook.mjs list
node scripts/playbook.mjs init feature --name my-feature --out .agent/my-feature.taskgraph.json
node scripts/taskgraph.mjs validate .agent/my-feature.taskgraph.json
```

The playbooks remain ordinary task graphs and therefore use the same claim, lock, evidence and retry semantics described below. Customize their generic acceptance criteria for the actual project before unattended execution.

## End-to-end multi-agent flow

### 1. Planner creates or edits a task graph

```bash
node scripts/taskgraph.mjs validate orchestration/example.taskgraph.json
node scripts/taskgraph.mjs ready orchestration/example.taskgraph.json
```

Tasks should represent bounded outcomes, not job titles.

### 2. Coordinator claims a ready task

```bash
node scripts/taskgraph.mjs claim orchestration/example.taskgraph.json \
  --task backend \
  --worker backend-1
```

The state file is locked atomically during mutation, so two coordinator processes cannot claim the same task through this local control plane.

### 3. Create an isolated worktree

```bash
node scripts/worktree.mjs create backend main
```

Parallel workers should not share a working tree.

### 4. Prepare a task packet

Use `templates/SPRINT_CONTRACT.md` or `templates/AGENT_TASK.md`. It should contain:

- outcome
- scope
- acceptance criteria
- verification
- relevant references

Do not include unnecessary repository history.

### 5. Launch a provider

The runner is **dry-run by default**. For OpenCode it prefers the separately installed `opencode2` beta when present and otherwise falls back to `opencode`; use `--binary` to pin a specific executable.

Cursor:

```bash
node scripts/agent-runner.mjs \
  --provider cursor \
  --cwd ../my-repo.worktrees/backend \
  --prompt-file task.md
```

OpenCode:

```bash
node scripts/agent-runner.mjs \
  --provider opencode \
  --cwd ../my-repo.worktrees/backend \
  --agent backend-engineer \
  --prompt-file task.md
```

Review the printed command, then add `--execute`.

Concrete model selection is optional and intentionally outside the task graph.

### 6. Verify independently

A runtime verifier should inspect the actual ref and produce structured evidence following:

```text
verification/evidence.schema.json
```

A builder summary is not evidence.

### 7. Complete only with passing evidence

```bash
node scripts/taskgraph.mjs complete orchestration/example.taskgraph.json \
  --task backend \
  --evidence verification/backend.evidence.json
```

Completion rejects invalid JSON and any result other than `pass`.

### 8. Integrate in dependency order

The integration engineer combines completed units, resolves contract mismatches, and reruns cross-task checks.

## Why no auto-spawn-all command?

Blindly spawning every ready task can create cost, resource contention, and correlated bad work. The reusable core exposes the primitives; a project can add its own scheduler with explicit concurrency and budget policies.

`configs/harness.example.json` provides policy fields for those limits.
