'use strict';
const assert=require('assert');const data=require('../src/data.js');const core=require('../src/core.js');globalThis.ABRAXAS_DATA=data;globalThis.ABRAXAS_CORE=core;require('../src/v113/domain-adapter.js');const store=require('../src/v113/store.js');require('../src/v113/router.js');require('../src/v113/components.js');const dash=require('../src/v113/dashboard.js');const prod=require('../src/v113/production.js');
for(const role of ['all','script','copy','recording','design','editing','qa','publishing']){store.set({roleMode:role,section:'dashboard'});const h=dash.renderDashboard();assert(h.includes('v113-dashboard'),role);assert(h.includes('My Work'),role);}
store.set({section:'production',roleMode:'copy'});let p=prod.renderProduction();assert(p.includes('Copy'));assert(p.includes('v113-production-tabs'));
store.set({roleMode:'recording'});p=prod.renderProduction();assert(p.includes('Recording'));
store.set({roleMode:'editing'});p=prod.renderProduction();assert(p.includes('Editing'));
assert(p.includes('dependency')||p.includes('Bloque'));
console.log('v1.1.3 dashboard/roles PASS');
