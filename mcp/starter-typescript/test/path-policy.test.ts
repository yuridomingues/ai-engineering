import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { resolveReadableProjectFile } from "../src/path-policy.js";

const ROOT = path.resolve("/workspace/example");

test("allows text/code files inside root", () => {
  assert.equal(
    resolveReadableProjectFile(ROOT, "src/index.ts"),
    path.join(ROOT, "src", "index.ts")
  );
});

test("blocks traversal outside root", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, "../secret.txt"),
    /escapes/
  );
});

test("blocks absolute paths", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, path.resolve("/tmp/secret.txt")),
    /absolute/
  );
});

test("blocks environment files", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, ".env.local"),
    /environment/
  );
});

test("blocks key material", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, "certs/private.key"),
    /key or certificate/
  );
});

test("blocks denied directories", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, ".git/config"),
    /denied/
  );
});

test("blocks binary extensions", () => {
  assert.throws(
    () => resolveReadableProjectFile(ROOT, "assets/logo.png"),
    /allowlist/
  );
});
