#!/usr/bin/env node
import { access, appendFile, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { initialState, loadWorkflow, mermaid, readyNodes, validateWorkflow } from "./lib/workflow.mjs";

const [command, first, second, ...rest] = process.argv.slice(2);

function arg(name, fallback = null) {
  const index = rest.indexOf("--" + name);
  return index >= 0 ? rest[index + 1] ?? fallback : fallback;
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function loadRun(runDir) {
  const workflow = JSON.parse(await readFile(path.join(runDir, "workflow.json"), "utf8"));
  const state = JSON.parse(await readFile(path.join(runDir, "state.json"), "utf8"));
  return { workflow, state };
}

async function saveState(runDir, state) {
  state.updatedAt = new Date().toISOString();
  await writeFile(path.join(runDir, "state.json"), JSON.stringify(state, null, 2) + "\n");
}

function usage() {
  console.log(`Usage:
  node harness/workflow.mjs check <workflow.json>
  node harness/workflow.mjs graph <workflow.json>
  node harness/workflow.mjs init <workflow.json> [run-dir]
  node harness/workflow.mjs ready <run-dir>
  node harness/workflow.mjs status <run-dir>
  node harness/workflow.mjs start <run-dir> <node> --agent <name>
  node harness/workflow.mjs complete <run-dir> <node> --evidence <file> --summary <text>
  node harness/workflow.mjs fail <run-dir> <node> --reason <text>`);
}

if (!command) {
  usage();
  process.exit(1);
}

if (command === "check" || command === "graph") {
  if (!first) throw new Error("workflow file is required");
  const workflow = await loadWorkflow(first);
  const errors = validateWorkflow(workflow);
  if (errors.length) {
    for (const error of errors) console.error("FAIL " + error);
    process.exit(1);
  }
  if (command === "check") console.log("OK " + workflow.id + " (" + workflow.nodes.length + " nodes)");
  else console.log(mermaid(workflow));
  process.exit(0);
}

if (command === "init") {
  if (!first) throw new Error("workflow file is required");
  const workflow = await loadWorkflow(first);
  const errors = validateWorkflow(workflow);
  if (errors.length) throw new Error(errors.join("; "));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = path.resolve(second ?? path.join(".ai", "runs", stamp + "-" + workflow.id));
  if (await exists(runDir)) throw new Error("run directory already exists: " + runDir);
  await mkdir(runDir, { recursive: true });
  await copyFile(first, path.join(runDir, "workflow.json"));
  await writeFile(path.join(runDir, "state.json"), JSON.stringify(initialState(workflow), null, 2) + "\n");
  await writeFile(path.join(runDir, "evidence.jsonl"), "");
  console.log(runDir);
  process.exit(0);
}

if (!first) throw new Error("run directory is required");
const runDir = path.resolve(first);
const { workflow, state } = await loadRun(runDir);

if (command === "ready") {
  for (const node of readyNodes(workflow, state)) console.log(node.id);
  process.exit(0);
}

if (command === "status") {
  for (const node of workflow.nodes) {
    const s = state.nodes[node.id];
    console.log(String(s.status).padEnd(10) + " " + node.id + (s.agent ? " [" + s.agent + "]" : ""));
  }
  process.exit(0);
}

const nodeId = second;
const node = workflow.nodes.find((item) => item.id === nodeId);
if (!node) throw new Error("unknown node: " + nodeId);
const nodeState = state.nodes[nodeId];

if (command === "start") {
  if (nodeState.status !== "pending") throw new Error(nodeId + " is not pending");
  const ready = new Set(readyNodes(workflow, state).map((item) => item.id));
  if (!ready.has(nodeId)) throw new Error(nodeId + " is not ready; dependencies are incomplete");
  const agent = arg("agent");
  if (!agent) throw new Error("--agent is required");
  nodeState.status = "running";
  nodeState.agent = agent;
  nodeState.startedAt = new Date().toISOString();
  await saveState(runDir, state);
  console.log("started " + nodeId + " with " + agent);
  process.exit(0);
}

if (command === "complete") {
  if (nodeState.status !== "running") throw new Error(nodeId + " must be running before completion");
  const evidencePath = arg("evidence");
  const summary = arg("summary");
  if (!evidencePath || !summary) throw new Error("--evidence and --summary are required");
  const absoluteEvidence = path.resolve(evidencePath);
  const bytes = await readFile(absoluteEvidence);
  const record = {
    timestamp: new Date().toISOString(),
    node: nodeId,
    agent: nodeState.agent,
    path: path.relative(runDir, absoluteEvidence),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    summary
  };
  await appendFile(path.join(runDir, "evidence.jsonl"), JSON.stringify(record) + "\n");
  nodeState.evidence.push(record.sha256);
  nodeState.status = "completed";
  nodeState.completedAt = record.timestamp;
  await saveState(runDir, state);
  console.log("completed " + nodeId + " evidence=" + record.sha256);
  process.exit(0);
}

if (command === "fail") {
  if (nodeState.status !== "running") throw new Error(nodeId + " must be running before failure");
  const reason = arg("reason");
  if (!reason) throw new Error("--reason is required");
  nodeState.status = "failed";
  nodeState.failure = reason;
  await saveState(runDir, state);
  console.log("failed " + nodeId);
  process.exit(0);
}

usage();
process.exit(1);
