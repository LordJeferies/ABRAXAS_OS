'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const path='ABRAXAS_Universal_Content_Operations_A_v1.1.2.html';
assert(fs.existsSync(path),'v1.1.2 standalone must exist before release');
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert(scripts.length>=4,'standalone must contain embedded assets/core/data/app scripts');
const elements=new Map();
function generic(id){if(!elements.has(id))elements.set(id,{id,innerHTML:'',value:'',style:{},classList:{add(){},remove(){},contains(){return false}},insertAdjacentHTML(){},addEventListener(){},querySelectorAll(){return[]},click(){},select(){},remove(){},setAttribute(){},getAttribute(){return null}});return elements.get(id)}
const canvas=generic('homeBrainField');canvas.getContext=()=>({setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fill(){},arc(){},closePath(){},globalAlpha:1,strokeStyle:'',fillStyle:'',lineWidth:1});
const doc={documentElement:{style:{setProperty(){}}},body:{insertAdjacentHTML(){},appendChild(){},append(){},classList:{add(){},remove(){}}},activeElement:null,getElementById(id){return id==='homeBrainField'?canvas:generic(id)},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},createElement(){return generic('created')},execCommand(){return true}};
const storage={getItem(){return null},setItem(){},removeItem(){}};
const ctx={console,document:doc,localStorage:storage,window:null,globalThis:null,innerWidth:1440,innerHeight:900,navigator:{clipboard:{writeText:async()=>{}}},performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},matchMedia:()=>({matches:true,addEventListener(){},removeEventListener(){}}),setTimeout,clearTimeout,Blob:global.Blob,URL:{createObjectURL(){return'blob:x'},revokeObjectURL(){}},confirm:()=>true,alert(){}};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
let err=null;try{for(const [i,s] of scripts.entries())vm.runInContext(s,ctx,{filename:`standalone-script-${i}.js`})}catch(e){err=e;console.error(e.stack||e)}
assert.equal(err,null,'standalone bootstrap must not throw');
assert(generic('app').innerHTML.includes('app-shell'),'standalone must render app shell');
for(const section of ['dashboard','clients','library','calendar','factory','production','shim','airesults','assets','branding','guide','roadmap']){ctx.go(section);assert.equal(vm.runInContext('state.ui.section',ctx),section);assert(generic('pageContent').innerHTML.length>40,`${section} must render`)}
console.log('standalone browser boot + routes PASS');
