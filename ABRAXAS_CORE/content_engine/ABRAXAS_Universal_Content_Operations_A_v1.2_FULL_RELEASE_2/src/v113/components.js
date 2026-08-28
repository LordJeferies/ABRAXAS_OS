(function(root,factory){const api=factory(root.V113_STORE||(typeof require!=='undefined'?require('./store.js'):null),root.V113_ROUTER||(typeof require!=='undefined'?require('./router.js'):null));root.V113_COMPONENTS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this,function(STORE,ROUTER){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const ICONS={
 dashboard:'<path d="M4 4h6v6H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 14h6v6H4z"/>',
 clients:'<path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 19a4.5 4.5 0 0 1 9 0M13 19a4 4 0 0 1 8 0"/>',
 library:'<path d="M5 4h14v16H5zM9 4v16M5 9h14"/>',calendar:'<path d="M4 6h16v14H4zM7 3v6M17 3v6M4 10h16"/>',
 factory:'<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',production:'<path d="M4 7h16M4 12h16M4 17h16M7 4v6M12 9v6M17 14v6"/>',
 shim:'<path d="M5 4h14v4H5zM7 12h10M9 16h6M12 8v13"/>',airesults:'<path d="M4 5h16v14H4zM8 9h8M8 13h5M15 16l2 2 3-4"/>',
 assets:'<path d="M4 6h7l2 2h7v11H4zM7 15l3-3 2 2 2-2 3 3"/>',branding:'<path d="M12 3l8 5v8l-8 5-8-5V8zM12 7v10M8 9l8 6M16 9 8 6"/>',
 guide:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM8 4v16"/>',roadmap:'<path d="M4 18c4-8 5-12 9-12 3 0 3 4 7 0M5 18h4M15 6h4"/>',
 studio:'<path d="M3 5h18v14H3zM8 5v14M16 5v14"/>',search:'<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',architect:'<path d="M6 20 12 4l6 16M8 15h8M12 4v16"/>',
 chevron:'<path d="m9 6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m5 12 4 4L19 6"/>',warning:'<path d="M12 3 3 20h18zM12 9v4M12 17h.01"/>',play:'<path d="m9 6 9 6-9 6z"/>'
};
function icon(name,label=''){return `<svg class="v113-icon" viewBox="0 0 24 24" role="img" aria-label="${esc(label||name)}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.chevron}</svg>`;}
function button(label,opts={}){return `<button class="v113-btn ${opts.kind||''}" ${opts.onclick?`onclick="${opts.onclick}"`:''} ${opts.disabled?'disabled':''}>${opts.icon?icon(opts.icon):''}<span>${esc(label)}</span></button>`;}
function pill(text,kind=''){return `<span class="v113-pill ${kind}">${esc(text)}</span>`;}
function progress(value,label=''){const n=Math.max(0,Math.min(100,Number(value)||0));return `<div class="v113-progress" aria-label="${esc(label||`Progreso ${n}%`)}"><i style="width:${n}%"></i></div>`;}
function renderStateView(kind,spec={}){const title=spec.title||({empty:'Nada aquí todavía',loading:'Procesando',success:'Listo',error:'Algo necesita atención'}[kind]||'Estado');const body=spec.body||'';return `<section class="v113-state state-${kind}"><div class="v113-state-icon">${icon(kind==='error'?'warning':kind==='success'?'check':'dashboard')}</div><h3>${esc(title)}</h3>${body?`<p>${esc(body)}</p>`:''}${spec.action?button(spec.action.label,{kind:'primary',onclick:spec.action.onclick}):''}</section>`;}
function sectionTitle(title,subtitle,actions=''){return `<div class="v113-section-title"><div><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${actions?`<div class="v113-title-actions">${actions}</div>`:''}</div>`;}
function segmented(name,items,value,onchange){return `<div class="v113-segmented" role="group" aria-label="${esc(name)}">${items.map(([id,label])=>`<button class="${id===value?'active':''}" onclick="${onchange}('${id}')">${esc(label)}</button>`).join('')}</div>`;}
function disclosure(title,body,open=false){return `<details class="v113-disclosure" ${open?'open':''}><summary>${esc(title)}${icon('chevron')}</summary><div class="v113-disclosure-body">${body}</div></details>`;}
function brandIcon(){const src=globalThis.ABRAXAS_ASSETS?.abraxasAppIcon;return src?`<img src="${src}" alt="ABRAXAS">`:`<span class="v113-brand-glyph">A</span>`;}
return {esc,icon,button,pill,progress,renderStateView,sectionTitle,segmented,disclosure,brandIcon};
});
