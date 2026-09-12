# Agent engineering operating model

## The change in engineering work

When coding agents become capable, the engineering bottleneck shifts from typing code to designing an environment where correct work is easy to produce and easy to verify.

The human role moves upward:

- choose outcomes
- define acceptance criteria
- encode architecture
- expose observability
- design feedback loops
- decide where judgment is required

Agents execute inside those constraints.

## Default loop

For non-trivial work:

1. **Frame** — define outcome, non-goals, risk and proof of completion.
2. **Investigate** — read code/history/docs before editing.
3. **Design** — settle boundaries, data shapes and ownership.
4. **Prove failure** — for bugs, reproduce first; for behavior changes, establish a baseline.
5. **Implement** — smallest coherent change.
6. **Verify deterministically** — tests, typecheck, lint, structural rules.
7. **Verify behavior** — operate the real product or closest faithful environment.
8. **Interrogate** — independent reviewers try to falsify correctness.
9. **Integrate** — resolve feedback, rerun gates and produce evidence.
10. **Reflect** — if the run exposed a repeatable failure mode, encode it.

## Autonomy ladder

Do not jump straight to unattended agents.

- **L0 — assist:** agent suggests, human edits.
- **L1 — supervised edit:** agent edits, human verifies every result.
- **L2 — self-verifying:** agent can run deterministic and product checks.
- **L3 — independently reviewed:** separate verifier/reviewer agents challenge the change.
- **L4 — bounded autonomous:** isolated worktree, explicit workflow, evidence ledger, stop rules.
- **L5 — continuous:** task queue/control plane assigns bounded work automatically.

Increase autonomy only when verification capacity rises with it.

## What multi-agent means here

Multi-agent is useful when work can be separated by **information, ownership or independent judgment**.

Good splits:

- scouts research independent evidence sources
- workers own disjoint files/components
- multiple candidates solve the same problem for an arena
- reviewers independently attack a finished diff
- verifier operates the product without inheriting the implementer's assumptions

Bad split:

- five agents with different job titles all reading and editing the same files
- a reviewer that only repeats the implementer's rationale
- parallel workers sharing one writable checkout
- a supervisor whose only job is forwarding text between agents

## Stop conditions

Every loop needs an external stop rule such as:

- tests pass
- target metric reached
- reproduced failure no longer reproduces
- visual or API contract matches expected result
- all blocking review findings resolved
- retry/time/cost budget exhausted

"Agent says done" is not a stop condition.
