'use strict';
const fs=require('fs');
const path=require('path');
const core=require('../src/core.js');
const data=require('../src/data.js');globalThis.ABRAXAS_DATA=data;require('../src/v120/quality-packs.js');
const out=[];
function add(kind,id,prompt,meta={}){const q=core.scorePrompt(prompt);out.push({kind,id,prompt,...meta,quality:q});}
for(const c of data.contents){
  const client=data.clients.find(x=>x.id===c.clientId);
  const inputs=c.promptInputs||{};
  add('master_editorial',`${c.id}:editorial`,core.compileEditorialPrompt(c,client,inputs),{contentId:c.id,clientId:c.clientId});
  add('master_visual',`${c.id}:visual`,core.compileVisualPrompt(c,client,inputs),{contentId:c.id,clientId:c.clientId});
  for(const task of c.productionTasks||[]) add('production_task',`${c.id}:${task.id}`,core.makeTaskPrompt(c,task,client),{contentId:c.id,clientId:c.clientId,taskType:task.type});
  for(const [i,u] of (c.units||[]).entries()){
    const base={contentId:c.id,clientId:c.clientId,unitId:u.id||`u${i+1}`,unitIndex:i};
    add('unit_recording',`${c.id}:${i}:recording`,core.compileUnitRecordingPrompt(c,u,i,client),base);
    add('unit_music',`${c.id}:${i}:music`,core.compileUnitMusicPrompt(c,u,i,client),base);
    add('unit_cover',`${c.id}:${i}:cover`,core.compileUnitCoverPrompt(c,u,i,client),base);
    add('unit_copies',`${c.id}:${i}:copies`,core.compileUnitCopiesPrompt(c,u,i,client),base);
    if(['reel','horizontal'].includes(c.physicalType)){
      add('unit_omni',`${c.id}:${i}:omni`,core.compileUnitOmniPrompt(c,u,i,client),base);
      add('unit_reference_frames',`${c.id}:${i}:refs`,core.compileUnitReferenceImagesPrompt(c,u,i,client),base);
      add('unit_broll',`${c.id}:${i}:broll`,core.compileUnitBrollPrompt(c,u,i,client),base);
      add('unit_still',`${c.id}:${i}:still`,core.compileUnitStillPrompt(c,u,i,client),base);
      add('unit_sfx',`${c.id}:${i}:sfx`,core.compileUnitSfxPrompt(c,u,i,client),base);
    } else if(c.physicalType==='carousel'){
      add('carousel_with_text',`${c.id}:${i}:with_text`,core.compileCarouselSlidePrompt(c,u,i,client,true),base);
      add('carousel_without_text',`${c.id}:${i}:without_text`,core.compileCarouselSlidePrompt(c,u,i,client,false),base);
      add('unit_still',`${c.id}:${i}:still`,core.compileUnitStillPrompt(c,u,i,client),base);
    } else {
      add('unit_still',`${c.id}:${i}:still`,core.compileUnitStillPrompt(c,u,i,client),base);
    }
  }
}
for(const client of data.clients){for(const driver of data.brandingDrivers){for(const tool of driver.tools){add('branding_tool',`${client.id}:${driver.id}:${tool.toolId}`,core.buildBrandToolPrompt(client,driver,tool),{clientId:client.id,driverId:driver.id,toolId:tool.toolId});}}}
const shimCfg={sourceLabel:'Entrevista demo ABRAXAS',context:'Conversación B2B sobre criterio, producción y publicación.',verticalEnabled:true,verticalCount:8,horizontalEnabled:true,horizontalCount:2,platforms:['Instagram','LinkedIn','YouTube Shorts','YouTube'],structures:['V1 Problema → Criterio → Regla','H1 Deep Explainer'],customStructure:'',carouselEnabled:true,carouselCount:6,transcript:'[00:00:05 - 00:00:18] Una objeción repetida ya es una señal: si aparece muchas veces, hay un tema que merece convertirse en contenido.\n[00:00:19 - 00:00:42] El problema es producir sin saber qué función cumple cada pieza. Primero definimos criterio, estructura y qué decisión debe mover.\n[00:00:43 - 00:01:05] Después producimos, revisamos, vinculamos assets y calendarizamos. La velocidad llega después del criterio, no antes.'};
add('shim','shim:demo',core.buildShimPrompt(shimCfg),{});
const dir=path.join(__dirname,'..','reports');fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'runtime_prompts.json');fs.writeFileSync(file,JSON.stringify({version:'1.2',count:out.length,prompts:out},null,2));
const scores=out.map(x=>x.quality.score),words=out.map(x=>x.quality.words);const fails=out.filter(x=>!x.quality.pass);
console.log(JSON.stringify({count:out.length,failures:fails.length,minScore:Math.min(...scores),avgScore:Number((scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2)),minWords:Math.min(...words)},null,2));
if(fails.length){console.error(fails.slice(0,15).map(x=>({kind:x.kind,id:x.id,quality:x.quality})));process.exit(1)}
