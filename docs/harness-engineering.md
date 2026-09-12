# Harness engineering

## What a harness is

A model generates decisions and actions. A harness makes those actions useful over real software.

A production coding harness includes:

- context discovery
- task decomposition
- workspace isolation
- tool interfaces
- execution loop
- verification
- retries/recovery
- handoffs
- observability
- policy gates

The harness is where software engineering discipline meets model capability.

## The control loop

A useful default loop is:

```text
goal
 ↓
inspect
 ↓
contract
 ↓
change
 ↓
verify
 ├─ pass → review → done
 └─ fail → diagnose → change
```

The important property is that the loop terminates on **evidence**, not on the agent deciding it feels finished.

## Inner loop vs outer loop

### Inner loop

Owns one task:
- inspect
- implement
- run checks
- fix failures
- produce evidence

### Outer loop

Owns portfolio/work selection:
- choose next task
- detect blocked work
- spawn workers
- react to CI/review
- schedule follow-ups
- stop or escalate

Keeping these separate prevents one giant prompt from mixing product prioritization with implementation details.

## When to add more harness

Start with:
- one capable agent
- good tools
- strong verification

Add complexity only for observed failure modes:

| Failure | Harness response |
|---|---|
| under-scoped solution | planner/spec stage |
| self-review too lenient | independent verifier |
| long task loses state | handoff/checkpoint |
| many independent tasks | DAG + workers |
| design uncertainty | arena |
| repeated runtime bugs | verification skill/feature map |
| repeated architecture drift | structural lint |
| recurring issue pattern | regression eval + skill |

## Agent-native observability

Record enough to answer:

- what task was attempted?
- what code/ref was used?
- what tools ran?
- what artifacts changed?
- what checks ran?
- what evidence passed/failed?
- how much time/cost was consumed?
- where did a retry begin?

Do not log secrets or unnecessary sensitive content.

## Harness debt

Harness code can become stale as models improve.

A useful rule:
- periodically remove one layer
- rerun representative evals
- keep the layer only if it still provides measurable lift

The goal is not the most elaborate orchestration. It is the smallest harness that produces reliable outcomes.
