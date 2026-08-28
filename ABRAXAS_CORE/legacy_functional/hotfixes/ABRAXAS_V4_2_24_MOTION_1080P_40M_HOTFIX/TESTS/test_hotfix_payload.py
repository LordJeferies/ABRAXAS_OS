from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "PAYLOAD/ENGINE"))
from ai_motion_engine_v4_2_24 import MOTION_REFERENCE_PROFILE, reference_command


class Motion1080HotfixTests(unittest.TestCase):
    def command(self, width: int, height: int) -> str:
        return " ".join(reference_command(
            "ffmpeg",
            Path("master.mp4"),
            {"source_start": "00:00:01.000", "duration_seconds": 9.0},
            Path("SOURCE_REFERENCE.partial.mp4"),
            Path("SOURCE_REFERENCE.progress.txt"),
            hwdecode=True,
            width=width,
            height=height,
        ))

    def test_profile_is_1080p_40m(self):
        self.assertEqual(MOTION_REFERENCE_PROFILE, "APPLE_VT_H264_1080P_40M_V1")

    def test_vertical_command(self):
        command = self.command(1080, 1920)
        self.assertIn("scale=1080:1920", command)
        self.assertIn("-c:v h264_videotoolbox", command)
        self.assertIn("-b:v 40M -maxrate 48M -bufsize 80M", command)

    def test_horizontal_command(self):
        command = self.command(1920, 1080)
        self.assertIn("scale=1920:1080", command)
        self.assertIn("-c:a aac -b:a 192k -ar 48000 -ac 2", command)

    def test_monitor_rejects_old_profile(self):
        monitor = (ROOT / "PAYLOAD/ENGINE/monitor_apple40m_v4_2_24.py").read_text(encoding="utf-8")
        self.assertIn("APPLE_VT_H264_1080P_40M_V1", monitor)
        self.assertIn("REF1080", monitor)

    def test_full_program_policy_is_preserved(self):
        engine = (ROOT / "PAYLOAD/ENGINE/ai_motion_engine_v4_2_24.py").read_text(encoding="utf-8")
        self.assertIn('"full_program_resolution_policy"] = "PRESERVE_SOURCE_RESOLUTION"', engine)
        self.assertNotIn('"full_program_resolution_policy"] = "1080P"', engine)


if __name__ == "__main__":
    unittest.main()

