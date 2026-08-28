'use strict';
const assert=require('assert');const data=require('../src/data.js');const core=require('../src/core.js');globalThis.ABRAXAS_DATA=data;globalThis.ABRAXAS_CORE=core;require('../src/v113/domain-adapter.js');const store=require('../src/v113/store.js');require('../src/v113/router.js');require('../src/v113/components.js');
const modules={factory:require('../src/v113/factory.js'),shim:require('../src/v113/shim.js'),library:require('../src/v113/library.js'),assets:require('../src/v113/assets.js'),calendar:require('../src/v113/calendar.js'),clients:require('../src/v113/clients.js'),branding:require('../src/v113/branding.js'),airesults:require('../src/v113/airesults.js'),guide:require('../src/v113/guide.js'),roadmap:require('../src/v113/roadmap.js')};
for(const [name,m] of Object.entries(modules)){assert.equal(typeof m.render,'function',name);const h=m.render();assert(typeof h==='string'&&h.length>80,name);}
let h=modules.factory.render();assert(h.includes('Crear pieza'));assert(h.includes('Crear lote'));
h=modules.shim.render();assert(h.includes('Fuente'));assert(h.includes('Qué quieres obtener'));assert(h.includes('CUT_AUTOMATION_PACKAGE'));assert(h.includes('CAROUSEL_PRODUCTION_PACKAGE'));
h=modules.library.render();assert(h.includes('Buscar'));assert(h.includes('Filtros'));
h=modules.assets.render();assert(h.includes('Asset'));assert(h.includes('slot'));
h=modules.calendar.render();assert(h.includes('Backlog'));assert(h.includes('calendar'));
h=modules.clients.render();for(const id of ['ABRAXAS','Moka','JOC','INENERGY'])assert(h.toLowerCase().includes(id.toLowerCase()),id);
h=modules.branding.render();assert(h.includes('25')||h.includes('Branding Method'));
h=modules.airesults.render();assert(h.includes('Preview'));assert(h.includes('Mapeo'));
console.log('v1.1.3 workspaces PASS');
assert(h=modules.shim.render(),h.includes('Cliente / Quality Pack'));
assert.equal(typeof modules.shim.applyJocPodcastPresetV113,'function');
