(function(root,factory){const api=factory(root.ABRAXAS_DATA||(typeof require!=='undefined'?require('../data.js'):null),root.ABRAXAS_CORE||(typeof require!=='undefined'?require('../core.js'):null));root.V113_DOMAIN=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this,function(DATA,CORE){
  'use strict';
  const VERSION='1.1.3';
  const ROLE_TASKS={all:null,strategy:[],script:['video'],copy:['copy'],recording:['video'],design:['visual','cover'],editing:['video'],qa:['qa'],publishing:['publish']};
  const deepClone=v=>JSON.parse(JSON.stringify(v));
  const source=DATA||{clients:[],contents:[],savedViews:[],brandingDrivers:[],roadmap:[]};
  let runtime=deepClone(source);
  function reset(){runtime=deepClone(source);return runtime;}
  function allContents(){return runtime.contents||[];}
  function allClients(){return runtime.clients||[];}
  function contentById(id){return allContents().find(c=>c.id===id)||null;}
  function clientById(id){return allClients().find(c=>c.id===id)||null;}
  function openTasks(content){return (content?.productionTasks||[]).filter(t=>!['done','approved'].includes(t.status));}
  function contentMatchesRole(content,role){
    if(role==='all'||!role)return true;
    if(role==='strategy')return ['BUILD','AI_READY','AI_RESULT','REVIEW','NEEDS_FIX'].includes(content.lifecycle)||!content.scheduledAt;
    if(role==='script')return ['reel','horizontal'].includes(content.physicalType)&&!['PUBLISHED','ARCHIVED'].includes(content.lifecycle);
    if(role==='recording')return ['reel','horizontal'].includes(content.physicalType)&&openTasks(content).some(t=>t.type==='video');
    if(role==='editing')return ['reel','horizontal'].includes(content.physicalType)&&openTasks(content).some(t=>t.type==='video');
    const types=ROLE_TASKS[role]||[];return openTasks(content).some(t=>types.includes(t.type));
  }
  function contentsForRole(role='all'){return allContents().filter(c=>contentMatchesRole(c,role));}
  function tasksForRole(role='all'){
    const rows=[];
    contentsForRole(role).forEach(c=>openTasks(c).forEach(t=>{
      if(role==='all'||role==='strategy'||role==='script'||role==='recording'||role==='editing'||(ROLE_TASKS[role]||[]).includes(t.type))rows.push({contentId:c.id,content:c,task:t});
    }));return rows;
  }
  function productionProgress(c){const tasks=c?.productionTasks||[];if(!tasks.length)return c?.lifecycle==='PUBLISHED'?100:0;const done=tasks.filter(t=>['done','approved'].includes(t.status)).length;return Math.round(done/tasks.length*100);}
  function nextAction(c){
    const pending=openTasks(c);const first=pending[0];
    if(first)return {type:first.type,label:first.label,description:first.description,target:'production',contentId:c.id,taskId:first.id,successCondition:`${first.label} resuelta o aprobada`};
    if(!c.scheduledAt)return {type:'schedule',label:'Calendarizar',description:'La pieza no tiene fecha.',target:'calendar',contentId:c.id,successCondition:'La pieza tiene scheduledAt'};
    if(c.lifecycle!=='PUBLISHED')return {type:'publish',label:'Revisar publicación',description:`Programada para ${c.scheduledAt}.`,target:'publishing',contentId:c.id,successCondition:'Lifecycle PUBLISHED'};
    return {type:'done',label:'Publicado',description:'Ciclo cerrado.',target:'library',contentId:c.id,successCondition:'Ya completado'};
  }
  function updateContent(id,patch){const c=contentById(id);if(!c)return null;Object.assign(c,patch);return c;}
  function updateTask(contentId,taskId,patch){const c=contentById(contentId),t=c?.productionTasks?.find(x=>x.id===taskId);if(!t)return null;Object.assign(t,patch);return t;}
  function replaceRuntime(data){runtime=deepClone(data||source);return runtime;}
  return {version:VERSION,core:CORE,source,reset,allContents,allClients,contentById,clientById,openTasks,contentsForRole,tasksForRole,productionProgress,nextAction,updateContent,updateTask,replaceRuntime,get data(){return runtime;},roleTaskMap:ROLE_TASKS};
});
