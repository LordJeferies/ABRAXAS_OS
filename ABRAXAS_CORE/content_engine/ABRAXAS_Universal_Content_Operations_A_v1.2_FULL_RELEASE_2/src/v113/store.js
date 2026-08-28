(function(root,factory){const api=factory();root.V113_STORE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const KEY='ABRAXAS_A_v1.1.3_UI';
  const DEFAULT={version:'1.1.3',section:'dashboard',presentationMode:'dashboard',roleMode:'all',selectedContentId:null,selectedTaskId:null,studioView:'overview',studioReadingMode:'standard',sidebarCollapsed:false,commandOpen:false,architectOpen:false,architectQuery:'',architectIntent:'first',filters:{search:'',client:'all',status:'all',format:'all'},calendarMonth:'2026-08',brainZoom:1,storyChapter:'hero',toast:null,inspectorOpen:true,modal:null,factoryDraft:null,shimDraft:null,selectedClientId:null};
  let state={...DEFAULT,filters:{...DEFAULT.filters}};
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function migrate(input){const legacy=input?.legacy?.ui||input?.ui||input||{};return {...DEFAULT,...legacy,version:'1.1.3',presentationMode:legacy.presentationMode||legacy.viewMode||DEFAULT.presentationMode,roleMode:legacy.roleMode||DEFAULT.roleMode,filters:{...DEFAULT.filters,...(legacy.filters||{})},brainZoom:Math.max(1,Math.min(2,Number(legacy.brainZoom)||1))};}
  function load(){if(typeof localStorage==='undefined')return state;try{const own=localStorage.getItem(KEY);if(own){state=migrate(JSON.parse(own));return state;}for(const k of ['ABRAXAS_A_v1.1.2_STATE','ABRAXAS_A_v1.0_STATE','ABRAXAS_A_v0.9.6.1_STATE']){const raw=localStorage.getItem(k);if(raw){state=migrate(JSON.parse(raw));save();return state;}}}catch(e){console.warn('v1.1.3 UI state load failed',e);}return state;}
  function save(){if(typeof localStorage!=='undefined')try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}return state;}
  function set(patch){state={...state,...patch,filters:patch?.filters?{...state.filters,...patch.filters}:state.filters};save();return state;}
  function getState(){return state;}
  function reset(){state=clone(DEFAULT);save();return state;}
  function createStore(opts={}){state=migrate(opts.legacy||opts);return api;}
  const api={KEY,DEFAULT,load,save,set,getState,reset,createStore};return api;
});
