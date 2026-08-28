'use strict';
const assert=require('assert');

global.ABRAXAS_DATA=require('../src/data.js');
global.ABRAXAS_CORE=require('../src/core.js');
global.V120_STORE=require('../src/v120/store.js');
global.V120_DOMAIN=require('../src/v120/domain.js');
global.V120_COMPONENTS=require('../src/v120/components.js');
global.V120_FACTORY=require('../src/v120/factory.js');
global.V120_AIRESULTS=require('../src/v120/airesults.js');
const A=require('../src/v120/actions.js');

const messages=[];
A.configure({render(){},toast(x){messages.push(x)},copyText(){return Promise.resolve()}});
global.V120_DOMAIN.reset();
global.V120_STORE.reset();

// 1) Production mutation: completing a real task must mutate the same Content.
const taskContent=global.V120_DOMAIN.allContents().find(c=>(c.productionTasks||[]).some(t=>!['done','approved'].includes(t.status)));
assert(taskContent,'fixture must contain a content with an open production task');
const task=(taskContent.productionTasks||[]).find(t=>!['done','approved'].includes(t.status));
assert.equal(A.dispatch('task.complete',{contentId:taskContent.id,taskId:task.id}),true);
assert.equal(global.V120_DOMAIN.contentById(taskContent.id).productionTasks.find(t=>t.id===task.id).status,'done');
assert(messages.some(m=>m.title==='Tarea completada'));

// 2) He mutation: save creates one new Content with stable content_id and AI_READY state.
const beforeIds=new Set(global.V120_DOMAIN.allContents().map(c=>c.id));
global.V120_STORE.set({factory:{mode:'piece',step:4,clientId:'joc',physicalType:'reel',topic:'Prueba end-to-end v1.2',objective:'Validar creación real desde He',audience:'Founder',quantity:1}});
assert.equal(A.dispatch('factory.save',{}),true);
const created=global.V120_DOMAIN.allContents().find(c=>!beforeIds.has(c.id));
assert(created,'factory.save must create a new Content');
assert.equal(created.lifecycle,'AI_READY');
assert.equal(global.V120_STORE.get().selectedContentId,created.id);
assert(global.V120_DOMAIN.contentById(created.id),'created content must be retrievable by same content_id');

// 3) Asset mutation: path/status update the expected slot on same Content.
const assetContent=global.V120_DOMAIN.allContents().find(c=>(c.expectedAssets||[]).length);
assert(assetContent,'fixture must contain content with expected asset slots');
const slot=assetContent.expectedAssets[0];
assert.equal(A.dispatch('asset.path',{contentId:assetContent.id,slotId:slot.slotId,value:'assets/test/v120-proof.png'}),true);
let asset=global.V120_DOMAIN.contentById(assetContent.id).expectedAssets.find(a=>a.slotId===slot.slotId);
assert.equal(asset.relativePath,'assets/test/v120-proof.png');
assert.equal(asset.status,'linked');
assert.equal(A.dispatch('asset.status',{contentId:assetContent.id,slotId:slot.slotId,status:'approved'}),true);
asset=global.V120_DOMAIN.contentById(assetContent.id).expectedAssets.find(a=>a.slotId===slot.slotId);
assert.equal(asset.status,'approved');
assert(global.V120_DOMAIN.contentById(assetContent.id).history.some(h=>h.type==='asset_status'&&h.slotId===slot.slotId));

// 4) AI Results mutation: preview + confirm hydrate SAME content_id and append history.
const aiTarget=global.V120_DOMAIN.allContents().find(c=>c.id!==created.id);
assert(aiTarget);
const priorCount=global.V120_DOMAIN.allContents().length;
const payload={contentId:aiTarget.id,title:'Título hidratado por prueba v1.2',summary:'Resultado IA de prueba',copies:{Instagram:'Copy importado'}};
global.V120_STORE.set({ai:{destination:aiTarget.id,type:'package',input:JSON.stringify(payload),preview:null}});
assert.equal(A.dispatch('ai.preview',{}),true);
assert.equal(global.V120_STORE.get().ai.preview.status,'ready');
assert.equal(A.dispatch('ai.confirm',{}),true);
const hydrated=global.V120_DOMAIN.contentById(aiTarget.id);
assert.equal(hydrated.id,aiTarget.id);
assert.equal(hydrated.title,payload.title);
assert.equal(hydrated.copies.Instagram,'Copy importado');
assert.equal(hydrated.lifecycle,'AI_RESULT');
assert.equal(global.V120_DOMAIN.allContents().length,priorCount,'AI import must not duplicate Content');
assert(hydrated.history.some(h=>h.type==='ai_result_imported'));

// 5) Calendar mutation: reschedule and return to Backlog without duplicating Content.
const calId=hydrated.id;
const contentCount=global.V120_DOMAIN.allContents().length;
assert.equal(A.dispatch('calendar.move',{contentId:calId,date:'2026-09-03'}),true);
assert.equal(global.V120_DOMAIN.contentById(calId).scheduledAt,'2026-09-03');
assert.equal(A.dispatch('calendar.move',{contentId:calId,date:'__BACKLOG__'}),true);
assert.equal(global.V120_DOMAIN.contentById(calId).scheduledAt,null);
assert.equal(global.V120_DOMAIN.allContents().length,contentCount,'calendar move must not duplicate Content');

console.log('v1.2 real action mutations PASS');
