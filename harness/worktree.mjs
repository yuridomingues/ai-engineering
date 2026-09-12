#!/usr/bin/env node
import { access, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const [command, task, base = "main"] = process.argv.slice(2);

function git(args, options = {}) {
  return execFileSync("git", args, { encoding: "utf8", stdio: options.stdio ?? ["ignore", "pipe", "pipe"] }).trim();
}

function slug(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

git(["rev-parse", "--show-toplevel"]);

if (command === "list") {
  console.log(git(["worktree", "list"]));
  process.exit(0);
}

if (command === "create") {
  const id = slug(task);
  if (!id) throw new Error("task id is required");
  const root = git(["rev-parse", "--show-toplevel"]);
  const dir = path.join(root, ".worktrees", id);
  const branch = "agent/" + id;
  if (await exists(dir)) throw new Error("worktree already exists: " + dir);
  await mkdir(path.dirname(dir), { recursive: true });
  execFileSync("git", ["worktree", "add", "-b", branch, dir, base], { stdio: "inherit" });
  console.log(dir);
  process.exit(0);
}

if (command === "remove") {
  const id = slug(task);
  if (!id) throw new Error("task id is required");
  const root = git(["rev-parse", "--show-toplevel"]);
  const dir = path.join(root, ".worktrees", id);
  if (!(await exists(dir))) throw new Error("worktree not found: " + dir);
  const dirty = git(["-C", dir, "status", "--porcelain"]);
  if (dirty) throw new Error("refusing to remove dirty worktree; commit/stash/review it first");
  execFileSync("git", ["worktree", "remove", dir], { stdio: "inherit" });
  console.log("removed " + dir);
  process.exit(0);
}

console.log("Usage: node harness/worktree.mjs <list|create|remove> [task-id] [base-ref]");
process.exit(1);
