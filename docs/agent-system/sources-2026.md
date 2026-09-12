# 2026 source map

Reviewed 2026-09-12.

These sources informed the architecture. The repository does not copy their implementations; it extracts general engineering patterns.

## OpenAI — Harness engineering

https://openai.com/index/harness-engineering/

Key ideas used here:

- humans steer; agents execute
- application legibility and per-worktree environments
- repository knowledge as system of record
- AGENTS.md as a map rather than a giant manual
- structural constraints and custom linting
- agent-to-agent review loops
- recurring cleanup/quality maintenance

## OpenAI — Symphony

https://openai.com/index/open-source-codex-orchestration-symphony/

Key ideas:

- task tracker/control plane instead of manually babysitting sessions
- long-running agents tied to deliverables
- human attention as a scarce resource

## Cursor pstack / Lauren Tan

https://github.com/cursor/plugins/tree/main/pstack

Key ideas:

- rigorous routing/playbooks
- verification skills and feature maps
- architecture before implementation
- TDD
- parallel candidate arenas
- adversarial review
- reflection: turn failures into reusable skills/guardrails
- evidence trails for autonomous runs

## Microsoft Agent Framework workflows

https://learn.microsoft.com/en-us/agent-framework/workflows/

Key ideas:

- explicit workflows distinct from open-ended agents
- graph execution
- sequential, concurrent and handoff orchestration
- checkpointing
- human-in-the-loop
- typed message boundaries

## SWE-agent — Agent-Computer Interface

https://swe-agent.com/latest/background/aci/

Key ideas:

- agent performance depends heavily on the computer/tool interface
- concise search/view/edit feedback
- immediate lint feedback
- tools should be optimized for model legibility

## OpenAI — Codex harness / App Server

https://openai.com/index/unlocking-the-codex-harness/
https://openai.com/index/unrolling-the-codex-agent-loop/

Key idea:

The model is only one component. The harness owns context preparation, tool execution, approvals, state and the agent loop.
