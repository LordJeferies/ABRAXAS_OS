#!/usr/bin/env python3
import argparse,pathlib,shutil,zipfile,hashlib,json
ROOT=pathlib.Path(__file__).resolve().parents[1]
VERSION='1.2'; NAME=f'ABRAXAS_Universal_Content_Operations_A_v{VERSION}'
def sha256(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--output-dir',default='/mnt/data');args=ap.parse_args();out=pathlib.Path(args.output_dir);out.mkdir(parents=True,exist_ok=True)
 html_src=ROOT/f'{NAME}.html'; client_src=ROOT/f'ABRAXAS_Client_Intelligence_v{VERSION}.html'; web_dir=ROOT/f'web_build_v{VERSION}'
 if not html_src.exists():raise SystemExit('Run scripts/build.py first')
 if not client_src.exists():raise SystemExit('Run scripts/build_client_intelligence.py first')
 if not web_dir.exists():raise SystemExit('Run scripts/build_web.py first')
 html_ext=out/html_src.name;client_ext=out/client_src.name;handoff_ext=out/f'ABRAXAS_v{VERSION}_HANDOFF_PROMPT.txt'
 shutil.copy2(html_src,html_ext);shutil.copy2(client_src,client_ext);shutil.copy2(ROOT/f'continuity/ABRAXAS_v{VERSION}_HANDOFF_PROMPT.txt',handoff_ext)
 staging=out/f'{NAME}_FULL_RELEASE';shutil.rmtree(staging,ignore_errors=True);staging.mkdir()
 for fn in ['START_HERE.md','SUBIR_A_UNA_IA_Y_CONTINUAR.md','BUILD_CHECKPOINT.json','RELEASE_MANIFEST.json']:
  if (ROOT/fn).exists():shutil.copy2(ROOT/fn,staging/fn)
 for d in ['src','docs','continuity','json','prompts','reports','scripts','tests','references','deliverables','assets','automation_bridge',f'web_build_v{VERSION}']:
  src=ROOT/d
  if src.exists():shutil.copytree(src,staging/d,ignore=shutil.ignore_patterns('__pycache__','*.pyc','.DS_Store','.git'))
 (staging/'deliverables').mkdir(exist_ok=True);shutil.copy2(html_src,staging/'deliverables'/html_src.name);shutil.copy2(client_src,staging/'deliverables'/client_src.name)
 rows=[]
 for p in sorted(staging.rglob('*')):
  if p.is_file() and p.name!='CHECKSUMS_SHA256.txt':rows.append(f'{sha256(p)}  {p.relative_to(staging).as_posix()}')
 (staging/'CHECKSUMS_SHA256.txt').write_text('\n'.join(rows)+'\n',encoding='utf-8')
 web_zip=out/f'ABRAXAS_Universal_Content_Operations_WEB_v{VERSION}.zip';web_zip.unlink(missing_ok=True)
 with zipfile.ZipFile(web_zip,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(web_dir.rglob('*')):
   if p.is_file():z.write(p,arcname=f'ABRAXAS_Universal_Content_Operations_WEB_v{VERSION}/{p.relative_to(web_dir).as_posix()}')
 zip_path=out/f'{NAME}_FULL_RELEASE.zip';zip_path.unlink(missing_ok=True)
 with zipfile.ZipFile(zip_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(staging.rglob('*')):
   if p.is_file():z.write(p,arcname=f'{staging.name}/{p.relative_to(staging).as_posix()}')
 result={'html':str(html_ext),'fullRelease':str(zip_path),'webBuild':str(web_zip),'clientIntelligence':str(client_ext),'handoff':str(handoff_ext),'html_sha256':sha256(html_ext),'zip_sha256':sha256(zip_path),'web_zip_sha256':sha256(web_zip),'client_sha256':sha256(client_ext),'files':sum(1 for p in staging.rglob('*') if p.is_file())}
 print(json.dumps(result,indent=2))
if __name__=='__main__':main()
