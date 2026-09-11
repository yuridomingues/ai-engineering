import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const target = path.resolve(process.cwd(), process.argv[2] ?? ".");
const failures = [];
const warnings = [];
const ok = [];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, predicate, out = []) {
  if (!(await exists(dir))) return out;
  for (const entry of await readdir(dir)) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) await walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

const agentsFile = path.join(target, "AGENTS.md");
if (await exists(agentsFile)) ok.push("AGENTS.md found");
else failures.push("AGENTS.md is missing");

const skillRoots = [
  path.join(target, ".agents", "skills"),
  path.join(target, ".opencode", "skills")
];

const skillFiles = [];
for (const root of skillRoots) {
  await walk(root, (file) => path.basename(file) === "SKILL.md", skillFiles);
}

if (skillFiles.length === 0) {
  warnings.push("No SKILL.md files discovered");
} else {
  ok.push(String(skillFiles.length) + " skill files discovered");
}

for (const file of skillFiles) {
  const content = await readFile(file, "utf8");
  const nameMatch = content.match(/^---[\s\S]*?^name:\s*([^\n]+)[\s\S]*?^---/m);
  const descriptionMatch = content.match(/^---[\s\S]*?^description:\s*([^\n]+)[\s\S]*?^---/m);

  if (!nameMatch) failures.push(path.relative(target, file) + ": missing frontmatter name");
  if (!descriptionMatch) failures.push(path.relative(target, file) + ": missing frontmatter description");

  if (nameMatch) {
    const declared = nameMatch[1].trim().replace(/^["']|["']$/g, "");
    const folder = path.basename(path.dirname(file));
    if (declared !== folder) {
      failures.push(path.relative(target, file) + ": name must match folder (" + folder + ")");
    }
  }
}

const cursorAgents = await walk(
  path.join(target, ".cursor", "agents"),
  (file) => file.endsWith(".md")
);
if (cursorAgents.length > 0) ok.push(String(cursorAgents.length) + " Cursor subagents found");
else warnings.push("Cursor adapter not installed");

const opencodeAgents = await walk(
  path.join(target, ".opencode", "agents"),
  (file) => file.endsWith(".md")
);
if (opencodeAgents.length > 0) ok.push(String(opencodeAgents.length) + " OpenCode agents found");
else warnings.push("OpenCode adapter not installed");

const scanFiles = await walk(
  target,
  (file) =>
    !file.includes(path.sep + ".git" + path.sep) &&
    !file.includes(path.sep + "node_modules" + path.sep) &&
    /\.(md|json|jsonc|ya?ml|toml|ts|tsx|js|mjs)$/i.test(file)
);

const secretPatterns = [
  { name: "private key", regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "OpenAI-style secret", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/ }
];

for (const file of scanFiles) {
  const content = await readFile(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.regex.test(content)) {
      failures.push(path.relative(target, file) + ": possible " + pattern.name);
    }
  }
}

console.log("AI Engineering doctor: " + target);
for (const item of ok) console.log("  OK   " + item);
for (const item of warnings) console.log("  WARN " + item);
for (const item of failures) console.log("  FAIL " + item);

if (failures.length > 0) process.exitCode = 1;
