import { readFile } from "node:fs/promises";

export async function loadWorkflow(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

export function validateWorkflow(workflow) {
  const errors = [];
  if (!workflow || typeof workflow !== "object") return ["workflow must be an object"];
  if (!/^[a-z0-9-]+$/.test(workflow.id ?? "")) errors.push("workflow.id must be kebab-case");
  if (!Number.isInteger(workflow.version) || workflow.version < 1) errors.push("workflow.version must be a positive integer");
  if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) return [...errors, "workflow.nodes must be a non-empty array"];

  const ids = new Set();
  for (const node of workflow.nodes) {
    if (!/^[a-z0-9-]+$/.test(node.id ?? "")) errors.push("node id must be kebab-case: " + String(node.id));
    if (ids.has(node.id)) errors.push("duplicate node id: " + node.id);
    ids.add(node.id);
    if (typeof node.objective !== "string" || node.objective.trim() === "") errors.push(node.id + ": objective is required");
    if (!Array.isArray(node.acceptance) || node.acceptance.length === 0) errors.push(node.id + ": acceptance must be non-empty");
    if (!node.agent && (!Array.isArray(node.agents) || node.agents.length === 0)) errors.push(node.id + ": agent or agents is required");
    if (node.agent && Array.isArray(node.agents)) errors.push(node.id + ": use agent or agents, not both");
    if (node.replicas !== undefined && (!Number.isInteger(node.replicas) || node.replicas < 1)) errors.push(node.id + ": replicas must be >= 1");
  }

  for (const node of workflow.nodes) {
    for (const dep of node.dependsOn ?? []) {
      if (!ids.has(dep)) errors.push(node.id + ": unknown dependency " + dep);
      if (dep === node.id) errors.push(node.id + ": cannot depend on itself");
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const byId = new Map(workflow.nodes.map((n) => [n.id, n]));
  function visit(id, stack = []) {
    if (visiting.has(id)) {
      errors.push("cycle detected: " + [...stack, id].join(" -> "));
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of byId.get(id)?.dependsOn ?? []) visit(dep, [...stack, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids) visit(id);

  return [...new Set(errors)];
}

export function initialState(workflow) {
  return {
    workflowId: workflow.id,
    workflowVersion: workflow.version,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: Object.fromEntries(workflow.nodes.map((node) => [
      node.id,
      { status: "pending", agent: null, startedAt: null, completedAt: null, failure: null, evidence: [] }
    ]))
  };
}

export function readyNodes(workflow, state) {
  return workflow.nodes.filter((node) => {
    const own = state.nodes[node.id];
    if (!own || own.status !== "pending") return false;
    return (node.dependsOn ?? []).every((dep) => state.nodes[dep]?.status === "completed");
  });
}

export function mermaid(workflow) {
  const lines = ["flowchart TD"];
  for (const node of workflow.nodes) {
    const label = (node.id + "\\n" + (node.mode ?? "single")).replace(/"/g, "'");
    lines.push(`  ${safe(node.id)}["${label}"]`);
  }
  for (const node of workflow.nodes) {
    for (const dep of node.dependsOn ?? []) lines.push(`  ${safe(dep)} --> ${safe(node.id)}`);
  }
  return lines.join("\n");
}

function safe(id) {
  return "n_" + id.replace(/[^a-zA-Z0-9_]/g, "_");
}
