# Local multi-agent dispatch

The provider-neutral harness tracks workflow state and evidence. It does not assume one model vendor.

`harness/dispatch.mjs` can invoke a ready workflow node through a local coding-agent CLI.

## OpenCode

The dispatcher prefers `opencode2` when installed, then falls back to `opencode`. Override with `--binary` if needed.

Dry-run:

```bash
node harness/dispatch.mjs .ai/runs/<run> investigate \
  --driver opencode --workspace /path/to/project
```

Execute:

```bash
node harness/dispatch.mjs .ai/runs/<run> investigate \
  --driver opencode --workspace /path/to/project --execute
```

Optional `--model provider/model` routes one node to a configured cloud or local model.

Custom OpenCode agents in this kit use `mode: all` so the same role can run directly from the CLI or as a subagent.

## Cursor

```bash
node harness/dispatch.mjs .ai/runs/<run> implement \
  --driver cursor --workspace /path/to/project --execute
```

Cursor has native subagents and worktrees. For concurrent writable work, prefer isolated worktrees/environments.

## Execution is not certification

A successful agent process does **not** mark a workflow node complete.

The node remains `running` until verification evidence is recorded:

```bash
node harness/workflow.mjs complete .ai/runs/<run> <node> \
  --evidence path/to/evidence.md \
  --summary "what this evidence proves"
```

This intentionally separates execution from certification.

The dispatcher inherits the credentials, permissions and billing of the local CLI. It defaults to dry-run and requires `--execute` to invoke a model.
