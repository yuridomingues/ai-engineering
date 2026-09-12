---
name: arena
description: Generate multiple independent candidate solutions in isolated contexts, judge them against a predeclared rubric, and synthesize the strongest coherent result. Use when the best design or implementation is genuinely uncertain.
---
# Arena

Use diversity deliberately.

1. Freeze the problem statement and judging rubric first.
2. Spawn independent candidates with equivalent context.
3. Isolate writable candidates in separate worktrees.
4. Prevent candidates from reading each other's output before completion.
5. Judge against the rubric and evidence, not majority vote.
6. Integrate one coherent design; do not blindly merge incompatible fragments.
7. Verify the integrated result normally.

Arena is expensive. Do not use it for routine edits.
