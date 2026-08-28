'use strict';
const ABRAXAS_CORE=(()=>{
const PHYSICAL={
 reel:{label:'Reel / vertical',kind:'video'},
 carousel:{label:'Carrusel',kind:'carousel'},
 horizontal:{label:'Video horizontal',kind:'video'},
 linkedin:{label:'Post LinkedIn',kind:'article'},
 newsletter:{label:'Newsletter',kind:'article'},
 article:{label:'Nota / artículo',kind:'article'},
 stories:{label:'Stories',kind:'story'},
 image:{label:'Imagen / post',kind:'image'}
};
const STRUCTURE_TEMPLATES={
 reel:['Hook','Contexto','Desarrollo','Aplicación','Cierre'],
 carousel:['Slide 1 · Hook','Slide 2 · Contexto','Slide 3 · Desarrollo','Slide 4 · Aplicación','Slide 5 · Cierre'],
 horizontal:['Cold open','Contexto','Capítulo 1','Capítulo 2','Capítulo 3','Síntesis','Cierre'],
 linkedin:['Hook','Tesis','Razón / evidencia','Implicación','Cierre'],
 newsletter:['Subject','Apertura','Bloque 1','Bloque 2','Bloque 3','Recap','CTA'],
 article:['Tesis','Contexto','Sección 1','Sección 2','Sección 3','Límites','Conclusión'],
 stories:['Story 1 · Hook','Story 2 · Contexto','Story 3 · Interacción','Story 4 · Cierre'],
 image:['Titular','Apoyo','CTA / firma']
};
function deepClone(v){return JSON.parse(JSON.stringify(v));}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function uid(prefix='id'){return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`;}
function physicalTypeLabel(type){return PHYSICAL[type]?.label||type||'Sin tipo';}
function physicalKind(type){return PHYSICAL[type]?.kind||'article';}
function clientThemeTokens(client){
 const accent=client?.accent||'#D8B46C', strong=client?.accentStrong||accent;
 return {
  '--client-accent':accent,
  '--client-accent-strong':strong,
  '--client-accent-soft':hexToRgba(accent,.12),
  '--client-accent-glow':hexToRgba(accent,.18),
  '--client-accent-surface':hexToRgba(accent,.075),
  '--client-accent-border':hexToRgba(accent,.32),
  '--client-accent-text':client?.accentText||'#F8F4EA'
 };
}
function hexToRgba(hex,a){let h=String(hex||'').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');if(!/^[0-9a-f]{6}$/i.test(h))return `rgba(216,180,108,${a})`;const n=parseInt(h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
function normalizePattern(pattern){return {id:pattern?.id||uid('pattern'),name:pattern?.name||'Patrón',nativeTypes:pattern?.nativeTypes||[],structure:pattern?.structure||[],toneRules:pattern?.toneRules||'',visualRules:pattern?.visualRules||'',copyRules:pattern?.copyRules||'',adaptationRules:pattern?.adaptationRules||''};}
function translatePatternToPhysical(pattern,physicalType){
 const p=normalizePattern(pattern), native=p.nativeTypes.includes(physicalType), target=STRUCTURE_TEMPLATES[physicalType]||STRUCTURE_TEMPLATES.article;
 if(native){return {mode:'NATIVO',physicalType,sourcePattern:p.name,beats:p.structure.length?p.structure.map((x,i)=>typeof x==='string'?{name:x,function:`Función ${i+1} del patrón ${p.name}.`}:deepClone(x)):target.map((x,i)=>({name:x,function:`Función ${i+1}.`})),adaptationNote:'El patrón ya fue diseñado para este formato físico.'};}
 const sourceNames=(p.structure||[]).map(x=>typeof x==='string'?x:x.name).filter(Boolean);
 const beats=target.map((name,i)=>({name,function:adaptedFunction(name,sourceNames,i,p.name)}));
 return {mode:'ADAPTADO',physicalType,sourcePattern:p.name,beats,adaptationNote:`Se conserva el ADN de “${p.name}”, pero la salida final es ${physicalTypeLabel(physicalType)}. El patrón orienta la lógica; no cambia el formato físico.`};
}
function adaptedFunction(target,source,i,patternName){const src=source.length?source[Math.min(i,source.length-1)]:'criterio central';return `${target}: traducir la función “${src}” de ${patternName} al lenguaje nativo del formato sin fingir que conserva su forma original.`;}
function mergeStructures(physicalType,clientPattern,universalPattern){
 const c=clientPattern?translatePatternToPhysical(clientPattern,physicalType):null,u=universalPattern?translatePatternToPhysical(universalPattern,physicalType):null;
 const base=STRUCTURE_TEMPLATES[physicalType]||STRUCTURE_TEMPLATES.article;
 return base.map((name,i)=>{
  const parts=[];
  if(c?.beats[i])parts.push(`Cliente: ${c.beats[i].function}`);
  if(u?.beats[i])parts.push(`Universal: ${u.beats[i].function}`);
  return {name,function:parts.join(' | ')||`Cumplir la función ${name}.`,sourceModes:[c?.mode,u?.mode].filter(Boolean)};
 });
}
function weeksForWindow(window){return window==='1_week'?1:window==='2_weeks'?2:4;}
function lotCadenceCounts(cadence={}){const cad={lot1:cadence.lot1||'medium',lot2:cadence.lot2||'medium',lot3:cadence.lot3||'medium'};return{lot1:cad.lot1==='high'?4:2,lot2:cad.lot2==='high'?3:cad.lot2==='medium'?2:1,lot3:cad.lot3==='high'?4:cad.lot3==='medium'?2:1};}
function buildBatchPlan(cfg){
 const weeks=weeksForWindow(cfg.window),cad=cfg.cadence||{lot1:'medium',lot2:'medium',lot3:'medium'},existing=cfg.existing||[],useExisting=!!cfg.useExisting,out=[],counts=lotCadenceCounts(cad);
 const l1Mult=counts.lot1/2;
 const l2Count=counts.lot2;
 const l3Count=counts.lot3;
 let ex=[...existing];
 function slot(week,lot,role,physicalType){
   let reuse=null;
   if(useExisting){const ix=ex.findIndex(x=>(x.physicalType||x.type)===physicalType&&!x.scheduledAt);if(ix>=0)reuse=ex.splice(ix,1)[0];}
   out.push({id:uid('slot'),week,lot,role,physicalType,reuseId:reuse?.id||null,status:reuse?'existing':'to_create'});
 }
 for(let w=1;w<=weeks;w++){
  for(let i=0;i<l1Mult;i++){slot(w,'L1','reelPrincipal','reel');slot(w,'L1','carouselPrincipal','carousel');}
  const l2Types=['reel','carousel','linkedin','stories'];
  for(let i=0;i<l2Count;i++)slot(w,'L2',`derivative${i+1}`,l2Types[i%l2Types.length]);
  const l3Types=['stories','image','linkedin','carousel'];
  for(let i=0;i<l3Count;i++)slot(w,'L3',`support${i+1}`,l3Types[i%l3Types.length]);
 }
 return out;
}
function brandSnapshot(client){const b=client?.brandCore||{};return [`Core: ${b.core||'No definido'}`,`Identidad: ${b.identity||'No definida'}`,`Cómo explicarla: ${b.clientExplanation||'No definido'}`,`Cómo venderla: ${b.salesNarrative||'No definido'}`,`Pruebas: ${(b.proofPoints||[]).join('; ')||'Sin pruebas registradas'}`,`Límites: ${(b.boundaries||[]).join('; ')||'Sin límites registrados'}`].join('\n');}
function unitsSnapshot(content){return (content.units||[]).map((u,i)=>`${i+1}. ${u.label||u.name||`Unidad ${i+1}`}\nFunción: ${u.function||''}\nTexto: ${u.text||''}\nGrabación: ${u.recording||''}\nVisual: ${u.visualDirection||''}`).join('\n\n');}
function compileEditorialPrompt(content,client,inputs={}){
 const structure=(inputs.structure||content.structure||content.units||[]).map?.((x,i)=>typeof x==='string'?`${i+1}. ${x}`:`${i+1}. ${x.name||x.label}: ${x.function||''}`).join('\n')||'';
 return `ABRAXAS · PROMPT MAESTRO EDITORIAL · v0.9.6\nCONTENT_ID: ${content.id}\n\nROL\nActúa como director editorial senior, guionista y copywriter nativo de plataforma para ${client.name}. Tu trabajo no es proponer una idea: debes producir o regenerar una pieza final, operable y versionable dentro de ABRAXAS. Debes pensar con criterio de marca, audiencia, formato, evidencia, estructura, ritmo y distribución, y devolver un resultado que otra IA o editor pueda ejecutar sin conocer este chat.\n\nOBJETIVO\nCrear/actualizar “${content.title}” como ${physicalTypeLabel(inputs.physicalType||content.physicalType)}. Intención: ${inputs.intention||content.intention||'educar con criterio'}. Audiencia: ${inputs.audience||content.audience||'audiencia profesional relevante'}. Problema o tensión: ${inputs.problem||content.problem||content.summary||''}. Cambio buscado: ${inputs.desiredChange||content.desiredChange||'que la audiencia entienda una decisión y pueda actuar mejor'}. Plataforma principal: ${inputs.primaryPlatform||content.primaryPlatform||content.platforms?.[0]||'LinkedIn'}.\n\nJERARQUÍA DE CONTEXTO\n1) Hechos, fuentes y restricciones explícitas. 2) Brand Core/Branding Method aprobado. 3) Formato físico elegido. 4) Patrón del cliente y patrón universal seleccionados. 5) Audiencia, intención y problema. 6) Historial para evitar repetición. 7) Criterio creativo. Nunca uses creatividad para contradecir evidencia.\n\nBRAND CORE\n${brandSnapshot(client)}\n\nPATRONES\nPatrón cliente: ${inputs.recipeClient||content.recipeClient||content.formatName||'No seleccionado'}.\nPatrón universal: ${inputs.recipeUniversal||content.recipeUniversal||'No seleccionado'}.\nEl formato físico manda. Si un patrón fue adaptado desde otro formato, conserva su lógica pero escribe en lenguaje nativo de ${physicalTypeLabel(inputs.physicalType||content.physicalType)}. No imites una forma que no corresponde al output.\n\nESTRUCTURA EDITABLE\n${structure||unitsSnapshot(content)}\n\nEVIDENCIA Y CLAIMS\nFuentes/evidencia: ${inputs.evidence||content.evidence||'No se aportó evidencia adicional.'}\nClaims/restricciones: ${inputs.claims||content.claims||'No inventar cifras, resultados, citas, funcionalidades ni evidencia.'}\nCTA/cierre: ${inputs.cta||content.cta||'Cierre de criterio; CTA suave solo si la intención lo justifica.'}\n\nQUÉ ES\nUna pieza específica de ${client.name}, con hook, desarrollo y cierre causalmente conectados; cada unidad aporta información nueva; el copy amplía el contenido; la salida conserva content_id y puede volver al Production Graph.\n\nQUÉ NO ES\nNo es una plantilla universal renombrada. No es un brief. No es una lista de frases bonitas. No es una transcripción pegada. No es un carrusel que repite un reel. No es un texto inflado con sinónimos. No inventes datos, citas, fuentes, resultados, features o claims.\n\nCRITERIOS EDITORIALES\n- El hook debe abrir una tensión real que la pieza resuelva.\n- Cada unidad debe cumplir una función distinguible: contexto, mecanismo, contraste, evidencia, ejemplo, decisión o implicación.\n- El cierre debe pagar la promesa del hook y dejar una regla, decisión o siguiente acción.\n- Adapta longitud y sintaxis a la plataforma; no dupliques el mismo copy entre Instagram, LinkedIn, TikTok/Shorts, YouTube o Email.\n- Separa hecho, hipótesis, opinión y ejemplo. Marca REVIEW cuando la fuente no alcance.\n- Si una parte puede eliminarse sin perder sentido, reescríbela o elimínala.\n\nSALIDA EXACTA\nDevuelve JSON con contentId="${content.id}", title, summary, thesis, physicalType, clientPattern, universalPattern, structure[], units[] completos, copies por plataforma aplicable, promptInputs normalizados, prompts.editorial, prompts.visual, expectedAssets[], productionTaskResults[] y qa. Cada unidad debe incluir label/name, function, text, recording, visualDirection y relación con la unidad anterior/siguiente.\n\nQA\nAntes de responder verifica: especificidad de marca; formato físico correcto; progresión hook→desarrollo→cierre; ausencia de redundancia; copies nativos; claims sustentados o marcados; content_id intacto; importabilidad sin contexto oculto. Si algo falla, corrígelo antes de entregar.`;
}
function compileVisualPrompt(content,client,inputs={}){
 return `ABRAXAS · PROMPT MAESTRO VISUAL / PRODUCCIÓN · v0.9.6\nCONTENT_ID: ${content.id}\n\nROL\nActúa como director de arte, director audiovisual, editor senior y prompt designer para ${client.name}. Convierte la pieza “${content.title}” en un sistema visual producible, coherente y trazable. No estás decorando: cada visual debe mejorar comprensión, evidencia, ritmo, emoción o continuidad.\n\nOBJETIVO\nTraducir el contenido aprobado a decisiones visuales ejecutables por unidad sin cambiar tesis, claims ni función narrativa. El resultado debe especificar qué se graba, qué se genera, qué se preserva, qué asset vuelve a qué slot y cómo comprobar que la intervención mejora comprensión o retención.\n\nFORMATO Y CONTEXTO\nFormato físico: ${physicalTypeLabel(inputs.physicalType||content.physicalType)}. Tema: ${content.title}. Intención: ${inputs.intention||content.intention||''}. Audiencia: ${inputs.audience||content.audience||''}. Referencia visual opcional: ${inputs.visualReference||content.visualReference||'No aportada'}.\n\nIDENTIDAD DE MARCA\n${client.visualRules||client.brandCore?.identity||''}\n\nQUALITY CONTEXT DEL CLIENTE\n${client.qualityPromptContext||''}\nAccent de cliente: ${client.accent}. Usa el accent para foco/identidad, no para reemplazar colores semánticos de estados. Mantén una jerarquía visual tranquila: contenido primero, controles/ornamentos después.\n\nUNIDADES EDITORIALES\n${unitsSnapshot(content)}\n\nQUÉ ES\nUn Production Plan que un editor o IA puede ejecutar por unidad. Puede elegir presenter_only, source_video_enhancement, independent_broll, photo_broll, UI/diagram, generative_image o evidence_asset según función. Para carrusel, cada slide necesita composición, texto, prompt con texto y sin texto, continuidad y safe area. Para video, cada beat necesita grabación, B-roll/VFX opcional, SFX con sonido + momento + trigger y música con función.\n\nQUÉ NO ES\nNo es una lista de adjetivos como “cinematográfico/premium”. No obliga a poner VFX en todos los beats. No usa stock genérico intercambiable. No altera identidad, anatomía, lipsync, vestuario o perspectiva de una persona real al usar video fuente. No presenta ilustración generativa como evidencia real.\n\nREGLAS POR UNIDAD\n1. Define narrativeFunction y mode antes de diseñar.\n2. Describe escena/sujeto/objeto, composición, plano/lente si aporta, movimiento, luz, color/materiales, texto en pantalla, timing y transición.\n3. Source video: preservar identidad, lipsync, anatomía, cámara y temporalidad; especificar qué sí puede cambiar.\n4. Independent B-roll: duración, cámara, movimiento, start/middle/end y cómo conecta con el beat.\n5. Carrusel: promptWithText + promptWithoutText; layout, safe areas, jerarquía, negativos y continuidad.\n6. SFX: sound, when, trigger, level; si no hay evento justificable usar no_sfx_needed.\n7. Música: estilo, BPM aproximado, energía, entrada, ducking y resolución.\n8. Portada: dos opciones cuando aplique, una conceptual y otra con persona, ambas legibles en móvil.\n\nASSETS Y RUTAS\nUsa siempre assets/{client_id}/${content.id}/{asset_group}/{filename}. Vincula cada output al slot esperado. No inventes una ruta paralela.\n\nRESTRICCIONES\nNo logos inventados, manos/rostros deformes, texto extra, objetos incoherentes, glass decorativo excesivo, motion sin función ni evidencia ficticia. No romper continuidad de paleta, sujeto, iluminación o estilo entre unidades.\n\nSALIDA EXACTA\nDevuelve visualPlan[] con unitId, label, narrativeFunction, mode, scene, subjectObject, composition, camera, motion, lighting, colorMaterials, screenText, timing, transition, sfx, music, continuity, negatives, finalPrompt, referenceFrames(start,middle,end cuando aplique), assetSlotId, filename y relativePath.\n\nQA\nCada asset debe justificar su función, ser reproducible sin el chat, respetar identidad y rutas, distinguir evidencia de ilustración, y mantener continuidad. Si una intervención no mejora comprensión/retención, elige presenter_only.`;
}

function unitAssetSlot(content,index){const slots=content.expectedAssets||[];return slots[Math.min(index,Math.max(0,slots.length-1))]||{slotId:`unit-${index+1}`,relativePath:`assets/${content.clientId}/${content.id}/units/unit-${index+1}.png`,kind:'image'};}
function unitBaseContext(content,unit,index,client){const slot=unitAssetSlot(content,index);return `CONTENT_ID: ${content.id}\nUNIT_ID: ${unit.id||`u${index+1}`}\nUNIDAD: ${unit.label||unit.name||`Unidad ${index+1}`}\nFUNCIÓN: ${unit.function||''}\nTEXTO/IDEA: ${unit.text||''}\nFORMATO: ${physicalTypeLabel(content.physicalType)}\nCLIENTE: ${client.name}\nPILAR: ${content.pillar||''}\nPATRÓN: ${content.recipeClient||''}\nVISUAL PROFILE: ${client.visualRules||client.brandCore?.identity||''}\nDIRECCIÓN ACTUAL: ${unit.visualDirection||''}\nGRABACIÓN ACTUAL: ${unit.recording||''}\nB-ROLL ACTUAL: ${unit.broll||''}\nSLOT: ${slot.slotId}\nRUTA ESPERADA: ${slot.relativePath}`;}
function compileUnitOmniPrompt(content,unit,index,client){return `ABRAXAS · OMNI / SOURCE VIDEO ENHANCEMENT · v0.9.6\n\nROL\nActúa como supervisor de VFX, director de composición y prompt designer senior. Debes usar el fragmento de video original de esta unidad como SOURCE VIDEO obligatorio cuando exista. Tu intervención tiene que ampliar comprensión o retención sin cambiar la interpretación del speaker ni convertir el plano en una demo de efectos.\n\nOBJETIVO\nDiseñar una intervención Omni/VFX específica para la unidad ${index+1} de “${content.title}”. La intervención debe aparecer únicamente cuando una relación, mecanismo, interfaz, dato o contraste necesite apoyo visual. Si el speaker sostiene mejor la idea sin intervención, devuelve mode=presenter_only y explica por qué.\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\n\nQUÉ ES\nUna instrucción de source_video_enhancement con preservación explícita, placement espacial, timing, estados visuales y negativos. Puede incorporar overlays, UI, diagramas, profundidad, tracking, máscaras, parallax o elementos 3D ligeros solo cuando tengan función narrativa.\n\nQUÉ NO ES\nNo es un re-render del speaker. No sustituye rostro, labios, cuerpo, manos, piel, vestuario o locación. No cambia lipsync, cámara, lente aparente, exposición, perspectiva o temporalidad salvo corrección técnica explícita. No añade hologramas, partículas o texto decorativo por “verse futurista”. No presenta gráficos inventados como evidencia.\n\nPRESERVACIÓN OBLIGATORIA\nConserva identidad, anatomía, expresión, sincronía labial, movimiento corporal, manos, vestuario, tono de piel, relación sujeto-fondo, perspectiva, encuadre, movimiento de cámara y duración del source. Si un elemento cruza delante del speaker, especifica oclusión, máscara y profundidad sin cubrir ojos/boca/manos relevantes.\n\nINTERVENCIÓN\nNombre actual del efecto: ${unit.vfx?.name||'Contextual Materialize'}. Nivel simple: ${unit.vfx?.simple||'fade/scale sutil'}. Nivel medio: ${unit.vfx?.medium||'build secuencial/parallax leve'}. Nivel avanzado: ${unit.vfx?.advanced||'tracking/máscaras/profundidad solo si aporta'}. Describe qué elemento aparece, por qué, posición relativa al speaker, escala, anclaje, profundidad, iluminación/reflejos, motion blur, easing y relación con palabra/gesto.\n\nTIMING\nEntrega entrada, build, momento de máxima claridad y salida. La intervención debe nacer después de que la idea verbal sea comprensible y retirarse antes del siguiente beat salvo continuidad explícita. Define START / MIDDLE / END como tres estados de referencia coherentes.\n\nSFX Y CONTINUIDAD\nSFX actual: ${unit.sfx?.sound||'no_sfx_needed'}; WHEN: ${unit.sfx?.when||'solo con evento visual'}; TRIGGER: ${unit.sfx?.trigger||'evento visual real'}; LEVEL: ${unit.sfx?.level||'bajo voz'}. Mantén el lenguaje visual de ${client.name}; no introduzcas otro sistema a mitad de la pieza.\n\nSALIDA EXACTA\nDevuelve JSON con mode, objective, preservationRules[], effectName, spatialPlacement, occlusion, depth, lightingIntegration, motion, timing{in,build,peak,out}, referenceFrames{start,middle,end}, sfx{sound,when,trigger,level}, negatives[], finalOmniPrompt, assetSlotId y relativePath.\n\nQA\nComprueba identidad intacta, lipsync intacto, perspectiva intacta, evento visual justificado, timing sincronizado, SFX subordinado a voz, ausencia de evidencia ficticia y salida ejecutable sin conocer este chat.`;}
function compileUnitReferenceImagesPrompt(content,unit,index,client){return `ABRAXAS · REFERENCE FRAMES START / MIDDLE / END · v0.9.6\n\nROL\nActúa como director de arte y diseñador de keyframes para producción audiovisual. Debes generar tres imágenes de referencia coherentes que describan el inicio, el punto medio de máxima legibilidad y el final de una misma intervención o B-roll.\n\nOBJETIVO\nProducir START, MIDDLE y END para la unidad ${index+1} de “${content.title}”, de forma que estas referencias puedan subirse junto con el fragmento fuente a una herramienta de video o usarse como guía de edición manual. Las tres imágenes deben contar una sola acción/progresión, no tres conceptos distintos.\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\n\nQUÉ ES\nUn triptych temporal: START establece composición y estado inicial; MIDDLE muestra el punto donde el concepto visual se entiende mejor; END resuelve la acción y prepara el corte/transición siguiente. Deben compartir sujeto, locación, escala, lente aparente, dirección de luz, paleta, materiales y geometría.\n\nQUÉ NO ES\nNo son tres moodboards. No cambies identidad, vestuario, props, hora del día, perspectiva, encuadre o estilo entre frames. No introduzcas texto extra, logos inventados, datos no aportados ni elementos flotantes sin función. No uses una imagen “bonita” que no explique la idea.\n\nCOMPOSICIÓN Y CONTINUIDAD\nRespeta la dirección visual: ${unit.visualDirection||''}. Si es source video, conserva el frame base y describe solo la intervención. Si es independent B-roll, define sujeto/objeto, foreground/midground/background, punto focal, profundidad, escala y recorrido de cámara. Si es UI/diagrama, conserva layout, tipografía aproximada y posición de módulos entre los tres frames.\n\nESTADOS\nSTART: estado previo o primer 10–20% de la acción, con espacio para que el elemento empiece. MIDDLE: máxima claridad del mecanismo/relación, sin saturar la composición. END: acción resuelta, elementos asentados o saliendo, compatible con el siguiente beat.\n\nSALIDA EXACTA\nEntrega tres prompts separados "startPrompt", "middlePrompt", "endPrompt", más continuityRules[], cameraMotionSuggestion, transitionSuggestion, negatives[], assetSlotId y relativePath. Cada prompt debe ser autónomo y describir exactamente la misma escena en diferente estado temporal.\n\nQA\nVerifica continuidad estricta, utilidad para video real, ausencia de cambios accidentales, legibilidad del concepto y que MIDDLE sea realmente el frame más informativo.`;}
function compileUnitBrollPrompt(content,unit,index,client){return `ABRAXAS · INDEPENDENT B-ROLL VIDEO · v0.9.6\n\nROL\nActúa como director de fotografía, realizador de B-roll y prompt designer de video. Debes crear un apoyo audiovisual independiente que pueda insertarse sobre la voz sin repetir literalmente lo que el speaker dice.\n\nOBJETIVO\nDiseñar un B-roll específico para la unidad ${index+1} de “${content.title}” que clarifique contexto, mecanismo, evidencia, interfaz o consecuencia. Si no existe una visual concreta que aporte, devuelve presenter_only en vez de inventar stock genérico.\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\n\nQUÉ ES\nUn shot o microsecuencia de 3–8 segundos con función narrativa explícita. Puede usar laboratorio, producto, interfaz, documento, objeto, entorno, gesto, macro/micro, diagrama o proceso según la marca y el argumento. Define acción, cámara, movimiento, profundidad, iluminación y transición.\n\nQUÉ NO ES\nNo es stock “persona usando laptop”, manos escribiendo sin contexto, laboratorio genérico, dron aleatorio ni una metáfora intercambiable entre marcas. No inventes instalaciones, pantallas, resultados, prototipos o evidencia. Si una interfaz real no está disponible, etiqueta la propuesta como conceptual/reference.\n\nSHOT DESIGN\nDefine sujeto/objeto principal, acción exacta, encuadre, focal/lente aparente, altura/ángulo, movimiento (locked/pan/tilt/dolly/orbit/handheld solo si aporta), duración, velocidad, foreground/midground/background, textura, color y relación con la voz. Explica en qué palabra o subidea entra y qué debe haberse entendido cuando sale.\n\nSTART / MIDDLE / END\nSTART establece situación y dirección de movimiento; MIDDLE muestra el punto de máxima comprensión; END resuelve la acción y deja un frame fácil de cortar. Mantén continuidad total.\n\nMARCA\n${client.visualRules||''} El accent ${client.accent} puede aparecer como detalle de identidad, no como baño de color ni como estado semántico.\n\nSALIDA EXACTA\nDevuelve mode, narrativeFunction, shotDescription, duration, camera, lens, movement, lighting, colorMaterials, action, timingInVoice, startFrame, middleFrame, endFrame, transitionIn, transitionOut, negatives[], finalVideoPrompt, evidenceLabel y assetSlotId/relativePath.\n\nQA\nEl B-roll debe ser específico, producirse sin este chat, no fingir evidencia, no competir con la voz y justificar cada segundo que ocupa pantalla.`;}
function compileUnitStillPrompt(content,unit,index,client){return `ABRAXAS · PHOTO / STILL SUPPORT · v0.9.6\n\nROL\nActúa como director de arte y fotógrafo/editorial prompt designer. Tu trabajo es generar una imagen fija de apoyo o un key visual para la unidad ${index+1} de “${content.title}”.\n\nOBJETIVO\nCrear una imagen que explique o sostenga la función narrativa de la unidad, con composición suficientemente específica para que un diseñador pueda reproducirla o una IA de imagen pueda generarla sin interpretar vagamente adjetivos.\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\n\nQUÉ ES\nUna fotografía/ilustración/diagrama/UI still con sujeto, composición, jerarquía, luz, materiales, perspectiva, profundidad, espacio negativo, relación con texto y safe areas definidos. Debe responder a la idea del beat/slide, no únicamente “verse de marca”.\n\nQUÉ NO ES\nNo es stock genérico. No inventa evidencia, productos, laboratorios, dashboards, documentos, rostros o datos reales. No agrega texto no solicitado. No altera la identidad de una persona de referencia. No convierte el accent de cliente en un filtro de color dominante.\n\nDIRECCIÓN VISUAL\n${client.visualRules||client.brandCore?.identity||''}\nDirección específica: ${unit.visualDirection||''}. Define punto focal principal, ocupación aproximada del frame, alignment, foreground/midground/background, escala relativa, textura, iluminación, contraste, color/materiales y espacio donde viviría un titular si corresponde.\n\nUSO\nSi el asset es una referencia conceptual, etiquétalo como "illustrative_reference". Si es evidencia/asset real, no regeneres el dato: pide usar el archivo real. Si es imagen de carrusel sin texto, deja áreas limpias para composición posterior.\n\nSALIDA EXACTA\nDevuelve mode, subject, scene, composition, cameraPerspective, lighting, colorMaterials, negativeSpace, safeArea, textPlacementGuide, evidenceLabel, negatives[], finalImagePrompt, assetSlotId, filename y relativePath.\n\nQA\nDebe leerse bien a tamaño móvil, ser específica del cliente y contenido, distinguir ilustración de evidencia, no crear información nueva y mantener continuidad con las unidades vecinas.`;}
function compileUnitSfxPrompt(content,unit,index,client){return `ABRAXAS · SFX DESIGN / SEARCH BRIEF · v0.9.6\n\nROL\nActúa como sound designer y editor de audio senior. Diseña o describe con precisión un efecto de sonido breve que acompañe una acción visual concreta sin competir con la voz ni convertir la pieza en un trailer.\n\nOBJETIVO\nResolver el SFX de la unidad ${index+1} de “${content.title}”. Si no existe una animación, transición u objeto cuya acción justifique feedback sonoro, devuelve "no_sfx_needed" y explica la decisión.\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\nSFX actual: SOUND=${unit.sfx?.sound||'no_sfx_needed'}; WHEN=${unit.sfx?.when||'sin definir'}; TRIGGER=${unit.sfx?.trigger||'sin definir'}; LEVEL=${unit.sfx?.level||'bajo voz'}. VFX relacionado: ${unit.vfx?.name||'ninguno'}.\n\nQUÉ ES\nUn microevento sonoro sincronizado a un evento visual: click, tick, tactile pop, short whoosh, soft impact, mechanical snap, paper cue, UI confirm u otro timbre específico. Debe tener un comienzo claro, duración corta y dinámica compatible con diálogo.\n\nQUÉ NO ES\nNo es música, riser cinematográfico largo, bass drop, glitch gratuito ni sonido genérico colocado “porque hay movimiento”. No debe entrar antes del evento visual que representa. No debe tapar consonantes, finales de frase o respiraciones importantes.\n\nDISEÑO SONORO\nDefine familia/timbre, ataque, cuerpo, cola, rango frecuencial dominante, sensación material, duración aproximada, estéreo/mono, cantidad de grave permitida y tratamiento (reverb/delay/saturación) si aporta. Describe cuándo entra en frames o relación verbal, qué animación lo dispara y a qué nivel relativo debe mezclarse bajo la voz.\n\nSALIDA EXACTA\nDevuelve sound, when, trigger, level, duration, tonalCharacter, frequencyProfile, envelope, processing, placement, searchKeywords[], generationPrompt, negatives[] y qa. Si no aplica, devuelve sound="no_sfx_needed", triggerReason y no inventes un sonido alternativo.\n\nQA\nComprueba sincronía real, función narrativa, compatibilidad con voz, cola suficientemente corta y coherencia con el lenguaje editorial de ${client.name}.`;}
function compileCarouselSlidePrompt(content,unit,index,client,withText=true){return `ABRAXAS · CAROUSEL SLIDE ${withText?'WITH TEXT':'WITHOUT TEXT'} · v0.9.6\n\nROL\nActúa como director de arte editorial y diseñador de carruseles premium para ${client.name}. Debes producir el slide ${index+1}/${content.units.length} de “${content.title}” con continuidad estricta respecto del carrusel completo.\n\nOBJETIVO\nTraducir la función “${unit.function||''}” a una composición vertical 4:5 clara y legible. El slide debe avanzar la historia, no repetir el anterior. ${withText?('Incluye EXACTAMENTE este texto aprobado, sin añadir ni corregir palabras: “'+(unit.text||'')+'”.'):'No incluyas texto final renderizado; reserva la composición y safe areas para que el texto se añada después.'}\n\nCONTEXTO\n${unitBaseContext(content,unit,index,client)}\n\nQUÉ ES\nUna pieza editorial coherente con el sistema visual del cliente, con una idea visual dominante, jerarquía, grid, safe areas, relación texto-imagen, composición y continuidad definidos. Puede usar fotografía, objeto, macro/micro, diagrama, UI o abstracción siempre que la elección ayude a entender el contenido.\n\nQUÉ NO ES\nNo es un poster aislado ni un cambio de estilo entre slides. No inventes logos, datos, citas, productos, pantallas, estudios o resultados. No añadas texto adicional, badges o íconos decorativos no solicitados. No uses un collage saturado que compita con la idea central.\n\nSISTEMA VISUAL\n${client.visualRules||''}\nDirección de esta unidad: ${unit.visualDirection||''}. Mantén margen seguro aproximado de 9–12%, jerarquía móvil, contraste suficiente y continuidad de color/material/lente con slides vecinos. El accent ${client.accent} es un detalle de marca, no un fondo obligatorio.\n\nCOMPOSICIÓN\nDescribe fondo, sujeto/objeto, posición, escala, recorte, profundidad, zona de titular/cuerpo, dirección de lectura, iluminación, textura, elementos gráficos, balance de espacio negativo y cómo prepara el siguiente slide.\n\nSALIDA EXACTA\nDevuelve slideIndex, narrativeFunction, layout, headlineArea, bodyArea, imageArea, safeArea, subject, composition, lighting, colorMaterials, graphicElements, continuityRules[], negatives[], evidenceLabel, finalPrompt, assetSlotId, filename y relativePath.\n\nQA\nVerifica legibilidad móvil, texto ${withText?'exacto':'ausente'}, una sola idea dominante, continuidad, ausencia de invenciones y que el slide cumpla su función aunque se vea aislado.`;}
function buildBrandToolPrompt(client,driver,tool){return `ABRAXAS · BRANDING METHOD · ${String(tool.name).toUpperCase()} · v0.9.6\n\nROL\nActúa como estratega senior de branding, investigador cualitativo y analista de evidencia. Aplica ${tool.name} del ${driver.name} a ${client.name}. No redactes frases decorativas: produce una respuesta versionable que cambie decisiones reales de negocio, contenido, visual, ventas y experiencia.\n\nOBJETIVO\nResolver: ${tool.question}. La respuesta debe integrar información disponible del cliente, separar hechos de hipótesis y derivar implicaciones observables.\n\nQUÉ ES\n${tool.whatIs}\n\nQUÉ NO ES\n${tool.whatIsNot} No inventes competidores, audiencia, propósito, valores, resultados, claims ni evidencia. No confundas gusto visual con estrategia.\n\nCONTEXTO DEL CLIENTE\n${brandSnapshot(client)}\n\nPROCEDIMIENTO\n1. Separa hechos confirmados, señales, hipótesis y vacíos. 2. Explica la decisión concreta que resuelve la herramienta. 3. Formula respuesta específica usando evidencia. 4. Contrasta especificidad, diferenciación, utilidad decisional, coherencia y límites. 5. Deriva implicaciones comerciales, editoriales, visuales, experiencia y operaciones. 6. Declara exclusiones. 7. Asigna confidence y validationRequired. 8. Lista fuentes faltantes y preguntas de validación.\n\nSALIDA EXACTA\nJSON con toolId="${tool.toolId}", toolName, driverId="${driver.id}", decisionQuestion, answer, reasoningSummary, evidence[], confidence, validationRequired, implications{commercial,content,visual,experience,operations,risks}, is[], isNot[], examples[], exclusions[], sourceGaps[], validationQuestions[] y dependencies[].\n\nQA\nLa respuesta debe ser específica de ${client.name}, utilizable, no contradictoria, trazable, con límites explícitos y sin hechos inventados.`;}
function buildShimPrompt(cfg){return `ABRAXAS SHIM · EXTERNAL AI EDITORIAL REQUEST · v0.9.6

