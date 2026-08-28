import copy
import tempfile
import unittest
from pathlib import Path

from abraxas.core import balanced_fragment_ranges
from abraxas.htmlio import compile_html_pair
from abraxas.motions import build_asset_specs, compile_motion_plan, split_exact_three, verify_motion_plan, write_motion_tree
from abraxas.plan import build_part_plan


PACKAGE_ROOT=Path(__file__).resolve().parents[1]
CONTENT=PACKAGE_ROOT/'INPUT/JOC55_AMANDA_CONTENT_ENGINE_V3_1.html'
INTRO=PACKAGE_ROOT/'INPUT/JOC55_AMANDA_INTRO_LAB_V3_1.html'


class MotionV41Tests(unittest.TestCase):
    def test_balanced_fragments_redistribute_short_tail(self):
        ranges=balanced_fragment_ranges(25.0)
        durations=[end-start for start,end in ranges]
        self.assertTrue(all(4.0 <= value <= 9.0 for value in durations))
        self.assertTrue(7.0 <= sum(durations)/len(durations) <= 9.0)
        self.assertAlmostEqual(ranges[-1][1],25.0,places=3)

    def test_exact_split_never_rewrites_source(self):
        source='Tu identidad cambia cuando practicas incluso cuando todavía nadie puede ver el resultado.'
        split=split_exact_three(source)
        self.assertTrue(split['valid'])
        self.assertEqual(split['reconstructed'],source)

    def test_real_vertical_compiles_only_4_to_9_second_fragments(self):
        bundle=compile_html_pair(CONTENT,INTRO)
        sample=copy.deepcopy(bundle)
        sample['content']['verticals']=sample['content']['verticals'][:1]
        sample['content']['horizontals']=[]
        sample['intro']['intros']=[]
        part_plan=build_part_plan(sample,{'vertical':'V.mp4','horizontal':'H.mp4'},{})
        plan=compile_motion_plan(sample,part_plan,{})
        durations=[x['duration'] for x in plan['placements']]
        self.assertGreater(len(durations),1)
        self.assertTrue(all(4.0 <= value <= 9.0 for value in durations))
        self.assertTrue(7.0 <= sum(durations)/len(durations) <= 9.0)
        with tempfile.TemporaryDirectory() as temp:
            write_motion_tree(plan,temp)
            report=verify_motion_plan(plan)
            self.assertEqual(report['status'],'PASS')

    def test_motion2_tree_writes_literal_prompts_and_manifest(self):
        text='Primero observas el patrón, luego conectas la evidencia y finalmente entiendes el cambio.'
        placement={
            'content_id':'DEMO','content_family':'verticals','orientation':'vertical','assembly_variant':'SOURCE',
            'beat_id':'DEMO_SOURCE_FRAG_001','speaker':'Amanda','narrative_function':'payoff','transcript_exact':text,
            'planned_seconds':8.0,'duration':8.0,'treatment_family':'SYMBOLIC_OBJECT','timing_status':'BALANCED_4_TO_9',
            'source_in':None,'source_out':None,'timeline_in':0.0,'timeline_out':8.0,'selection_source':'TEST',
            'motion_primary':'M2','motion_alternative':'M1','name':'PROGRESSIVE_SCENE_EXACT_TEXT',
            'placement_mode':'REPLACE_VISUAL_KEEP_SOURCE_AUDIO','track':'V3','description':'test','why_motion':'test',
            'readiness':'READY_FOR_IMAGE_GENERATION','treatment':{'treatment_family':'SYMBOLIC_OBJECT','scene':'objeto físico progresivo','states':{}},
        }
        plan={'schema_version':'abraxas.motion-plan.v4.1','counts':{},'placements':[placement]}
        with tempfile.TemporaryDirectory() as temp:
            manifest=write_motion_tree(plan,temp)
            self.assertTrue(Path(manifest).is_file())
            self.assertTrue(Path(placement['asset_folder'],'PROMPT_GENERAR_ESTE_MOTION_COMPLETO.txt').is_file())
            literal=placement['motion2_literal_split']
            self.assertTrue(literal['valid'])
            self.assertEqual(literal['reconstructed'],text)
            self.assertEqual(len(placement['preferred_frame_sequence']),4)


if __name__=='__main__':
    unittest.main()
