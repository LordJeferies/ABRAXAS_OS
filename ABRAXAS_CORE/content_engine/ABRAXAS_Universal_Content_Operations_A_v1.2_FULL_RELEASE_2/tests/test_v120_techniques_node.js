'use strict';const assert=require('assert');const R=require('../src/v120/technique-registry.js');const T=require('../src/v120/techniques.js');
assert.equal(R.techniques.length,41);for(let i=1;i<=41;i++){const id=`T${String(i).padStart(2,'0')}`;const t=R.techniques.find(x=>x.id===id);assert(t,id);assert(t.name&&t.status&&t.purpose&&t.modules.length&&t.references.length);assert(['implemented','selective','lab'].includes(t.status));}
for(const id of ['T02','T04','T05','T26','T27','T29','T30','T31','T35','T36','T39','T41'])assert.equal(R.byId(id).status,'implemented',id);
for(const id of ['T08','T14','T38'])assert.equal(R.byId(id).status,'lab',id);
for(const m of ['dashboard','factory','shim','studio','production','assets','calendar','library','architect','story'])assert(R.forModule(m).length>=3,m);
for(const k of ['init','destroy','initReveals','initCalendarDrag','initCommandSearch','initMagneticCTA'])assert.equal(typeof T[k],'function',k);
console.log('v1.2 Technique Registry + runtime PASS');
