# Long-running agents

## Problem

Long tasks fail when critical state exists only in one conversation window.

Even if a model supports long context, accumulated history can become noisy, contradictory, or expensive.

## Durable state

Keep critical state outside the conversation:

- execution plan
- task graph
- decisions
- current failures
- evidence
- next action
- git ref

## Checkpoint after verifiable units

A checkpoint should be created when:
- a testable slice is complete
- architecture decision changes
- a blocker appears
- context is about to reset
- ownership moves to another agent

## Handoff packet

A useful handoff answers:

1. What is the goal?
2. What has been completed?
3. What exact ref/worktree is current?
4. What evidence passed?
5. What currently fails?
6. What decisions were made and why?
7. What is the next concrete action?
8. What must not be redone?

Do not write a narrative diary.

## Context reset vs compaction

Compaction preserves continuity but can retain stale assumptions.

A clean reset with a high-quality handoff can be better when:
- the task changed phase
- the current agent is stuck in a local optimum
- context has accumulated conflicting paths
- an independent perspective is valuable

Use resets as an engineering tool, not a ritual.

## Session pickup

A fresh agent should start by reading:

1. AGENTS.md
2. task contract / exec plan
3. handoff
4. relevant architecture docs
5. current diff/status
6. latest verification evidence

It should not require reconstructing the task from chat history.

## Stop conditions

Long-running loops need explicit limits:

- max iterations
- max wall time
- max cost/tokens
- repeated identical failure threshold
- escalation condition

A loop without stop conditions is not autonomy; it is an unbounded retry.
