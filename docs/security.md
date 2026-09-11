# Security for agentic development

## Threat model

Coding agents can:

- read sensitive source and configuration
- execute shell commands
- call remote tools
- modify files
- interact with production-like systems
- ingest untrusted external content

Treat the agent as a powerful automation layer, not as a trusted administrator.

## Baseline controls

### Least privilege

Give each agent only the tools it needs.

Review agents should normally be read-only. Build agents may edit files but should not receive production credentials by default.

### Secret hygiene

Never put secrets in:

- prompts
- AGENTS.md
- skills
- fixtures
- committed MCP config
- trace metadata

Use environment variables, secret managers or host credential stores.

### Prompt injection

Tool output, web pages, issue bodies, documents and retrieved text are untrusted data.

Instructions found inside retrieved content must not override system, developer, repository or user intent.

### Command execution

Prefer allowlists and sandboxing for autonomous execution.

Require confirmation or an equivalent policy gate for destructive or high-impact commands.

### MCP

For each MCP tool define:

- exact capability
- input schema
- authorization boundary
- read/write behavior
- idempotency assumptions
- expected errors
- audit requirements

Filesystem tools must have an explicit root and path traversal protection.

Remote services should use scoped credentials and transport-level authorization.

### Supply chain

Agent-generated dependency changes require the same review as human-generated changes.

Check:

- package provenance
- versions
- lockfile diffs
- install scripts
- unexpected transitive dependencies

## Security review output

A security reviewer should report:

1. finding
2. severity
3. affected surface
4. realistic impact
5. evidence
6. remediation
7. verification step

Avoid speculative vulnerability claims without evidence.
