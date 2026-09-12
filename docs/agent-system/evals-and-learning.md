# Evals, learning and guardrail accumulation

Skills and workflows are software. Treat changes to them as testable behavior.

## Eval dimensions

Score the behavior that matters:

- task completion
- correctness
- evidence quality
- tool selection
- architecture compliance
- security constraints
- unnecessary change size
- latency/cost
- escalation behavior

## Blind evaluation

To reduce grading bias:

1. keep candidate identity out of the task artifacts
2. let independent runners produce outputs
3. evaluate against a rubric written before seeing the outputs
4. use deterministic assertions wherever possible
5. optionally use a different model/context as semantic judge
6. inspect disagreement cases manually

Do not use an LLM judge as the only gate for security-critical behavior.

## Model matrix

A skill may behave differently across models.

For important workflows, test the models/providers you actually use instead of assuming portability.

## Failure -> infrastructure loop

After a failed run, classify the root cause:

- missing knowledge -> document/map it
- missing tool -> build/expose it
- ambiguous contract -> improve template/schema
- repeated coding mistake -> lint/test/policy
- bad orchestration -> change graph/ownership
- poor verification -> add observable evidence path
- model weakness -> route task differently or constrain it

Then add a regression case.

## Guardrail hierarchy

Prefer:

1. type system / schema
2. compiler/static analysis
3. deterministic test
4. custom lint/policy
5. workflow gate
6. skill instruction
7. free-form prompt reminder

Higher levels are more reliable and cheaper to repeat.
