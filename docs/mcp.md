# MCP design guide

## When MCP is appropriate

Use MCP when an agent needs a standardized interface to external capabilities or data.

Good candidates:

- issue tracker queries
- design system or Figma access
- analytics
- observability
- internal APIs
- databases with tightly scoped operations
- domain services

Poor candidates:

- a frontend style guide
- generic coding advice
- a persona prompt
- static documentation that could be a Skill reference

## Tool design

Each tool should be small, composable and explicit.

Prefer:

- get_issue
- search_design_tokens
- create_preview
- query_readonly_metrics

Avoid:

- do_everything
- run_any_sql
- execute_shell
- admin_action

## Modern protocol guidance

For new work target MCP 2026-07-28 and current SDKs.

Design for:

- stateless remote requests where practical
- explicit state handles if application state is required
- validated JSON Schema inputs
- explicit authorization
- cacheable discovery where supported
- extension-based long-running Tasks when appropriate

Do not create new dependencies on deprecated Roots, Sampling or Logging protocol features.

## Local vs remote

### stdio

Use for local single-user integrations spawned by the host.

### HTTP

Use when multiple clients need a deployed service, centralized auth or horizontal scaling.

## Testing

Test MCP tools as normal application code first.

Then verify the protocol layer with an MCP inspector/client.

Test:

- schema rejection
- happy path
- authorization failure
- tool/service failure
- timeout
- path/input boundaries
- destructive-action policy
