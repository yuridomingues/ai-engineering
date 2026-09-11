import { access, cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--")) ?? ".";
const target = path.resolve(process.cwd(), targetArg);
const force = args.includes("--force");

const requested = new Set(
  args
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.slice(2))
    .filter((arg) => ["all", "portable", "cursor", "opencode"].includes(arg))
);

if (requested.size === 0) requested.add("all");

const wants = (name) => requested.has("all") || requested.has(name);

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const actions = [];
const skipped = [];

async function copyFileSafe(source, destination, { neverOverwrite = false } = {}) {
  const destinationExists = await exists(destination);
  if (destinationExists && (neverOverwrite || !force)) {
    skipped.push(path.relative(target, destination) || destination);
    return;
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { force: true });
  actions.push(path.relative(target, destination) || destination);
}

async function copyTree(sourceDir, destinationDir) {
  if (!(await exists(sourceDir))) return;

  await mkdir(destinationDir, { recursive: true });
  const entries = await readdir(sourceDir);

  for (const entry of entries) {
    const source = path.join(sourceDir, entry);
    const destination = path.join(destinationDir, entry);
    const info = await stat(source);

    if (info.isDirectory()) {
      await copyTree(source, destination);
    } else {
      await copyFileSafe(source, destination);
    }
  }
}

await mkdir(target, { recursive: true });

// AGENTS.md is deliberately never overwritten. Existing repository knowledge wins.
await copyFileSafe(
  path.join(ROOT, "AGENTS.md"),
  path.join(target, "AGENTS.md"),
  { neverOverwrite: true }
);

if (wants("portable") || wants("cursor")) {
  await copyTree(
    path.join(ROOT, ".agents", "skills"),
    path.join(target, ".agents", "skills")
  );
}

if (wants("portable")) {
  await copyTree(path.join(ROOT, "templates"), path.join(target, ".ai", "templates"));
  await copyTree(path.join(ROOT, "evals"), path.join(target, ".ai", "evals"));
}

if (wants("cursor")) {
  await copyTree(
    path.join(ROOT, ".cursor", "agents"),
    path.join(target, ".cursor", "agents")
  );
  await copyTree(
    path.join(ROOT, ".cursor", "rules"),
    path.join(target, ".cursor", "rules")
  );
}

if (wants("opencode")) {
  await copyTree(
    path.join(ROOT, ".agents", "skills"),
    path.join(target, ".opencode", "skills")
  );
  await copyTree(
    path.join(ROOT, ".opencode", "agents"),
    path.join(target, ".opencode", "agents")
  );
  await copyFileSafe(
    path.join(ROOT, "opencode.jsonc"),
    path.join(target, "opencode.jsonc")
  );
}

console.log("AI Engineering kit target: " + target);
console.log("Created/updated: " + actions.length);
for (const item of actions) console.log("  + " + item);

if (skipped.length > 0) {
  console.log("Skipped existing files: " + skipped.length);
  for (const item of skipped) console.log("  = " + item);
  if (!force) console.log("Use --force to overwrite adapter files. AGENTS.md is still preserved.");
}
