---
name: frontend-quality
description: Build and review production frontend interfaces with strong UX, accessibility, responsive behavior, state design, performance, and visual consistency. Use for UI implementation, redesigns, design systems, component work, or frontend review.
---
# Frontend Quality

## Before coding

Identify:

- primary user task
- information hierarchy
- supported breakpoints
- interaction states
- loading, empty, error and success states
- keyboard and screen-reader expectations
- existing design tokens/components

Do not start from decoration. Start from communication and task flow.

## Implementation rules

- Prefer semantic HTML before adding ARIA.
- Make every interactive control keyboard reachable.
- Preserve visible focus.
- Use responsive layout intentionally rather than shrinking desktop UI.
- Keep component APIs small and composable.
- Reuse existing tokens before inventing new values.
- Avoid hidden state and unnecessary global state.
- Do not introduce animation unless it communicates hierarchy, state or causality.
- Handle slow networks and partial data.
- Optimize images, fonts and client JavaScript where they affect real UX.

## Verification

Check:

1. desktop and narrow viewport
2. keyboard navigation
3. contrast and labels
4. loading/empty/error/success states
5. overflow and long content
6. disabled and pending actions
7. console/runtime errors
8. obvious performance regressions

When a browser automation tool is available, use it to verify behavior rather than relying only on code inspection.
