'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm');
const path='ABRAXAS_Universal_Content_Operations_A_v1.1.3.html';
assert(fs.existsSync(path),'v1.1.3 standalone must exist');
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert(scripts.length>=20,'standalone must embed new modular frontend');
const elements=new Map();
function generic(id){if(!elements.has(id)){const el={id,innerHTML:'',value:'',hidden:false,dataset:{},style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){}},insertAdjacentHTML(){},addEventListener(){},querySelectorAll(){return[]},querySelector(){return null},click(){},select(){},remove(){},setAttribute(){},getAttribute(){return null},getBoundingClientRect(){return{width:1220,height:720}}};elements.set(id,el);}return elements.get(id)}
const canvas=generic('v113BrainCanvas');canvas.getContext=()=>({setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},bezierCurveTo(){},ellipse(){},stroke(){},fill(){},arc(){},closePath(){},globalAlpha:1,strokeStyle:'',fillStyle:'',lineWidth:1});
const doc={documentElement:{style:{setProperty(){}},setAttribute(){}},body:{insertAdjacentHTML(){},appendChild(){},append(){},classList:{add(){},remove(){}}},activeElement:null,getElementById(id){return id==='v113BrainCanvas'?canvas:generic(id)},querySelector(sel){if(sel==='.v113-brain-zoom span')return generic('zoomspan');return null},querySelectorAll(){return[]},addEventListener(){},createElement(){return generic('created')},execCommand(){return true}};
const storageMap=new Map();const storage={getItem(k){return storageMap.get(k)||null},setItem(k,v){storageMap.set(k,String(v))},removeItem(k){storageMap.delete(k)}};
const ctx={console,document:doc,localStorage:storage,window:null,globalThis:null,innerWidth:1440,innerHeight:900,devicePixelRatio:1,navigator:{clipboard:{writeText:async()=>{}}},performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},matchMedia:()=>({matches:true,addEventListener(){},removeEventListener(){}}),setTimeout,clearTimeout,Blob:global.Blob,URL:{createObjectURL(){return'blob:x'},revokeObjectURL(){}},confirm:()=>true,alert(){},IntersectionObserver:undefined};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
let err=null;try{for(const [i,s] of scripts.entries())vm.runInContext(s,ctx,{filename:`v113-script-${i}.js`})}catch(e){err=e;console.error(e.stack||e)}
assert.equal(err,null,'v1.1.3 standalone bootstrap must not throw');
assert.equal(vm.runInContext('VERSION',ctx),'1.1.3');
assert(generic('app').innerHTML.includes('v113-app'),'new app shell should render');
assert(generic('app').innerHTML.includes('v113-sidebar'),'Dashboard should include sidebar');
assert(generic('app').innerHTML.includes('Product Story'),'global presentation toggle should render');
for(const section of ['dashboard','clients','library','calendar','factory','production','shim','airesults','assets','branding','guide','roadmap']){ctx.V113_ROUTER.go(section);assert.equal(ctx.V113_STORE.getState().section,section);assert(generic('app').innerHTML.length>200,`${section} should render`)}
ctx.V113_ROUTER.go('production');assert(generic('app').innerHTML.includes('My Work'));assert(generic('app').innerHTML.includes('Editing'));
ctx.setRoleModeV113('script');ctx.V113_ROUTER.go('dashboard');assert.equal(ctx.V113_STORE.getState().roleMode,'script');
const reel=ctx.V113_DOMAIN.allContents().find(c=>c.physicalType==='reel')||ctx.V113_DOMAIN.allContents()[0];ctx.V113_ROUTER.openContent(reel.id,'script','dashboard');assert(generic('app').innerHTML.includes('Teleprompter'));assert(generic('app').innerHTML.includes('Modo lectura'));
const answer=ctx.V113_ARCHITECT.architectResolveV113('donde puedo crear contenido');const labels=answer.routes.map(r=>r.label).join(' ');assert(/He/.test(labels));assert(/Shim/.test(labels));
ctx.V113_ROUTER.go('dashboard');ctx.setPresentationModeV113('story');assert(generic('app').innerHTML.includes('v113-product-story'));assert(generic('app').innerHTML.includes('v113BrainCanvas'));assert(ctx.V113_BRAIN.BRAIN_ANATOMY.includes('left_hemisphere'));assert(ctx.V113_BRAIN.BRAIN_ANATOMY.includes('interhemispheric_fissure'));
ctx.setPresentationModeV113('dashboard');assert(generic('app').innerHTML.includes('v113-sidebar'));
console.log('v1.1.3 browser boot + routes + roles + story + architect PASS');
