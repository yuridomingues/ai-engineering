import { readFile } from "node:fs/promises";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { resolveReadableProjectFile } from "./path-policy.js";

const ROOT = path.resolve(process.env.AI_ENGINEERING_ROOT ?? process.cwd());
const DEFAULT_MAX_CHARS = 12_000;
const HARD_MAX_CHARS = 50_000;

function createServer(): McpServer {
  const server = new McpServer({
    name: "project-context",
    version: "0.1.0"
  });

  server.registerTool(
    "read-project-text",
    {
      title: "Read project text",
      description:
        "Read an allowlisted text/code file inside the explicitly configured project root. " +
        "Rejects path traversal, environment files, key material, .git, node_modules and binary extensions.",
      inputSchema: z.object({
        path: z.string().min(1).describe("Project-relative file path"),
        maxChars: z
          .number()
          .int()
          .min(1)
          .max(HARD_MAX_CHARS)
          .optional()
          .describe("Maximum characters returned")
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ path: requestedPath, maxChars = DEFAULT_MAX_CHARS }) => {
      try {
        const file = resolveReadableProjectFile(ROOT, requestedPath);
        const text = await readFile(file, "utf8");
        const truncated = text.length > maxChars;

        return {
          content: [
            {
              type: "text",
              text:
                text.slice(0, maxChars) +
                (truncated ? "\n\n[truncated by project-context MCP]" : "")
            }
          ]
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Request rejected: " + message
            }
          ]
        };
      }
    }
  );

  return server;
}

serveStdio(() => createServer());
