# AI engineering landscape — September 2026

Reviewed on 2026-09-11.

This document records the external assumptions used by the toolkit. Re-check these links before making compatibility-sensitive changes.

## Cursor

Cursor now treats customization as composable components: Rules, Skills, Subagents, Hooks, Commands and MCP. Skills are portable, version-controlled workflows that load on demand. Subagents run in separate context windows and are suited to parallel or context-heavy work.

Sources:

- https://cursor.com/docs/skills
- https://cursor.com/docs/subagents
- https://cursor.com/docs/rules
- https://cursor.com/docs/hooks
- https://cursor.com/docs/plugins
- https://cursor.com/docs/mcp

Decision for this repo: use Skills for expertise/workflows, Subagents for isolation, and MCP only for capabilities/data.

## OpenCode

OpenCode supports project configuration, custom primary agents and subagents, permissions, Skills, MCP and many providers. It also documents local execution through LM Studio, Ollama and llama.cpp-compatible endpoints.

Sources:

- https://opencode.ai/docs/config/
- https://opencode.ai/docs/agents/
- https://opencode.ai/docs/skills
- https://opencode.ai/docs/providers
- https://opencode.ai/docs/models

Decision for this repo: keep OpenCode as the low-lock-in CLI/local path.

## Model Context Protocol

MCP specification 2026-07-28 moved to a stateless core and introduced a first-class extension framework. Tasks became an extension. Roots, Sampling and Logging are deprecated for new designs. The TypeScript SDK v2 is the stable line for this protocol generation.

Sources:

- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://ts.sdk.modelcontextprotocol.io/v2/
- https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server
- https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28

Decision for this repo: new MCP examples use v2, explicit inputs and least-privilege boundaries.

## OpenAI / Codex

Codex supports repository instructions through AGENTS.md and increasingly uses Skills and multi-agent workflows. OpenAI has also continued moving agent application development toward tool-using agent harnesses and sandboxed execution.

Sources:

- https://openai.com/index/introducing-the-codex-app/
- https://openai.com/index/introducing-codex/
- https://openai.com/index/the-next-evolution-of-the-agents-sdk/

Decision for this repo: AGENTS.md remains the durable baseline rather than editor-specific prompt files.

## Evals and observability

Agent systems need traces and repeatable evaluation because model output and tool paths are probabilistic. Langfuse is one current open-source option that combines tracing, prompt/version management, datasets and evaluation.

Sources:

- https://langfuse.com/docs
- https://langfuse.com/docs/observability/overview
- https://langfuse.com/docs/evaluation/overview

Decision for this repo: evals and observability are first-class engineering concerns, not post-launch add-ons.

## Stable ideas vs fast-moving details

More stable:

- least privilege
- structured contracts
- eval datasets
- context isolation
- tracing
- model/provider abstraction
- explicit failure handling

Fast-moving:

- best model
- pricing
- free tiers
- agent file formats
- supported transports
- vendor-specific feature names

Avoid hard-coding fast-moving assumptions into architecture.
