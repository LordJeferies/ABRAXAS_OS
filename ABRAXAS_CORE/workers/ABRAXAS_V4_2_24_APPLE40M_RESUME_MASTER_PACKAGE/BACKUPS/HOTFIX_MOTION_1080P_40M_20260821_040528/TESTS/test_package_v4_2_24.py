from __future__ import annotations

import hashlib
import html as htmlmod
import json
import re
import sys
import unittest
import zipfile
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "ENGINE"))
from ai_motion_engine_v4_2_24 import HORIZONTAL_IDS, VERTICAL_IDS, VERTICAL_ROLES, clock_minute_density_ok, extract_editorial_data, reference_command, validate_map


PREBUILT = ROOT / "DELIVERABLES" / "JOC55_ABRAXAS_V4_2_24_PREBUILT"
MANIFEST = PREBUILT / "00_MANIFEST"


class PackageContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mapping = json.loads((MANIFEST / "FINAL_AI_MOTION_MAP_V4_2_24.json").read_text(encoding="utf-8"))

    def test_map_validation_passes(self):
        self.assertEqual(validate_map(self.mapping)["status"], "PASS")

    def test_exact_family_ids_and_counts(self):
        self.assertEqual(list(self.mapping["verticals"]), VERTICAL_IDS)
        self.assertEqual(list(self.mapping["horizontals"]), HORIZONTAL_IDS)
        self.assertEqual(sum(len(x["motions"]) for x in self.mapping["verticals"].values()), 222)
        self.assertEqual(sum(len(x["motions"]) for x in self.mapping["horizontals"].values()), 255)

    def test_vertical_roles_are_exact_and_chronological(self):
        for item in self.mapping["verticals"].values():
            self.assertEqual([x["narrative_role"] for x in item["motions"]], list(VERTICAL_ROLES))
            starts = [x["timeline_in_seconds"] for x in item["motions"]]
            self.assertEqual(starts, sorted(starts))

    def test_all_windows_are_four_to_nine_seconds(self):
        durations = [
            x["duration_seconds"]
            for family in ("verticals", "horizontals")
            for item in self.mapping[family].values()
            for x in item["motions"]
        ]
        self.assertTrue(durations)
        self.assertGreaterEqual(min(durations), 4.0)
        self.assertLessEqual(max(durations), 9.0)

    def test_horizontal_longform_and_density(self):
        for item in self.mapping["horizontals"].values():
            self.assertTrue(480 <= item["effective_duration_seconds"] <= 720)
            self.assertTrue(clock_minute_density_ok([x["timeline_in_seconds"] for x in item["motions"]]))
            self.assertLessEqual(abs(item["selected_motion_count"] - item["target_motion_count"]), 1)

    def test_motion_system_v7_contracts_are_present(self):
        motions = [x for family in ("verticals", "horizontals") for item in self.mapping[family].values() for x in item["motions"]]
        self.assertEqual(set(Counter(x["motion_primary"] for x in motions)), {"M1", "M2", "M3", "M4", "M5", "M6"})
        for motion in motions:
            self.assertEqual(motion["motion_system_version"], "V7")
            self.assertTrue(motion["asset_contract"]["asset_files"])

    def test_selected_tree_matches_map(self):
        tree = PREBUILT / "09_MOTIONS_V4_2" / "AI_SELECTED_V4_2_24"
        decisions = list(tree.glob("0[34]_*/*/[0-9][0-9]_*/MOTION_DECISION.json"))
        self.assertEqual(len(decisions), 477)
        self.assertFalse(any(path.name == "FRAGMENTS" for path in tree.rglob("*")))

    def test_motion2_exact_segments_reconstruct_text(self):
        files = list((PREBUILT / "09_MOTIONS_V4_2" / "AI_SELECTED_V4_2_24").rglob("MOTION2_TEXT_SEGMENTS_EXACT.json"))
        self.assertTrue(files)
        for path in files:
            value = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(value["source_text"], value["reconstructed_text"])

    def test_content_html_embeds_same_motion_counts(self):
        _, data, _ = extract_editorial_data(ROOT / "HTML" / "JOC55_AMANDA_CONTENT_ENGINE_V4_2_24.html")
        embedded = data["ai_motion_map_v4_2_24"]
        self.assertEqual(embedded["summary"]["vertical_motions"], 222)
        self.assertEqual(embedded["summary"]["horizontal_motions"], 255)
        self.assertEqual(data["hard_gates"]["fixed_time_slicing"], "PROHIBITED")

    def test_intro_core_is_protected(self):
        report = json.loads((MANIFEST / "INTRO_LAB_PROTECTION_REPORT_V4_2_24.json").read_text(encoding="utf-8"))
        self.assertTrue(report["editorial_core_unchanged"])
        self.assertEqual(report["route_count"], 6)

    def test_transcript_reference_is_lossless_and_not_a_queue(self):
        qa = json.loads((ROOT / "REFERENCIA" / "TRANSCRIPCION_COMPLETA_DIVIDIDA_HASTA_9S_QA_V4_2_24.json").read_text(encoding="utf-8"))
        text = (ROOT / "REFERENCIA" / "TRANSCRIPCION_COMPLETA_DIVIDIDA_HASTA_9S_V4_2_24.txt").read_text(encoding="utf-8")
        self.assertEqual(qa["status"], "PASS")
        self.assertEqual(qa["source_cues"], 953)
        self.assertTrue(qa["lossless_normalized_token_sequence"])
        self.assertLessEqual(qa["maximum_window_seconds"], 9.0)
        self.assertIn("PROHIBIDO interpretar este documento como cola de render", text)

    def test_recursive_zip_audit_is_present(self):
        audit = json.loads((ROOT / "AUDIT" / "RECURSIVE_ZIP_INVENTORY.json").read_text(encoding="utf-8"))
        self.assertEqual(audit["unique_archives"], 42)

    def test_reference_renderer_is_exact_apple40m(self):
        command = reference_command(
            "ffmpeg",
            Path("master.mp4"),
            {"source_start": "00:00:01.000", "duration_seconds": 9.0},
            Path("SOURCE_REFERENCE.partial.mp4"),
            Path("SOURCE_REFERENCE.progress.txt"),
            hwdecode=True,
        )
        joined = " ".join(command)
        for required in (
            "-hwaccel videotoolbox",
            "-c:v h264_videotoolbox",
            "-profile:v high",
            "-b:v 40M",
            "-maxrate 48M",
            "-bufsize 80M",
            "-pix_fmt yuv420p",
            "-c:a aac -b:a 192k -ar 48000 -ac 2",
            "-progress SOURCE_REFERENCE.progress.txt",
            "SOURCE_REFERENCE.partial.mp4",
        ):
            self.assertIn(required, joined)
        self.assertNotIn("libx264", joined)
        self.assertNotIn("-crf", joined)

    def test_full_runtime_patch_preserves_40m_and_telemetry(self):
        baseline = ROOT / "AUTOMATION/ABRAXAS_V4_2_5_EXECUTABLE_BASELINE_VERIFIED.zip"
        member = "v42/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION/TOOLS/abraxas/render.py"
        with zipfile.ZipFile(baseline) as archive:
            renderer = archive.read(member).decode("utf-8")
        for value in ("h264_videotoolbox", "'40M'", "'48M'", "'80M'", "'192k'", "'+faststart'"):
            self.assertIn(value, renderer)
        patcher = (ROOT / "ENGINE/prepare_full_runtime_v4_2_24.py").read_text(encoding="utf-8")
        self.assertIn("'-progress'", patcher)
        self.assertIn("encode_timeout_seconds", patcher)
        self.assertIn("PROGRAM_PRESERVATION_POLICY_V4_2_24", patcher)

    def test_playbook_and_live_monitor_are_bundled(self):
        playbook = ROOT / "INPUT/VIDEO_CONTENT_AUTOMATION_PLAYBOOK_V5_HTML_DRIVEN_APPLE40M_COOL.zip"
        self.assertEqual(
            hashlib.sha256(playbook.read_bytes()).hexdigest(),
            "e54f8dbf4622abcc51f38bef35b2805bda52fd6564fee399d88d8f841d477cc5",
        )
        monitor = (ROOT / "ENGINE/monitor_apple40m_v4_2_24.py").read_text(encoding="utf-8")
        self.assertIn("out_time_us", monitor)
        self.assertIn("SOURCE_REFERENCE.APPLE40M.json", monitor)
        self.assertIn("El porcentaje del archivo activo viene de FFmpeg", monitor)


if __name__ == "__main__":
    unittest.main()
