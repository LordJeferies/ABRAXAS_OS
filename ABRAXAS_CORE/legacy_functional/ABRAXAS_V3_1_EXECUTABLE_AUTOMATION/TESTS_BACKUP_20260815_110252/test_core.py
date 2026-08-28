import json, tempfile, unittest
from pathlib import Path

from abraxas.core import parse_timecode, format_timecode, stable_hash, source_fingerprint

class CoreTests(unittest.TestCase):
    def test_timecodes_round_trip(self):
        self.assertAlmostEqual(parse_timecode('01:02:03.500'), 3723.5)
        self.assertEqual(format_timecode(3723.5), '01:02:03.500')

    def test_stable_hash_ignores_dict_order(self):
        self.assertEqual(stable_hash({'a':1,'b':2}), stable_hash({'b':2,'a':1}))

    def test_source_fingerprint_changes_when_file_changes(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'source.bin'
            p.write_bytes(b'a'*10000)
            a=source_fingerprint(p, probe=False)
            p.write_bytes(b'b'*10000)
            b=source_fingerprint(p, probe=False)
            self.assertNotEqual(a['fingerprint'], b['fingerprint'])

if __name__=='__main__': unittest.main()

class LinkTests(unittest.TestCase):
    def test_materialize_named_part_creates_named_reference(self):
        from abraxas.runtime import materialize_named_part
        with tempfile.TemporaryDirectory() as d:
            src=Path(d)/'cache.mp4'; src.write_bytes(b'x')
            dst=Path(d)/'parts'/'B01.mp4'
            materialize_named_part(src,dst)
            self.assertTrue(dst.exists())
            self.assertEqual(dst.read_bytes(),b'x')
