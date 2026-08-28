# Supported Workflow Orders

## A — Captions first, motions later

video
→ transcript
→ semantic captions
→ initial caption plan
→ later import Motion Manifest
→ invalidate affected visual segments only
→ recompute style/placement/visibility
→ preserve manual locks

No retranscription.

## B — Motions first, captions later

video + Motion Manifest
→ transcript
→ semantic captions
→ Caption Compiler sees motion contexts from first compile
→ correct caption response immediately

## C — Recommended scalable pipeline for long masters

LONG SOURCE VIDEO
→ transcribe/analyze once
→ source-anchored transcript
→ Content Intent / Ficha map
→ editorial cuts in Vav-cuts or another tool
→ Edit Decision Manifest / SourceMap
→ motion planning/creation
→ Motion Manifest
→ VAV-Captions final compile
→ render captions on final timeline

Recommendation:
Do analysis/transcription early.
Do final visual caption composition after editorial cuts and important visual
motions are known.

This minimizes repeated transcription without freezing layout too early.
