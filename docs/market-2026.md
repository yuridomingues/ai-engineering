# AI engineering landscape — September 2026

Reviewed on 2026-09-12.

This document records fast-moving external assumptions behind the toolkit. The repository should depend on the stable engineering ideas below, not on one vendor or model name.

## The shift: prompt engineering -> harness engineering

By 2026, the useful engineering surface is increasingly the environment around the model:

- repository legibility
- deterministic tools
- isolated workspaces
- runtime verification
- task orchestration
- independent evaluators
- durable handoffs
- architecture guardrails
- observability
- permission and budget policy

A stronger model helps, but model quality does not remove the need for a reliable feedback loop.

## OpenAI: Harness Engineering

OpenAI describes an agent-first development environment where agents write application code, tests, documentation and tooling while humans steer architecture and intent.

Patterns relevant to this repository:

- AGENTS.md is a map rather than a giant manual
- repository-local documentation becomes the durable system of record
- UI, logs, metrics and traces are made legible to agents
- isolated worktrees support parallel runnable changes
- architectural invariants are enforced mechanically
- review increasingly becomes agent-to-agent once verification is strong

Source:

- https://openai.com/index/harness-engineering/

Decision:

- optimize the repository itself as part of the agent harness
- prefer progressive disclosure and executable guardrails to more prompt text

## OpenAI: Symphony

Symphony models coding work as an orchestration problem instead of a collection of chat sessions.

Useful ideas:

- tracker/task state acts as the control plane
- one isolated workspace per active task
- task trees become dependency DAGs
- only unblocked work is eligible to execute
- stalls and failures belong to orchestration state
- work is represented as deliverables rather than conversations

Source:

- https://openai.com/index/open-source-codex-orchestration-symphony/

Decision:

- this repository ships a provider-neutral task DAG/state-machine reference
- model execution remains an adapter at the edge

## Anthropic: long-running agent harnesses

Anthropic's long-running application work emphasizes durable artifacts between sessions and explicit phase boundaries.

Their planner/generator/evaluator experiments support:

- separate planning and implementation for sufficiently complex work
- explicit contracts between builder and evaluator
- evaluators driving the real application rather than trusting code inspection
- structured handoffs when context resets or ownership changes
- context resets as a useful engineering tool when history becomes noisy

Sources:

- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://www.anthropic.com/engineering/harness-design-long-running-apps

Decision:

- execution plans, sprint contracts, handoffs and runtime verification are first-class artifacts
- evaluator overhead should be proportional to risk and ambiguity

## Anthropic: parallel agent teams

Anthropic has demonstrated parallel agents collaborating on software and research tasks with explicit task ownership and synchronization.

Sources:

- https://www.anthropic.com/engineering/building-c-compiler
- https://www.anthropic.com/engineering/multi-agent-research-system

Decision:

- parallelism is for independently executable work
- workers need isolated workspaces or non-overlapping ownership
- the delegation unit is a bounded outcome with acceptance criteria, not a generic job title
- coordination overhead is a real cost

## Cursor / Lauren Tan / pstack

Cursor's pstack plugin is a useful primary reference for verification-first coding-agent workflows.

Its important engineering ideas include:

- rigorous task playbooks
- runtime verification
- independent review
- parallel arenas/swarms where diversity is useful
- worktree isolation
- repository-specific verification skills
- converting recurring lessons into reusable structure

Source:

- https://github.com/cursor/plugins/tree/main/pstack

Decision:

- this repository adopts the underlying verification-first engineering principles
- implementation here remains original and provider-neutral rather than copying vendor-specific prompts

## Cursor CLI

Cursor CLI supports non-interactive execution and worktree-oriented workflows, making it possible to sit behind a separate orchestration layer.

Sources:

- https://cursor.com/docs/cli/overview
- https://cursor.com/docs/cli/using

Decision:

- `scripts/agent-runner.mjs` treats Cursor as one execution provider
- dry-run is the default; orchestration should not silently spend model budget or start writable agents

## OpenCode

OpenCode exposes non-interactive `run`, project directory selection, agent selection and model selection.

Sources:

- https://opencode.ai/docs/cli/
- https://opencode.ai/docs/agents/
- https://opencode.ai/docs/skills
- https://opencode.ai/docs/providers
- https://opencode.ai/docs/models

Decision:

- OpenCode is the main open/local-friendly provider adapter
- the control plane is not coupled to OpenCode


### OpenCode 2 beta

Em setembro de 2026, OpenCode 2 ainda é distribuído como beta separada (`opencode2`), enquanto a linha estável continua disponível como `opencode`. A V2 também introduz formatos nativos novos para permissões e MCP.

Decisão:

- `scripts/agent-runner.mjs` prefere `opencode2` quando ela está instalada e faz fallback para `opencode`
- `--binary` permite fixar explicitamente qual CLI executar
- os agentes usam `mode: all` para poderem ser selecionados diretamente pelo runner ou chamados como subagentes
- `opencode.jsonc` permanece como configuração estável/V1; exemplos nativos de V2 ficam em `configs/opencode.v2*.jsonc`
- não depender de uma beta para o núcleo do control plane

Fontes:

- https://opencode.ai/docs/v2/
- https://opencode.ai/docs/v2/migrate/
- https://opencode.ai/docs/v2/permissions/
- https://opencode.ai/docs/v2/agents/

## Stateful graphs

Graph frameworks such as LangGraph remain useful when the product itself needs durable stateful multi-actor workflows, checkpoints, supervisors or handoffs.

Sources:

- https://reference.langchain.com/python/langgraph/overview
- https://reference.langchain.com/python/langgraph-supervisor

Decision:

- application-agent graphs may use a graph framework
- software-engineering task orchestration in this repo stays framework-independent

## Agent evals

Agent systems need a mix of deterministic, model-based and human evaluation.

A useful priority is:

1. verify final environment state when possible
2. use deterministic assertions for contracts
3. use model judges for semantic properties that cannot be reduced further
4. calibrate judges against human examples

Source:

- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

Decision:

- outcome evidence is more important than transcript aesthetics
- regressions should become durable eval cases

## Tools for probabilistic callers

Agent tools are interfaces between deterministic systems and probabilistic callers.

Useful properties:

- narrow names
- explicit schemas
- token-efficient outputs
- composability
- meaningful errors
- evaluated tool selection and use

Source:

- https://www.anthropic.com/engineering/writing-tools-for-agents

## MCP

MCP 2026-07-28 uses a stateless core and extension model. New work should avoid designing around deprecated Roots, Sampling or Logging core features.

Sources:

- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://ts.sdk.modelcontextprotocol.io/v2/

## Stable ideas

These are expected to survive model churn:

- proof before completion
- explicit contracts
- least privilege
- durable repository-local state
- progressive disclosure
- isolated parallel workers
- mechanical architecture constraints
- independent verification
- outcome-based evals
- observable runtime
- provider abstraction
- idempotent/retry-aware operations
- bounded autonomy with stop conditions

## Fast-moving details

Re-check before encoding these into reusable architecture:

- best model for each role
- pricing/free tiers
- CLI flag names
- vendor-specific agent file formats
- supported transports
- context-window sizes
- which harness layers newer models can safely make redundant
