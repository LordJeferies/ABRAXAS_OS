# Caption Response Policies by Motion Family

These are defaults derived from the supplied Motions corpus. The instance card
can override them.

## Motion 00 — alternative camera coverage
Text ownership: caption engine.
Standard captions: visible.
Scene Smart: normal.
Special rule: re-evaluate placement at camera cut, favor continuity if still valid.

## Motion 01 — speaker/chroma + close-up/evidence background
Text ownership: caption engine.
Standard captions: visible.
Scene Smart: required/adaptive.
Avoid: dense evidence texture and speaker region.
Use: declared low-density side/negative-space regions.

## Motion 02 — progressive visual transformation + integrated text
Text ownership: hybrid / visual motion.
Integrated motion text is NOT a normal subtitle.
Default: suppress duplicate standard caption text for lines already owned by
the Motion; permit nonduplicative accessibility track separately.
Scene Smart: restricted around integrated text.

## Motion 03 — pure editorial typography
Text ownership: visual motion.
Standard captions: normally suppressed during takeover.
Do not render the same sentence as a regular caption underneath.
Placement: motion-defined. If the ficha says center-only, VAV locks center.
Caption typography should not fight the Motion 3 composition.

## Motion 04 — navigable infographic
Text ownership: caption engine unless the infographic itself owns exact text.
Scene Smart: required.
Avoid current camera-focus zone, labels/data, and high-density information.
Prefer negative space.

## Motion 05 — cinematic microsequence
Text ownership: caption engine.
Standard captions: visible by default.
Scene Smart: adaptive per shot.
Re-evaluate at each shot boundary.

## Motion 06 — digital/SaaS logic
Text ownership: caption engine unless UI carries exact sentence.
Standard captions: visible.
Scene Smart: required.
Avoid UI-critical/data regions and integrated labels.

## Motion 07 — talking head + foreground objects
Text ownership: caption engine.
Standard captions: visible and protected.
Scene Smart: required.
Hard avoid face/eyes/mouth + object trajectories + subtitle protected zone.

## Generic B-roll
Text ownership: caption engine unless B-roll contains integrated editorial text.
Standard captions: visible.
Scene Smart: required.
Placement follows scene analysis + motion occupancy map.
