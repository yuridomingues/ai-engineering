# Local multi-agent dispatch

The provider-neutral harness tracks workflow state and evidence. It does not assume one model vendor.

`harness/dispatch.mjs` can invoke a ready workflow node through a local CLI.

## OpenCode

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

Optional `--model provider/model` lets you route a node to a configured cloud or local model.

## Cursor

```bash
node harness/dispatch.mjs .ai/runs/<run> implement \
  --driver cursor --workspace /path/to/project --execute
```

Cursor has its own worktree and subagent primitives. For concurrent writable work, prefer an isolated worktree/session rather than several agents sharing one checkout.

## Important separation

A successful agent process does **not** mark a workflow node complete.

The node remains `running` until verification evidence is recorded:

```bash
node harness/workflow.mjs complete .ai/runs/<run> <node> \
  --evidence path/to/evidence.md \
  --summary "what this evidence proves"
```

This intentionally separates execution from certification.

The dispatcher is local automation. It inherits the permissions, credentials and billing of the CLI you run. It defaults to dry-run and requires `--execute` to invoke a model.