ROL
Actúa como editor audiovisual senior, estratega de contenido, curador de discurso, copywriter multiplataforma y arquitecto de un HTML editorial autocontenido. Lee la grabación completa antes de seleccionar. No eres un resumidor: conviertes material hablado en candidatos editables y trazables sin inventar palabras.

OBJETIVO
Transformar una transcripción larga con timestamps en un sistema editorial de candidatos de alta calidad: videos verticales/horizontales, carruseles complementarios, copies, planes de producción, prompts visuales y un Automation Handoff reproducible. El resultado debe permitir revisar pieza por pieza antes de producir o cortar el video original.

QUÉ ES
Shim es un compilador de solicitud: organiza la transcripción, configuración y criterios ABRAXAS dentro de un prompt para una IA externa. La fuente literal de cualquier frase hablada sigue siendo la transcripción y sus timestamps. Shim no corta el video por sí mismo en esta fase.

QUÉ NO ES
No es un resumidor, no reescribe el discurso para “mejorarlo”, no inventa hooks hablados, no corrige silenciosamente palabras, no reutiliza fragmentos prohibidos y no convierte una idea de la transcripción en una cita literal que nunca se dijo. Tampoco debe confundir un carrusel complementario con una transcripción del video.

FUENTE Y CONTEXTO
Video/archivo: ${cfg.sourceLabel||'Sin nombre'}. Contexto opcional: ${cfg.context||'No aportado; infiere temas solo desde la transcripción.'}

