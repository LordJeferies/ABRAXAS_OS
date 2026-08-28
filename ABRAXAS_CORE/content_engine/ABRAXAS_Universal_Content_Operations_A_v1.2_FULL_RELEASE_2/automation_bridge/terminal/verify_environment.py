#!/usr/bin/env python3
"""Verify ABRAXAS Shim terminal automation prerequisites without modifying source media."""
from __future__ import annotations
import argparse, json, shutil, subprocess, sys
from pathlib import Path

def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument('manifest', nargs='?', default='SHIM_CONFIRMED_MANIFEST.json')
    ns=ap.parse_args()
    errors=[]
    for exe in ('ffmpeg','ffprobe'):
        path=shutil.which(exe)
        if not path: errors.append(f'{exe} not found in PATH')
        else: print(f'OK {exe}: {path}')
    mp=Path(ns.manifest).expanduser().resolve()
    if not mp.exists(): errors.append(f'manifest missing: {mp}')
    else:
        try: data=json.loads(mp.read_text(encoding='utf-8'))
        except Exception as e: errors.append(f'invalid JSON: {e}'); data={}
        if data:
            if data.get('manifestType')!='SHIM_CONFIRMED_MANIFEST': errors.append('manifestType must be SHIM_CONFIRMED_MANIFEST')
            if data.get('sourceReadOnly') is not True: errors.append('sourceReadOnly must be true')
            src=Path(data.get('sourceVideo','')).expanduser()
            if not src.is_absolute(): src=(mp.parent/src).resolve()
            if not src.exists(): errors.append(f'source video missing: {src}')
            else:
                print(f'OK source READ ONLY: {src}')
                try:
                    probe=subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(src)],text=True).strip()
                    print(f'OK source duration: {probe}s')
                except Exception as e: errors.append(f'ffprobe failed: {e}')
            vids=data.get('confirmedVideos',[])
            print(f'Confirmed videos: {len(vids)}')
            if any(v.get('selectionStatus','CONFIRMADO')!='CONFIRMADO' for v in vids): errors.append('confirmedVideos contains non-CONFIRMADO item')
    if errors:
        print('\nFAILED')
        for e in errors: print(' -',e)
        return 2
    print('\nABRAXAS environment verification PASS')
    return 0
if __name__=='__main__': raise SystemExit(main())
