'use strict';const assert=require('assert');
global.V120_STORE=require('../src/v120/store.js');global.V120_DOMAIN={};global.V120_ACTIONS={};
const C=require('../src/v120/components.js');global.V120_COMPONENTS=C;const S=require('../src/v120/shell.js');
const html=S.renderShell('<section id="x">X</section>');
assert(html.includes('v120-sidebar'));assert(html.includes('data-action="sidebar.toggle"'));assert(html.includes('data-action="presentation.set"'));assert(html.includes('data-mode="story"'));assert(html.includes('data-change-action="role.set"'));assert(html.includes('v120-topbar'));assert(html.includes('v120-architect-launcher'));assert(html.includes('v120-workspace'));
console.log('v1.2 shell contract PASS');
