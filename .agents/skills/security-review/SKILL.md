---
name: security-review
description: Perform defensive application-security review and threat modeling for code, configs, agents, tools, MCP servers, APIs, and deployment changes. Use for security review, auth changes, secret handling, dependency risk, or agent permissions.
---
# Security Review

## Scope

Review defensively. Do not invent exploit claims without evidence.

## Threat model

Identify:

- protected assets
- trust boundaries
- attacker-controlled inputs
- privileged actions
- external integrations
- secrets/credentials
- persistence and logging surfaces

For AI/agent systems also include:

- prompt injection from retrieved/tool content
- excessive tool permissions
- secret leakage into prompts or traces
- unsafe autonomous writes
- confused-deputy behavior
- tool argument manipulation

## Review order

1. authentication
2. authorization
3. input validation
4. secrets
5. injection/data handling
6. filesystem/network boundaries
7. dependencies and supply chain
8. logging/privacy
9. agent/MCP permissions
10. destructive actions and rollback

## Finding format

For each finding report:

- severity
- affected surface
- evidence
- realistic impact
- remediation
- verification step

Separate confirmed findings from hardening suggestions.
