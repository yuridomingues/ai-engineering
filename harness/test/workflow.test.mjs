import assert from "node:assert/strict";
import test from "node:test";
import { initialState, mermaid, readyNodes, validateWorkflow } from "../lib/workflow.mjs";

const workflow = {
  id: "example",
  version: 1,
  nodes: [
    { id: "plan", agent: "planner", objective: "plan", acceptance: ["plan exists"], dependsOn: [] },
    { id: "build", agent: "worker", objective: "build", acceptance: ["build exists"], dependsOn: ["plan"] },
    { id: "verify", agents: ["v1", "v2"], mode: "fanout", objective: "verify", acceptance: ["verified"], dependsOn: ["build"] }
  ]
};

test("valid workflow passes", () => {
  assert.deepEqual(validateWorkflow(workflow), []);
});

test("unknown dependency fails", () => {
  const broken = structuredClone(workflow);
  broken.nodes[1].dependsOn = ["missing"];
  assert.match(validateWorkflow(broken).join("\n"), /unknown dependency/);
});

test("cycle fails", () => {
  const broken = structuredClone(workflow);
  broken.nodes[0].dependsOn = ["verify"];
  assert.match(validateWorkflow(broken).join("\n"), /cycle detected/);
});

test("ready nodes follow completed dependencies", () => {
  const state = initialState(workflow);
  assert.deepEqual(readyNodes(workflow, state).map((n) => n.id), ["plan"]);
  state.nodes.plan.status = "completed";
  assert.deepEqual(readyNodes(workflow, state).map((n) => n.id), ["build"]);
});

test("mermaid exposes graph edges", () => {
  const graph = mermaid(workflow);
  assert.match(graph, /n_plan --> n_build/);
  assert.match(graph, /n_build --> n_verify/);
});
