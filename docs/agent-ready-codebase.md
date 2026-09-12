# Agent-ready codebase

## Goal

A codebase is agent-ready when a capable agent can:

1. find the relevant subsystem
2. understand its constraints
3. run it locally
4. make a bounded change
5. verify behavior
6. recover from failure
7. hand work to another agent

without depending on tribal knowledge.

## 1. Repository map

Keep a short root map:
- architecture domains
- primary commands
- docs index
- test strategy
- verification entrypoint

Do not put every rule into AGENTS.md.

## 2. Knowledge as source of record

Prefer versioned repository artifacts:

```text
docs/
  architecture/
  product-specs/
  exec-plans/
    active/
    completed/
  generated/
  references/
  decisions/
```

A chat decision that affects future engineering should become a durable artifact.

## 3. Mechanical architecture

Good agent codebases have predictable dependency direction.

Examples:
- domain → application → adapters
- types → config → repository → service → runtime → UI

Enforce this with:
- import rules
- package boundaries
- lint
- structural tests
- schema generation

Documentation describes an invariant; tooling enforces it.

## 4. Deterministic developer experience

Provide one-command paths:

- bootstrap
- dev
- test
- verify
- lint
- typecheck
- seed/reset

Avoid setup steps that exist only in a person's memory.

## 5. Isolatable runtime

Parallel agents need:
- independent ports
- per-worktree data dirs
- disposable databases/fixtures
- independent browser profiles
- task-scoped logs

If two workers cannot run the app at the same time, parallelism is not safe.

## 6. Feature map

For user-facing systems, maintain a map from language users use to:
- route/command
- source module
- stable selector
- prerequisite state
- observable success

This lets an agent translate vague bug reports into reproducible paths.

## 7. Observability legibility

Expose:
- structured logs
- metrics
- traces
- crash output
- state inspection

Agents should be able to query these without a human reading dashboards for them.

## 8. Explicit boundaries

At external boundaries:
- validate
- normalize
- convert to domain types
- return structured errors

Inside the domain:
- trust validated types
- minimize defensive noise

## 9. Small verifiable units

Prefer changes that end in a valid state.

A good migration sequence:
- add new invariant
- migrate one bounded caller group
- verify
- continue
- delete old path

Avoid huge mixed diffs that cannot be attributed to a failing check.

## 10. Readiness questions

- Can an agent boot the app from a fresh checkout?
- Can it locate a feature from the user's vocabulary?
- Can it reproduce a bug without human clicking?
- Can it inspect logs/traces?
- Can two workers run independently?
- Can CI reject architecture drift?
- Can a new session resume from repository artifacts?
- Can the agent prove side effects, not only UI?
