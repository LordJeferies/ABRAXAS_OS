from __future__ import annotations

def verify_content_contract(item,kind):
    d=float(item.get('duration_seconds') or 0)
    if kind=='vertical' and not 50<=d<=90: return {'status':'BLOCKED','reason':f'vertical duration {d:.3f}s outside 50–90s'}
    if kind=='horizontal' and not 480<=d<=720: return {'status':'BLOCKED','reason':f'horizontal duration {d:.3f}s outside 480–720s'}
    if kind=='intro' and not 50<=d<=80: return {'status':'BLOCKED','reason':f'intro duration {d:.3f}s outside 50–80s'}
    return {'status':'PASS','reason':''}


def verify_render_artifact(render_status,path):
    from pathlib import Path
    p=Path(path)
    status=str(render_status or '').upper()
    if status=='DRY_RUN':
        return {'status':'BLOCKED','reason':'dry-run is not a final rendered artifact'}
    if status!='PASS':
        return {'status':'BLOCKED','reason':f'render stage is {status or "NOT_RENDERED"}'}
    if not p.is_file():
        return {'status':'BLOCKED','reason':f'missing rendered output: {p}'}
    if p.stat().st_size<=0:
        return {'status':'BLOCKED','reason':f'empty rendered output: {p}'}
    return {'status':'PASS','reason':''}
