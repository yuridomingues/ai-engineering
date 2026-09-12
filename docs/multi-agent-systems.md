# Multi-agent systems for software engineering

## Principle

More agents increase throughput only when work can be separated cleanly.

The unit of parallelism should be a **bounded outcome**, not a vague role.

## Topology 1: Single agent + verification loop

Use for:
- small features
- local bug fixes
- straightforward refactors

Strength:
- minimal coordination cost

Risk:
- self-evaluation bias

Mitigation:
- deterministic checks or external verifier when needed

## Topology 2: Planner → Builder → Verifier

Use for:
- ambiguous feature requests
- long implementations
- UI/product work
- changes where "done" needs negotiation

Flow:

```text
user intent
   ↓
planner → spec
   ↓
builder ↔ verifier contract
   ↓
builder
   ↓
verifier
   ├─ fail → feedback → builder
   └─ pass → release gate
```

The verifier should evaluate the artifact, not the builder's explanation.

## Topology 3: Supervisor + specialists

Use when one task spans domains:
- frontend
- backend
- database
- AI
- security

The supervisor:
- decomposes
- routes
- controls context
- resolves dependencies
- synthesizes evidence

Specialists should return compact artifacts rather than raw exploration logs.

## Topology 4: DAG + parallel workers

Use for migrations, sweeps, or large projects where tasks have explicit dependencies.

Example:

```text
A: schema
├── B: backend
└── C: migration
    ↓
D: frontend
    ↓
E: e2e verification
```

Only tasks whose dependencies are complete can be claimed.

Each worker should have:
- isolated worktree/workspace
- task contract
- explicit base ref
- verification commands
- output/evidence path

## Topology 5: Arena

Use when there are multiple plausible designs.

Procedure:
1. spawn N independent candidates
2. do not let candidates see each other
3. normalize outputs
4. evaluate with a rubric
5. synthesize or select
6. verify the selected approach

Good for:
- architecture
- API shape
- UX direction
- query strategy
- algorithm choice

Bad for:
- mechanical edits

## Topology 6: Adversarial review

Use when finding flaws matters.

Reviewer stance:
- assume the change is wrong until evidence says otherwise
- search for counterexamples
- inspect blast radius
- test boundary conditions
- challenge hidden assumptions

This is different from "please review this code", which often produces generic praise.

## Topology 7: Background maintainers

Long-lived low-risk roles:
- doc gardener
- flaky-test triage
- dependency drift
- issue reproduction
- eval regression monitor

These should have narrow permissions and explicit escalation rules.

## Model routing

Route by capability rather than vendor:

- planner: broad reasoning and product judgment
- mechanical worker: fast/cheap code transformation
- deep worker: debugging/architecture
- visual evaluator: strong multimodal judgment
- verifier: independent reasoning, preferably different context/model family when practical
- security reviewer: high precision, read-only by default

## Coordination anti-patterns

Avoid:
- many agents sharing one checkout
- duplicated tasks with no ownership lock
- agents chatting endlessly instead of writing artifacts
- one supervisor forwarding entire histories to every worker
- verifier reading only the builder summary
- parallelizing sequential dependencies
- "consensus" as proof

## Cost model

Parallelism trades money/tokens for wall-clock time and coverage.

Before spawning:
- Is the task independent?
- Is the expected value of diversity high?
- Can outputs be compared mechanically?
- Is verification strong enough to trust parallel output?

If not, stay single-agent.
