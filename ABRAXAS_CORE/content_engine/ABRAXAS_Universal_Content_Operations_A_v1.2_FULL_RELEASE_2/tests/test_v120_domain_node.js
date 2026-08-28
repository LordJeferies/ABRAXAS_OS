'use strict';
const assert=require('assert');
global.ABRAXAS_DATA=require('../src/data.js');
global.ABRAXAS_CORE=require('../src/core.js');
const D=require('../src/v120/domain.js');
const ids=D.allContents().map(x=>x.id);
assert.equal(new Set(ids).size,ids.length,'content_id values must remain unique');
assert(ids.includes('joc-j1'),'existing v1 content IDs must survive');
for(const role of ['all','strategy','talent','copy','recording','design','editing','qa','publishing']){
  const rows=D.workItemsForRole(role); assert(Array.isArray(rows),role+' must project to an array');
}
const video=D.allContents().find(c=>['reel','horizontal'].includes(c.physicalType));
assert(video,'need video sample');
const rec=D.workItemForContent(video,'recording');
const edit=D.workItemForContent(video,'editing');
assert(rec && edit,'video needs distinct recording and editing projections');
assert.notEqual(rec.kind,edit.kind,'recording and editing must be distinct work kinds');
if(D.assetStatus(video,'master-video')==='missing'){
  assert.equal(edit.blocked,true,'editing must be blocked while recording/source is missing');
  assert(/Recording|source|grab/i.test(edit.blockedReason));
}
const pub=D.workItemForContent(video,'publishing');
assert(pub && typeof pub.blocked==='boolean');
console.log('v1.2 domain projections PASS');
