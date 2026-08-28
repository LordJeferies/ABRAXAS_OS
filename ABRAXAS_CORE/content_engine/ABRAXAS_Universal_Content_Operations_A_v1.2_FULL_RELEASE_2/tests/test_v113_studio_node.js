'use strict';
const assert=require('assert');const data=require('../src/data.js');const core=require('../src/core.js');globalThis.ABRAXAS_DATA=data;globalThis.ABRAXAS_CORE=core;require('../src/v113/domain-adapter.js');const store=require('../src/v113/store.js');require('../src/v113/router.js');require('../src/v113/components.js');const studio=require('../src/v113/studio.js');
const reel=data.contents.find(c=>c.physicalType==='reel'); const carousel=data.contents.find(c=>c.physicalType==='carousel');
store.set({selectedContentId:reel.id,studioView:'script',studioReadingMode:'standard'});let h=studio.renderStudio();assert(h.includes('v113-studio-outline'));assert(h.includes('v113-studio-workspace'));assert(h.includes('v113-studio-inspector'));assert(h.includes('Teleprompter'));assert(h.includes('HOOK')||h.includes('Hook'));
store.set({studioReadingMode:'teleprompter'});h=studio.renderStudio();assert(h.includes('teleprompter-mode'));assert(h.includes(reel.units[0].text));
store.set({studioView:'copy',studioReadingMode:'standard'});h=studio.renderStudio();assert(h.includes('Copy'));assert(h.includes('Cómo usarlo'));assert(h.includes('Instagram'));
store.set({selectedContentId:carousel.id,studioView:'design'});h=studio.renderStudio();assert(h.includes('Prompt CON texto'));assert(h.includes('Prompt SIN texto'));assert(h.includes('Asset esperado'));
store.set({selectedContentId:reel.id,studioView:'editing'});h=studio.renderStudio();for(const token of ['Recording / source','B-roll','VFX / Omni','SFX','Music','Cover','Copies','START / MIDDLE / END']) assert(h.includes(token),token);
console.log('v1.1.3 Content Studio 2.0 PASS');
