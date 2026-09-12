#!/usr/bin/env node
import { access, copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PLAYBOOKS = path.join(ROOT, "orchestration", "playbooks");

const [command, kind, ...rest] = process.argv.slice(2);

function option(name, fallback = null) {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] ?? fallback : fallback;
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

function slug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function listKinds() {
  return (await readdir(PLAYBOOKS))
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
    .sort();
}

if (command === "list") {
  for (const item of await listKinds()) console.log(item);
  process.exit(0);
}

if (command === "show") {
  if (!kind) throw new Error("playbook kind is required");
  const source = path.join(PLAYBOOKS, kind + ".json");
  console.log(await readFile(source, "utf8"));
  process.exit(0);
}

if (command === "init") {
  if (!kind) throw new Error("playbook kind is required");
  const source = path.join(PLAYBOOKS, kind + ".json");
  if (!(await exists(source))) {
    throw new Error("unknown playbook '" + kind + "'. Available: " + (await listKinds()).join(", "));
  }

  const name = slug(option("--name", kind + "-work"));
  const out = path.resolve(option("--out", path.join(".agent", name + ".taskgraph.json")));
  if (await exists(out) && !rest.includes("--force")) {
    throw new Error("output already exists: " + out + " (use --force to replace)");
  }

  const graph = JSON.parse(await readFile(source, "utf8"));
  graph.name = name;
  graph.template = kind;
  graph.createdAt = new Date().toISOString();

  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(graph, null, 2) + "\n");
  console.log(out);
  process.exit(0);
}

console.error(
  "Usage:\n" +
  "  node scripts/playbook.mjs list\n" +
  "  node scripts/playbook.mjs show <feature|bugfix|refactor|arena|performance>\n" +
  "  node scripts/playbook.mjs init <kind> --name <task-name> [--out <file>] [--force]"
);
process.exit(2);
