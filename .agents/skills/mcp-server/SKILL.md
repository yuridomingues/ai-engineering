---
name: mcp-server
description: Decide whether MCP is the right abstraction and design or implement a least-privilege MCP server using current protocol patterns. Use when connecting agents to APIs, data sources, internal systems, or reusable external tools.
---
# MCP Server

## First question

Do not build an MCP server if the need is only static expertise or instructions. Use a Skill for that.

MCP is appropriate when the model needs to access data, capabilities, or actions through a standardized tool boundary.

## Design

For every tool define:

- precise name
- narrow purpose
- validated input schema
- structured output where useful
- read/write/destructive semantics
- authorization boundary
- timeout/error behavior
- audit requirement

Avoid generic tools such as run-any-command or run-any-sql.

## Protocol guidance

For new TypeScript work in this repository:

- use the MCP v2 SDK generation documented in docs/mcp.md
- design remote services for the 2026-07-28 stateless core
- pass explicit state handles if application state is needed
- do not build new designs around deprecated Roots, Sampling or Logging features
- use stdio for local host-spawned integrations
- use HTTP for shared/deployed services

## Security

- scope filesystem access to an explicit root
- block path traversal
- use environment/secret stores for credentials
- prefer read-only tools where possible
- require explicit approval/policy gates for destructive actions
- treat tool input as untrusted
