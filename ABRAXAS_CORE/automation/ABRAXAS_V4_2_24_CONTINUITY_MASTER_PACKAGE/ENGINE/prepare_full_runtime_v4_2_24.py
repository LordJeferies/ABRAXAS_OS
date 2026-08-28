#!/usr/bin/env python3
"""Write a machine-local config for the verified V4.2.5 renderer baseline."""

from __future__ import annotations

import argparse
import json
import platform
import shutil
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runtime", required=True)
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--vertical-master", required=True)
    parser.add_argument("--horizontal-master", required=True)
    parser.add_argument("--content-html", required=True)
    parser.add_argument("--intro-html", required=True)
    parser.add_argument("--transcript", required=True)
    args = parser.parse_args()
    runtime = Path(args.runtime).resolve()
    config_path = runtime / "PROJECT" / "project_config.json"
    data = json.loads(config_path.read_text(encoding="utf-8"))
    data["output_version"] = "V4_2_24"
    data["inputs"].update({
        "content_html": str(Path(args.content_html).resolve()),
        "intro_html": str(Path(args.intro_html).resolve()),
        "vertical_master": str(Path(args.vertical_master).resolve()),
        "horizontal_master": str(Path(args.horizontal_master).resolve()),
        "transcript": str(Path(args.transcript).resolve()),
    })
    data["output_root"] = str(Path(args.output_root).resolve())
    ffmpeg = shutil.which("ffmpeg") or data.get("render", {}).get("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
    ffprobe = shutil.which("ffprobe") or data.get("render", {}).get("ffprobe") or "/opt/homebrew/bin/ffprobe"
    data["render"]["ffmpeg"] = ffmpeg
    data["render"]["ffprobe"] = ffprobe
    data["render"]["encoder"] = "h264_videotoolbox" if platform.system() == "Darwin" else "libx264"
    data["render"]["hardware_decode"] = platform.system() == "Darwin"
    data.setdefault("motion", {})["enabled"] = False
    data["motion"]["selection_policy"] = "SUPERSEDED_BY_FINAL_AI_MOTION_MAP_V4_2_24"
    temporary = config_path.with_name(config_path.name + ".partial")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(config_path)
    cli_path = runtime / "TOOLS" / "abraxas" / "cli.py"
    cli_raw = cli_path.read_text(encoding="utf-8")
    legacy = """    if ori == 'vertical':
        results.extend(_render_balanced_fragment_set(cfg,target,total,folder/'FRAGMENTS',f\"{item['content_id']}_{ori.upper()}_SOURCE\",dry_run=dry_run))
    else:
        # Horizontal long-form contract: preserve the assembled video and its
        # coherent source sections. Motion overlays are planned separately and
        # must never cause physical 4–9 second video fragments.
        write_json_atomic(folder/'HORIZONTAL_LONGFORM_POLICY.json',{
            'schema_version':'abraxas.horizontal-longform.v4.2.5',
            'content_id':item['content_id'],
            'complete_video':str(target),
            'coherent_sections':[str(x) for x in files],
            'total_seconds':round(float(total),3),
            'physical_fragments_4_9':False,
            'motion_windows_only':True,
            'maximum_motions_per_rolling_minute':2,
        })
"""
    replacement = """    # V4.2.24: both content families remain complete programs.  Only the
    # semantic AI map may create selected 4–9 second reference windows.
    write_json_atomic(folder/'PROGRAM_PRESERVATION_POLICY_V4_2_24.json',{
        'schema_version':'abraxas.program-preservation.v4.2.24',
        'content_id':item['content_id'],
        'orientation':ori,
        'complete_video':str(target),
        'coherent_sections':[str(x) for x in files],
        'total_seconds':round(float(total),3),
        'physical_fragments_4_9':False,
        'motion_windows_only':True,
        'motion_manifest':'FINAL_AI_MOTION_MAP_V4_2_24.json',
    })
"""
    if legacy in cli_raw:
        backup = cli_path.with_name("cli.v4_2_5_original.py")
        if not backup.exists():
            shutil.copy2(cli_path, backup)
        cli_path.write_text(cli_raw.replace(legacy, replacement), encoding="utf-8")
    elif "PROGRAM_PRESERVATION_POLICY_V4_2_24" not in cli_raw:
        raise RuntimeError("No se pudo aplicar el contrato no-fragmentación al renderer V4.2.5")
    print(config_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
