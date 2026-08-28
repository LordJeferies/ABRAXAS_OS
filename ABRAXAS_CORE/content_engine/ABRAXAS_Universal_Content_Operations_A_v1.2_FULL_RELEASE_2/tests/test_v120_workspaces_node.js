'use strict';const assert=require('assert');
global.ABRAXAS_DATA=require('../src/data.js');require('../src/v120/quality-packs.js');global.ABRAXAS_CORE=require('../src/core.js');global.V120_STORE=require('../src/v120/store.js');global.V120_DOMAIN=require('../src/v120/domain.js');global.V120_COMPONENTS=require('../src/v120/components.js');global.V120_ACTIONS=require('../src/v120/actions.js');
const modules=['factory','shim','library','assets','airesults','clients','branding','guide','roadmap'];for(const m of modules){const M=require(`../src/v120/${m}.js`);const h=M.render();assert(h&&h.length>200,`${m} empty`);assert(!h.includes('onclick='),`${m} inline onclick`);}
const F=require('../src/v120/factory.js');assert(F.render().includes('Crear pieza'));assert(F.render().includes('Crear lote'));assert(F.buildPromptBundle().editorial.includes('ROL'));
const SH=require('../src/v120/shim.js');const sp=SH.package();assert(sp.prompt.includes('SHIM_CONFIRMED_MANIFEST'));assert(sp.prompt.includes('DaVinci'));assert(sp.prompt.includes('Terminal'));assert(sp.prompt.includes('CARRUSEL'));
const L=require('../src/v120/library.js');assert(L.render().includes('Buscar contenido'));
const AS=require('../src/v120/assets.js');assert(AS.render().includes('Expected slots'));
const AI=require('../src/v120/airesults.js');assert(AI.render().includes('Mapping Preview'));
const CL=require('../src/v120/clients.js');assert(CL.render().includes('Quality Pack'));
const BR=require('../src/v120/branding.js');assert(BR.render().includes('25 tools'));
console.log('v1.2 operational workspaces PASS');
