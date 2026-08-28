(function(root,factory){const api=factory(root.V113_STORE||(typeof require!=='undefined'?require('./store.js'):null));root.V113_ROUTER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this,function(STORE){
  'use strict';
  const VALID=new Set(['dashboard','clients','library','calendar','factory','production','shim','airesults','assets','branding','guide','roadmap','studio']);
  function go(section,extra={}){if(!VALID.has(section))section='dashboard';STORE.set({section,commandOpen:false,modal:null,...extra});if(typeof rootRender==='function')rootRender();return section;}
  function openContent(contentId,view='overview',origin){STORE.set({section:'studio',selectedContentId:contentId,studioView:view,origin:origin||STORE.getState().section});if(typeof rootRender==='function')rootRender();return contentId;}
  function openTask(contentId,taskId,view='overview'){STORE.set({section:'studio',selectedContentId:contentId,selectedTaskId:taskId,studioView:view});if(typeof rootRender==='function')rootRender();}
  function back(){const s=STORE.getState();return go(s.origin||'library');}
  return {go,openContent,openTask,back,validSections:[...VALID]};
});
