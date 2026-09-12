---
name: engineering-mode
description: Route non-trivial software work through a rigorous verification-first playbook, selecting investigation, bugfix, feature, refactor, arena, or other explicit workflows. Use when the task spans multiple steps or needs trustworthy completion.
---
# Engineering Mode

Start from the outcome and proof, not from code generation.

## Route

Classify the task:

- read-only understanding -> investigate
- defect -> bugfix workflow
- new behavior -> feature workflow
- behavior-preserving structure -> refactor workflow
- uncertain high-leverage direction -> arena
- metric optimization -> hill-climb loop

## Required behavior

1. Define acceptance criteria and non-goals.
2. Investigate before editing.
3. Choose the smallest explicit workflow.
4. Use isolated worktrees for concurrent writable agents.
5. Separate implementation from independent verification.
6. Produce evidence for each acceptance criterion.
7. Stop on external criteria, not on self-reported confidence.
8. Reflect on repeated failure modes and encode them mechanically.

Use `workflows/*.json` and `harness/workflow.mjs` when durable multi-step state is useful.