CONFIGURACIÓN
Verticales: ${cfg.verticalEnabled?'sí':'no'} · ${cfg.verticalCount||'auto'}. Horizontales: ${cfg.horizontalEnabled?'sí':'no'} · ${cfg.horizontalCount||'auto'}. Plataformas: ${(cfg.platforms||[]).join(', ')||'multiplataforma'}. Estructuras: ${(cfg.structures||[]).join(', ')||'distribución inteligente'}. Estructura personalizada: ${cfg.customStructure||'ninguna'}. Carruseles complementarios: ${cfg.carouselEnabled?'sí':'no'} · ${cfg.carouselCount||'auto'}.

REGLAS DE INTEGRIDAD
La transcripción y timestamps son la fuente literal para cualquier frase hablada. No arregles palabras dentro de una cita sin marcarlo. Cada clip debe indicar todos los segmentos/timestamps que lo componen; un mismo clip puede unir varios segmentos no contiguos si conserva coherencia y no altera sentido. Evita reutilizar el mismo fragmento cuando el usuario pide máximo de piezas sin repetición. Declara cualquier intervalo ambiguo o palabra dudosa en transcriptWarnings[].

CRITERIO DE SELECCIÓN
Hook claro, desarrollo con progresión, cierre/pago, idea autónoma, coherencia con segmentos vecinos, calidad verbal, novedad, valor para el pilar y retención. Vertical objetivo 50–80 s salvo material excepcional; horizontal 8–12 min cuando corresponda. Puntúa hook, coherence, retention, specificity, platformFit, transcriptIntegrity, timestampIntegrity y editability. transcriptIntegrity/timestampIntegrity <10 bloquean candidato.

