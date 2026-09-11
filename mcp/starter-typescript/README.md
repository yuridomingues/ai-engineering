# Project Context MCP starter

A deliberately small MCP server built with the TypeScript SDK v2 generation aligned with MCP 2026-07-28.

It demonstrates a safer pattern than exposing arbitrary filesystem or shell access.

## What it exposes

One read-only tool:

- read-project-text

The tool requires an explicit project-relative path and enforces:

- configured root boundary
- no absolute paths
- no path traversal
- no .git, node_modules or .ssh
- no .env files
- no key/certificate files
- text/code extension allowlist
- response size limit

## Setup

~~~bash
npm install
npm test
npm run typecheck
AI_ENGINEERING_ROOT=/path/to/project npm run dev
~~~

For stdio MCP, stdout belongs to the protocol. Send diagnostics to stderr if you add logging.

## Connect it

See:

- ../../configs/cursor.mcp.example.json
- ../../configs/opencode.mcp.example.jsonc

## Why this is only a starter

A real MCP should wrap a real capability with domain-specific authorization and schemas.

Do not extend this into a generic admin shell. Add narrow tools that correspond to explicit application operations.
