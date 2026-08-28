# ABRAXAS V4.1 · DaVinci Resolve Workspace Console conformer
# Run in DaVinci Resolve Studio: Workspace > Console > Py3.
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "DAVINCI_HANDOFF.json"
TRACK_INDEX = {"V1": 1, "V2": 2, "V3": 3, "V4": 4}
MARKER_COLOR = {"M1": "Blue", "M2": "Purple", "M3": "Red", "M4": "Cyan", "M5": "Yellow", "M6": "Green"}


def log(*args):
    try:
        print(*args)
    except Exception:
        pass


def get_resolve():
    obj = globals().get("resolve")
    if obj is not None:
        return obj
    bmd_obj = globals().get("bmd")
    if bmd_obj is not None and hasattr(bmd_obj, "scriptapp"):
        return bmd_obj.scriptapp("Resolve")
    raise RuntimeError("No se encontró resolve/bmd. Ejecute dentro de Workspace > Console > Py3.")


def timeline_names(project):
    names = set()
    for index in range(1, int(project.GetTimelineCount() or 0) + 1):
        timeline = project.GetTimelineByIndex(index)
        if timeline:
            names.add(timeline.GetName())
    return names


def get_or_create_bin(media_pool, root, name):
    try:
        for folder in root.GetSubFolderList() or []:
            if folder.GetName() == name:
                return folder
    except Exception:
        pass
    return media_pool.AddSubFolder(root, name)


def import_one(media_pool, path):
    path = Path(path)
    if not path.is_file():
        return None
    imported = media_pool.ImportMedia([str(path)])
    if isinstance(imported, list):
        return imported[0] if imported else None
    return imported


def import_many(media_pool, paths):
    result = []
    for path in paths:
        item = import_one(media_pool, path)
        if item is None:
            raise FileNotFoundError(str(path))
        result.append(item)
    return result


def set_orientation(timeline, orientation):
    if not hasattr(timeline, "SetSetting"):
        return
    width, height = (1080, 1920) if orientation == "VERTICAL" else (1920, 1080)
    for key, value in (
        ("timelineResolutionWidth", str(width)),
        ("timelineResolutionHeight", str(height)),
        ("timelineFrameRate", "30"),
        ("timelinePlaybackFrameRate", "30"),
    ):
        try:
            timeline.SetSetting(key, value)
        except Exception as exc:
            log("WARNING · setting", key, exc)


def ensure_video_tracks(timeline, count):
    try:
        current = int(timeline.GetTrackCount("video") or 0)
    except Exception:
        current = 1
    while current < count:
        if not timeline.AddTrack("video"):
            break
        current += 1


def marker_note(placement):
    fields = [
        "ABRAXAS V4.1 MOTION SLOT",
        "BEAT_ID: " + str(placement.get("beat_id", "")),
        "MOTION: " + str(placement.get("motion_primary", "")) + " · " + str(placement.get("name", "")),
        "MODE: " + str(placement.get("placement_mode", "")),
        "TRACK: " + str(placement.get("track", "")),
        "TIMELINE: " + str(placement.get("timeline_in")) + " → " + str(placement.get("timeline_out")),
        "TRANSCRIPCIÓN: " + str(placement.get("transcript_exact", "")),
        "ASSET STATUS: " + str(placement.get("asset_status", "MISSING_ASSETS")),
        "CARPETA: " + str(placement.get("asset_folder", "")),
        "PROMPT VIDEO: " + str(Path(placement.get("asset_folder", "")) / "PROMPT_ANIMAR_MOTION.txt"),
    ]
    return "\n".join(fields)


def add_motion_marker(timeline, placement, fps):
    frame = max(0, int(round(float(placement.get("timeline_in") or 0) * fps)))
    duration = max(1, int(round(float(placement.get("duration") or 0.1) * fps)))
    name = str(placement.get("motion_primary", "MOTION")) + " · " + str(placement.get("beat_id", ""))
    color = MARKER_COLOR.get(placement.get("motion_primary"), "Blue")
    try:
        return timeline.AddMarker(frame, color, name, marker_note(placement), duration, str(placement.get("beat_id", "")))
    except Exception as exc:
        log("WARNING · marker falló:", placement.get("beat_id"), exc)
        return False


