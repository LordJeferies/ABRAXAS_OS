'use strict';
const assert=require('assert');
global.ABRAXAS_DATA=require('../src/data.js');global.ABRAXAS_CORE=require('../src/core.js');
global.V120_STORE=require('../src/v120/store.js');global.V120_DOMAIN=require('../src/v120/domain.js');global.V120_COMPONENTS=require('../src/v120/components.js');global.V120_ACTIONS=require('../src/v120/actions.js');
const A=require('../src/v120/architect.js');
const cases=[
 ['donde puedo crear contenido',['factory','shim','library']],
 ['quiero procesar un podcast',['shim']],
 ['qué tengo que grabar',['production']],
 ['dónde están los copies',['production']],
 ['qué falta de diseño',['production']],
 ['qué tengo que editar',['production']],
 ['qué publico hoy',['calendar']],
 ['cómo llevo el resultado de IA',['airesults']],
 ['dónde pongo la imagen',['assets']],
 ['qué está bloqueado',['production']],
 ['cómo reviso una pieza',['library']],
 ['qué hace He',['factory']],
 ['qué hace Shim',['shim']],
 ['qué es Brand Intelligence',['branding']],
 ['cómo veo una campaña',['calendar','library']],
 ['cómo calendarizo',['calendar']],
 ['dónde está DaVinci',['shim']],
 ['dónde está FFmpeg / Terminal',['shim']]
];
for(const [q,targets] of cases){const ans=A.resolve(q);assert(ans.title&&ans.summary);assert(ans.routes.length>=1,q);for(const t of targets)assert(ans.routes.some(r=>r.section===t),`${q} missing ${t}`);for(const r of ans.routes){assert(r.reason&&r.firstAction&&r.expectedResult&&r.successCondition);}}
const ctx=A.context();for(const k of ['section','stage','roleMode','presentationMode','filters','pending','nextAction'])assert(Object.hasOwn(ctx,k),k);
const html=A.render(true,'donde puedo crear contenido');assert(html.includes('El Arquitecto'));assert(html.includes('Dónde puedo crear contenido'));assert(html.includes('data-action="architect.route"'));assert(html.includes('Preparar pregunta para IA'));
const p=A.externalPrompt('donde puedo crear contenido');assert(p.includes('ROL ACTUAL'));assert(p.includes('PASO A PASO'));assert(p.includes('NO INVENTES'));
console.log('v1.2 Architect 4.0 PASS');