PRODUCCIÓN
Por cada video: título interno, tema, pilar sugerido, criterio de selección, hook/development/closure, timestamps exactos, transcript literal, copies por plataforma, propuesta de portada conceptual + persona, guía de grabación/edición, B-roll/VFX por sub-bloque del desarrollo, SFX con sound+when+trigger+level, música, prompts Omni y prompts de tres imágenes START/MIDDLE/END para cada VFX/B-roll que lo necesite. El desarrollo se subdivide tantas veces como sea necesario para que un video largo no tenga un único apoyo genérico.

AUTOMATION HANDOFF
Devuelve un manifest que pueda convertirse en FFmpeg/Terminal/DaVinci: source, segments[{in,out,order}], assemblyMode, outputFormat, subtitles, filenames. Debe permitir exportar uno, varios o todos los candidatos; segmentos separados y master unido. No inventes in/out points que no estén respaldados por la transcripción.

CARRUSELES COMPLEMENTARIOS
Genera 4–14 según temas, sin repetir literalmente el video. Cada uno de 4 o 6 slides: hook en slide 1, desarrollo progresivo, cierre final; texto editable, visualDirection por slide, copy Instagram/TikTok/LinkedIn/YouTube, promptWithText y promptWithoutText. Cada carrusel debe ampliar, contrastar, sistematizar o aplicar el tema, no repetirlo con otras palabras.

HTML REQUERIDO
HTML autocontenido con dashboard, lista y Content Studio 1×1 para clips/carruseles; revisión, historial, editables, exportación por sección/lote; manifest de automatización; master JSON; assets/prompt slots; calendario sugerido. Debe ser comprensible sin conocer esta conversación.

TRANSCRIPCIÓN
${cfg.transcript||'[PENDIENTE: transcripción con timestamps]'}

SALIDA EXACTA
Devuelve: 1) editable_html completo; 2) master_json con candidates[], carousels[], discardedCandidates[], qualityGate, calendarSuggestion y automationHandoff; 3) manifests por video con timestamps; 4) copies por plataforma; 5) prompts visuales/start-middle-end; 6) SRT/TXT cuando pueda derivarse literalmente de los segmentos; 7) blockers/warnings. Conserva identificadores estables para que otra etapa pueda hidratar ABRAXAS.

QA
No ocultes limitaciones. Devuelve blockers, warnings, discardedCandidates con razón y qualityExhausted. Comprueba transcriptIntegrity=10 y timestampIntegrity=10 en candidatos aprobados, ausencia de frases inventadas, no repetición indebida, claridad del hook/desarrollo/cierre, carruseles complementarios reales, copies nativos y Automation Handoff ejecutable. El resultado debe poder volver a ABRAXAS sin crear IDs paralelos.`;}
function taskInstructions(type){return({
 copy:`COPY / DISTRIBUCIÓN\n- Entrega copies realmente nativos por plataforma, no una misma pieza recortada.\n- Instagram/TikTok pueden abrir con tensión y contexto; LinkedIn debe desarrollar argumento/implicación; YouTube necesita título/description útiles; newsletter/email solo si aplica.\n- No copiar literalmente el guion/slides. No hashtags de relleno. CTA coherente con intención.`,
 visual:`VISUAL / ASSETS\n- Resuelve dirección visual por unidad, no un moodboard genérico.\n- Define composición, jerarquía, modo (presenter_only/evidence/UI/B-roll/imagen), continuidad, safe areas, prompt con/sin texto y ruta exacta.\n- Distingue evidencia real de ilustración. El accent identifica cliente; no sustituye estados semánticos.`,
 video:`VIDEO / B-ROLL / VFX\n- Divide la pieza por beats y decide dónde speaker basta y dónde necesita apoyo.\n- Para B-roll: shot, duración, cámara, movimiento, START/MIDDLE/END. Para source video: preserva identidad, lipsync, cuerpo, vestuario, perspectiva y cámara.\n- VFX debe tener nombre y nivel simple/medio/avanzado. SFX siempre sound+when+trigger+level o no_sfx_needed. Música: estilo, BPM, energía, entrada/ducking/resolución.`,
 cover:`PORTADA\n- Propón al menos una portada conceptual y una con persona cuando el formato lo justifique.\n- Una promesa visual dominante, legible en móvil, consistente con el contenido y sin clickbait que el contenido no pague.\n- Incluye prompt, layout, safe area, texto exacto y ruta/filename.`,
 qa:`QA\n- Revisa claims, evidencia, coherencia del hook con el cierre, redundancia, brand fit, copy fit, visual continuity, rutas/slots y estado de producción.\n- Devuelve blockers y warnings separados. Un claim dudoso nunca se “corrige” inventando una fuente.`,
 publish:`PUBLICACIÓN\n- Verifica fecha, plataformas, formato final, copy aprobado, assets/cover, QA y estado READY_TO_PUBLISH.\n- Devuelve checklist, riesgo residual, estado sugerido y cualquier dependencia que impida marcar PUBLISHED.`
})[type]||`Resuelve la tarea con criterios específicos del formato, cliente y estado.`;}
function makeTaskPrompt(content,task,client){return `ABRAXAS · PRODUCTION TASK · v0.9.6
CONTENT_ID: ${content.id}
TASK_ID: ${task.id}
TASK: ${task.label}

