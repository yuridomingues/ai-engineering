#!/usr/bin/env node
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
const configArg=process.argv[2]??"architecture.layers.json";
const configPath=path.resolve(configArg);
async function exists(file){try{await access(file);return true;}catch{return false;}}
async function walk(dir,extensions,out=[]){
  if(!(await exists(dir))) return out;
  for(const entry of await readdir(dir)){
    const full=path.join(dir,entry);const info=await stat(full);
    if(info.isDirectory()) await walk(full,extensions,out); else if(extensions.has(path.extname(full))) out.push(full);
  }
  return out;
}
if(!(await exists(configPath))){console.error("Architecture config not found:",configPath);process.exit(2);}
const config=JSON.parse(await readFile(configPath,"utf8"));
const projectRoot=path.resolve(path.dirname(configPath),config.projectRoot??"..");
const sourceRoot=path.resolve(projectRoot,config.root??"src");
const extensions=new Set(config.extensions??[".ts",".tsx",".js",".jsx",".mjs",".cjs"]);
const layers=config.layers??[];
function normalize(p){return p.split(path.sep).join("/");}
function layerForAbsolute(file){
  const rel=normalize(path.relative(sourceRoot,file));
  return layers.find((layer)=>{
    const prefix=String(layer.path).replace(/^\.\//,"").replace(/\/$/,"");
    return rel===prefix||rel.startsWith(prefix+"/");
  });
}
function importsOf(source){
  const results=new Set();
  const patterns=[/\bfrom\s+["']([^"']+)["']/g,/\brequire\(\s*["']([^"']+)["']\s*\)/g,/\bimport\(\s*["']([^"']+)["']\s*\)/g];
  for(const regex of patterns){let match;while((match=regex.exec(source))) results.add(match[1]);}
  return [...results];
}
const files=await walk(sourceRoot,extensions);
const violations=[];
for(const file of files){
  const sourceLayer=layerForAbsolute(file);if(!sourceLayer) continue;
  const source=await readFile(file,"utf8");
  for(const specifier of importsOf(source)){
    if(!specifier.startsWith(".")) continue;
    const target=path.resolve(path.dirname(file),specifier);
    const targetLayer=layerForAbsolute(target);
    if(!targetLayer||targetLayer.name===sourceLayer.name) continue;
    const allowed=new Set(sourceLayer.mayDependOn??[]);
    if(!allowed.has(targetLayer.name)) violations.push({file:normalize(path.relative(projectRoot,file)),sourceLayer:sourceLayer.name,targetLayer:targetLayer.name,import:specifier});
  }
}
if(violations.length){
  console.error("Architecture boundary violations:");
  for(const v of violations) console.error("  "+v.file+": "+v.sourceLayer+" -> "+v.targetLayer+" via "+v.import);
  process.exit(1);
}
console.log("OK: "+files.length+" files checked across "+layers.length+" architectural layers");
