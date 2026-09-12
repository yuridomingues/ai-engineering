---
name: handoff
description: Create or consume a structured handoff for long-running or multi-agent engineering work so a fresh session can resume without relying on chat history.
---
# Handoff

## Write

Capture only durable state:

- goal
- current ref/worktree
- completed units
- passing evidence
- failing evidence
- decisions and reasons
- open questions
- exact next action
- do-not-repeat notes

Prefer links/paths to raw logs.

## Read

A receiving agent should:

1. verify current git state
2. rerun the cheapest critical check
3. confirm blockers are still current
4. continue from the explicit next action

Never assume the handoff is perfectly accurate; it is a checkpoint, not authority.