ROL
Actúa como especialista senior de producción para ${client.name}, con responsabilidad exclusiva sobre la tarea “${task.label}” dentro del mismo Content/Production Graph. Trabaja como si el resto de la pieza ya estuviera versionado y aprobado: toca solo lo necesario y conserva las decisiones que están fuera del alcance de esta tarea.

OBJETIVO
Resolver ${task.description} de forma ejecutable, trazable y suficientemente específica para que el resultado pueda volver a ABRAXAS sin contexto oculto. El entregable debe reducir un pendiente real de producción y sugerir el siguiente estado únicamente si la evidencia del propio contenido lo permite.

CONTEXTO
Pieza: ${content.title}. Formato físico: ${physicalTypeLabel(content.physicalType)}. Patrón: ${content.recipeClient||'no definido'}. Pilar: ${content.pillar}. Lote: ${content.lot}. Estado: ${content.lifecycle}. Plataformas: ${(content.platforms||[]).join(', ')||content.primaryPlatform||'no registradas'}. Resumen/tesis: ${content.summary||content.thesis||''}

ALCANCE ESPECÍFICO
${taskInstructions(task.type)}

QUÉ ES
Un entregable puntual que cierra o avanza una Production Task del content_id ${content.id}. Debe respetar Brand Core, formato físico, estructura, assets esperados y cualquier contenido ya aprobado. Si la tarea produce archivos, cada archivo debe declarar slot, filename y relativePath.

QUÉ NO ES
No regeneres la pieza completa. No cambies tesis, hook, claims, estructura o copy fuera de alcance. No inventes datos, fuentes, resultados, features, testimonios, fechas ni assets que no existen. No sustituyas una tarea difícil por sugerencias vagas. No marques “done” una tarea que todavía requiere input externo.

DEPENDENCIAS Y TRAZABILIDAD
Estado actual de la tarea: ${task.status}. Assets esperados relacionados: ${(content.expectedAssets||[]).map(a=>`${a.slotId}:${a.relativePath}:${a.status}`).join(' | ')||'sin slots registrados'}. QA actual: claims=${!!content.qa?.claimsChecked}, sources=${!!content.qa?.sourcesChecked}, visual=${!!content.qa?.visualChecked}. Si falta una dependencia, inclúyela en blockers[] y conserva statusSuggested="blocked" o "ready_prompt".

SALIDA EXACTA
Devuelve JSON con taskId="${task.id}", contentId="${content.id}", taskType="${task.type}", result, decisions[], blockers[], warnings[], assets[] con assetSlotId/filename/relativePath cuando aplique, notes, qaChecks[], statusSuggested y nextAction. No devuelvas una entidad de contenido nueva ni cambies content_id.

QA
Comprueba: especificidad de ${client.name}; formato físico correcto; alcance limitado a esta tarea; cero invenciones; rutas/slots correctos; resultado ejecutable; blockers honestos; y compatibilidad con el estado actual. Si el resultado no permite realmente cerrar la tarea, no sugieras done/approved.`;}
function scorePrompt(p){const words=String(p).trim().split(/\s+/).filter(Boolean).length;let score=100;const issues=[];if(words<180){score-=30;issues.push('prompt corto');}for(const x of ['ROL','OBJETIVO','QUÉ ES','QUÉ NO ES','SALIDA','QA'])if(!String(p).includes(x)){score-=8;issues.push(`falta ${x}`);}if(/\bTODO\b|\bTBD\b|\[PENDIENTE(?!: transcripción)/.test(String(p))){score-=15;issues.push('placeholder');}return {score:Math.max(0,score),words,issues,pass:score>=85};}
return {PHYSICAL,STRUCTURE_TEMPLATES,deepClone,esc,uid,physicalTypeLabel,physicalKind,clientThemeTokens,translatePatternToPhysical,mergeStructures,buildBatchPlan,lotCadenceCounts,compileEditorialPrompt,compileVisualPrompt,compileUnitOmniPrompt,compileUnitReferenceImagesPrompt,compileUnitBrollPrompt,compileUnitStillPrompt,compileUnitSfxPrompt,compileCarouselSlidePrompt,buildBrandToolPrompt,buildShimPrompt,makeTaskPrompt,scorePrompt,brandSnapshot};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ABRAXAS_CORE;
if(typeof window!=='undefined')window.ABRAXAS_CORE=ABRAXAS_CORE;


/* ================= v1.2 · Cinematic Quality Override Layer ================= */
(function(){
  const QUALITY_SYSTEM = {
    label:'ABRAXAS Visual Quality System v1.2',
    intent:'cinematic-high-fidelity / no-cheap-ai-look',
    directives:[
      'Usar textura, materiales, microcontraste, profundidad, iluminación plausible y composición premium.',
      'Evitar acabado plástico, piel encerada, texto derretido, manos deformes, hologramas gratuitos y UI irreal sin etiqueta de referencia.',
      'Toda imagen o video debe parecer parte de una producción profesional, no de un moodboard genérico de IA.',
      'Cada prompt debe explicitar sujeto, acción, luz, lente aparente, textura, materiales, timing y continuidad.',
      'Para video: Recording/source, B-roll, VFX, SFX, Music, Cover y Copies se diseñan como capas separadas pero coordinadas.',
      'Para referencias START / MIDDLE / END, las tres imágenes deben representar la misma escena en diferente estado temporal.',
      'Para carruseles, generar prompt con texto y prompt sin texto, ambos con safe areas y continuidad editorial.'
    ],
    textureVocabulary:['microtexture','clean skin detail','controlled film grain','high dynamic range without crunchy oversharpening','volumetric light when justified','premium print/editorial finish'],
    negativeVocabulary:['cheap ai look','plastic skin','melted typography','floating nonsense objects','gratuitous neon fog','generic stock office', 'overdecorated glass UI']
  };
  function joinLines(list,prefix='- '){return (list||[]).map(x=>prefix+x).join('\n');}
  function structureBlock(content, inputs={}){
    const units = (inputs.structure || content.structure || content.units || []);
    return units.map((u,i)=>{
      if(typeof u==='string') return `${i+1}. ${u}`;
      const name = u.name || u.label || `Unidad ${i+1}`;
      const fn = u.function || '';
      const txt = u.text ? ` | Texto: ${u.text}` : '';
      return `${i+1}. ${name}${fn?` · ${fn}`:''}${txt}`;
    }).join('\n');
  }
  function unitContext(content, unit, index, client){
    return [
      `CONTENT_ID: ${content.id}`,
      `CLIENTE: ${client.name}`,
      `UNIDAD: ${unit.label||unit.name||`Unidad ${index+1}`}`,
      `FUNCIÓN: ${unit.function||''}`,
      `TEXTO/IDEA: ${unit.text||''}`,
      `FORMATO: ${ABRAXAS_CORE.physicalTypeLabel(content.physicalType)}`,
      `PILAR: ${content.pillar||''}`,
      `DIRECCIÓN VISUAL ACTUAL: ${unit.visualDirection||''}`,
      `GRABACIÓN / SOURCE: ${unit.recording||''}`,
      `B-ROLL ACTUAL: ${unit.broll||''}`,
      `VFX ACTUAL: ${unit.vfx?.name||'ninguno'}`,
      `SFX ACTUAL: ${unit.sfx?.sound||'no_sfx_needed'}`,
      `QUALITY CONTEXT: ${client.qualityPromptContext||''}`,
      `VISUAL IDENTITY / RULES: ${client.visualRules||''}`
    ].join('\n');
  }
  function qualityBlock(extraTitle='CALIDAD VISUAL / EJECUCIÓN'){
    return `${extraTitle}
${joinLines(QUALITY_SYSTEM.directives)}

QUÉ ES
Una especificación de producción de alta fidelidad: cada decisión visual, sonora o de edición debe tener función narrativa, continuidad, parámetros suficientes para ejecución y acabado profesional verificable.

QUÉ NO ES
No es una lista de adjetivos como “premium/cinematic/modern”, un moodboard genérico, una excusa para añadir VFX, una recreación barata con apariencia de IA ni un sustituto de evidencia real.

VOCABULARIO DE TEXTURA / CALIDAD
${joinLines(QUALITY_SYSTEM.textureVocabulary)}

NEGATIVOS
${joinLines(QUALITY_SYSTEM.negativeVocabulary)}