def media_frame_count(item, fallback):
    try:
        props = item.GetClipProperty() or {}
        raw = props.get("Frames") or props.get("Frame Count")
        if raw is not None:
            return max(1, int(float(str(raw).replace(",", ""))))
    except Exception:
        pass
    return max(1, int(fallback))


def append_motion(media_pool, timeline, placement, fps):
    path = placement.get("selected_motion_path")
    if not path or not Path(path).is_file():
        return "MARKER_ONLY"
    item = import_one(media_pool, path)
    if item is None:
        return "IMPORT_FAILED"
    track = TRACK_INDEX.get(placement.get("track"), 2)
    ensure_video_tracks(timeline, track)
    wanted = max(1, int(round(float(placement.get("duration") or 0.1) * fps)))
    available = media_frame_count(item, wanted)
    count = min(wanted, available)
    record = int(timeline.GetStartFrame() or 0) + max(0, int(round(float(placement.get("timeline_in") or 0) * fps)))
    clip_info = {
        "mediaPoolItem": item,
        "startFrame": 0,
        "endFrame": count - 1,
        "recordFrame": record,
        "mediaType": 1,
        "trackIndex": track,
    }
    try:
        result = media_pool.AppendToTimeline([clip_info])
        return "APPENDED" if result is not False else "APPEND_FAILED"
    except Exception as exc:
        log("WARNING · append motion falló:", placement.get("beat_id"), exc)
        return "APPEND_FAILED"


def main():
    if not MANIFEST.is_file():
        raise FileNotFoundError(str(MANIFEST))
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    fps = int(data.get("fps") or 30)
    resolve_obj = get_resolve()
    manager = resolve_obj.GetProjectManager()
    project = manager.GetCurrentProject()
    if not project:
        raise RuntimeError("Abra o cree un proyecto DaVinci antes de conformar.")
    media_pool = project.GetMediaPool()
    root = media_pool.GetRootFolder()
    abraxas_bin = get_or_create_bin(media_pool, root, "ABRAXAS_V4_1")
    if abraxas_bin:
        media_pool.SetCurrentFolder(abraxas_bin)

    existing = timeline_names(project)
    created = skipped = appended = markers = 0
    for spec in data.get("resolved_timelines", []):
        name = spec["timeline_name"]
        if name in existing:
            log("SKIP · timeline existente protegida:", name)
            skipped += 1
            continue
        paths = spec.get("media_paths") or []
        if not paths:
            log("SKIP · sin source media:", name)
            skipped += 1
            continue
        source_items = import_many(media_pool, paths)
        timeline = media_pool.CreateEmptyTimeline(name)
        if not timeline:
            raise RuntimeError("No se pudo crear timeline " + name)
        try:
            project.SetCurrentTimeline(timeline)
        except Exception:
            pass
        set_orientation(timeline, spec.get("orientation", ""))
        if media_pool.AppendToTimeline(source_items) is False:
            raise RuntimeError("No se pudo colocar source media en " + name)
        ensure_video_tracks(timeline, 5)
        for placement in spec.get("motion_placements") or []:
            if placement.get("motion_primary") == "M0":
                continue
            if add_motion_marker(timeline, placement, fps) is not False:
                markers += 1
            status = append_motion(media_pool, timeline, placement, fps)
            if status == "APPENDED":
                appended += 1
            log(status, "·", placement.get("beat_id"), "·", placement.get("motion_primary"))
        created += 1
        existing.add(name)
        log("CREATED ·", name)
    try:
        manager.SaveProject()
    except Exception:
        pass
    log("ABRAXAS V4.1 COMPLETE · timelines:", created, "· skipped:", skipped, "· motions:", appended, "· markers:", markers)


main()
