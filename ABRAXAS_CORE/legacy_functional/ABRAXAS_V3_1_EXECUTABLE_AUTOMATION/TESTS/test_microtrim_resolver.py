import unittest
from abraxas.microtrim import resolve_job_with_transcribers

JOB={'beat_id':'B1','content_id':'X','text':'tienes una situación opción número uno','parent_start':'00:01:40.000','parent_end':'00:01:50.000'}
WORDS=[
 {'word':'tienes','start':0.3,'end':0.6,'probability':.99}, {'word':'una','start':0.6,'end':0.8,'probability':.99},
 {'word':'situacion','start':0.8,'end':1.2,'probability':.99}, {'word':'opcion','start':1.2,'end':1.6,'probability':.99},
 {'word':'numero','start':1.6,'end':1.9,'probability':.99}, {'word':'uno','start':1.9,'end':2.2,'probability':.99},
]
class ResolverTests(unittest.TestCase):
    def test_resolver_converts_relative_to_absolute(self):
        def a(_): return WORDS
        def b(_): return [dict(w,start=w['start']+.1,end=w['end']+.1) for w in WORDS]
        r=resolve_job_with_transcribers(JOB,a,b,min_score=.75,max_delta=.5)
        self.assertTrue(r['valid'])
        self.assertAlmostEqual(r['start'],100.35,places=2)
        self.assertAlmostEqual(r['end'],102.25,places=2)

if __name__=='__main__': unittest.main()
