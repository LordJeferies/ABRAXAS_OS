'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const core=fs.readFileSync('src/core.js','utf8');
const data=fs.readFileSync('src/data.js','utf8');
const app=fs.readFileSync('src/app.js','utf8');
const elements=new Map();
function generic(id){
  if(!elements.has(id)) elements.set(id,{id,innerHTML:'',style:{},classList:{add(){},remove(){},contains(){return false}},insertAdjacentHTML(){},addEventListener(){},querySelectorAll(){return[]}});
  return elements.get(id);
}
const canvas=generic('homeBrainField');
canvas.getContext=()=>({setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fill(){},arc(){},closePath(){},globalAlpha:1,strokeStyle:'',fillStyle:'',lineWidth:1});
const doc={
  documentElement:{style:{setProperty(){}}},
  body:{insertAdjacentHTML(){},appendChild(){},append(){},classList:{add(){},remove(){}}},
  activeElement:null,
  getElementById(id){return id==='homeBrainField'?canvas:generic(id)},
  querySelector(){return null}, querySelectorAll(){return[]}, addEventListener(){}, createElement(){return generic('created')}
};
const storage={getItem(){return null},setItem(){},removeItem(){}};
const ctx={
 console,document:doc,localStorage:storage,window:null,globalThis:null,
 innerWidth:1440,innerHeight:900,navigator:{clipboard:{writeText:async()=>{}}},
 performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},
 matchMedia:()=>({matches:true,addEventListener(){},removeEventListener(){}}),
 setTimeout,clearTimeout,Blob:global.Blob,URL:{createObjectURL(){return'blob:x'},revokeObjectURL(){}},
 confirm:()=>true,alert(){}
};
ctx.window=ctx;ctx.globalThis=ctx;
vm.createContext(ctx);
let bootError=null;
try{
  vm.runInContext(core,ctx,{filename:'core.js'});
  vm.runInContext(data,ctx,{filename:'data.js'});
  vm.runInContext(app,ctx,{filename:'app.js'});
}catch(err){bootError=err;}
if(bootError){console.error('BOOT_ERROR',bootError.stack||bootError);}
assert.equal(bootError,null,'Standalone browser bootstrap must complete without throwing');
assert(elements.get('app').innerHTML.includes('app-shell'),'App shell should be rendered at bootstrap');
console.log('browser boot smoke PASS');
// Functional navigation smoke after successful browser bootstrap.
assert.equal(vm.runInContext('state.ui.section',ctx),'dashboard');
ctx.go('shim');
assert.equal(vm.runInContext('state.ui.section',ctx),'shim');
assert(elements.get('pageContent').innerHTML.includes('shim-stepper'),'Shim workspace must render after navigation');
ctx.setShimStepV096(2);
assert.equal(vm.runInContext('state.shim.step',ctx),2);
assert(elements.get('pageContent').innerHTML.includes('Define outputs editoriales'),'Shim step 2 must render');
ctx.go('calendar');
assert.equal(vm.runInContext('state.ui.section',ctx),'calendar');
assert(elements.get('pageContent').innerHTML.includes('Calendario editorial'),'Calendar must render after navigation');
ctx.go('dashboard');
assert.equal(vm.runInContext('state.ui.section',ctx),'dashboard');
assert(!elements.get('pageContent').innerHTML.includes('homeBrainField'),'Dashboard mode should not render the story brain by default');
ctx.setPresentationModeV112('story');
assert(elements.get('pageContent').innerHTML.includes('homeBrainField'),'Product Story mode should render the Home brain');
ctx.setPresentationModeV112('dashboard');
vm.runInContext('state.ui.architectOpen=false',ctx);
ctx.toggleArchitect();
assert.equal(vm.runInContext('state.ui.architectOpen',ctx),true,'Architect must open without reloading the shell');
ctx.setArchitectIntent('first');
assert.equal(vm.runInContext('state.ui.architectIntent',ctx),'first');
ctx.toggleArchitect();
assert.equal(vm.runInContext('state.ui.architectOpen',ctx),false,'Architect must close');
console.log('functional navigation smoke PASS');
for(const section of ['dashboard','clients','library','calendar','factory','production','shim','airesults','assets','branding','guide','roadmap']){
  ctx.go(section);
  assert.equal(vm.runInContext('state.ui.section',ctx),section,`Navigation must select ${section}`);
  assert(elements.get('pageContent').innerHTML.length>40,`${section} must render non-empty content`);
}
ctx.globalMenuGo('factory');
assert.equal(vm.runInContext('state.ui.section',ctx),'factory','Global menu navigation must close menu and navigate');
console.log('all workspace routes smoke PASS');
