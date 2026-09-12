# Multi-agent orchestration patterns

Use explicit topology. Parallelism without ownership produces conflicts and duplicated reasoning.

## 1. Pipeline

`plan -> implement -> verify -> review -> integrate`

Use when steps have clear dependencies. This is the default.

## 2. Fan-out / fan-in

One task splits into independent branches, then an aggregator combines results.

Use for:

- researching code/history/docs in parallel
- independent test generation
- independent security/architecture reviews
- migration work across disjoint modules

Do not let branches write the same files unless the fan-in step is explicitly comparing candidates.

## 3. Supervisor / worker

A coordinator decomposes the goal and assigns bounded tasks.

Use when decomposition is dynamic but the coordinator has a clear global contract.

The supervisor should own:

- task graph
- dependencies
- budgets
- integration status

Workers should own:

- one bounded objective
- one isolated environment
- explicit outputs
- evidence

## 4. Arena

N agents receive the same problem in isolated contexts/worktrees. A judge compares outputs against a rubric, then an integrator takes the best design or combines compatible parts.

Use for high-leverage architecture, algorithms, UI alternatives or difficult debugging hypotheses.

Avoid majority voting. Judge against requirements and evidence.

## 5. Adversarial interrogation

Independent reviewers try to disprove a proposed change from different angles:

- correctness
- architecture
- security
- performance
- UX/accessibility

Reviewers should not see each other's conclusions before writing their own. Diversity of model can help when available, but context independence matters even with one model.

## 6. Handoff / swarm

Agents transfer control based on what they discover.

Use only where routing cannot be determined ahead of time. This is less predictable and harder to test than a graph.

Prefer a workflow DAG when the process is known.

## 7. Hill-climb loop

Repeat:

`measure -> hypothesize -> change -> measure -> accept/reject`

Use for performance, quality metrics or eval scores.

Each iteration must have:

- baseline
- one hypothesis
- measurable delta
- acceptance threshold
- iteration/time/cost cap

## 8. Blackboard

Agents write durable findings into shared artifacts rather than relying on chat history.

Examples:

- exec plan
- decision log
- evidence ledger
- feature map
- task state

The blackboard should be versioned or stored in a run directory and use stable schemas.

## Choosing a pattern

| Situation | Pattern |
| --- | --- |
| Normal feature | pipeline |
| Broad investigation | fan-out/fan-in |
| Large dynamic task | supervisor/worker |
| Unclear best implementation | arena |
| High-risk review | interrogation |
| Unknown routing | handoff |
| Metric optimization | hill-climb |
| Long-running/multi-session work | blackboard + any pattern |

The workflows in `/workflows` encode these patterns as explicit DAGs.
