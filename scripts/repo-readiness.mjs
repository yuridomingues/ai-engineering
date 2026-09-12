#!/usr/bin/env node
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const args=process.argv.slice(2);
const targetArg=args.find((arg)=>!arg.startsWith("--"))??".";
const target=path.resolve(targetArg);
const strictIndex=args.indexOf("--strict");
const strictThreshold=strictIndex>=0?Number(args[strictIndex+1]??70):null;
async function exists(file){try{await access(file);return true;}catch{return false;}}
async function walk(dir,predicate,out=[]){
  if(!(await exists(dir))) return out;
  for(const entry of await readdir(dir)){
    const full=path.join(dir,entry);const info=await stat(full);
    if(info.isDirectory()) await walk(full,predicate,out); else if(predicate(full)) out.push(full);
  }
  return out;
}
const checks=[];
function add(name,weight,pass,note){checks.push({name,weight,pass:Boolean(pass),note});}
const agents=path.join(target,"AGENTS.md");
add("repository map",10,await exists(agents),"AGENTS.md");
const architecture=(await exists(path.join(target,"ARCHITECTURE.md")))||
  (await exists(path.join(target,"docs","architecture.md")))||
  (await exists(path.join(target,"docs","software-engineering-for-agents.md")));
add("architecture source of truth",10,architecture,"architecture document");
let packageJson=null;
if(await exists(path.join(target,"package.json"))){
  try{packageJson=JSON.parse(await readFile(path.join(target,"package.json"),"utf8"));}catch{}
}
const scripts=packageJson?.scripts??{};
const hasTests=Boolean(scripts.test)||
  (await exists(path.join(target,"Makefile")))||
  (await exists(path.join(target,"pytest.ini")))||
  (await exists(path.join(target,"Cargo.toml")))||
  (await exists(path.join(target,"mcp","starter-typescript","test")));
add("executable tests",10,hasTests,"test entrypoint");
add("static checks",5,Boolean(scripts.typecheck||scripts.lint||scripts.check||scripts["architecture:selftest"]),"typecheck/lint/check");
const hasCi=(await exists(path.join(target,".github","workflows")))||(await exists(path.join(target,".gitlab-ci.yml")));
add("continuous integration",10,hasCi,"CI configuration");
const skillFiles=await walk(path.join(target,".agents","skills"),(file)=>path.basename(file)==="SKILL.md");
const verificationSkill=skillFiles.some((file)=>/runtime-verification|verify-|verification/i.test(file));
const verificationDoc=(await exists(path.join(target,"docs","verification-system.md")))||
  (await exists(path.join(target,".ai","templates","EVIDENCE.md")));
add("runtime verification contract",15,verificationSkill||verificationDoc,"runtime/user-path proof");
const featureMap=(await exists(path.join(target,"FEATURE_MAP.md")))||
  (await exists(path.join(target,".ai","templates","FEATURE_MAP.md")))||
  (await exists(path.join(target,"templates","FEATURE_MAP.md")));
add("feature map capability",10,featureMap,"user vocabulary -> runnable surface");
const deterministic=Boolean(scripts.dev||scripts.start||scripts.build||scripts["mcp:dev"])||
  (await exists(path.join(target,"Makefile")))||
  (await exists(path.join(target,"mcp","starter-typescript","package.json")));
add("deterministic boot/build",5,deterministic,"repeatable run command");
const taskInfra=(await exists(path.join(target,"orchestration")))||
  (await exists(path.join(target,".ai","orchestration")))||
  (await exists(path.join(target,"templates","HANDOFF.md")));
add("long-running/task artifacts",10,taskInfra,"task graph / handoff");
const security=(await exists(path.join(target,"SECURITY.md")))||(await exists(path.join(target,"docs","security.md")));
add("security boundaries",5,security,"security guidance");
const evals=(await exists(path.join(target,"evals")))||(await exists(path.join(target,".ai","evals")));
add("AI regression evals",5,evals,"eval dataset/harness");
const plans=(await exists(path.join(target,"templates","EXEC_PLAN.md")))||(await exists(path.join(target,".ai","templates","EXEC_PLAN.md")));
add("execution-plan contract",5,plans,"durable long-task state");
const total=checks.reduce((sum,check)=>sum+check.weight,0);
const earned=checks.reduce((sum,check)=>sum+(check.pass?check.weight:0),0);
const score=Math.round((earned/total)*100);
console.log("Agent-readiness: "+score+"/100 — "+target);
for(const check of checks){
  console.log("  "+(check.pass?"OK  ":"MISS")+" ["+String(check.weight).padStart(2)+"] "+check.name+" — "+check.note);
}
if(await exists(agents)){
  const lines=(await readFile(agents,"utf8")).split("\n").length;
  if(lines>200) console.log("  WARN AGENTS.md has "+lines+" lines; consider progressive disclosure");
}
if(strictThreshold!==null&&score<strictThreshold){
  console.error("Readiness score "+score+" is below strict threshold "+strictThreshold);
  process.exitCode=1;
}
