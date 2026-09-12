---
name: runtime-verification
description: Build and execute verification against the real application surface: browser, CLI, API, desktop app, simulator, storage, logs, metrics, traces, CPU or memory evidence. Use before declaring user-visible or operational behavior complete.
---
# Runtime Verification

## Determine the surface

Identify what the user/system actually touches:

- web
- CLI/TUI
- API/service
- desktop/Electron
- mobile
- library
- background job

## Find the drive path

Prefer repository-native tooling:
- Playwright/Cypress
- existing e2e harness
- CLI integration tests
- HTTP scripts
- simulator tooling
- debug protocols

If absent, create the smallest reusable verification adapter.

## Define proof before running

A proof should specify:
- action
- expected observable
- side effect
- evidence artifact

Example:
- action: submit form
- visible: success state
- side effect: row exists once
- evidence: screenshot + DB query result

## Capture baseline for bugs/perf

For bug fixes:
- reproduce before editing

For performance:
- capture timing/profile before editing

Without a baseline, improvement claims are weak.

## Run and classify

Return one of:
- pass
- fail
- inconclusive

Include exact commands and evidence locations.

## Cleanup

Stop only processes/instances created by the verification run.
Preserve evidence.
