# VAV-Captions — Internal Repository Architecture V1

Purpose:
Define the complete internal structure of VAV-Captions as a professional
software repository, with explicit domain boundaries and interoperability with
the user's Universal Content OS and future VAV tools.

Key rule:
VAV-Captions does NOT treat TXT/HTML as the canonical database.
It imports them as human/view projections and normalizes them into versioned,
validated internal contracts.

Second key rule:
There are two different concepts that must never share one ambiguous field:

1. Visual Motion Context
   Motion 00–07 / B-roll / infographic / UI visual / foreground object /
   typographic takeover.

2. Caption Motion
   Slide Blur / Pop / Fade / Scale Punch / etc. applied to subtitle typography.

They can interact, but they are different domains.
