---
name: task-graph
description: Decompose large engineering work into a dependency DAG with isolated ownership, verifiable outcomes, and controlled parallelism. Use for migrations, multi-repo work, large features, sweeps, or multi-agent execution.
---
# Task Graph

## Decompose by dependency, not by job title

Each task needs:
- id
- outcome
- scope
- dependencies
- acceptance criteria
- verification

Good:
- add canonical schema
- migrate API adapter
- update client to new contract
- run end-to-end compatibility suite

Weak:
- backend agent
- frontend agent
- testing agent

## DAG checks

Before execution:
- unique IDs
- no cycles
- no unknown dependencies
- no two tasks require concurrent edits to the same fragile surface
- every leaf has a verification path

## Execution

- claim one ready task atomically
- use an isolated workspace
- record base ref
- complete only with evidence
- create follow-up tasks for out-of-scope discoveries
- unblock dependents only after completion

Use scripts/taskgraph.mjs for the local reference implementation.