QA
- Verificar función narrativa antes de añadir cualquier capa.
- Verificar continuidad de sujeto, lente, luz, materiales, geometría y marca.
- Verificar ausencia de artefactos evidentes de IA, texto derretido, anatomía incorrecta y objetos sin lógica física.
- Verificar que cualquier evidencia/claim esté rotulado correctamente y no se fabrique.
- Verificar que el resultado sea producible por otra persona sin conocer este chat.`;
  }

  ABRAXAS_CORE.compileEditorialPrompt = function(content,client,inputs={}){
    return `ABRAXAS · PROMPT MAESTRO EDITORIAL · v1.2\nCONTENT_ID: ${content.id}\n\nROL\nActúa como director editorial senior, guionista y copywriter nativo de plataforma para ${client.name}. No estás proponiendo ideas vagas: debes devolver una pieza final, operable, versionable y lista para volver a ABRAXAS.\n\nOBJETIVO\nCrear o regenerar “${content.title}” como ${ABRAXAS_CORE.physicalTypeLabel(inputs.physicalType||content.physicalType)}. Audiencia: ${inputs.audience||content.audience||'audiencia profesional relevante'}. Problema: ${inputs.problem||content.problem||content.summary||''}. Cambio buscado: ${inputs.desiredChange||content.desiredChange||'que la audiencia entienda una decisión y pueda actuar mejor'}.\n\nBRAND CORE\n${ABRAXAS_CORE.brandSnapshot(client)}\n\nQUALITY CONTEXT DEL CLIENTE\n${client.qualityPromptContext||'Usar Brand Core, formato y Source Truth disponibles.'}\n\nESTRUCTURA EDITABLE\n${structureBlock(content,inputs)}\n\nQUÉ ES\nUna pieza editorial final de ${client.name}, construida para el formato físico solicitado, con tesis clara, estructura progresiva, voz de marca y salida suficientemente completa para volver a ABRAXAS sin reinterpretación oculta.\n\nQUÉ NO ES\nNo es una lluvia de ideas, un esquema genérico, un texto motivacional intercambiable, una plantilla universal sin identidad, ni un resultado que pueda inventar claims, experiencias, datos, citas o features.\n\nCRITERIO EDITORIAL\n- Hook con tensión real.\n- Desarrollo progresivo, no redundante.\n- Cierre que pague la promesa del hook.\n- Cada unidad aporta una información nueva.\n- Separar hechos, hipótesis, opinión y ejemplo.\n- No inventar claims, datos, resultados, citas ni features.\n\nOUTPUTS OBLIGATORIOS\n1. Pieza final.\n2. Copies por plataforma.\n3. Summary / thesis / metadata.\n4. Prompt inputs normalizados.\n5. expectedAssets y productionTaskResults consistentes con el mismo content_id.\n\nSALIDA EXACTA\nDevuelve JSON con contentId, title, summary, thesis, physicalType, structure[], units[], copies, promptInputs, prompts.editorial, prompts.visual, expectedAssets[], productionTaskResults[] y qa.\n\nQA\nVerifica especificidad de marca, formato físico correcto, ausencia de redundancia, copies nativos y content_id intacto.\n\n${qualityBlock('CALIDAD DEL LENGUAJE Y DEL RESULTADO')}\n- El texto debe sentirse humano, preciso y profesional; no “AI fluff”.\n- Cada bloque debe poder ejecutarse sin conocer este chat.`;
  };

  ABRAXAS_CORE.compileVisualPrompt = function(content,client,inputs={}){
    const units = (content.units||[]).map((u,i)=>`${i+1}. ${u.label||u.name||`Unidad ${i+1}`} · ${u.function||''}\n   Visual direction: ${u.visualDirection||''}\n   Recording/source: ${u.recording||''}`).join('\n');
    return `ABRAXAS · PROMPT MAESTRO VISUAL / PRODUCCIÓN · v1.2\nCONTENT_ID: ${content.id}\n\nROL\nActúa como director de arte, director audiovisual, supervisor de post y prompt designer para ${client.name}. Cada asset debe mejorar comprensión, retención o claridad; no decorar.\n\nOBJETIVO\nTraducir el contenido aprobado a decisiones visuales ejecutables por unidad sin cambiar tesis, claims ni función narrativa.\n\nFORMATO Y CONTEXTO\nFormato físico: ${ABRAXAS_CORE.physicalTypeLabel(inputs.physicalType||content.physicalType)}. Tema: ${content.title}. Referencia visual opcional: ${inputs.visualReference||content.visualReference||'No aportada'}.\n\nIDENTIDAD DE MARCA\n${client.visualRules||client.brandCore?.identity||''}\nAccent: ${client.accent}. Úsalo como identidad, no como filtro total.\n\nUNIDADES EDITORIALES\n${units}\n\nCAPAS QUE DEBES RESOLVER\n- Recording/source video direction.\n- B-roll independiente.\n- VFX/Omni overlays con preservación de identidad.\n- SFX específicos y subordinados a voz.\n- Music brief con energía, BPM y comportamiento.\n- Cover / thumbnail.\n- Copies on-screen si aplica.\n- START / MIDDLE / END references cuando una unidad tenga intervención o B-roll.\n- Prompt con texto y prompt sin texto para slides/portadas.\n\nSALIDA EXACTA\nDevuelve visualPlan[] con unitId, narrativeFunction, mode, visualDirection, recordingSource, broll, vfx, sfx, music, cover, copiesOnScreen, promptWithText, promptWithoutText, startMiddleEndReferences, assetSlotId, filename y relativePath.\n\n${qualityBlock()}\n\nQA\nSi una intervención no mejora comprensión o retención, elige presenter_only. Distingue ilustración de evidencia. No rompas continuidad.`;
  };

  ABRAXAS_CORE.compileUnitOmniPrompt = function(content,unit,index,client){
    return `ABRAXAS · OMNI / SOURCE VIDEO ENHANCEMENT · v1.2\n\nROL\nActúa como supervisor de VFX, director de composición y prompt designer senior. Usa el fragmento de video original como SOURCE VIDEO obligatorio cuando exista.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nDiseñar una intervención Omni/VFX específica que aclare relación, mecanismo, interfaz, dato o contraste sin re-renderizar al speaker.\n\nREGLAS\n- Preservar identidad, anatomía, lipsync, manos, vestuario, cámara, exposición y perspectiva.\n- Describir START / MIDDLE / END como tres estados de la misma intervención.\n- Detallar placement, depth, occlusion, motion, timing, reflection/light integration y negatives.\n- Si el speaker funciona mejor solo, devolver mode=presenter_only.\n\n${qualityBlock()}\n\nSALIDA EXACTA\nJSON con mode, objective, preservationRules[], effectName, spatialPlacement, occlusion, depth, lightingIntegration, motion, timing{in,build,peak,out}, referenceFrames{start,middle,end}, sfx{sound,when,trigger,level}, negatives[], finalOmniPrompt, assetSlotId y relativePath.`;
  };

  ABRAXAS_CORE.compileUnitReferenceImagesPrompt = function(content,unit,index,client){
    return `ABRAXAS · REFERENCE FRAMES START / MIDDLE / END · v1.2\n\nROL\nActúa como director de arte y diseñador de keyframes. Debes generar tres imágenes de referencia temporalmente coherentes para la misma escena.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nCrear un triptych de keyframes que permita a una IA de video o a un editor reconstruir exactamente cómo empieza, evoluciona y termina la intervención, sin cambiar identidad, escenario ni función narrativa.\n\nREGLAS\n- START establece estado inicial.\n- MIDDLE muestra máxima legibilidad del mecanismo o idea.\n- END resuelve la acción y prepara el siguiente corte.\n- Mantener sujeto, lente aparente, composición, luz, materiales y continuidad.\n- No generar tres conceptos distintos.\n\n${qualityBlock()}\n\nSALIDA EXACTA\nstartPrompt, middlePrompt, endPrompt, continuityRules[], cameraMotionSuggestion, transitionSuggestion, negatives[], assetSlotId y relativePath.`;
  };

  ABRAXAS_CORE.compileUnitBrollPrompt = function(content,unit,index,client){
    return `ABRAXAS · INDEPENDENT B-ROLL VIDEO · v1.2\n\nROL\nActúa como director de fotografía y realizador de B-roll. Diseña un apoyo audiovisual específico y útil.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nCrear un B-roll independiente que añada contexto, evidencia, metáfora, proceso o tensión y que pueda insertarse en el beat sin parecer stock genérico ni competir con la voz.\n\nREGLAS\n- Shot o microsecuencia de 3–8 segundos con función narrativa explícita.\n- Definir sujeto, acción, encuadre, lente, altura, movimiento, foreground/midground/background, iluminación, materiales y transición.\n- Incluir START / MIDDLE / END y timing sobre la voz.\n- Si no hay visual específica que aporte, devolver presenter_only.\n\n${qualityBlock()}\n\nSALIDA EXACTA\nmode, narrativeFunction, shotDescription, duration, camera, lens, movement, lighting, colorMaterials, action, timingInVoice, startFrame, middleFrame, endFrame, transitionIn, transitionOut, negatives[], finalVideoPrompt, evidenceLabel y assetSlotId/relativePath.`;
  };

  ABRAXAS_CORE.compileUnitStillPrompt = function(content,unit,index,client){
    return `ABRAXAS · PHOTO / STILL SUPPORT · v1.2\n\nROL\nActúa como director de arte y fotógrafo/editorial prompt designer.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nCrear una imagen fija editorial/cinematográfica que cumpla una función concreta dentro del contenido y preserve la identidad visual del cliente y de la serie.\n\nREGLAS\n- Define sujeto, composición, jerarquía, perspectiva, luz, materiales, safe area y negative space.\n- Diferencia evidencia real vs illustrative_reference.\n- No inventes dashboards, documentos, productos o resultados.\n\n${qualityBlock()}\n\nSALIDA EXACTA\nmode, subject, scene, composition, cameraPerspective, lighting, colorMaterials, negativeSpace, safeArea, textPlacementGuide, evidenceLabel, negatives[], finalImagePrompt, assetSlotId, filename y relativePath.`;
  };

  ABRAXAS_CORE.compileUnitSfxPrompt = function(content,unit,index,client){
    return `ABRAXAS · SFX DESIGN / SEARCH BRIEF · v1.2\n\nROL\nActúa como sound designer y editor de audio senior.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nDiseñar o localizar un microevento sonoro preciso que refuerce un evento visual o narrativo sin competir con voz, música ni inteligibilidad.\n\nREGLAS\n- Diseñar microevento sonoro sincronizado a evento visual real.\n- No competir con la voz.\n- Si no aplica, devolver no_sfx_needed.\n- Definir timbre, ataque, cuerpo, cola, duración, mezcla y searchKeywords.\n\n${qualityBlock('CALIDAD DE DISEÑO SONORO')}\n\nSALIDA EXACTA\nsound, when, trigger, level, duration, tonalCharacter, frequencyProfile, envelope, processing, placement, searchKeywords[], generationPrompt, negatives[] y qa.`;
  };

  ABRAXAS_CORE.compileCarouselSlidePrompt = function(content,unit,index,client,withText=true){
    const textRule = withText ? `Incluye EXACTAMENTE este texto aprobado: “${unit.text||''}”.` : 'No incluyas texto renderizado final; reserva zonas para composición posterior.';
    return `ABRAXAS · CAROUSEL SLIDE ${withText?'WITH TEXT':'WITHOUT TEXT'} · v1.2\n\nROL\nActúa como director de arte editorial y diseñador de carruseles premium para ${client.name}.\n\nCONTEXTO\n${unitContext(content,unit,index,client)}\n\nOBJETIVO\nTraducir la función “${unit.function||''}” a una composición vertical 4:5 clara, elegante y legible. ${textRule}\n\nREGLAS\n- Una sola idea dominante por slide.\n- Continuidad entre slides.\n- Safe area 9–12%.\n- Definir composición, luz, materiales, jerarquía, visualDirection, promptWithText o promptWithoutText y continuityRules.\n\n${qualityBlock()}\n\nSALIDA EXACTA\nslideIndex, narrativeFunction, layout, headlineArea, bodyArea, imageArea, safeArea, subject, composition, lighting, colorMaterials, graphicElements, continuityRules[], negatives[], evidenceLabel, finalPrompt, assetSlotId, filename y relativePath.`;
  };

  ABRAXAS_CORE.buildShimPrompt = function(cfg){
    const structures = (cfg.structures||[]).join(', ') || 'distribución inteligente';
    const platforms = (cfg.platforms||[]).join(', ') || 'multiplataforma';
    const verticals = cfg.verticalEnabled ? (cfg.verticalMax ? 'máximo posible' : cfg.verticalCount || 'auto') : 0;
    const horizontals = cfg.horizontalEnabled ? (cfg.horizontalCount || 'auto') : 0;
    const carousels = cfg.carouselEnabled ? (cfg.carouselAuto ? 'automático' : cfg.carouselCount || 'auto') : 0;
    return `ABRAXAS SHIM · EXTERNAL AI EDITORIAL REQUEST · v1.2\n\nROL\nActúa como editor jefe, director de post, analista de transcripción y arquitecto de automatización. Debes transformar una grabación larga con timestamps en un resultado editorial premium y ejecutable, devolviendo un HTML autocontenido y un master JSON con suficiente detalle para producir los videos tanto por Terminal/FFmpeg como por DaVinci Resolve.\n\nFUENTE\nNombre: ${cfg.sourceLabel||'sin nombre'}\nContexto: ${cfg.context||'sin contexto adicional'}\nVerticales: ${verticals}\nHorizontales: ${horizontals}\nCarruseles complementarios: ${carousels}\nPlataformas: ${platforms}\nModo de estructuras: ${cfg.structureMode||'smart'}\nEstructuras seleccionadas: ${structures}\nEstructura personalizada: ${cfg.customStructure||'ninguna'}\n\nOBJETIVO\nEncontrar y estructurar los mejores clips posibles sin inventar texto hablado, con hooks claros, desarrollo progresivo y cierre que pague la promesa. Además debes generar carruseles complementarios, copies nativos, prompts visuales de alta calidad y un Automation Handoff alineado con el flujo de Terminal y DaVinci.\n\nREGLAS DE INTEGRIDAD\n- La transcripción con timestamps es la fuente literal de cualquier frase hablada.\n- No corrijas una cita sin marcarlo.\n- Cada clip debe declarar todos los segmentos/timestamps que lo componen.\n- Si el usuario pide máximo de piezas, evita repetir indebidamente el mismo fragmento.\n- transcriptIntegrity=10 y timestampIntegrity=10 son obligatorios para candidatos aprobados.\n\nCRITERIO EDITORIAL\n- Hook claro en los primeros segundos.\n- Desarrollo con progresión real.\n- Cierre o payoff.\n- Idea autónoma y publicable.\n- Valor específico para pilar, plataforma y retención.\n- Distinguir approvedCandidates, borderlineCandidates y discardedCandidates con razón explícita.\n\nREQUISITOS DE PRODUCCIÓN POR VIDEO\nCada candidato debe incluir:\n1. Recording / source plan.\n2. B-roll por sub-bloque del desarrollo.\n3. VFX / Omni prompt cuando tenga sentido.\n4. SFX con sound + when + trigger + level.\n5. Music brief.\n6. Cover / thumbnail plan.\n7. Copies START / MIDDLE / END si aplica a on-screen text y referencias visuales.\n8. START / MIDDLE / END reference prompts.\n9. Visual direction detallado.\n10. PromptWithText y PromptWithoutText cuando aplique a portada o slide.\n\n${qualityBlock('CALIDAD VISUAL Y DE EJECUCIÓN INNEGOCIABLE')}\n\nHTML REQUERIDO\nDevuelve un editable_html completo y autocontenido inspirado en los HTML de resultado premium de ABRAXAS/Moka, con:\n- Dashboard inicial.\n- Lista de candidatos.\n- Content Studio 1×1 por clip.\n- Sección de carruseles complementarios.\n- Production plan por candidato.\n- Historial, descarte, notes y warnings.\n- Exportadores o bloques distinguibles para Terminal y DaVinci.\n- Paneles de prompt: Recording/source, B-roll, VFX, SFX, Music, Cover, Copies, START/MIDDLE/END references, Omni prompt, Visual direction, Prompt con texto, Prompt sin texto.\n\nSELECCIÓN HUMANA OBLIGATORIA
