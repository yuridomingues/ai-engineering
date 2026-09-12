#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const args=process.argv.slice(2);
function option(name){const i=args.indexOf(name);return i>=0?args[i+1]:undefined;}
function has(name){return args.includes(name);}
async function exists(file){try{await access(file);return true;}catch{return false;}}
function quote(value){return "'" + String(value).replaceAll("'", "'\\''") + "'";}

const provider=option("--provider");
const cwd=path.resolve(option("--cwd")??".");
const promptFile=option("--prompt-file");
const promptInline=option("--prompt");
const model=option("--model");
const agent=option("--agent");
const execute=has("--execute");

if(!provider||(!promptFile&&!promptInline)){
  console.error(
    "Usage:\n"+
    "  node scripts/agent-runner.mjs --provider cursor --cwd <dir> --prompt-file <file> [--model <id>] [--execute]\n"+
    "  node scripts/agent-runner.mjs --provider opencode --cwd <dir> --prompt-file <file> [--agent <name>] [--model <provider/model>] [--execute]\n"+
    "\nDry-run is the default. --execute actually launches the provider CLI."
  );
  process.exit(2);
}

if(!(await exists(cwd))) throw new Error("Working directory does not exist: "+cwd);

const prompt=promptFile
  ? await readFile(path.resolve(promptFile),"utf8")
  : promptInline;

let command;
let cliArgs;

if(provider==="cursor"){
  command="agent";
  cliArgs=["-p",prompt,"--output-format","text"];
  if(model) cliArgs.push("--model",model);
}else if(provider==="opencode"){
  command="opencode";
  cliArgs=["run","--dir",cwd];
  if(agent) cliArgs.push("--agent",agent);
  if(model) cliArgs.push("--model",model);
  cliArgs.push(prompt);
}else{
  throw new Error("Unsupported provider: "+provider+". Use cursor or opencode.");
}

console.log("Provider: "+provider);
console.log("Workspace: "+cwd);
console.log("Mode: "+(execute?"EXECUTE":"DRY-RUN"));
console.log("Command: "+[command,...cliArgs].map(quote).join(" "));

if(!execute){
  console.log("\nNo model was invoked. Re-run with --execute after reviewing the command.");
  process.exit(0);
}

const result=spawnSync(command,cliArgs,{cwd,stdio:"inherit",env:process.env});
if(result.error){
  if(result.error.code==="ENOENT") throw new Error(command+" is not installed or not on PATH");
  throw result.error;
}
process.exit(result.status??1);
