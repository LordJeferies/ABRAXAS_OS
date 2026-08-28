from pathlib import Path
import base64,json
ROOT=Path(__file__).resolve().parents[1]
VERSION='1.2'
MODULES=['quality-packs.js','store.js','domain.js','components.js','actions.js','shell.js','dashboard.js','production.js','studio.js','calendar.js','architect.js','brain.js','product-story.js','factory.js','shim.js','library.js','assets.js','airesults.js','clients.js','branding.js','guide.js','roadmap.js','technique-registry.js','techniques.js']
css=(ROOT/'src/v120/styles.css').read_text(encoding='utf-8');core=(ROOT/'src/core.js').read_text(encoding='utf-8');data=(ROOT/'src/data.js').read_text(encoding='utf-8');mods=[(ROOT/'src/v120'/n).read_text(encoding='utf-8') for n in MODULES];app=(ROOT/'src/app.js').read_text(encoding='utf-8')
def uri(path): return 'data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode('ascii')
assets={'abraxasAppIcon':uri(ROOT/'assets/branding/abraxas_app_icon_v100.png'),'architectAppIcon':uri(ROOT/'assets/branding/el_arquitecto_app_icon_v100.png')}
parts=[f'const ABRAXAS_ASSETS={json.dumps(assets)};',core,data,*mods,app]
html='<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#08080a"><meta name="description" content="ABRAXAS v1.2 · Creative Operations System · Product Recovery"><title>ABRAXAS v1.2</title><style>'+css+'</style></head><body><div id="app" aria-live="polite"></div>'+''.join('<script>'+x+'</script>' for x in parts)+'</body></html>'
out=ROOT/f'ABRAXAS_Universal_Content_Operations_A_v{VERSION}.html';out.write_text(html,encoding='utf-8');(ROOT/'deliverables').mkdir(exist_ok=True);(ROOT/f'deliverables/ABRAXAS_v{VERSION}.html').write_text(html,encoding='utf-8');print(out);print('bytes',out.stat().st_size)
