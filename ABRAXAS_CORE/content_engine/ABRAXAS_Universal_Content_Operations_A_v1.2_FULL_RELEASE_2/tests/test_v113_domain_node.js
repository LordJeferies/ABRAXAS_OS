'use strict';
const assert=require('assert');
const data=require('../src/data.js');
const core=require('../src/core.js');
globalThis.ABRAXAS_DATA=data; globalThis.ABRAXAS_CORE=core;
const domain=require('../src/v113/domain-adapter.js');
const store=require('../src/v113/store.js');
const router=require('../src/v113/router.js');
assert.equal(domain.version,'1.1.3');
assert.equal(domain.allContents().length,data.contents.length);
assert.deepEqual(domain.allContents().map(c=>c.id),data.contents.map(c=>c.id));
for(const role of ['all','strategy','script','copy','recording','design','editing','qa','publishing']){
  assert(Array.isArray(domain.contentsForRole(role)),role);
  assert(Array.isArray(domain.tasksForRole(role)),role);
}
const ids=new Set(domain.allContents().map(c=>c.id));
assert.equal(ids.size,domain.allContents().length,'content ids stay unique');
const s=store.createStore({legacy:{ui:{presentationMode:'story',roleMode:'copy'}}});
assert.equal(s.getState().presentationMode,'story');
assert.equal(s.getState().roleMode,'copy');
s.set({roleMode:'recording'}); assert.equal(s.getState().roleMode,'recording');
router.go('production'); assert.equal(store.getState().section,'production');
router.openContent(data.contents[0].id,'script');
assert.equal(store.getState().selectedContentId,data.contents[0].id);
assert.equal(store.getState().studioView,'script');
console.log('v1.1.3 domain/store/router PASS');
