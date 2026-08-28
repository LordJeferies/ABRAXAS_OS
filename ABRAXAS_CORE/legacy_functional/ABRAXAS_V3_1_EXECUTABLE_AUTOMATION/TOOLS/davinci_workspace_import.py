# ABRAXAS V3.1 · DaVinci Resolve Workspace Console importer
# Designed for the Py3 console. No flush=True. No undocumented subtitle mutation.
import json, os
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / 'DAVINCI_HANDOFF.json'


def log(*args):
    try: print(*args)
    except Exception: pass


def get_resolve():
    r = globals().get('resolve')
    if r is not None:
        return r
    b = globals().get('bmd')
    if b is not None and hasattr(b, 'scriptapp'):
        return b.scriptapp('Resolve')
    raise RuntimeError('No se encontró objeto resolve/bmd en Workspace Console.')


def existing_timeline_names(project):
    names=set()
    try:
        for i in range(1, int(project.GetTimelineCount())+1):
            tl=project.GetTimelineByIndex(i)
            if tl: names.add(tl.GetName())
    except Exception: pass
    return names


def import_items(media_pool, paths):
    items=[]
    for p in paths:
        if not Path(p).is_file():
            raise FileNotFoundError(p)
        result = media_pool.ImportMedia([str(p)])
        if not result:
            raise RuntimeError('ImportMedia no devolvió media item: '+str(p))
        if isinstance(result, list): items.extend(result)
        else: items.append(result)
    return items


def set_orientation(timeline, orientation):
    if not hasattr(timeline,'SetSetting'): return
    try:
        if orientation == 'VERTICAL':
            timeline.SetSetting('timelineResolutionWidth','1080')
            timeline.SetSetting('timelineResolutionHeight','1920')
        elif orientation == 'HORIZONTAL':
            timeline.SetSetting('timelineResolutionWidth','1920')
            timeline.SetSetting('timelineResolutionHeight','1080')
    except Exception as e:
        log('WARNING · timeline resolution not changed:',e)


def main():
    if not MANIFEST.is_file(): raise FileNotFoundError(MANIFEST)
    data=json.loads(MANIFEST.read_text(encoding='utf-8'))
    resolve_obj=get_resolve()
    pm=resolve_obj.GetProjectManager()
    project=pm.GetCurrentProject()
    if not project:
        raise RuntimeError('Abra o cree un proyecto DaVinci antes de ejecutar el importador.')
    media_pool=project.GetMediaPool()
    root=media_pool.GetRootFolder()
    # Create/use a dedicated bin.
    folder=None
    try:
        for f in root.GetSubFolderList() or []:
            if f.GetName()=='ABRAXAS_V3_1': folder=f; break
    except Exception: pass
    if folder is None:
        folder=media_pool.AddSubFolder(root,'ABRAXAS_V3_1')
    if folder: media_pool.SetCurrentFolder(folder)

    names=existing_timeline_names(project)
    created=0; skipped=0
    for spec in data.get('resolved_timelines',[]):
        name=spec['timeline_name']
        if name in names:
            log('SKIP · timeline existe:',name); skipped+=1; continue
        paths=spec.get('media_paths',[])
        if not paths:
            log('SKIP · sin media:',name); skipped+=1; continue
        log('CREATE ·',name,'·',len(paths),'media items')
        items=import_items(media_pool,paths)
        timeline=media_pool.CreateEmptyTimeline(name)
        if not timeline: raise RuntimeError('No se pudo crear timeline '+name)
        set_orientation(timeline,spec.get('orientation',''))
        ok=media_pool.AppendToTimeline(items)
        if ok is False: raise RuntimeError('AppendToTimeline falló en '+name)
        created+=1; names.add(name)
    try: pm.SaveProject()
    except Exception: pass
    log('ABRAXAS DAVINCI IMPORT COMPLETE · created:',created,'· skipped:',skipped)

main()
