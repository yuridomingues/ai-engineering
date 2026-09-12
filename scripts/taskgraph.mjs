#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, mkdir, open, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const args=process.argv.slice(2);
const command=args[0];
const graphArg=args[1];

function usage(){
  console.error("Usage:\n"+
    "  node scripts/taskgraph.mjs validate <graph>\n"+
    "  node scripts/taskgraph.mjs ready <graph> [--state <file>]\n"+
    "  node scripts/taskgraph.mjs status <graph> [--state <file>]\n"+
    "  node scripts/taskgraph.mjs claim <graph> --task <id> --worker <name> [--state <file>]\n"+
    "  node scripts/taskgraph.mjs complete <graph> --task <id> --evidence <file> [--state <file>]\n"+
    "  node scripts/taskgraph.mjs fail <graph> --task <id> --reason <text> [--state <file>]\n"+
    "  node scripts/taskgraph.mjs retry <graph> --task <id> [--state <file>]");
}
function option(name){const i=args.indexOf(name);return i>=0?args[i+1]:undefined;}
async function exists(file){try{await access(file);return true;}catch{return false;}}
function hashText(text){return createHash("sha256").update(text).digest("hex");}

function validateGraph(graph){
  const errors=[];
  if(!graph||graph.version!==1) errors.push("version must be 1");
  if(!Array.isArray(graph?.tasks)||graph.tasks.length===0){
    errors.push("tasks must be a non-empty array");
    return errors;
  }
  const ids=new Set();
  for(const task of graph.tasks){
    if(!task.id||typeof task.id!=="string") errors.push("every task needs a string id");
    if(ids.has(task.id)) errors.push("duplicate task id: "+task.id);
    ids.add(task.id);
    if(!task.title) errors.push((task.id??"<unknown>")+": title is required");
    if(!task.goal) errors.push((task.id??"<unknown>")+": goal is required");
    if(!Array.isArray(task.dependsOn)) errors.push((task.id??"<unknown>")+": dependsOn must be an array");
    if(!Array.isArray(task.acceptance)||task.acceptance.length===0) errors.push((task.id??"<unknown>")+": acceptance must be non-empty");
    if(!Array.isArray(task.verification)||task.verification.length===0) errors.push((task.id??"<unknown>")+": verification must be non-empty");
  }
  for(const task of graph.tasks){
    for(const dep of task.dependsOn??[]){
      if(!ids.has(dep)) errors.push(task.id+": unknown dependency "+dep);
      if(dep===task.id) errors.push(task.id+": cannot depend on itself");
    }
  }
  const byId=new Map(graph.tasks.map((task)=>[task.id,task]));
  const visiting=new Set();
  const visited=new Set();
  function visit(id,stack=[]){
    if(visiting.has(id)){errors.push("cycle detected: "+[...stack,id].join(" -> "));return;}
    if(visited.has(id)||!byId.has(id)) return;
    visiting.add(id);
    for(const dep of byId.get(id).dependsOn??[]) visit(dep,[...stack,id]);
    visiting.delete(id);
    visited.add(id);
  }
  for(const id of ids) visit(id);
  return [...new Set(errors)];
}

