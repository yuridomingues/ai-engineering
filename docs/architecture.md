# Architecture

## Mental model

AI engineering is not prompt engineering with a larger folder structure. A production-grade system combines deterministic software with probabilistic components.

This repo uses seven layers.

### 1. Durable instructions

AGENTS.md contains stable facts and operating constraints that should be present across sessions.

Good examples:

- architecture boundaries
- test commands
- naming conventions
- security constraints
- definition of done

Bad examples:

- long framework documentation
- one-off task details
- giant style guides that only matter occasionally

### 2. Skills

Skills represent recognizable workflows. They are loaded when relevant instead of consuming context in every interaction.

Examples:

- frontend-quality
- security-review
- mcp-server
- eval-driven

### 3. Subagents

Subagents are for context isolation, parallelism and independent verification.

Use them when a task is large enough that exploration or review would pollute the parent context. Avoid spawning subagents for trivial single-file work.

### 4. MCP and tools

MCP exposes capabilities. It should connect the agent to something it cannot accomplish from static instructions alone.

Typical examples:

- GitHub
- Figma
- analytics
- issue trackers
- databases
- observability
- internal APIs

Do not create a frontend MCP merely to contain frontend advice.

### 5. Guardrails

Permissions, sandboxes, approvals, hooks and tool scopes should reduce blast radius.

Prefer read-only by default. Grant writes only to the agent that needs them.

### 6. Evals

LLM behavior is non-deterministic. Tests need representative cases and measurable acceptance criteria.

Evaluate at least:

- task success
- correctness
- schema adherence
- tool selection
- safety/policy constraints
- latency
- cost

### 7. Observability

Trace the full path:

user request -> context -> model -> tool calls -> model -> output

Keep enough metadata to debug regressions without logging secrets.

## Recommended orchestration

For substantial work:

1. planner identifies constraints and risks
2. specialist implements
3. verifier independently checks behavior
4. evals compare changed behavior when AI output is involved
5. human approves sensitive operations

This separation is more reliable than asking a single giant agent prompt to plan, implement and certify itself.

## Portability strategy

The source of truth is intentionally simple:

- AGENTS.md for common instructions
- .agents/skills for portable workflows
- host-specific adapters for features that are not yet standardized

Adapters may evolve as Cursor, OpenCode, Codex, Claude Code and GitHub Copilot converge on shared formats.
