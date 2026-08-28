import unittest
from abraxas.microtrim import best_text_span, consensus_resolution

WORDS=[
 {'word':'hola','start':0.0,'end':0.3,'probability':.99},
 {'word':'tienes','start':0.3,'end':0.6,'probability':.99},
 {'word':'una','start':0.6,'end':0.8,'probability':.99},
 {'word':'situacion','start':0.8,'end':1.2,'probability':.99},
 {'word':'opcion','start':1.2,'end':1.6,'probability':.99},
 {'word':'numero','start':1.6,'end':1.9,'probability':.99},
 {'word':'uno','start':1.9,'end':2.2,'probability':.99},
 {'word':'disfrutas','start':2.2,'end':2.7,'probability':.99},
]
class MicrotrimTests(unittest.TestCase):
    def test_best_span_finds_target(self):
        r=best_text_span(WORDS,'tienes una situación opción número uno')
        self.assertGreater(r['score'],.85)
        self.assertAlmostEqual(r['start'],.3)
        self.assertAlmostEqual(r['end'],2.2)

    def test_consensus_requires_close_models(self):
        a={'start':10.0,'end':14.0,'score':.92}
        b={'start':10.2,'end':14.1,'score':.90}
        r=consensus_resolution(a,b,min_score=.75,max_delta=.5)
        self.assertTrue(r['valid'])
        c={'start':11.5,'end':15.0,'score':.95}
        self.assertFalse(consensus_resolution(a,c,min_score=.75,max_delta=.5)['valid'])

if __name__=='__main__': unittest.main()
