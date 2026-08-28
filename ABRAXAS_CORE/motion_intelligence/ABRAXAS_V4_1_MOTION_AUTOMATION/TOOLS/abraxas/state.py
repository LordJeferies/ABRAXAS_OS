from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path
from .core import read_json, write_json_atomic

class StateStore:
    def __init__(self,root): self.root=Path(root); self.root.mkdir(parents=True,exist_ok=True)
    def _path(self,content_id,stage): return self.root/f'{content_id}__{stage}.json'
    def get(self,content_id,stage): return read_json(self._path(content_id,stage),{}) or {}
    def set(self,content_id,stage,status,**extra):
        obj={'content_id':content_id,'stage':stage,'status':status,'updated_at':datetime.now(timezone.utc).isoformat(),**extra}
        write_json_atomic(self._path(content_id,stage),obj); return obj
    def pass_stage(self,content_id,stage,**extra): return self.set(content_id,stage,'PASS',**extra)
    def block(self,content_id,stage,reason,**extra): return self.set(content_id,stage,'BLOCKED',reason=reason,**extra)
    def fail(self,content_id,stage,reason,**extra): return self.set(content_id,stage,'FAIL',reason=reason,**extra)
