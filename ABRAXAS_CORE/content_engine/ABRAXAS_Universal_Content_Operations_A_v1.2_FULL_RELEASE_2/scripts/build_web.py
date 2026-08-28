from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parents[1];VERSION='1.2';WEB=ROOT/f'web_build_v{VERSION}'
shutil.rmtree(WEB,ignore_errors=True);(WEB/'assets').mkdir(parents=True)
for name in ['core.js','data.js','app.js']:shutil.copy2(ROOT/'src'/name,WEB/name)
shutil.copy2(ROOT/'src/v120/styles.css',WEB/'styles.css')
modules=['quality-packs.js','store.js','domain.js','components.js','actions.js','shell.js','dashboard.js','production.js','studio.js','calendar.js','architect.js','brain.js','product-story.js','factory.js','shim.js','library.js','assets.js','airesults.js','clients.js','branding.js','guide.js','roadmap.js','technique-registry.js','techniques.js']
(WEB/'v120').mkdir();
for n in modules:shutil.copy2(ROOT/'src/v120'/n,WEB/'v120'/n)
for n in ['abraxas_app_icon_v100.png','el_arquitecto_app_icon_v100.png']:shutil.copy2(ROOT/'assets/branding'/n,WEB/'assets'/n)
(WEB/'assets.js').write_text("const ABRAXAS_ASSETS={abraxasAppIcon:'assets/abraxas_app_icon_v100.png',architectAppIcon:'assets/el_arquitecto_app_icon_v100.png'};",encoding='utf-8')
scripts=['assets.js','core.js','data.js']+[f'v120/{n}' for n in modules]+['app.js']
html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08080a"><meta name="color-scheme" content="dark"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="styles.css"><title>ABRAXAS v1.2</title></head><body><div id="app" aria-live="polite"></div>'+''.join(f'<script src="{s}"></script>' for s in scripts)+"<script>if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});</script></body></html>"
(WEB/'index.html').write_text(html,encoding='utf-8');(WEB/'404.html').write_text(html,encoding='utf-8');(WEB/'.nojekyll').write_text('',encoding='utf-8')
manifest={'name':'ABRAXAS Creative Operations System','short_name':'ABRAXAS','start_url':'./','display':'standalone','background_color':'#08080a','theme_color':'#08080a','icons':[{'src':'assets/abraxas_app_icon_v100.png','sizes':'1024x1024','type':'image/png'}]};(WEB/'manifest.webmanifest').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
files=['./','./index.html','./styles.css']+['./'+s for s in scripts]+['./manifest.webmanifest'];(WEB/'sw.js').write_text("const CACHE='abraxas-v1.2';const FILES="+json.dumps(files)+";self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });",encoding='utf-8');print(WEB/'index.html')
