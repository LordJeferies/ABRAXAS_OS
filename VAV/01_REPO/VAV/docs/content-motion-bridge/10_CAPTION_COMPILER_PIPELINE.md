# Caption Compiler

Inputs:
- Project/Ficha modules
- Source Media
- Transcript/Words
- EditMap
- SceneMap
- ContentIntentMap
- MotionContext[]
- Platform Profile
- Style/Structure/Behavior Profile
- Manual Overrides/Locks

Pipeline:

Words
→ Correction
→ Segmentation
→ SemanticCaption[]
→ Source-to-Timeline Projection
→ Scene Reconcile
→ Content Role Resolve
→ Motion Context Resolve
→ Caption Ownership Resolve
→ Style/Structure Visual Priors
→ Scene Smart + Motion Occupancy
→ Resolved Properties + Locks
→ VisualSegment[]
→ CaptionPlan
→ Remotion Preview/Render

Critical:
Motion Context Resolve happens BEFORE final visual placement.
That is how B-roll can allow adaptive placement while Motion 3 can take over
the typography and suppress standard captions.
