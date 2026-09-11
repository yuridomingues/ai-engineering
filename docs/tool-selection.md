# Tool selection

## Default recommendation

Use the tool that gives the best combination of model quality, repository integration and cost for the task. Do not force every task through one environment.

### Cursor

Best fit when:

- you are actively coding in an IDE
- you want strong codebase navigation and editing
- project Rules, Skills and Subagents add value
- visual/manual supervision matters

### OpenCode

Best fit when:

- you want a terminal-first workflow
- you want to switch providers easily
- you want a local-model path
- you need explicit agent/tool permissions in config
- you want a reusable open configuration checked into the repo

### Local models

Use local models when privacy, offline operation, experimentation or marginal cost matters more than frontier capability.

Do not assume a local model is automatically cheaper operationally. Hardware, context size, tool reliability and iteration time still count.

For coding agents, tool calling quality is as important as raw benchmark scores.

## Model selection heuristic

Choose by task class, not by brand loyalty.

- routine edits: fast/cheap coding-capable model
- architecture and debugging: stronger reasoning model
- review: independent model or separate context if possible
- extraction/classification: smallest model that meets eval threshold
- local/offline: tool-capable model with enough context for the repo slice

## Context budget

The most expensive context is irrelevant context.

Prefer:

- narrow file reads
- on-demand skills
- compact AGENTS.md
- references loaded only when needed
- subagents for large exploration

Avoid:

- pasting whole repos
- always-on giant rules
- duplicated instructions across layers
