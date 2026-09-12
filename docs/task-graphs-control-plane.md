# Task graphs and control planes

## Why

Once several agents run in parallel, chat sessions stop being a scalable unit of coordination.

The durable unit should be a task with:
- status
- dependencies
- owner
- workspace
- evidence
- retries

## State machine

Recommended states:

```text
pending
  ↓ dependencies satisfied
ready
  ↓ claimed
running
  ├─ failure → retryable/failed
  ├─ blocked → blocked
  └─ evidence accepted → done
```

A task must be claimed atomically to avoid duplicate work.

## DAG rules

A valid graph:
- has unique IDs
- has no cycles
- references only known dependencies
- defines a verifiable outcome per task

Workers may only claim tasks whose dependencies are done.

## Control plane

The control plane can be:
- a JSON task graph
- GitHub Issues/Projects
- Linear
- another tracker

The important thing is not the product. It is that work state is externalized from agent sessions.

## Task contract

Each task should include:

- title
- goal
- dependencies
- scope
- allowed surfaces
- acceptance criteria
- verification commands
- risk level

## Retry policy

Retries should distinguish:

- transient infrastructure failure
- deterministic verification failure
- ambiguous requirement
- blocked dependency

Blindly restarting the same prompt is not a recovery strategy.

A useful retry changes something:
- fresh context
- new evidence
- different model
- narrower task
- updated tool
- escalated human decision

## Follow-up work

During execution, an agent may discover out-of-scope work.

Do not silently expand scope.

Create a new task with:
- evidence
- rationale
- dependency relation

This keeps current work bounded while preserving discoveries.

## Included implementation

`scripts/taskgraph.mjs` provides a provider-agnostic local state machine:

- validate
- ready
- claim
- complete
- fail
- status

It intentionally does not decide which model or coding CLI to launch. That adapter belongs at the edge.
