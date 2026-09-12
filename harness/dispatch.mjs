#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { readyNodes } from "./lib/workflow.mjs";

const [runArg, nodeId, ...rest] = process.argv.slice(2);

function flag(name, fallback = null) {
  const i = rest.indexOf("--" + name);
  return i >= 0 ? rest[i + 1] ?? fallback : fallback;
}
function has(name) {
  return rest.includes("--" + name);
}
function commandExists(command) {
  const result = spawnSync(command, ["--version"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return !result.error && result.status === 0;
}
if (!runArg || !nodeId) {
  console.log("Usage: node harness/dispatch.mjs <run-dir> <node> --driver <opencode|cursor> --workspace <path> [--model id] [--binary name] [--execute]");
  process.exit(1);
}

const runDir = path.resolve(runArg);
const workspace = path.resolve(flag("workspace", "."));
const driver = flag("driver");
const model = flag("model");
const binaryOverride = flag("binary");
const execute = has("execute");

const workflow = JSON.parse(await readFile(path.join(runDir, "workflow.json"), "utf8"));
const statePath = path.join(runDir, "state.json");
const state = JSON.parse(await readFile(statePath, "utf8"));
const node = workflow.nodes.find((n) => n.id === nodeId);
if (!node) throw new Error("unknown node: " + nodeId);
if (!new Set(readyNodes(workflow, state).map((n) => n.id)).has(nodeId)) throw new Error(nodeId + " is not ready");

const assigned = node.agent ?? (node.agents ?? []).join(",");
const acceptance = node.acceptance.map((item, i) => (i + 1) + ". " + item).join("\n");
const prompt = `You are executing workflow node "${node.id}" in workflow "${workflow.id}".

Assigned role(s): ${assigned}
Objective: ${node.objective}

Acceptance criteria:
${acceptance}

Expected outputs: ${(node.outputs ?? []).join(", ") || "none declared"}

Work only on this bounded node. Read repository instructions first. Do not claim the overall task is complete. Produce a concise final report with files changed, checks actually run, evidence produced, unresolved risks, and any reason the node should remain blocked.`;

let command;
let args;
if (driver === "opencode") {
  command = binaryOverride ?? (commandExists("opencode2") ? "opencode2" : "opencode");
  args = ["run"];
  if (node.agent) args.push("--agent", node.agent);
  if (model) args.push("--model", model);
  args.push(prompt);
} else if (driver === "cursor") {
  command = binaryOverride ?? "agent";
  args = ["--workspace", workspace, "--print", "--output-format", "text"];
  if (model) args.push("--model", model);
  args.push("Use the " + assigned + " role/subagent if available.\n\n" + prompt);
} else {
  throw new Error("--driver must be opencode or cursor");
}

console.log("driver:", driver);
console.log("workspace:", workspace);
console.log("node:", nodeId);
console.log("command:", [command, ...args.slice(0, -1), "<prompt>"].join(" "));

if (!execute) {
  console.log("\nDry run only. Add --execute to invoke the local CLI.");
  process.exit(0);
}

state.nodes[nodeId].status = "running";
state.nodes[nodeId].agent = assigned;
state.nodes[nodeId].startedAt = new Date().toISOString();
state.updatedAt = new Date().toISOString();
await writeFile(statePath, JSON.stringify(state, null, 2) + "\n");

const result = spawnSync(command, args, {
  cwd: workspace,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

const artifacts = path.join(runDir, "artifacts");
await mkdir(artifacts, { recursive: true });
const outputPath = path.join(artifacts, nodeId + "-agent-output.txt");
await writeFile(outputPath, ["# stdout", result.stdout ?? "", "", "# stderr", result.stderr ?? "", "", "# exit", String(result.status)].join("\n"));

if (result.error || result.status !== 0) {
  state.nodes[nodeId].status = "failed";
  state.nodes[nodeId].failure = result.error?.message ?? ("driver exited " + result.status);
  state.updatedAt = new Date().toISOString();
  await writeFile(statePath, JSON.stringify(state, null, 2) + "\n");
  console.error("driver failed; output:", outputPath);
  process.exit(result.status ?? 1);
}

console.log("agent run finished; output:", outputPath);
console.log("Node remains RUNNING until verification evidence is recorded with harness/workflow.mjs complete.");
