# Learning loop

## Goal

The system should get easier to operate after each failure.

## Failure taxonomy

Classify failures before fixing them:

- missing knowledge
- missing tool
- bad tool ergonomics
- weak verification
- architecture ambiguity
- flaky environment
- context loss
- model capability
- requirement ambiguity
- security/policy boundary

## Encode the lesson at the lowest reliable layer

Preferred order:

1. data/type/schema
2. test
3. lint/static rule
4. deterministic tool
5. runtime guardrail
6. skill/playbook
7. documentation
8. prompt reminder

Lower layers are more reliable and cheaper at inference time.

## Reflection procedure

After a difficult task:

1. identify the point where the agent first went wrong
2. ask what missing capability allowed that
3. create a minimal regression case
4. implement the smallest structural fix
5. rerun the regression
6. add/modify a skill only if structure cannot encode the lesson

## Skill changes are code changes

For important skills:
- version them
- create eval cases
- compare baseline vs candidate
- use blinded or independent grading where practical
- inspect regressions, not only average score

## Doc gardening

Documentation decays.

A maintenance agent may:
- compare docs against code
- detect stale paths/commands
- open correction PRs
- update generated references

It should not silently rewrite architectural decisions without evidence.

## Entropy control

High-throughput agents create more opportunities for:
- duplicate abstractions
- dead code
- stale docs
- inconsistent naming
- dependency creep

Schedule cleanup work:
- unused dependency scans
- dead-code detection
- architecture lint
- docs freshness
- duplicate utility review
- test flake triage

Autonomy needs garbage collection.
