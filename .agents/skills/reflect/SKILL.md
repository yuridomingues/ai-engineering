---
name: reflect
description: Convert lessons from a completed or failed agent run into reusable repository improvements such as tests, policies, docs, skills, tools, or workflow changes. Use after expensive failures, repeated review comments, or long autonomous runs.
---
# Reflect

Do not merely write a retrospective.

For each meaningful failure ask:

1. Was knowledge missing?
2. Was a tool or observable missing?
3. Was the contract ambiguous?
4. Could a type/test/lint/policy prevent recurrence?
5. Was orchestration or ownership wrong?
6. Did verification fail to observe the real behavior?
7. Was the task routed to the wrong model/agent?

Prefer the strongest reusable fix:
type/schema -> test -> lint/policy -> workflow gate -> skill -> prompt reminder.

Add a regression eval when the failure concerns agent behavior.
