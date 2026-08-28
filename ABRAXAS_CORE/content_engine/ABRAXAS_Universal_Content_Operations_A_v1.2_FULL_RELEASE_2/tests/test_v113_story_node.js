'use strict';
const assert=require('assert');const data=require('../src/data.js');const core=require('../src/core.js');globalThis.ABRAXAS_DATA=data;globalThis.ABRAXAS_CORE=core;require('../src/v113/domain-adapter.js');const store=require('../src/v113/store.js');require('../src/v113/router.js');require('../src/v113/components.js');const brain=require('../src/v113/brain.js');const story=require('../src/v113/product-story.js');
const pts=brain.generateBrainPoints(900,1200,700,1);assert.equal(pts.length,900);assert(brain.BRAIN_ANATOMY.includes('left_hemisphere'));assert(brain.BRAIN_ANATOMY.includes('interhemispheric_fissure'));assert(brain.BRAIN_ANATOMY.includes('gyri_sulci'));
assert.equal(brain.clampZoom(.5),1);assert.equal(brain.clampZoom(3),2);
for(const t of ['brain','routes','content_graph','production_flow','calendar','published_network'])assert(brain.MORPH_TARGETS.includes(t));
store.set({presentationMode:'story',section:'dashboard',brainZoom:1});let h=story.renderProductStory('dashboard');assert(h.includes('v113BrainCanvas'));assert(h.includes('Get the highlights'));assert(h.includes('Take a closer look'));assert(h.includes('Built for how you work'));assert(h.includes('From transcript to timeline'));assert(h.includes('brain-hotspot'));
console.log('v1.1.3 brain/product story PASS');
assert.equal(brain.PARTICLE_GLYPH,'open-chevron','Brain particles must use ABRAXAS open-chevron glyph');
assert.equal(typeof brain.drawBrainStructure,'function','Brain must expose anatomical structure renderer');
