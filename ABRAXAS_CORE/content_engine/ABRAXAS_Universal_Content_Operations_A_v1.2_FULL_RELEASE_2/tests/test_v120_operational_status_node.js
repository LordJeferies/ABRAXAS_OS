'use strict';const assert=require('assert');globalThis.ABRAXAS_DATA=require('../src/data.js');require('../src/v120/quality-packs.js');const D=require('../src/v120/domain.js');
const c=D.allContents().find(x=>x.id==='abraxas-a1');assert(c);const s=D.operationalStatus(c);assert.equal(s.id,'SCHEDULED_AT_RISK');assert(s.reason&&s.label);
const unscheduled=JSON.parse(JSON.stringify(c));unscheduled.scheduledAt=null;assert.equal(D.operationalStatus(unscheduled).id,'NEEDS_SOURCE');
const published=JSON.parse(JSON.stringify(c));published.lifecycle='PUBLISHED';assert.equal(D.operationalStatus(published).id,'PUBLISHED');
const clean=JSON.parse(JSON.stringify(c));clean.scheduledAt=null;clean.productionTasks=(clean.productionTasks||[]).map(t=>({...t,status:'done'}));clean.expectedAssets=(clean.expectedAssets||[]).map(a=>({...a,status:'approved'}));assert.equal(D.operationalStatus(clean).id,'READY_TO_PUBLISH');
console.log('v1.2 operational status contract PASS');
