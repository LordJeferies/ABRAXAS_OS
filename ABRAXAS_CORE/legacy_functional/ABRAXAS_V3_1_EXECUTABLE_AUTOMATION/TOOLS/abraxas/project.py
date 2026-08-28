from __future__ import annotations
from pathlib import Path
from .core import read_json

def make_project_config(project_id,content_html,intro_html,vertical_master,horizontal_master,output_root):
    return {
      'schema_version':'abraxas.executable.project.v3.1','project_id':project_id,'output_version':'V3_1','preserve_legacy':True,
      'inputs':{'content_html':str(Path(content_html).expanduser()),'intro_html':str(Path(intro_html).expanduser()),'vertical_master':str(Path(vertical_master).expanduser()),'horizontal_master':str(Path(horizontal_master).expanduser()),'transcript':'','legacy_root':''},
      'output_root':str(Path(output_root).expanduser()),
      'source_policy':{'vertical_burned_subtitles':False,'horizontal_burned_subtitles':False,'microtrim_source':'vertical'},
      'render':{'ffmpeg':'/opt/homebrew/bin/ffmpeg','ffprobe':'/opt/homebrew/bin/ffprobe','encoder':'h264_videotoolbox','bitrate':'40M','maxrate':'48M','bufsize':'80M','audio_bitrate':'192k','hardware_decode':True,'hardware_encode_slots':1},
      'mlx':{'enabled':True,'python':'python3','turbo_model':'','large_model':'','language':'es','min_score':0.72,'max_delta':0.45},
      'overrides':{'content_overrides':{},'manual_microtrims':{}},
      'workers':{'A':{'intros':['INTRO_G01','INTRO_G03','INTRO_M02'],'content_engine':['horizontals','potentials']},'B':{'intros':['INTRO_G02','INTRO_M01','INTRO_M03'],'content_engine':['verticals']}}
    }

def load_project(path):
    obj=read_json(path)
    if not obj: raise FileNotFoundError(path)
    return obj
