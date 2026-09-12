---
name: runtime-forensics
description: Diagnose runtime failures or performance problems from evidence such as logs, traces, CPU profiles, heap snapshots, metrics, network activity, crash output, or persistence state. Use before guessing at fixes.
---
# Runtime Forensics

## Start with a symptom and baseline

Record:
- user-visible symptom
- environment
- timestamp/repro
- expected behavior
- actual behavior

## Pick evidence

Examples:
- CPU high -> CPU profile/flame graph
- memory growth -> heap snapshots/allocations
- latency -> distributed trace + timings
- idle activity -> event loop/task trace
- stale state -> DB/cache readback
- UI glitch -> video/screenshots + DOM state

## Root cause

Separate:
- correlation
- proximate cause
- root cause

Do not patch the first stack frame that looks suspicious.

## Verify fix

Replay the same evidence path before and after.
