---
name: tdd
description: Establish a failing regression test or measurable baseline before implementation, then make the smallest change that turns it green. Use for bug fixes and behavior changes where deterministic testing is feasible.
---
# TDD

1. Express the behavior at the highest stable contract level practical.
2. Run it before the fix and confirm the expected failure reason.
3. Implement the smallest causal change.
4. Run the focused test.
5. Run the relevant surrounding suite.
6. Keep the test independent of incidental implementation details.

If a deterministic test is not feasible, capture a runtime baseline and use the same verification recipe before and after.