async function loadGraph(file){
  const absolute=path.resolve(file);
  const raw=await readFile(absolute,"utf8");
  const graph=JSON.parse(raw);
  const errors=validateGraph(graph);
  if(errors.length) throw new Error("Invalid task graph:\n- "+errors.join("\n- "));
  return {graph,raw,hash:hashText(raw),absolute};
}
function defaultState(){return path.resolve(".agent","taskgraph-state.json");}
async function loadState(graphInfo,stateFile){
  const file=path.resolve(stateFile);
  if(!(await exists(file))){
    return {file,state:{
      version:1,
      graphHash:graphInfo.hash,
      graphName:graphInfo.graph.name??path.basename(graphInfo.absolute),
      tasks:Object.fromEntries(graphInfo.graph.tasks.map((task)=>[task.id,{status:"pending"}]))
    }};
  }
  const state=JSON.parse(await readFile(file,"utf8"));
  if(state.graphHash!==graphInfo.hash) throw new Error("Task graph changed after state was created. Migrate or remove the state file.");
  for(const task of graphInfo.graph.tasks) state.tasks[task.id]??={status:"pending"};
  return {file,state};
}
async function saveState(file,state){
  await mkdir(path.dirname(file),{recursive:true});
  const temp=file+".tmp";
  await writeFile(temp,JSON.stringify(state,null,2)+"\n");
  await writeFile(file,await readFile(temp));
  await unlink(temp);
}
async function withLock(stateFile,fn){
  await mkdir(path.dirname(stateFile),{recursive:true});
  const lockPath=stateFile+".lock";
  let handle;
  try{handle=await open(lockPath,"wx");}catch{throw new Error("State is locked by another taskgraph process: "+lockPath);}
  try{return await fn();}finally{await handle.close();await unlink(lockPath).catch(()=>{});}
}
function taskById(graph,id){
  const task=graph.tasks.find((candidate)=>candidate.id===id);
  if(!task) throw new Error("Unknown task: "+id);
  return task;
}
function isReady(task,state){
  if(state.tasks[task.id]?.status!=="pending") return false;
  return task.dependsOn.every((dep)=>state.tasks[dep]?.status==="done");
}
function view(graph,state){
  return graph.tasks.map((task)=>({
    id:task.id,title:task.title,status:state.tasks[task.id]?.status??"pending",
    worker:state.tasks[task.id]?.worker??null,ready:isReady(task,state),dependsOn:task.dependsOn
  }));
}

if(!command||!graphArg){usage();process.exit(2);}
try{
  const graphInfo=await loadGraph(graphArg);
  if(command==="validate"){
    console.log("OK: "+graphInfo.graph.tasks.length+" tasks, acyclic, dependencies valid");
    process.exit(0);
  }
  const stateFile=path.resolve(option("--state")??defaultState());
  const loaded=await loadState(graphInfo,stateFile);
  if(command==="ready"){
    console.log(JSON.stringify(graphInfo.graph.tasks.filter((task)=>isReady(task,loaded.state)),null,2));
    process.exit(0);
  }
  if(command==="status"){console.log(JSON.stringify(view(graphInfo.graph,loaded.state),null,2));process.exit(0);}
  const taskId=option("--task");
  if(!taskId) throw new Error("--task is required");
  const task=taskById(graphInfo.graph,taskId);
  await withLock(loaded.file,async()=>{
    const fresh=await loadState(graphInfo,loaded.file);
    const item=fresh.state.tasks[task.id];
    if(command==="claim"){
      const worker=option("--worker");
      if(!worker) throw new Error("--worker is required");
      if(!isReady(task,fresh.state)) throw new Error("Task "+task.id+" is not ready; status="+item.status);
      item.status="running";item.worker=worker;item.claimedAt=new Date().toISOString();item.attempt=(item.attempt??0)+1;
    }else if(command==="complete"){
      const evidence=option("--evidence");
      if(!evidence) throw new Error("--evidence is required");
      if(item.status!=="running") throw new Error("Only running tasks can complete");
      const evidencePath=path.resolve(evidence);
      await stat(evidencePath);
      item.status="done";item.evidence=path.relative(process.cwd(),evidencePath);item.completedAt=new Date().toISOString();
    }else if(command==="fail"){
      if(item.status!=="running") throw new Error("Only running tasks can fail");
      item.status="failed";item.reason=option("--reason")??"unspecified";item.failedAt=new Date().toISOString();
    }else if(command==="retry"){
      if(item.status!=="failed") throw new Error("Only failed tasks can retry");
      fresh.state.tasks[task.id]={status:"pending",attempt:item.attempt??0,previousFailure:item.reason??null};
    }else{usage();throw new Error("Unknown command: "+command);}
    await saveState(fresh.file,fresh.state);
    console.log(JSON.stringify(fresh.state.tasks[task.id],null,2));
  });
}catch(error){
  console.error("ERROR:",error instanceof Error?error.message:error);
  process.exit(1);
}
