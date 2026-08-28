const assert=require('assert');
const core=require('../src/core.js');
assert.equal(core.translatePatternToPhysical({nativeTypes:['video'],structure:['Hook','Contexto','Mecanismo','Cierre']},'carousel').mode,'ADAPTADO');
assert.equal(core.translatePatternToPhysical({nativeTypes:['carousel'],structure:['Hook','Idea','Cierre']},'carousel').mode,'NATIVO');
const b=core.buildBatchPlan({window:'2_weeks',cadence:{lot1:'medium',lot2:'low',lot3:'low'},useExisting:false,existing:[]});
assert.equal(b.filter(x=>x.lot==='L1'&&x.role==='reelPrincipal').length,2);
assert.equal(b.filter(x=>x.lot==='L1'&&x.role==='carouselPrincipal').length,2);
const high=core.buildBatchPlan({window:'1_week',cadence:{lot1:'high',lot2:'low',lot3:'low'},useExisting:false,existing:[]});
assert.equal(high.filter(x=>x.lot==='L1'&&x.role==='reelPrincipal').length,2);
assert.equal(high.filter(x=>x.lot==='L1'&&x.role==='carouselPrincipal').length,2);
const t=core.clientThemeTokens({accent:'#57C378',accentStrong:'#0D2D26'});
assert.equal(t['--client-accent'],'#57C378');

const mixed=core.buildBatchPlan({window:'2_weeks',cadence:{lot1:'high',lot2:'medium',lot3:'low'},useExisting:false,existing:[]});
assert.equal(mixed.filter(x=>x.lot==='L1').length,8); // 4 por semana
assert.equal(mixed.filter(x=>x.lot==='L2').length,4); // 2 por semana
assert.equal(mixed.filter(x=>x.lot==='L3').length,2); // 1 por semana
const month=core.buildBatchPlan({window:'1_month',cadence:{lot1:'medium',lot2:'high',lot3:'high'},useExisting:false,existing:[]});
assert.equal(month.filter(x=>x.lot==='L1').length,8); // 2 por semana x4
assert.equal(month.filter(x=>x.lot==='L2').length,12); // 3 por semana x4
assert.equal(month.filter(x=>x.lot==='L3').length,16); // 4 por semana x4
assert.deepEqual(core.lotCadenceCounts({lot1:'high',lot2:'medium',lot3:'low'}),{lot1:4,lot2:2,lot3:1});
console.log('core node tests PASS');
