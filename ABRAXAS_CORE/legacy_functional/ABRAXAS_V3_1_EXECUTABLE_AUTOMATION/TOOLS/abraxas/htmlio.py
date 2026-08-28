from __future__ import annotations
import hashlib, html as htmlmod, json, re
from pathlib import Path


def extract_editorial_data(path):
    p=Path(path); raw=p.read_text(encoding='utf-8',errors='replace')
    m=re.search(r'<script[^>]+id=["\']editorialData["\'][^>]*>(.*?)</script>',raw,re.I|re.S)
    if not m: raise ValueError(f'editorialData not found in {p}')
    data=json.loads(htmlmod.unescape(m.group(1).strip()))
    return data


def compile_html_pair(content_html,intro_html):
    content=extract_editorial_data(content_html); intro=extract_editorial_data(intro_html)
    if content.get('document_type')!='CONTENT_ENGINE_V3_1': raise ValueError('Content HTML is not CONTENT_ENGINE_V3_1')
    if intro.get('document_type')!='INTRO_LAB_V3_1': raise ValueError('Intro HTML is not INTRO_LAB_V3_1')
    if content.get('episode',{}).get('title') != intro.get('episode',{}).get('title'):
        raise ValueError('Content and Intro HTML episode titles do not match')
    return {'schema_version':'abraxas.executable.bundle.v3.1','content':content,'intro':intro}
