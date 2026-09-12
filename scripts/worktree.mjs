#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const [command, taskArg, baseArg] = process.argv.slice(2);

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function slug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function root() {
  return git(["rev-parse", "--show-toplevel"], process.cwd());
}

function usage() {
  console.error(
    "Usage:\n" +
    "  node scripts/worktree.mjs list\n" +
    "  node scripts/worktree.mjs create <task-id> [base-ref]\n" +
    "  node scripts/worktree.mjs remove <task-id>"
  );
}

try {
  const repoRoot = root();
  const repoName = path.basename(repoRoot);
  const worktreesRoot = path.join(path.dirname(repoRoot), repoName + ".worktrees");

  if (command === "list") {
    console.log(git(["worktree", "list", "--porcelain"], repoRoot));
    process.exit(0);
  }

  const task = slug(taskArg);
  if (!task) {
    usage();
    process.exit(2);
  }

  const target = path.join(worktreesRoot, task);
  const branch = "agent/" + task;

  if (command === "create") {
    const base = baseArg ?? "main";
    mkdirSync(worktreesRoot, { recursive: true });

    if (existsSync(target)) {
      throw new Error("Worktree path already exists: " + target);
    }

    let branchExists = true;
    try {
      git(["show-ref", "--verify", "--quiet", "refs/heads/" + branch], repoRoot);
    } catch {
      branchExists = false;
    }

    if (branchExists) {
      git(["worktree", "add", target, branch], repoRoot);
    } else {
      git(["worktree", "add", "-b", branch, target, base], repoRoot);
    }

    console.log(JSON.stringify({ task, branch, path: target, base }, null, 2));
    process.exit(0);
  }

  if (command === "remove") {
    if (!existsSync(target)) throw new Error("Worktree does not exist: " + target);
    const dirty = git(["status", "--porcelain"], target);
    if (dirty) {
      throw new Error("Refusing to remove a dirty worktree. Commit/stash/discard changes first.");
    }
    git(["worktree", "remove", target], repoRoot);
    console.log("Removed worktree " + target + "; branch " + branch + " was kept.");
    process.exit(0);
  }

  usage();
  process.exit(2);
} catch (error) {
  console.error("ERROR:", error instanceof Error ? error.message : error);
  process.exit(1);
}