Cada clip y carrusel debe tener selectionStatus en CANDIDATO / REVISADO / CONFIRMADO / DESCARTADO / NEEDS_FIX. Solo CONFIRMADO puede entrar en automatización. El HTML debe permitir confirmar, marcar Needs Fix o descartar sin perder sourceFragments, notas ni History. Shim no automatiza candidatos: automatiza decisiones confirmadas.

SHIM_CONFIRMED_MANIFEST.json · FUENTE ÚNICA
El HTML debe poder exportar SHIM_CONFIRMED_MANIFEST.json como única fuente maestra de automatización. Debe incluir project, sourceVideo, sourceReadOnly=true, confirmedVideos[], confirmedCarousels[], editorialSelectionVersion, reviewedAt, reviewerNotes y warnings. Terminal/FFmpeg y DaVinci consumen exactamente este manifest; no reinterpretan ni vuelven a seleccionar clips.

VIDEO CONFIRMADO · ESTRUCTURA
confirmedVideos[].segments[] contiene order, role (hook/development/payoff), sourceStart, sourceEnd, exact, sourceLiteral y speaker. Conserva Recording/source, B-roll, VFX, SFX, Music, Cover, Copies, START/MIDDLE/END references y Omni prompt por clip/beat.

CUT_AUTOMATION_PACKAGE · SOLO VIDEOS CONFIRMADOS
Exportar CUT_AUTOMATION_PACKAGE.json exclusivamente desde confirmedVideos. Debe contener project/sourceVideo/sourceReadOnly, candidateId, title, kind, platforms, segments[{order,role,sourceStart,sourceEnd,exact,sourceLiteral,speaker}], assemblyMode, targetDuration, outputFilename, outputFormat, subtitles{sourceLiteral,correctedSubtitle,confidence,warnings}, coverBrief, editNotes, brollPlan, vfxPlan, sfxPlan, musicPlan y verificationChecklist. Ningún CANDIDATO/REVISADO/NEEDS_FIX/DESCARTADO puede entrar.

TERMINAL / FFMPEG · OPCIONES DEL HTML
Permite elegir: 1) un video confirmado; 2) varios por ID; 3) todos los confirmados; 4) selección guardada. Luego: segmentos separados / video unido / ambos / solo instrucciones / paquete completo. Precisión: corte preciso con recodificación o stream copy rápido dependiente de keyframes. SOURCE VIDEO es READ ONLY: nunca sobrescribir, mover, recortar ni alterar el original.

DAVINCI RESOLVE · MISMA DECISIÓN EDITORIAL
Genera paquete ejecutable con ABRAXAS_IMPORT_TO_RESOLVE.py, timeline_manifest.json, marker_manifest.json, subtitle_manifest.json, edit_notes.json y DAVINCI_README.md. Debe importar source/derivados, crear timeline(s), mantener orden confirmado, colocar markers HOOK/DEVELOPMENT/PAYOFF/B-ROLL/VFX/SFX/CLAIM/REVIEW y preparar subtítulos/assets. El timeline queda editable.

CAROUSEL_PRODUCTION_PACKAGE · SEPARADO
Carruseles confirmados nunca entran a FFmpeg. Exportar CAROUSEL_PRODUCTION_PACKAGE.json con carouselId, sourceThemeIds, formatId, purpose, audience, thesis, slides[{function,text,argument,visualDirection,evidenceSource,promptWithText,promptWithoutText,assetSlot}], copies{instagram,linkedin,tiktok,youtube}, QA, claimRisk, blockers y selectionStatus=CONFIRMADO. Su destino es Content Studio → Visual Prompts → Image/Design → Assets → QA → Calendar.

ESTRUCTURA DE CARPETA ESPERADA
ABRAXAS_SHIM_EXPORT/
├── MASTER_MANIFEST.json
├── SHIM_CONFIRMED_MANIFEST.json
├── CONFIRMED_SELECTION.json
├── README.md
├── terminal/{ABRAXAS_SHIM.command,abraxas_shim_export.py,verify_environment.py,ffmpeg_commands.txt}
├── davinci/{ABRAXAS_IMPORT_TO_RESOLVE.py,timeline_manifest.json,marker_manifest.json,subtitle_manifest.json,edit_notes.json,DAVINCI_README.md}
└── clips/<candidateId>/{manifest.json,cutlist.json,cutlist.csv,transcript.txt,subtitles.srt,fragments/,joined/,copies/,covers/,visual/{visual_plan.json,broll.json,vfx.json,sfx.json,music.json},prompts/{omni/,images/,covers/},references/}

AUTOMATIZACIÓN EN EL HTML
Sección final obligatoria: “AUTOMATIZACIÓN”. Mostrar Videos confirmados + botones Exportar Terminal/FFmpeg, Exportar DaVinci Resolve, Exportar ambos; Carruseles confirmados + Exportar producción de carruseles; Todo + Exportar paquete completo. Añadir “Cómo usarlo” con 10 pasos: qué aprobaste, qué genera ABRAXAS, qué descargar, cómo ejecutar Terminal, cómo ejecutar DaVinci, qué esperar, qué revisar manualmente, cómo volver a ABRAXAS, dónde cargar assets/resultados y cómo saber que terminó.

