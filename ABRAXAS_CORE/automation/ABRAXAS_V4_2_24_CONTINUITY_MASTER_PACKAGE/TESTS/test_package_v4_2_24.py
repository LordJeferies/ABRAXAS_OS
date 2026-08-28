from __future__ import annotations

import hashlib
import html as htmlmod
import json
import re
import sys
import unittest
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "ENGINE"))
from ai_motion_engine_v4_2_24 import HORIZONTAL_IDS, VERTICAL_IDS, VERTICAL_ROLES, clock_minute_density_ok, extract_editorial_data, validate_map


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


if __name__ == "__main__":
    unittest.main()