MASTER JSON REQUERIDO
Devuelve master_json con estas claves mínimas:\n- requestMeta\n- candidates[]\n- carousels[]\n- discardedCandidates[]\n- qualityGate\n- calendarSuggestion\n- automationHandoff{terminalPackage,davinciPackage}\n\nAUTOMATION HANDOFF\nDebes generar dos paquetes coherentes:\nA) terminalPackage\n- schema_version\n- source{master_video,fps,resolution,audio}\n- timelines[] con segments[{order,source_start,source_end,exact,reference_text}]\n- outputPlan\n- scriptsSuggested[00_PREPARAR,01_PARSEAR_TIMESTAMPS,02_RENDER_LIMPIO,03_VERIFICAR,04_RENDER_VARIANTES]\n- verificationChecklist\n\nB) davinciPackage\n- schema_version\n- importMode (recomendado: clean_mp4_from_terminal o master_ranges)\n- timelines[]\n- projectSetup\n- subtitleStrategy\n- textPlusFallback\n- consoleScripts{diagnostico,maestro,reanudar,reparar}\n- logsAndState\n\nCARRUSELES COMPLEMENTARIOS\nGenera carruseles realmente complementarios, no resúmenes redundantes del video. Cada slide debe tener text, visualDirection, copy por plataforma, promptWithText y promptWithoutText.\n\nTRANSCRIPCIÓN\n${cfg.transcript||'[PENDIENTE: transcripción con timestamps]'}\n\nSALIDA EXACTA\nDevuelve: 1) editable_html; 2) master_json; 3) SHIM_CONFIRMED_MANIFEST.json; 4) CUT_AUTOMATION_PACKAGE.json; 5) CAROUSEL_PRODUCTION_PACKAGE.json; 6) terminalPackage; 7) davinciPackage; 8) manifests por candidato; 9) copies por plataforma; 10) prompts visuales y START/MIDDLE/END; 11) blockers y warnings.\n\nQA\nNo ocultes limitaciones. Declara blockers, warnings, qualityExhausted, candidatos descartados y razones. Todo debe poder volver a ABRAXAS sin IDs paralelos.`;
  };

  ABRAXAS_CORE.makeTaskPrompt = function(content,task,client){
    return `ABRAXAS · PRODUCTION TASK · v1.2\nCONTENT_ID: ${content.id}\nTASK_ID: ${task.id}\nTASK: ${task.label}\n\nROL\nActúa como especialista senior de producción para ${client.name}.\n\nOBJETIVO\nResolver ${task.description} de forma ejecutable, trazable y suficientemente específica para que el resultado pueda volver a ABRAXAS sin contexto oculto.\n\nCONTEXTO\nPieza: ${content.title}. Formato: ${ABRAXAS_CORE.physicalTypeLabel(content.physicalType)}. Pilar: ${content.pillar}. Estado: ${content.lifecycle}.\n\n${qualityBlock('ESTÁNDAR DE CALIDAD')}\n\nSALIDA EXACTA\nJSON con taskId, contentId, taskType, result, decisions[], blockers[], warnings[], assets[], notes, qaChecks[], statusSuggested y nextAction.`;
  };

  ABRAXAS_CORE.VISUAL_QUALITY_SYSTEM_V120 = QUALITY_SYSTEM;
  ABRAXAS_CORE.VISUAL_QUALITY_SYSTEM_V112 = QUALITY_SYSTEM;
})();

/* ================= v1.2 · Dedicated Music / Cover / Copy Production Prompts ================= */
(function(){
  function context(content,unit,index,client){return `CONTENT_ID: ${content.id}\nCLIENTE: ${client.name}\nFORMATO: ${ABRAXAS_CORE.physicalTypeLabel(content.physicalType)}\nUNIDAD: ${unit.label||unit.name||`Unidad ${index+1}`}\nFUNCIÓN: ${unit.function||''}\nTEXTO: ${unit.text||''}\nDIRECCIÓN VISUAL: ${unit.visualDirection||''}\nQUALITY CONTEXT: ${client.qualityPromptContext||''}\nVISUAL IDENTITY / RULES: ${client.visualRules||''}`}
  const shared=`\n\nESTÁNDAR VISUAL / SONORO ABRAXAS v1.2\nQUÉ ES\nUna especificación de producción profesional: materiales, textura, jerarquía, luz/sonido, timing, continuidad y función narrativa deben ser observables.\n\nQUÉ NO ES\nNo es una lista de adjetivos como “premium, cinematic, viral”. No es decoración. No es stock genérico. No es estética de IA barata. No inventa evidencia, productos, dashboards, resultados ni logos.\n\nCALIDAD\n- Acabado editorial/cinematográfico alto, plausible y controlado.\n- Microtextura, materiales y contraste con detalle natural; evitar plástico, sobreenfoque y efectos gratuitos.\n- Todo elemento tiene función narrativa.\n- Mantener continuidad con la marca, serie y resto de la pieza.\n- Distinguir referencia ilustrativa de evidencia real.\n\nNEGATIVOS\ncheap AI look; plastic skin; melted typography; fake UI; generic stock office; gratuitous holograms; random neon fog; oversharpened texture; arbitrary luxury props; malformed logos.\n\nQA\nComprueba función, identidad, continuidad, legibilidad, plausibilidad, ausencia de artifacts, plataforma y capacidad de producción sin contexto oculto.`;
  ABRAXAS_CORE.compileUnitMusicPrompt=function(content,unit,index,client){
    const m=unit.music||{};
    return `ABRAXAS · MUSIC DIRECTION · v1.2\n\nROL\nActúa como music supervisor, editor musical y diseñador de ritmo para una pieza de ${client.name}.\n\nOBJETIVO\nDiseñar una base musical que sostenga la tensión y la progresión de esta unidad sin competir con la voz ni convertir el contenido en trailer genérico.\n\nCONTEXTO\n${context(content,unit,index,client)}\n\nREFERENCIA ACTUAL\nEstilo: ${m.style||'sin definir'}\nBPM/rango: ${m.bpm||'sin definir'}\nCuándo / ducking: ${m.when||'sin definir'}\n\nDECISIONES QUE DEBES TOMAR\n1. Función emocional/narrativa exacta.\n2. BPM o rango y por qué.\n3. Instrumentación/textura y densidad.\n4. Punto de entrada, build, peak y salida.\n5. Ducking bajo voz y automatización de nivel.\n6. Transición entre beats y resolución del cierre.\n7. Qué NO usar.\n8. Keywords útiles para buscar/generar una pista compatible.\n${shared}\n\nSALIDA EXACTA\nJSON con unitId, function, style, bpm, instrumentation[], texture, energyCurve{start,middle,end}, entry, build, peak, exit, ducking, voicePriority, transitionNotes, searchKeywords[], generationBrief, negatives[], qa.`;
  };
  ABRAXAS_CORE.compileUnitCoverPrompt=function(content,unit,index,client){
    return `ABRAXAS · COVER / THUMBNAIL DIRECTION · v1.2\n\nROL\nActúa como director de arte editorial, fotógrafo y diseñador de portada senior para ${client.name}.\n\nOBJETIVO\nCrear una portada que comunique el tema de “${content.title}” en un vistazo, funcione en tamaño pequeño y conserve el ADN visual de la marca/serie.\n\nCONTEXTO\n${context(content,unit,index,client)}\n\nQUÉ DEBE RESOLVER\n- Una sola prioridad visual.\n- Subject/objeto principal y su función.\n- Composición, jerarquía, safe areas y negative space.\n- Lente/perspectiva y profundidad aparentes.\n- Luz, materiales, textura, color y tratamiento editorial.\n- Relación texto/imagen.\n- Prompt WITH TEXT y WITHOUT TEXT.\n- Si existe persona recurrente, preservar identidad y anatomía.\n- Si la portada usa evidencia real, marcarla como real_source; si es generada, illustrative_reference.\n${shared}\n\nSALIDA EXACTA\nJSON con coverFunction, subject, scene, composition, framing, cameraPerspective, lighting, materials, texture, palette, hierarchy, safeArea, negativeSpace, headlineGuide, promptWithText, promptWithoutText, continuityRules[], evidenceLabel, negatives[], assetSlotId, filename, relativePath, qa.`;
  };
  ABRAXAS_CORE.compileUnitCopiesPrompt=function(content,unit,index,client){
    return `ABRAXAS · PLATFORM COPIES · v1.2\n\nROL\nActúa como copywriter senior multiplataforma y editor de voz de ${client.name}.\n\nOBJETIVO\nEscribir copies que complementen la pieza y su unidad editorial sin resumir literalmente el guion/carrusel. Deben ser nativos de plataforma, conservar la postura de marca y añadir contexto, interpretación, conversación o CTA útil.\n\nCONTEXTO\n${context(content,unit,index,client)}\n\nREGLAS\n- Instagram: acompañar, contextualizar y activar conversación; no “en este carrusel te contamos…”.\n- LinkedIn: puede desarrollar tesis, aprendizaje, experiencia o implicación de manera más autónoma.\n- TikTok: directo, corto y compatible con consumo rápido.\n- YouTube: framing claro, descripción útil y CTA acorde al contenido.\n- No usar CTAs mecánicos tipo “comenta SI” salvo criterio explícito de marca.\n- No inventar experiencia personal, datos o resultados.\n- El opening del copy no debe duplicar palabra por palabra el hook salvo decisión justificada.\n${shared}\n\nSALIDA EXACTA\nJSON con instagram{copy,cta,hashtagsOptional}, linkedin{copy,cta}, tiktok{copy,cta}, youtube{titleIdeas[],description,cta}, sharedClaims[], sourceNotes[], antiRepetitionCheck, qa.`;
  };
})();

(function(){
  ABRAXAS_CORE.compileUnitRecordingPrompt=function(content,unit,index,client){
    return `ABRAXAS · RECORDING / SOURCE DIRECTION · v1.2

ROL
Actúa como director de fotografía, director de performance, supervisor de continuidad y realizador senior para ${client.name}. Tu trabajo es convertir una intención editorial ya aprobada en instrucciones de rodaje suficientemente precisas para que otra persona pueda grabar sin reinterpretar el concepto desde cero.

OBJETIVO
Convertir la unidad ${index+1} (${unit.label||unit.name||'unidad'}) en un brief de grabación profesional que preserve tesis, tono, ritmo y continuidad. Debe producir una opción simple/robusta y una opción avanzada, explicando qué mejora realmente la segunda. Si el input es footage existente, el source es READ ONLY: no reescribas lo hablado ni sugieras recrear una toma como si fuera evidencia original.

CONTEXTO
CONTENT_ID: ${content.id}
Cliente: ${client.name}
Formato: ${ABRAXAS_CORE.physicalTypeLabel(content.physicalType)}
Pilar: ${content.pillar||''}
Función narrativa: ${unit.function||''}
Texto/idea aprobada: ${unit.text||''}
Dirección actual: ${unit.recording||''}
Visual direction: ${unit.visualDirection||''}

QUÉ ES
Un brief de rodaje ejecutable para presenter footage, source footage, entrevista, voice-over support o escena demostrativa. Traduce función narrativa a decisiones de cámara, performance, luz y sonido. Debe poder utilizarse en set como checklist.

QUÉ NO ES
No es un moodboard, no cambia el guion, no inventa locación/equipo disponible, no pide movimiento gratuito para “hacerlo cinematográfico”, no fuerza profundidad de campo extrema, no sacrifica legibilidad por estética y no convierte un source real en una recreación ambigua.

DECISIONES DE CÁMARA Y BLOQUEO
Define shot size, camera height, apparent focal behavior, camera-to-subject distance, eyeline, headroom, negative space, body/hands, blocking, camera movement, stabilization, foreground/midground/background y transición hacia la toma siguiente. Explica la función de cada decisión. Si un plano fijo funciona mejor, indícalo explícitamente.

LUZ, MATERIAL Y EXPOSICIÓN
Define practical lights, key/fill/rim behavior, direction, softness, falloff, contrast ratio aproximado cuando sea útil, skin/material texture, highlights, black level y control de reflejos. Evita piel encerada, sharpening agresivo, bloom gratuito y grados teal-orange arbitrarios. La imagen debe sentirse capturada por una producción real: materiales coherentes, textura natural, separación de planos y exposición defendible.

PERFORMANCE Y AUDIO
Indica energía, velocidad, intención, respiración, pausas, palabras a enfatizar, comportamiento de manos y mirada. El audio hablado tiene prioridad. Define microfonía/ambiente solo como criterio funcional, sin inventar hardware disponible. Si existe música o SFX, deben subordinarse a inteligibilidad.

CONTINUIDAD
Especifica qué elementos no deben cambiar entre takes: vestuario, posición corporal, dirección de mirada, framing, background, temperatura de luz, props y orientación espacial. Si esta unidad conecta con otra, describe match/action o corte recomendado.

VERSIÓN SIMPLE
Diseña una toma robusta que pueda lograrse con pocos recursos y que siga cumpliendo la intención editorial.

VERSIÓN AVANZADA
Propón una mejora cinematográfica solo si añade claridad, profundidad, emoción o continuidad. Explica exactamente qué aporta y qué riesgo introduce.

NEGATIVOS
No cheap-AI look, no plastic skin, no fake bokeh, no floating UI sin función, no motion ornamental, no cámara imposible, no iluminación incoherente, no manos/anatomía alteradas, no re-render del speaker cuando el source real es obligatorio.

SALIDA EXACTA
Devuelve JSON con unitId, sourceMode, narrativeFunction, shotSize, cameraHeight, lensBehavior, cameraDistance, eyeline, composition, negativeSpace, bodyHands, blocking, cameraMovement, stabilization, foreground, background, lighting{practicals,key,fill,rim,direction,softness,falloff,contrast}, exposure, materialTexture, audio, performance{energy,speed,pauses,emphasis,gaze,hands}, rhythm, continuityRules[], transitionIn, transitionOut, simpleTake, advancedTake, advancedTakeBenefit, sourceReadOnly, negatives[], assumptions[], blockers[], warnings[] y qa.

QA
Antes de devolver el resultado verifica: 1) que las instrucciones pueden ejecutarse físicamente; 2) que ninguna decisión visual contradice el texto o la función narrativa; 3) que la versión avanzada aporta una mejora concreta; 4) que sourceReadOnly=true cuando se usa footage existente; 5) que no inventaste equipo, locación ni evidencia; 6) que piel, materiales y luz son plausibles; 7) que audio y discurso siguen siendo prioridad; 8) que continuidad entre takes está definida; 9) que el resultado mantiene el Brand Core de ${client.name}; 10) que otra persona podría grabarlo sin pedir contexto adicional.`;
  };
})();
